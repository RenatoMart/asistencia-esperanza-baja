'use client';

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';

import {
	type ConsolidationNote,
	type Convertido,
	type ConvertidoStatus,
	type NewConvertidoInput,
	SEED_CONVERTIDOS,
} from './convertidos';

const STORAGE_KEY = 'idp_convertidos_v1';

interface ConvertidosContextValue {
	convertidos: Convertido[];
	addConvertido: (data: NewConvertidoInput, registeredBy?: string) => Convertido;
	getConvertido: (id: string) => Convertido | undefined;
	assignMentor: (id: string, mentorId: string | null) => void;
	setStatus: (id: string, status: ConvertidoStatus) => void;
	addNote: (id: string, note: Omit<ConsolidationNote, 'id'>) => void;
}

const ConvertidosContext = createContext<ConvertidosContextValue | null>(null);

function makeId(prefix: string): string {
	if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
		return `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
	}
	return `${prefix}_${Date.now().toString(36)}`;
}

function todayIso(): string {
	return new Date().toISOString().slice(0, 10);
}

export function ConvertidosProvider({ children }: { children: React.ReactNode }) {
	// SSR y primer render de cliente usan la semilla (deterministas → sin hydration mismatch).
	// Tras montar, se hidrata desde localStorage si existe.
	const [convertidos, setConvertidos] = useState<Convertido[]>(SEED_CONVERTIDOS);

	useEffect(() => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) setConvertidos(JSON.parse(raw) as Convertido[]);
		} catch {
			// Ignorar almacenamiento corrupto: se mantiene la semilla.
		}
	}, []);

	useEffect(() => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(convertidos));
		} catch {
			// Sin persistencia disponible: el estado sigue vivo en memoria.
		}
	}, [convertidos]);

	const addConvertido = useCallback(
		(data: NewConvertidoInput, registeredBy = 'Admin') => {
			const nuevo: Convertido = {
				id: makeId('c'),
				fullName: data.fullName.trim(),
				age: data.age,
				phone: data.phone.trim(),
				address: data.address.trim(),
				notes: data.notes.trim(),
				dateRegistered: todayIso(),
				registeredBy,
				mentorId: null,
				status: 'nuevo',
				consolidation: [],
			};
			setConvertidos((prev) => [nuevo, ...prev]);
			return nuevo;
		},
		[],
	);

	const getConvertido = useCallback(
		(id: string) => convertidos.find((c) => c.id === id),
		[convertidos],
	);

	const assignMentor = useCallback((id: string, mentorId: string | null) => {
		setConvertidos((prev) =>
			prev.map((c) =>
				c.id === id
					? {
							...c,
							mentorId,
							// Al asignar el primer mentor, avanza de 'nuevo' a 'en consolidación'.
							status: mentorId && c.status === 'nuevo' ? 'proceso' : c.status,
						}
					: c,
			),
		);
	}, []);

	const setStatus = useCallback((id: string, status: ConvertidoStatus) => {
		setConvertidos((prev) =>
			prev.map((c) => (c.id === id ? { ...c, status } : c)),
		);
	}, []);

	const addNote = useCallback((id: string, note: Omit<ConsolidationNote, 'id'>) => {
		setConvertidos((prev) =>
			prev.map((c) =>
				c.id === id
					? { ...c, consolidation: [{ ...note, id: makeId('n') }, ...c.consolidation] }
					: c,
			),
		);
	}, []);

	const value = useMemo(
		() => ({
			convertidos,
			addConvertido,
			getConvertido,
			assignMentor,
			setStatus,
			addNote,
		}),
		[convertidos, addConvertido, getConvertido, assignMentor, setStatus, addNote],
	);

	return (
		<ConvertidosContext.Provider value={value}>{children}</ConvertidosContext.Provider>
	);
}

export function useConvertidos(): ConvertidosContextValue {
	const ctx = useContext(ConvertidosContext);
	if (!ctx) {
		throw new Error('useConvertidos debe usarse dentro de <ConvertidosProvider>');
	}
	return ctx;
}

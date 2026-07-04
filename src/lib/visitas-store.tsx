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
	type FollowUp,
	type NewVisitaInput,
	SEED_VISITAS,
	type Visita,
	type VisitaStatus,
} from './visitas';

const STORAGE_KEY = 'idp_visitas_v1';

interface VisitasContextValue {
	visitas: Visita[];
	addVisita: (data: NewVisitaInput, registeredBy?: string) => Visita;
	getVisita: (id: string) => Visita | undefined;
	assignResponsable: (id: string, responsableId: string | null) => void;
	setStatus: (id: string, status: VisitaStatus) => void;
	addFollowUp: (id: string, note: Omit<FollowUp, 'id'>) => void;
}

const VisitasContext = createContext<VisitasContextValue | null>(null);

function makeId(prefix: string): string {
	if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
		return `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
	}
	return `${prefix}_${Date.now().toString(36)}`;
}

function todayIso(): string {
	return new Date().toISOString().slice(0, 10);
}

export function VisitasProvider({ children }: { children: React.ReactNode }) {
	const [visitas, setVisitas] = useState<Visita[]>(SEED_VISITAS);

	useEffect(() => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) setVisitas(JSON.parse(raw) as Visita[]);
		} catch {
			// Se mantiene la semilla si el almacenamiento está corrupto.
		}
	}, []);

	useEffect(() => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(visitas));
		} catch {
			// Sin persistencia disponible: el estado sigue en memoria.
		}
	}, [visitas]);

	const addVisita = useCallback((data: NewVisitaInput, registeredBy = 'Admin') => {
		const nueva: Visita = {
			id: makeId('v'),
			fullName: data.fullName.trim(),
			phone: data.phone.trim(),
			email: data.email.trim(),
			invitedBy: data.invitedBy.trim(),
			ministryInterest: data.ministryInterest,
			notes: data.notes.trim(),
			dateRegistered: todayIso(),
			registeredBy,
			assignedTo: null,
			status: 'nueva',
			followUps: [],
		};
		setVisitas((prev) => [nueva, ...prev]);
		return nueva;
	}, []);

	const getVisita = useCallback(
		(id: string) => visitas.find((v) => v.id === id),
		[visitas],
	);

	const assignResponsable = useCallback((id: string, responsableId: string | null) => {
		setVisitas((prev) =>
			prev.map((v) =>
				v.id === id
					? {
							...v,
							assignedTo: responsableId,
							// Al asignar responsable, la visita pasa de 'nueva' a 'en seguimiento'.
							status:
								responsableId && v.status === 'nueva' ? 'seguimiento' : v.status,
						}
					: v,
			),
		);
	}, []);

	const setStatus = useCallback((id: string, status: VisitaStatus) => {
		setVisitas((prev) => prev.map((v) => (v.id === id ? { ...v, status } : v)));
	}, []);

	const addFollowUp = useCallback((id: string, note: Omit<FollowUp, 'id'>) => {
		setVisitas((prev) =>
			prev.map((v) =>
				v.id === id
					? { ...v, followUps: [{ ...note, id: makeId('f') }, ...v.followUps] }
					: v,
			),
		);
	}, []);

	const value = useMemo(
		() => ({
			visitas,
			addVisita,
			getVisita,
			assignResponsable,
			setStatus,
			addFollowUp,
		}),
		[visitas, addVisita, getVisita, assignResponsable, setStatus, addFollowUp],
	);

	return <VisitasContext.Provider value={value}>{children}</VisitasContext.Provider>;
}

export function useVisitas(): VisitasContextValue {
	const ctx = useContext(VisitasContext);
	if (!ctx) {
		throw new Error('useVisitas debe usarse dentro de <VisitasProvider>');
	}
	return ctx;
}

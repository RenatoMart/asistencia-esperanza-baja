'use client';

import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';

import { createSeedMembers, type Member } from './miembros';

const STORAGE_KEY = 'idp_miembros_v1';

export type NewMemberInput = Pick<
	Member,
	'name' | 'email' | 'phone' | 'ministry' | 'tipo' | 'status' | 'category'
>;

interface MiembrosContextValue {
	members: Member[];
	getMember: (id: string) => Member | undefined;
	updateMember: (id: string, patch: Partial<Member>) => void;
	addMember: (data: NewMemberInput) => Member;
}

const MiembrosContext = createContext<MiembrosContextValue | null>(null);

function makeId(): string {
	// ID numérico de 5 dígitos, estilo directorio.
	return String(Math.floor(10000 + Math.random() * 89999));
}

function todayIso(): string {
	return new Date().toISOString().slice(0, 10);
}

export function MiembrosProvider({ children }: { children: React.ReactNode }) {
	const [members, setMembers] = useState<Member[]>(createSeedMembers);

	useEffect(() => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) setMembers(JSON.parse(raw) as Member[]);
		} catch {
			// Se mantiene la semilla si el almacenamiento está corrupto.
		}
	}, []);

	useEffect(() => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
		} catch {
			// Sin persistencia disponible: el estado sigue en memoria.
		}
	}, [members]);

	const getMember = useCallback(
		(id: string) => members.find((m) => m.id === id),
		[members],
	);

	const updateMember = useCallback((id: string, patch: Partial<Member>) => {
		setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
	}, []);

	const addMember = useCallback((data: NewMemberInput) => {
		const nuevo: Member = {
			id: makeId(),
			name: data.name.trim(),
			email: data.email.trim(),
			phone: data.phone.trim(),
			address: '',
			birthdate: '',
			baptismDate: '',
			ministry: data.ministry,
			tipo: data.tipo,
			status: data.status,
			category: data.category,
			joined: todayIso(),
			notes: '',
			attendance: [],
		};
		setMembers((prev) => [nuevo, ...prev]);
		return nuevo;
	}, []);

	const value = useMemo(
		() => ({ members, getMember, updateMember, addMember }),
		[members, getMember, updateMember, addMember],
	);

	return <MiembrosContext.Provider value={value}>{children}</MiembrosContext.Provider>;
}

export function useMiembros(): MiembrosContextValue {
	const ctx = useContext(MiembrosContext);
	if (!ctx) {
		throw new Error('useMiembros debe usarse dentro de <MiembrosProvider>');
	}
	return ctx;
}

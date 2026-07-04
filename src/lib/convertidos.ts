// Modelo de datos y catálogos para el módulo de Nuevos Convertidos / Consolidación.
// No hay backend todavía: los datos viven en el store con persistencia en localStorage
// (ver convertidos-store.tsx). Este archivo concentra tipos, semilla y utilidades puras.

// Re-exportados para compatibilidad con los imports existentes del módulo.
export { groupByDate, initials, relativeDateLabel } from './format';
export type { DateGroup } from './format';

export type ConvertidoStatus = 'nuevo' | 'proceso' | 'consolidado';

export type NoteType = 'reunion' | 'nota' | 'llamada';

export interface ConsolidationNote {
	id: string;
	date: string; // ISO 'YYYY-MM-DD'
	author: string; // nombre del mentor / líder que registró
	type: NoteType;
	text: string;
}

export interface Convertido {
	id: string;
	fullName: string;
	age: number | null;
	phone: string;
	address: string;
	notes: string;
	dateRegistered: string; // ISO 'YYYY-MM-DD'
	registeredBy: string;
	mentorId: string | null;
	status: ConvertidoStatus;
	consolidation: ConsolidationNote[];
}

export type NewConvertidoInput = {
	fullName: string;
	age: number | null;
	phone: string;
	address: string;
	notes: string;
};

// Solo el equipo de mentoreo y los líderes pueden ser mentores.
export interface Mentor {
	id: string;
	name: string;
	role: 'lider' | 'mentoreo';
	ministry: string;
}

export const MENTORS: Mentor[] = [
	{ id: 'm1', name: 'Carlos Rivera', role: 'lider', ministry: 'Caballeros' },
	{ id: 'm2', name: 'Maria Gonzalez', role: 'lider', ministry: 'Damas' },
	{ id: 'm3', name: 'David Reyes', role: 'lider', ministry: 'Jóvenes' },
	{ id: 'm4', name: 'Ana Ramírez', role: 'mentoreo', ministry: 'Consolidación' },
	{ id: 'm5', name: 'Sofía Torres', role: 'mentoreo', ministry: 'Consolidación' },
	{ id: 'm6', name: 'Miguel Vargas', role: 'mentoreo', ministry: 'Consolidación' },
];

export const STATUS_META: Record<
	ConvertidoStatus,
	{ label: string; chip: string; dot: string }
> = {
	nuevo: {
		label: 'Nuevo',
		chip: 'bg-primary-container text-on-primary-container',
		dot: 'bg-primary',
	},
	proceso: {
		label: 'En consolidación',
		chip: 'bg-secondary-container text-on-secondary-container',
		dot: 'bg-secondary',
	},
	consolidado: {
		label: 'Consolidado',
		chip: 'bg-tertiary-container text-on-tertiary-container',
		dot: 'bg-tertiary',
	},
};

export const NOTE_META: Record<NoteType, { label: string; icon: string }> = {
	reunion: { label: 'Reunión', icon: 'groups' },
	llamada: { label: 'Llamada', icon: 'call' },
	nota: { label: 'Apunte', icon: 'sticky_note_2' },
};

export const SEED_CONVERTIDOS: Convertido[] = [
	{
		id: 'c1',
		fullName: 'Rosa Mendoza Quispe',
		age: 34,
		phone: '987 654 321',
		address: 'Av. Los Álamos 245, Esperanza Baja',
		notes: 'Llegó invitada por su vecina. Muy receptiva, tiene dos hijos pequeños.',
		dateRegistered: '2026-07-04',
		registeredBy: 'Carlos Rivera',
		mentorId: null,
		status: 'nuevo',
		consolidation: [],
	},
	{
		id: 'c2',
		fullName: 'Luis Fernando Paredes',
		age: 21,
		phone: '999 112 233',
		address: 'Jr. Unión 88, Alto Trujillo',
		notes: 'Vino al culto de jóvenes. Interesado en el ministerio de alabanza.',
		dateRegistered: '2026-07-04',
		registeredBy: 'David Reyes',
		mentorId: 'm5',
		status: 'proceso',
		consolidation: [
			{
				id: 'n1',
				date: '2026-07-05',
				author: 'Sofía Torres',
				type: 'llamada',
				text: 'Primera llamada de seguimiento. Confirmó asistencia al próximo GDC.',
			},
		],
	},
	{
		id: 'c3',
		fullName: 'Carmen Rosa Díaz',
		age: 47,
		phone: '955 443 221',
		address: 'Calle Las Flores 12, Pampas de San Juan',
		notes: 'Reconciliación. Ya había congregado hace años.',
		dateRegistered: '2026-06-28',
		registeredBy: 'Maria Gonzalez',
		mentorId: 'm4',
		status: 'proceso',
		consolidation: [
			{
				id: 'n2',
				date: '2026-06-29',
				author: 'Ana Ramírez',
				type: 'reunion',
				text: 'Reunión de consolidación en su casa. Compartimos el estudio 1.',
			},
			{
				id: 'n3',
				date: '2026-07-03',
				author: 'Ana Ramírez',
				type: 'nota',
				text: 'Está avanzando bien. Pendiente presentarla al grupo de damas.',
			},
		],
	},
	{
		id: 'c4',
		fullName: 'Jorge Huamán Ríos',
		age: 29,
		phone: '941 887 665',
		address: 'Av. Perú 501, Víctor Raúl',
		notes: 'Aceptó a Cristo en la campaña. Trabaja de noche, coordinar horarios.',
		dateRegistered: '2026-06-21',
		registeredBy: 'Carlos Rivera',
		mentorId: 'm6',
		status: 'consolidado',
		consolidation: [
			{
				id: 'n4',
				date: '2026-06-24',
				author: 'Miguel Vargas',
				type: 'reunion',
				text: 'Completó los 4 estudios de consolidación. Bautismo agendado.',
			},
		],
	},
];

export function getMentor(mentorId: string | null): Mentor | undefined {
	if (!mentorId) return undefined;
	return MENTORS.find((m) => m.id === mentorId);
}

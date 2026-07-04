// Modelo de datos y catálogos para el módulo de Visitas / Seguimiento.
// Paralelo a convertidos.ts. Los responsables de seguimiento son los mismos
// líderes y equipo (MENTORS), reutilizados desde el módulo de convertidos.

import { MENTORS, type Mentor } from './convertidos';

export { groupByDate, initials, relativeDateLabel } from './format';
export type { DateGroup } from './format';

export type VisitaStatus = 'nueva' | 'seguimiento' | 'integrada' | 'inactiva';

export type FollowUpType = 'llamada' | 'mensaje' | 'visita' | 'nota';

export interface FollowUp {
	id: string;
	date: string; // ISO 'YYYY-MM-DD'
	author: string;
	type: FollowUpType;
	text: string;
}

export interface Visita {
	id: string;
	fullName: string;
	phone: string;
	email: string;
	invitedBy: string;
	ministryInterest: string;
	notes: string;
	dateRegistered: string; // ISO 'YYYY-MM-DD'
	registeredBy: string;
	assignedTo: string | null; // id de MENTORS (responsable de seguimiento)
	status: VisitaStatus;
	followUps: FollowUp[];
}

export type NewVisitaInput = {
	fullName: string;
	phone: string;
	email: string;
	invitedBy: string;
	ministryInterest: string;
	notes: string;
};

// Los responsables de seguimiento son los líderes y el equipo (mismo catálogo).
export const RESPONSABLES: Mentor[] = MENTORS;

export function getResponsable(id: string | null): Mentor | undefined {
	if (!id) return undefined;
	return RESPONSABLES.find((m) => m.id === id);
}

export const VISITA_STATUS_META: Record<
	VisitaStatus,
	{ label: string; chip: string; dot: string }
> = {
	nueva: {
		label: 'Nueva',
		chip: 'bg-secondary-container text-on-secondary-container',
		dot: 'bg-secondary',
	},
	seguimiento: {
		label: 'En seguimiento',
		chip: 'bg-primary-container text-on-primary-container',
		dot: 'bg-primary',
	},
	integrada: {
		label: 'Integrada',
		chip: 'bg-tertiary-container text-on-tertiary-container',
		dot: 'bg-tertiary',
	},
	inactiva: {
		label: 'Sin respuesta',
		chip: 'bg-surface-container-high text-on-surface-variant',
		dot: 'bg-outline',
	},
};

export const FOLLOWUP_META: Record<FollowUpType, { label: string; icon: string }> = {
	llamada: { label: 'Llamada', icon: 'call' },
	mensaje: { label: 'Mensaje', icon: 'chat' },
	visita: { label: 'Visita', icon: 'home' },
	nota: { label: 'Apunte', icon: 'sticky_note_2' },
};

export const MINISTRIES_LIST = [
	'EsLider',
	'Oración',
	'Caballeros',
	'Damas',
	'Jóvenes',
	'Adolescentes',
	'Niños',
	'Mayordomía',
	'Servicio Social',
	'Evangelismo',
	'GDC Jóvenes',
	'GDC Adolescentes',
	'Campo Víctor Raúl',
	'Campo Alto Trujillo',
	'Campo Pampas de San Juan',
];

export const SEED_VISITAS: Visita[] = [
	{
		id: 'v1',
		fullName: 'Patricia Salazar Núñez',
		phone: '986 221 447',
		email: '',
		invitedBy: 'Lucía Vega',
		ministryInterest: 'Damas',
		notes: 'Vino al culto del domingo con su hija. Se mostró muy interesada.',
		dateRegistered: '2026-07-04',
		registeredBy: 'Maria Gonzalez',
		assignedTo: null,
		status: 'nueva',
		followUps: [],
	},
	{
		id: 'v2',
		fullName: 'Kevin Alarcón',
		phone: '921 556 300',
		email: 'kevin.a@email.com',
		invitedBy: 'Luis Paredes',
		ministryInterest: 'Jóvenes',
		notes: 'Amigo de la universidad. Le gustó la alabanza.',
		dateRegistered: '2026-07-01',
		registeredBy: 'David Reyes',
		assignedTo: 'm3',
		status: 'seguimiento',
		followUps: [
			{
				id: 'f1',
				date: '2026-07-02',
				author: 'David Reyes',
				type: 'mensaje',
				text: 'Le escribí por WhatsApp. Confirmó que viene al GDC del viernes.',
			},
		],
	},
	{
		id: 'v3',
		fullName: 'Elena Ríos Campos',
		phone: '955 010 202',
		email: '',
		invitedBy: 'Carmen Díaz',
		ministryInterest: '',
		notes: 'Adulta mayor, vive sola cerca del templo.',
		dateRegistered: '2026-06-27',
		registeredBy: 'Ana Ramírez',
		assignedTo: 'm5',
		status: 'seguimiento',
		followUps: [
			{
				id: 'f2',
				date: '2026-06-28',
				author: 'Sofía Torres',
				type: 'visita',
				text: 'Visita a su casa. Oramos juntas. Quiere seguir asistiendo.',
			},
			{
				id: 'f3',
				date: '2026-07-03',
				author: 'Sofía Torres',
				type: 'llamada',
				text: 'Llamada de saludo. Coordinamos llevarla el domingo.',
			},
		],
	},
	{
		id: 'v4',
		fullName: 'Bryan Mendoza',
		phone: '900 334 556',
		email: '',
		invitedBy: 'Campaña',
		ministryInterest: 'Adolescentes',
		notes: 'Dejó sus datos en la campaña. No contesta llamadas aún.',
		dateRegistered: '2026-06-20',
		registeredBy: 'Admin',
		assignedTo: 'm4',
		status: 'inactiva',
		followUps: [
			{
				id: 'f4',
				date: '2026-06-22',
				author: 'Ana Ramírez',
				type: 'llamada',
				text: 'No contestó. Intentaré de nuevo el fin de semana.',
			},
		],
	},
];

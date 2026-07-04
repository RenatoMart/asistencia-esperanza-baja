// Modelo de datos del directorio de la congregación.
// Cada miembro tiene su historial de asistencia para la vista de calendario personal.

import { toLocalIso } from './format';

export { groupByDate, initials, relativeDateLabel, toLocalIso } from './format';

// TIPO: solo 4 clasificaciones. Los detalles (bautizado, fecha, etc.) van en la ficha.
export type MemberType = 'Miembro' | 'Creyente' | 'Visitante' | 'Convertido';

// ESTADO: nivel de participación según su asistencia.
export type MemberStatus = 'activo' | 'regular' | 'ocasional' | 'nuevo' | 'inactivo';

// CATEGORÍA: agrupación para las pestañas del directorio.
export type MemberCategory =
	| 'lider'
	| 'directiva'
	| 'miembro'
	| 'congregante'
	| 'visita'
	| 'convertido';

export type AttendanceKind = 'culto' | 'ministerio' | 'evento';

export interface AttendanceRecord {
	date: string; // ISO 'YYYY-MM-DD'
	label: string;
	ministry?: string;
	kind: AttendanceKind;
}

export interface Member {
	id: string;
	name: string;
	email: string;
	phone: string;
	address: string;
	birthdate: string;
	baptismDate: string;
	ministry: string | null;
	tipo: MemberType;
	status: MemberStatus;
	category: MemberCategory;
	joined: string;
	notes: string;
	attendance: AttendanceRecord[];
}

export const TIPO_META: Record<MemberType, { badge: string; dot: string }> = {
	Miembro: {
		badge: 'bg-tertiary-fixed text-on-tertiary-fixed border border-tertiary-fixed-dim',
		dot: 'bg-tertiary',
	},
	Creyente: {
		badge: 'bg-primary-container text-on-primary-container border border-primary-fixed-dim',
		dot: 'bg-primary',
	},
	Visitante: {
		badge: 'bg-secondary-container text-on-secondary-container border border-secondary-fixed-dim',
		dot: 'bg-secondary',
	},
	Convertido: {
		badge: 'bg-primary-fixed text-on-primary-fixed border border-primary-fixed-dim',
		dot: 'bg-primary-fixed-dim',
	},
};

export const STATUS_META: Record<
	MemberStatus,
	{ label: string; badge: string; dot: string }
> = {
	activo: {
		label: 'Activo',
		badge: 'bg-tertiary-container text-on-tertiary-container',
		dot: 'bg-tertiary',
	},
	regular: {
		label: 'Regular',
		badge: 'bg-primary-container text-on-primary-container',
		dot: 'bg-primary',
	},
	ocasional: {
		label: 'Ocasional',
		badge: 'bg-secondary-container text-on-secondary-container',
		dot: 'bg-secondary',
	},
	nuevo: {
		label: 'Nuevo',
		badge: 'bg-primary-fixed text-on-primary-fixed',
		dot: 'bg-primary-fixed-dim',
	},
	inactivo: {
		label: 'Inactivo',
		badge: 'bg-surface-container-high text-on-surface-variant',
		dot: 'bg-outline',
	},
};

export const CATEGORY_META: Record<MemberCategory, { label: string; plural: string }> = {
	lider: { label: 'Líder', plural: 'Líderes' },
	directiva: { label: 'Directiva', plural: 'Directiva' },
	miembro: { label: 'Miembro', plural: 'Miembros' },
	congregante: { label: 'Congregante', plural: 'Congregantes' },
	visita: { label: 'Visita', plural: 'Visitas' },
	convertido: { label: 'Nuevo convertido', plural: 'Nuevos convertidos' },
};

// Orden de las pestañas del directorio.
export const CATEGORY_ORDER: MemberCategory[] = [
	'lider',
	'directiva',
	'miembro',
	'congregante',
	'visita',
	'convertido',
];

export const STATUS_ORDER: MemberStatus[] = [
	'activo',
	'regular',
	'ocasional',
	'nuevo',
	'inactivo',
];

export const TIPO_ORDER: MemberType[] = [
	'Miembro',
	'Creyente',
	'Visitante',
	'Convertido',
];

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
];

// Genera un historial de asistencia plausible y determinista (sin azar, para no
// romper la hidratación SSR). regularity: 0 (nunca) … 4 (muy constante).
function genAttendance(
	offset: number,
	regularity: number,
	ministry: string | null,
): AttendanceRecord[] {
	if (regularity <= 0) return [];
	const today = new Date();
	const out: AttendanceRecord[] = [];
	for (let i = 0; i <= 80; i++) {
		const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
		const dow = d.getDay();
		const iso = toLocalIso(d);
		const week = Math.floor(i / 7);
		// Domingo: Culto Central (los nuevos solo asisten a las semanas recientes).
		if (dow === 0) {
			const gap = Math.max(1, 5 - regularity);
			const recentOnly = regularity <= 2 ? week < 5 : true;
			if (recentOnly && (regularity >= 4 || (week + offset) % gap === 0)) {
				out.push({ date: iso, label: 'Culto Central', kind: 'culto' });
			}
		}
		// Jueves: reunión de su ministerio (si es constante y tiene ministerio).
		if (dow === 4 && ministry && regularity >= 3 && (week + offset) % 2 === 0) {
			out.push({ date: iso, label: ministry, ministry, kind: 'ministerio' });
		}
		// Miércoles: Oración (solo los muy constantes).
		if (dow === 3 && regularity >= 4 && (week + offset) % 2 === 1) {
			out.push({ date: iso, label: 'Oración', kind: 'ministerio' });
		}
	}
	return out;
}

const REGULARITY: Record<MemberStatus, number> = {
	activo: 4,
	regular: 3,
	ocasional: 2,
	nuevo: 2,
	inactivo: 0,
};

interface SeedInput {
	id: string;
	name: string;
	email: string;
	phone: string;
	address: string;
	birthdate: string;
	baptismDate: string;
	ministry: string | null;
	tipo: MemberType;
	status: MemberStatus;
	category: MemberCategory;
	joined: string;
	notes: string;
}

function buildMember(s: SeedInput, offset: number): Member {
	return {
		...s,
		attendance: genAttendance(offset, REGULARITY[s.status], s.ministry),
	};
}

const SEED_INPUT: SeedInput[] = [
	{
		id: '00492',
		name: 'Carlos Mendoza',
		email: 'carlos.m@email.com',
		phone: '+51 987 654 321',
		address: 'Av. Esperanza 123, Esperanza Baja',
		birthdate: '1985-06-12',
		baptismDate: '2019-04-15',
		ministry: 'Caballeros',
		tipo: 'Miembro',
		status: 'activo',
		category: 'lider',
		joined: '2019-03-12',
		notes: 'Líder del ministerio de Caballeros. Disponible para consolidación.',
	},
	{
		id: '01024',
		name: 'Ana Ramírez',
		email: 'ana.ramirez@email.com',
		phone: '+51 987 111 222',
		address: 'Jr. Los Pinos 45',
		birthdate: '1990-11-03',
		baptismDate: '2021-02-10',
		ministry: 'EsLider',
		tipo: 'Miembro',
		status: 'activo',
		category: 'directiva',
		joined: '2021-01-05',
		notes: 'Coordinadora del equipo de mentoreo.',
	},
	{
		id: '00891',
		name: 'Sofia Torres',
		email: 'sofia.t@email.com',
		phone: '+51 622 456 789',
		address: 'Calle Las Flores 12',
		birthdate: '1993-02-20',
		baptismDate: '2020-03-05',
		ministry: 'Damas',
		tipo: 'Miembro',
		status: 'activo',
		category: 'lider',
		joined: '2020-02-22',
		notes: '',
	},
	{
		id: '01566',
		name: 'Lucía Vega',
		email: 'l.vega@email.com',
		phone: '+51 965 112 233',
		address: 'Av. Perú 88',
		birthdate: '2001-08-18',
		baptismDate: '',
		ministry: 'Jóvenes',
		tipo: 'Creyente',
		status: 'regular',
		category: 'miembro',
		joined: '2023-08-18',
		notes: 'Activa en el ministerio de jóvenes.',
	},
	{
		id: '02041',
		name: 'Juan Pérez',
		email: 'j.perez@email.com',
		phone: '+51 945 000 111',
		address: 'Jr. Unión 340',
		birthdate: '1998-04-09',
		baptismDate: '',
		ministry: 'Jóvenes',
		tipo: 'Creyente',
		status: 'regular',
		category: 'congregante',
		joined: '2024-09-03',
		notes: '',
	},
	{
		id: '00214',
		name: 'Miguel Ortiz',
		email: 'mortiz88@email.com',
		phone: 'No disponible',
		address: '',
		birthdate: '1975-01-30',
		baptismDate: '2010-05-20',
		ministry: null,
		tipo: 'Miembro',
		status: 'inactivo',
		category: 'miembro',
		joined: '2018-11-10',
		notes: 'No asiste hace varios meses. Pendiente visita de restauración.',
	},
	{
		id: '02188',
		name: 'David Reyes',
		email: 'd.reyes@email.com',
		phone: '+51 987 777 888',
		address: 'Av. Los Álamos 501',
		birthdate: '1996-07-14',
		baptismDate: '',
		ministry: 'Jóvenes',
		tipo: 'Creyente',
		status: 'ocasional',
		category: 'congregante',
		joined: '2024-11-02',
		notes: '',
	},
	{
		id: '02105',
		name: 'Rosa Huanca',
		email: '',
		phone: '+51 912 333 444',
		address: 'Pampas de San Juan Mz. C',
		birthdate: '1988-09-25',
		baptismDate: '',
		ministry: null,
		tipo: 'Visitante',
		status: 'ocasional',
		category: 'visita',
		joined: '2024-10-17',
		notes: 'Vino invitada. Interesada en el ministerio de damas.',
	},
	{
		id: '02210',
		name: 'Kevin Alarcón',
		email: 'kevin.a@email.com',
		phone: '+51 921 556 300',
		address: 'Alto Trujillo Sec. 4',
		birthdate: '2003-03-11',
		baptismDate: '',
		ministry: null,
		tipo: 'Visitante',
		status: 'nuevo',
		category: 'visita',
		joined: '2026-06-28',
		notes: 'Amigo de la universidad de un joven de la iglesia.',
	},
	{
		id: '02233',
		name: 'Rosa Mendoza Quispe',
		email: '',
		phone: '+51 987 654 321',
		address: 'Av. Los Álamos 245',
		birthdate: '1992-05-02',
		baptismDate: '',
		ministry: null,
		tipo: 'Convertido',
		status: 'nuevo',
		category: 'convertido',
		joined: '2026-07-04',
		notes: 'Nueva conversión. En proceso de consolidación.',
	},
	{
		id: '00777',
		name: 'Pastor Julio Campos',
		email: 'pastor.julio@email.com',
		phone: '+51 999 000 111',
		address: 'Casa Pastoral',
		birthdate: '1968-12-01',
		baptismDate: '1990-01-14',
		ministry: 'EsLider',
		tipo: 'Miembro',
		status: 'activo',
		category: 'directiva',
		joined: '1995-01-01',
		notes: 'Pastor principal.',
	},
];

// Se genera bajo demanda (no a nivel de módulo) para que el historial de asistencia,
// que depende de la fecha actual, se calcule con el mismo "hoy" en SSR y en cliente.
export function createSeedMembers(): Member[] {
	return SEED_INPUT.map((s, i) => buildMember(s, i));
}

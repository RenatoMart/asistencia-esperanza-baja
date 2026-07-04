'use client';

import Link from 'next/link';
import { useState } from 'react';

import { useConvertidos } from '@/lib/convertidos-store';
import { useVisitas } from '@/lib/visitas-store';

type AttStatus = 'present' | 'absent' | 'excused';
type Section = 'lider' | 'equipo' | 'congregante';

interface AttMember {
	id: string;
	initials: string;
	name: string;
	ministry: string;
	section: Section;
	role: string;
	bg: string;
}

interface VisitForm {
	name: string;
	phone: string;
	email: string;
	invitedBy: string;
	ministryInterest: string;
	notes: string;
}

interface ConvertForm {
	fullName: string;
	age: string;
	phone: string;
	address: string;
	notes: string;
}

// Day-of-week auto-suggestion
const DAY_SCHEDULE: Record<number, { event: string; ministry: string; chip: string }> = {
	1: { event: 'Sin culto programado', ministry: '—', chip: 'bg-surface-container text-on-surface-variant' },
	2: { event: 'Culto EsLider', ministry: 'EsLider', chip: 'bg-primary-container text-on-primary-container' },
	3: { event: 'Ministerio de Oración', ministry: 'Oración', chip: 'bg-tertiary-container text-on-tertiary-container' },
	4: { event: 'Culto Jueves', ministry: 'Caballeros / Damas', chip: 'bg-secondary-container text-on-secondary-container' },
	5: { event: 'GDC — Grupos Dinámicos de Crecimiento', ministry: 'GDC', chip: 'bg-error-container text-on-error-container' },
	6: { event: 'Culto Ministerial', ministry: 'Jóvenes / Adolescentes / Niños', chip: 'bg-primary-fixed text-on-primary-fixed' },
	0: { event: 'Culto Central', ministry: 'Congregación General', chip: 'bg-surface-container text-on-surface' },
};

const DAY_ES = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];

const ROSTER: AttMember[] = [
	{ id: '1', initials: 'CR', name: 'Carlos Rivera', ministry: 'Caballeros', section: 'lider', role: 'Líder', bg: 'bg-primary-container text-on-primary-container' },
	{ id: '2', initials: 'MG', name: 'Maria Gonzalez', ministry: 'Damas', section: 'lider', role: 'Líder', bg: 'bg-tertiary-container text-on-tertiary-container' },
	{ id: '3', initials: 'DC', name: 'David Chen', ministry: 'Caballeros', section: 'equipo', role: 'Sub-líder', bg: 'bg-secondary-container text-on-secondary-container' },
	{ id: '4', initials: 'ST', name: 'Sofia Torres', ministry: 'Damas', section: 'equipo', role: 'Sub-líder', bg: 'bg-tertiary-container text-on-tertiary-container' },
	{ id: '5', initials: 'JS', name: 'John Smith', ministry: 'Caballeros', section: 'equipo', role: 'Ayudante', bg: 'bg-surface-variant text-on-surface-variant' },
	{ id: '6', initials: 'LV', name: 'Lucía Vega', ministry: 'Damas', section: 'congregante', role: 'Miembro', bg: 'bg-primary-container text-on-primary-container' },
	{ id: '7', initials: 'MR', name: 'Miguel Ramos', ministry: 'Caballeros', section: 'congregante', role: 'Miembro', bg: 'bg-surface-variant text-on-surface-variant' },
	{ id: '8', initials: 'AR', name: 'Ana Ramírez', ministry: 'EsLider', section: 'congregante', role: 'Miembro', bg: 'bg-secondary-container text-on-secondary-container' },
];

const SECTION_LABELS: Record<Section, { label: string; icon: string; badge: string }> = {
	lider: { label: 'Líderes', icon: 'person_pin', badge: 'bg-primary-container text-on-primary-container' },
	equipo: { label: 'Equipo del Ministerio', icon: 'groups', badge: 'bg-tertiary-container text-on-tertiary-container' },
	congregante: { label: 'Congregantes', icon: 'people', badge: 'bg-surface-container text-on-surface-variant' },
};

// Ausente es el estado por defecto: neutro visualmente para no alarmar.
// Presente y Justificado tiñen la fila como confirmación positiva del registro.
const STATUS_CONFIG: Record<
	AttStatus,
	{ label: string; short: string; icon: string; active: string; rowTint: string }
> = {
	present: {
		label: 'Presente',
		short: 'Presente',
		icon: 'check_circle',
		active: 'bg-tertiary-container text-on-tertiary-container',
		rowTint: 'bg-tertiary-fixed/15',
	},
	absent: {
		label: 'Ausente',
		short: 'Ausente',
		icon: 'cancel',
		active: 'bg-error-container text-error',
		rowTint: 'bg-white',
	},
	excused: {
		label: 'Justificado',
		short: 'Justif.',
		icon: 'event_busy',
		active: 'bg-secondary-container text-on-secondary-container',
		rowTint: 'bg-secondary-container/15',
	},
};

const STATUS_ORDER: AttStatus[] = ['present', 'absent', 'excused'];

const MINISTRIES_LIST = ['EsLider','Oración','Caballeros','Damas','Jóvenes','Adolescentes','Niños','Mayordomía','Servicio Social','Evangelismo','GDC Jóvenes','GDC Adolescentes','Campo Víctor Raúl','Campo Alto Trujillo','Campo Pampas de San Juan'];

const emptyVisit: VisitForm = { name: '', phone: '', email: '', invitedBy: '', ministryInterest: '', notes: '' };

const emptyConvert: ConvertForm = { fullName: '', age: '', phone: '', address: '', notes: '' };

export default function AsistenciaPage() {
	const today = new Date();
	const dow = today.getDay();
	const suggestion = DAY_SCHEDULE[dow] ?? DAY_SCHEDULE[1];

	// Todos arrancan como 'ausente' por defecto; el líder confirma presente/justificado.
	const [attendance, setAttendance] = useState<Record<string, AttStatus>>({});
	const [selectedEvent, setSelectedEvent] = useState(suggestion.event);
	const [search, setSearch] = useState('');
	const { visitas, addVisita } = useVisitas();
	const [isVisitModal, setIsVisitModal] = useState(false);
	const [visitForm, setVisitForm] = useState<VisitForm>(emptyVisit);
	const [lastVisitId, setLastVisitId] = useState<string | null>(null);

	const { convertidos, addConvertido } = useConvertidos();
	const [isConvModal, setIsConvModal] = useState(false);
	const [convForm, setConvForm] = useState<ConvertForm>(emptyConvert);
	const [lastConvId, setLastConvId] = useState<string | null>(null);
	// Registros de hoy desde los stores (para mostrarlos al pie de la lista).
	const todayIso = today.toISOString().slice(0, 10);
	const convertidosToday = convertidos.filter((c) => c.dateRegistered === todayIso);
	const visitasToday = visitas.filter((v) => v.dateRegistered === todayIso);

	const statusOf = (id: string): AttStatus => attendance[id] ?? 'absent';

	const setStatus = (id: string, s: AttStatus) =>
		setAttendance((prev) => ({ ...prev, [id]: s }));

	const markAllPresent = () =>
		setAttendance(Object.fromEntries(ROSTER.map((m) => [m.id, 'present' as AttStatus])));

	const total = ROSTER.length;
	const presentCount = ROSTER.filter((m) => statusOf(m.id) === 'present').length;
	const excusedCount = ROSTER.filter((m) => statusOf(m.id) === 'excused').length;
	const absentCount = total - presentCount - excusedCount;
	const rate = total ? Math.round((presentCount / total) * 100) : 0;

	const filtered = ROSTER.filter(
		(m) =>
			!search ||
			m.name.toLowerCase().includes(search.toLowerCase()) ||
			m.ministry.toLowerCase().includes(search.toLowerCase()),
	);

	const bySection = (s: Section) => filtered.filter((m) => m.section === s);

	const saveVisit = () => {
		if (!visitForm.name.trim()) return;
		const nueva = addVisita({
			fullName: visitForm.name,
			phone: visitForm.phone,
			email: visitForm.email,
			invitedBy: visitForm.invitedBy,
			ministryInterest: visitForm.ministryInterest,
			notes: visitForm.notes,
		});
		setLastVisitId(nueva.id);
		setVisitForm(emptyVisit);
		setIsVisitModal(false);
	};

	const saveConvert = () => {
		if (!convForm.fullName.trim()) return;
		const parsedAge = parseInt(convForm.age, 10);
		const nuevo = addConvertido({
			fullName: convForm.fullName,
			age: Number.isNaN(parsedAge) ? null : parsedAge,
			phone: convForm.phone,
			address: convForm.address,
			notes: convForm.notes,
		});
		setLastConvId(nuevo.id);
		setConvForm(emptyConvert);
		setIsConvModal(false);
	};

	return (
		<main className='flex-1 flex flex-col min-h-full'>
			<div className='flex-1 p-4 md:p-margin-desktop pb-28 md:pb-margin-desktop w-full max-w-container-max mx-auto'>
				{/* Day auto-suggestion banner */}
				<div className={`mb-5 flex flex-wrap items-center gap-3 px-4 py-3 rounded-xl border border-outline-variant/50 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]`}>
					<span className='material-symbols-outlined text-on-surface-variant'>event_available</span>
					<span className='font-label-md text-label-md text-on-surface'>
						{DAY_ES[dow]} · {today.toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' })}
					</span>
					<span className='text-on-surface-variant'>→</span>
					<span className={`px-3 py-1 rounded-full font-label-sm text-label-sm ${suggestion.chip}`}>
						{suggestion.ministry}
					</span>
					<span className='font-body-sm text-body-sm text-on-surface-variant hidden sm:inline'>{suggestion.event}</span>
				</div>

				{/* Controls */}
				<div className='grid grid-cols-1 lg:grid-cols-12 gap-5 mb-6'>
					{/* Event selector */}
					<div className='col-span-1 lg:col-span-8 bg-white rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant flex flex-col md:flex-row gap-4 md:items-end'>
						<div className='flex-1 flex flex-col gap-1.5 w-full'>
							<label className='font-label-sm text-label-sm text-on-surface-variant'>Evento / Ministerio</label>
							<select value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)} className='w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 font-body-md text-on-surface focus:ring-primary focus:border-primary outline-none'>
								<option>Culto EsLider</option>
								<option>Ministerio de Oración</option>
								<option>Culto Caballeros</option>
								<option>Culto Damas</option>
								<option>Culto Unidos Caballeros y Damas</option>
								<option>GDC Jóvenes</option>
								<option>GDC Adolescentes</option>
								<option>Culto Jóvenes</option>
								<option>Culto Adolescentes</option>
								<option>Escuela Dominical — Niños</option>
								<option>Culto Central</option>
								<option>Vigilia de Oración</option>
								<option>Ayuno de la Iglesia</option>
								<option>Reunión de Líderes</option>
								<option>GDC El Renuevo</option>
								<option>Campo Víctor Raúl</option>
								<option>Campo Alto Trujillo</option>
								<option>Campo Pampas de San Juan</option>
							</select>
						</div>
						<div className='flex flex-col gap-1.5 w-full md:w-auto'>
							<label className='font-label-sm text-label-sm text-on-surface-variant'>Fecha</label>
							<input type='date' defaultValue={today.toISOString().slice(0, 10)} className='w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 font-body-md text-on-surface focus:ring-primary focus:border-primary outline-none' />
						</div>
						<button className='w-full md:w-auto bg-primary text-on-primary px-6 py-2.5 min-h-[44px] rounded-lg font-label-md text-label-md hover:opacity-90 transition-[opacity] shadow-sm shrink-0'>
							Cargar Lista
						</button>
					</div>

					{/* Stats */}
					<div className='col-span-1 lg:col-span-4 bg-white rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant'>
						<div className='flex items-center justify-between pb-3 border-b border-surface-variant'>
							<div>
								<p className='font-label-sm text-label-sm text-on-surface-variant'>Tasa de asistencia</p>
								<p className='font-body-sm text-body-sm text-on-surface-variant text-[11px]'>{presentCount} de {total} presentes</p>
							</div>
							<span className={`font-headline-lg ${rate >= 70 ? 'text-tertiary' : rate >= 50 ? 'text-secondary' : 'text-error'}`}>{rate}%</span>
						</div>
						<div className='grid grid-cols-3 gap-2 pt-3'>
							<div className='flex flex-col items-center gap-0.5 rounded-lg bg-tertiary-fixed/20 py-2'>
								<span className='font-headline-md text-tertiary'>{presentCount}</span>
								<span className='font-label-sm text-label-sm text-on-surface-variant'>Presentes</span>
							</div>
							<div className='flex flex-col items-center gap-0.5 rounded-lg bg-secondary-container/25 py-2'>
								<span className='font-headline-md text-secondary'>{excusedCount}</span>
								<span className='font-label-sm text-label-sm text-on-surface-variant'>Justif.</span>
							</div>
							<div className='flex flex-col items-center gap-0.5 rounded-lg bg-error-container/25 py-2'>
								<span className='font-headline-md text-error'>{absentCount}</span>
								<span className='font-label-sm text-label-sm text-on-surface-variant'>Ausentes</span>
							</div>
						</div>
						<div className='flex justify-between items-center pt-3 mt-1 border-t border-surface-variant'>
							<span className='font-label-sm text-label-sm text-on-surface-variant'>Visitantes hoy</span>
							<span className='font-headline-md text-on-surface'>{visitasToday.length}</span>
						</div>
					</div>
				</div>

				{/* Roster */}
				<div className='bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant overflow-hidden'>
					{/* Toolbar */}
					<div className='p-4 border-b border-outline-variant bg-surface-bright flex flex-col sm:flex-row sm:flex-wrap sm:justify-between sm:items-center gap-3'>
						<div className='relative w-full sm:w-64'>
							<span className='material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]'>search</span>
							<input type='text' value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Buscar por nombre o ministerio...' className='w-full pl-10 pr-4 py-2.5 bg-surface border border-outline-variant rounded-lg font-body-sm focus:ring-primary focus:border-primary outline-none transition-[box-shadow]' />
						</div>
						<div className='grid grid-cols-2 sm:flex sm:items-center gap-2'>
							<button onClick={markAllPresent} className='flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] border border-tertiary text-tertiary rounded-lg font-label-md text-label-md hover:bg-tertiary-container/20 transition-[background-color]'>
								<span className='material-symbols-outlined text-[18px]'>done_all</span>
								<span className='hidden sm:inline'>Todos presentes</span>
								<span className='sm:hidden'>Presentes</span>
							</button>
							<button className='flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] border border-primary text-primary rounded-lg font-label-md text-label-md hover:bg-primary-container/20 transition-[background-color]'>
								<span className='material-symbols-outlined text-[18px]'>diversity_3</span>
								<span className='hidden sm:inline'>Por Ministerio</span>
								<span className='sm:hidden'>Ministerio</span>
							</button>
							<button onClick={() => setIsVisitModal(true)} className='flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] bg-secondary-container text-on-secondary-container rounded-lg font-label-md text-label-md hover:opacity-90 transition-[opacity]'>
								<span className='material-symbols-outlined text-[18px]' style={{ fontVariationSettings: "'FILL' 1" }}>person_add</span>
								Agregar Visita
							</button>
							<button onClick={() => setIsConvModal(true)} className='flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] bg-tertiary-container text-on-tertiary-container rounded-lg font-label-md text-label-md hover:opacity-90 transition-[opacity]'>
								<span className='material-symbols-outlined text-[18px]' style={{ fontVariationSettings: "'FILL' 1" }}>volunteer_activism</span>
								Nuevo Convertido
							</button>
						</div>
					</div>

					{/* Sections */}
					{(['lider', 'equipo', 'congregante'] as Section[]).map((section) => {
						const members = bySection(section);
						const meta = SECTION_LABELS[section];
						if (members.length === 0 && section !== 'congregante') return null;
						return (
							<div key={section}>
								{/* Section header */}
								<div className='px-5 py-2 flex items-center gap-2 bg-surface-container-low border-y border-outline-variant/30'>
									<span className='material-symbols-outlined text-[16px] text-on-surface-variant'>{meta.icon}</span>
									<span className='font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider'>{meta.label}</span>
									<span className={`ml-auto px-2 py-0.5 rounded-full font-label-sm text-label-sm ${meta.badge}`}>{members.length}</span>
								</div>
								{/* Members */}
								{members.map((member) => {
									const status = statusOf(member.id);
									const config = STATUS_CONFIG[status];
									return (
										<div
											key={member.id}
											className={`flex flex-col sm:flex-row sm:items-center gap-3 px-4 sm:px-5 py-3 border-b border-outline-variant/20 transition-[background-color] ${config.rowTint}`}
										>
											<div className='flex items-center gap-3 flex-1 min-w-0'>
												<div className={`w-10 h-10 rounded-full flex items-center justify-center font-label-md text-label-md select-none shrink-0 ${member.bg}`}>
													{member.initials}
												</div>
												<div className='min-w-0 flex-1'>
													<p className='font-label-md text-label-md text-on-surface truncate'>{member.name}</p>
													<p className='font-body-sm text-body-sm text-on-surface-variant text-[11px]'>{member.role} · {member.ministry}</p>
												</div>
											</div>
											{/* Control segmentado táctil: mismo comportamiento en móvil y desktop */}
											<div className='flex gap-1 p-1 rounded-lg bg-surface-container-low w-full sm:w-auto shrink-0'>
												{STATUS_ORDER.map((s) => {
													const sc = STATUS_CONFIG[s];
													const isSelected = status === s;
													return (
														<button
															key={s}
															type='button'
															aria-pressed={isSelected}
															aria-label={`Marcar ${member.name} como ${sc.label}`}
															onClick={() => setStatus(member.id, s)}
															className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-2.5 min-h-[44px] sm:min-h-[38px] rounded-md font-label-sm text-label-sm transition-[background-color,color] ${
																isSelected
																	? sc.active
																	: 'text-on-surface-variant hover:bg-surface-container'
															}`}
														>
															<span
																className='material-symbols-outlined text-[18px]'
																style={isSelected ? { fontVariationSettings: "'FILL' 1" } : undefined}
															>
																{sc.icon}
															</span>
															<span>{sc.short}</span>
														</button>
													);
												})}
											</div>
										</div>
									);
								})}
								{section === 'congregante' && members.length === 0 && (
									<p className='px-5 py-4 font-body-sm text-body-sm text-on-surface-variant'>Sin congregantes en la lista actual.</p>
								)}
							</div>
						);
					})}

					{/* Visitas registradas hoy */}
					{visitasToday.length > 0 && (
						<div>
							<div className='px-5 py-2 flex items-center gap-2 bg-secondary-container/20 border-y border-secondary-container/30'>
								<span className='material-symbols-outlined text-[16px] text-secondary'>star</span>
								<span className='font-label-sm text-label-sm text-on-surface-variant'>Visitas registradas hoy</span>
								<span className='ml-auto px-2 py-0.5 rounded-full font-label-sm text-label-sm bg-secondary-container text-on-secondary-container'>{visitasToday.length}</span>
							</div>
							{visitasToday.map((v) => (
								<Link
									key={v.id}
									href={`/visitas/${v.id}`}
									className={`flex items-center gap-3 px-5 py-3 border-b border-outline-variant/20 hover:bg-secondary-container/10 transition-[background-color] ${v.id === lastVisitId ? 'bg-secondary-container/15' : 'bg-secondary-container/5'}`}
								>
									<div className='w-9 h-9 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-label-md text-label-md select-none shrink-0'>
										{v.fullName.slice(0, 2).toUpperCase()}
									</div>
									<div className='min-w-0'>
										<p className='font-label-md text-label-md text-on-surface truncate'>{v.fullName}</p>
										<p className='font-body-sm text-body-sm text-on-surface-variant text-[11px] truncate'>{v.phone || 'Sin teléfono'} {v.ministryInterest ? `· Interés: ${v.ministryInterest}` : ''}</p>
									</div>
									<span className='ml-auto flex items-center gap-1 text-secondary font-label-sm text-label-sm'>
										Ver
										<span className='material-symbols-outlined text-[16px]'>chevron_right</span>
									</span>
								</Link>
							))}
						</div>
					)}

					{/* Nuevos convertidos registrados hoy */}
					{convertidosToday.length > 0 && (
						<div>
							<div className='px-5 py-2 flex items-center gap-2 bg-tertiary-container/20 border-y border-tertiary-container/30'>
								<span className='material-symbols-outlined text-[16px] text-tertiary'>volunteer_activism</span>
								<span className='font-label-sm text-label-sm text-on-surface-variant'>Nuevos convertidos hoy</span>
								<span className='ml-auto px-2 py-0.5 rounded-full font-label-sm text-label-sm bg-tertiary-container text-on-tertiary-container'>{convertidosToday.length}</span>
							</div>
							{convertidosToday.map((c) => (
								<Link
									key={c.id}
									href={`/convertidos/${c.id}`}
									className={`flex items-center gap-3 px-5 py-3 border-b border-outline-variant/20 hover:bg-tertiary-container/10 transition-[background-color] ${c.id === lastConvId ? 'bg-tertiary-container/15' : 'bg-tertiary-container/5'}`}
								>
									<div className='w-9 h-9 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center font-label-md text-label-md select-none shrink-0'>
										{c.fullName.slice(0, 2).toUpperCase()}
									</div>
									<div className='min-w-0'>
										<p className='font-label-md text-label-md text-on-surface truncate'>{c.fullName}</p>
										<p className='font-body-sm text-body-sm text-on-surface-variant text-[11px]'>{c.phone || 'Sin teléfono'}{c.age ? ` · ${c.age} años` : ''}</p>
									</div>
									<span className='ml-auto flex items-center gap-1 text-tertiary font-label-sm text-label-sm'>
										Ver
										<span className='material-symbols-outlined text-[16px]'>chevron_right</span>
									</span>
								</Link>
							))}
						</div>
					)}

					{/* Footer */}
					<div className='p-4 border-t border-outline-variant flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-surface-bright'>
						<span className='font-body-sm text-body-sm text-on-surface-variant text-center sm:text-left'>
							Mostrando {filtered.length} de {ROSTER.length} asistentes + {visitasToday.length} visitas
						</span>
						<div className='grid grid-cols-1 sm:flex gap-2'>
							<button className='px-4 py-2.5 min-h-[44px] border border-primary text-primary rounded-lg font-label-md text-label-md hover:bg-primary-container/20 transition-[background-color] flex items-center justify-center gap-2'>
								<span className='material-symbols-outlined text-[18px]'>download</span>
								Exportar Lista
							</button>
							<button className='px-4 py-2.5 min-h-[44px] bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:opacity-90 transition-[opacity] shadow-sm'>
								Guardar Asistencia
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Barra de confirmación flotante — solo móvil, sobre la navegación inferior */}
			<div className='md:hidden fixed bottom-16 left-0 right-0 z-40 flex items-center gap-3 px-4 py-3 bg-surface border-t border-outline-variant shadow-[0_-4px_20px_rgba(0,0,0,0.08)]'>
				<div className='flex-1 min-w-0'>
					<p className='font-label-md text-label-md text-on-surface'>
						{presentCount} presentes · {rate}%
					</p>
					<p className='font-body-sm text-body-sm text-on-surface-variant text-[11px] truncate'>
						{excusedCount} justif. · {absentCount} ausentes de {total}
					</p>
				</div>
				<button className='shrink-0 flex items-center gap-2 px-5 py-2.5 min-h-[44px] bg-primary text-on-primary rounded-full font-label-md text-label-md hover:opacity-90 transition-[opacity]'>
					<span className='material-symbols-outlined text-[18px]'>save</span>
					Guardar
				</button>
			</div>

			{/* Agregar Visita Modal */}
			{isVisitModal && (
				<div className='fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4' onClick={(e) => e.target === e.currentTarget && setIsVisitModal(false)}>
					<div className='bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden'>
						<div className='flex items-center justify-between p-5 border-b border-outline-variant bg-secondary-container/10'>
							<div>
								<h2 className='font-headline-md text-on-surface'>Registrar Visita</h2>
								<p className='font-body-sm text-body-sm text-on-surface-variant'>Los datos se guardarán en el directorio de Miembros.</p>
							</div>
							<button onClick={() => setIsVisitModal(false)} className='p-2 rounded-full hover:bg-surface-container transition-[background-color] text-on-surface-variant'>
								<span className='material-symbols-outlined'>close</span>
							</button>
						</div>
						<div className='p-5 overflow-y-auto space-y-4'>
							<div>
								<label className='block font-label-sm text-label-sm text-on-surface-variant mb-1'>Nombre Completo *</label>
								<input type='text' value={visitForm.name} onChange={(e) => setVisitForm((f) => ({ ...f, name: e.target.value }))} placeholder='Nombre y apellido' className='w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-lowest text-on-surface font-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-[box-shadow]' />
							</div>
							<div className='grid grid-cols-2 gap-3'>
								<div>
									<label className='block font-label-sm text-label-sm text-on-surface-variant mb-1'>Teléfono</label>
									<input type='tel' value={visitForm.phone} onChange={(e) => setVisitForm((f) => ({ ...f, phone: e.target.value }))} placeholder='999 000 000' className='w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-lowest text-on-surface font-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-[box-shadow]' />
								</div>
								<div>
									<label className='block font-label-sm text-label-sm text-on-surface-variant mb-1'>Email</label>
									<input type='email' value={visitForm.email} onChange={(e) => setVisitForm((f) => ({ ...f, email: e.target.value }))} placeholder='correo@email.com' className='w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-lowest text-on-surface font-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-[box-shadow]' />
								</div>
							</div>
							<div>
								<label className='block font-label-sm text-label-sm text-on-surface-variant mb-1'>¿Invitado por?</label>
								<input type='text' value={visitForm.invitedBy} onChange={(e) => setVisitForm((f) => ({ ...f, invitedBy: e.target.value }))} placeholder='Nombre del miembro que lo invitó' className='w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-lowest text-on-surface font-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-[box-shadow]' />
							</div>
							<div>
								<label className='block font-label-sm text-label-sm text-on-surface-variant mb-1'>Ministerio de Interés</label>
								<div className='relative'>
									<select value={visitForm.ministryInterest} onChange={(e) => setVisitForm((f) => ({ ...f, ministryInterest: e.target.value }))} className='w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-lowest text-on-surface font-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none transition-[box-shadow]'>
										<option value=''>Seleccionar (opcional)...</option>
										{MINISTRIES_LIST.map((m) => <option key={m} value={m}>{m}</option>)}
									</select>
									<span className='material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant'>expand_more</span>
								</div>
							</div>
							<div>
								<label className='block font-label-sm text-label-sm text-on-surface-variant mb-1'>Notas</label>
								<textarea rows={2} value={visitForm.notes} onChange={(e) => setVisitForm((f) => ({ ...f, notes: e.target.value }))} placeholder='Observaciones adicionales...' className='w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-lowest text-on-surface font-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none transition-[box-shadow]' />
							</div>
						</div>
						<div className='p-5 border-t border-outline-variant bg-surface-bright flex justify-end gap-3'>
							<button onClick={() => setIsVisitModal(false)} className='px-5 py-2 rounded-lg font-label-md text-label-md text-on-surface border border-outline-variant hover:bg-surface-container transition-[background-color]'>
								Cancelar
							</button>
							<button onClick={saveVisit} className='px-5 py-2 rounded-lg font-label-md text-label-md bg-secondary-container text-on-secondary-container hover:opacity-90 transition-[opacity] shadow-sm'>
								Registrar Visita
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Nuevo Convertido Modal */}
			{isConvModal && (
				<div className='fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4' onClick={(e) => e.target === e.currentTarget && setIsConvModal(false)}>
					<div className='bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden'>
						<div className='flex items-center justify-between p-5 border-b border-outline-variant bg-tertiary-container/15'>
							<div className='flex items-center gap-3'>
								<div className='w-10 h-10 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center shrink-0'>
									<span className='material-symbols-outlined' style={{ fontVariationSettings: "'FILL' 1" }}>volunteer_activism</span>
								</div>
								<div>
									<h2 className='font-headline-md text-on-surface'>Nuevo Convertido</h2>
									<p className='font-body-sm text-body-sm text-on-surface-variant'>Pasa al proceso de consolidación.</p>
								</div>
							</div>
							<button onClick={() => setIsConvModal(false)} className='p-2 rounded-full hover:bg-surface-container transition-[background-color] text-on-surface-variant'>
								<span className='material-symbols-outlined'>close</span>
							</button>
						</div>
						<div className='p-5 overflow-y-auto space-y-4'>
							<div>
								<label className='block font-label-sm text-label-sm text-on-surface-variant mb-1'>Nombre Completo *</label>
								<input type='text' value={convForm.fullName} onChange={(e) => setConvForm((f) => ({ ...f, fullName: e.target.value }))} placeholder='Nombres y apellidos' className='w-full px-3 py-2.5 border border-outline-variant rounded-lg bg-surface-lowest text-on-surface font-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-[box-shadow]' />
							</div>
							<div className='grid grid-cols-2 gap-3'>
								<div>
									<label className='block font-label-sm text-label-sm text-on-surface-variant mb-1'>Edad</label>
									<input type='number' min={0} inputMode='numeric' value={convForm.age} onChange={(e) => setConvForm((f) => ({ ...f, age: e.target.value }))} placeholder='Ej. 28' className='w-full px-3 py-2.5 border border-outline-variant rounded-lg bg-surface-lowest text-on-surface font-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-[box-shadow]' />
								</div>
								<div>
									<label className='block font-label-sm text-label-sm text-on-surface-variant mb-1'>Teléfono</label>
									<input type='tel' inputMode='tel' value={convForm.phone} onChange={(e) => setConvForm((f) => ({ ...f, phone: e.target.value }))} placeholder='999 000 000' className='w-full px-3 py-2.5 border border-outline-variant rounded-lg bg-surface-lowest text-on-surface font-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-[box-shadow]' />
								</div>
							</div>
							<div>
								<label className='block font-label-sm text-label-sm text-on-surface-variant mb-1'>Dirección</label>
								<input type='text' value={convForm.address} onChange={(e) => setConvForm((f) => ({ ...f, address: e.target.value }))} placeholder='Calle, número, sector' className='w-full px-3 py-2.5 border border-outline-variant rounded-lg bg-surface-lowest text-on-surface font-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-[box-shadow]' />
							</div>
							<div>
								<label className='block font-label-sm text-label-sm text-on-surface-variant mb-1'>Notas sobre la persona</label>
								<textarea rows={3} value={convForm.notes} onChange={(e) => setConvForm((f) => ({ ...f, notes: e.target.value }))} placeholder='Cómo llegó, quién la invitó, situación, intereses...' className='w-full px-3 py-2.5 border border-outline-variant rounded-lg bg-surface-lowest text-on-surface font-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none transition-[box-shadow]' />
							</div>
						</div>
						<div className='p-5 border-t border-outline-variant bg-surface-bright flex justify-end gap-3'>
							<button onClick={() => setIsConvModal(false)} className='px-5 py-2 rounded-lg font-label-md text-label-md text-on-surface border border-outline-variant hover:bg-surface-container transition-[background-color]'>
								Cancelar
							</button>
							<button onClick={saveConvert} disabled={!convForm.fullName.trim()} className='px-5 py-2 rounded-lg font-label-md text-label-md bg-tertiary text-on-tertiary hover:opacity-90 transition-[opacity] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed'>
								Registrar Convertido
							</button>
						</div>
					</div>
				</div>
			)}
		</main>
	);
}

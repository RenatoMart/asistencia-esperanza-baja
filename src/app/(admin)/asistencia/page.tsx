'use client';

import { useState } from 'react';

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

const STATUS_STYLES: Record<AttStatus, { row: string; radio: string; label: string }> = {
	present: { row: 'bg-tertiary-fixed/20 border-tertiary-fixed', radio: 'accent-[#002d37]', label: 'Presente' },
	absent: { row: 'bg-error-container/20 border-error/30', radio: 'accent-[#ba1a1a]', label: 'Ausente' },
	excused: { row: 'bg-secondary-container/20 border-secondary-container', radio: 'accent-[#735c00]', label: 'Justificado' },
};

const MINISTRIES_LIST = ['EsLider','Oración','Caballeros','Damas','Jóvenes','Adolescentes','Niños','Mayordomía','Servicio Social','Evangelismo','GDC Jóvenes','GDC Adolescentes','Campo Víctor Raúl','Campo Alto Trujillo','Campo Pampas de San Juan'];

const emptyVisit: VisitForm = { name: '', phone: '', email: '', invitedBy: '', ministryInterest: '', notes: '' };

export default function AsistenciaPage() {
	const today = new Date();
	const dow = today.getDay();
	const suggestion = DAY_SCHEDULE[dow] ?? DAY_SCHEDULE[1];

	const [attendance, setAttendance] = useState<Record<string, AttStatus>>({
		'1': 'present', '2': 'present', '3': 'absent', '4': 'excused', '5': 'present', '6': 'present', '7': 'absent', '8': 'present',
	});
	const [selectedEvent, setSelectedEvent] = useState(suggestion.event);
	const [search, setSearch] = useState('');
	const [isVisitModal, setIsVisitModal] = useState(false);
	const [visitForm, setVisitForm] = useState<VisitForm>(emptyVisit);
	const [visits, setVisits] = useState<VisitForm[]>([]);

	const setStatus = (id: string, s: AttStatus) =>
		setAttendance((prev) => ({ ...prev, [id]: s }));

	const presentCount = Object.values(attendance).filter((s) => s === 'present').length;
	const total = ROSTER.length;
	const rate = Math.round((presentCount / total) * 100);

	const filtered = ROSTER.filter(
		(m) =>
			!search ||
			m.name.toLowerCase().includes(search.toLowerCase()) ||
			m.ministry.toLowerCase().includes(search.toLowerCase()),
	);

	const bySection = (s: Section) => filtered.filter((m) => m.section === s);

	const saveVisit = () => {
		if (!visitForm.name) return;
		setVisits((v) => [...v, visitForm]);
		setVisitForm(emptyVisit);
		setIsVisitModal(false);
	};

	return (
		<main className='flex-1 flex flex-col min-h-full'>
			<div className='flex-1 p-4 md:p-margin-desktop w-full max-w-container-max mx-auto'>
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
					<div className='col-span-1 lg:col-span-8 bg-white rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant flex flex-col md:flex-row gap-4 items-end'>
						<div className='flex-1 flex flex-col gap-1.5'>
							<label className='font-label-sm text-label-sm text-on-surface-variant'>Evento / Ministerio</label>
							<select value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)} className='bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 font-body-md text-on-surface focus:ring-primary focus:border-primary outline-none'>
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
						<div className='flex flex-col gap-1.5'>
							<label className='font-label-sm text-label-sm text-on-surface-variant'>Fecha</label>
							<input type='date' defaultValue={today.toISOString().slice(0, 10)} className='bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 font-body-md text-on-surface focus:ring-primary focus:border-primary outline-none' />
						</div>
						<button className='bg-primary text-on-primary px-6 py-2.5 rounded-lg font-label-md text-label-md hover:opacity-90 transition-[opacity] shadow-sm shrink-0'>
							Cargar Lista
						</button>
					</div>

					{/* Stats */}
					<div className='col-span-1 lg:col-span-4 bg-white rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant'>
						<div className='flex justify-between items-center py-2 border-b border-surface-variant'>
							<span className='font-label-md text-label-md text-on-surface-variant'>Total Presentes</span>
							<span className='font-headline-lg text-primary'>{presentCount}</span>
						</div>
						<div className='flex justify-between items-center py-2 border-b border-surface-variant'>
							<span className='font-label-md text-label-md text-on-surface-variant'>Tasa de Asistencia</span>
							<span className={`font-headline-md ${rate >= 70 ? 'text-tertiary' : rate >= 50 ? 'text-secondary' : 'text-error'}`}>{rate}%</span>
						</div>
						<div className='flex justify-between items-center pt-2'>
							<span className='font-label-md text-label-md text-on-surface-variant'>Visitantes Hoy</span>
							<span className='font-headline-md text-on-surface'>{visits.length}</span>
						</div>
					</div>
				</div>

				{/* Roster */}
				<div className='bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant overflow-hidden'>
					{/* Toolbar */}
					<div className='p-4 border-b border-outline-variant bg-surface-bright flex flex-wrap justify-between items-center gap-3'>
						<div className='relative'>
							<span className='material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]'>search</span>
							<input type='text' value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Buscar por nombre o ministerio...' className='pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded-lg font-body-sm focus:ring-primary focus:border-primary outline-none transition-[box-shadow] w-64' />
						</div>
						<div className='flex items-center gap-2'>
							<button className='flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg font-label-md text-label-md hover:bg-primary-container/20 transition-[background-color]'>
								<span className='material-symbols-outlined text-[18px]'>diversity_3</span>
								Por Ministerio
							</button>
							<button onClick={() => setIsVisitModal(true)} className='flex items-center gap-2 px-4 py-2 bg-secondary-container text-on-secondary-container rounded-lg font-label-md text-label-md hover:opacity-90 transition-[opacity]'>
								<span className='material-symbols-outlined text-[18px]' style={{ fontVariationSettings: "'FILL' 1" }}>person_add</span>
								Agregar Visita
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
									const status = attendance[member.id] ?? 'present';
									const ss = STATUS_STYLES[status];
									return (
										<div
											key={member.id}
											className={`flex flex-wrap items-center gap-4 px-5 py-3 border-b border-outline-variant/20 transition-[background-color] ${status !== 'absent' ? 'bg-white' : 'bg-surface-bright'}`}
										>
											<div className='flex items-center gap-3 flex-1 min-w-0'>
												<div className={`w-9 h-9 rounded-full flex items-center justify-center font-label-md text-label-md select-none shrink-0 ${member.bg}`}>
													{member.initials}
												</div>
												<div className='min-w-0'>
													<p className='font-label-md text-label-md text-on-surface truncate'>{member.name}</p>
													<p className='font-body-sm text-body-sm text-on-surface-variant text-[11px]'>{member.role} · {member.ministry}</p>
												</div>
											</div>
											<div className='flex gap-2 shrink-0'>
												{(['present', 'absent', 'excused'] as AttStatus[]).map((s) => {
													const isSelected = status === s;
													return (
														<label key={s} className={`flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-lg border transition-[background-color,border-color] ${isSelected ? ss.row : 'border-outline-variant hover:bg-surface-container'}`}>
															<input type='radio' name={`att_${member.id}`} value={s} checked={isSelected} onChange={() => setStatus(member.id, s)} className={ss.radio} />
															<span className={`font-label-sm text-label-sm ${isSelected && s === 'absent' ? 'text-error' : ''}`}>{STATUS_STYLES[s].label}</span>
														</label>
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

					{/* Visits recorded today */}
					{visits.length > 0 && (
						<div>
							<div className='px-5 py-2 flex items-center gap-2 bg-secondary-container/20 border-y border-secondary-container/30'>
								<span className='material-symbols-outlined text-[16px] text-secondary'>star</span>
								<span className='font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider'>Visitas Registradas Hoy</span>
								<span className='ml-auto px-2 py-0.5 rounded-full font-label-sm text-label-sm bg-secondary-container text-on-secondary-container'>{visits.length}</span>
							</div>
							{visits.map((v, i) => (
								<div key={i} className='flex items-center gap-3 px-5 py-3 border-b border-outline-variant/20 bg-secondary-container/5'>
									<div className='w-9 h-9 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-label-md text-label-md select-none shrink-0'>
										{v.name.slice(0, 2).toUpperCase()}
									</div>
									<div>
										<p className='font-label-md text-label-md text-on-surface'>{v.name}</p>
										<p className='font-body-sm text-body-sm text-on-surface-variant text-[11px]'>{v.phone || 'Sin teléfono'} {v.ministryInterest ? `· Interés: ${v.ministryInterest}` : ''}</p>
									</div>
									<span className='ml-auto px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm text-[10px] uppercase'>Visita</span>
								</div>
							))}
						</div>
					)}

					{/* Footer */}
					<div className='p-4 border-t border-outline-variant flex justify-between items-center bg-surface-bright'>
						<span className='font-body-sm text-body-sm text-on-surface-variant'>
							Mostrando {filtered.length} de {ROSTER.length} asistentes + {visits.length} visitas
						</span>
						<div className='flex gap-2'>
							<button className='px-4 py-2 border border-primary text-primary rounded-lg font-label-md text-label-md hover:bg-primary-container/20 transition-[background-color] flex items-center gap-2'>
								<span className='material-symbols-outlined text-[18px]'>download</span>
								Exportar Lista
							</button>
							<button className='px-4 py-2 bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:opacity-90 transition-[opacity] shadow-sm'>
								Guardar Asistencia
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Agregar Visita Modal */}
			{isVisitModal && (
				<div className='fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4' onClick={(e) => e.target === e.currentTarget && setIsVisitModal(false)}>
					<div className='bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] w-full max-w-md flex flex-col overflow-hidden'>
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
		</main>
	);
}

'use client';

import { useState } from 'react';

const MONTH_NAMES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DAY_NAMES = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];

// Días de la semana (0=Dom…6=Sáb) que ocurren dentro del rango [startIso, endIso].
function weekdaysInRange(startIso: string, endIso: string): Set<number> {
	const set = new Set<number>();
	if (!startIso || !endIso) return set;
	const start = new Date(`${startIso}T00:00:00`);
	const end = new Date(`${endIso}T00:00:00`);
	if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) {
		return set;
	}
	const cursor = new Date(start);
	while (cursor <= end && set.size < 7) {
		set.add(cursor.getDay());
		cursor.setDate(cursor.getDate() + 1);
	}
	return set;
}

interface Chip { label: string; color: string }

// Recurring events by JS day-of-week (0=Sun…6=Sat)
const WEEKLY: Record<number, Chip[]> = {
	2: [{ label: 'EsLider', color: 'bg-primary-container text-on-primary-container' }],
	3: [{ label: 'Oración', color: 'bg-tertiary-container text-on-tertiary-container' }],
	4: [{ label: 'Caballeros/Damas', color: 'bg-secondary-container text-on-secondary-container' }],
	5: [{ label: 'GDC', color: 'bg-error-container text-on-error-container' }],
	6: [{ label: 'Jóvenes/Adol.', color: 'bg-primary-fixed text-on-primary-fixed' }],
	0: [
		{ label: 'Niños (mañana)', color: 'bg-tertiary-fixed text-on-tertiary-fixed' },
		{ label: 'Culto Central', color: 'bg-surface-container text-on-surface-variant' },
	],
};

// 1st Sunday of month: Mayordomía leads Culto Central
const FIRST_SUNDAY_LABEL = 'Mayordomía → Culto C.';

interface CustomEvent {
	id: number;
	day: number;
	month: number;
	year: number;
	title: string;
	eventType: string;
	ministry: string;
	time: string;
	location: string;
	notes: string;
}

const EVENT_TYPE_COLOR: Record<string, string> = {
	culto: 'bg-primary-container text-on-primary-container',
	vigilia: 'bg-primary text-on-primary',
	ayuno: 'bg-secondary-container text-on-secondary-container',
	equipo: 'bg-tertiary-container text-on-tertiary-container',
	gdc: 'bg-error-container text-on-error-container',
	semana: 'bg-surface-container-highest text-on-surface',
	otro: 'bg-outline-variant text-on-surface-variant',
};

const WEEKLY_SCHEDULE = [
	{ day: 'Martes', label: 'EsLider', color: 'bg-primary-container text-on-primary-container' },
	{ day: 'Miércoles', label: 'Oración', color: 'bg-tertiary-container text-on-tertiary-container' },
	{ day: 'Jueves', label: 'Caballeros / Damas (varía)', color: 'bg-secondary-container text-on-secondary-container' },
	{ day: 'Viernes', label: 'GDC — Grupos Dinámicos', color: 'bg-error-container text-on-error-container' },
	{ day: 'Sábado', label: 'Jóvenes / Adol. / Niños (varía)', color: 'bg-primary-fixed text-on-primary-fixed' },
	{ day: 'Dom. (mañana)', label: 'Niños — Escuela Dominical', color: 'bg-tertiary-fixed text-on-tertiary-fixed' },
	{ day: 'Dom. (tarde)', label: 'Culto Central', color: 'bg-surface-container text-on-surface-variant' },
];

const MINISTRIES = ['EsLider','Oración','Caballeros','Damas','Jóvenes','Adolescentes','Niños','Mayordomía','Servicio Social','Evangelismo','GDC Jóvenes','GDC Adolescentes','Campo Víctor Raúl','Campo Alto Trujillo','Campo Pampas','Congregación General'];

export default function CalendarioPage() {
	const today = new Date();
	const [viewDate, setViewDate] = useState(
		new Date(today.getFullYear(), today.getMonth(), 1),
	);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [showSchedule, setShowSchedule] = useState(false);
	const [customEvents, setCustomEvents] = useState<CustomEvent[]>([]);
	const [nextId, setNextId] = useState(1);
	// id del evento en edición; null = creando uno nuevo.
	const [editingId, setEditingId] = useState<number | null>(null);

	// form state (startDate/endDate/weekDays solo aplican a "Semana Especial")
	const [form, setForm] = useState({
		title: '',
		date: '',
		time: '',
		eventType: 'culto',
		ministry: '',
		location: '',
		notes: '',
		startDate: '',
		endDate: '',
		weekDays: [] as number[],
	});

	const year = viewDate.getFullYear();
	const month = viewDate.getMonth();
	const firstDayOfWeek = new Date(year, month, 1).getDay();
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	const daysInPrevMonth = new Date(year, month, 0).getDate();
	const totalCells = Math.ceil((firstDayOfWeek + daysInMonth) / 7) * 7;

	const getRecurring = (dayNum: number): Chip[] => {
		const dow = new Date(year, month, dayNum).getDay();
		const chips = WEEKLY[dow] ? [...WEEKLY[dow]] : [];
		// First Sunday: override Culto Central label
		if (dow === 0) {
			const weekIndex = Math.ceil(dayNum / 7);
			if (weekIndex === 1) {
				return chips.map((c, i) =>
					i === 1 ? { ...c, label: FIRST_SUNDAY_LABEL } : c,
				);
			}
		}
		return chips;
	};

	const monthEvents = customEvents
		.filter((e) => e.month === month && e.year === year)
		.sort((a, b) => a.day - b.day);

	const getCustom = (dayNum: number) =>
		customEvents.filter((e) => e.day === dayNum && e.month === month && e.year === year);

	const resetForm = () =>
		setForm({
			title: '',
			date: '',
			time: '',
			eventType: 'culto',
			ministry: '',
			location: '',
			notes: '',
			startDate: '',
			endDate: '',
			weekDays: [],
		});

	// Días de la semana disponibles según el rango elegido.
	const availableDows = weekdaysInRange(form.startDate, form.endDate);

	// Al cambiar inicio/cierre, se recalculan los días válidos y se descartan los
	// seleccionados que ya no caen dentro del nuevo rango.
	const setRange = (patch: { startDate?: string; endDate?: string }) =>
		setForm((f) => {
			const next = { ...f, ...patch };
			const valid = weekdaysInRange(next.startDate, next.endDate);
			return { ...next, weekDays: next.weekDays.filter((d) => valid.has(d)) };
		});

	const toggleWeekDay = (dow: number) => {
		if (!availableDows.has(dow)) return;
		setForm((f) => ({
			...f,
			weekDays: f.weekDays.includes(dow)
				? f.weekDays.filter((d) => d !== dow)
				: [...f.weekDays, dow],
		}));
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setEditingId(null);
		resetForm();
	};

	// Abrir el modal para crear un evento nuevo (opcionalmente con fecha prefijada).
	const openNew = (dateIso?: string) => {
		resetForm();
		setEditingId(null);
		if (dateIso) setForm((f) => ({ ...f, date: dateIso }));
		setIsModalOpen(true);
	};

	// Abrir el modal para editar un evento existente (una sola ocurrencia).
	const openEdit = (ev: CustomEvent) => {
		const dateIso = `${ev.year}-${String(ev.month + 1).padStart(2, '0')}-${String(ev.day).padStart(2, '0')}`;
		setForm({
			title: ev.title,
			date: dateIso,
			time: ev.time,
			eventType: ev.eventType,
			ministry: ev.ministry,
			location: ev.location,
			notes: ev.notes,
			startDate: '',
			endDate: '',
			weekDays: [],
		});
		setEditingId(ev.id);
		setIsModalOpen(true);
	};

	const deleteEvent = (id: number) => {
		setCustomEvents((prev) => prev.filter((e) => e.id !== id));
		if (editingId === id) closeModal();
	};

	const saveEvent = () => {
		if (!form.title) return;

		// Edición: siempre una sola ocurrencia (día concreto).
		if (editingId !== null) {
			if (!form.date) return;
			const d = new Date(`${form.date}T00:00:00`);
			if (Number.isNaN(d.getTime())) return;
			setCustomEvents((prev) =>
				prev.map((e) =>
					e.id === editingId
						? {
								...e,
								day: d.getDate(),
								month: d.getMonth(),
								year: d.getFullYear(),
								title: form.title,
								eventType: form.eventType,
								ministry: form.ministry,
								time: form.time,
								location: form.location,
								notes: form.notes,
							}
						: e,
				),
			);
			closeModal();
			return;
		}

		if (form.eventType === 'semana') {
			// Semana especial: repartir el evento en los días seleccionados del rango.
			if (!form.startDate || !form.endDate || form.weekDays.length === 0) return;
			const start = new Date(`${form.startDate}T00:00:00`);
			const end = new Date(`${form.endDate}T00:00:00`);
			if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) return;

			const newEvents: CustomEvent[] = [];
			let id = nextId;
			const cursor = new Date(start);
			while (cursor <= end) {
				if (form.weekDays.includes(cursor.getDay())) {
					newEvents.push({
						id: id++,
						day: cursor.getDate(),
						month: cursor.getMonth(),
						year: cursor.getFullYear(),
						title: form.title,
						eventType: 'semana',
						ministry: form.ministry,
						time: form.time,
						location: form.location,
						notes: form.notes,
					});
				}
				cursor.setDate(cursor.getDate() + 1);
			}
			if (newEvents.length === 0) return;
			setCustomEvents((prev) => [...prev, ...newEvents]);
			setNextId(id);
			closeModal();
			return;
		}

		// Evento de un solo día.
		if (!form.date) return;
		const d = new Date(`${form.date}T00:00:00`);
		if (Number.isNaN(d.getTime())) return;
		setCustomEvents((prev) => [
			...prev,
			{
				id: nextId,
				day: d.getDate(),
				month: d.getMonth(),
				year: d.getFullYear(),
				title: form.title,
				eventType: form.eventType,
				ministry: form.ministry,
				time: form.time,
				location: form.location,
				notes: form.notes,
			},
		]);
		setNextId((n) => n + 1);
		closeModal();
	};

	return (
		<div className='flex-1 p-4 md:p-margin-desktop overflow-y-auto min-h-full'>
			<div className='max-w-container-max mx-auto flex flex-col gap-6'>
				{/* Header */}
				<div className='flex flex-wrap justify-between items-end gap-4 shrink-0'>
					<div>
						<h2 className='font-display-lg text-on-surface mb-1 leading-tight text-[28px] md:text-[40px] font-semibold'>
							{MONTH_NAMES[month]} {year}
						</h2>
						<p className='font-body-md text-body-md text-on-surface-variant'>
							Programa cultos, vigilias, ayunos y eventos especiales.
						</p>
					</div>
					<div className='flex items-center gap-3 flex-wrap'>
						<button
							onClick={() => setShowSchedule((v) => !v)}
							className={`px-4 py-2 rounded-lg font-label-md text-label-md border transition-[background-color,border-color] flex items-center gap-2 ${showSchedule ? 'bg-primary-container text-on-primary-container border-primary/30' : 'bg-white border-outline-variant text-on-surface hover:bg-surface-container-low'}`}
						>
							<span className='material-symbols-outlined text-[18px]'>schedule</span>
							Horario Semanal
						</button>
						<div className='flex items-center gap-1 bg-white rounded-lg p-1 border border-outline-variant'>
							<button onClick={() => setViewDate(new Date(year, month - 1, 1))} className='p-2 rounded hover:bg-surface-container transition-[background-color] text-on-surface-variant'>
								<span className='material-symbols-outlined'>chevron_left</span>
							</button>
							<button onClick={() => setViewDate(new Date(today.getFullYear(), today.getMonth(), 1))} className='px-4 py-2 rounded font-label-md text-label-md text-on-surface hover:bg-surface-container transition-[background-color]'>
								Hoy
							</button>
							<button onClick={() => setViewDate(new Date(year, month + 1, 1))} className='p-2 rounded hover:bg-surface-container transition-[background-color] text-on-surface-variant'>
								<span className='material-symbols-outlined'>chevron_right</span>
							</button>
						</div>
					</div>
				</div>

				{/* Weekly schedule panel */}
				{showSchedule && (
					<div className='bg-white border border-outline-variant rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)]'>
						<h3 className='font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-3'>Programación Recurrente Semanal</h3>
						<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3'>
							{WEEKLY_SCHEDULE.map((row) => (
								<div key={row.day} className={`flex items-center gap-3 p-3 rounded-lg ${row.color}`}>
									<span className='font-label-md text-label-md shrink-0 min-w-[72px]'>{row.day}</span>
									<span className='text-[12px] font-medium'>{row.label}</span>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Calendar + sidebar */}
				<div className='grid grid-cols-1 xl:grid-cols-4 gap-gutter'>
					{/* Calendar */}
					<div className='xl:col-span-3 bg-white border border-outline-variant rounded-xl overflow-hidden flex flex-col shadow-[0_4px_20px_rgba(0,0,0,0.04)]'>
						<div className='grid grid-cols-7 border-b border-outline-variant bg-surface-container-lowest shrink-0'>
							{DAY_NAMES.map((d) => (
								<div key={d} className='py-3 text-center font-label-md text-label-md text-on-surface-variant border-r last:border-r-0 border-outline-variant'>{d}</div>
							))}
						</div>
						<div
							className='flex-1 grid grid-cols-7 bg-outline-variant gap-[1px]'
							style={{ gridTemplateRows: `repeat(${totalCells / 7}, minmax(80px, 1fr))` }}
						>
							{Array.from({ length: totalCells }).map((_, i) => {
								const dayNum = i - firstDayOfWeek + 1;
								const inMonth = dayNum >= 1 && dayNum <= daysInMonth;
								const isToday = inMonth && dayNum === today.getDate() && month === today.getMonth() && year === today.getFullYear();
								const recurring = inMonth ? getRecurring(dayNum) : [];
								const custom = inMonth ? getCustom(dayNum) : [];
								const display = inMonth ? dayNum : dayNum < 1 ? daysInPrevMonth + dayNum : dayNum - daysInMonth;

								return (
									<div
										key={i}
										onClick={() => { if (inMonth) openNew(`${year}-${String(month + 1).padStart(2,'0')}-${String(dayNum).padStart(2,'0')}`); }}
										className={`p-1.5 flex flex-col group cursor-pointer transition-[background-color] ${inMonth ? 'bg-white hover:bg-surface-container-low' : 'bg-surface-bright opacity-40'}`}
									>
										<span className='flex justify-between items-center mb-1'>
											{isToday ? (
												<span className='w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-bold'>{display}</span>
											) : (
												<span className={`font-label-sm text-label-sm ${inMonth ? 'text-on-surface' : 'text-on-surface-variant'}`}>{display}</span>
											)}
											{inMonth && (
												<span className='material-symbols-outlined text-[12px] opacity-0 group-hover:opacity-100 transition-[opacity] text-primary'>add</span>
											)}
										</span>
										{recurring.map((ev, ei) => (
											<div key={ei} className={`${ev.color} font-label-sm px-1 py-0.5 rounded mb-0.5 truncate text-[10px] leading-tight`}>{ev.label}</div>
										))}
										{custom.map((ev) => (
											<button
												key={ev.id}
												type='button'
												onClick={(e) => { e.stopPropagation(); openEdit(ev); }}
												title={`Editar: ${ev.title}`}
												className={`${EVENT_TYPE_COLOR[ev.eventType] ?? 'bg-surface-container text-on-surface'} w-full text-left font-label-sm px-1 py-0.5 rounded mb-0.5 truncate text-[10px] leading-tight hover:opacity-80 transition-[opacity]`}
											>
												{ev.title}
											</button>
										))}
									</div>
								);
							})}
						</div>
					</div>

					{/* Sidebar */}
					<div className='xl:col-span-1 flex flex-col gap-4'>
						{/* Legend */}
						<div className='bg-white rounded-xl border border-outline-variant p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)]'>
							<h3 className='font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-3'>Tipo de Evento</h3>
							<div className='space-y-2'>
								{[
									{ key: 'culto', label: 'Culto Regular' },
									{ key: 'vigilia', label: 'Vigilia' },
									{ key: 'ayuno', label: 'Ayuno' },
									{ key: 'equipo', label: 'Reunión de Equipo' },
									{ key: 'gdc', label: 'GDC Especial' },
									{ key: 'semana', label: 'Semana Especial' },
								].map(({ key, label }) => (
									<div key={key} className='flex items-center gap-2'>
										<span className={`w-3 h-3 rounded-sm ${(EVENT_TYPE_COLOR[key] ?? '').split(' ')[0]}`} />
										<span className='font-body-sm text-body-sm text-on-surface-variant'>{label}</span>
									</div>
								))}
							</div>
						</div>

						{/* Upcoming events */}
						<div className='bg-white rounded-xl border border-outline-variant p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex-1'>
							<h3 className='font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-3'>Próximos Especiales</h3>
							{monthEvents.length === 0 ? (
								<p className='font-body-sm text-body-sm text-on-surface-variant text-center py-4'>Sin eventos especiales registrados este mes.</p>
							) : (
								<div className='space-y-3'>
									{monthEvents.map((ev) => (
										<div key={ev.id} className={`p-3 rounded-lg flex items-start gap-2 ${EVENT_TYPE_COLOR[ev.eventType] ?? ''}`}>
											<button
												type='button'
												onClick={() => openEdit(ev)}
												className='flex-1 text-left min-w-0 hover:opacity-80 transition-[opacity]'
												title='Editar evento'
											>
												<p className='font-label-md text-label-md truncate'>{ev.title}</p>
												<p className='font-body-sm text-body-sm opacity-80'>Día {ev.day} · {ev.ministry || 'General'}</p>
											</button>
											<div className='flex items-center gap-0.5 shrink-0'>
												<button
													type='button'
													onClick={() => openEdit(ev)}
													title='Editar'
													className='p-1 rounded hover:bg-black/10 transition-[background-color]'
												>
													<span className='material-symbols-outlined text-[18px]'>edit</span>
												</button>
												<button
													type='button'
													onClick={() => deleteEvent(ev.id)}
													title='Eliminar'
													className='p-1 rounded hover:bg-black/10 transition-[background-color]'
												>
													<span className='material-symbols-outlined text-[18px]'>delete</span>
												</button>
											</div>
										</div>
									))}
								</div>
							)}
						</div>

						{/* Add event */}
						<button
							onClick={() => openNew()}
							className='w-full py-3 bg-primary text-on-primary rounded-xl font-label-md text-label-md hover:opacity-90 transition-[opacity] flex items-center justify-center gap-2 shadow-sm'
						>
							<span className='material-symbols-outlined' style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
							Añadir Evento
						</button>
					</div>
				</div>
			</div>

			{/* Add Event Modal */}
			{isModalOpen && (
				<div className='fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4' onClick={(e) => e.target === e.currentTarget && closeModal()}>
					<div className='bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden'>
						<div className='flex items-center justify-between p-6 border-b border-outline-variant bg-surface-bright'>
							<h2 className='font-headline-md text-on-surface'>{editingId !== null ? 'Editar Evento' : 'Crear Nuevo Evento'}</h2>
							<button onClick={closeModal} className='p-2 rounded-full hover:bg-surface-container transition-[background-color] text-on-surface-variant'>
								<span className='material-symbols-outlined'>close</span>
							</button>
						</div>
						<div className='p-6 overflow-y-auto space-y-5'>
							<div>
								<label className='block font-label-sm text-label-sm text-on-surface-variant mb-1'>Tipo de Evento</label>
								<div className='grid grid-cols-3 gap-2'>
									{[['culto','Culto'],['vigilia','Vigilia'],['ayuno','Ayuno'],['equipo','Reunión Equipo'],['gdc','GDC Especial'],['semana','Sem. Especial']].map(([k,l]) => (
										<button
											key={k}
											onClick={() =>
												setForm((f) =>
													k === 'semana'
														? {
																...f,
																eventType: k,
																startDate: f.startDate || f.date,
																endDate: f.endDate || f.date,
															}
														: { ...f, eventType: k },
												)
											}
											className={`px-3 py-2 rounded-lg font-label-sm text-label-sm border transition-[background-color,border-color] ${form.eventType === k ? `${EVENT_TYPE_COLOR[k]} border-transparent` : 'border-outline-variant text-on-surface-variant hover:bg-surface-container'}`}
										>
											{l}
										</button>
									))}
								</div>
							</div>
							<div>
								<label className='block font-label-sm text-label-sm text-on-surface-variant mb-1'>Título</label>
								<input type='text' value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder='ej. Vigilia de Oración Jóvenes' className='w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-lowest text-on-surface font-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-[box-shadow]' />
							</div>
							{form.eventType === 'semana' && editingId === null ? (
								<>
									<div className='grid grid-cols-2 gap-4'>
										<div>
											<label className='block font-label-sm text-label-sm text-on-surface-variant mb-1'>Fecha de inicio</label>
											<input type='date' value={form.startDate} onChange={(e) => setRange({ startDate: e.target.value })} className='w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-lowest text-on-surface font-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-[box-shadow]' />
										</div>
										<div>
											<label className='block font-label-sm text-label-sm text-on-surface-variant mb-1'>Fecha de cierre</label>
											<input type='date' value={form.endDate} min={form.startDate || undefined} onChange={(e) => setRange({ endDate: e.target.value })} className='w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-lowest text-on-surface font-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-[box-shadow]' />
										</div>
									</div>
									<div>
										<label className='block font-label-sm text-label-sm text-on-surface-variant mb-1'>Días de la semana</label>
										<div className='flex flex-wrap gap-2'>
											{DAY_NAMES.map((name, dow) => {
												const selected = form.weekDays.includes(dow);
												const available = availableDows.has(dow);
												return (
													<button
														key={dow}
														type='button'
														disabled={!available}
														onClick={() => toggleWeekDay(dow)}
														aria-pressed={selected}
														className={`w-11 h-11 rounded-full font-label-sm text-label-sm border transition-[background-color,border-color] ${
															selected
																? 'bg-primary text-on-primary border-primary'
																: available
																	? 'border-outline-variant text-on-surface-variant hover:bg-surface-container'
																	: 'border-outline-variant/40 text-on-surface-variant/40 cursor-not-allowed'
														}`}
													>
														{name}
													</button>
												);
											})}
										</div>
										<p className='font-body-sm text-body-sm text-on-surface-variant mt-1.5'>
											{availableDows.size === 0
												? 'Selecciona primero la fecha de inicio y de cierre.'
												: 'Solo se muestran los días que caen dentro del rango. El evento se repetirá esos días.'}
										</p>
									</div>
									<div>
										<label className='block font-label-sm text-label-sm text-on-surface-variant mb-1'>Hora</label>
										<input type='time' value={form.time} onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))} className='w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-lowest text-on-surface font-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-[box-shadow]' />
									</div>
								</>
							) : (
								<div className='grid grid-cols-2 gap-4'>
									<div>
										<label className='block font-label-sm text-label-sm text-on-surface-variant mb-1'>Fecha</label>
										<input type='date' value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} className='w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-lowest text-on-surface font-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-[box-shadow]' />
									</div>
									<div>
										<label className='block font-label-sm text-label-sm text-on-surface-variant mb-1'>Hora</label>
										<input type='time' value={form.time} onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))} className='w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-lowest text-on-surface font-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-[box-shadow]' />
									</div>
								</div>
							)}
							<div>
								<label className='block font-label-sm text-label-sm text-on-surface-variant mb-1'>Ministerio Responsable</label>
								<div className='relative'>
									<select value={form.ministry} onChange={(e) => setForm((f) => ({ ...f, ministry: e.target.value }))} className='w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-lowest text-on-surface font-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none transition-[box-shadow]'>
										<option value=''>Seleccionar...</option>
										{MINISTRIES.map((m) => <option key={m} value={m}>{m}</option>)}
									</select>
									<span className='material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant'>expand_more</span>
								</div>
							</div>
							<div>
								<label className='block font-label-sm text-label-sm text-on-surface-variant mb-1'>Lugar</label>
								<input type='text' value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} placeholder='ej. Auditorio Principal' className='w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-lowest text-on-surface font-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-[box-shadow]' />
							</div>
							<div>
								<label className='block font-label-sm text-label-sm text-on-surface-variant mb-1'>Notas</label>
								<textarea rows={2} value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} placeholder='Detalles adicionales...' className='w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-lowest text-on-surface font-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none transition-[box-shadow]' />
							</div>
						</div>
						<div className='p-6 border-t border-outline-variant bg-surface-bright flex items-center justify-end gap-3'>
							{editingId !== null && (
								<button
									onClick={() => deleteEvent(editingId)}
									className='mr-auto flex items-center gap-2 px-5 py-2 rounded-lg font-label-md text-label-md text-error border border-error/40 hover:bg-error-container/30 transition-[background-color]'
								>
									<span className='material-symbols-outlined text-[18px]'>delete</span>
									Eliminar
								</button>
							)}
							<button onClick={closeModal} className='px-5 py-2 rounded-lg font-label-md text-label-md text-primary border border-outline-variant hover:bg-surface-container transition-[background-color]'>
								Cancelar
							</button>
							<button onClick={saveEvent} className='px-5 py-2 rounded-lg font-label-md text-label-md bg-primary text-on-primary hover:opacity-90 transition-[opacity] shadow-sm'>
								{editingId !== null ? 'Guardar Cambios' : 'Guardar Evento'}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

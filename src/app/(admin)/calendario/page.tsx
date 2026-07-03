'use client';

import { useState } from 'react';

const MONTH_NAMES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DAY_NAMES = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];

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
	title: string;
	eventType: string;
	ministry: string;
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

	// form state
	const [form, setForm] = useState({ title: '', date: '', time: '', eventType: 'culto', ministry: '', location: '', notes: '' });

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

	const getCustom = (dayNum: number) =>
		customEvents.filter((e) => e.day === dayNum);

	const saveEvent = () => {
		if (!form.title || !form.date) return;
		const d = new Date(form.date);
		if (d.getFullYear() !== year || d.getMonth() !== month) {
			setIsModalOpen(false);
			return;
		}
		setCustomEvents((prev) => [
			...prev,
			{ id: nextId, day: d.getDate(), title: form.title, eventType: form.eventType, ministry: form.ministry },
		]);
		setNextId((n) => n + 1);
		setForm({ title: '', date: '', time: '', eventType: 'culto', ministry: '', location: '', notes: '' });
		setIsModalOpen(false);
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
										onClick={() => { if (inMonth) { setForm((f) => ({ ...f, date: `${year}-${String(month + 1).padStart(2,'0')}-${String(dayNum).padStart(2,'0')}` })); setIsModalOpen(true); } }}
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
											<div key={ev.id} className={`${EVENT_TYPE_COLOR[ev.eventType] ?? 'bg-surface-container text-on-surface'} font-label-sm px-1 py-0.5 rounded mb-0.5 truncate text-[10px] leading-tight`}>{ev.title}</div>
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
							{customEvents.length === 0 ? (
								<p className='font-body-sm text-body-sm text-on-surface-variant text-center py-4'>Sin eventos especiales registrados este mes.</p>
							) : (
								<div className='space-y-3'>
									{customEvents.map((ev) => (
										<div key={ev.id} className={`p-3 rounded-lg ${EVENT_TYPE_COLOR[ev.eventType] ?? ''}`}>
											<p className='font-label-md text-label-md'>{ev.title}</p>
											<p className='font-body-sm text-body-sm opacity-80'>Día {ev.day} · {ev.ministry || 'General'}</p>
										</div>
									))}
								</div>
							)}
						</div>

						{/* Add event */}
						<button
							onClick={() => setIsModalOpen(true)}
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
				<div className='fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4' onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}>
					<div className='bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] w-full max-w-lg flex flex-col overflow-hidden'>
						<div className='flex items-center justify-between p-6 border-b border-outline-variant bg-surface-bright'>
							<h2 className='font-headline-md text-on-surface'>Crear Nuevo Evento</h2>
							<button onClick={() => setIsModalOpen(false)} className='p-2 rounded-full hover:bg-surface-container transition-[background-color] text-on-surface-variant'>
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
											onClick={() => setForm((f) => ({ ...f, eventType: k }))}
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
						<div className='p-6 border-t border-outline-variant bg-surface-bright flex justify-end gap-3'>
							<button onClick={() => setIsModalOpen(false)} className='px-5 py-2 rounded-lg font-label-md text-label-md text-primary border border-outline-variant hover:bg-surface-container transition-[background-color]'>
								Cancelar
							</button>
							<button onClick={saveEvent} className='px-5 py-2 rounded-lg font-label-md text-label-md bg-primary text-on-primary hover:opacity-90 transition-[opacity] shadow-sm'>
								Guardar Evento
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

'use client';

import { useMemo, useState } from 'react';

import { type AttendanceRecord } from '@/lib/miembros';
import { toLocalIso } from '@/lib/format';

const MONTH_NAMES = [
	'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
	'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];
const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

const KIND_CHIP: Record<AttendanceRecord['kind'], string> = {
	culto: 'bg-tertiary-container text-on-tertiary-container',
	ministerio: 'bg-primary-container text-on-primary-container',
	evento: 'bg-secondary-container text-on-secondary-container',
};

export default function MemberAttendanceCalendar({
	attendance,
}: {
	attendance: AttendanceRecord[];
}) {
	const today = new Date();
	const [viewDate, setViewDate] = useState(
		new Date(today.getFullYear(), today.getMonth(), 1),
	);

	// Índice de asistencia por fecha para búsqueda O(1) por celda.
	const byDate = useMemo(() => {
		const map = new Map<string, AttendanceRecord[]>();
		for (const rec of attendance) {
			const arr = map.get(rec.date) ?? [];
			arr.push(rec);
			map.set(rec.date, arr);
		}
		return map;
	}, [attendance]);

	const year = viewDate.getFullYear();
	const month = viewDate.getMonth();
	const firstDayOfWeek = new Date(year, month, 1).getDay();
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	const daysInPrevMonth = new Date(year, month, 0).getDate();
	const totalCells = Math.ceil((firstDayOfWeek + daysInMonth) / 7) * 7;

	// Resumen del mes visible.
	const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
	const monthRecords = attendance.filter((r) => r.date.startsWith(monthPrefix));
	const attendedDays = new Set(monthRecords.map((r) => r.date)).size;

	return (
		<div className='bg-surface rounded-xl border border-outline-variant overflow-hidden'>
			{/* Cabecera con navegación */}
			<div className='flex items-center justify-between gap-3 p-4 border-b border-outline-variant'>
				<div>
					<h3 className='font-headline-md text-[18px] text-on-surface'>
						{MONTH_NAMES[month]} {year}
					</h3>
					<p className='font-body-sm text-body-sm text-on-surface-variant text-[11px]'>
						{attendedDays} {attendedDays === 1 ? 'día de asistencia' : 'días de asistencia'} este mes
					</p>
				</div>
				<div className='flex items-center gap-1 bg-surface-container-low rounded-lg p-1 border border-outline-variant'>
					<button
						onClick={() => setViewDate(new Date(year, month - 1, 1))}
						aria-label='Mes anterior'
						className='p-1.5 rounded hover:bg-surface-container transition-[background-color] text-on-surface-variant'
					>
						<span className='material-symbols-outlined text-[20px]'>chevron_left</span>
					</button>
					<button
						onClick={() => setViewDate(new Date(today.getFullYear(), today.getMonth(), 1))}
						className='px-3 py-1 rounded font-label-sm text-label-sm text-on-surface hover:bg-surface-container transition-[background-color]'
					>
						Hoy
					</button>
					<button
						onClick={() => setViewDate(new Date(year, month + 1, 1))}
						aria-label='Mes siguiente'
						className='p-1.5 rounded hover:bg-surface-container transition-[background-color] text-on-surface-variant'
					>
						<span className='material-symbols-outlined text-[20px]'>chevron_right</span>
					</button>
				</div>
			</div>

			{/* Encabezado de días */}
			<div className='grid grid-cols-7 border-b border-outline-variant bg-surface-container-lowest'>
				{DAY_NAMES.map((d) => (
					<div
						key={d}
						className='py-2 text-center font-label-sm text-label-sm text-on-surface-variant'
					>
						{d}
					</div>
				))}
			</div>

			{/* Celdas */}
			<div
				className='grid grid-cols-7 bg-outline-variant gap-[1px]'
				style={{ gridTemplateRows: `repeat(${totalCells / 7}, minmax(56px, 1fr))` }}
			>
				{Array.from({ length: totalCells }).map((_, i) => {
					const dayNum = i - firstDayOfWeek + 1;
					const inMonth = dayNum >= 1 && dayNum <= daysInMonth;
					const display = inMonth
						? dayNum
						: dayNum < 1
							? daysInPrevMonth + dayNum
							: dayNum - daysInMonth;
					const iso = inMonth ? toLocalIso(new Date(year, month, dayNum)) : '';
					const records = inMonth ? byDate.get(iso) : undefined;
					const attended = !!records && records.length > 0;
					const isToday =
						inMonth &&
						dayNum === today.getDate() &&
						month === today.getMonth() &&
						year === today.getFullYear();

					return (
						<div
							key={i}
							className={`p-1 flex flex-col gap-0.5 ${
								!inMonth
									? 'bg-surface-bright opacity-40'
									: attended
										? 'bg-tertiary-fixed/40'
										: 'bg-surface'
							}`}
						>
							<span className='flex justify-between items-center'>
								{isToday ? (
									<span className='w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center text-[11px] font-bold'>
										{display}
									</span>
								) : (
									<span
										className={`font-label-sm text-label-sm ${
											inMonth ? 'text-on-surface' : 'text-on-surface-variant'
										}`}
									>
										{display}
									</span>
								)}
								{attended && (
									<span
										className='material-symbols-outlined text-[14px] text-tertiary'
										style={{ fontVariationSettings: "'FILL' 1" }}
									>
										check_circle
									</span>
								)}
							</span>
							{records?.map((rec, ri) => (
								<div
									key={ri}
									className={`${KIND_CHIP[rec.kind]} font-label-sm px-1 py-0.5 rounded truncate text-[9px] leading-tight`}
									title={rec.label}
								>
									{rec.label}
								</div>
							))}
						</div>
					);
				})}
			</div>

			{/* Leyenda */}
			<div className='flex flex-wrap gap-x-4 gap-y-2 p-4 border-t border-outline-variant'>
				<div className='flex items-center gap-1.5'>
					<span className='w-3 h-3 rounded-sm bg-tertiary-fixed/60' />
					<span className='font-body-sm text-body-sm text-on-surface-variant'>Asistió</span>
				</div>
				<div className='flex items-center gap-1.5'>
					<span className='w-3 h-3 rounded-sm bg-tertiary-container' />
					<span className='font-body-sm text-body-sm text-on-surface-variant'>Culto</span>
				</div>
				<div className='flex items-center gap-1.5'>
					<span className='w-3 h-3 rounded-sm bg-primary-container' />
					<span className='font-body-sm text-body-sm text-on-surface-variant'>Ministerio</span>
				</div>
			</div>
		</div>
	);
}

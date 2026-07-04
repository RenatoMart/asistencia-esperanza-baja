'use client';

import Link from 'next/link';

import {
	type ConvertidoStatus,
	getMentor,
	groupByDate,
	initials,
	STATUS_META,
} from '@/lib/convertidos';
import { useConvertidos } from '@/lib/convertidos-store';

const ORDER: ConvertidoStatus[] = ['nuevo', 'proceso', 'consolidado'];

const BAR_COLOR: Record<ConvertidoStatus, string> = {
	nuevo: 'bg-primary',
	proceso: 'bg-secondary',
	consolidado: 'bg-tertiary',
};

export default function NuevosConvertidosPanel() {
	const { convertidos } = useConvertidos();

	const counts = ORDER.reduce(
		(acc, s) => ({ ...acc, [s]: convertidos.filter((c) => c.status === s).length }),
		{} as Record<ConvertidoStatus, number>,
	);
	const total = convertidos.length;
	const sinMentor = convertidos.filter((c) => !c.mentorId).length;

	// Solo los dos grupos de fecha más recientes para no saturar el panel.
	const groups = groupByDate(convertidos).slice(0, 2);

	return (
		<div className='bg-surface rounded-xl p-6 border border-outline-variant shadow-sm space-y-5'>
			<div className='flex justify-between items-end'>
				<div>
					<h3 className='font-headline-md text-headline-md text-on-surface'>
						Nuevos Convertidos
					</h3>
					<p className='font-body-sm text-body-sm text-on-surface-variant mt-1'>
						Consolidación por fecha de registro
					</p>
				</div>
				<Link
					href='/convertidos'
					className='text-primary font-label-sm text-label-sm hover:underline shrink-0'
				>
					Ver Todo
				</Link>
			</div>

			{/* Mini visualización: distribución por estado */}
			<div>
				<div className='flex h-2.5 w-full overflow-hidden rounded-full bg-surface-container'>
					{total > 0 &&
						ORDER.map((s) =>
							counts[s] > 0 ? (
								<div
									key={s}
									className={BAR_COLOR[s]}
									style={{ width: `${(counts[s] / total) * 100}%` }}
								/>
							) : null,
						)}
				</div>
				<div className='mt-3 flex flex-wrap gap-x-5 gap-y-2'>
					{ORDER.map((s) => (
						<div key={s} className='flex items-center gap-2'>
							<span className={`w-2.5 h-2.5 rounded-full ${STATUS_META[s].dot}`} />
							<span className='font-label-md text-label-md text-on-surface'>{counts[s]}</span>
							<span className='font-body-sm text-body-sm text-on-surface-variant'>
								{STATUS_META[s].label}
							</span>
						</div>
					))}
				</div>
			</div>

			{sinMentor > 0 && (
				<Link
					href='/convertidos'
					className='flex items-center gap-2 px-3 py-2 rounded-lg bg-error-container/40 text-on-error-container hover:bg-error-container/60 transition-[background-color]'
				>
					<span className='material-symbols-outlined text-[18px]'>person_alert</span>
					<span className='font-label-sm text-label-sm'>
						{sinMentor} {sinMentor === 1 ? 'convertido sin mentor asignado' : 'convertidos sin mentor asignado'}
					</span>
					<span className='material-symbols-outlined text-[16px] ml-auto'>chevron_right</span>
				</Link>
			)}

			{/* Lista agrupada por fecha */}
			<div className='space-y-4'>
				{groups.length === 0 && (
					<p className='font-body-sm text-body-sm text-on-surface-variant'>
						Aún no hay convertidos registrados.
					</p>
				)}
				{groups.map((group) => (
					<div key={group.iso}>
						<p className='font-label-sm text-label-sm text-on-surface-variant mb-2'>
							{group.label}
						</p>
						<div className='space-y-2'>
							{group.items.map((c) => {
								const mentor = getMentor(c.mentorId);
								return (
									<Link
										key={c.id}
										href={`/convertidos/${c.id}`}
										className='flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-surface-container transition-[background-color]'
									>
										<div className='w-9 h-9 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center font-label-md text-label-md select-none shrink-0'>
											{initials(c.fullName)}
										</div>
										<div className='min-w-0 flex-1'>
											<p className='font-body-md text-body-md text-on-surface truncate'>
												{c.fullName}
											</p>
											<p className='font-body-sm text-body-sm text-on-surface-variant text-[11px] truncate'>
												{mentor ? `Mentor: ${mentor.name}` : 'Sin mentor'}
											</p>
										</div>
										<span
											className={`shrink-0 px-2 py-0.5 rounded-full font-label-sm text-label-sm ${STATUS_META[c.status].chip}`}
										>
											{STATUS_META[c.status].label}
										</span>
									</Link>
								);
							})}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

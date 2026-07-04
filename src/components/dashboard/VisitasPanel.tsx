'use client';

import Link from 'next/link';

import { groupByDate, initials } from '@/lib/format';
import {
	getResponsable,
	type VisitaStatus,
	VISITA_STATUS_META,
} from '@/lib/visitas';
import { useVisitas } from '@/lib/visitas-store';

const ORDER: VisitaStatus[] = ['nueva', 'seguimiento', 'integrada', 'inactiva'];

const BAR_COLOR: Record<VisitaStatus, string> = {
	nueva: 'bg-secondary',
	seguimiento: 'bg-primary',
	integrada: 'bg-tertiary',
	inactiva: 'bg-outline',
};

export default function VisitasPanel() {
	const { visitas } = useVisitas();

	const counts = ORDER.reduce(
		(acc, s) => ({ ...acc, [s]: visitas.filter((v) => v.status === s).length }),
		{} as Record<VisitaStatus, number>,
	);
	const total = visitas.length;
	const sinResponsable = visitas.filter((v) => !v.assignedTo).length;
	const groups = groupByDate(visitas).slice(0, 2);

	return (
		<div className='bg-surface rounded-xl p-6 border border-outline-variant shadow-sm space-y-5'>
			<div className='flex justify-between items-end'>
				<div>
					<h3 className='font-headline-md text-headline-md text-on-surface'>Visitas</h3>
					<p className='font-body-sm text-body-sm text-on-surface-variant mt-1'>
						Seguimiento por fecha de visita
					</p>
				</div>
				<Link
					href='/visitas'
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
							<span className={`w-2.5 h-2.5 rounded-full ${VISITA_STATUS_META[s].dot}`} />
							<span className='font-label-md text-label-md text-on-surface'>{counts[s]}</span>
							<span className='font-body-sm text-body-sm text-on-surface-variant'>
								{VISITA_STATUS_META[s].label}
							</span>
						</div>
					))}
				</div>
			</div>

			{sinResponsable > 0 && (
				<Link
					href='/visitas'
					className='flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary-container/40 text-on-secondary-container hover:bg-secondary-container/60 transition-[background-color]'
				>
					<span className='material-symbols-outlined text-[18px]'>assignment_late</span>
					<span className='font-label-sm text-label-sm'>
						{sinResponsable} {sinResponsable === 1 ? 'visita sin responsable' : 'visitas sin responsable'} de seguimiento
					</span>
					<span className='material-symbols-outlined text-[16px] ml-auto'>chevron_right</span>
				</Link>
			)}

			{/* Lista agrupada por fecha */}
			<div className='space-y-4'>
				{groups.length === 0 && (
					<p className='font-body-sm text-body-sm text-on-surface-variant'>
						Aún no hay visitas registradas.
					</p>
				)}
				{groups.map((group) => (
					<div key={group.iso}>
						<p className='font-label-sm text-label-sm text-on-surface-variant mb-2'>
							{group.label}
						</p>
						<div className='space-y-2'>
							{group.items.map((v) => {
								const resp = getResponsable(v.assignedTo);
								return (
									<Link
										key={v.id}
										href={`/visitas/${v.id}`}
										className='flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-surface-container transition-[background-color]'
									>
										<div className='w-9 h-9 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-label-md text-label-md select-none shrink-0'>
											{initials(v.fullName)}
										</div>
										<div className='min-w-0 flex-1'>
											<p className='font-body-md text-body-md text-on-surface truncate'>
												{v.fullName}
											</p>
											<p className='font-body-sm text-body-sm text-on-surface-variant text-[11px] truncate'>
												{resp ? `Responsable: ${resp.name}` : 'Sin responsable'}
											</p>
										</div>
										<span
											className={`shrink-0 px-2 py-0.5 rounded-full font-label-sm text-label-sm ${VISITA_STATUS_META[v.status].chip}`}
										>
											{VISITA_STATUS_META[v.status].label}
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

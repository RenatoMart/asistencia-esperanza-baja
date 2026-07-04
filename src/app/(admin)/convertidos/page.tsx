'use client';

import Link from 'next/link';
import { useState } from 'react';

import {
	type ConvertidoStatus,
	getMentor,
	groupByDate,
	initials,
	STATUS_META,
} from '@/lib/convertidos';
import { useConvertidos } from '@/lib/convertidos-store';

type Filter = 'todos' | ConvertidoStatus;

const FILTERS: { key: Filter; label: string }[] = [
	{ key: 'todos', label: 'Todos' },
	{ key: 'nuevo', label: 'Nuevos' },
	{ key: 'proceso', label: 'En consolidación' },
	{ key: 'consolidado', label: 'Consolidados' },
];

export default function ConvertidosPage() {
	const { convertidos } = useConvertidos();
	const [search, setSearch] = useState('');
	const [filter, setFilter] = useState<Filter>('todos');

	const filtered = convertidos.filter((c) => {
		const matchStatus = filter === 'todos' || c.status === filter;
		const q = search.trim().toLowerCase();
		const matchSearch =
			!q ||
			c.fullName.toLowerCase().includes(q) ||
			c.phone.toLowerCase().includes(q) ||
			c.address.toLowerCase().includes(q);
		return matchStatus && matchSearch;
	});

	const groups = groupByDate(filtered);
	const sinMentor = convertidos.filter((c) => !c.mentorId).length;

	return (
		<main className='p-4 md:p-margin-desktop pb-28 md:pb-margin-desktop bg-surface-container-low min-h-full'>
			<div className='max-w-container-max mx-auto space-y-6'>
				{/* Encabezado */}
				<div className='flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3'>
					<div>
						<h1 className='font-headline-lg text-headline-md sm:text-headline-lg text-on-surface'>
							Nuevos Convertidos
						</h1>
						<p className='font-body-sm text-body-sm text-on-surface-variant mt-1'>
							{convertidos.length} personas en proceso de consolidación
							{sinMentor > 0 ? ` · ${sinMentor} sin mentor` : ''}
						</p>
					</div>
					<Link
						href='/asistencia'
						className='flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] bg-tertiary text-on-tertiary rounded-full font-label-md text-label-md hover:opacity-90 transition-[opacity] shadow-sm'
					>
						<span className='material-symbols-outlined text-[18px]'>add</span>
						Registrar desde Asistencia
					</Link>
				</div>

				{/* Controles */}
				<div className='bg-surface rounded-xl p-4 border border-outline-variant space-y-3'>
					<div className='relative'>
						<span className='material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]'>
							search
						</span>
						<input
							type='text'
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder='Buscar por nombre, teléfono o dirección...'
							className='w-full pl-10 pr-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg font-body-sm focus:ring-primary focus:border-primary outline-none transition-[box-shadow]'
						/>
					</div>
					<div className='flex gap-2 overflow-x-auto pb-1 -mb-1'>
						{FILTERS.map((f) => (
							<button
								key={f.key}
								onClick={() => setFilter(f.key)}
								className={`shrink-0 px-4 py-2 min-h-[40px] rounded-full font-label-md text-label-md transition-[background-color,color] ${
									filter === f.key
										? 'bg-primary text-on-primary'
										: 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
								}`}
							>
								{f.label}
							</button>
						))}
					</div>
				</div>

				{/* Lista agrupada por fecha */}
				{groups.length === 0 ? (
					<div className='bg-surface rounded-xl p-10 border border-outline-variant text-center'>
						<span className='material-symbols-outlined text-outline text-[40px]'>
							search_off
						</span>
						<p className='font-body-md text-body-md text-on-surface-variant mt-2'>
							No se encontraron convertidos con esos criterios.
						</p>
					</div>
				) : (
					<div className='space-y-6'>
						{groups.map((group) => (
							<section key={group.iso}>
								<div className='flex items-center gap-2 mb-3'>
									<span className='material-symbols-outlined text-[18px] text-on-surface-variant'>
										calendar_today
									</span>
									<h2 className='font-headline-md text-[18px] text-on-surface'>
										{group.label}
									</h2>
									<span className='px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm'>
										{group.items.length}
									</span>
								</div>
								<div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
									{group.items.map((c) => {
										const mentor = getMentor(c.mentorId);
										return (
											<Link
												key={c.id}
												href={`/convertidos/${c.id}`}
												className='bg-surface rounded-xl p-4 border border-outline-variant hover:shadow-md transition-[box-shadow] flex items-center gap-3'
											>
												<div className='w-11 h-11 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center font-label-md text-label-md select-none shrink-0'>
													{initials(c.fullName)}
												</div>
												<div className='min-w-0 flex-1'>
													<div className='flex items-center gap-2'>
														<p className='font-body-md text-body-md text-on-surface truncate'>
															{c.fullName}
														</p>
													</div>
													<p className='font-body-sm text-body-sm text-on-surface-variant text-[11px] truncate'>
														{c.age ? `${c.age} años · ` : ''}
														{mentor ? `Mentor: ${mentor.name}` : 'Sin mentor'}
													</p>
												</div>
												<div className='flex flex-col items-end gap-1 shrink-0'>
													<span
														className={`px-2 py-0.5 rounded-full font-label-sm text-label-sm ${STATUS_META[c.status].chip}`}
													>
														{STATUS_META[c.status].label}
													</span>
													{c.consolidation.length > 0 && (
														<span className='flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant'>
															<span className='material-symbols-outlined text-[14px]'>
																history_edu
															</span>
															{c.consolidation.length}
														</span>
													)}
												</div>
											</Link>
										);
									})}
								</div>
							</section>
						))}
					</div>
				)}
			</div>
		</main>
	);
}

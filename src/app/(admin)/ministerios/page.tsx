'use client';

import { useState } from 'react';

type MinistryCategory = 'principales' | 'apoyo' | 'gdc' | 'campos';
type MinistryKind = 'standard' | 'gdc' | 'campo';

interface Ministry {
	id: string;
	cat: MinistryCategory;
	kind: MinistryKind;
	name: string;
	day: string;
	icon: string;
	iconBg: string;
	leader: string | null;
	initials: string;
	count: number;
	location?: string;
	bautizados?: number;
	congregantes?: number;
	adolescentes?: number;
	ninos?: number;
	gdcName?: string | null;
}

interface TeamMember {
	initials: string;
	name: string;
	email: string;
	role: string;
	roleBadge: string;
	joined: string;
}

const ALL: Ministry[] = [
	{ id: 'eslider', cat: 'principales', kind: 'standard', name: 'EsLider', day: 'Martes', icon: 'auto_stories', iconBg: 'bg-primary-container text-on-primary-container', leader: 'Roberto Díaz', initials: 'RD', count: 32 },
	{ id: 'oracion', cat: 'principales', kind: 'standard', name: 'Oración', day: 'Miércoles', icon: 'volunteer_activism', iconBg: 'bg-tertiary-container text-on-tertiary-container', leader: 'Ana María Torres', initials: 'AT', count: 18 },
	{ id: 'caballeros', cat: 'principales', kind: 'standard', name: 'Caballeros', day: 'Jueves', icon: 'man', iconBg: 'bg-secondary-container text-on-secondary-container', leader: 'Carlos Rivera', initials: 'CR', count: 24 },
	{ id: 'damas', cat: 'principales', kind: 'standard', name: 'Damas', day: 'Jueves', icon: 'woman', iconBg: 'bg-tertiary-container text-on-tertiary-container', leader: 'Maria Gonzalez', initials: 'MG', count: 38 },
	{ id: 'jovenes', cat: 'principales', kind: 'standard', name: 'Jóvenes', day: 'Sábados', icon: 'local_fire_department', iconBg: 'bg-primary-container text-on-primary-container', leader: 'David Reyes', initials: 'DR', count: 45 },
	{ id: 'adolescentes', cat: 'principales', kind: 'standard', name: 'Adolescentes', day: 'Sábados', icon: 'school', iconBg: 'bg-secondary-container text-on-secondary-container', leader: null, initials: '', count: 22 },
	{ id: 'ninos', cat: 'principales', kind: 'standard', name: 'Niños', day: 'Domingos', icon: 'child_care', iconBg: 'bg-tertiary-container text-on-tertiary-container', leader: 'Sandra López', initials: 'SL', count: 67 },
	{ id: 'mayordoma', cat: 'apoyo', kind: 'standard', name: 'Mayordomía', day: '1er Domingo', icon: 'savings', iconBg: 'bg-secondary-container text-on-secondary-container', leader: 'Pedro Ramírez', initials: 'PR', count: 12 },
	{ id: 'servicio', cat: 'apoyo', kind: 'standard', name: 'Servicio Social', day: 'Variable', icon: 'favorite', iconBg: 'bg-error-container text-on-error-container', leader: 'Lucia Vega', initials: 'LV', count: 15 },
	{ id: 'evangelismo', cat: 'apoyo', kind: 'standard', name: 'Evangelismo', day: 'Variable', icon: 'campaign', iconBg: 'bg-primary-container text-on-primary-container', leader: 'Jose Mendez', initials: 'JM', count: 20 },
	{ id: 'gdc-jovenes', cat: 'gdc', kind: 'gdc', name: 'GDC Jóvenes', day: 'Viernes', icon: 'diversity_3', iconBg: 'bg-primary-container text-on-primary-container', leader: 'Martin Cruz', initials: 'MC', count: 18, gdcName: 'GDC Jóvenes' },
	{ id: 'gdc-adolescentes', cat: 'gdc', kind: 'gdc', name: 'GDC Adolescentes', day: 'Viernes', icon: 'diversity_3', iconBg: 'bg-secondary-container text-on-secondary-container', leader: 'Fernanda Ríos', initials: 'FR', count: 14, gdcName: 'GDC Adolescentes' },
	{ id: 'gdc-renuevo', cat: 'gdc', kind: 'gdc', name: 'GDC El Renuevo', day: 'Viernes', icon: 'diversity_3', iconBg: 'bg-tertiary-container text-on-tertiary-container', leader: 'Alfonso Paz', initials: 'AP', count: 11, gdcName: 'El Renuevo' },
	{ id: 'gdc-otros', cat: 'gdc', kind: 'gdc', name: 'GDC (Sin nombre)', day: 'Viernes', icon: 'diversity_3', iconBg: 'bg-surface-container-high text-on-surface-variant', leader: 'Roxana Mejia', initials: 'RM', count: 9, gdcName: null },
	{ id: 'campo-victor', cat: 'campos', kind: 'campo', name: 'Víctor Raúl', day: 'Variable', icon: 'church', iconBg: 'bg-primary-container text-on-primary-container', leader: 'Pastor Eliseo Chávez', initials: 'EC', count: 43, location: 'Víctor Raúl, Trujillo', bautizados: 43, congregantes: 28, adolescentes: 12, ninos: 19 },
	{ id: 'campo-alto', cat: 'campos', kind: 'campo', name: 'Alto Trujillo', day: 'Variable', icon: 'church', iconBg: 'bg-secondary-container text-on-secondary-container', leader: 'Pastor Néstor Quispe', initials: 'NQ', count: 27, location: 'Alto Trujillo, La Esperanza', bautizados: 27, congregantes: 15, adolescentes: 8, ninos: 11 },
	{ id: 'campo-pampas', cat: 'campos', kind: 'campo', name: 'Pampas de San Juan', day: 'Variable', icon: 'church', iconBg: 'bg-tertiary-container text-on-tertiary-container', leader: null, initials: '', count: 15, location: 'Pampas de San Juan, Trujillo', bautizados: 15, congregantes: 9, adolescentes: 4, ninos: 7 },
];

const CATEGORIES: { id: MinistryCategory; label: string; icon: string }[] = [
	{ id: 'principales', label: 'Ministerios Principales', icon: 'star' },
	{ id: 'apoyo', label: 'Ministerios de Apoyo', icon: 'handshake' },
	{ id: 'gdc', label: 'GDC — Grupos Dinámicos', icon: 'diversity_3' },
	{ id: 'campos', label: 'Campos Misioneros', icon: 'travel_explore' },
];

const TEAM: Record<string, TeamMember[]> = {
	caballeros: [
		{ initials: 'CR', name: 'Carlos Rivera', email: 'carlos.r@example.com', role: 'Líder', roleBadge: 'bg-primary-container text-on-primary-container', joined: 'Ene 2022' },
		{ initials: 'DC', name: 'David Chen', email: 'david.c@example.com', role: 'Sub-líder', roleBadge: 'bg-tertiary-container text-on-tertiary-container', joined: 'Mar 2023' },
		{ initials: 'JS', name: 'John Smith', email: 'No registrado', role: 'Ayudante', roleBadge: 'border border-outline-variant text-on-surface-variant', joined: 'Ago 2023' },
		{ initials: 'MR', name: 'Miguel Ramos', email: 'm.ramos@example.com', role: 'Miembro', roleBadge: '', joined: 'Nov 2023' },
	],
	damas: [
		{ initials: 'MG', name: 'Maria Gonzalez', email: 'maria.g@example.com', role: 'Líder', roleBadge: 'bg-primary-container text-on-primary-container', joined: 'Feb 2020' },
		{ initials: 'ST', name: 'Sofia Torres', email: 'sofia.t@example.com', role: 'Sub-líder', roleBadge: 'bg-tertiary-container text-on-tertiary-container', joined: 'Jun 2021' },
		{ initials: 'LV', name: 'Lucia Vega', email: 'l.vega@example.com', role: 'Ayudante', roleBadge: 'border border-outline-variant text-on-surface-variant', joined: 'Mar 2022' },
	],
	eslider: [
		{ initials: 'RD', name: 'Roberto Díaz', email: 'r.diaz@example.com', role: 'Líder', roleBadge: 'bg-primary-container text-on-primary-container', joined: 'Ene 2021' },
		{ initials: 'AT', name: 'Alicia Tello', email: 'a.tello@example.com', role: 'Facilitadora', roleBadge: 'bg-tertiary-container text-on-tertiary-container', joined: 'Abr 2021' },
	],
	oracion: [
		{ initials: 'AT', name: 'Ana María Torres', email: 'ana.t@example.com', role: 'Líder', roleBadge: 'bg-primary-container text-on-primary-container', joined: 'Mar 2020' },
	],
};

export default function MinisteriosPage() {
	const [selected, setSelected] = useState('eslider');

	const current = ALL.find((m) => m.id === selected)!;
	const team = TEAM[selected] ?? [];

	return (
		<div className='flex-1 p-4 md:p-margin-desktop min-h-full'>
			<div className='max-w-container-max mx-auto'>
				{/* Header */}
				<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6'>
					<div>
						<h2 className='font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background mb-1'>
							Gestión de Ministerios
						</h2>
						<p className='font-body-sm text-body-sm text-on-surface-variant'>
							Supervisa equipos, liderazgo y participación de todos los ministerios.
						</p>
					</div>
					<button className='flex items-center gap-2 px-4 py-2 bg-primary text-on-primary font-label-md text-label-md rounded-lg hover:opacity-90 transition-[opacity] shadow-sm shrink-0'>
						<span className='material-symbols-outlined text-[18px]' style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
						Nuevo Ministerio
					</button>
				</div>

				<div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
					{/* Left: grouped ministry list */}
					<div className='lg:col-span-4 bg-white border border-outline-variant rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col' style={{ maxHeight: '75vh' }}>
						<div className='px-4 pt-4 pb-2 border-b border-outline-variant shrink-0'>
							<div className='relative'>
								<span className='material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]'>search</span>
								<input type='text' placeholder='Buscar ministerio...' className='w-full pl-9 pr-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg font-body-sm text-on-surface text-sm focus:border-primary outline-none transition-[border-color]' />
							</div>
						</div>
						<div className='overflow-y-auto flex-1'>
							{CATEGORIES.map((cat) => {
								const items = ALL.filter((m) => m.cat === cat.id);
								return (
									<div key={cat.id}>
										<div className='px-4 py-2 flex items-center gap-2 bg-surface-container-low border-b border-outline-variant/50 sticky top-0 z-10'>
											<span className='material-symbols-outlined text-[14px] text-on-surface-variant'>{cat.icon}</span>
											<span className='font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider'>{cat.label}</span>
											<span className='ml-auto font-label-sm text-label-sm text-outline bg-surface-container rounded-full px-2'>{items.length}</span>
										</div>
										{items.map((m) => {
											const isActive = selected === m.id;
											return (
												<button
													key={m.id}
													onClick={() => setSelected(m.id)}
													className={`w-full px-4 py-3 flex items-center gap-3 border-b border-outline-variant/20 transition-[background-color] text-left ${isActive ? 'bg-secondary-container/40' : 'bg-white hover:bg-surface-container-low'}`}
												>
													<div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${m.iconBg}`}>
														<span className='material-symbols-outlined text-[16px]' style={{ fontVariationSettings: "'FILL' 1" }}>{m.icon}</span>
													</div>
													<div className='flex-1 min-w-0'>
														<div className={`font-label-md text-label-md truncate ${isActive ? 'text-primary' : 'text-on-surface'}`}>{m.name}</div>
														<div className='font-body-sm text-body-sm text-on-surface-variant text-[11px]'>{m.day}</div>
													</div>
													<div className='flex flex-col items-end shrink-0'>
														<span className={`font-label-sm text-label-sm ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}>{m.count}</span>
														{m.kind === 'campo' && <span className='text-[9px] font-semibold uppercase tracking-wider text-tertiary'>Campo</span>}
														{m.kind === 'gdc' && <span className='text-[9px] font-semibold uppercase tracking-wider text-secondary'>GDC</span>}
													</div>
												</button>
											);
										})}
									</div>
								);
							})}
						</div>
					</div>

					{/* Right: detail panel */}
					<div className='lg:col-span-8'>
						<div className='bg-white border border-outline-variant rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col overflow-hidden' style={{ minHeight: '75vh' }}>
							{/* Detail header */}
							<div className='p-5 border-b border-outline-variant bg-gradient-to-r from-surface to-surface-container-low flex flex-wrap justify-between items-start gap-3'>
								<div className='flex items-center gap-3'>
									<div className={`w-10 h-10 rounded-lg flex items-center justify-center ${current.iconBg}`}>
										<span className='material-symbols-outlined' style={{ fontVariationSettings: "'FILL' 1" }}>{current.icon}</span>
									</div>
									<div>
										<div className='flex items-center gap-2'>
											<h2 className='font-headline-md text-on-surface'>{current.name}</h2>
											{current.kind === 'campo' && (
												<span className='px-2 py-0.5 bg-tertiary-container text-on-tertiary-container font-label-sm text-label-sm rounded-full text-[10px] uppercase tracking-wider'>Campo Misionero</span>
											)}
											{current.kind === 'gdc' && (
												<span className='px-2 py-0.5 bg-secondary-container text-on-secondary-container font-label-sm text-label-sm rounded-full text-[10px] uppercase tracking-wider'>GDC</span>
											)}
										</div>
										<p className='font-body-sm text-body-sm text-on-surface-variant'>
											{current.location ?? `Reunión: ${current.day}`}
										</p>
									</div>
								</div>
								<div className='flex gap-2'>
									<button className='px-4 py-2 border border-outline text-on-surface font-label-md text-label-md rounded-lg hover:bg-surface-container-low transition-[background-color] bg-white shadow-sm'>
										Asignar Roles
									</button>
									<button className='px-4 py-2 bg-primary text-on-primary font-label-md text-label-md rounded-lg hover:opacity-90 transition-[opacity] shadow-sm flex items-center gap-2'>
										<span className='material-symbols-outlined text-[18px]' style={{ fontVariationSettings: "'FILL' 1" }}>person_add</span>
										Añadir
									</button>
								</div>
							</div>

							{/* Campo Misionero detail */}
							{current.kind === 'campo' && (
								<div className='flex-1 p-6 overflow-auto'>
									<div className='grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6'>
										{[
											{ label: 'Bautizados', value: current.bautizados ?? 0, color: 'text-primary', bg: 'bg-primary-container/20' },
											{ label: 'Congregantes', value: current.congregantes ?? 0, color: 'text-tertiary', bg: 'bg-tertiary-container/20' },
											{ label: 'Adolescentes', value: current.adolescentes ?? 0, color: 'text-secondary', bg: 'bg-secondary-container/20' },
											{ label: 'Niños', value: current.ninos ?? 0, color: 'text-on-surface', bg: 'bg-surface-container' },
										].map((s) => (
											<div key={s.label} className={`${s.bg} rounded-xl p-4 text-center`}>
												<div className={`font-display-lg text-[32px] ${s.color} font-bold`}>{s.value}</div>
												<div className='font-label-sm text-label-sm text-on-surface-variant mt-1'>{s.label}</div>
											</div>
										))}
									</div>
									<div className='bg-surface-container-low rounded-xl p-5 mb-4'>
										<h4 className='font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-3'>Pastor del Campo</h4>
										{current.leader ? (
											<div className='flex items-center gap-3'>
												<div className='w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-label-md text-label-md select-none border-2 border-primary/20'>
													{current.initials}
												</div>
												<div>
													<div className='font-label-md text-label-md text-on-surface'>{current.leader}</div>
													<div className='font-body-sm text-body-sm text-on-surface-variant'>Pastor Principal — {current.location}</div>
												</div>
											</div>
										) : (
											<div className='flex items-center gap-3 text-error'>
												<span className='material-symbols-outlined'>person_off</span>
												<span className='font-label-md text-label-md'>Sin pastor asignado</span>
											</div>
										)}
									</div>
									<div className='bg-surface-container-low rounded-xl p-5'>
										<h4 className='font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-3'>Cultos Programados</h4>
										<div className='space-y-2'>
											{['Domingo (mañana) — Culto General', 'Miércoles — Estudio Bíblico', 'Viernes — Jóvenes (si aplica)'].map((c) => (
												<div key={c} className='flex items-center gap-2 font-body-sm text-body-sm text-on-surface'>
													<span className='w-1.5 h-1.5 rounded-full bg-primary shrink-0' />
													{c}
												</div>
											))}
										</div>
									</div>
								</div>
							)}

							{/* GDC detail */}
							{current.kind === 'gdc' && (
								<div className='flex-1 overflow-auto'>
									<div className='p-5 border-b border-outline-variant/50 bg-surface-container-low/30'>
										<div className='flex items-start justify-between'>
											<div>
												<p className='font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1'>Nombre del grupo</p>
												<p className='font-headline-md text-on-surface'>
													{current.gdcName ?? <span className='text-outline italic'>Sin nombre asignado</span>}
												</p>
											</div>
											<div className='text-right'>
												<p className='font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1'>Reunión</p>
												<p className='font-label-md text-label-md text-on-surface'>Viernes · Noche</p>
											</div>
										</div>
									</div>
									<div className='p-5 border-b border-outline-variant/50 flex items-center gap-3'>
										<div className='w-11 h-11 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-label-md select-none border border-primary/20'>
											{current.initials || '?'}
										</div>
										<div>
											<div className='font-label-md text-label-md text-on-surface'>{current.leader ?? <span className='text-error'>Sin líder asignado</span>}</div>
											<div className='font-body-sm text-body-sm text-on-surface-variant'>Líder del GDC</div>
										</div>
										<span className='ml-auto px-3 py-1 bg-secondary-container text-on-secondary-container font-label-sm text-label-sm rounded-full'>{current.count} miembros</span>
									</div>
									<div className='p-5'>
										<p className='font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-3'>Miembros del Grupo</p>
										<div className='space-y-2'>
											{Array.from({ length: Math.min(current.count, 5) }).map((_, i) => (
												<div key={i} className='flex items-center gap-3 py-2 border-b border-outline-variant/20'>
													<div className='w-8 h-8 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center font-label-sm select-none border border-outline-variant'>M{i + 1}</div>
													<div>
														<div className='font-label-sm text-label-sm text-on-surface'>Miembro {i + 1}</div>
														<div className='font-body-sm text-body-sm text-on-surface-variant text-[11px]'>miembro@example.com</div>
													</div>
												</div>
											))}
											{current.count > 5 && (
												<p className='font-body-sm text-body-sm text-on-surface-variant text-center pt-2'>+{current.count - 5} más</p>
											)}
										</div>
									</div>
								</div>
							)}

							{/* Standard ministry detail */}
							{current.kind === 'standard' && (
								<>
									<div className='flex-1 overflow-auto'>
										{team.length === 0 ? (
											<div className='flex flex-col items-center justify-center h-48 text-on-surface-variant'>
												<span className='material-symbols-outlined text-[48px] mb-4 text-outline'>group_off</span>
												<p className='font-body-md text-body-md'>Sin miembros registrados en este ministerio.</p>
												<button className='mt-4 px-4 py-2 bg-primary text-on-primary font-label-md text-label-md rounded-lg hover:opacity-90 transition-[opacity]'>
													Añadir Primer Miembro
												</button>
											</div>
										) : (
											<table className='w-full text-left border-collapse'>
												<thead className='bg-surface-container-low/50 sticky top-0 border-b border-outline-variant/50'>
													<tr>
														<th className='py-3 px-5 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider w-[42%]'>Miembro</th>
														<th className='py-3 px-5 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider w-[25%]'>Rol</th>
														<th className='py-3 px-5 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider w-[20%]'>Desde</th>
														<th className='py-3 px-5 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider text-right w-[13%]'>Acc.</th>
													</tr>
												</thead>
												<tbody className='font-body-sm text-body-sm'>
													{team.map((m, i) => (
														<tr key={i} className='border-b border-outline-variant/30 hover:bg-primary-fixed/10 transition-[background-color] bg-white'>
															<td className='py-3 px-5'>
																<div className='flex items-center gap-3'>
																	<div className='w-9 h-9 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center font-label-md border border-outline-variant select-none shrink-0'>{m.initials}</div>
																	<div>
																		<div className='font-label-md text-label-md text-on-surface'>{m.name}</div>
																		<div className='text-on-surface-variant text-[11px] mt-0.5'>{m.email}</div>
																	</div>
																</div>
															</td>
															<td className='py-3 px-5'>
																{m.roleBadge ? (
																	<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-label-sm text-label-sm ${m.roleBadge}`}>{m.role}</span>
																) : (
																	<span className='font-body-sm text-body-sm text-on-surface'>{m.role}</span>
																)}
															</td>
															<td className='py-3 px-5 text-on-surface-variant'>{m.joined}</td>
															<td className='py-3 px-5 text-right'>
																<button className='text-outline hover:text-primary transition-[color] p-1'>
																	<span className='material-symbols-outlined text-[20px]'>more_vert</span>
																</button>
															</td>
														</tr>
													))}
												</tbody>
											</table>
										)}
									</div>
									<div className='p-4 border-t border-outline-variant/50 bg-surface-container-low flex items-center justify-between shrink-0'>
										<span className='font-body-sm text-body-sm text-on-surface-variant'>
											Mostrando {team.length} de {current.count} miembros
										</span>
										<div className='flex items-center gap-2'>
											<button disabled className='p-1 rounded text-outline disabled:opacity-40'>
												<span className='material-symbols-outlined'>chevron_left</span>
											</button>
											<button className='p-1 rounded hover:bg-surface-variant text-on-surface transition-[background-color]'>
												<span className='material-symbols-outlined'>chevron_right</span>
											</button>
										</div>
									</div>
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

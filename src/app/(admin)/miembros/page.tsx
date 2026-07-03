'use client';

import { useState } from 'react';

type MemberType = 'Bautizado' | 'Congregante' | 'Visitante';
type Status = 'Activo' | 'Congregando' | 'Visitante' | 'Inactivo';

interface Member {
	id: string;
	name: string;
	initials: string;
	email: string;
	phone: string;
	ministry: string | null;
	joined: string;
	tipo: MemberType;
	status: Status;
	ministryColor: string;
	address?: string;
	birthdate?: string;
	baptismDate?: string;
	notes?: string;
}

const MEMBERS: Member[] = [
	{ id: '00492', name: 'Carlos Mendoza', initials: 'CM', email: 'carlos.m@email.com', phone: '+51 987 654 321', ministry: 'Caballeros', joined: '12 Mar 2019', tipo: 'Bautizado', status: 'Activo', ministryColor: 'bg-secondary-container text-on-secondary-container', address: 'Av. Esperanza 123', baptismDate: '15 Abr 2019' },
	{ id: '01024', name: 'Ana Ramírez', initials: 'AR', email: 'ana.ramirez@email.com', phone: '+51 987 111 222', ministry: 'EsLider', joined: '05 Ene 2021', tipo: 'Bautizado', status: 'Activo', ministryColor: 'bg-primary-container text-on-primary-container', address: 'Jr. Los Pinos 45', baptismDate: '10 Feb 2021' },
	{ id: '01566', name: 'Lucía Vega', initials: 'LV', email: 'l.vega@email.com', phone: '+51 965 112 233', ministry: 'Jóvenes', joined: '18 Ago 2023', tipo: 'Congregante', status: 'Congregando', ministryColor: 'bg-primary-container text-on-primary-container' },
	{ id: '00214', name: 'Miguel Ortiz', initials: 'MO', email: 'mortiz88@email.com', phone: 'No disponible', ministry: null, joined: '10 Nov 2018', tipo: 'Bautizado', status: 'Inactivo', ministryColor: '' },
	{ id: '00891', name: 'Sofia Torres', initials: 'ST', email: 'sofia.t@email.com', phone: '+51 622 456 789', ministry: 'Damas', joined: '22 Feb 2020', tipo: 'Bautizado', status: 'Activo', ministryColor: 'bg-tertiary-container text-on-tertiary-container', baptismDate: '05 Mar 2020' },
	{ id: '02041', name: 'Juan Pérez', initials: 'JP', email: 'j.perez@email.com', phone: '+51 945 000 111', ministry: 'Jóvenes', joined: '03 Sep 2024', tipo: 'Congregante', status: 'Congregando', ministryColor: 'bg-primary-container text-on-primary-container' },
	{ id: '02105', name: 'Rosa Huanca', initials: 'RH', email: 'Sin email', phone: '+51 912 333 444', ministry: null, joined: '17 Oct 2024', tipo: 'Visitante', status: 'Visitante', ministryColor: '' },
	{ id: '02188', name: 'David Reyes', initials: 'DR', email: 'd.reyes@email.com', phone: '+51 987 777 888', ministry: 'Jóvenes', joined: '02 Nov 2024', tipo: 'Visitante', status: 'Visitante', ministryColor: 'bg-primary-container text-on-primary-container' },
];

const TIPO_CONFIG: Record<MemberType, { badge: string; dot: string }> = {
	Bautizado: { badge: 'bg-tertiary-fixed text-on-tertiary-fixed border border-tertiary-fixed-dim', dot: 'bg-tertiary' },
	Congregante: { badge: 'bg-primary-container text-on-primary-container border border-primary-fixed-dim', dot: 'bg-primary' },
	Visitante: { badge: 'bg-secondary-container text-on-secondary-container border border-secondary-fixed-dim', dot: 'bg-secondary' },
};

const STATUS_CONFIG: Record<Status, string> = {
	Activo: 'bg-tertiary-fixed text-on-tertiary-fixed border border-tertiary-fixed-dim',
	Congregando: 'bg-primary-container text-on-primary-container border border-primary/20',
	Visitante: 'bg-secondary-container text-on-secondary-container border border-secondary-container',
	Inactivo: 'bg-error-container text-on-error-container border border-error/20',
};

const MINISTRIES_LIST = ['EsLider','Oración','Caballeros','Damas','Jóvenes','Adolescentes','Niños','Mayordomía','Servicio Social','Evangelismo','GDC Jóvenes','GDC Adolescentes'];

export default function MiembrosPage() {
	const [search, setSearch] = useState('');
	const [tipoFilter, setTipoFilter] = useState<MemberType | ''>('');
	const [statusFilter, setStatusFilter] = useState('');
	const [ministryFilter, setMinistryFilter] = useState('');
	const [editMember, setEditMember] = useState<Member | null>(null);
	const [editForm, setEditForm] = useState<Partial<Member>>({});

	const filtered = MEMBERS.filter((m) => {
		const q = search.toLowerCase();
		const matchSearch = !q || m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.id.includes(q);
		const matchTipo = !tipoFilter || m.tipo === tipoFilter;
		const matchStatus = !statusFilter || m.status === statusFilter;
		const matchMinistry = !ministryFilter || m.ministry === ministryFilter;
		return matchSearch && matchTipo && matchStatus && matchMinistry;
	});

	const counts = {
		total: MEMBERS.length,
		bautizados: MEMBERS.filter((m) => m.tipo === 'Bautizado').length,
		congregantes: MEMBERS.filter((m) => m.tipo === 'Congregante').length,
		visitantes: MEMBERS.filter((m) => m.tipo === 'Visitante').length,
	};

	const openEdit = (m: Member) => {
		setEditMember(m);
		setEditForm({ ...m });
	};

	return (
		<main className='px-4 md:px-margin-desktop py-8 w-full min-h-full'>
			<div className='max-w-container-max mx-auto'>
				{/* Header */}
				<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
					<div>
						<h2 className='font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-1'>
							Directorio de la Congregación
						</h2>
						<p className='font-body-md text-body-md text-on-surface-variant'>
							Bautizados, congregantes y visitantes de la iglesia.
						</p>
					</div>
					<button className='bg-primary text-on-primary font-label-md text-label-md py-2.5 px-5 rounded-lg shadow-sm flex items-center gap-2 hover:opacity-90 transition-[opacity] whitespace-nowrap'>
						<span className='material-symbols-outlined text-[18px]'>person_add</span>
						Añadir Persona
					</button>
				</div>

				{/* Stat cards */}
				<div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
					{[
						{ label: 'Total', value: counts.total, color: 'text-on-surface', bg: 'bg-white', filter: '' },
						{ label: 'Bautizados', value: counts.bautizados, color: 'text-tertiary', bg: 'bg-tertiary-fixed/30', filter: 'Bautizado' },
						{ label: 'Congregantes', value: counts.congregantes, color: 'text-primary', bg: 'bg-primary-container/20', filter: 'Congregante' },
						{ label: 'Visitantes', value: counts.visitantes, color: 'text-secondary', bg: 'bg-secondary-container/20', filter: 'Visitante' },
					].map((s) => (
						<button
							key={s.label}
							onClick={() => setTipoFilter((s.filter as MemberType | ''))}
							className={`${s.bg} rounded-xl p-4 border transition-[border-color,box-shadow] text-left ${tipoFilter === s.filter ? 'border-primary shadow-md' : 'border-outline-variant/30 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:border-outline'}`}
						>
							<p className='font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1'>{s.label}</p>
							<p className={`font-display-lg text-[32px] font-bold ${s.color}`}>{s.value}</p>
						</button>
					))}
				</div>

				{/* Tipo filter chips */}
				<div className='flex flex-wrap gap-2 mb-4'>
					{(['',...(['Bautizado','Congregante','Visitante'] as MemberType[])]) .map((t) => (
						<button
							key={t}
							onClick={() => setTipoFilter(t as MemberType | '')}
							className={`px-4 py-1.5 rounded-full font-label-md text-label-md border transition-[background-color,border-color] ${tipoFilter === t ? 'bg-primary text-on-primary border-primary' : 'bg-white border-outline-variant text-on-surface-variant hover:bg-surface-container-low'}`}
						>
							{t === '' ? 'Todos' : t + 's'}
						</button>
					))}
				</div>

				{/* Filters bar */}
				<div className='bg-white p-4 rounded-t-xl border border-outline-variant/50 border-b-0 flex flex-wrap gap-3 items-center justify-between'>
					<div className='relative'>
						<span className='material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]'>search</span>
						<input type='text' value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Buscar por nombre, correo, ID...' className='pl-10 pr-4 py-2.5 bg-surface rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary font-body-md text-body-md text-on-surface transition-[box-shadow] outline-none w-72' />
					</div>
					<div className='flex flex-wrap items-center gap-3'>
						<div className='relative'>
							<select value={ministryFilter} onChange={(e) => setMinistryFilter(e.target.value)} className='appearance-none bg-surface border border-outline-variant text-on-surface font-label-md text-label-md rounded-lg py-2.5 pl-4 pr-10 focus:ring-primary focus:border-primary cursor-pointer outline-none'>
								<option value=''>Ministerio: Todos</option>
								{MINISTRIES_LIST.map((m) => <option key={m} value={m}>{m}</option>)}
							</select>
							<span className='material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none'>arrow_drop_down</span>
						</div>
						<div className='relative'>
							<select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className='appearance-none bg-surface border border-outline-variant text-on-surface font-label-md text-label-md rounded-lg py-2.5 pl-4 pr-10 focus:ring-primary focus:border-primary cursor-pointer outline-none'>
								<option value=''>Estado: Todos</option>
								<option value='Activo'>Activo</option>
								<option value='Congregando'>Congregando</option>
								<option value='Visitante'>Visitante</option>
								<option value='Inactivo'>Inactivo</option>
							</select>
							<span className='material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none'>arrow_drop_down</span>
						</div>
					</div>
				</div>

				{/* Table */}
				<div className='bg-white border border-outline-variant/50 rounded-b-xl overflow-x-auto shadow-[0_4px_20px_rgba(0,0,0,0.02)] mb-5'>
					<table className='w-full text-left border-collapse min-w-[900px]'>
						<thead>
							<tr className='bg-surface border-b border-outline-variant/50'>
								<th className='py-3 px-5 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider w-10'>
									<input type='checkbox' className='rounded border-outline-variant' readOnly />
								</th>
								<th className='py-3 px-5 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider'>Persona</th>
								<th className='py-3 px-5 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider'>Contacto</th>
								<th className='py-3 px-5 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider'>Tipo</th>
								<th className='py-3 px-5 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider'>Ministerio</th>
								<th className='py-3 px-5 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider'>Estado</th>
								<th className='py-3 px-5 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-right'>Acciones</th>
							</tr>
						</thead>
						<tbody className='divide-y divide-outline-variant/20'>
							{filtered.map((m) => (
								<tr key={m.id} className='hover:bg-primary-fixed/10 transition-[background-color] group bg-white'>
									<td className='py-3 px-5'>
										<input type='checkbox' className='rounded border-outline-variant' readOnly />
									</td>
									<td className='py-3 px-5'>
										<div className='flex items-center gap-3'>
											<div className='w-9 h-9 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-label-md text-label-md select-none shrink-0 border border-primary/10'>{m.initials}</div>
											<div>
												<p className='font-label-md text-label-md text-on-surface'>{m.name}</p>
												<p className='font-body-sm text-body-sm text-on-surface-variant'>ID: {m.id}</p>
											</div>
										</div>
									</td>
									<td className='py-3 px-5'>
										<p className='font-body-sm text-body-sm text-on-surface'>{m.email}</p>
										<p className='font-body-sm text-body-sm text-on-surface-variant'>{m.phone}</p>
									</td>
									<td className='py-3 px-5'>
										<span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-label-sm text-label-sm ${TIPO_CONFIG[m.tipo].badge}`}>
											<span className={`w-1.5 h-1.5 rounded-full ${TIPO_CONFIG[m.tipo].dot}`} />
											{m.tipo}
										</span>
									</td>
									<td className='py-3 px-5'>
										{m.ministry ? (
											<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-label-sm text-label-sm ${m.ministryColor}`}>{m.ministry}</span>
										) : (
											<span className='text-on-surface-variant font-body-sm text-body-sm italic'>Sin asignar</span>
										)}
									</td>
									<td className='py-3 px-5'>
										<span className={`inline-flex items-center px-2.5 py-1 rounded-full font-label-sm text-label-sm ${STATUS_CONFIG[m.status]}`}>{m.status}</span>
									</td>
									<td className='py-3 px-5 text-right'>
										<div className='flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-[opacity]'>
											<button className='p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-md transition-[background-color,color]' title='Ver'>
												<span className='material-symbols-outlined text-[18px]'>visibility</span>
											</button>
											<button onClick={() => openEdit(m)} className='p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-md transition-[background-color,color]' title='Editar'>
												<span className='material-symbols-outlined text-[18px]'>edit</span>
											</button>
											<button className='p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-md transition-[background-color,color]' title='Asignar'>
												<span className='material-symbols-outlined text-[18px]'>group_add</span>
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Pagination */}
				<div className='flex items-center justify-between px-4 py-3 bg-white border border-outline-variant/50 rounded-xl shadow-sm'>
					<p className='font-body-sm text-body-sm text-on-surface-variant'>
						Mostrando <span className='font-label-md text-label-md text-on-surface'>{filtered.length}</span> de <span className='font-label-md text-label-md text-on-surface'>1,248</span> personas
					</p>
					<nav className='inline-flex rounded-md shadow-sm -space-x-px'>
						<button className='relative inline-flex items-center px-2 py-2 rounded-l-md border border-outline-variant bg-surface text-on-surface-variant hover:bg-surface-container transition-[background-color]'>
							<span className='material-symbols-outlined text-[20px]'>chevron_left</span>
						</button>
						<button className='z-10 bg-primary border-primary text-on-primary relative inline-flex items-center px-4 py-2 border text-sm font-medium'>1</button>
						<button className='bg-surface border-outline-variant text-on-surface-variant hover:bg-surface-container relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-[background-color]'>2</button>
						<button className='relative inline-flex items-center px-2 py-2 rounded-r-md border border-outline-variant bg-surface text-on-surface-variant hover:bg-surface-container transition-[background-color]'>
							<span className='material-symbols-outlined text-[20px]'>chevron_right</span>
						</button>
					</nav>
				</div>
			</div>

			{/* Edit Modal */}
			{editMember && (
				<div className='fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4' onClick={(e) => e.target === e.currentTarget && setEditMember(null)}>
					<div className='bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] w-full max-w-lg flex flex-col overflow-hidden'>
						<div className='flex items-center justify-between p-5 border-b border-outline-variant bg-surface-bright'>
							<div>
								<h2 className='font-headline-md text-on-surface'>Editar Datos</h2>
								<p className='font-body-sm text-body-sm text-on-surface-variant'>ID: {editMember.id}</p>
							</div>
							<button onClick={() => setEditMember(null)} className='p-2 rounded-full hover:bg-surface-container transition-[background-color] text-on-surface-variant'>
								<span className='material-symbols-outlined'>close</span>
							</button>
						</div>
						<div className='p-5 overflow-y-auto space-y-4' style={{ maxHeight: '65vh' }}>
							<div className='grid grid-cols-2 gap-4'>
								<div className='col-span-2'>
									<label className='block font-label-sm text-label-sm text-on-surface-variant mb-1'>Nombre Completo</label>
									<input type='text' value={editForm.name ?? ''} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} className='w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-lowest text-on-surface font-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-[box-shadow]' />
								</div>
								<div>
									<label className='block font-label-sm text-label-sm text-on-surface-variant mb-1'>Teléfono</label>
									<input type='tel' value={editForm.phone ?? ''} onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))} className='w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-lowest text-on-surface font-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-[box-shadow]' />
								</div>
								<div>
									<label className='block font-label-sm text-label-sm text-on-surface-variant mb-1'>Email</label>
									<input type='email' value={editForm.email ?? ''} onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))} className='w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-lowest text-on-surface font-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-[box-shadow]' />
								</div>
								<div className='col-span-2'>
									<label className='block font-label-sm text-label-sm text-on-surface-variant mb-1'>Dirección</label>
									<input type='text' value={editForm.address ?? ''} onChange={(e) => setEditForm((f) => ({ ...f, address: e.target.value }))} placeholder='Dirección de residencia' className='w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-lowest text-on-surface font-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-[box-shadow]' />
								</div>
								<div>
									<label className='block font-label-sm text-label-sm text-on-surface-variant mb-1'>Tipo</label>
									<div className='relative'>
										<select value={editForm.tipo ?? ''} onChange={(e) => setEditForm((f) => ({ ...f, tipo: e.target.value as MemberType }))} className='w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-lowest text-on-surface font-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none transition-[box-shadow]'>
											<option value='Bautizado'>Bautizado</option>
											<option value='Congregante'>Congregante</option>
											<option value='Visitante'>Visitante</option>
										</select>
										<span className='material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant'>expand_more</span>
									</div>
								</div>
								<div>
									<label className='block font-label-sm text-label-sm text-on-surface-variant mb-1'>Estado</label>
									<div className='relative'>
										<select value={editForm.status ?? ''} onChange={(e) => setEditForm((f) => ({ ...f, status: e.target.value as Status }))} className='w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-lowest text-on-surface font-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none transition-[box-shadow]'>
											<option value='Activo'>Activo</option>
											<option value='Congregando'>Congregando</option>
											<option value='Visitante'>Visitante</option>
											<option value='Inactivo'>Inactivo</option>
										</select>
										<span className='material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant'>expand_more</span>
									</div>
								</div>
								<div className='col-span-2'>
									<label className='block font-label-sm text-label-sm text-on-surface-variant mb-1'>Ministerio Asignado</label>
									<div className='relative'>
										<select value={editForm.ministry ?? ''} onChange={(e) => setEditForm((f) => ({ ...f, ministry: e.target.value || null }))} className='w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-lowest text-on-surface font-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none transition-[box-shadow]'>
											<option value=''>Sin asignar</option>
											{MINISTRIES_LIST.map((m) => <option key={m} value={m}>{m}</option>)}
										</select>
										<span className='material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant'>expand_more</span>
									</div>
								</div>
								{editForm.tipo === 'Bautizado' && (
									<div className='col-span-2'>
										<label className='block font-label-sm text-label-sm text-on-surface-variant mb-1'>Fecha de Bautismo</label>
										<input type='date' value={editForm.baptismDate ?? ''} onChange={(e) => setEditForm((f) => ({ ...f, baptismDate: e.target.value }))} className='w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-lowest text-on-surface font-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-[box-shadow]' />
									</div>
								)}
								<div className='col-span-2'>
									<label className='block font-label-sm text-label-sm text-on-surface-variant mb-1'>Notas</label>
									<textarea rows={2} value={editForm.notes ?? ''} onChange={(e) => setEditForm((f) => ({ ...f, notes: e.target.value }))} placeholder='Observaciones del pastor o líderes...' className='w-full px-3 py-2 border border-outline-variant rounded-lg bg-surface-lowest text-on-surface font-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none transition-[box-shadow]' />
								</div>
							</div>
						</div>
						<div className='p-5 border-t border-outline-variant bg-surface-bright flex justify-end gap-3'>
							<button onClick={() => setEditMember(null)} className='px-5 py-2 rounded-lg font-label-md text-label-md text-on-surface border border-outline-variant hover:bg-surface-container transition-[background-color]'>
								Cancelar
							</button>
							<button onClick={() => setEditMember(null)} className='px-5 py-2 rounded-lg font-label-md text-label-md bg-primary text-on-primary hover:opacity-90 transition-[opacity] shadow-sm'>
								Guardar Cambios
							</button>
						</div>
					</div>
				</div>
			)}
		</main>
	);
}

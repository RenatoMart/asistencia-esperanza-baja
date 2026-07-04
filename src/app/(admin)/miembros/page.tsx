'use client';

import Link from 'next/link';
import { useState } from 'react';

import { initials } from '@/lib/format';
import {
	CATEGORY_META,
	CATEGORY_ORDER,
	type MemberCategory,
	type MemberStatus,
	type MemberType,
	MINISTRIES_LIST,
	STATUS_META,
	STATUS_ORDER,
	TIPO_META,
	TIPO_ORDER,
} from '@/lib/miembros';
import { type NewMemberInput, useMiembros } from '@/lib/miembros-store';

type CategoryTab = 'todos' | MemberCategory;

const emptyNew: NewMemberInput = {
	name: '',
	email: '',
	phone: '',
	ministry: null,
	tipo: 'Visitante',
	status: 'nuevo',
	category: 'visita',
};

export default function MiembrosPage() {
	const { members, addMember } = useMiembros();
	const [tab, setTab] = useState<CategoryTab>('todos');
	const [search, setSearch] = useState('');
	const [ministryFilter, setMinistryFilter] = useState('');
	const [statusFilter, setStatusFilter] = useState<'' | MemberStatus>('');
	const [isAddOpen, setIsAddOpen] = useState(false);
	const [addForm, setAddForm] = useState<NewMemberInput>(emptyNew);

	const filtered = members.filter((m) => {
		const q = search.trim().toLowerCase();
		const matchSearch = !q || m.name.toLowerCase().includes(q);
		const matchTab = tab === 'todos' || m.category === tab;
		const matchMinistry = !ministryFilter || m.ministry === ministryFilter;
		const matchStatus = !statusFilter || m.status === statusFilter;
		return matchSearch && matchTab && matchMinistry && matchStatus;
	});

	const countFor = (t: CategoryTab) =>
		t === 'todos' ? members.length : members.filter((m) => m.category === t).length;

	const saveNew = () => {
		if (!addForm.name.trim()) return;
		addMember(addForm);
		setAddForm(emptyNew);
		setIsAddOpen(false);
	};

	const inputCls =
		'w-full px-3 py-2.5 border border-outline-variant rounded-lg bg-surface-lowest text-on-surface font-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-[box-shadow]';
	const selectCls = `${inputCls} appearance-none`;

	return (
		<main className='px-4 md:px-margin-desktop py-8 pb-28 md:pb-8 w-full min-h-full bg-surface-container-low'>
			<div className='max-w-container-max mx-auto space-y-5'>
				{/* Header */}
				<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
					<div>
						<h1 className='font-headline-lg text-headline-md sm:text-headline-lg text-on-surface'>
							Directorio de la Congregación
						</h1>
						<p className='font-body-sm text-body-sm text-on-surface-variant mt-1'>
							{members.length} personas · líderes, miembros, congregantes, visitas y convertidos.
						</p>
					</div>
					<button
						onClick={() => setIsAddOpen(true)}
						className='flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] bg-primary text-on-primary rounded-full font-label-md text-label-md hover:opacity-90 transition-[opacity] shadow-sm shrink-0'
					>
						<span className='material-symbols-outlined text-[18px]'>person_add</span>
						Añadir Persona
					</button>
				</div>

				{/* Category tabs */}
				<div className='flex gap-2 overflow-x-auto pb-1 -mb-1'>
					{(['todos', ...CATEGORY_ORDER] as CategoryTab[]).map((t) => (
						<button
							key={t}
							onClick={() => setTab(t)}
							className={`shrink-0 flex items-center gap-2 px-4 py-2 min-h-[40px] rounded-full font-label-md text-label-md transition-[background-color,color] ${
								tab === t
									? 'bg-primary text-on-primary'
									: 'bg-surface text-on-surface-variant border border-outline-variant hover:bg-surface-container'
							}`}
						>
							{t === 'todos' ? 'Todos' : CATEGORY_META[t].plural}
							<span
								className={`px-1.5 rounded-full text-label-sm ${
									tab === t ? 'bg-on-primary/20' : 'bg-surface-container'
								}`}
							>
								{countFor(t)}
							</span>
						</button>
					))}
				</div>

				{/* Filters (búsqueda por nombre + Ministerio + Estado) */}
				<div className='bg-surface p-4 rounded-xl border border-outline-variant flex flex-col sm:flex-row gap-3 sm:items-center'>
					<div className='relative flex-1'>
						<span className='material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]'>
							search
						</span>
						<input
							type='text'
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder='Buscar por nombre...'
							className='w-full pl-10 pr-4 py-2.5 bg-surface-container-low rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary font-body-sm text-on-surface transition-[box-shadow] outline-none'
						/>
					</div>
					<div className='grid grid-cols-2 sm:flex gap-3'>
						<div className='relative'>
							<select
								value={ministryFilter}
								onChange={(e) => setMinistryFilter(e.target.value)}
								className='w-full appearance-none bg-surface-container-low border border-outline-variant text-on-surface font-label-md text-label-md rounded-lg py-2.5 pl-4 pr-10 focus:ring-primary focus:border-primary cursor-pointer outline-none'
							>
								<option value=''>Ministerio: Todos</option>
								{MINISTRIES_LIST.map((m) => (
									<option key={m} value={m}>
										{m}
									</option>
								))}
							</select>
							<span className='material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none'>
								arrow_drop_down
							</span>
						</div>
						<div className='relative'>
							<select
								value={statusFilter}
								onChange={(e) => setStatusFilter(e.target.value as '' | MemberStatus)}
								className='w-full appearance-none bg-surface-container-low border border-outline-variant text-on-surface font-label-md text-label-md rounded-lg py-2.5 pl-4 pr-10 focus:ring-primary focus:border-primary cursor-pointer outline-none'
							>
								<option value=''>Estado: Todos</option>
								{STATUS_ORDER.map((s) => (
									<option key={s} value={s}>
										{STATUS_META[s].label}
									</option>
								))}
							</select>
							<span className='material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none'>
								arrow_drop_down
							</span>
						</div>
					</div>
				</div>

				{/* Lista de personas (tarjetas responsive) */}
				{filtered.length === 0 ? (
					<div className='bg-surface rounded-xl p-10 border border-outline-variant text-center'>
						<span className='material-symbols-outlined text-outline text-[40px]'>
							search_off
						</span>
						<p className='font-body-md text-body-md text-on-surface-variant mt-2'>
							No se encontraron personas con esos criterios.
						</p>
					</div>
				) : (
					<>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
							{filtered.map((m) => (
								<Link
									key={m.id}
									href={`/miembros/${m.id}`}
									className='bg-surface rounded-xl p-4 border border-outline-variant hover:shadow-md transition-[box-shadow] flex items-center gap-3'
								>
									<div className='w-11 h-11 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-label-md text-label-md select-none shrink-0'>
										{initials(m.name)}
									</div>
									<div className='min-w-0 flex-1'>
										<p className='font-body-md text-body-md text-on-surface truncate'>{m.name}</p>
										<div className='flex flex-wrap items-center gap-1.5 mt-1'>
											<span
												className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-label-sm text-label-sm ${TIPO_META[m.tipo].badge}`}
											>
												<span className={`w-1.5 h-1.5 rounded-full ${TIPO_META[m.tipo].dot}`} />
												{m.tipo}
											</span>
											{m.ministry && (
												<span className='inline-flex items-center px-2 py-0.5 rounded-full font-label-sm text-label-sm bg-surface-container text-on-surface-variant'>
													{m.ministry}
												</span>
											)}
										</div>
									</div>
									<div className='flex flex-col items-end gap-1 shrink-0'>
										<span
											className={`px-2 py-0.5 rounded-full font-label-sm text-label-sm ${STATUS_META[m.status].badge}`}
										>
											{STATUS_META[m.status].label}
										</span>
										<span className='font-body-sm text-body-sm text-on-surface-variant text-[10px]'>
											ID: {m.id}
										</span>
									</div>
								</Link>
							))}
						</div>
						<p className='font-body-sm text-body-sm text-on-surface-variant text-center'>
							Mostrando {filtered.length} de {members.length} personas
						</p>
					</>
				)}
			</div>

			{/* Add modal */}
			{isAddOpen && (
				<div
					className='fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4'
					onClick={(e) => e.target === e.currentTarget && setIsAddOpen(false)}
				>
					<div className='bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden'>
						<div className='flex items-center justify-between p-5 border-b border-outline-variant bg-surface-bright'>
							<h2 className='font-headline-md text-on-surface'>Añadir Persona</h2>
							<button
								onClick={() => setIsAddOpen(false)}
								className='p-2 rounded-full hover:bg-surface-container transition-[background-color] text-on-surface-variant'
							>
								<span className='material-symbols-outlined'>close</span>
							</button>
						</div>
						<div className='p-5 overflow-y-auto space-y-4'>
							<div>
								<label className='block font-label-sm text-label-sm text-on-surface-variant mb-1'>
									Nombre Completo *
								</label>
								<input
									type='text'
									value={addForm.name}
									onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))}
									placeholder='Nombres y apellidos'
									className={inputCls}
								/>
							</div>
							<div className='grid grid-cols-2 gap-3'>
								<div>
									<label className='block font-label-sm text-label-sm text-on-surface-variant mb-1'>
										Teléfono
									</label>
									<input
										type='tel'
										value={addForm.phone}
										onChange={(e) => setAddForm((f) => ({ ...f, phone: e.target.value }))}
										placeholder='999 000 000'
										className={inputCls}
									/>
								</div>
								<div>
									<label className='block font-label-sm text-label-sm text-on-surface-variant mb-1'>
										Email
									</label>
									<input
										type='email'
										value={addForm.email}
										onChange={(e) => setAddForm((f) => ({ ...f, email: e.target.value }))}
										placeholder='correo@email.com'
										className={inputCls}
									/>
								</div>
							</div>
							<div className='grid grid-cols-2 gap-3'>
								<div>
									<label className='block font-label-sm text-label-sm text-on-surface-variant mb-1'>
										Tipo
									</label>
									<select
										value={addForm.tipo}
										onChange={(e) =>
											setAddForm((f) => ({ ...f, tipo: e.target.value as MemberType }))
										}
										className={selectCls}
									>
										{TIPO_ORDER.map((t) => (
											<option key={t} value={t}>
												{t}
											</option>
										))}
									</select>
								</div>
								<div>
									<label className='block font-label-sm text-label-sm text-on-surface-variant mb-1'>
										Estado
									</label>
									<select
										value={addForm.status}
										onChange={(e) =>
											setAddForm((f) => ({ ...f, status: e.target.value as MemberStatus }))
										}
										className={selectCls}
									>
										{STATUS_ORDER.map((s) => (
											<option key={s} value={s}>
												{STATUS_META[s].label}
											</option>
										))}
									</select>
								</div>
							</div>
							<div className='grid grid-cols-2 gap-3'>
								<div>
									<label className='block font-label-sm text-label-sm text-on-surface-variant mb-1'>
										Categoría
									</label>
									<select
										value={addForm.category}
										onChange={(e) =>
											setAddForm((f) => ({ ...f, category: e.target.value as MemberCategory }))
										}
										className={selectCls}
									>
										{CATEGORY_ORDER.map((c) => (
											<option key={c} value={c}>
												{CATEGORY_META[c].label}
											</option>
										))}
									</select>
								</div>
								<div>
									<label className='block font-label-sm text-label-sm text-on-surface-variant mb-1'>
										Ministerio
									</label>
									<select
										value={addForm.ministry ?? ''}
										onChange={(e) =>
											setAddForm((f) => ({ ...f, ministry: e.target.value || null }))
										}
										className={selectCls}
									>
										<option value=''>Sin asignar</option>
										{MINISTRIES_LIST.map((m) => (
											<option key={m} value={m}>
												{m}
											</option>
										))}
									</select>
								</div>
							</div>
						</div>
						<div className='p-5 border-t border-outline-variant bg-surface-bright flex justify-end gap-3'>
							<button
								onClick={() => setIsAddOpen(false)}
								className='px-5 py-2 rounded-lg font-label-md text-label-md text-on-surface border border-outline-variant hover:bg-surface-container transition-[background-color]'
							>
								Cancelar
							</button>
							<button
								onClick={saveNew}
								disabled={!addForm.name.trim()}
								className='px-5 py-2 rounded-lg font-label-md text-label-md bg-primary text-on-primary hover:opacity-90 transition-[opacity] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed'
							>
								Guardar
							</button>
						</div>
					</div>
				</div>
			)}
		</main>
	);
}

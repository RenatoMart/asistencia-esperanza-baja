'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';

import MemberAttendanceCalendar from '@/components/miembros/MemberAttendanceCalendar';
import { initials } from '@/lib/format';
import {
	CATEGORY_META,
	CATEGORY_ORDER,
	type Member,
	type MemberCategory,
	type MemberStatus,
	type MemberType,
	MINISTRIES_LIST,
	STATUS_META,
	STATUS_ORDER,
	TIPO_META,
	TIPO_ORDER,
} from '@/lib/miembros';
import { useMiembros } from '@/lib/miembros-store';

function formatDate(iso: string): string {
	if (!iso) return '—';
	const d = new Date(`${iso}T00:00:00`);
	if (Number.isNaN(d.getTime())) return iso;
	return d.toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function MiembroDetailPage() {
	const params = useParams<{ id: string }>();
	const id = params.id;
	const { getMember, updateMember } = useMiembros();
	const member = getMember(id);

	const [isEdit, setIsEdit] = useState(false);
	const [form, setForm] = useState<Partial<Member>>({});

	if (!member) {
		return (
			<main className='p-4 md:p-margin-desktop bg-surface-container-low min-h-full'>
				<div className='max-w-2xl mx-auto bg-surface rounded-xl p-10 border border-outline-variant text-center mt-8'>
					<span className='material-symbols-outlined text-outline text-[40px]'>person_off</span>
					<p className='font-headline-md text-on-surface mt-2'>Persona no encontrada</p>
					<Link
						href='/miembros'
						className='inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-primary text-on-primary rounded-full font-label-md text-label-md hover:opacity-90 transition-[opacity]'
					>
						<span className='material-symbols-outlined text-[18px]'>arrow_back</span>
						Volver al directorio
					</Link>
				</div>
			</main>
		);
	}

	const openEdit = () => {
		setForm({ ...member });
		setIsEdit(true);
	};

	const saveEdit = () => {
		const { attendance: _a, id: _i, ...patch } = form;
		void _a;
		void _i;
		updateMember(member.id, patch);
		setIsEdit(false);
	};

	const dataRows: { icon: string; label: string; value: string }[] = [
		{ icon: 'call', label: 'Teléfono', value: member.phone || '—' },
		{ icon: 'mail', label: 'Email', value: member.email || '—' },
		{ icon: 'home', label: 'Dirección', value: member.address || '—' },
		{ icon: 'cake', label: 'Nacimiento', value: formatDate(member.birthdate) },
		{ icon: 'water_drop', label: 'Bautismo', value: formatDate(member.baptismDate) },
		{ icon: 'event', label: 'Ingreso', value: formatDate(member.joined) },
	];

	const inputCls =
		'w-full px-3 py-2.5 border border-outline-variant rounded-lg bg-surface-lowest text-on-surface font-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-[box-shadow]';
	const selectCls = `${inputCls} appearance-none`;

	return (
		<main className='p-4 md:p-margin-desktop pb-28 md:pb-margin-desktop bg-surface-container-low min-h-full'>
			<div className='max-w-container-max mx-auto space-y-6'>
				<Link
					href='/miembros'
					className='inline-flex items-center gap-1.5 font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-[color]'
				>
					<span className='material-symbols-outlined text-[18px]'>arrow_back</span>
					Directorio
				</Link>

				{/* Cabecera */}
				<div className='bg-surface rounded-xl p-5 sm:p-6 border border-outline-variant flex flex-col sm:flex-row sm:items-center gap-4'>
					<div className='w-16 h-16 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-headline-md select-none shrink-0'>
						{initials(member.name)}
					</div>
					<div className='min-w-0 flex-1'>
						<h1 className='font-headline-lg text-headline-md sm:text-headline-lg text-on-surface'>
							{member.name}
						</h1>
						<div className='flex flex-wrap items-center gap-2 mt-2'>
							<span
								className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-label-sm text-label-sm ${TIPO_META[member.tipo].badge}`}
							>
								<span className={`w-1.5 h-1.5 rounded-full ${TIPO_META[member.tipo].dot}`} />
								{member.tipo}
							</span>
							<span
								className={`px-2.5 py-0.5 rounded-full font-label-sm text-label-sm ${STATUS_META[member.status].badge}`}
							>
								{STATUS_META[member.status].label}
							</span>
							<span className='px-2.5 py-0.5 rounded-full font-label-sm text-label-sm bg-surface-container text-on-surface-variant'>
								{CATEGORY_META[member.category].label}
							</span>
							{member.ministry && (
								<span className='font-body-sm text-body-sm text-on-surface-variant'>
									{member.ministry}
								</span>
							)}
						</div>
					</div>
					<button
						onClick={openEdit}
						className='flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] border border-primary text-primary rounded-full font-label-md text-label-md hover:bg-primary-container/20 transition-[background-color] shrink-0'
					>
						<span className='material-symbols-outlined text-[18px]'>edit</span>
						Editar
					</button>
				</div>

				<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
					{/* Columna izquierda: datos + notas */}
					<div className='space-y-6'>
						<div className='bg-surface rounded-xl p-5 border border-outline-variant'>
							<h2 className='font-headline-md text-[18px] text-on-surface mb-4'>Datos personales</h2>
							<div className='space-y-3'>
								{dataRows.map((row) => (
									<div key={row.label} className='flex items-start gap-3'>
										<span className='material-symbols-outlined text-[18px] text-on-surface-variant mt-0.5'>
											{row.icon}
										</span>
										<div className='min-w-0'>
											<p className='font-label-sm text-label-sm text-on-surface-variant'>
												{row.label}
											</p>
											<p className='font-body-md text-body-md text-on-surface break-words'>
												{row.value}
											</p>
										</div>
									</div>
								))}
							</div>
						</div>

						<div className='bg-surface rounded-xl p-5 border border-outline-variant'>
							<h2 className='font-headline-md text-[18px] text-on-surface mb-2'>Notas</h2>
							{member.notes ? (
								<p className='font-body-md text-body-md text-on-surface'>{member.notes}</p>
							) : (
								<p className='font-body-sm text-body-sm text-on-surface-variant'>
									Sin notas. Usa “Editar” para agregar observaciones.
								</p>
							)}
						</div>
					</div>

					{/* Columna derecha: calendario personal de asistencia */}
					<div className='lg:col-span-2 space-y-3'>
						<div className='flex items-center gap-2'>
							<span className='material-symbols-outlined text-[20px] text-on-surface-variant'>
								calendar_month
							</span>
							<h2 className='font-headline-md text-[18px] text-on-surface'>
								Calendario de asistencia
							</h2>
						</div>
						<MemberAttendanceCalendar attendance={member.attendance} />
					</div>
				</div>
			</div>

			{/* Edit modal */}
			{isEdit && (
				<div
					className='fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4'
					onClick={(e) => e.target === e.currentTarget && setIsEdit(false)}
				>
					<div className='bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden'>
						<div className='flex items-center justify-between p-5 border-b border-outline-variant bg-surface-bright'>
							<div>
								<h2 className='font-headline-md text-on-surface'>Editar Datos</h2>
								<p className='font-body-sm text-body-sm text-on-surface-variant'>ID: {member.id}</p>
							</div>
							<button
								onClick={() => setIsEdit(false)}
								className='p-2 rounded-full hover:bg-surface-container transition-[background-color] text-on-surface-variant'
							>
								<span className='material-symbols-outlined'>close</span>
							</button>
						</div>
						<div className='p-5 overflow-y-auto grid grid-cols-2 gap-4'>
							<div className='col-span-2'>
								<label className='block font-label-sm text-label-sm text-on-surface-variant mb-1'>Nombre Completo</label>
								<input type='text' value={form.name ?? ''} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={inputCls} />
							</div>
							<div>
								<label className='block font-label-sm text-label-sm text-on-surface-variant mb-1'>Teléfono</label>
								<input type='tel' value={form.phone ?? ''} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className={inputCls} />
							</div>
							<div>
								<label className='block font-label-sm text-label-sm text-on-surface-variant mb-1'>Email</label>
								<input type='email' value={form.email ?? ''} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className={inputCls} />
							</div>
							<div className='col-span-2'>
								<label className='block font-label-sm text-label-sm text-on-surface-variant mb-1'>Dirección</label>
								<input type='text' value={form.address ?? ''} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} className={inputCls} />
							</div>
							<div>
								<label className='block font-label-sm text-label-sm text-on-surface-variant mb-1'>Nacimiento</label>
								<input type='date' value={form.birthdate ?? ''} onChange={(e) => setForm((f) => ({ ...f, birthdate: e.target.value }))} className={inputCls} />
							</div>
							<div>
								<label className='block font-label-sm text-label-sm text-on-surface-variant mb-1'>Fecha de Bautismo</label>
								<input type='date' value={form.baptismDate ?? ''} onChange={(e) => setForm((f) => ({ ...f, baptismDate: e.target.value }))} className={inputCls} />
							</div>
							<div>
								<label className='block font-label-sm text-label-sm text-on-surface-variant mb-1'>Tipo</label>
								<select value={form.tipo ?? 'Miembro'} onChange={(e) => setForm((f) => ({ ...f, tipo: e.target.value as MemberType }))} className={selectCls}>
									{TIPO_ORDER.map((t) => <option key={t} value={t}>{t}</option>)}
								</select>
							</div>
							<div>
								<label className='block font-label-sm text-label-sm text-on-surface-variant mb-1'>Estado</label>
								<select value={form.status ?? 'nuevo'} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as MemberStatus }))} className={selectCls}>
									{STATUS_ORDER.map((s) => <option key={s} value={s}>{STATUS_META[s].label}</option>)}
								</select>
							</div>
							<div>
								<label className='block font-label-sm text-label-sm text-on-surface-variant mb-1'>Categoría</label>
								<select value={form.category ?? 'miembro'} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as MemberCategory }))} className={selectCls}>
									{CATEGORY_ORDER.map((c) => <option key={c} value={c}>{CATEGORY_META[c].label}</option>)}
								</select>
							</div>
							<div>
								<label className='block font-label-sm text-label-sm text-on-surface-variant mb-1'>Ministerio</label>
								<select value={form.ministry ?? ''} onChange={(e) => setForm((f) => ({ ...f, ministry: e.target.value || null }))} className={selectCls}>
									<option value=''>Sin asignar</option>
									{MINISTRIES_LIST.map((m) => <option key={m} value={m}>{m}</option>)}
								</select>
							</div>
							<div className='col-span-2'>
								<label className='block font-label-sm text-label-sm text-on-surface-variant mb-1'>Notas</label>
								<textarea rows={3} value={form.notes ?? ''} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} className={`${inputCls} resize-none`} />
							</div>
						</div>
						<div className='p-5 border-t border-outline-variant bg-surface-bright flex justify-end gap-3'>
							<button onClick={() => setIsEdit(false)} className='px-5 py-2 rounded-lg font-label-md text-label-md text-on-surface border border-outline-variant hover:bg-surface-container transition-[background-color]'>
								Cancelar
							</button>
							<button onClick={saveEdit} className='px-5 py-2 rounded-lg font-label-md text-label-md bg-primary text-on-primary hover:opacity-90 transition-[opacity] shadow-sm'>
								Guardar Cambios
							</button>
						</div>
					</div>
				</div>
			)}
		</main>
	);
}

'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';

import {
	type ConvertidoStatus,
	getMentor,
	initials,
	MENTORS,
	type NoteType,
	NOTE_META,
	relativeDateLabel,
	STATUS_META,
} from '@/lib/convertidos';
import { useConvertidos } from '@/lib/convertidos-store';

const STATUS_ORDER: ConvertidoStatus[] = ['nuevo', 'proceso', 'consolidado'];
const NOTE_ORDER: NoteType[] = ['reunion', 'llamada', 'nota'];

const lideres = MENTORS.filter((m) => m.role === 'lider');
const equipo = MENTORS.filter((m) => m.role === 'mentoreo');

export default function ConvertidoDetailPage() {
	const params = useParams<{ id: string }>();
	const id = params.id;
	const { getConvertido, assignMentor, setStatus, addNote } = useConvertidos();
	const convertido = getConvertido(id);

	const [noteType, setNoteType] = useState<NoteType>('reunion');
	const [noteText, setNoteText] = useState('');
	const [noteDate, setNoteDate] = useState(new Date().toISOString().slice(0, 10));

	if (!convertido) {
		return (
			<main className='p-4 md:p-margin-desktop bg-surface-container-low min-h-full'>
				<div className='max-w-2xl mx-auto bg-surface rounded-xl p-10 border border-outline-variant text-center mt-8'>
					<span className='material-symbols-outlined text-outline text-[40px]'>person_off</span>
					<p className='font-headline-md text-on-surface mt-2'>Convertido no encontrado</p>
					<p className='font-body-sm text-body-sm text-on-surface-variant mt-1'>
						Es posible que el registro haya sido eliminado.
					</p>
					<Link
						href='/convertidos'
						className='inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-primary text-on-primary rounded-full font-label-md text-label-md hover:opacity-90 transition-[opacity]'
					>
						<span className='material-symbols-outlined text-[18px]'>arrow_back</span>
						Volver a la lista
					</Link>
				</div>
			</main>
		);
	}

	const mentor = getMentor(convertido.mentorId);

	const dataRows: { icon: string; label: string; value: string }[] = [
		{ icon: 'cake', label: 'Edad', value: convertido.age ? `${convertido.age} años` : '—' },
		{ icon: 'call', label: 'Teléfono', value: convertido.phone || '—' },
		{ icon: 'home', label: 'Dirección', value: convertido.address || '—' },
		{
			icon: 'event',
			label: 'Registrado',
			value: `${relativeDateLabel(convertido.dateRegistered)} · por ${convertido.registeredBy}`,
		},
	];

	const handleAddNote = () => {
		if (!noteText.trim()) return;
		addNote(convertido.id, {
			date: noteDate,
			author: mentor?.name ?? 'Equipo de consolidación',
			type: noteType,
			text: noteText.trim(),
		});
		setNoteText('');
		setNoteType('reunion');
		setNoteDate(new Date().toISOString().slice(0, 10));
	};

	return (
		<main className='p-4 md:p-margin-desktop pb-28 md:pb-margin-desktop bg-surface-container-low min-h-full'>
			<div className='max-w-container-max mx-auto space-y-6'>
				<Link
					href='/convertidos'
					className='inline-flex items-center gap-1.5 font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-[color]'
				>
					<span className='material-symbols-outlined text-[18px]'>arrow_back</span>
					Convertidos
				</Link>

				{/* Cabecera */}
				<div className='bg-surface rounded-xl p-5 sm:p-6 border border-outline-variant flex flex-col sm:flex-row sm:items-center gap-4'>
					<div className='w-16 h-16 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center font-headline-md select-none shrink-0'>
						{initials(convertido.fullName)}
					</div>
					<div className='min-w-0 flex-1'>
						<h1 className='font-headline-lg text-headline-md sm:text-headline-lg text-on-surface'>
							{convertido.fullName}
						</h1>
						<div className='flex flex-wrap items-center gap-2 mt-2'>
							<span
								className={`px-3 py-1 rounded-full font-label-sm text-label-sm ${STATUS_META[convertido.status].chip}`}
							>
								{STATUS_META[convertido.status].label}
							</span>
							<span className='font-body-sm text-body-sm text-on-surface-variant'>
								{mentor ? `Mentor: ${mentor.name}` : 'Sin mentor asignado'}
							</span>
						</div>
					</div>
				</div>

				<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
					{/* Columna izquierda: datos + mentor + estado */}
					<div className='space-y-6'>
						{/* Datos personales */}
						<div className='bg-surface rounded-xl p-5 border border-outline-variant'>
							<h2 className='font-headline-md text-[18px] text-on-surface mb-4'>
								Datos de la persona
							</h2>
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
							{convertido.notes && (
								<div className='mt-4 pt-4 border-t border-outline-variant'>
									<p className='font-label-sm text-label-sm text-on-surface-variant mb-1'>
										Notas de registro
									</p>
									<p className='font-body-sm text-body-sm text-on-surface'>
										{convertido.notes}
									</p>
								</div>
							)}
						</div>

						{/* Asignar mentor */}
						<div className='bg-surface rounded-xl p-5 border border-outline-variant'>
							<h2 className='font-headline-md text-[18px] text-on-surface mb-1'>
								Mentor asignado
							</h2>
							<p className='font-body-sm text-body-sm text-on-surface-variant mb-3'>
								Solo el equipo de mentoreo y los líderes pueden ser mentores.
							</p>
							<div className='relative'>
								<select
									value={convertido.mentorId ?? ''}
									onChange={(e) =>
										assignMentor(convertido.id, e.target.value || null)
									}
									className='w-full px-3 py-2.5 border border-outline-variant rounded-lg bg-surface-container-low text-on-surface font-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none transition-[box-shadow]'
								>
									<option value=''>Sin asignar</option>
									<optgroup label='Líderes'>
										{lideres.map((m) => (
											<option key={m.id} value={m.id}>
												{m.name} · {m.ministry}
											</option>
										))}
									</optgroup>
									<optgroup label='Equipo de Mentoreo'>
										{equipo.map((m) => (
											<option key={m.id} value={m.id}>
												{m.name}
											</option>
										))}
									</optgroup>
								</select>
								<span className='material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant'>
									expand_more
								</span>
							</div>
							{mentor && (
								<div className='mt-3 flex items-center gap-3 p-3 rounded-lg bg-surface-container-low'>
									<div className='w-9 h-9 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-label-md text-label-md select-none shrink-0'>
										{initials(mentor.name)}
									</div>
									<div>
										<p className='font-body-md text-body-md text-on-surface'>{mentor.name}</p>
										<p className='font-body-sm text-body-sm text-on-surface-variant text-[11px]'>
											{mentor.role === 'lider' ? `Líder · ${mentor.ministry}` : 'Equipo de Mentoreo'}
										</p>
									</div>
								</div>
							)}
						</div>

						{/* Estado de consolidación */}
						<div className='bg-surface rounded-xl p-5 border border-outline-variant'>
							<h2 className='font-headline-md text-[18px] text-on-surface mb-3'>
								Estado
							</h2>
							<div className='flex flex-col gap-2'>
								{STATUS_ORDER.map((s) => {
									const active = convertido.status === s;
									return (
										<button
											key={s}
											onClick={() => setStatus(convertido.id, s)}
											className={`flex items-center gap-2 px-3 py-2.5 min-h-[44px] rounded-lg border font-label-md text-label-md transition-[background-color,border-color] ${
												active
													? `${STATUS_META[s].chip} border-transparent`
													: 'border-outline-variant text-on-surface-variant hover:bg-surface-container'
											}`}
										>
											<span className={`w-2.5 h-2.5 rounded-full ${STATUS_META[s].dot}`} />
											{STATUS_META[s].label}
											{active && (
												<span className='material-symbols-outlined text-[18px] ml-auto'>
													check
												</span>
											)}
										</button>
									);
								})}
							</div>
						</div>
					</div>

					{/* Columna derecha: consolidación / apuntes */}
					<div className='lg:col-span-2 space-y-6'>
						{/* Nueva anotación */}
						<div className='bg-surface rounded-xl p-5 border border-outline-variant'>
							<h2 className='font-headline-md text-[18px] text-on-surface mb-4'>
								Registrar reunión o apunte
							</h2>
							<div className='flex flex-col sm:flex-row gap-3 mb-3'>
								<div className='flex gap-2'>
									{NOTE_ORDER.map((t) => (
										<button
											key={t}
											onClick={() => setNoteType(t)}
											className={`flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-lg border font-label-sm text-label-sm transition-[background-color,border-color] ${
												noteType === t
													? 'bg-primary-container text-on-primary-container border-transparent'
													: 'border-outline-variant text-on-surface-variant hover:bg-surface-container'
											}`}
										>
											<span className='material-symbols-outlined text-[18px]'>
												{NOTE_META[t].icon}
											</span>
											{NOTE_META[t].label}
										</button>
									))}
								</div>
								<input
									type='date'
									value={noteDate}
									onChange={(e) => setNoteDate(e.target.value)}
									className='px-3 py-2 border border-outline-variant rounded-lg bg-surface-container-low text-on-surface font-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-[box-shadow] sm:ml-auto'
								/>
							</div>
							<textarea
								rows={3}
								value={noteText}
								onChange={(e) => setNoteText(e.target.value)}
								placeholder='¿Qué se conversó? Compromisos, temas del estudio, situación de la persona...'
								className='w-full px-3 py-2.5 border border-outline-variant rounded-lg bg-surface-lowest text-on-surface font-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none transition-[box-shadow]'
							/>
							<div className='flex justify-end mt-3'>
								<button
									onClick={handleAddNote}
									disabled={!noteText.trim()}
									className='flex items-center gap-2 px-5 py-2.5 min-h-[44px] bg-primary text-on-primary rounded-full font-label-md text-label-md hover:opacity-90 transition-[opacity] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed'
								>
									<span className='material-symbols-outlined text-[18px]'>add</span>
									Guardar apunte
								</button>
							</div>
						</div>

						{/* Historial de consolidación */}
						<div className='bg-surface rounded-xl p-5 border border-outline-variant'>
							<h2 className='font-headline-md text-[18px] text-on-surface mb-4'>
								Reuniones de consolidación ({convertido.consolidation.length})
							</h2>
							{convertido.consolidation.length === 0 ? (
								<p className='font-body-sm text-body-sm text-on-surface-variant'>
									Aún no hay apuntes. Registra la primera reunión arriba.
								</p>
							) : (
								<div className='relative pl-6 border-l-2 border-surface-variant space-y-6'>
									{convertido.consolidation.map((n) => (
										<div key={n.id} className='relative'>
											<div className='absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-primary border-4 border-surface' />
											<div className='flex flex-wrap items-center gap-2'>
												<span className='flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm'>
													<span className='material-symbols-outlined text-[14px]'>
														{NOTE_META[n.type].icon}
													</span>
													{NOTE_META[n.type].label}
												</span>
												<span className='font-label-sm text-label-sm text-on-surface-variant'>
													{relativeDateLabel(n.date)}
												</span>
											</div>
											<p className='font-body-md text-body-md text-on-surface mt-1.5'>
												{n.text}
											</p>
											<p className='font-body-sm text-body-sm text-on-surface-variant text-[11px] mt-1'>
												Registrado por {n.author}
											</p>
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}

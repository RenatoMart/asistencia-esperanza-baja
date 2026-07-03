import Link from 'next/link';

const ministryCards = [
	{
		name: 'Caballeros',
		icon: 'engineering',
		color: 'primary',
		leader: 'Miguel Vargas',
		count: 45,
		border: 'border-b-primary',
	},
	{
		name: 'Damas',
		icon: 'face_3',
		color: 'secondary',
		leader: 'Maria Gonzalez',
		count: 62,
		border: 'border-b-secondary',
	},
	{
		name: 'Jóvenes',
		icon: 'celebration',
		color: 'tertiary',
		leader: 'David Reyes',
		count: 85,
		border: 'border-b-tertiary',
	},
	{
		name: 'EsLider',
		icon: 'school',
		color: 'primary-fixed-dim',
		leader: 'Pastor Carlos',
		count: 120,
		border: 'border-b-primary-fixed-dim',
		labelKey: 'Inscritos',
	},
];

const recentActivity = [
	{
		icon: 'how_to_reg',
		bg: 'bg-primary-container',
		text: (
			<>
				<span className='font-medium'>Juan Perez</span> registró asistencia para Jóvenes.
			</>
		),
		time: 'hace 10 min',
	},
	{
		icon: 'edit_calendar',
		bg: 'bg-secondary-container',
		text: (
			<>
				<span className='font-medium'>Maria G.</span> actualizó el horario de Damas retreat.
			</>
		),
		time: 'hace 2 horas',
	},
	{
		icon: 'person_add',
		bg: 'bg-tertiary-container',
		text: (
			<>
				<span className='font-medium'>Admin</span> añadió 3 nuevos miembros a EsLider.
			</>
		),
		time: 'Ayer',
	},
];

export default function DashboardPage() {
	return (
		<main className='p-4 md:p-margin-desktop bg-surface-container-low min-h-full'>
			<div className='max-w-container-max mx-auto space-y-8'>
				{/* Hero Metrics */}
				<section className='grid grid-cols-1 md:grid-cols-3 gap-6'>
					{/* Total Members */}
					<div className='bg-surface rounded-xl p-6 border border-outline-variant shadow-sm relative overflow-hidden group transform-gpu'>
						<div className='absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full group-hover:scale-110 transition-[transform] duration-500 transform-gpu will-change-transform' />
						<div className='flex justify-between items-start mb-4 relative z-10'>
							<div>
								<p className='font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider'>
									TOTAL DE MIEMBROS
								</p>
								<h2 className='font-display-lg text-display-lg text-on-surface mt-1'>
									1,248
								</h2>
							</div>
							<div className='w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center'>
								<span
									className='material-symbols-outlined'
									style={{ fontVariationSettings: "'FILL' 1" }}
								>
									group
								</span>
							</div>
						</div>
						<div className='flex items-center gap-2 text-primary font-label-sm text-label-sm'>
							<span className='material-symbols-outlined text-[16px]'>trending_up</span>
							<span>+12 este mes</span>
						</div>
					</div>

					{/* Active Ministries */}
					<div className='bg-surface rounded-xl p-6 border border-outline-variant shadow-sm relative overflow-hidden group transform-gpu'>
						<div className='absolute -right-4 -top-4 w-24 h-24 bg-secondary/5 rounded-full group-hover:scale-110 transition-[transform] duration-500 transform-gpu will-change-transform' />
						<div className='flex justify-between items-start mb-4 relative z-10'>
							<div>
								<p className='font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider'>
									MINISTERIOS ACTIVOS
								</p>
								<h2 className='font-display-lg text-display-lg text-on-surface mt-1'>
									8
								</h2>
							</div>
							<div className='w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center'>
								<span
									className='material-symbols-outlined'
									style={{ fontVariationSettings: "'FILL' 1" }}
								>
									diversity_3
								</span>
							</div>
						</div>
						<div className='flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm'>
							<span className='material-symbols-outlined text-[16px]'>check_circle</span>
							<span>Funcionando correctamente</span>
						</div>
					</div>

					{/* Events */}
					<div className='bg-surface rounded-xl p-6 border border-outline-variant shadow-sm relative overflow-hidden group transform-gpu'>
						<div className='absolute -right-4 -top-4 w-24 h-24 bg-tertiary/5 rounded-full group-hover:scale-110 transition-[transform] duration-500 transform-gpu will-change-transform' />
						<div className='flex justify-between items-start mb-4 relative z-10'>
							<div>
								<p className='font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider'>
									EVENTOS ESTA SEMANA
								</p>
								<h2 className='font-display-lg text-display-lg text-on-surface mt-1'>
									5
								</h2>
							</div>
							<div className='w-10 h-10 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center'>
								<span
									className='material-symbols-outlined'
									style={{ fontVariationSettings: "'FILL' 1" }}
								>
									event
								</span>
							</div>
						</div>
						<div className='flex items-center gap-2 text-tertiary font-label-sm text-label-sm'>
							<span className='material-symbols-outlined text-[16px]'>
								notifications_active
							</span>
							<span>Siguiente: Culto de Jóvenes mañana</span>
						</div>
					</div>
				</section>

				{/* Bento Grid */}
				<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
					{/* Ministry Overview */}
					<div className='lg:col-span-2 space-y-6'>
						<div className='flex justify-between items-end'>
							<div>
								<h3 className='font-headline-md text-headline-md text-on-surface'>
									Resumen de Ministerios
								</h3>
								<p className='font-body-sm text-body-sm text-on-surface-variant mt-1'>
									Estado rápido de grupos activos
								</p>
							</div>
							<Link
								href='/ministerios'
								className='text-primary font-label-sm text-label-sm hover:underline'
							>
								Ver Todo
							</Link>
						</div>

						<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
							{ministryCards.map((m) => (
								<div
									key={m.name}
									className={`bg-surface rounded-xl p-5 border-b-4 ${m.border} shadow-sm hover:shadow-md transition-[box-shadow]`}
								>
									<div className='flex justify-between items-start mb-4'>
										<h4 className='font-headline-md text-[20px] text-on-surface'>
											{m.name}
										</h4>
										<span className={`material-symbols-outlined text-${m.color}`}>
											{m.icon}
										</span>
									</div>
									<div className='space-y-2'>
										<div className='flex justify-between items-center text-body-sm'>
											<span className='text-on-surface-variant'>
												{m.name === 'EsLider' ? 'Director' : 'Líder'}
											</span>
											<span className='font-medium text-on-surface'>{m.leader}</span>
										</div>
										<div className='flex justify-between items-center text-body-sm'>
											<span className='text-on-surface-variant'>
												{m.labelKey ?? 'Equipo'}
											</span>
											<span className='font-medium text-on-surface bg-surface-container px-2 py-0.5 rounded-full'>
												{m.count}
											</span>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Sidebar Widgets */}
					<div className='space-y-6'>
						{/* Today's Schedule */}
						<div className='bg-surface rounded-xl p-6 border border-outline-variant shadow-sm'>
							<h3 className='font-headline-md text-headline-md text-on-surface mb-4'>
								Agenda de Hoy
							</h3>
							<div className='relative pl-6 border-l-2 border-surface-variant space-y-6'>
								<div className='relative'>
									<div className='absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-primary border-4 border-surface' />
									<p className='font-label-sm text-label-sm text-primary mb-1'>
										18:00 - 20:00
									</p>
									<p className='font-body-md text-body-md font-medium text-on-surface'>
										Ensayo de Alabanza
									</p>
									<p className='font-body-sm text-body-sm text-on-surface-variant'>
										Auditorio Principal
									</p>
								</div>
								<div className='relative'>
									<div className='absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-tertiary-container border-4 border-surface' />
									<p className='font-label-sm text-label-sm text-on-surface-variant mb-1'>
										20:30 - 22:00
									</p>
									<p className='font-body-md text-body-md font-medium text-on-surface'>
										Reunión de Líderes Jóvenes
									</p>
									<p className='font-body-sm text-body-sm text-on-surface-variant'>
										Salón 3B
									</p>
								</div>
							</div>
							<Link
								href='/calendario'
								className='block w-full mt-6 py-2 border border-outline-variant rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container transition-[background-color] text-center'
							>
								Ver Calendario Completo
							</Link>
						</div>

						{/* Recent Activity */}
						<div className='bg-surface rounded-xl p-6 border border-outline-variant shadow-sm'>
							<h3 className='font-headline-md text-headline-md text-on-surface mb-4'>
								Actividad Reciente
							</h3>
							<ul className='space-y-4'>
								{recentActivity.map((item, i) => (
									<li key={i} className='flex gap-3'>
										<div
											className={`w-8 h-8 rounded-full ${item.bg} flex items-center justify-center flex-shrink-0`}
										>
											<span className='material-symbols-outlined text-[16px]'>
												{item.icon}
											</span>
										</div>
										<div>
											<p className='font-body-sm text-body-sm text-on-surface'>
												{item.text}
											</p>
											<p className='font-label-sm text-label-sm text-on-surface-variant mt-0.5'>
												{item.time}
											</p>
										</div>
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}

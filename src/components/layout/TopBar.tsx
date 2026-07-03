'use client';

export default function TopBar() {
	return (
		<header className='sticky top-0 z-50 flex justify-between items-center w-full px-4 md:px-margin-desktop h-16 bg-surface border-b border-outline-variant shrink-0'>
			<div className='flex items-center gap-4 flex-1'>
				<button className='md:hidden text-on-surface-variant hover:bg-surface-container transition-[background-color] p-2 rounded-full'>
					<span className='material-symbols-outlined'>menu</span>
				</button>
				<span className='md:hidden font-headline-md text-headline-md font-bold text-primary'>
					IDP
				</span>
				<span className='hidden md:block font-headline-md text-headline-md font-bold text-primary'>
					IDP
				</span>
				<div className='hidden md:flex relative max-w-sm w-full ml-4'>
					<span className='material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant'>
						search
					</span>
					<input
						type='text'
						placeholder='Buscar...'
						className='w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-full font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-[box-shadow]'
					/>
				</div>
			</div>

			<div className='flex items-center gap-1'>
				<button className='hidden md:block px-4 py-2 border border-primary text-primary rounded-full font-label-md text-label-md hover:bg-surface-container transition-[background-color] mr-2'>
					Registrar Asistencia
				</button>
				<button className='hidden md:block px-4 py-2 bg-primary text-on-primary rounded-full font-label-md text-label-md hover:opacity-90 transition-[opacity] mr-2'>
					Añadir Evento
				</button>
				<button className='text-on-surface-variant hover:bg-surface-container transition-[background-color] p-2 rounded-full'>
					<span className='material-symbols-outlined'>notifications</span>
				</button>
				<button className='hidden sm:block text-on-surface-variant hover:bg-surface-container transition-[background-color] p-2 rounded-full'>
					<span className='material-symbols-outlined'>settings</span>
				</button>
				<div className='w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-xs ml-2 cursor-pointer border border-outline-variant select-none'>
					AM
				</div>
			</div>
		</header>
	);
}

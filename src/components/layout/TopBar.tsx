'use client';

import MobileMenu from '@/components/layout/MobileMenu';

export default function TopBar() {
	return (
		<header className='sticky top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between border-b border-outline-variant bg-surface px-4 md:px-margin-desktop'>
			<div className='flex min-w-0 flex-1 items-center gap-4'>
				<MobileMenu />
				<span className='font-headline-md text-headline-md font-bold text-primary md:hidden'>
					IDP
				</span>
				<span className='hidden font-headline-md text-headline-md font-bold text-primary md:block'>
					IDP
				</span>
				<div className='relative ml-4 hidden w-full max-w-sm md:flex'>
					<span className='material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant'>
						search
					</span>
					<input
						type='text'
						placeholder='Buscar...'
						className='w-full rounded-full border border-outline-variant bg-surface-container-low py-2 pl-10 pr-4 font-body-sm text-body-sm transition-[box-shadow] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary'
					/>
				</div>
			</div>

			<div className='flex items-center gap-1'>
				<button className='mr-2 hidden rounded-full border border-primary px-4 py-2 font-label-md text-label-md text-primary transition-[background-color] hover:bg-surface-container md:block'>
					Registrar Asistencia
				</button>
				<button className='mr-2 hidden rounded-full bg-primary px-4 py-2 font-label-md text-label-md text-on-primary transition-[opacity] hover:opacity-90 md:block'>
					Añadir Evento
				</button>
				<button className='rounded-full p-2 text-on-surface-variant transition-[background-color] hover:bg-surface-container'>
					<span className='material-symbols-outlined'>notifications</span>
				</button>
				<button className='hidden rounded-full p-2 text-on-surface-variant transition-[background-color] hover:bg-surface-container sm:block'>
					<span className='material-symbols-outlined'>settings</span>
				</button>
				<div className='ml-2 flex h-8 w-8 cursor-pointer select-none items-center justify-center rounded-full border border-outline-variant bg-secondary-container text-xs font-bold text-on-secondary-container'>
					AM
				</div>
			</div>
		</header>
	);
}

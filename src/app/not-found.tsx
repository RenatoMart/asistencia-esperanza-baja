import Link from 'next/link';

import Illustration404 from '@/components/ui/Illustration404';

export default function NotFound() {
	return (
		<main className='flex min-h-screen flex-col items-center justify-center bg-background px-margin-mobile py-16 text-center md:px-margin-desktop'>
			<Illustration404 />

			<h1 className='mt-8 font-headline-lg text-headline-lg text-on-surface'>
				Página no encontrada
			</h1>
			<p className='mt-3 max-w-sm font-body-md text-body-md text-on-surface-variant'>
				La ruta que buscas no existe o fue movida.
			</p>

			<Link
				href='/dashboard'
				className='mt-8 rounded-full bg-primary px-6 py-3 font-label-md text-label-md text-on-primary transition-[opacity] hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'
			>
				Volver al Panel
			</Link>
		</main>
	);
}

import type { Metadata } from 'next';
import { Inter, Literata } from 'next/font/google';
import './globals.css';

const inter = Inter({
	variable: '--font-inter',
	subsets: ['latin'],
	display: 'swap',
	weight: ['400', '500', '600'],
});

const literata = Literata({
	variable: '--font-literata',
	subsets: ['latin'],
	display: 'swap',
	weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
	title: 'Admin — Iglesia de Dios de la Profecía',
	description: 'Panel de administración — Iglesia de Dios de la Profecía, Esperanza Baja.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang='es' className={`${inter.variable} ${literata.variable}`}>
			<head>
				<link rel='preconnect' href='https://fonts.googleapis.com' />
				<link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='' />
				<link
					rel='stylesheet'
					href='https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap'
				/>
			</head>
			<body className='antialiased'>{children}</body>
		</html>
	);
}

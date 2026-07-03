'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
	{ href: '/dashboard', label: 'Panel de Control', icon: 'dashboard' },
	{ href: '/ministerios', label: 'Ministerios', icon: 'groups' },
	{ href: '/asistencia', label: 'Asistencia', icon: 'how_to_reg' },
	{ href: '/miembros', label: 'Miembros', icon: 'person_search' },
	{ href: '/calendario', label: 'Calendario', icon: 'calendar_month' },
];

const footerLinks = [
	{ href: '/ayuda', label: 'Ayuda y Soporte', icon: 'help' },
	{ href: '/configuracion', label: 'Configuración', icon: 'settings' },
];

export default function Sidebar() {
	const pathname = usePathname();

	return (
		<nav className='hidden md:flex fixed left-0 top-0 h-screen w-64 flex-col p-4 z-40 border-r border-outline-variant bg-surface-container'>
			<div className='mb-8 px-4 flex items-center gap-4'>
				<div className='w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm select-none'>
					GC
				</div>
				<div>
					<h1 className='font-headline-md text-headline-md font-bold text-primary leading-tight'>
						IDP
					</h1>
					<p className='font-body-sm text-body-sm text-on-surface-variant'>Esperanza Baja</p>
				</div>
			</div>

			<ul className='flex flex-col gap-1 flex-grow'>
				{navLinks.map((link) => {
					const isActive = pathname === link.href;
					return (
						<li key={link.href}>
							<Link
								href={link.href}
								className={`flex items-center gap-3 px-4 py-3 rounded-lg font-label-md text-label-md transition-[background-color,color] ${
									isActive
										? 'bg-secondary-container text-on-secondary-container font-bold scale-95'
										: 'text-on-surface-variant hover:bg-surface-container-high'
								}`}
							>
								<span
									className='material-symbols-outlined'
									style={
										isActive
											? { fontVariationSettings: "'FILL' 1" }
											: undefined
									}
								>
									{link.icon}
								</span>
								{link.label}
							</Link>
						</li>
					);
				})}
			</ul>

			<ul className='mt-auto flex flex-col gap-1 border-t border-outline-variant pt-4'>
				{footerLinks.map((link) => (
					<li key={link.href}>
						<Link
							href={link.href}
							className='flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high rounded-lg font-label-md text-label-md transition-[background-color]'
						>
							<span className='material-symbols-outlined'>{link.icon}</span>
							{link.label}
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
}

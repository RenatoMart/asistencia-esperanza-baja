'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
	{ href: '/dashboard', label: 'Inicio', icon: 'dashboard' },
	{ href: '/asistencia', label: 'Asist.', icon: 'how_to_reg' },
	{ href: '/visitas', label: 'Visitas', icon: 'waving_hand' },
	{ href: '/convertidos', label: 'Nuevos', icon: 'volunteer_activism' },
	{ href: '/miembros', label: 'Miembros', icon: 'person_search' },
];

export default function MobileBottomNav() {
	const pathname = usePathname();

	return (
		<nav className='md:hidden fixed bottom-0 left-0 w-full bg-surface border-t border-outline-variant flex justify-around items-center h-16 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]'>
			{navLinks.map((link) => {
				const isActive =
					pathname === link.href || pathname.startsWith(`${link.href}/`);
				return (
					<Link
						key={link.href}
						href={link.href}
						className={`flex flex-1 flex-col items-center gap-0.5 px-1 transition-[color] ${
							isActive ? 'text-primary' : 'text-on-surface-variant'
						}`}
					>
						{isActive ? (
							<div className='bg-secondary-container text-on-secondary-container px-3.5 py-1 rounded-full'>
								<span
									className='material-symbols-outlined'
									style={{ fontVariationSettings: "'FILL' 1" }}
								>
									{link.icon}
								</span>
							</div>
						) : (
							<span className='material-symbols-outlined'>{link.icon}</span>
						)}
						<span className='text-[10px] font-medium whitespace-nowrap'>{link.label}</span>
					</Link>
				);
			})}
		</nav>
	);
}

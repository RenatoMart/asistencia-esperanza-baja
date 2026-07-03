'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
	{ href: '/dashboard', label: 'Inicio', icon: 'dashboard' },
	{ href: '/ministerios', label: 'Grupos', icon: 'groups' },
	{ href: '/asistencia', label: 'Asistencia', icon: 'how_to_reg' },
	{ href: '/miembros', label: 'Miembros', icon: 'person_search' },
];

export default function MobileBottomNav() {
	const pathname = usePathname();

	return (
		<nav className='md:hidden fixed bottom-0 left-0 w-full bg-surface border-t border-outline-variant flex justify-around items-center h-16 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]'>
			{navLinks.map((link) => {
				const isActive = pathname === link.href;
				return (
					<Link
						key={link.href}
						href={link.href}
						className={`flex flex-col items-center gap-0.5 px-3 transition-[color] ${
							isActive ? 'text-primary' : 'text-on-surface-variant'
						}`}
					>
						{isActive ? (
							<div className='bg-secondary-container text-on-secondary-container px-4 py-1 rounded-full'>
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
						<span className='text-[10px] font-medium'>{link.label}</span>
					</Link>
				);
			})}
		</nav>
	);
}

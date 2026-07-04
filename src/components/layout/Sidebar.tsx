'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { footerLinks, navLinks } from '@/components/layout/nav-links';

export default function Sidebar() {
	const pathname = usePathname();

	return (
		<nav className='fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-outline-variant bg-surface-container p-4 md:flex'>
			<div className='mb-8 flex items-center gap-4 px-4'>
				<div className='flex h-10 w-10 select-none items-center justify-center rounded-full bg-primary-container text-sm font-bold text-on-primary-container'>
					GC
				</div>
				<div>
					<h1 className='font-headline-md text-headline-md font-bold leading-tight text-primary'>
						IDP
					</h1>
					<p className='font-body-sm text-body-sm text-on-surface-variant'>
						Esperanza Baja
					</p>
				</div>
			</div>

			<ul className='flex flex-grow flex-col gap-1'>
				{navLinks.map(link => {
					const isActive =
						pathname === link.href || pathname.startsWith(`${link.href}/`);
					return (
						<li key={link.href}>
							<Link
								href={link.href}
								className={`flex items-center gap-3 rounded-lg px-4 py-3 font-label-md text-label-md transition-[background-color,color] ${
									isActive
										? 'scale-95 bg-secondary-container font-bold text-on-secondary-container'
										: 'text-on-surface-variant hover:bg-surface-container-high'
								}`}
							>
								<span
									className='material-symbols-outlined'
									style={
										isActive ? { fontVariationSettings: "'FILL' 1" } : undefined
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
				{footerLinks.map(link => (
					<li key={link.href}>
						<Link
							href={link.href}
							className='flex items-center gap-3 rounded-lg px-4 py-3 font-label-md text-label-md text-on-surface-variant transition-[background-color] hover:bg-surface-container-high'
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

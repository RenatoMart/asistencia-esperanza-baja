'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { footerLinks, navLinks } from '@/components/layout/nav-links';

export default function MobileMenu() {
	const pathname = usePathname();
	const [open, setOpen] = useState(false);
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);

	// Cerrar el drawer al navegar a otra ruta.
	useEffect(() => {
		setOpen(false);
	}, [pathname]);

	// Bloquear el scroll del fondo mientras el drawer está abierto.
	useEffect(() => {
		if (!open) return;
		const prev = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = prev;
		};
	}, [open]);

	const isActive = (href: string) =>
		pathname === href || pathname.startsWith(`${href}/`);

	return (
		<>
			<button
				onClick={() => setOpen(true)}
				aria-label='Abrir menú'
				aria-expanded={open}
				className='rounded-full p-2 text-on-surface-variant transition-[background-color] hover:bg-surface-container md:hidden'
			>
				<span className='material-symbols-outlined'>menu</span>
			</button>

			{/* Drawer + backdrop (solo móvil) — vía portal a body para evitar
			    quedar atrapado en el contexto de apilamiento del header. */}
			{mounted &&
				createPortal(
					<div
						className={`fixed inset-0 z-[90] md:hidden ${open ? '' : 'pointer-events-none'}`}
					>
						<div
							onClick={() => setOpen(false)}
							className={`absolute inset-0 bg-black/40 transition-[opacity] duration-200 ${
								open ? 'opacity-100' : 'opacity-0'
							}`}
						/>
						<nav
							className={`absolute left-0 top-0 flex h-full w-72 max-w-[82%] transform-gpu flex-col border-r border-outline-variant bg-surface-container p-4 transition-[transform] duration-200 ${
								open ? 'translate-x-0' : '-translate-x-full'
							}`}
						>
							<div className='mb-6 flex items-center justify-between px-2'>
								<div className='flex items-center gap-3'>
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
								<button
									onClick={() => setOpen(false)}
									aria-label='Cerrar menú'
									className='rounded-full p-2 text-on-surface-variant transition-[background-color] hover:bg-surface-container-high'
								>
									<span className='material-symbols-outlined'>close</span>
								</button>
							</div>

							<ul className='flex flex-grow flex-col gap-1 overflow-y-auto'>
								{navLinks.map(link => {
									const active = isActive(link.href);
									return (
										<li key={link.href}>
											<Link
												href={link.href}
												className={`flex min-h-[48px] items-center gap-3 rounded-lg px-4 py-3 font-label-md text-label-md transition-[background-color,color] ${
													active
														? 'bg-secondary-container font-bold text-on-secondary-container'
														: 'text-on-surface-variant hover:bg-surface-container-high'
												}`}
											>
												<span
													className='material-symbols-outlined'
													style={
														active
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
								{footerLinks.map(link => (
									<li key={link.href}>
										<Link
											href={link.href}
											className='flex min-h-[48px] items-center gap-3 rounded-lg px-4 py-3 font-label-md text-label-md text-on-surface-variant transition-[background-color] hover:bg-surface-container-high'
										>
											<span className='material-symbols-outlined'>
												{link.icon}
											</span>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</nav>
					</div>,
					document.body,
				)}
		</>
	);
}

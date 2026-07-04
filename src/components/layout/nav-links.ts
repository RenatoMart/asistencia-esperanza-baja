// Navegación principal compartida por el Sidebar (desktop) y el MobileMenu (drawer).
export interface NavLink {
	href: string;
	label: string;
	icon: string;
}

export const navLinks: NavLink[] = [
	{ href: '/dashboard', label: 'Panel de Control', icon: 'dashboard' },
	{ href: '/ministerios', label: 'Ministerios', icon: 'groups' },
	{ href: '/asistencia', label: 'Asistencia', icon: 'how_to_reg' },
	{ href: '/visitas', label: 'Visitas', icon: 'waving_hand' },
	{ href: '/convertidos', label: 'Convertidos', icon: 'volunteer_activism' },
	{ href: '/miembros', label: 'Miembros', icon: 'person_search' },
	{ href: '/calendario', label: 'Calendario', icon: 'calendar_month' },
];

export const footerLinks: NavLink[] = [
	{ href: '/ayuda', label: 'Ayuda y Soporte', icon: 'help' },
	{ href: '/configuracion', label: 'Configuración', icon: 'settings' },
];

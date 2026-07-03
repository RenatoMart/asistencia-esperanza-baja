export default function Footer() {
	return (
		<footer className='w-full py-6 px-4 md:px-margin-desktop flex flex-col md:flex-row justify-between items-center border-t border-outline-variant text-on-surface-variant font-body-sm text-body-sm'>
			<p>© 2024 Iglesia de Dios de la Profecía — Esperanza Baja. Versión 2.1.0</p>
			<div className='flex gap-4 mt-4 md:mt-0'>
				<a href='#' className='hover:text-primary transition-[color] font-label-sm text-label-sm'>
					Política de Privacidad
				</a>
				<a href='#' className='hover:text-primary transition-[color] font-label-sm text-label-sm'>
					Términos de Servicio
				</a>
				<a href='#' className='hover:text-primary transition-[color] font-label-sm text-label-sm'>
					Soporte
				</a>
			</div>
		</footer>
	);
}

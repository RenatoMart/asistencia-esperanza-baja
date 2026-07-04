import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import { ConvertidosProvider } from '@/lib/convertidos-store';
import { MiembrosProvider } from '@/lib/miembros-store';
import { VisitasProvider } from '@/lib/visitas-store';

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<MiembrosProvider>
			<ConvertidosProvider>
				<VisitasProvider>
					<div className='flex h-screen overflow-hidden bg-background text-on-background'>
						<Sidebar />
						<div className='flex h-screen min-w-0 flex-1 flex-col overflow-hidden md:ml-64'>
							<TopBar />
							<div className='flex-1 overflow-y-auto overflow-x-hidden pb-16 md:pb-0'>
								{children}
								<Footer />
							</div>
							<MobileBottomNav />
						</div>
					</div>
				</VisitasProvider>
			</ConvertidosProvider>
		</MiembrosProvider>
	);
}

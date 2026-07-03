import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className='flex h-screen overflow-hidden bg-background text-on-background'>
			<Sidebar />
			<div className='flex-1 flex flex-col md:ml-64 h-screen overflow-hidden'>
				<TopBar />
				<div className='flex-1 overflow-y-auto pb-16 md:pb-0'>
					{children}
					<Footer />
				</div>
				<MobileBottomNav />
			</div>
		</div>
	);
}

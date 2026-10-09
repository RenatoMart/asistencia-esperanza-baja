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
					href='https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0..1,0&icon_names=add,arrow_back,arrow_drop_down,assignment_late,auto_stories,cake,calendar_month,calendar_today,call,campaign,cancel,celebration,chat,check,check_circle,chevron_left,chevron_right,child_care,church,close,dashboard,delete,diversity_3,done_all,download,edit,edit_calendar,engineering,event,event_available,event_busy,expand_more,face_3,favorite,forum,group,group_off,groups,handshake,help,history_edu,home,how_to_reg,local_fire_department,mail,man,menu,more_vert,notifications,notifications_active,people,person_add,person_alert,person_off,person_pin,person_search,save,savings,schedule,school,search,search_off,settings,star,sticky_note_2,travel_explore,trending_up,volunteer_activism,water_drop,waving_hand,woman&display=block'
				/>
			</head>
			<body className='antialiased'>{children}</body>
		</html>
	);
}

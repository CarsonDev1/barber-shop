// app/layout.tsx
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import Header from '@/app/components/header';
import '@/app/globals.css';
import Chats from '@/app/components/chats';
import { Toaster } from '@/components/ui/sonner';
import Footer from '@/app/components/footer';

const poppins = Poppins({
	weight: ['400', '500', '600', '700', '800', '900'],
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Barber Shop',
	description: 'Barber Shop Hair Cut',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en'>
			<body className={poppins.className}>
				<Header />
				{children}
				<Chats />
				<Toaster />
				<Footer />
			</body>
		</html>
	);
}

'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Menu, UserRound, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Logo from '@/public/root/Logo.png';

function useMediaQuery(query: string) {
	const [matches, setMatches] = useState(false);

	useEffect(() => {
		const media = window.matchMedia(query);
		if (media.matches !== matches) {
			setMatches(media.matches);
		}
		const listener = () => setMatches(media.matches);
		media.addListener(listener);
		return () => media.removeListener(listener);
	}, [matches, query]);

	return matches;
}

export default function Header() {
	const [isOpen, setIsOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const isLargeScreen = useMediaQuery('(min-width: 768px)');

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 0);
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	useEffect(() => {
		if (isLargeScreen) {
			setIsOpen(false);
		}
	}, [isLargeScreen]);

	const navItems = [
		{ name: 'Home', href: '/' },
		{ name: 'About Barber', href: '/about' },
		{ name: 'Book', href: '/book' },
		{ name: 'Review', href: '/review' },
		{ name: 'Service', href: '/service' },
		{ name: 'Contact', href: '/contact' },
		{ name: 'Review & Feedback', href: '/feedback' },
	];

	return (
		<header
			className={`w-full bg-black text-white fixed top-0 z-50 transition-all ${isScrolled ? 'shadow-lg' : ''}`}
		>
			<div className='container-lg'>
				<nav className='flex items-center justify-between h-16 md:h-20'>
					<div className='flex items-center gap-2'>
						<Image
							src={Logo}
							alt='Barber Shop Logo'
							width={80}
							height={98}
							className='size-14 md:size-20'
						/>
					</div>
					<div className='hidden md:flex items-center gap-8'>
						{navItems.map((item) => (
							<Link
								key={item.name}
								className='text-sm hover:text-gray-300 transition-colors'
								href={item.href}
							>
								{item.name}
							</Link>
						))}
					</div>
					<div className='flex items-center gap-4'>
						<Link href='/login'>
							<Button
								className='hidden md:flex items-center gap-2 bg-transparent hover:bg-white hover:text-black transition-colors'
								variant='outline'
							>
								<UserRound className='w-4 h-4' />
								LOGIN/REGISTER
							</Button>
						</Link>
						<Sheet open={isOpen} onOpenChange={setIsOpen}>
							<SheetTrigger asChild>
								<Button variant='ghost' size='icon' className='md:hidden'>
									<Menu className='h-6 w-6' />
									<span className='sr-only'>Toggle menu</span>
								</Button>
							</SheetTrigger>
							<SheetContent side='right' className='w-[300px] sm:w-[400px] bg-black p-0 border-none'>
								<SheetClose className='absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary'>
									<X className='h-4 w-4 text-white' />
									<span className='sr-only'>Close</span>
								</SheetClose>
								<div className='flex items-center justify-between p-4 border-b border-gray-800'>
									<Image
										src={Logo}
										alt='Barber Shop Logo'
										width={80}
										height={98}
										className='size-20 mx-auto'
									/>
								</div>
								<nav className='flex flex-col gap-1 p-4 flex-grow'>
									{navItems.map((item) => (
										<Link
											key={item.name}
											href={item.href}
											className='text-white hover:bg-gray-800 px-4 py-2 rounded-md transition-colors'
											onClick={() => setIsOpen(false)}
										>
											{item.name}
										</Link>
									))}
								</nav>
								<Link href='/login'>
									<div className='p-4 border-t border-gray-800'>
										<Button
											className='w-full flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-200 transition-colors'
											variant='outline'
										>
											<UserRound className='w-4 h-4' />
											LOGIN/REGISTER
										</Button>
									</div>
								</Link>
							</SheetContent>
						</Sheet>
					</div>
				</nav>
			</div>
		</header>
	);
}

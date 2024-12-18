'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import {
	Menu,
	UserRound,
	X,
	Flag,
	Scissors,
	Gift,
	Edit,
	Calendar,
	CalendarCheck,
	LogOut,
	Bell,
	Receipt,
	SquareKanban,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useMemo } from 'react';
import Logo from '@/public/root/Logo.png';
import User from '@/public/root/user.png';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { getAccount } from '@/app/api/getProfile';
import '@/i18n';
import { getLogOut } from '@/app/api/getLogout';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getNotification } from '@/app/api/notification/getNotification';

export default function Header() {
	const { t, i18n } = useTranslation('common');
	const [isOpen, setIsOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const [notificationsOpen, setNotificationsOpen] = useState(false);
	const router = useRouter();
	const [tokenExchange, setTokenExchange] = useState<string | null>(null);

	const exchangeToken = async (token: string) => {
		try {
			const response = await fetch('https://52.187.14.110/api/auth/token-exchange', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ code: tokenExchange }),
			});

			if (!response.ok) {
				throw new Error('Token exchange faileds');
			}

			const data = await response.json();
			setTokenExchange(data);

			// Example: Save the new token to localStorage
			if (data?.payload) {
				localStorage.setItem('accessToken', data.payload);
				console.log('Token exchanged successfully:', data.payload);
			}
		} catch (error) {
			console.error('Error during token exchange:', error);
		}
	};

	console.log('tokenExchange', tokenExchange);

	useEffect(() => {
		// Access the full URL, including query parameters
		const currentUrl = window.location.href;

		// Extract the 'token_exchange' parameter from the URL
		const urlParams = new URLSearchParams(new URL(currentUrl).search);
		const token = urlParams.get('token_exchange');

		if (token) {
			setTokenExchange(token);
			// Save token to localStorage or perform other actions
			localStorage.setItem('token_exchange', token);

			// Optionally clean up the URL (remove query params)
			const cleanedUrl = currentUrl.split('?')[0];
			router.replace(cleanedUrl); // Uses shallow routing
		}
	}, [router]);

	const {
		data: dataProfile,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['dataProfile'],
		queryFn: getAccount,
	});

	const { data: dataNotification } = useQuery({
		queryKey: ['dataNotification'],
		queryFn: getNotification,
	});

	const Notification = dataNotification?.payload?.content;

	const unreadNotifications = Notification?.filter((notif: any) => !notif.seen) || [];

	const handleLogout = async () => {
		const accessToken = localStorage.getItem('accessToken');
		if (!accessToken) {
			console.warn('No access token found');
			return;
		}

		try {
			await getLogOut({ Authorization: accessToken });
			localStorage.removeItem('accessToken');
			sessionStorage.removeItem('cartitems');
			router.push('/login');
		} catch (error) {
			console.error('Logout failed:', error);
		}
	};

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 0);
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const languages = useMemo(
		() => [
			{ code: 'en', label: 'English', flag: '🇺🇸' },
			{ code: 'ko', label: '한국어', flag: '🇰🇷' },
		],
		[]
	);

	return (
		<header
			className={`w-full bg-black text-white z-50 fixed top-0 transition-all duration-300 ${
				isScrolled ? 'shadow-lg' : ''
			}`}
		>
			<div className='container-lg'>
				<nav className='flex items-center justify-between h-16 md:h-20'>
					<Link href='/'>
						<div className='flex items-center gap-2'>
							<Image
								src={Logo}
								alt='Barber Shop Logo'
								width={80}
								height={98}
								className='size-14 md:size-20'
							/>
						</div>
					</Link>
					<div className='hidden md:flex items-center gap-8'>
						{/* Navigation Items */}
						{[
							{ name: t('home'), href: '/' },
							{ name: t('aboutBarber'), href: '/about' },
							{ name: t('book'), href: '/book' },
							{ name: t('service'), href: '/service' },
							{ name: t('stylist'), href: '/staff' },
							{ name: t('reviewFeedback'), href: '/feedback' },
						].map((item) => (
							<Link
								key={item.href}
								className='text-sm hover:text-gray-300 transition-colors'
								href={item.href}
							>
								{item.name}
							</Link>
						))}
					</div>
					<div className='flex items-center gap-4'>
						{/* Language Switcher */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button className='flex items-center gap-2 text-sm bg-transparent text-white hover:text-gray-300'>
									<Flag className='w-4 h-4' />
									{languages.find((lang) => lang.code === i18n.language)?.label || 'English'}
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className='bg-white text-black w-32' style={{ overflow: 'visible' }}>
								{languages.map((lang) => (
									<DropdownMenuItem
										key={lang.code}
										onClick={() => i18n.changeLanguage(lang.code)}
										className='flex items-center gap-2'
									>
										<span>{lang.flag}</span>
										{lang.label}
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>

						{/* Bell Icon with Notification Count */}
						<Button
							variant='ghost'
							onClick={() => setNotificationsOpen(true)}
							className='relative flex items-center gap-2'
						>
							<Bell className='w-5 h-5' />
							{unreadNotifications.length > 0 && (
								<span className='absolute top-0 right-0 text-xs text-red-500 bg-white rounded-full px-1'>
									{unreadNotifications.length}
								</span>
							)}
						</Button>

						{/* Notifications Dropdown */}
						<Sheet open={notificationsOpen} onOpenChange={setNotificationsOpen}>
							<SheetContent
								side='right'
								className='w-[300px] sm:w-[400px] bg-gray-900 p-4 border-none shadow-lg rounded-lg'
							>
								<SheetClose className='absolute right-4 top-4 rounded-full bg-gray-800 p-2 opacity-70 hover:opacity-100 transition-opacity focus:outline-none'>
									<X className='h-4 w-4 text-white' />
									<span className='sr-only'>Close</span>
								</SheetClose>
								<h2 className='text-lg font-semibold text-white mb-4'>Notifications</h2>

								{Notification && Notification.length > 0 ? (
									<div className='flex flex-col gap-3 max-h-full overflow-y-auto'>
										{Notification.map((notif: any) => (
											<Link key={notif.id} href='#'>
												<div className='flex gap-3 bg-gray-800 p-3 rounded-md hover:bg-gray-700 transition'>
													<div className='flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white'>
														<Bell className='w-6 h-6' />
													</div>
													<div>
														<h3 className='text-sm font-medium text-white'>
															{notif.title}
														</h3>
														<p className='text-xs text-gray-400'>{notif.message}</p>
														<span className='text-xs text-gray-500'>
															{new Date(notif.createdAt).toLocaleString()}
														</span>
													</div>
												</div>
											</Link>
										))}
									</div>
								) : (
									<div className='flex items-center justify-center h-[200px]'>
										<p className='text-gray-400 text-sm'>No new notifications</p>
									</div>
								)}
							</SheetContent>
						</Sheet>

						{dataProfile ? (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<div className='flex items-center gap-2 cursor-pointer'>
										<Avatar className='size-7'>
											<AvatarImage
												src={dataProfile.avatar.thumbUrl}
												alt={dataProfile.avatar.name}
											/>
											<AvatarFallback>{dataProfile.avatar.thumbUrl}</AvatarFallback>
										</Avatar>
										<span className='text-xs'>{dataProfile.name}</span>
										{dataProfile?.rank ? (
											<span
												className={`px-2 py-1 bg-slate-200 rounded-md ${
													dataProfile?.rank === 'BRONZE'
														? 'bg-yellow-400/15 text-yellow-600'
														: dataProfile.rank === 'DIAMOND'
														? 'bg-blue-400/15 text-blue-600'
														: 'bg-green-400/15 text-green-600'
												}`}
											>
												{dataProfile?.rank}
											</span>
										) : (
											<span className='text-xs'>Not rank</span>
										)}
									</div>
								</DropdownMenuTrigger>
								<DropdownMenuContent className='w-56 bg-black text-white border border-gray-800'>
									{dataProfile?.role === 'ROLE_ADMIN' && (
										<DropdownMenuItem className='hover:bg-gray-800 cursor-pointer'>
											<Link href='/management' className='flex items-center gap-1'>
												<SquareKanban className='mr-2 h-4 w-4' />
												<span>{t('management')}</span>
											</Link>
										</DropdownMenuItem>
									)}
									{/* <DropdownMenuItem className='hover:bg-gray-800 cursor-pointer'>
										<Link href='/bill' className='flex items-center gap-1'>
											<Scissors className='mr-2 h-4 w-4' />
											<span>{t('historyHaircut')}</span>
										</Link>
									</DropdownMenuItem> */}
									<DropdownMenuItem className='hover:bg-gray-800 cursor-pointer'>
										<Link href='/offer' className='flex items-center gap-1'>
											<Gift className='mr-2 h-4 w-4' />
											<span>{t('yourOffer')}</span>
										</Link>
									</DropdownMenuItem>
									<DropdownMenuItem className='hover:bg-gray-800 cursor-pointer'>
										<Link href='/profile' className='flex items-center gap-1'>
											<Edit className='mr-2 h-4 w-4' />
											<span>{t('editInformation')}</span>
										</Link>
									</DropdownMenuItem>
									<DropdownMenuItem className='hover:bg-gray-800 cursor-pointer'>
										<Link href='/booking-calender' className='flex items-center gap-1'>
											<Calendar className='mr-2 h-4 w-4' />
											<span>{t('viewAppointment')}</span>
										</Link>
									</DropdownMenuItem>
									<DropdownMenuItem className='hover:bg-gray-800 cursor-pointer'>
										<Link href='/booking-confirm' className='flex items-center gap-1'>
											<CalendarCheck className='mr-2 h-4 w-4' />
											<span>{t('bookingConfirm')}</span>
										</Link>
									</DropdownMenuItem>
									<DropdownMenuItem
										className='hover:bg-gray-800 cursor-pointer text-red-400'
										onClick={handleLogout}
									>
										<LogOut className='mr-2 h-4 w-4' />
										<span>{t('logOut')}</span>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						) : (
							<Link href='/login'>
								<Button
									className='hidden md:flex items-center gap-2 bg-transparent hover:bg-white hover:text-black transition-colors'
									variant='outline'
								>
									<UserRound className='w-4 h-4' />
									<span>{t('login')}</span>
								</Button>
							</Link>
						)}

						{/* Mobile Menu (Sheet) */}
						<Sheet open={isOpen} onOpenChange={setIsOpen}>
							<SheetTrigger asChild>
								<Button variant='ghost' size='icon' className='md:hidden' aria-label='Toggle menu'>
									<Menu className='h-6 w-6' />
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
									{[
										{ name: t('home'), href: '/' },
										{ name: t('aboutBarber'), href: '/about' },
										{ name: t('book'), href: '/book' },
										{ name: t('service'), href: '/service' },
										{ name: t('contact'), href: '/contact' },
										{ name: t('reviewFeedback'), href: '/feedback' },
									].map((item) => (
										<Link
											key={item.href}
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
											<span>{t('login')}</span>
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

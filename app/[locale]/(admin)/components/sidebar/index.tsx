'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarInset,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarRail,
	SidebarTrigger,
} from '@/components/ui/sidebar';
import {
	BadgeCheck,
	Bell,
	Scissors,
	Settings,
	Users,
	MessageSquare,
	Calendar,
	Clock4,
	DollarSign,
	PlusSquare,
	ChevronsUpDown,
	CreditCard,
	LogOut,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';
import Logo from '@/public/root/Logo.png';

export interface NavItem {
	title: string;
	href: string;
	icon: any;
}

const navItems: NavItem[] = [
	{ title: 'MANAGEMENT STYLIST', href: '/management/stylist', icon: Scissors },
	{ title: 'MANAGEMENT SERVICE', href: '/management/service', icon: Settings },
	{ title: 'MANAGEMENT CUSTOMER', href: '/management/customer', icon: Users },
	{ title: 'MANAGEMENT FEEDBACK', href: '/management/feedback', icon: MessageSquare },
	{ title: 'MANAGEMENT BOOKING', href: '/management/booking', icon: Calendar },
	{ title: 'BARBER HISTORY', href: '/management/history', icon: Clock4 },
	{ title: 'ADD A HAIRCUT', href: '/management/haircut/add', icon: PlusSquare },
	{ title: 'MANAGEMENT INCOME', href: '/management/income', icon: DollarSign },
];

export default function AppSidebar({ children }: { children: React.ReactNode }) {
	const [mounted, setMounted] = React.useState(false);
	const pathname = usePathname();

	React.useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	return (
		<SidebarProvider>
			<Sidebar collapsible='icon' className='bg-gray-900 text-gray-200 !border-slate-700 hover:!border-slate-700'>
				<SidebarHeader className='bg-gray-900'>
					<div className='flex items-center gap-2 py-2 text-sidebar-accent-foreground'>
						<Image
							src={Logo}
							alt='Barber Shop Logo'
							width={80}
							height={98}
							className='size-14 md:size-20 mx-auto relative z-20'
						/>
					</div>
				</SidebarHeader>
				<SidebarContent className='overflow-x-hidden bg-gray-900'>
					<SidebarGroup>
						<SidebarGroupLabel className='text-white'>Overview</SidebarGroupLabel>
						<SidebarMenu className='flex flex-col gap-3 text-white'>
							{navItems.map((item) => (
								<SidebarMenuItem key={item.href}>
									<SidebarMenuButton asChild tooltip={item.title} isActive={pathname === item.href}>
										<Link href={item.href}>
											<div className='flex items-center gap-1'>
												<item.icon className='mr-3 size-6' />
												<span>{item.title}</span>
											</div>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroup>
				</SidebarContent>
				<SidebarFooter className='bg-gray-900'>
					<SidebarMenu>
						<SidebarMenuItem>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<SidebarMenuButton
										size='lg'
										className=' text-gray-200 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
									>
										<Avatar className='h-8 w-8 rounded-lg'>
											<AvatarImage src='' alt='' />
											<AvatarFallback className='rounded-lg'>{'CN'}</AvatarFallback>
										</Avatar>
										<div className='grid flex-1 text-left text-sm leading-tight'>
											<span className='truncate font-semibold'>{'CN'}</span>
											<span className='truncate text-xs'>{'CN'}</span>
										</div>
										<ChevronsUpDown className='ml-auto size-4' />
									</SidebarMenuButton>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									className='bg-gray-800 text-gray-200 w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
									side='bottom'
									align='end'
									sideOffset={4}
								>
									<DropdownMenuLabel className='p-0 font-normal'>
										<div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
											<Avatar className='h-8 w-8 rounded-lg'>
												<AvatarImage src='' alt='' />
												<AvatarFallback className='rounded-lg'>{'CN'}</AvatarFallback>
											</Avatar>
											<div className='grid flex-1 text-left text-sm leading-tight'>
												<span className='truncate font-semibold'>{'CN'}</span>
												<span className='truncate text-xs'>{'CN'}</span>
											</div>
										</div>
									</DropdownMenuLabel>
									<DropdownMenuSeparator />

									<DropdownMenuGroup>
										<DropdownMenuItem>
											<BadgeCheck />
											Account
										</DropdownMenuItem>
										<DropdownMenuItem>
											<CreditCard />
											Billing
										</DropdownMenuItem>
										<DropdownMenuItem>
											<Bell />
											Notifications
										</DropdownMenuItem>
									</DropdownMenuGroup>
									<DropdownMenuSeparator />
									<DropdownMenuItem>
										<LogOut />
										Log out
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarFooter>
				<SidebarRail />
			</Sidebar>
			<SidebarInset>
				<header className='flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear bg-gray-900 text-gray-200 group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
					<div className='flex items-center gap-2 px-4'>
						<SidebarTrigger className='-ml-1' />
					</div>
				</header>
				<div className='bg-gray-900 text-gray-200 p-4'>{children}</div>
			</SidebarInset>
		</SidebarProvider>
	);
}

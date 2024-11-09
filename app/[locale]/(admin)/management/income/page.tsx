'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import PageContainer from '@/app/components/page-container';
import BackGroundRoot from '@/public/root/background-root.png';
import { Search } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

const timeFilters = ['1 Week', '1 Month', '6 Month', '1 Year', 'Ever'];

export default function IncomePage() {
	const [selectedFilter, setSelectedFilter] = useState('1 Week');

	const bookings = [
		{ id: 1, stylist: 'Thiep', service: 'Hớt tóc,lấy rấy tai,...', total: '100k' },
		{ id: 2, stylist: 'Thiep', service: 'Hớt tóc,lấy rấy tai,...', total: '100k' },
		{ id: 3, stylist: 'Thiep', service: 'Hớt tóc,lấy rấy tai,...', total: '100k' },
		{ id: 4, stylist: 'Thiep', service: 'Hớt tóc,lấy rấy tai,...', total: '100k' },
		{ id: 5, stylist: 'Thiep', service: 'Hớt tóc,lấy rấy tai,...', total: '100k' },
	];

	return (
		<PageContainer>
			<Image
				src={BackGroundRoot}
				alt='Barber Shop Logo'
				width={1820}
				height={1200}
				className='absolute inset-0 w-full object-cover h-full'
			/>
			<div className='bg-transparent relative'>
				<div className='rounded-lg bg-gray-800/50 backdrop-blur-sm p-6'>
					{/* Header */}
					<div className='flex justify-between items-center mb-6'>
						<h1 className='text-2xl font-bold text-white'>INCOME MANAGEMENT</h1>
						<div className='relative w-72'>
							<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
							<Input
								placeholder='Search Stylist'
								className='pl-9 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400'
							/>
						</div>
					</div>

					<div className='grid md:grid-cols-3 gap-6'>
						{/* Table */}
						<div className='md:col-span-2'>
							<div className='rounded-lg bg-gray-800/50 overflow-hidden'>
								<Table>
									<TableHeader>
										<TableRow className='hover:bg-gray-800/50 border-gray-700'>
											<TableHead className='text-gray-200'>Id</TableHead>
											<TableHead className='text-gray-200'>Stylist</TableHead>
											<TableHead className='text-gray-200'>Service</TableHead>
											<TableHead className='text-gray-200'>Total</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{bookings.map((booking) => (
											<TableRow key={booking.id} className='hover:bg-gray-700/50 border-gray-700'>
												<TableCell className='font-medium text-gray-200'>
													{booking.id}
												</TableCell>
												<TableCell className='text-gray-200'>{booking.stylist}</TableCell>
												<TableCell className='text-gray-200'>{booking.service}</TableCell>
												<TableCell className='text-gray-200'>{booking.total}</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						</div>

						{/* Stats Panel */}
						<div className='space-y-4'>
							<div className='rounded-lg bg-gray-800/50 p-4'>
								<h3 className='text-sm font-medium text-gray-400 mb-2'>
									Total Stylist working in week
								</h3>
								<div className='bg-gray-700 rounded-md px-4 py-2 text-white'>
									Thiep, Sinh, Kha, Le, Hieu,... <span className='font-bold'>20</span>
								</div>
							</div>

							<div className='rounded-lg bg-gray-800/50 p-4'>
								<h3 className='text-sm font-medium text-gray-400 mb-2'>Total Service use in week</h3>
								<div className='bg-gray-700 rounded-md px-4 py-2 text-white'>
									Combo 1, combo2, hớt tóc,... <span className='font-bold'>40</span>
								</div>
							</div>

							<div className='rounded-lg bg-gray-800/50 p-4'>
								<h3 className='text-sm font-medium text-gray-400 mb-2'>Revenue in the week</h3>
								<div className='bg-gray-700 rounded-md px-4 py-2 text-white font-bold'>10,000,000</div>
							</div>
						</div>
					</div>

					{/* Time Filters */}
					<div className='flex gap-2 mt-6'>
						{timeFilters.map((filter) => (
							<Button
								key={filter}
								variant={selectedFilter === filter ? 'secondary' : 'ghost'}
								className={`text-sm ${
									selectedFilter === filter
										? 'bg-gray-700 text-white'
										: 'text-gray-400 hover:text-white hover:bg-gray-700'
								}`}
								onClick={() => setSelectedFilter(filter)}
							>
								{filter}
							</Button>
						))}
					</div>
				</div>
			</div>
		</PageContainer>
	);
}

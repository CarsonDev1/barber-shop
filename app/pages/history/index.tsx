'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ChevronRight, Search } from 'lucide-react';
import { useState } from 'react';
import BackGroundRoot from '@/public/root/background-root.png';
import Image from 'next/image';

interface HaircutRecord {
	id: number;
	date: string;
	serviceName: string;
	stylist: string;
	time: string;
	total: string;
	status: string;
	reviewed: boolean;
	detail: string;
}

export default function HistoryPage() {
	const [searchQuery, setSearchQuery] = useState('');

	const records: HaircutRecord[] = [
		{
			id: 1,
			date: '08-08-2024',
			serviceName: 'Hát tóc, cạo mặt, lấy...',
			stylist: 'Trung Nguyen',
			time: '14h20 - 15h00',
			total: '70k',
			status: 'Yes',
			reviewed: false,
			detail: 'Mẫu tóc đã cắt: Undercut\nDịch vụ sử dụng: hót tóc, cạo mặt, lấy ráy tai, gội đầu, đắp mặt nạ',
		},
		{
			id: 2,
			date: '07-08-2024',
			serviceName: 'Hát tóc, cạo mặt, lấy...',
			stylist: 'Trung Nguyen',
			time: '14h20 - 15h00',
			total: '70k',
			status: 'Yes',
			reviewed: true,
			detail: 'Mẫu tóc đã cắt: Undercut\nDịch vụ sử dụng: hót tóc, cạo mặt, lấy ráy tai, gội đầu, đắp mặt nạ',
		},
		{
			id: 3,
			date: '06-08-2024',
			serviceName: 'Hát tóc, cạo mặt, lấy...',
			stylist: 'Trung Nguyen',
			time: '14h20 - 15h00',
			total: '70k',
			status: 'Yes',
			reviewed: true,
			detail: 'Mẫu tóc đã cắt: Undercut\nDịch vụ sử dụng: hót tóc, cạo mặt, lấy ráy tai, gội đầu, đắp mặt nạ',
		},
		{
			id: 4,
			date: '05-08-2024',
			serviceName: 'Hát tóc, cạo mặt, lấy...',
			stylist: 'Trung Nguyen',
			time: '14h20 - 15h00',
			total: '70k',
			status: 'Yes',
			reviewed: true,
			detail: 'Mẫu tóc đã cắt: Undercut\nDịch vụ sử dụng: hót tóc, cạo mặt, lấy ráy tai, gội đầu, đắp mặt nạ',
		},
		{
			id: 5,
			date: '05-08-2024',
			serviceName: 'Hát tóc, cạo mặt, lấy...',
			stylist: 'Trung Nguyen',
			time: '14h20 - 15h00',
			total: '70k',
			status: 'Yes',
			reviewed: true,
			detail: 'Mẫu tóc đã cắt: Undercut\nDịch vụ sử dụng: hót tóc, cạo mặt, lấy ráy tai, gội đầu, đắp mặt nạ',
		},
		{
			id: 6,
			date: '04-08-2024',
			serviceName: 'Hát tóc, cạo mặt, lấy...',
			stylist: 'Trung Nguyen',
			time: '14h20 - 15h00',
			total: '70k',
			status: 'Yes',
			reviewed: true,
			detail: 'Mẫu tóc đã cắt: Undercut\nDịch vụ sử dụng: hót tóc, cạo mặt, lấy ráy tai, gội đầu, đắp mặt nạ',
		},
		{
			id: 7,
			date: '03-08-2024',
			serviceName: 'Hát tóc, cạo mặt, lấy...',
			stylist: 'Trung Nguyen',
			time: '14h20 - 15h00',
			total: '70k',
			status: 'Yes',
			reviewed: true,
			detail: 'Mẫu tóc đã cắt: Undercut\nDịch vụ sử dụng: hót tóc, cạo mặt, lấy ráy tai, gội đầu, đắp mặt nạ',
		},
		{
			id: 8,
			date: '02-08-2024',
			serviceName: 'Hát tóc, cạo mặt, lấy...',
			stylist: 'Trung Nguyen',
			time: '14h20 - 15h00',
			total: '70k',
			status: 'Yes',
			reviewed: true,
			detail: 'Mẫu tóc đã cắt: Undercut\nDịch vụ sử dụng: hót tóc, cạo mặt, lấy ráy tai, gội đầu, đắp mặt nạ',
		},
		{
			id: 9,
			date: '01-08-2024',
			serviceName: 'Hát tóc, cạo mặt, lấy...',
			stylist: 'Trung Nguyen',
			time: '14h20 - 15h00',
			total: '70k',
			status: 'Yes',
			reviewed: true,
			detail: 'Mẫu tóc đã cắt: Undercut\nDịch vụ sử dụng: hót tóc, cạo mặt, lấy ráy tai, gội đầu, đắp mặt nạ',
		},
		{
			id: 10,
			date: '31-07-2024',
			serviceName: 'Hát tóc, cạo mặt, lấy...',
			stylist: 'Trung Nguyen',
			time: '14h20 - 15h00',
			total: '70k',
			status: 'Yes',
			reviewed: true,
			detail: 'Mẫu tóc đã cắt: Undercut\nDịch vụ sử dụng: hót tóc, cạo mặt, lấy ráy tai, gội đầu, đắp mặt nạ',
		},
	];

	return (
		<div className='min-h-screen bg-black text-white p-4 md:p-8 relative'>
			<Image
				src={BackGroundRoot}
				alt='Barber Shop Logo'
				width={1820}
				height={1200}
				className='absolute inset-0 w-full object-cover h-full'
			/>
			<div className='max-w-7xl mx-auto'>
				<div className='mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
					<h1 className='text-2xl md:text-3xl font-bold'>History of Haircutting</h1>
					<div className='relative w-full md:w-auto'>
						<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
						<Input
							type='search'
							placeholder='search....'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className='pl-10 bg-gray-900/50 border-gray-800 w-full md:w-[300px]'
						/>
					</div>
				</div>

				<div className='bg-gray-900/30 backdrop-blur-sm rounded-lg border border-gray-800'>
					<div className='overflow-x-auto'>
						<table className='w-full'>
							<thead>
								<tr className='border-b border-gray-800'>
									<th className='px-4 py-3 text-left text-sm font-medium text-gray-400'>Date</th>
									<th className='px-4 py-3 text-left text-sm font-medium text-gray-400'>
										Service name
									</th>
									<th className='px-4 py-3 text-left text-sm font-medium text-gray-400'>Stylist</th>
									<th className='px-4 py-3 text-left text-sm font-medium text-gray-400'>Time</th>
									<th className='px-4 py-3 text-left text-sm font-medium text-gray-400'>Total</th>
									<th className='px-4 py-3 text-left text-sm font-medium text-gray-400'>Status</th>
									<th className='px-4 py-3 text-left text-sm font-medium text-gray-400'>
										Give a review
									</th>
									<th className='px-4 py-3 text-left text-sm font-medium text-gray-400'>Detail</th>
								</tr>
							</thead>
							<tbody className='divide-y divide-gray-800'>
								{records.map((record) => (
									<tr key={record.id} className='hover:bg-gray-800/50 transition-colors'>
										<td className='px-4 py-3 text-sm whitespace-nowrap'>
											<div className='flex items-center gap-3'>
												<span className='flex items-center justify-center w-6 h-6 rounded-full bg-gray-800 text-xs'>
													{record.id}
												</span>
												{record.date}
											</div>
										</td>
										<td className='px-4 py-3 text-sm'>{record.serviceName}</td>
										<td className='px-4 py-3 text-sm'>{record.stylist}</td>
										<td className='px-4 py-3 text-sm'>{record.time}</td>
										<td className='px-4 py-3 text-sm'>{record.total}</td>
										<td className='px-4 py-3 text-sm'>
											<span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-800'>
												{record.status}
											</span>
										</td>
										<td className='px-4 py-3 text-sm'>
											{record.reviewed ? (
												<span className='text-green-500'>Reviewed</span>
											) : (
												<Button
													variant='link'
													className='text-blue-400 p-0 h-auto font-normal hover:text-blue-300'
												>
													Review
												</Button>
											)}
										</td>
										<td className='px-4 py-3 text-sm'>
											<Dialog>
												<DialogTrigger asChild>
													<Button variant='ghost' size='sm' className='h-8 px-2'>
														Detail
														<ChevronRight className='ml-1 h-4 w-4' />
													</Button>
												</DialogTrigger>
												<DialogContent className='text-white border-none'>
													<Image
														src={BackGroundRoot}
														alt='Barber Shop Logo'
														width={1820}
														height={1200}
														className='absolute inset-0 w-full object-cover h-full'
													/>
													<div className='py-3 px-0 flex flex-col gap-3'>
														<DialogHeader className='relative z-20'>
															<DialogTitle>Detail for ID {record.id}</DialogTitle>
														</DialogHeader>
														<p className='text-sm whitespace-pre-line relative z-20'>
															{record.detail}
														</p>
													</div>
												</DialogContent>
											</Dialog>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}

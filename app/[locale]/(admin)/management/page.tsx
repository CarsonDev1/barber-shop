'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import PageContainer from '@/app/components/page-container';

const timeFilters = ['1 Week', '1 Month', '6 Month', '1 Year', 'Ever'];
const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

export default function DashBoardPage() {
	const [selectedFilter, setSelectedFilter] = useState('1 Week');

	// Dữ liệu mẫu
	const bookingsData = [
		{ id: 1, stylist: 'Thiep', service: 'Service 1', total: 100 },
		{ id: 2, stylist: 'Thiep', service: 'Service 2', total: 200 },
		{ id: 3, stylist: 'Thiep', service: 'Service 3', total: 300 },
	];

	const statsData = [
		{ name: 'Stylist', value: 20 },
		{ name: 'Services', value: 40 },
		{ name: 'Revenue', value: 10000 },
	];

	return (
		<PageContainer>
			<div className='bg-gray-900'>
				<div className='rounded-lg bg-gray-800/50 backdrop-blur-sm p-6'>
					{/* Header */}
					<div className='flex justify-between items-center mb-6'>
						<h1 className='text-2xl font-bold text-white'>DASHBOARD MANAGEMENT</h1>
						<div className='relative w-72'>
							<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
							<Input
								placeholder='Search Stylist'
								className='pl-9 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400'
							/>
						</div>
					</div>

					<div className='grid md:grid-cols-3 gap-6'>
						{/* Biểu đồ thanh cho các dịch vụ */}
						<div className='md:col-span-2 bg-gray-800 p-4 rounded-lg'>
							<h3 className='text-sm font-medium text-gray-400 mb-4'>Service Usage</h3>
							<ResponsiveContainer width='100%' height={300}>
								<BarChart data={bookingsData}>
									<XAxis dataKey='service' stroke='#ccc' />
									<YAxis stroke='#ccc' />
									<Tooltip />
									<Bar dataKey='total' fill='#8884d8' />
								</BarChart>
							</ResponsiveContainer>
						</div>

						{/* Biểu đồ tròn cho Stylist và Doanh thu */}
						<div className='bg-gray-800 p-4 rounded-lg'>
							<h3 className='text-sm font-medium text-gray-400 mb-4'>Statistics</h3>
							<ResponsiveContainer width='100%' height={300}>
								<PieChart>
									<Pie
										data={statsData}
										dataKey='value'
										nameKey='name'
										innerRadius={60}
										outerRadius={100}
										fill='#82ca9d'
										label
									>
										{statsData.map((_, index) => (
											<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
										))}
									</Pie>
									<Tooltip />
								</PieChart>
							</ResponsiveContainer>
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

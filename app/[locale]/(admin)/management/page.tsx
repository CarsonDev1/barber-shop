'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import PageContainer from '@/app/components/page-container';
import { useAuth } from '@/context/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import { getCustomersStatistics } from '@/app/api/statistic/getStatisticCustomers';
import { getStaffStatistics } from '@/app/api/statistic/getStatisticStaffs'; // Added import for staff statistics API
import { CustomersResponse } from '@/types/Customer.type';
import { getStaffs } from '@/app/api/customer/getStaffs';

const timeFilters = ['1 Week', '1 Month', '6 Month', '1 Year', 'Ever'];

export default function DashBoardPage() {
	const [selectedFilter, setSelectedFilter] = useState('1 Week');
	const [fromDate, setFromDate] = useState('');
	const [toDate, setToDate] = useState('');
	const [staffNameMap, setStaffNameMap] = useState<any>({});

	const calculateDates = (filter: string) => {
		const now = new Date();
		let from = new Date();

		switch (filter) {
			case '1 Week':
				from.setDate(now.getDate() - 7);
				break;
			case '1 Month':
				from.setMonth(now.getMonth() - 1);
				break;
			case '6 Month':
				from.setMonth(now.getMonth() - 6);
				break;
			case '1 Year':
				from.setFullYear(now.getFullYear() - 1);
				break;
			case 'Ever':
				from = new Date('1970-01-01');
				break;
			default:
				break;
		}

		setFromDate(from.toISOString().split('T')[0]); // Format to YYYY-MM-DD
		setToDate(now.toISOString().split('T')[0]);
	};

	useEffect(() => {
		calculateDates(selectedFilter);
	}, [selectedFilter]);

	const {
		data: staffData,
		isLoading: isLoadingStaffs,
		error: errorStaffs,
	} = useQuery<CustomersResponse>({
		queryKey: ['dataStaffs'],
		queryFn: getStaffs,
	});

	const {
		data: customerData = [],
		isLoading: isLoadingCustomerData,
		error: errorCustomerData,
	} = useQuery({
		queryKey: ['dataCustomers', fromDate, toDate],
		queryFn: () => getCustomersStatistics(fromDate, toDate),
		enabled: !!fromDate && !!toDate,
	});

	const {
		data: staffStatisticsData = [], // Fetch staff statistics
		isLoading: isLoadingStaffStatistics,
		error: errorStaffStatistics,
	} = useQuery({
		queryKey: ['dataStaffStatistics', fromDate, toDate],
		queryFn: () => getStaffStatistics(fromDate, toDate), // Call the staff statistics function
		enabled: !!fromDate && !!toDate,
	});

	const { isAuthenticated } = useAuth();
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
		if (!isAuthenticated) {
			window.location.href = '/login';
		}
	}, [isAuthenticated]);

	useEffect(() => {
		if (staffData?.payload) {
			const mapping: Record<number, string> = {};
			staffData.payload.forEach((staff: any) => {
				mapping[staff.id] = staff.name;
			});
			setStaffNameMap(mapping);
		}
	}, [staffData]);

	const transformedStaffChartData = useMemo(() => {
		if (!staffStatisticsData?.payload || !staffNameMap) return [];
		return staffStatisticsData.payload.map((item: any) => ({
			...item,
			name: staffNameMap[item.id] || `ID: ${item.id}`,
		}));
	}, [staffStatisticsData, staffNameMap]);

	const transformedCustomerChartData = useMemo(() => {
		if (!customerData?.payload || !staffNameMap) return [];
		return customerData.payload.map((item: any) => ({
			...item,
			name: staffNameMap[item.id] || `ID: ${item.id}`,
		}));
	}, [customerData, staffNameMap]);

	if (!isClient || !isAuthenticated) {
		return null;
	}

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
						{/* Staff Performance Bar Chart */}
						<div className='md:col-span-2 bg-gray-800 p-4 rounded-lg'>
							<h3 className='text-sm font-medium text-gray-400 mb-4'>Top Staff Performance</h3>
							<ResponsiveContainer width='100%' height={300}>
								<BarChart data={transformedStaffChartData}>
									<XAxis
										dataKey='name'
										stroke='#ccc'
										label={{ value: 'Staff Name', position: 'insideBottom', offset: -5 }}
									/>
									<YAxis stroke='#ccc' />
									<Tooltip />
									<Bar dataKey='amountMade' name='Revenue' fill='#8884d8' />
									<Bar dataKey='bookingCount' name='Bookings' fill='#82ca9d' />
								</BarChart>
							</ResponsiveContainer>
						</div>

						{/* Customer Performance Bar Chart */}
						<div className='md:col-span-2 bg-gray-800 p-4 rounded-lg'>
							<h3 className='text-sm font-medium text-gray-400 mb-4'>Top Customer Performance</h3>
							<ResponsiveContainer width='100%' height={300}>
								<BarChart data={transformedCustomerChartData}>
									<XAxis
										dataKey='name'
										stroke='#ccc'
										label={{ value: 'Customer Name', position: 'insideBottom', offset: -5 }}
									/>
									<YAxis stroke='#ccc' />
									<Tooltip />
									<Bar dataKey='amountMade' name='Revenue' fill='#8884d8' />
									<Bar dataKey='bookingCount' name='Bookings' fill='#82ca9d' />
								</BarChart>
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

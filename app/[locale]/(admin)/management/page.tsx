'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import PageContainer from '@/app/components/page-container';
import { useAuth } from '@/context/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import { getCustomersStatistics } from '@/app/api/statistic/getStatisticCustomers';
import { getStaffStatistics } from '@/app/api/statistic/getStatisticStaffs';
import { CustomersResponse } from '@/types/Customer.type';
import { getStaffs } from '@/app/api/customer/getStaffs';
import { getBookingStatistics } from '@/app/api/statistic/getBookingStatistics';
import { getBookingServiceStatistics } from '@/app/api/statistic/getBookingService';
import { getBookingComboStatistics } from '@/app/api/statistic/getBookingCombo';

const timeFilters = ['1 Tuần', '1 Tháng', '6 Tháng', '1 Năm', 'Tất cả'];

export default function DashBoardPage() {
	const [selectedFilter, setSelectedFilter] = useState('1 Tuần');
	const [fromDate, setFromDate] = useState('');
	const [toDate, setToDate] = useState('');
	const [staffNameMap, setStaffNameMap] = useState<Record<number, string>>({});
	const [customNameMap, setCustomNameMap] = useState<Record<number, string>>({});
	const year = 2024;

	const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

	const calculateDates = (filter: string) => {
		const now = new Date();
		let from = new Date();

		switch (filter) {
			case '1 Tuần':
				from.setDate(now.getDate() - 7);
				break;
			case '1 Tháng':
				from.setMonth(now.getMonth() - 1);
				break;
			case '6 Tháng':
				from.setMonth(now.getMonth() - 6);
				break;
			case '1 Năm':
				from.setFullYear(now.getFullYear() - 1);
				break;
			case 'Tất cả':
				from = new Date('1970-01-01');
				break;
			default:
				break;
		}

		setFromDate(from.toISOString().split('T')[0]);
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
		data: staffStatisticsData = [],
		isLoading: isLoadingStaffStatistics,
		error: errorStaffStatistics,
	} = useQuery({
		queryKey: ['dataStaffStatistics', fromDate, toDate],
		queryFn: () => getStaffStatistics(fromDate, toDate),
		enabled: !!fromDate && !!toDate,
	});

	const {
		data: bookingStatisticsData = [],
		isLoading: isLoadingBookingStatistics,
		error: errorBookingStatistics,
	} = useQuery({
		queryKey: ['dataBookingStatistics', year],
		queryFn: () => getBookingStatistics(year),
		enabled: !!year,
	});

	const {
		data: bookingServiceStatisticsData = [],
		isLoading: isLoadingBookingServiceStatistics,
		error: errorBookingServiceStatistics,
	} = useQuery({
		queryKey: ['dataBookingServiceStatistics', fromDate, toDate],
		queryFn: () => getBookingServiceStatistics(fromDate, toDate),
		enabled: !!fromDate && !!toDate,
	});

	const {
		data: bookingComboStatisticsData = [],
		isLoading: isLoadingBookingComboStatistics,
		error: errorBookingComboStatistics,
	} = useQuery({
		queryKey: ['dataBookingComboStatistics', fromDate, toDate],
		queryFn: () => getBookingComboStatistics(fromDate, toDate),
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

	useEffect(() => {
		if (customerData?.payload) {
			const mapping: Record<number, string> = {};
			customerData.payload.forEach((customer: any) => {
				mapping[customer.id] = customer.name;
			});
			setCustomNameMap(mapping);
		}
	}, [customerData]);

	const transformedStaffChartData = useMemo(() => {
		if (!staffStatisticsData?.payload || !staffNameMap) return [];
		return staffStatisticsData.payload.map((item: any) => ({
			...item,
			name: staffNameMap[item.id] || `ID: ${item.id}`,
		}));
	}, [staffStatisticsData, staffNameMap]);

	const transformedCustomerChartData = useMemo(() => {
		if (!customerData?.payload || !customNameMap) return [];
		return customerData.payload.map((item: any) => ({
			...item,
			name: customNameMap[item.id] || `ID: ${item.id}`,
		}));
	}, [customerData, customNameMap]);

	const transformedBookingServiceChartData = useMemo(() => {
		if (!bookingServiceStatisticsData?.payload || !staffNameMap) return [];
		return bookingServiceStatisticsData.payload.map((item: any) => ({
			...item,
			name: staffNameMap[item.id] || `ID: ${item.id}`,
		}));
	}, [bookingServiceStatisticsData, staffNameMap]);

	const transformedBookingComboChartData = useMemo(() => {
		if (!bookingComboStatisticsData?.payload || !staffNameMap) return [];
		return bookingComboStatisticsData.payload.map((item: any) => ({
			...item,
			name: staffNameMap[item.id] || `ID: ${item.id}`,
		}));
	}, [bookingComboStatisticsData, staffNameMap]);

	const pieChartData = useMemo(() => {
		if (!bookingStatisticsData?.payload) return [];
		return [
			{ name: 'Số lượng đặt chỗ', value: bookingStatisticsData.payload.monthlyData.DECEMBER.bookingCount },
			{ name: 'Tổng số tiền', value: bookingStatisticsData.payload.monthlyData.DECEMBER.amount },
		];
	}, [bookingStatisticsData]);

	if (!isClient || !isAuthenticated) {
		return null;
	}

	return (
		<PageContainer>
			<div className='bg-gray-900'>
				<div className='rounded-lg bg-gray-800/50 backdrop-blur-sm p-6'>
					{/* Header */}
					<div className='flex justify-between items-center mb-6'>
						<h1 className='text-2xl font-bold text-white'>QUẢN LÝ BẢNG ĐIỀU KHIỂN</h1>
					</div>

					<div className='grid md:grid-cols-3 gap-6'>
						{/* Staff Performance Bar Chart */}
						<div className='md:col-span-2 bg-gray-800 p-4 rounded-lg'>
							<h3 className='text-sm font-medium text-gray-400 mb-4'>Hiệu suất nhân viên hàng đầu</h3>
							<ResponsiveContainer width='100%' height={300}>
								<BarChart data={transformedStaffChartData}>
									<XAxis dataKey='name' stroke='#f3f3f3' hide />
									<YAxis stroke='#eee' />
									<Tooltip />
									<Bar dataKey='amountMade' name='Doanh thu' fill='#8ac7f6' />
									<Bar dataKey='bookingCount' name='Đặt chỗ' fill='#82ca9d' />
								</BarChart>
							</ResponsiveContainer>
						</div>
						<div className='bg-gray-800 p-4 rounded-lg'>
							<h3 className='text-sm font-medium text-gray-400 mb-4'>Thống kê đặt chỗ</h3>
							<ResponsiveContainer width='100%' height={300}>
								<PieChart>
									<Pie
										data={pieChartData}
										dataKey='value'
										nameKey='name'
										cx='50%'
										cy='50%'
										outerRadius={80}
										label
									>
										{pieChartData.map((_, index) => (
											<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
										))}
									</Pie>
									<Tooltip />
									<Legend />
								</PieChart>
							</ResponsiveContainer>
						</div>

						{/* Other Charts */}
						<div className='md:col-span-2 bg-gray-800 p-4 rounded-lg'>
							<h3 className='text-sm font-medium text-gray-400 mb-4'>Hiệu suất khách hàng hàng đầu</h3>
							<ResponsiveContainer width='100%' height={300}>
								<BarChart data={transformedCustomerChartData}>
									<XAxis dataKey='name' stroke='#ccc' hide />
									<YAxis stroke='#ccc' />
									<Tooltip />
									<Bar dataKey='amountMade' name='Doanh thu' fill='#8ac7f6' />
									<Bar dataKey='bookingCount' name='Đặt chỗ' fill='#82ca9d' />
								</BarChart>
							</ResponsiveContainer>
						</div>
						<div className='md:col-span-2 bg-gray-800 p-4 rounded-lg'>
							<h3 className='text-sm font-medium text-gray-400 mb-4'>
								Hiệu suất phổ biến dịch vụ đặt chỗ hàng đầu
							</h3>
							<ResponsiveContainer width='100%' height={300}>
								<BarChart data={transformedBookingServiceChartData}>
									<XAxis dataKey='name' stroke='#ccc' hide />
									<YAxis stroke='#ccc' />
									<Tooltip />
									<Bar dataKey='amountMade' name='Doanh thu' fill='#8ac7f6' />
									<Bar dataKey='bookingCount' name='Đặt chỗ' fill='#82ca9d' />
								</BarChart>
							</ResponsiveContainer>
						</div>
						<div className='md:col-span-2 bg-gray-800 p-4 rounded-lg'>
							<h3 className='text-sm font-medium text-gray-400 mb-4'>
								Hiệu suất phổ biến combo đặt chỗ hàng đầu
							</h3>
							<ResponsiveContainer width='100%' height={300}>
								<BarChart data={transformedBookingComboChartData}>
									<XAxis dataKey='name' stroke='#ccc' />
									<YAxis stroke='#ccc' />
									<Tooltip />
									<Bar dataKey='amountMade' name='Doanh thu' fill='#8ac7f6' />
									<Bar dataKey='bookingCount' name='Đặt chỗ' fill='#82ca9d' />
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

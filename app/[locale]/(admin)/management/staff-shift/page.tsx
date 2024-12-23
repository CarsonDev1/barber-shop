'use client';
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiResponseServiceType } from '@/types/ServiceType.type';
import { Button } from '@/components/ui/button';
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import PageContainer from '@/app/components/page-container';
import { createStaffShift } from '@/app/api/staff-shift/createStaffShift'; // Import hàm createStaffShift
import { getStaffShift } from '@/app/api/staff-shift/getStaffShift';
import Swal from 'sweetalert2';
import { getShift } from '@/app/api/shifft/getShift';
import { CustomersResponse } from '@/types/Customer.type';
import { getStaffs } from '@/app/api/customer/getStaffs';
import { getStaffShiftById } from '@/app/api/staff-shift/getStaffShiftById';
import { deleteStaffShift } from '@/app/api/staff-shift/deleteStaffShift';
import { getStaffShiftCus } from '@/app/api/staff-shift/getStaffShiftCus';

const StaffShift = () => {
	const queryClient = useQueryClient();
	const [dialogOpen, setDialogOpen] = useState(false);

	const {
		data: ShiftData,
		isLoading: isLoadingShiftData,
		error: errorShiftData,
	} = useQuery<ApiResponseServiceType>({
		queryKey: ['dataShift'],
		queryFn: getShift,
	});

	const shifts = ShiftData?.payload || [];

	const [weekStaff, setWeekStaff] = useState<number | ''>('');
	const [yearStaff, setYearStaff] = useState<number | ''>('');

	useEffect(() => {
		const currentDate = new Date();
		const currentWeek = getWeekNumber(currentDate);
		const currentYear = currentDate.getFullYear();

		setWeekStaff(currentWeek);
		setYearStaff(currentYear);
	}, []);

	const getWeekNumber = (date: Date): number => {
		const startOfYear = new Date(date.getFullYear(), 0, 1);
		const pastDaysOfYear = (date.getTime() - startOfYear.getTime()) / 86400000;
		return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
	};

	const handleNextWeek = () => {
		if (weekStaff !== '') {
			const nextWeek = weekStaff + 1;
			if (nextWeek > 52) {
				// Nếu vượt qua tuần 52, tăng năm lên 1 và đặt tuần về 1
				setWeekStaff(1);
				setYearStaff((prevYear) => (prevYear !== '' ? prevYear + 1 : ''));
			} else {
				// Tăng tuần bình thường
				setWeekStaff(nextWeek);
			}
		}
	};

	const handlePrevWeek = () => {
		if (weekStaff !== '') {
			const prevWeek = weekStaff - 1;
			if (prevWeek < 1) {
				// Nếu giảm xuống trước tuần 1, giảm năm đi 1 và đặt tuần về 52
				setWeekStaff(52); // Hoặc 53 nếu muốn kiểm tra cụ thể
				setYearStaff((prevYear) => (prevYear !== '' ? prevYear - 1 : ''));
			} else {
				// Giảm tuần bình thường
				setWeekStaff(prevWeek);
			}
		}
	};

	const {
		data: staffShiftData,
		isLoading: isLoadingStaffShiftData,
		error: errorStaffShiftData,
	} = useQuery<any>({
		queryKey: ['dataStaffShift', weekStaff, yearStaff],
		queryFn: () => getStaffShift(weekStaff as number, yearStaff as number),
		enabled: Boolean(weekStaff && yearStaff),
	});

	const {
		data: staffData,
		isLoading: isLoadingStaffs,
		error: errorStaffs,
	} = useQuery<CustomersResponse>({
		queryKey: ['dataStaffs'],
		queryFn: getStaffs,
	});

	const staffShift = staffShiftData?.payload || [];
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;
	const totalPages = Math.ceil(staffShift.length / itemsPerPage);

	// Thay thế mutateCreateService bằng mutateCreateStaffShift
	const { mutate: mutateCreateStaffShift } = useMutation({
		mutationFn: async (staffShiftData: { staffId: number; shiftId: number; dates: string[] }) => {
			await createStaffShift(staffShiftData);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['dataStaffShift'] });
			Swal.fire({
				title: 'Success!',
				text: 'Staff shift created successfully.',
				icon: 'success',
				confirmButtonText: 'OK',
			});
		},
		onError: (error: any) => {
			Swal.fire({
				title: 'Error!',
				text: error,
				icon: 'error',
				confirmButtonText: 'OK',
			});
		},
	});

	const [staffId, setStaffId] = useState(0);
	const [week, setWeek] = useState<number | ''>('');
	const [year, setYear] = useState<number | ''>('');
	const [shiftId, setShiftId] = useState(0);
	const [date, setDate] = useState('');
	const [dateError, setDateError] = useState('');

	const currentDate = new Date().toISOString().split('T')[0];

	const {
		data: staffShiftCusData,
		isLoading: isLoadingStaffShiftCusData,
		error: errorStaffShiftCusData,
	} = useQuery<any>({
		queryKey: ['dataStaffShift', staffId, week, year],
		queryFn: () => getStaffShiftCus({ staff_id: staffId as number, week: week as number, year: year as number }),
		enabled: Boolean(staffId && week && year),
	});

	const staffShiftCus = staffShiftCusData?.data || [];

	// Handle form submission for creating a new staff shift
	const handleCreateStaffShift = (e: React.FormEvent) => {
		e.preventDefault();
		const selectedDate = new Date(date); // Ngày được chọn
		const today = new Date(); // Ngày hiện tại
		const maxDate = new Date();
		maxDate.setDate(today.getDate() + 7); // Ngày tối đa (7 ngày tới)

		// Kiểm tra ngày
		if (selectedDate <= today) {
			setDateError('The selected date must be greater than today.');
			return;
		} else if (selectedDate > maxDate) {
			Swal.fire({
				title: 'Error!',
				text: 'The selected date must be within the next 7 days.',
				icon: 'error',
				confirmButtonText: 'OK',
			});
			return;
		}

		setDateError(''); // Xóa lỗi nếu không có vấn đề

		if (staffId && shiftId && date) {
			const staffShiftData = { staffId, shiftId, dates: [date] };
			mutateCreateStaffShift(staffShiftData);
			setStaffId(0);
			setShiftId(0);
			setDate('');
			setDialogOpen(false); // Đóng dialog nếu thành công
		} else {
			Swal.fire({
				title: 'Warning!',
				text: 'Please fill all fields.',
				icon: 'warning',
				confirmButtonText: 'OK',
			});
		}
	};

	const { mutate: mutateDeleteStaffShift } = useMutation({
		mutationFn: deleteStaffShift,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['dataStaffShift'] });
			Swal.fire({
				title: 'Success!',
				text: 'Staff shift deleted successfully.',
				icon: 'success',
				confirmButtonText: 'OK',
			});
		},
		onError: (error: any) => {
			Swal.fire({
				title: 'Error!',
				text: error,
				icon: 'error',
				confirmButtonText: 'OK',
			});
		},
	});

	const handleDeleteShift = (id: number) => {
		Swal.fire({
			title: 'Are you sure?',
			text: "You won't be able to revert this!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Yes, delete it!',
			cancelButtonText: 'Cancel',
		}).then((result) => {
			if (result.isConfirmed) {
				mutateDeleteStaffShift(id);
			}
		});
	};

	const getCurrentPageItems = () => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		const endIndex = startIndex + itemsPerPage;
		return staffShift.slice(startIndex, endIndex);
	};

	const goToFirstPage = () => setCurrentPage(1);
	const goToLastPage = () => setCurrentPage(totalPages);
	const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
	const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

	return (
		<PageContainer>
			<div className='flex justify-between mb-4'>
				<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
					<DialogTrigger asChild>
						<Button variant='default' onClick={() => setDialogOpen(true)}>
							Create Staff Shift
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Create Staff Shift</DialogTitle>
						</DialogHeader>
						<form onSubmit={handleCreateStaffShift}>
							<div className='space-y-4'>
								{/* Staff Select Dropdown */}
								<div>
									<label htmlFor='staffId' className='block text-sm font-medium text-gray-700'>
										Staff
									</label>
									<select
										id='staffId'
										name='staffId'
										className='w-full mt-2 p-2 border border-gray-300 rounded'
										value={staffId}
										onChange={(e) => setStaffId(Number(e.target.value))}
										required
									>
										<option value=''>Select Staff</option>
										{staffData?.payload?.map((staff) => (
											<option key={staff.id} value={staff.id}>
												{staff.name}
											</option>
										))}
									</select>
								</div>

								{/* Shift Select Dropdown */}
								<div>
									<label htmlFor='shiftId' className='block text-sm font-medium text-gray-700'>
										Shift
									</label>
									<select
										id='shiftId'
										name='shiftId'
										className='w-full mt-2 p-2 border border-gray-300 rounded'
										value={shiftId}
										onChange={(e) => setShiftId(Number(e.target.value))}
										required
									>
										<option value=''>Select Shift</option>
										{shifts?.map((shift) => (
											<option key={shift.id} value={shift.id}>
												{shift.name} {/* Or any other field to display shift details */}
											</option>
										))}
									</select>
								</div>

								<div>
									<label htmlFor='shiftId' className='block text-sm font-medium text-gray-700'>
										Date
									</label>
									{/* Date Input */}
									<Input
										id='date'
										name='date'
										type='date'
										className='w-full'
										value={date}
										min={new Date().toISOString().split('T')[0]} // Ngày hôm nay
										max={
											new Date(new Date().setDate(new Date().getDate() + 7))
												.toISOString()
												.split('T')[0]
										} // 7 ngày tới
										onChange={(e) => setDate(e.target.value)}
										required
									/>
									{dateError && <p className='text-red-500 text-sm mt-2'>{dateError}</p>}
								</div>
							</div>
							<div className='flex justify-end mt-4'>
								<Button
									variant='outline'
									type='button'
									className='mr-2'
									onClick={() => setDialogOpen(false)}
								>
									Cancel
								</Button>
								<Button variant='default' type='submit'>
									Create
								</Button>
							</div>
						</form>
					</DialogContent>
				</Dialog>
				<div className='flex items-center gap-3'>
					<button onClick={handlePrevWeek} className='mr-2 p-3 border bg-slate-800 rounded-lg'>
						Prev Week
					</button>
					<button onClick={handleNextWeek} className='mr-2 p-3 border bg-slate-800 rounded-lg'>
						Next Week
					</button>
				</div>
			</div>

			<div className='rounded-xl bg-gray-800/50 backdrop-blur-sm overflow-hidden border border-gray-700'>
				<div className='overflow-x-auto'>
					{isLoadingStaffShiftData ? (
						<div className='p-6 text-center text-gray-400'>Loading staff shifts...</div>
					) : errorStaffShiftData ? (
						<div className='p-6 text-center text-red-400'>Failed to load staff shifts</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Staff name</TableHead>
									<TableHead>Start time</TableHead>
									<TableHead>Start end</TableHead>
									<TableHead>Date</TableHead>
									<TableHead>Action</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{getCurrentPageItems().map((shift: any) => (
									<TableRow key={shift.id}>
										<TableCell>{shift?.staff?.name}</TableCell>
										<TableCell>{shift?.startTime}</TableCell>
										<TableCell>{shift?.endTime}</TableCell>
										<TableCell>{shift.date}</TableCell>
										<TableCell>
											<Button
												variant='destructive'
												onClick={() => handleDeleteShift(shift?.staff?.id)}
											>
												Delete
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</div>
			</div>

			<div className='flex items-center justify-between mt-4'>
				<div className='flex items-center space-x-2'>
					<Button
						variant='outline'
						size='icon'
						className='text-gray-400'
						onClick={goToFirstPage}
						disabled={currentPage === 1}
					>
						<ChevronFirst className='h-4 w-4' />
					</Button>
					<Button
						variant='outline'
						size='icon'
						className='text-gray-400'
						onClick={goToPreviousPage}
						disabled={currentPage === 1}
					>
						<ChevronLeft className='h-4 w-4' />
					</Button>
					<span className='text-sm text-gray-400'>
						Page <span className='text-white'>{currentPage}</span> of {totalPages}
					</span>
					<Button
						variant='outline'
						size='icon'
						className='text-gray-400'
						onClick={goToNextPage}
						disabled={currentPage === totalPages}
					>
						<ChevronRight className='h-4 w-4' />
					</Button>
					<Button
						variant='outline'
						size='icon'
						className='text-gray-400'
						onClick={goToLastPage}
						disabled={currentPage === totalPages}
					>
						<ChevronLast className='h-4 w-4' />
					</Button>
				</div>
			</div>
		</PageContainer>
	);
};

export default StaffShift;

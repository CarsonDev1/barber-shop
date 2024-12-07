'use client';
import React, { useState } from 'react';
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

	const {
		data: staffShiftData,
		isLoading: isLoadingStaffShiftData,
		error: errorStaffShiftData,
	} = useQuery<any>({
		queryKey: ['dataStaffShift'],
		queryFn: getStaffShift,
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
		onError: (error) => {
			Swal.fire({
				title: 'Error!',
				text: 'There was an error creating the staff shift.',
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
		if (date <= currentDate) {
			setDateError('The selected date must be greater than today.');
			return;
		}
		setDateError('');
		if (staffId && shiftId && date) {
			// Update the data to send dates as an array
			const staffShiftData = { staffId, shiftId, dates: [date] };
			mutateCreateStaffShift(staffShiftData);
			setStaffId(0);
			setShiftId(0);
			setDate('');
			setDialogOpen(false); // Close dialog on success
		} else {
			Swal.fire({
				title: 'Warning!',
				text: 'Please fill all fields.',
				icon: 'warning',
				confirmButtonText: 'OK',
			});
		}
		setDate('');
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
		onError: (error) => {
			Swal.fire({
				title: 'Error!',
				text: 'There was an error deleting the staff shift.',
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

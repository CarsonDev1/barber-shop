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
import { getAccount } from '@/app/api/getProfile';

const StaffShift = () => {
	const queryClient = useQueryClient();
	const [dialogOpen, setDialogOpen] = useState(false);

	const {
		data: dataProfile,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['dataProfile'],
		queryFn: getAccount,
	});

	const staffId = dataProfile?.id;

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

	const [week, setWeek] = useState<number | ''>(50);
	const [year, setYear] = useState<number | ''>(2024);
	const [date, setDate] = useState('');
	const [dateError, setDateError] = useState('');

	const {
		data: staffShiftCusData,
		isLoading: isLoadingStaffShiftCusData,
		error: errorStaffShiftCusData,
	} = useQuery<any>({
		queryKey: ['dataStaffShift', staffId, week, year],
		queryFn: () => getStaffShiftCus({ staff_id: staffId as number, week: 50 as number, year: year as number }),
		enabled: Boolean(staffId && week && year),
	});

	const staffShift = staffShiftCusData?.payload || [];

	// const staffShift = staffShiftData?.payload || [];
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;
	const totalPages = Math.ceil(staffShift.length / itemsPerPage);

	const currentDate = new Date().toISOString().split('T')[0];

	// Handle form submission for creating a new staff shift
	const handleCreateStaffShift = (e: React.FormEvent) => {
		e.preventDefault();
		if (date <= currentDate) {
			setDateError('The selected date must be greater than today.');
			return;
		}
		setDateError('');
		if (staffId && date) {
			// Update the data to send dates as an array
			const staffShiftData = { staffId, dates: [date] };
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
			<div className='rounded-xl bg-gray-800/50 backdrop-blur-sm overflow-hidden border border-gray-700'>
				<div className='overflow-x-auto'>
					{isLoadingStaffShiftCusData ? (
						<div className='p-6 text-center text-gray-400'>Loading staff shifts...</div>
					) : errorStaffShiftCusData ? (
						<div className='p-6 text-center text-red-400'>Failed to load staff shifts</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Start time</TableHead>
									<TableHead>Start end</TableHead>
									<TableHead>Date</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{getCurrentPageItems().map((shift: any) => (
									<TableRow key={shift.id}>
										<TableCell>{shift?.startTime}</TableCell>
										<TableCell>{shift?.endTime}</TableCell>
										<TableCell> {new Date(shift.date).toLocaleDateString('en-GB')}</TableCell>
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

'use client';
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiResponseServiceType } from '@/types/ServiceType.type';
import { Button } from '@/components/ui/button';
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import PageContainer from '@/app/components/page-container';
import { createShift } from '@/app/apis/shifft/createShift';
import Swal from 'sweetalert2';
import { getShift } from '@/app/apis/shifft/getShift';
import { deleteShift } from '@/app/apis/shifft/deleteShift';
import { updateShift } from '@/app/apis/shifft/updateShift';

const Shift = () => {
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

	const Shift = ShiftData?.payload || [];
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	// Đảm bảo rằng totalPages được tính lại khi dữ liệu thay đổi
	const totalPages = Math.ceil(Shift.length / itemsPerPage);

	const [editShiftId, setEditShiftId] = useState<number | null>(null);

	// Mutation for creating a new shift
	const { mutate: mutateCreateShift } = useMutation({
		mutationFn: async ({ name, startTime, endTime }: { name: string; startTime: string; endTime: string }) => {
			const shiftData = { name, startTime, endTime };
			await createShift(shiftData);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['dataShift'] });
			Swal.fire({
				title: 'Success!',
				text: 'Shift created successfully.',
				icon: 'success',
				confirmButtonText: 'OK',
			});
		},
		onError: () => {
			Swal.fire({
				title: 'Error!',
				text: 'There was an error creating the shift.',
				icon: 'error',
				confirmButtonText: 'OK',
			});
		},
	});

	// Mutation for deleting a shift
	const { mutate: mutateDeleteShift } = useMutation({
		mutationFn: async (id: number) => {
			await deleteShift(id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['dataShift'] });
			Swal.fire({
				title: 'Deleted!',
				text: 'Shift deleted successfully.',
				icon: 'success',
				confirmButtonText: 'OK',
			});
		},
		onError: () => {
			Swal.fire({
				title: 'Error!',
				text: 'There was an error deleting the shift.',
				icon: 'error',
				confirmButtonText: 'OK',
			});
		},
	});

	// Mutation for updating a shift
	const { mutate: mutateUpdateShift } = useMutation({
		mutationFn: async ({
			id,
			name,
			startTime,
			endTime,
		}: {
			id: number;
			name: string;
			startTime: string;
			endTime: string;
		}) => {
			await updateShift({ id, name, startTime, endTime });
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['dataShift'] });
			Swal.fire({
				title: 'Updated!',
				text: 'Shift updated successfully.',
				icon: 'success',
				confirmButtonText: 'OK',
			});
		},
		onError: () => {
			Swal.fire({
				title: 'Error!',
				text: 'There was an error updating the shift.',
				icon: 'error',
				confirmButtonText: 'OK',
			});
		},
	});

	const [newShiftName, setNewShiftName] = useState('');
	const [startTime, setStartTime] = useState('08:00:00');
	const [endTime, setEndTime] = useState('16:00:00');

	// Handle form submission for creating a new shift
	const handleCreateShift = (e: React.FormEvent) => {
		e.preventDefault();
		if (newShiftName.trim()) {
			mutateCreateShift({
				name: newShiftName,
				startTime,
				endTime,
			});

			setNewShiftName('');
			setStartTime('08:00:00');
			setEndTime('16:00:00');
			setDialogOpen(false); // Close dialog on success
		} else {
			Swal.fire({
				title: 'Warning!',
				text: 'Shift Name cannot be empty.',
				icon: 'warning',
				confirmButtonText: 'OK',
			});
		}
	};

	// Get the current page items for pagination
	const getCurrentPageItems = () => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		const endIndex = startIndex + itemsPerPage;
		return Shift.slice(startIndex, endIndex);
	};

	// Handle page navigation
	const goToFirstPage = () => setCurrentPage(1);
	const goToLastPage = () => setCurrentPage(totalPages);
	const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
	const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

	// Confirm before deleting a shift
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
				mutateDeleteShift(id); // Proceed with deletion
			}
		});
	};

	return (
		<PageContainer>
			<div className='flex justify-between mb-4'>
				<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
					<DialogTrigger asChild>
						<Button variant='default' onClick={() => setDialogOpen(true)}>
							Create Shift
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Create Shift</DialogTitle>
						</DialogHeader>
						<form onSubmit={handleCreateShift}>
							<div className='space-y-4'>
								<Input
									id='name'
									name='name'
									placeholder='Shift Name'
									className='w-full'
									value={newShiftName}
									onChange={(e) => setNewShiftName(e.target.value)}
									required
								/>
								<Input
									id='start-time'
									name='start-time'
									type='time'
									value={startTime}
									onChange={(e) => setStartTime(e.target.value)}
								/>
								<Input
									id='end-time'
									name='end-time'
									type='time'
									value={endTime}
									onChange={(e) => setEndTime(e.target.value)}
								/>
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
					{isLoadingShiftData ? (
						<div className='p-6 text-center text-gray-400'>Loading shifts...</div>
					) : errorShiftData ? (
						<div className='p-6 text-center text-red-400'>Failed to load shifts</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Shift Id</TableHead>
									<TableHead>Name</TableHead>
									<TableHead>Start Time</TableHead>
									<TableHead>End Time</TableHead>
									<TableHead>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{getCurrentPageItems().map((shift) => (
									<TableRow key={shift.id}>
										<TableCell>{shift.id}</TableCell>
										<TableCell>{shift.name}</TableCell>
										<TableCell>{shift.startTime}</TableCell>
										<TableCell>{shift.endTime}</TableCell>
										<TableCell>
											<Button onClick={() => handleDeleteShift(shift.id)}>Delete</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</div>

				{/* Pagination Controls */}
				<div className='flex justify-between mt-4 px-4'>
					<Button onClick={goToFirstPage} disabled={currentPage === 1}>
						<ChevronFirst />
					</Button>
					<Button onClick={goToPreviousPage} disabled={currentPage === 1}>
						<ChevronLeft />
					</Button>
					<div className='flex items-center'>
						Page {currentPage} of {totalPages}
					</div>
					<Button onClick={goToNextPage} disabled={currentPage === totalPages}>
						<ChevronRight />
					</Button>
					<Button onClick={goToLastPage} disabled={currentPage === totalPages}>
						<ChevronLast />
					</Button>
				</div>
			</div>
		</PageContainer>
	);
};

export default Shift;

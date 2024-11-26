'use client';
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import PageContainer from '@/app/components/page-container';
import Swal from 'sweetalert2';

const Shift = () => {
	const [dialogOpen, setDialogOpen] = useState(false);

	// Hardcoded shift data
	const Shift = [
		{ id: 1, name: 'Morning Shift', startTime: '08:00:00', endTime: '16:00:00' },
		{ id: 2, name: 'Evening Shift', startTime: '16:00:00', endTime: '00:00:00' },
		{ id: 3, name: 'Night Shift', startTime: '00:00:00', endTime: '08:00:00' },
		{ id: 4, name: 'Day Shift', startTime: '09:00:00', endTime: '17:00:00' },
		{ id: 5, name: 'Late Shift', startTime: '14:00:00', endTime: '22:00:00' },
	];

	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;
	const totalPages = Math.ceil(Shift.length / itemsPerPage);

	const [newShiftName, setNewShiftName] = useState('');
	const [startTime, setStartTime] = useState('08:00:00');
	const [endTime, setEndTime] = useState('16:00:00');

	// Get the current page items for pagination
	const getCurrentPageItems = () => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		const endIndex = startIndex + itemsPerPage;
		return Shift.slice(startIndex, endIndex);
	};

	// Handle form submission for creating a new shift
	const handleCreateShift = (e: React.FormEvent) => {
		e.preventDefault();
		if (newShiftName.trim()) {
			// For hardcoded data, we can simply log or alert the success
			Swal.fire({
				title: 'Success!',
				text: `Shift "${newShiftName}" created successfully.`,
				icon: 'success',
				confirmButtonText: 'OK',
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
				// For hardcoded data, we simulate deletion by removing it from the array
				Swal.fire({
					title: 'Deleted!',
					text: 'Shift deleted successfully.',
					icon: 'success',
					confirmButtonText: 'OK',
				});
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

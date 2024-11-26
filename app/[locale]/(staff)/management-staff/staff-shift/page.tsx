'use client';
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import PageContainer from '@/app/components/page-container';
import Swal from 'sweetalert2';

const StaffShift = () => {
	const [dialogOpen, setDialogOpen] = useState(false);

	// Dữ liệu giả lập cho ShiftData
	const ShiftData = {
		payload: [
			{ id: 1, name: 'Morning Shift' },
			{ id: 2, name: 'Afternoon Shift' },
			{ id: 3, name: 'Night Shift' },
		],
	};

	// Dữ liệu giả lập cho staffShiftData
	const staffShiftData = {
		payload: [
			{ id: 1, name: 'John Doe', shiftId: 1, date: '2024-11-26' },
			{ id: 2, name: 'Jane Smith', shiftId: 2, date: '2024-11-26' },
			{ id: 3, name: 'Alice Johnson', shiftId: 3, date: '2024-11-26' },
			// Thêm dữ liệu giả lập cho staff shift ở đây
		],
	};

	const staffShift = staffShiftData.payload || [];
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;
	const totalPages = Math.ceil(staffShift.length / itemsPerPage);

	const [staffId, setStaffId] = useState(0);
	const [shiftId, setShiftId] = useState(0);
	const [date, setDate] = useState('');

	// Handle form submission for creating a new staff shift
	const handleCreateStaffShift = (e: React.FormEvent) => {
		e.preventDefault();
		if (staffId && shiftId && date) {
			const staffShiftData = { staffId, shiftId, date };
			// Tạo mới staff shift ở đây (trong thực tế bạn sẽ gọi API)
			Swal.fire({
				title: 'Success!',
				text: 'Staff shift created successfully.',
				icon: 'success',
				confirmButtonText: 'OK',
			});
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
								<Input
									id='staffId'
									name='staffId'
									type='number'
									placeholder='Staff ID'
									className='w-full'
									value={staffId}
									onChange={(e) => setStaffId(Number(e.target.value))}
									required
								/>
								<Input
									id='shiftId'
									name='shiftId'
									type='number'
									placeholder='Shift ID'
									className='w-full'
									value={shiftId}
									onChange={(e) => setShiftId(Number(e.target.value))}
									required
								/>
								<Input
									id='date'
									name='date'
									type='date'
									className='w-full'
									value={date}
									onChange={(e) => setDate(e.target.value)}
									required
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
								<TableHead>Staff name</TableHead>
								<TableHead>Shift Id</TableHead>
								<TableHead>Date</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{getCurrentPageItems().map((shift) => (
								<TableRow key={shift.id}>
									<TableCell>{shift.name}</TableCell>
									<TableCell>{shift.shiftId}</TableCell>
									<TableCell>{shift.date}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
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

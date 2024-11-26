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

	// Dữ liệu giả lập cho staffShiftData của nhân viên
	const staffShiftData = {
		name: 'John Doe', // Tên nhân viên cố định
		shifts: [
			{ shiftId: 1, date: '2024-11-26' }, // Ca sáng
			{ shiftId: 2, date: '2024-11-27' }, // Ca chiều
			{ shiftId: 3, date: '2024-11-28' }, // Ca tối
		],
	};

	const [staffId, setStaffId] = useState(0);
	const [shiftId, setShiftId] = useState(0);
	const [date, setDate] = useState('');

	// Handle form submission for creating a new staff shift
	const handleCreateStaffShift = (e: React.FormEvent) => {
		e.preventDefault();
		if (staffId && shiftId && date) {
			const newStaffShift = { staffId, shiftId, date };
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
								<TableHead>Shift Name</TableHead>
								<TableHead>Date</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{staffShiftData.shifts.map((shift, index) => {
								const shiftName =
									ShiftData.payload.find((s) => s.id === shift.shiftId)?.name || 'Unknown Shift';
								return (
									<TableRow key={index}>
										<TableCell>{shiftName}</TableCell>
										<TableCell>{shift.date}</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</div>
			</div>
		</PageContainer>
	);
};

export default StaffShift;

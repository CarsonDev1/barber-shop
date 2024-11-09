'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	ChevronFirst,
	ChevronLast,
	ChevronLeft,
	ChevronRight,
	MessageSquare,
	MoreHorizontal,
	Pencil,
	Search,
	Star,
	Trash2,
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import PageContainer from '@/app/components/page-container';

type Booking = {
	id: number;
	name: string;
	phone: string;
	service: string;
	stylist: string;
	date: string;
	status: string;
};

const bookings: Booking[] = [
	{ id: 1, name: 'Van Le', phone: '123', service: 'Combo 1', stylist: 'Xink Do', date: '01/08/2024', status: 'Done' },
	{ id: 2, name: 'Long', phone: '1234', service: 'Combo 2', stylist: 'Thiep', date: '02/08/2024', status: 'Done' },
	{ id: 3, name: 'Luong', phone: '234', service: 'Cắt tóc', stylist: 'Hieu', date: '02/08/2024', status: 'Done' },
	{ id: 4, name: 'Khai', phone: '2345', service: 'Cạo râu', stylist: 'Hieu', date: '03/08/2024', status: 'Done' },
	{ id: 5, name: 'Kha', phone: '345', service: 'Combo 1', stylist: 'Xink Do', date: '03/04/2024', status: 'Done' },
	{
		id: 6,
		name: 'Thuat',
		phone: '3456',
		service: 'Cạo lông mày',
		stylist: 'Thiep',
		date: '04/08/2024',
		status: 'Not Yet',
	},
	{ id: 7, name: 'A', phone: '456', service: 'Nhuộm tóc', stylist: 'Hieu', date: '04/08/2024', status: 'Done' },
	{ id: 8, name: 'B', phone: '4567', service: 'Uốn tóc', stylist: 'Xink Do', date: '05/08/2024', status: 'Done' },
	{ id: 9, name: 'C', phone: '567', service: 'Nhuộm & Uốn', stylist: 'Thiep', date: '05/08/2024', status: 'Not Yet' },
	{ id: 10, name: 'D', phone: '5678', service: 'Cạo râu', stylist: 'Hieu', date: '06/08/2024', status: 'Not Yet' },
	{ id: 11, name: 'E', phone: '678', service: 'Cắt tóc', stylist: 'Thiep', date: '07/08/2024', status: 'Done' },
	{
		id: 12,
		name: 'F',
		phone: '6789',
		service: 'Uốn & Nhuộm',
		stylist: 'Xink DO',
		date: '08/08/2024',
		status: 'Done',
	},
];

export default function BookingManagement() {
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;
	const totalPages = Math.ceil(bookings.length / itemsPerPage);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

	const handleEditClick = (booking: Booking) => {
		setSelectedBooking(booking);
		setIsDialogOpen(true);
	};

	const handleCloseDialog = () => {
		setIsDialogOpen(false);
		setSelectedBooking(null);
	};

	// Get the bookings for the current page
	const getCurrentPageItems = () => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		const endIndex = startIndex + itemsPerPage;
		return bookings.slice(startIndex, endIndex);
	};

	// Pagination control functions
	const goToFirstPage = () => setCurrentPage(1);
	const goToLastPage = () => setCurrentPage(totalPages);
	const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
	const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

	return (
		<PageContainer>
			<div className='bg-gray-900'>
				<div className='container-lg mx-auto space-y-6'>
					<h1 className='text-2xl font-bold text-center text-white mb-8'>
						BOOKING OF CUSTOMERS - DETAILS INFORMATION
					</h1>

					<div className='relative max-w-xl mx-auto mb-8'>
						<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
						<Input
							placeholder='Search name, phone, service,......'
							className='pl-9 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400'
						/>
					</div>

					<div className='rounded-lg border border-gray-700 bg-gray-800/50 backdrop-blur-sm overflow-hidden'>
						<Table>
							<TableHeader>
								<TableRow className='border-gray-700 hover:bg-gray-800/50'>
									<TableHead className='text-gray-200'>ID</TableHead>
									<TableHead className='text-gray-200'>Name</TableHead>
									<TableHead className='text-gray-200'>Phone Number</TableHead>
									<TableHead className='text-gray-200'>Service</TableHead>
									<TableHead className='text-gray-200'>Stylist</TableHead>
									<TableHead className='text-gray-200'>Date & Time</TableHead>
									<TableHead className='text-gray-200'>Status</TableHead>
									<TableHead className='text-gray-200 text-right'>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{getCurrentPageItems().map((booking) => (
									<TableRow key={booking.id} className='border-gray-700 hover:bg-gray-700/50'>
										<TableCell className='font-medium text-gray-200'>{booking.id}</TableCell>
										<TableCell className='text-gray-200'>{booking.name}</TableCell>
										<TableCell className='text-gray-200'>{booking.phone}</TableCell>
										<TableCell className='text-gray-200'>{booking.service}</TableCell>
										<TableCell className='text-gray-200'>{booking.stylist}</TableCell>
										<TableCell className='text-gray-200'>{booking.date}</TableCell>
										<TableCell>
											<span
												className={`px-2 py-1 rounded-full text-xs font-medium ${
													booking.status === 'Done'
														? 'bg-green-500/20 text-green-400'
														: 'bg-yellow-500/20 text-yellow-400'
												}`}
											>
												{booking.status}
											</span>
										</TableCell>
										<TableCell className='text-right'>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														variant='ghost'
														size='icon'
														className='text-gray-400 hover:text-white hover:bg-transparent'
													>
														<MoreHorizontal className='h-4 w-4' />
														<span className='sr-only'>Open menu</span>
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align='end' className='w-32'>
													<DropdownMenuItem
														onClick={() => handleEditClick(booking)}
														className='text-green-600 hover:text-green-700'
													>
														<Pencil className='w-4 h-4 mr-2' />
														Edit
													</DropdownMenuItem>
													<DropdownMenuItem className='text-red-600 hover:text-red-700'>
														<Trash2 className='w-4 h-4 mr-2' />
														Delete
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>

					<div className='flex items-center justify-between'>
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

						<div className='flex items-center gap-2'>
							<Button variant='outline' className='gap-2 text-gray-400'>
								<MessageSquare className='h-4 w-4' />
								Comment
							</Button>
							<Button variant='outline' className='gap-2 text-gray-400'>
								<Star className='h-4 w-4' />
								Ratings
							</Button>
						</div>
					</div>
				</div>

				{/* Dialog for Editing Booking */}
				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogContent className='bg-gray-800 text-white'>
						<DialogHeader>
							<h2 className='text-xl font-bold'>Edit Booking</h2>
						</DialogHeader>
						<div className='space-y-4'>
							<Label>
								Name
								<Input
									value={selectedBooking?.name || ''}
									onChange={(e) =>
										setSelectedBooking((prev) => (prev ? { ...prev, name: e.target.value } : null))
									}
								/>
							</Label>
							<Label>
								Phone
								<Input
									value={selectedBooking?.phone || ''}
									onChange={(e) =>
										setSelectedBooking((prev) => (prev ? { ...prev, phone: e.target.value } : null))
									}
								/>
							</Label>
							<Label>
								Service
								<Input
									value={selectedBooking?.service || ''}
									onChange={(e) =>
										setSelectedBooking((prev) =>
											prev ? { ...prev, service: e.target.value } : null
										)
									}
								/>
							</Label>
							<Label>
								Stylist
								<Input
									value={selectedBooking?.stylist || ''}
									onChange={(e) =>
										setSelectedBooking((prev) =>
											prev ? { ...prev, stylist: e.target.value } : null
										)
									}
								/>
							</Label>
							<Label>
								Date
								<Input
									id='birthday'
									type='date'
									defaultValue={selectedBooking?.date}
									value={selectedBooking?.date || ''}
									className='block text-white'
									onChange={(e) =>
										setSelectedBooking((prev) => (prev ? { ...prev, date: e.target.value } : null))
									}
								/>
							</Label>
							<Button
								className='mt-4 bg-blue-500 text-white hover:bg-blue-700'
								onClick={handleCloseDialog}
							>
								Save Changes
							</Button>
						</div>
					</DialogContent>
				</Dialog>
			</div>
		</PageContainer>
	);
}

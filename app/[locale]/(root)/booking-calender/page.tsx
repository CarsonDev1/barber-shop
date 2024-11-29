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
import { useQuery } from '@tanstack/react-query';
import { getBookings } from '@/app/apis/booking/getBooking';

type Booking = {
	id: number;
	name: string;
	phone: string;
	service: string;
	stylist: string;
	date: string;
	status: string;
};

export default function BookingCalender() {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
	// Query bookings data
	const {
		data: bookingData,
		isLoading: isLoadingBookings,
		error: errorBookings,
	} = useQuery<ApiResponseBooking>({
		queryKey: ['dataBookings'],
		queryFn: getBookings,
	});

	const bookings = bookingData?.payload || [];

	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;
	const totalPages = Math.ceil(bookings.length / itemsPerPage);

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

	// Calculate total price for each booking
	const calculateTotalPrice = (booking: any) => {
		return booking.bookingDetails.reduce((total: any, detail: any) => total + (detail?.service?.price || 0), 0);
	};

	// Pagination control functions
	const goToFirstPage = () => setCurrentPage(1);
	const goToLastPage = () => setCurrentPage(totalPages);
	const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
	const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

	return (
		<div className='bg-gray-900 pt-5 md:pt-10 lg:pt-20'>
			<div className='sec-com'>
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
									<TableHead className='text-gray-200'>Note</TableHead>
									<TableHead className='text-gray-200'>Service</TableHead>
									<TableHead className='text-gray-200'>Staff</TableHead>
									<TableHead className='text-gray-200'>Start Time</TableHead>
									<TableHead className='text-gray-200'>End Time</TableHead>
									<TableHead className='text-gray-200'>Status</TableHead>
									<TableHead className='text-gray-200'>Total Price</TableHead>
									<TableHead className='text-gray-200 text-right'>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{getCurrentPageItems().map((booking) => (
									<TableRow key={booking.id} className='border-gray-700 hover:bg-gray-700/50'>
										<TableCell className='font-medium text-gray-200'>{booking.id}</TableCell>
										<TableCell className='text-gray-200'>{booking.note}</TableCell>
										<TableCell className='text-gray-200 w-64'>
											<span className='line-clamp-1'>
												{booking.bookingDetails.map((service) => service?.service?.name)}
											</span>
										</TableCell>
										<TableCell className='text-gray-200 w-40'>{booking.staff.name}</TableCell>
										<TableCell className='text-gray-200'>
											{new Date(booking.startTime).toLocaleString('vi-VN', {
												dateStyle: 'short',
												timeStyle: 'short',
											})}
										</TableCell>
										<TableCell className='text-gray-200'>
											{new Date(booking.endTime).toLocaleString('vi-VN', {
												dateStyle: 'short',
												timeStyle: 'short',
											})}
										</TableCell>
										<TableCell>
											<span
												className={`px-2 py-1 rounded-full text-xs font-medium ${
													booking.status === 'COMPLETED'
														? 'bg-green-500/20 text-green-400'
														: 'bg-yellow-500/20 text-yellow-400'
												}`}
											>
												{booking.status}
											</span>
										</TableCell>
										<TableCell className='text-gray-200'>
											{calculateTotalPrice(booking).toLocaleString()} VND
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
														onClick={() =>
															handleEditClick({
																...booking,
																name: booking.staff.name,
																phone: booking.staff.phone,
																service: booking.bookingDetails
																	.map((service) => service?.service?.name)
																	.join(', '),
																stylist: booking.staff.name,
																date: new Date(booking.startTime).toLocaleDateString(
																	'vi-VN'
																),
															})
														}
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
		</div>
	);
}

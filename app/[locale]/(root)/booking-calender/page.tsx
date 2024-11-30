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
import Swal from 'sweetalert2';

type Booking = {
	id: number;
	name: string;
	phone: string;
	service: string;
	stylist: string;
	date: string;
	status: string;
	bookingDetails: Array<{
		bookingDetailId: number;
		service: { name: string; price: number };
	}>;
	startTime: string;
	endTime: string;
};

export default function BookingCalender() {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
	const [staffComment, setStaffComment] = useState('');
	const [staffRating, setStaffRating] = useState(0);
	const [reviewDetails, setReviewDetails] = useState<{ [key: number]: { comment: string; rating: number } }>({});

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

	// Pagination state
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;
	const totalPages = Math.ceil(bookings.length / itemsPerPage);
	const token = localStorage.getItem('accessToken');

	// Handle review submission
	const handleReviewSubmit = async () => {
		if (!selectedBooking) return;

		const reviewData = {
			bookingId: selectedBooking.id,
			staffComment,
			staffRating,
			reviewDetails: selectedBooking.bookingDetails.map((detail) => ({
				comment: reviewDetails[detail.bookingDetailId]?.comment || '',
				rating: reviewDetails[detail.bookingDetailId]?.rating || 0,
				bookingDetailId: detail.bookingDetailId,
			})),
		};

		try {
			await fetch('https://52.187.14.110/api/review', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(reviewData),
			});
			Swal.fire('Success', 'Review submitted successfully', 'success');
			setIsDialogOpen(false);
			setSelectedBooking(null);
		} catch (error) {
			Swal.fire('Error', 'Failed to submit review', 'error');
		}
	};

	// Handle edit dialog
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
																	.map((detail) => detail.service.name)
																	.join(', '),
																stylist: booking.staff.name,
																date: new Date(booking.startTime).toLocaleDateString(
																	'vi-VN'
																),
																bookingDetails: booking.bookingDetails.map(
																	(detail) => ({
																		bookingDetailId: detail.bookingDetailId,
																		service: {
																			name: detail.service.name,
																			price: detail.service.price,
																		},
																	})
																),
															})
														}
														className='text-green-600 hover:text-green-700'
													>
														<Pencil className='w-4 h-4 mr-2' />
														Edit
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() => {
															if (booking.status === 'COMPLETED') {
																setSelectedBooking({
																	...booking,
																	name: booking.staff.name,
																	phone: booking.staff.phone,
																	service: booking.bookingDetails
																		.map((detail) => detail.service.name)
																		.join(', '),
																	stylist: booking.staff.name,
																	date: new Date(
																		booking.startTime
																	).toLocaleDateString('vi-VN'),
																	bookingDetails: booking.bookingDetails.map(
																		(detail) => ({
																			bookingDetailId: detail.bookingDetailId,
																			service: {
																				name: detail.service.name,
																				price: detail.service.price,
																			},
																		})
																	),
																});
																setIsDialogOpen(true);
															} else {
																Swal.fire(
																	'Warning',
																	'You can only review completed bookings.',
																	'warning'
																);
															}
														}}
														className='text-blue-600 hover:text-blue-700'
													>
														<Star className='w-4 h-4 mr-2' />
														Review
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

						{/* Pagination */}
						<div className='flex justify-between items-center p-4'>
							<div className='flex items-center'>
								<Button variant='outline' onClick={goToFirstPage} className='mr-2'>
									<ChevronFirst className='h-5 w-5' />
								</Button>
								<Button variant='outline' onClick={goToPreviousPage} className='mr-2'>
									<ChevronLeft className='h-5 w-5' />
								</Button>
								<span className='text-sm text-gray-200'>
									Page {currentPage} of {totalPages}
								</span>
								<Button variant='outline' onClick={goToNextPage} className='ml-2'>
									<ChevronRight className='h-5 w-5' />
								</Button>
								<Button variant='outline' onClick={goToLastPage} className='ml-2'>
									<ChevronLast className='h-5 w-5' />
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Review Dialog */}
			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className='bg-gray-800 text-white'>
					<DialogHeader>
						<h2 className='text-xl font-bold'>Submit Review</h2>
					</DialogHeader>
					<div className='space-y-4'>
						<Label>
							Staff Comment
							<Input
								value={staffComment}
								onChange={(e) => setStaffComment(e.target.value)}
								placeholder='Enter your comment'
							/>
						</Label>
						<Label>
							Staff Rating
							<Input
								type='number'
								value={staffRating}
								onChange={(e) => setStaffRating(Number(e.target.value))}
								min={1}
								max={5}
								placeholder='Rate the staff'
							/>
						</Label>
						{selectedBooking?.bookingDetails?.map((detail) => (
							<div key={detail.bookingDetailId}>
								<Label>Review for Service</Label>
								<Input
									value={reviewDetails[detail.bookingDetailId]?.comment || ''}
									onChange={(e) =>
										setReviewDetails((prev) => ({
											...prev,
											[detail.bookingDetailId]: {
												...prev[detail.bookingDetailId],
												comment: e.target.value,
											},
										}))
									}
									placeholder='Enter your review'
								/>
								<Input
									type='number'
									value={reviewDetails[detail.bookingDetailId]?.rating || 0}
									onChange={(e) =>
										setReviewDetails((prev) => ({
											...prev,
											[detail.bookingDetailId]: {
												...prev[detail.bookingDetailId],
												rating: Number(e.target.value),
											},
										}))
									}
									min={1}
									max={5}
									placeholder='Rate the service'
								/>
							</div>
						))}
						<Button className='mt-4 bg-blue-500 text-white hover:bg-blue-700' onClick={handleReviewSubmit}>
							Submit Review
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}

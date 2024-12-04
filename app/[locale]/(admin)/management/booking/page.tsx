'use client';

import { useState } from 'react';
import { MoreHorizontal, Pencil, Trash2, ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import PageContainer from '@/app/components/page-container';
import { useQuery } from '@tanstack/react-query';
import { getBookings } from '@/app/api/booking/getBooking';

export default function Booking() {
	// Query bookings data
	const {
		data: bookingData,
		isLoading: isLoadingBookings,
		error: errorBookings,
	} = useQuery<ApiResponseBooking>({
		queryKey: ['dataBookings'],
		queryFn: getBookings,
	});

	// Extract bookings data
	const bookings = bookingData?.payload || [];

	// Pagination state
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;
	const totalPages = Math.ceil(bookings.length / itemsPerPage);

	// Get items for the current page
	const getCurrentPageItems = () => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		const endIndex = startIndex + itemsPerPage;
		return bookings.slice(startIndex, endIndex);
	};

	// Pagination navigation
	const goToFirstPage = () => setCurrentPage(1);
	const goToLastPage = () => setCurrentPage(totalPages);
	const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
	const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

	return (
		<PageContainer>
			<div className='p-6 bg-gray-900'>
				<div className='container-lg flex flex-col gap-5'>
					<h1 className='text-2xl font-bold text-center text-white'>BOOKING MANAGEMENT</h1>

					{/* Booking Table */}
					<div className='rounded-xl bg-gray-800/50 backdrop-blur-sm overflow-hidden border border-gray-700'>
						<div className='overflow-x-auto'>
							{isLoadingBookings ? (
								<div className='p-6 text-center text-gray-400'>Loading bookings...</div>
							) : errorBookings ? (
								<div className='p-6 text-center text-red-400'>Failed to load bookings</div>
							) : (
								<Table>
									<TableHeader>
										<TableRow className='hover:bg-gray-800/50 border-gray-700'>
											<TableHead className='text-gray-200'>#</TableHead>
											<TableHead className='text-gray-200'>Customer Name</TableHead>
											<TableHead className='text-gray-200'>Staff Name</TableHead>
											<TableHead className='text-gray-200'>Service</TableHead>
											<TableHead className='text-gray-200'>Start Time</TableHead>
											<TableHead className='text-gray-200'>End Time</TableHead>
											<TableHead className='text-gray-200'>Status</TableHead>
											<TableHead className='text-gray-200 text-right'>Action</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{getCurrentPageItems().map((booking, index) => (
											<TableRow key={booking.id} className='border-gray-700 hover:bg-gray-700/50'>
												<TableCell>
													<Badge
														variant='secondary'
														className='bg-gray-700 text-gray-200 hover:bg-gray-600'
													>
														{index + 1 + (currentPage - 1) * itemsPerPage}
													</Badge>
												</TableCell>

												<TableCell>
													<Badge
														variant='secondary'
														className='bg-gray-700 text-gray-200 hover:bg-gray-600'
													>
														{booking?.customer?.name}
													</Badge>
												</TableCell>
												<TableCell>
													<Badge
														variant='secondary'
														className='bg-gray-700 text-gray-200 hover:bg-gray-600'
													>
														{booking?.staff ? booking?.staff.name : 'No Staff'}
													</Badge>
												</TableCell>
												<TableCell>
													<Badge
														variant='secondary'
														className='bg-gray-700 text-gray-200 hover:bg-gray-600'
													>
														{booking?.bookingDetails?.length
															? booking.bookingDetails
																	.map(
																		(detail) =>
																			detail?.service?.name ||
																			'Service Name Not Available'
																	)
																	.join(', ')
															: 'No services'}
													</Badge>
												</TableCell>

												<TableCell>
													<Badge
														variant='secondary'
														className='bg-gray-700 text-gray-200 hover:bg-gray-600'
													>
														{new Date(booking.startTime).toLocaleString()}
													</Badge>
												</TableCell>
												<TableCell>
													<Badge
														variant='secondary'
														className='bg-gray-700 text-gray-200 hover:bg-gray-600'
													>
														{new Date(booking.endTime).toLocaleString()}
													</Badge>
												</TableCell>
												<TableCell>
													<Badge
														variant='secondary'
														className='bg-gray-700 text-gray-200 hover:bg-gray-600'
													>
														{booking.status}
													</Badge>
												</TableCell>
												<TableCell className='text-right'>
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button
																variant='ghost'
																size='icon'
																className='hover:bg-gray-700'
															>
																<MoreHorizontal className='h-4 w-4' />
																<span className='sr-only'>Open menu</span>
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align='end' className='w-[160px]'>
															<DropdownMenuItem className='text-green-500 hover:text-green-600 hover:bg-green-100 dark:hover:bg-green-800 cursor-pointer'>
																<Pencil className='mr-2 h-4 w-4' />
																<span>Edit</span>
															</DropdownMenuItem>
															<DropdownMenuItem className='text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-800 cursor-pointer'>
																<Trash2 className='mr-2 h-4 w-4' />
																<span>Delete</span>
															</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							)}
						</div>
					</div>

					{/* Pagination Controls */}
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
				</div>
			</div>
		</PageContainer>
	);
}

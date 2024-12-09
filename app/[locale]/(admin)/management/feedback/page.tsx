'use client';

import {
	ChevronFirst,
	ChevronLast,
	ChevronLeft,
	ChevronRight,
	MessageSquare,
	MoreHorizontal,
	Pencil,
	Star,
	Trash2,
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PageContainer from '@/app/components/page-container';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllReview } from '@/app/api/review/getAllReview';

// const reviews = Array(20).fill({
// 	customer: 'Van Le',
// 	account: 'vanlepro',
// 	stylist: 'Do Xinh',
// 	rate: '3/5',
// 	review: 'Your barber is...',
// 	date: '12/06/2024',
// 	time: '21:00',
// });

export default function Feedback() {
	const { data: allReviewData } = useQuery<any>({
		queryKey: ['dataReviews'],
		queryFn: getAllReview,
	});

	const reviews = allReviewData?.payload || [];
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;
	const totalPages = Math.ceil(reviews.length / itemsPerPage);

	// Helper function to get the reviews for the current page
	const getCurrentPageItems = () => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		const endIndex = startIndex + itemsPerPage;
		return reviews.slice(startIndex, endIndex);
	};

	// Functions to handle pagination
	const goToFirstPage = () => setCurrentPage(1);
	const goToLastPage = () => setCurrentPage(totalPages);
	const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
	const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

	return (
		<PageContainer>
			<div className='p-6 bg-gray-900'>
				<div className='container-lg flex flex-col gap-5'>
					<h1 className='text-2xl font-bold text-center text-white'>MANAGEMENT FEEDBACK</h1>
					<div className='rounded-xl bg-gray-800/50 backdrop-blur-sm overflow-hidden border border-gray-700'>
						<Table>
							<TableHeader>
								<TableRow className='hover:bg-gray-800/50 border-gray-700'>
									<TableHead className='text-gray-200'>Id</TableHead>
									<TableHead className='text-gray-200'>Staff Rating</TableHead>
									<TableHead className='text-gray-200'>Staff Comment</TableHead>
									<TableHead className='text-gray-200'>Review</TableHead>
									<TableHead className='text-gray-200'>Date</TableHead>
									{/* <TableHead className='text-gray-200 text-right'>Action</TableHead> */}
								</TableRow>
							</TableHeader>
							<TableBody>
								{getCurrentPageItems().map((review: any, index: any) => (
									<TableRow key={review.id} className='border-gray-700 hover:bg-gray-700/50'>
										<TableCell>
											<Badge
												variant='secondary'
												className='bg-gray-700 text-gray-200 hover:bg-gray-600'
											>
												{index + 1 + (currentPage - 1) * itemsPerPage}
											</Badge>
										</TableCell>
										<TableCell>
											<div className='flex items-center'>
												{Array.from({ length: 5 }, (_, index) => (
													<svg
														key={index}
														className={`size-4 ${
															index < review.staffRating
																? 'text-yellow-500'
																: 'text-gray-400'
														}`}
														fill='currentColor'
														viewBox='0 0 20 20'
														xmlns='http://www.w3.org/2000/svg'
													>
														<path d='M10 15l-5.878 3.09 1.121-6.535L0 6.545l6.545-.955L10 0l2.455 5.59L20 6.545l-5.243 4.005 1.121 6.535L10 15z' />
													</svg>
												))}
											</div>
										</TableCell>
										<TableCell>
											<Badge
												variant='secondary'
												className='bg-gray-700 text-gray-200 hover:bg-gray-600'
											>
												{review.staffComment}
											</Badge>
										</TableCell>
										<TableCell>
											{review.reviewDetails.map((detail: any) => (
												<Badge
													key={detail.id}
													variant='secondary'
													className='bg-gray-700 text-gray-200 hover:bg-gray-600 block mb-1'
												>
													{detail.type}: {detail.comment}
												</Badge>
											))}
										</TableCell>
										<TableCell>
											<Badge
												variant='secondary'
												className='bg-gray-700 text-gray-200 hover:bg-gray-600'
											>
												{new Date(review.createdAt).toLocaleDateString()}
											</Badge>
										</TableCell>
										{/* <TableCell className='text-right'>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant='ghost' size='icon' className='hover:bg-gray-700'>
														<MoreHorizontal className='h-4 w-4' />
														<span className='sr-only'>Open menu</span>
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align='end' className='w-[160px]'>
													<DropdownMenuItem className='text-blue-500 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-800 cursor-pointer'>
														<Pencil className='mr-2 h-4 w-4' />
														<span>Edit</span>
													</DropdownMenuItem>
													<DropdownMenuItem className='text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-800 cursor-pointer'>
														<Trash2 className='mr-2 h-4 w-4' />
														<span>Delete</span>
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell> */}
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
					</div>
				</div>
			</div>
		</PageContainer>
	);
}

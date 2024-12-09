'use client';

import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
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

export default function Feedback() {
	const { data: allReviewData } = useQuery<any>({
		queryKey: ['dataReviews'],
		queryFn: getAllReview,
	});

	const reviews = allReviewData?.payload || [];
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;
	const totalPages = Math.ceil(reviews.length / itemsPerPage);

	const getCurrentPageItems = () => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		const endIndex = startIndex + itemsPerPage;
		return reviews.slice(startIndex, endIndex);
	};

	const goToFirstPage = () => setCurrentPage(1);
	const goToLastPage = () => setCurrentPage(totalPages);
	const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
	const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

	return (
		<div className='h-full bg-gray-900 py-40'>
			<div className='container-lg flex flex-col gap-5'>
				<h1 className='text-2xl font-bold text-center text-white'>FEEDBACK & REVIEW</h1>
				<div className='rounded-xl bg-gray-800/50 backdrop-blur-sm overflow-hidden border border-gray-700'>
					<Table>
						<TableHeader>
							<TableRow className='hover:bg-gray-800/50 border-gray-700'>
								<TableHead className='text-gray-200'>Id</TableHead>
								<TableHead className='text-gray-200'>Staff Rating</TableHead>
								<TableHead className='text-gray-200'>Staff Comment</TableHead>
								<TableHead className='text-gray-200'>Review</TableHead>
								<TableHead className='text-gray-200'>Date</TableHead>
								<TableHead className='text-gray-200 text-right'>Action</TableHead>
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
										<Badge
											variant='secondary'
											className='bg-gray-700 text-gray-200 hover:bg-gray-600 flex items-center gap-1 w-fit'
										>
											{review.staffRating}
										</Badge>
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
									<TableCell className='text-right'>
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
				</div>
			</div>
		</div>
	);
}

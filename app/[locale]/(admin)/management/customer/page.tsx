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

// Sample data matching the image exactly
const customers = Array(20).fill({
	name: 'Van Le',
	account: 'vanlepro',
	pass: '123123',
	email: 'le@gmail.com',
	phone: '0123456789',
	address: 'Son Tra,Da Nang',
});

export default function Customer() {
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;
	const totalPages = Math.ceil(customers.length / itemsPerPage);

	// Function to get the current page's items
	const getCurrentPageItems = () => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		const endIndex = startIndex + itemsPerPage;
		return customers.slice(startIndex, endIndex);
	};

	// Pagination control functions
	const goToFirstPage = () => setCurrentPage(1);
	const goToLastPage = () => setCurrentPage(totalPages);
	const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
	const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

	return (
		<PageContainer>
			<div className='p-6 bg-gray-900'>
				<div className='container-lg flex flex-col gap-5'>
					<h1 className='text-2xl font-bold text-center text-white'>MANAGEMENT CUSTOMER</h1>
					<div className='rounded-xl bg-gray-800/50 backdrop-blur-sm overflow-hidden border border-gray-700'>
						<div className='overflow-x-auto'>
							<Table>
								<TableHeader>
									<TableRow className='hover:bg-gray-800/50 border-gray-700'>
										<TableHead className='text-gray-200'>#</TableHead>
										<TableHead className='text-gray-200'>Name</TableHead>
										<TableHead className='text-gray-200'>Account</TableHead>
										<TableHead className='text-gray-200'>Pass</TableHead>
										<TableHead className='text-gray-200'>Email</TableHead>
										<TableHead className='text-gray-200'>Phone</TableHead>
										<TableHead className='text-gray-200'>Address</TableHead>
										<TableHead className='text-gray-200 text-right'>Action</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{getCurrentPageItems().map((customer, index) => (
										<TableRow key={index} className='border-gray-700 hover:bg-gray-700/50'>
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
													{customer.name}
												</Badge>
											</TableCell>
											<TableCell>
												<Badge
													variant='secondary'
													className='bg-gray-700 text-gray-200 hover:bg-gray-600'
												>
													{customer.account}
												</Badge>
											</TableCell>
											<TableCell>
												<Badge
													variant='secondary'
													className='bg-gray-700 text-gray-200 hover:bg-gray-600'
												>
													{customer.pass}
												</Badge>
											</TableCell>
											<TableCell>
												<Badge
													variant='secondary'
													className='bg-gray-700 text-gray-200 hover:bg-gray-600'
												>
													{customer.email}
												</Badge>
											</TableCell>
											<TableCell>
												<Badge
													variant='secondary'
													className='bg-gray-700 text-gray-200 hover:bg-gray-600'
												>
													{customer.phone}
												</Badge>
											</TableCell>
											<TableCell>
												<Badge
													variant='secondary'
													className='bg-gray-700 text-gray-200 hover:bg-gray-600'
												>
													{customer.address}
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
				</div>
			</div>
		</PageContainer>
	);
}

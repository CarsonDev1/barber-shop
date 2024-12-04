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
import { getCustomers } from '@/app/api/customer/getCustomers';
import { CustomersResponse } from '@/types/Customer.type';
import { getStaffs } from '@/app/api/customer/getStaffs';
import { getReceptionists } from '@/app/api/customer/getReceptionists';

export default function Customer() {
	// Customer data query
	const {
		data: customerData,
		isLoading: isLoadingCustomers,
		error: errorCustomers,
	} = useQuery<CustomersResponse>({
		queryKey: ['dataCustomers'],
		queryFn: getCustomers,
	});

	// Receptionist data query
	const {
		data: receptionistData,
		isLoading: isLoadingReceptionists,
		error: errorReceptionists,
	} = useQuery<CustomersResponse>({
		queryKey: ['dataReceptionists'],
		queryFn: getReceptionists,
	});

	// Staff data query
	const {
		data: staffData,
		isLoading: isLoadingStaffs,
		error: errorStaffs,
	} = useQuery<CustomersResponse>({
		queryKey: ['dataStaffs'],
		queryFn: getStaffs,
	});

	// Extract customer data
	const customers = customerData?.payload || [];
	// Extract receptionist data
	const receptionists = receptionistData?.payload || [];
	// Extract staff data
	const staffs = staffData?.payload || [];

	// Pagination state for customers
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;
	const totalPages = Math.ceil(customers.length / itemsPerPage);

	// Pagination state for receptionists
	const [receptionistsPage, setReceptionistsPage] = useState(1);
	const receptionistsTotalPages = Math.ceil(receptionists.length / itemsPerPage);

	// Pagination state for staffs
	const [staffsPage, setStaffsPage] = useState(1);
	const staffsTotalPages = Math.ceil(staffs.length / itemsPerPage);

	// Get current customer page items
	const getCurrentPageItems = () => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		const endIndex = startIndex + itemsPerPage;
		return customers.slice(startIndex, endIndex);
	};

	// Get current receptionist page items
	const getReceptionistsPageItems = () => {
		const startIndex = (receptionistsPage - 1) * itemsPerPage;
		const endIndex = startIndex + itemsPerPage;
		return receptionists.slice(startIndex, endIndex);
	};

	// Get current staff page items
	const getStaffsPageItems = () => {
		const startIndex = (staffsPage - 1) * itemsPerPage;
		const endIndex = startIndex + itemsPerPage;
		return staffs.slice(startIndex, endIndex);
	};

	// Navigation for customer pagination
	const goToFirstPage = () => setCurrentPage(1);
	const goToLastPage = () => setCurrentPage(totalPages);
	const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
	const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

	// Navigation for receptionist pagination
	const goToFirstReceptionistPage = () => setReceptionistsPage(1);
	const goToLastReceptionistPage = () => setReceptionistsPage(receptionistsTotalPages);
	const goToNextReceptionistPage = () => setReceptionistsPage((prev) => Math.min(prev + 1, receptionistsTotalPages));
	const goToPreviousReceptionistPage = () => setReceptionistsPage((prev) => Math.max(prev - 1, 1));

	// Navigation for staff pagination
	const goToFirstStaffPage = () => setStaffsPage(1);
	const goToLastStaffPage = () => setStaffsPage(staffsTotalPages);
	const goToNextStaffPage = () => setStaffsPage((prev) => Math.min(prev + 1, staffsTotalPages));
	const goToPreviousStaffPage = () => setStaffsPage((prev) => Math.max(prev - 1, 1));

	return (
		<PageContainer>
			<div className='p-6 bg-gray-900'>
				<div className='container-lg flex flex-col gap-5'>
					<h1 className='text-2xl font-bold text-center text-white'>CUSTOMER MANAGEMENT</h1>

					{/* Customer Table */}
					<div className='rounded-xl bg-gray-800/50 backdrop-blur-sm overflow-hidden border border-gray-700'>
						<div className='overflow-x-auto'>
							{isLoadingCustomers ? (
								<div className='p-6 text-center text-gray-400'>Loading customers...</div>
							) : errorCustomers ? (
								<div className='p-6 text-center text-red-400'>Failed to load customers</div>
							) : (
								<Table>
									<TableHeader>
										<TableRow className='hover:bg-gray-800/50 border-gray-700'>
											<TableHead className='text-gray-200'>#</TableHead>
											<TableHead className='text-gray-200'>Name</TableHead>
											<TableHead className='text-gray-200'>Email</TableHead>
											<TableHead className='text-gray-200'>Phone</TableHead>
											<TableHead className='text-gray-200'>Date of Birth</TableHead>
											<TableHead className='text-gray-200'>Role</TableHead>
											<TableHead className='text-gray-200'>Verified</TableHead>
											<TableHead className='text-gray-200'>Blocked</TableHead>
											<TableHead className='text-gray-200 text-right'>Action</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{getCurrentPageItems().map((customer, index) => (
											<TableRow
												key={customer.id}
												className='border-gray-700 hover:bg-gray-700/50'
											>
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
														{customer.name || 'N/A'}
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
														{customer.dob || 'N/A'}
													</Badge>
												</TableCell>
												<TableCell>
													<Badge
														variant='secondary'
														className='bg-gray-700 text-gray-200 hover:bg-gray-600'
													>
														{customer.role}
													</Badge>
												</TableCell>
												<TableCell>
													<Badge
														variant='outline'
														className={`text-gray-200 ${
															customer.verified ? 'bg-green-500' : 'bg-gray-500'
														}`}
													>
														{customer.verified ? 'Yes' : 'No'}
													</Badge>
												</TableCell>
												<TableCell>
													<Badge
														variant={customer.blocked ? 'destructive' : 'secondary'}
														className={`text-gray-200 ${
															customer.blocked ? 'bg-red-500' : 'bg-gray-500'
														}`}
													>
														{customer.blocked ? 'Yes' : 'No'}
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

					{/* Pagination Controls for Customers */}
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

					{/* Receptionists Table */}
					<h1 className='text-2xl font-bold text-center text-white uppercase'>CUSTOMER receptionists</h1>
					<div className='rounded-xl bg-gray-800/50 backdrop-blur-sm overflow-hidden border border-gray-700'>
						<div className='overflow-x-auto'>
							{isLoadingReceptionists ? (
								<div className='p-6 text-center text-gray-400'>Loading receptionists...</div>
							) : errorReceptionists ? (
								<div className='p-6 text-center text-red-400'>Failed to load receptionists</div>
							) : (
								<Table>
									<TableHeader>
										<TableRow className='hover:bg-gray-800/50 border-gray-700'>
											<TableHead className='text-gray-200'>#</TableHead>
											<TableHead className='text-gray-200'>Name</TableHead>
											<TableHead className='text-gray-200'>Email</TableHead>
											<TableHead className='text-gray-200'>Phone</TableHead>
											<TableHead className='text-gray-200'>Date of Birth</TableHead>
											<TableHead className='text-gray-200'>Role</TableHead>
											<TableHead className='text-gray-200'>Verified</TableHead>
											<TableHead className='text-gray-200'>Blocked</TableHead>
											<TableHead className='text-gray-200 text-right'>Action</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{getReceptionistsPageItems().map((customer, index) => (
											<TableRow
												key={customer.id}
												className='border-gray-700 hover:bg-gray-700/50'
											>
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
														{customer.name || 'N/A'}
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
														{customer.dob || 'N/A'}
													</Badge>
												</TableCell>
												<TableCell>
													<Badge
														variant='secondary'
														className='bg-gray-700 text-gray-200 hover:bg-gray-600'
													>
														{customer.role}
													</Badge>
												</TableCell>
												<TableCell>
													<Badge
														variant='outline'
														className={`text-gray-200 ${
															customer.verified ? 'bg-green-500' : 'bg-gray-500'
														}`}
													>
														{customer.verified ? 'Yes' : 'No'}
													</Badge>
												</TableCell>
												<TableCell>
													<Badge
														variant={customer.blocked ? 'destructive' : 'secondary'}
														className={`text-gray-200 ${
															customer.blocked ? 'bg-red-500' : 'bg-gray-500'
														}`}
													>
														{customer.blocked ? 'Yes' : 'No'}
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

					{/* Pagination Controls for Receptionists */}
					<div className='flex items-center justify-between mt-4'>
						<div className='flex items-center space-x-2'>
							<Button
								variant='outline'
								size='icon'
								className='text-gray-400'
								onClick={goToFirstReceptionistPage}
								disabled={receptionistsPage === 1}
							>
								<ChevronFirst className='h-4 w-4' />
							</Button>
							<Button
								variant='outline'
								size='icon'
								className='text-gray-400'
								onClick={goToPreviousReceptionistPage}
								disabled={receptionistsPage === 1}
							>
								<ChevronLeft className='h-4 w-4' />
							</Button>
							<span className='text-sm text-gray-400'>
								Page <span className='text-white'>{receptionistsPage}</span> of{' '}
								{receptionistsTotalPages}
							</span>
							<Button
								variant='outline'
								size='icon'
								className='text-gray-400'
								onClick={goToNextReceptionistPage}
								disabled={receptionistsPage === receptionistsTotalPages}
							>
								<ChevronRight className='h-4 w-4' />
							</Button>
							<Button
								variant='outline'
								size='icon'
								className='text-gray-400'
								onClick={goToLastReceptionistPage}
								disabled={receptionistsPage === receptionistsTotalPages}
							>
								<ChevronLast className='h-4 w-4' />
							</Button>
						</div>
					</div>

					{/* Staffs Table */}
					<h1 className='text-2xl font-bold text-center text-white uppercase'>CUSTOMER STAFFS</h1>
					<div className='rounded-xl bg-gray-800/50 backdrop-blur-sm overflow-hidden border border-gray-700'>
						<div className='overflow-x-auto'>
							{isLoadingStaffs ? (
								<div className='p-6 text-center text-gray-400'>Loading customers...</div>
							) : errorStaffs ? (
								<div className='p-6 text-center text-red-400'>Failed to load customers</div>
							) : (
								<Table>
									<TableHeader>
										<TableRow className='hover:bg-gray-800/50 border-gray-700'>
											<TableHead className='text-gray-200'>#</TableHead>
											<TableHead className='text-gray-200'>Name</TableHead>
											<TableHead className='text-gray-200'>Email</TableHead>
											<TableHead className='text-gray-200'>Phone</TableHead>
											<TableHead className='text-gray-200'>Date of Birth</TableHead>
											<TableHead className='text-gray-200'>Role</TableHead>
											<TableHead className='text-gray-200'>Verified</TableHead>
											<TableHead className='text-gray-200'>Blocked</TableHead>
											<TableHead className='text-gray-200 text-right'>Action</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{getStaffsPageItems().map((customer, index) => (
											<TableRow
												key={customer.id}
												className='border-gray-700 hover:bg-gray-700/50'
											>
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
														{customer.name || 'N/A'}
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
														{customer.dob || 'N/A'}
													</Badge>
												</TableCell>
												<TableCell>
													<Badge
														variant='secondary'
														className='bg-gray-700 text-gray-200 hover:bg-gray-600'
													>
														{customer.role}
													</Badge>
												</TableCell>
												<TableCell>
													<Badge
														variant='outline'
														className={`text-gray-200 ${
															customer.verified ? 'bg-green-500' : 'bg-gray-500'
														}`}
													>
														{customer.verified ? 'Yes' : 'No'}
													</Badge>
												</TableCell>
												<TableCell>
													<Badge
														variant={customer.blocked ? 'destructive' : 'secondary'}
														className={`text-gray-200 ${
															customer.blocked ? 'bg-red-500' : 'bg-gray-500'
														}`}
													>
														{customer.blocked ? 'Yes' : 'No'}
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

					{/* Pagination Controls for Staffs */}
					<div className='flex items-center justify-between mt-4'>
						<div className='flex items-center space-x-2'>
							<Button
								variant='outline'
								size='icon'
								className='text-gray-400'
								onClick={goToFirstStaffPage}
								disabled={staffsPage === 1}
							>
								<ChevronFirst className='h-4 w-4' />
							</Button>
							<Button
								variant='outline'
								size='icon'
								className='text-gray-400'
								onClick={goToPreviousStaffPage}
								disabled={staffsPage === 1}
							>
								<ChevronLeft className='h-4 w-4' />
							</Button>
							<span className='text-sm text-gray-400'>
								Page <span className='text-white'>{staffsPage}</span> of {staffsTotalPages}
							</span>
							<Button
								variant='outline'
								size='icon'
								className='text-gray-400'
								onClick={goToNextStaffPage}
								disabled={staffsPage === staffsTotalPages}
							>
								<ChevronRight className='h-4 w-4' />
							</Button>
							<Button
								variant='outline'
								size='icon'
								className='text-gray-400'
								onClick={goToLastStaffPage}
								disabled={staffsPage === staffsTotalPages}
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

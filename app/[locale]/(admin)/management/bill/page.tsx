'use client';
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useQuery } from '@tanstack/react-query';
import { ApiResponseServiceType } from '@/types/ServiceType.type';
import { Button } from '@/components/ui/button';
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from 'lucide-react';
import PageContainer from '@/app/components/page-container';
import { CustomersResponse } from '@/types/Customer.type';
import { getStaffs } from '@/app/api/customer/getStaffs';
import { getStaffShift } from '@/app/api/staff-shift/getStaffShift';
import { getPayments } from '@/app/api/payment/getPayment';
import { ApiResponsePayment } from '@/types/Payment.type';

const Bills = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	const { data: paymentData } = useQuery<ApiResponsePayment>({
		queryKey: ['dataPayment'],
		queryFn: getPayments,
	});

	const payments = paymentData?.payload || [];

	const totalPages = Math.ceil(payments.length / itemsPerPage);

	const getCurrentPageItems = () => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		const endIndex = startIndex + itemsPerPage;
		return payments.slice(startIndex, endIndex);
	};

	const goToFirstPage = () => setCurrentPage(1);
	const goToLastPage = () => setCurrentPage(totalPages);
	const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
	const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

	return (
		<PageContainer>
			<div className='flex flex-col gap-5'>
				<h1 className='text-2xl font-bold text-center text-white'>BILL MANAGEMENT</h1>
				<div className='rounded-xl bg-gray-800/50 backdrop-blur-sm overflow-hidden border border-gray-700'>
					<div className='overflow-x-auto'>
						{payments.length === 0 ? (
							<div className='p-6 text-center text-gray-400'>No staff shifts available.</div>
						) : (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>User Name</TableHead>
										<TableHead>Amount</TableHead>
										<TableHead>Transaction Reference</TableHead>
										<TableHead>Card Type</TableHead>
										<TableHead>Payment Date</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{getCurrentPageItems().map((payment) => (
										<TableRow key={payment.id}>
											<TableCell>{payment?.user?.name || 'Không có thông tin'}</TableCell>
											<TableCell>{payment.amount.toLocaleString()} đ</TableCell>
											<TableCell>{payment.txnRef ?? 'N/A'}</TableCell>
											<TableCell>{payment?.cardType || 'Không có thông tin'}</TableCell>
											<TableCell>{new Date(payment.paid_at).toLocaleDateString()}</TableCell>{' '}
										</TableRow>
									))}
								</TableBody>
							</Table>
						)}
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
		</PageContainer>
	);
};

export default Bills;

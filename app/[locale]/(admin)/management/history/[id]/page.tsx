'use client';

import { useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageContainer from '@/app/components/page-container';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface WorkRecord {
	id: number;
	date: string;
	time: string;
	duration: string;
	service: string;
	salary: string;
	customer: string;
	review: number;
	comment: string;
	status: string;
}

export default function HistoryDetail() {
	const [currentPage, setCurrentPage] = useState(1);
	const recordsPerPage = 10;
	const totalRecords = 50;

	const records: WorkRecord[] = Array.from({ length: totalRecords }, (_, i) => ({
		id: i + 1,
		date: '14/09/2024',
		time: '14:00',
		duration: '20 minute',
		service: 'Cắt gội 10 bước',
		salary: '120 000 VND',
		customer: 'Nguyễn Bùi Thiên Phước',
		review: 3,
		comment: 'Your barber did a great job!',
		status: 'Done',
	}));

	const indexOfLastRecord = currentPage * recordsPerPage;
	const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
	const currentRecords = records.slice(indexOfFirstRecord, indexOfLastRecord);

	const totalPages = Math.ceil(totalRecords / recordsPerPage);

	const paginate = (pageNumber: number) => {
		if (pageNumber >= 1 && pageNumber <= totalPages) {
			setCurrentPage(pageNumber);
		}
	};

	const renderPageNumbers = () => {
		const pageNumbers = [];
		const maxVisiblePages = 5;

		if (totalPages <= maxVisiblePages) {
			for (let i = 1; i <= totalPages; i++) {
				pageNumbers.push(i);
			}
		} else {
			if (currentPage <= 3) {
				pageNumbers.push(1, 2, 3, '...', totalPages);
			} else if (currentPage >= totalPages - 2) {
				pageNumbers.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
			} else {
				pageNumbers.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
			}
		}

		return pageNumbers.map((page, index) =>
			typeof page === 'number' ? (
				<Button
					key={index}
					variant={currentPage === page ? 'default' : 'outline'}
					size='icon'
					onClick={() => paginate(page)}
					className={`bg-black cursor-pointer ${currentPage === page ? 'border ' : ' border-none'}`}
				>
					{page}
				</Button>
			) : (
				<span key={index} className='px-2 text-gray-400'>
					...
				</span>
			)
		);
	};

	return (
		<PageContainer>
			<div className='bg-gray-900 text-white'>
				<div className='w-screen md:max-w-6xl mx-auto'>
					<h1 className='text-2xl md:text-3xl font-bold mb-8 text-center'>Xinh Do&apos;s Work History</h1>
					<div className='bg-gray-900/30 backdrop-blur-sm rounded-xl border border-gray-800 p-2 md:p-4'>
						<div className='overflow-x-auto'>
							<Table>
								<TableHeader>
									<TableRow className='text-gray-400 hover:bg-gray-900'>
										<TableHead className='px-4 py-3 text-left whitespace-nowrap'>Date</TableHead>
										<TableHead className='px-4 py-3 text-left whitespace-nowrap'>Time</TableHead>
										<TableHead className='px-4 py-3 text-left whitespace-nowrap'>
											Duration
										</TableHead>
										<TableHead className='px-4 py-3 text-left whitespace-nowrap'>Service</TableHead>
										<TableHead className='px-4 py-3 text-left whitespace-nowrap'>Salary</TableHead>
										<TableHead className='px-4 py-3 text-left whitespace-nowrap'>
											Customer
										</TableHead>
										<TableHead className='px-4 py-3 text-left whitespace-nowrap'>Review</TableHead>
										<TableHead className='px-4 py-3 text-left whitespace-nowrap'>Comment</TableHead>
										<TableHead className='px-4 py-3 text-left whitespace-nowrap sticky right-0 bg-gray-900/30 backdrop-blur-sm'>
											Status
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody className='divide-y divide-gray-800'>
									{currentRecords.map((record) => (
										<TableRow key={record.id} className='border-gray-700 hover:bg-gray-700/50'>
											<TableCell className='px-4 py-3 whitespace-nowrap'>
												<div className='flex items-center gap-3'>
													<span className='flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 text-sm font-medium'>
														{record.id}
													</span>
													<span className='px-3 py-1 rounded-full bg-gray-800 text-sm'>
														{record.date}
													</span>
												</div>
											</TableCell>
											<TableCell className='px-4 py-3 whitespace-nowrap'>
												<span className='px-3 py-1 rounded-full bg-gray-800 text-sm'>
													{record.time}
												</span>
											</TableCell>
											<TableCell className='px-4 py-3 whitespace-nowrap'>
												<span className='px-3 py-1 rounded-full bg-gray-800 text-sm'>
													{record.duration}
												</span>
											</TableCell>
											<TableCell className='px-4 py-3 whitespace-nowrap'>
												<span className='px-3 py-1 rounded-full bg-gray-800 text-sm'>
													{record.service}
												</span>
											</TableCell>
											<TableCell className='px-4 py-3 whitespace-nowrap'>
												<span className='px-3 py-1 rounded-full bg-gray-800 text-sm'>
													{record.salary}
												</span>
											</TableCell>
											<TableCell className='px-4 py-3 whitespace-nowrap'>
												<span className='px-3 py-1 rounded-full bg-gray-800 text-sm'>
													{record.customer}
												</span>
											</TableCell>
											<TableCell className='px-4 py-3 whitespace-nowrap'>
												<span className='px-3 py-1 rounded-full bg-gray-800 text-sm flex items-center gap-1'>
													{record.review}/5
													<Star className='w-4 h-4 fill-yellow-400 text-yellow-400' />
												</span>
											</TableCell>
											<TableCell className='px-4 py-3 whitespace-nowrap'>
												<span className='px-3 py-1 rounded-full bg-gray-800 text-sm'>
													{record.comment}
												</span>
											</TableCell>
											<TableCell className='px-4 py-3 whitespace-nowrap sticky right-0 bg-gray-900/30 backdrop-blur-sm'>
												<span className='px-3 py-1 rounded-full bg-gray-800 text-sm'>
													{record.status}
												</span>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					</div>

					{/* Pagination */}
					<div className='mt-6 flex justify-center items-center gap-2'>
						<Button
							variant='outline'
							size='icon'
							onClick={() => paginate(currentPage - 1)}
							disabled={currentPage === 1}
						>
							<ChevronLeft className='h-4 w-4 text-black' />
						</Button>
						{renderPageNumbers()}
						<Button
							variant='outline'
							size='icon'
							onClick={() => paginate(currentPage + 1)}
							disabled={currentPage === totalPages}
						>
							<ChevronRight className='h-4 w-4 text-black' />
						</Button>
					</div>
				</div>
			</div>
		</PageContainer>
	);
}

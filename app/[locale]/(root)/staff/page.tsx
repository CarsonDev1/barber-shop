'use client';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import BackGroundRoot from '@/public/root/background-root.png';
import { useQuery } from '@tanstack/react-query';
import { CustomersResponse } from '@/types/Customer.type';
import { getStaffs } from '@/app/api/customer/getStaffs';
import { useRouter } from 'next/navigation';

export default function Stylist() {
	const {
		data: staffData,
		isLoading: isLoadingStaffs,
		error: errorStaffs,
	} = useQuery<CustomersResponse>({
		queryKey: ['dataStaffs'],
		queryFn: getStaffs,
	});

	const stylists = staffData?.payload || [];
	const [selectedStylistId, setSelectedStylistId] = useState<number | null>(null);
	const router = useRouter();

	const [currentPage, setCurrentPage] = useState(1);
	const stylistsPerPage = 8;
	const totalPages = Math.ceil(stylists.length / stylistsPerPage);

	const startIndex = (currentPage - 1) * stylistsPerPage;
	const endIndex = startIndex + stylistsPerPage;
	const paginatedStylists = stylists.slice(startIndex, endIndex);

	const handleSelectStylist = (stylistId: number) => {
		setSelectedStylistId(stylistId);
	};

	const handleConfirmSelection = () => {
		const selectedStylist = stylists.find((stylist) => stylist.id === selectedStylistId);
		if (selectedStylist) {
			const storedData = JSON.parse(localStorage.getItem('bookingData') || '{}');
			storedData.selectedStylist = selectedStylist;
			localStorage.setItem('bookingData', JSON.stringify(storedData));
			router.push('/book');
		}
	};

	return (
		<div className='sec-com !pb-32 bg-slate-950 text-white p-4 space-y-6 !pt-24 relative'>
			<Image
				src={BackGroundRoot}
				alt='Barber Shop Logo'
				width={1820}
				height={1200}
				className='absolute inset-0 w-full object-cover h-full'
			/>
			<div className='container-lg'>
				<div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
					{paginatedStylists.map((stylist) => (
						<Card
							key={stylist.id}
							className='group white backdrop-blur-sm border-gray-800 hover:border-orange-500 transition-colors'
						>
							<CardContent className='p-2'>
								<div className='relative'>
									<span className='absolute z-10 top-2 right-2 bg-black/70 text-white px-2 py-1 text-xs font-bold rounded'>
										{stylist.role}
									</span>
									<div className='flex flex-col text-center gap-2'>
										<div className='h-48 relative z-0'>
											<Image
												src={stylist.avatar.thumbUrl}
												alt='avatar'
												className='object-contain'
												fill
											/>
										</div>
										<span>{stylist.name}</span>
										<div className='flex items-center justify-between'>
											<span>
												{Array.from({ length: 5 }, (_, index) => (
													<span
														key={index}
														className={
															index < stylist.rating ? 'text-yellow-500' : 'text-gray-400'
														}
													>
														★
													</span>
												))}
											</span>
											<div className='flex items-center gap-2 text-sm'>
												<span>Booking Count: </span>
												<span>{stylist.bookingCount}</span>
											</div>
										</div>
										<span>{stylist.description}</span>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>

				{/* Pagination Controls */}
				<div className='flex justify-center items-center gap-4 mt-4'>
					<Button
						onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
						disabled={currentPage === 1}
					>
						Previous
					</Button>
					<span>
						Page {currentPage} of {totalPages}
					</span>
					<Button
						onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
						disabled={currentPage === totalPages}
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	);
}

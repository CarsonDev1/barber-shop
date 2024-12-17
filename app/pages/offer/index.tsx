'use client';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BackGroundRoot from '@/public/root/background-root.png';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { getCusVouchers } from '@/app/api/voucher/getCusVoucher';

export default function OfferPage() {
	// const offers = Array(8).fill('giảm 20% cho tất cả dịch vụ');

	const {
		data: vouchersData,
		isLoading: isLoadingVoucher,
		error: errorVoucher,
	} = useQuery({
		queryKey: ['dataVouchers'],
		queryFn: getCusVouchers,
	});

	const offers = vouchersData?.payload || [];

	return (
		<div className='relative sec-com'>
			<Image
				src={BackGroundRoot}
				alt='Barber Shop Logo'
				width={1820}
				height={1200}
				className='absolute inset-0 w-full object-cover h-full'
			/>
			<div className='w-full max-w-2xl mx-auto pt-20'>
				<div className='bg-gray-800/90 backdrop-blur-sm rounded-3xl'>
					{/* Header */}
					<div className='flex items-center gap-4 p-4 md:p-6'>
						<Link href='/' className='text-white hover:text-gray-200'>
							<ArrowLeft className='w-6 h-6' />
							<span className='sr-only'>Go back</span>
						</Link>
					</div>

					{/* Title */}
					<div className='px-4 md:px-6 mb-6'>
						<div className='bg-gray-700/50 py-3 rounded-lg'>
							<h1 className='text-lg font-medium text-white text-center'>Your Offer</h1>
						</div>
					</div>

					{/* Offers Grid */}
					<div className='px-4 md:px-6 mb-6'>
						<div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
							{offers.map((offer, index) => (
								<div
									key={index}
									className='bg-white rounded-lg shadow-md flex flex-col p-6 text-black font-medium hover:shadow-lg transition-shadow cursor-pointer'
								>
									<div className='flex items-center justify-between mb-4'>
										<span className='text-xl font-bold'>{offer.code}</span>
										<span className='bg-green-500 text-white p-2 text-sm rounded-md shadow-lg font-bold'>
											-{offer.discount}%
										</span>
									</div>
									<div className='flex items-center justify-between mb-4'>
										<div className='flex items-center text-sm font-semibold gap-1'>
											<span className='text-gray-600'>{offer.startDate}</span>
											<span>-</span>
											<span className='text-gray-600'>{offer.endDate}</span>
										</div>
										<span
											className={`p-2 text-sm rounded-md shadow-lg font-bold ${
												offer.forRank === 'BRONZE'
													? 'bg-yellow-400/15 text-yellow-600'
													: offer.forRank === 'DIAMOND'
													? 'bg-blue-400/15 text-blue-600'
													: 'bg-green-400/15 text-green-600'
											}`}
										>
											{offer.forRank}
										</span>
									</div>
									<div className='flex items-center justify-between'>
										<span className='text-lg font-semibold'>Giảm đến:</span>
										<span className='text-rose-600 font-bold text-xl'>
											{new Intl.NumberFormat('vi-VN', {
												style: 'currency',
												currency: 'VND',
											}).format(offer.maxDiscount)}
										</span>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Use Offer Button */}
					<div className='p-4 md:p-6'>
						<Link href='/service'>
							<Button className='w-full bg-[#F5A524] hover:bg-[#F5A524]/90 text-black font-semibold py-6 text-lg'>
								USE OFFER
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}

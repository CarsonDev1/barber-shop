'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import BackGroundRoot from '@/public/root/background-root.png';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getVNPayUrl } from '@/app/api/payment/getVnpay';
import { useRouter } from 'next/navigation';

export default function BookingConfirm() {
	const storedResponse = localStorage.getItem('bookingResponse');
	const voucherResponse: any = localStorage.getItem('voucherData');
	const bookingIds = storedResponse ? [JSON.parse(storedResponse).payload?.id] : [];
	const voucherCode: any = voucherResponse ? JSON.parse(voucherResponse).selectedOffers?.[0]?.name : undefined;

	const router = useRouter();

	const bankCode = '';
	const language = 'vn';

	// React Query to fetch VNPay URL
	const {
		data: getVnPay,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['getVnPay', { bookingIds, bankCode, language, voucherCode }],
		queryFn: () => getVNPayUrl(bookingIds, bankCode, language, voucherCode),
		enabled: bookingIds.length > 0,
	});

	useEffect(() => {
		// Navigate to VNPay URL if data exists
		if (getVnPay?.payload) {
			router.push(getVnPay.payload);
			localStorage.removeItem('bookingResponse');
		}
	}, [getVnPay, router]);

	return (
		<div className='min-h-screen bg-black bg-opacity-80 flex items-center justify-center p-4 overflow-hidden relative'>
			<Image
				src={BackGroundRoot}
				alt='Background Image'
				width={1820}
				height={1200}
				className='absolute inset-0 w-full object-cover h-screen'
			/>
			{/* Handle empty booking */}
			{bookingIds.length === 0 ? (
				<div className='text-center text-white relative z-30'>
					<h2 className='text-2xl md:text-3xl font-bold'>You currently have no bookings to confirm.</h2>
					<div className='mt-6'>
						<Link href='/'>
							<Button className='bg-amber-500 hover:bg-amber-600 text-black font-semibold py-2 px-6 rounded-full text-lg'>
								Go Back
							</Button>
						</Link>
					</div>
				</div>
			) : error ? (
				// Handle error case
				<div className='text-center text-white relative z-30'>
					<h2 className='text-2xl md:text-3xl font-bold'>Payment Confirmation Failed</h2>
					<p className='mt-4 text-red-500'>
						{error.message || 'An unexpected error occurred while processing your request.'}
					</p>
					<div className='mt-6'>
						<Link href='/'>
							<Button className='bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full text-lg'>
								Back to Home
							</Button>
						</Link>
					</div>
				</div>
			) : isLoading ? (
				// Handle loading state
				<div className='text-center text-white relative z-30'>
					<h2 className='text-2xl md:text-3xl font-bold'>Processing your payment...</h2>
					<p className='mt-4'>Please wait a moment.</p>
				</div>
			) : (
				// Successful case
				<div className='max-w-md w-full space-y-8 text-center relative z-20'>
					<div className='inline-block'>
						<svg
							className='w-24 h-24 md:w-32 md:h-32 text-green-500'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'
						>
							<path className='checkmark-circle' d='M22 11.08V12a10 10 0 1 1-5.93-9.14' />
							<path className='checkmark-check' d='M22 4L12 14.01l-3-3' />
						</svg>
					</div>
					<h2 className='mt-6 text-center text-2xl md:text-3xl font-bold text-white'>
						Booking successful, please wait for confirmation
					</h2>
					<div className='mt-6'>
						<Link href='/'>
							<Button className='bg-amber-500 hover:bg-amber-600 text-black font-semibold py-2 px-6 rounded-full text-lg'>
								Done
							</Button>
						</Link>
					</div>
				</div>
			)}
		</div>
	);
}

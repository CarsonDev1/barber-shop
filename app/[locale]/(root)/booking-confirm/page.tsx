'use client';

import { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import BackGroundRoot from '@/public/root/background-root.png';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getVNPayUrl } from '@/app/api/payment/getVnpay';
import { useRouter } from 'next/navigation';

export default function BookingConfirm() {
	const storedResponse = localStorage.getItem('bookingResponse');
	const bookingIds = storedResponse ? [JSON.parse(storedResponse).payload?.id] : [];
	const router = useRouter();

	const bankCode = '';
	const language = 'vn';
	const voucherCode = '';

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
		if (getVnPay?.payload) {
			router.push(getVnPay.payload);
			localStorage.removeItem('bookingResponse');
		}
	}, [getVnPay, router]);

	return (
		<div className='min-h-screen bg-black bg-opacity-80 flex items-center justify-center p-4 overflow-hidden relative'>
			<Image
				src={BackGroundRoot}
				alt='Barber Shop Logo'
				width={1820}
				height={1200}
				className='absolute inset-0 w-full object-cover h-screen'
			/>
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
			) : (
				<>
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
				</>
			)}
			<style jsx>{`
				.checkmark-circle {
					stroke-dasharray: 166;
					stroke-dashoffset: 166;
					animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
				}
				.checkmark-check {
					stroke-dasharray: 48;
					stroke-dashoffset: 48;
					animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
				}
				@keyframes stroke {
					100% {
						stroke-dashoffset: 0;
					}
				}
			`}</style>
		</div>
	);
}

'use client';

import { useState } from 'react';
import { ArrowLeft, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getCusVouchers } from '@/app/api/voucher/getCusVoucher';

interface OffersProps {
	onApply: (offers: { id: number; name: string; maxDiscount: number }[]) => void;
}

interface Voucher {
	id: number;
	code: string;
	maxUses: number;
	discount: number;
	maxDiscount: number;
	startDate: string;
	endDate: string;
	disabled: boolean;
}

export default function Offers({ onApply }: OffersProps) {
	// Fetch vouchers data
	const {
		data: vouchersData,
		isLoading: isLoadingVoucher,
		error: errorVoucher,
	} = useQuery({
		queryKey: ['dataVouchers'],
		queryFn: getCusVouchers,
	});

	const barberOffers = vouchersData?.payload || [];

	const userOffers = Array.from({ length: 6 }, (_, index) => ({
		id: index,
		name: 'Ưu đãi riêng của bạn: Giảm giá 15%',
	}));

	// Update state to store only one selected offer (either index or null)
	const [selectedBarberOffer, setSelectedBarberOffer] = useState<number | null>(null);
	const [selectedUserOffer, setSelectedUserOffer] = useState<number | null>(null);

	// Toggle selection for Barber Offers (only one selection allowed)
	const toggleBarberOffer = (index: number) => {
		setSelectedBarberOffer(selectedBarberOffer === index ? null : index);
	};

	// Toggle selection for User Offers (only one selection allowed)
	const toggleUserOffer = (index: number) => {
		setSelectedUserOffer(selectedUserOffer === index ? null : index);
	};

	const saveOffersToStorage = () => {
		const allSelectedOffers = [
			...(selectedBarberOffer !== null
				? [
						{
							id: barberOffers[selectedBarberOffer].id,
							name: barberOffers[selectedBarberOffer].code,
							maxDiscount: barberOffers[selectedBarberOffer].maxDiscount,
						},
				  ]
				: []),
			...(selectedUserOffer !== null
				? [
						{
							id: userOffers[selectedUserOffer].id,
							name: userOffers[selectedUserOffer].name,
							maxDiscount: barberOffers[selectedBarberOffer || 0].maxDiscount,
						},
				  ]
				: []),
		];

		const storedBookingData = localStorage.getItem('bookingData');
		let bookingData = storedBookingData ? JSON.parse(storedBookingData) : {};

		bookingData.selectedOffers = allSelectedOffers;

		localStorage.setItem('bookingData', JSON.stringify(bookingData));

		onApply(allSelectedOffers);
	};

	return (
		<div className='w-full max-w-3xl mx-auto'>
			<div className='rounded-xl flex flex-col gap-4'>
				<div className='flex items-center gap-4 p-4 md:p-2'>
					<Link href='#' className='text-white hover:text-gray-200'>
						<ArrowLeft className='w-6 h-6' />
					</Link>
					<h1 className='text-xl md:text-2xl font-bold text-white text-center flex-1'>Offer from Barber</h1>
				</div>

				{/* Tabs */}
				<Tabs defaultValue='barber-offer' className='w-full flex flex-col gap-2'>
					<TabsList className='w-full bg-white/15 rounded-none h-full'>
						<TabsTrigger
							value='barber-offer'
							className='flex-1 data-[state=active]:text-white data-[state=active]:bg-transparent data-[state=active]:border-b-2 rounded-none'
						>
							Offer from Barber
						</TabsTrigger>
						<TabsTrigger
							value='your-offer'
							className='flex-1 data-[state=active]:text-white data-[state=active]:bg-transparent data-[state=active]:border-b-2 rounded-none'
						>
							Your Offer
						</TabsTrigger>
					</TabsList>

					{/* Barber Offers Tab */}
					<TabsContent value='barber-offer'>
						<div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
							{barberOffers.map((offer, index) => (
								<div
									key={offer.id}
									className={`py-4 px-3 text-black font-medium text-xs rounded-lg cursor-pointer ${
										selectedBarberOffer === index ? 'bg-blue-500 text-white' : 'bg-gray-200'
									}`}
									onClick={() => toggleBarberOffer(index)}
								>
									{offer.code}
								</div>
							))}
						</div>
					</TabsContent>

					{/* User Offers Tab */}
					<TabsContent value='your-offer'>
						<div className='space-y-3 mb-6'>
							<div className='flex gap-2'>
								<Input
									placeholder='Enter promo code'
									className='bg-white/15 border-0 text-white placeholder:text-gray-400'
								/>
								<Button className='bg-blue-500 hover:bg-blue-600 text-white px-6'>Apply</Button>
							</div>
							<Button variant='outline' className='w-full bg-gray-200 hover:bg-gray-300 text-black gap-2'>
								<QrCode className='w-5 h-5' />
								Scan QR code
							</Button>
						</div>

						<div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
							{userOffers.map((offer, index) => (
								<div
									key={offer.id}
									className={`py-4 px-3 text-black font-medium text-xs rounded-lg cursor-pointer ${
										selectedUserOffer === index ? 'bg-blue-500 text-white' : 'bg-gray-200'
									}`}
									onClick={() => toggleUserOffer(index)}
								>
									{offer.name}
								</div>
							))}
						</div>
					</TabsContent>
				</Tabs>

				<div>
					<Button
						className='w-full bg-[#F5A524] hover:bg-[#F5A524]/90 text-black font-semibold py-6 text-lg'
						onClick={saveOffersToStorage}
					>
						Apply Offer
					</Button>
				</div>
			</div>
		</div>
	);
}

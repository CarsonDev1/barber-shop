'use client';

import { useState } from 'react';
import { ArrowLeft, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { toast } from 'sonner';

interface OffersProps {
	onApply: (offers: { id: number; name: string }[]) => void; // Cập nhật hàm onApply để truyền dữ liệu
}

export default function Offers({ onApply }: OffersProps) {
	const barberOffers = Array.from({ length: 8 }, (_, index) => ({
		id: index,
		name: 'Giảm 20% cho tất cả dịch vụ từ Barber',
	}));

	const userOffers = Array.from({ length: 6 }, (_, index) => ({
		id: index,
		name: 'Ưu đãi riêng của bạn: Giảm giá 15%',
	}));

	const [selectedBarberOffers, setSelectedBarberOffers] = useState<Set<number>>(new Set());
	const [selectedUserOffers, setSelectedUserOffers] = useState<Set<number>>(new Set());

	// Toggle selection for Barber Offers
	const toggleBarberOffer = (index: number) => {
		const updatedOffers = new Set(selectedBarberOffers);
		if (updatedOffers.has(index)) {
			updatedOffers.delete(index);
		} else {
			updatedOffers.add(index);
		}
		setSelectedBarberOffers(updatedOffers);
	};

	// Toggle selection for User Offers
	const toggleUserOffer = (index: number) => {
		const updatedOffers = new Set(selectedUserOffers);
		if (updatedOffers.has(index)) {
			updatedOffers.delete(index);
		} else {
			updatedOffers.add(index);
		}
		setSelectedUserOffers(updatedOffers);
	};

	const saveOffersToStorage = () => {
		const allSelectedOffers = [
			...Array.from(selectedBarberOffers).map((index) => ({
				id: barberOffers[index].id,
				name: barberOffers[index].name,
			})),
			...Array.from(selectedUserOffers).map((index) => ({
				id: userOffers[index].id,
				name: userOffers[index].name,
			})),
		];

		localStorage.setItem('selectedOffers', JSON.stringify(allSelectedOffers));
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
										selectedBarberOffers.has(index) ? 'bg-blue-500 text-white' : 'bg-gray-200'
									}`}
									onClick={() => toggleBarberOffer(index)}
								>
									{offer.name}
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
										selectedUserOffers.has(index) ? 'bg-blue-500 text-white' : 'bg-gray-200'
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

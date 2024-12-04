'use client';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronDown, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import BackGroundRoot from '@/public/root/background-root.png';
import { useQuery } from '@tanstack/react-query';
import { CustomersResponse } from '@/types/Customer.type';
import { getStaffs } from '@/app/api/customer/getStaffs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
		<div className='min-h-screen bg-slate-950 text-white p-4 space-y-6 !pt-24 relative'>
			<Image
				src={BackGroundRoot}
				alt='Barber Shop Logo'
				width={1820}
				height={1200}
				className='absolute inset-0 w-full object-cover h-full'
			/>
			<div className='absolute inset-0 bg-black bg-opacity-50 h-screen'></div>
			<div className='container-lg'>
				{/* Stylist Grid */}
				<div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
					{stylists.map((stylist) => (
						<Card
							key={stylist.id}
							className='group white backdrop-blur-sm border-gray-800 hover:border-orange-500 transition-colors'
						>
							<CardContent className='p-2'>
								<div className='relative h-48'>
									<Image src={stylist.avatar.thumbUrl} alt='avatar' fill className='object-contain' />
									<span className='absolute top-2 right-2 bg-black/70 text-white px-2 py-1 text-xs font-bold rounded'>
										{stylist.role}
									</span>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
}

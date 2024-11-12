'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronDown, ArrowLeft, Clock, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import BackGroundRoot from '@/public/root/background-root.png';
import ServiceImage from '@/public/root/service-img.png';
import { Dialog, DialogTrigger, DialogContent, DialogOverlay } from '@/components/ui/dialog';
import Offers from '@/app/components/offers';
import { toast } from 'sonner';

interface Service {
	id: number;
	title: string;
	price: number;
	image: string;
}

export default function Service() {
	const [selectedServices, setSelectedServices] = useState<Set<number>>(new Set());
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [selectedOffers, setSelectedOffers] = useState<{ id: number; name: string }[]>([]);

	const services: Service[] = Array.from({ length: 12 }, (_, i) => ({
		id: i + 1,
		title: 'Combo fit step hottttt',
		price: 120000,
		image: '/placeholder.svg?height=100&width=150',
	}));

	const toggleService = (id: number) => {
		const newSelected = new Set(selectedServices);
		if (newSelected.has(id)) {
			newSelected.delete(id);
		} else {
			newSelected.add(id);
		}
		setSelectedServices(newSelected);
	};

	const handleApplyOffers = (offers: { id: number; name: string }[]) => {
		setIsDialogOpen(false);
		setSelectedOffers(offers);
		toast.success('Offers have been saved successfully!', {
			style: { color: '#4CAF50' },
			position: 'top-right',
			action: {
				label: 'Undo',
				onClick: () => {},
			},
		});
	};

	// // Load offers from localStorage when the dialog closes
	// useEffect(() => {
	// 	const storedUserOffers = JSON.parse(localStorage.getItem('selectedOffers') || '[]');
	// 	setSelectedOffers([...storedUserOffers]);
	// }, [isDialogOpen]);

	return (
		<div className='bg-slate-950 relative'>
			<Image
				src={BackGroundRoot}
				alt='Barber Shop Logo'
				width={1820}
				height={1200}
				className='absolute inset-0 w-full object-cover'
			/>
			<div className='relative container-lg !pt-20'>
				{/* Header */}
				<div className='relative p-4 space-y-4 z-10 max-w-xl mx-auto'>
					<div className='flex items-center justify-between gap-4 text-white'>
						<ArrowLeft className='w-6 h-6' />
						<span className=''>Select service(s = 1000d)</span>
						<span></span>
					</div>
					<Input type='search' placeholder='Search service, service combo...' className='bg-white' />
				</div>

				{/* Service Grid */}
				<div className='p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10'>
					{services.map((service) => (
						<Card
							key={service.id}
							className='w-full max-w-sm overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 backdrop-blur-xl border border-gray-200/20 dark:border-gray-800/20'
						>
							<CardContent className='p-0'>
								<div className='relative aspect-[16/9] overflow-hidden'>
									<Image
										src={ServiceImage}
										alt='service'
										width={1000}
										height={800}
										className='object-cover transition-transform duration-300 hover:scale-105 relative z-10 h-full'
									/>
									<div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-20' />
									<div className='absolute bottom-3 left-3 right-3 z-30'>
										<div className='flex items-center gap-2 text-white'>
											<Clock className='h-4 w-4' />
											<span className='text-sm font-medium'>45 minutes</span>
										</div>
									</div>
								</div>
								<div className='space-y-4 p-4'>
									<div>
										<h3 className='font-semibold text-xl leading-tight mb-1'>{service.title}</h3>
										<p className='text-sm text-muted-foreground'>Combo Cut and Massage Shampoo</p>
									</div>
									<div className='inline-block'>
										<span className='inline-flex items-center rounded-full bg-amber-100 dark:bg-amber-900/30 px-3 py-1 text-sm font-medium text-amber-800 dark:text-amber-500'>
											Same price all week
										</span>
									</div>
									<div className='space-y-1'>
										<div className='text-sm font-medium text-muted-foreground'>Standard price</div>
										<div className='text-2xl font-bold'>{service.price.toLocaleString()}K</div>
									</div>
								</div>
							</CardContent>
							<CardFooter className='p-5 pt-0'>
								<Button
									className='w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors'
									size='lg'
									onClick={() => toggleService(service.id)}
								>
									{selectedServices.has(service.id) ? 'Remove service' : 'Add service'}
								</Button>
							</CardFooter>
						</Card>
					))}
				</div>

				{/* View More Button */}
				<div className='flex justify-center pb-24'>
					<Button variant='ghost' className='text-white'>
						View more
						<ChevronDown className='ml-2 h-4 w-4' />
					</Button>
				</div>

				{/* Bottom Bar */}
				<div className='fixed max-w-4xl mx-auto bottom-0 left-0 right-0 bg-[#e4e3e3] p-4 shadow-xl rounded-md'>
					<div className='container-lg mx-auto flex items-center justify-between flex-col'>
						<div className='space-y-1 w-full'>
							<div className='flex flex-col gap-2'>
								<div className='flex items-center justify-between'>
									<div className='text-sm text-yellow-500'>Your benefits</div>
									<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
										<DialogTrigger asChild>
											<Button variant='link' className='flex items-center gap-2 text-blue-600'>
												Select offer
												<ChevronRight />
											</Button>
										</DialogTrigger>
										<DialogOverlay />
										<DialogContent className='bg-black/35 border text-white !max-w-xl'>
											<Offers onApply={handleApplyOffers} />
										</DialogContent>
									</Dialog>
								</div>
								<div className='flex justify-between'>
									<div>
										<div className='text-lg'>{selectedServices.size} services selected</div>
										<div className='text-xl flex items-center gap-2'>
											Total payment:{' '}
											<span className='text-yellow-500 text-2xl font-semibold'>
												{(selectedServices.size * 120000).toLocaleString()}K
											</span>
										</div>
										{/* list offer */}
										<div className='text-lg font-semibold'>Selected Offers:</div>
										<ul className='space-y-2'>
											{selectedOffers.map((offer) => (
												<li key={offer.id} className='text-sm text-gray-700 dark:text-gray-300'>
													{offer.name}
												</li>
											))}
										</ul>
									</div>
									<Button
										size='lg'
										className='bg-blue-600 hover:bg-blue-700 text-white'
										disabled={selectedServices.size === 0}
									>
										Finished
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

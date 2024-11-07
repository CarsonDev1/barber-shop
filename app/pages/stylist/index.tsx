import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronDown, MessageSquare, Star } from 'lucide-react';
import Image from 'next/image';
import BackGroundRoot from '@/public/root/background-root.png';
import StylistImage from '@/public/root/service-img.png';

interface StylistProps {
	id: number;
	name: string;
	rating: number;
	image: string;
}

export default function StylistPage() {
	const stylists: StylistProps[] = Array.from({ length: 6 }, (_, i) => ({
		id: i + 1,
		name: 'Xinh Đỗ',
		rating: Math.floor(Math.random() * 5) + 1,
		image: '/placeholder.svg?height=200&width=300',
	}));

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
				{/* Header */}
				<div className='flex items-center justify-center gap-4 mb-6'>
					<Button variant='ghost' size='icon' className='text-white'>
						<ArrowLeft className='h-6 w-6' />
					</Button>
					<h1 className='text-xl font-semibold'>CHOSE STYLIST</h1>
				</div>

				{/* Stylist Grid */}
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
					{stylists.map((stylist) => (
						<Card
							key={stylist.id}
							className='group white backdrop-blur-sm border-gray-800 hover:border-orange-500 transition-colors'
						>
							<CardContent className='p-3'>
								<div className='relative aspect-[16/9] mb-3 overflow-hidden rounded-md'>
									<Image
										src={StylistImage}
										alt='stylist'
										fill
										className='object-cover transition-transform duration-300 group-hover:scale-105'
									/>
								</div>
								<div className='flex items-center justify-between'>
									<span className='font-medium'>{stylist.name}</span>
									<MessageSquare className='h-5 w-5 text-gray-400' />
								</div>
								<div className='flex items-center gap-1 mt-1'>
									{Array.from({ length: 5 }).map((_, index) => (
										<Star
											key={index}
											className={`h-4 w-4 ${
												index < stylist.rating
													? 'text-yellow-400 fill-yellow-400'
													: 'text-gray-400'
											}`}
										/>
									))}
								</div>
							</CardContent>
						</Card>
					))}
				</div>

				{/* View More Button */}
				<div className='flex justify-center pt-4'>
					<Button variant='ghost' className='text-white'>
						View more
						<ChevronDown className='ml-2 h-4 w-4' />
					</Button>
				</div>
			</div>
		</div>
	);
}

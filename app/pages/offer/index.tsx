import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BackGroundRoot from '@/public/root/background-root.png';
import Link from 'next/link';
import Image from 'next/image';

export default function OfferPage() {
	const offers = Array(8).fill('giảm 20% cho tất cả dịch vụ');

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
									className='bg-gray-200 rounded-lg p-4 text-black font-medium hover:bg-gray-300 transition-colors cursor-pointer'
								>
									{offer}
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

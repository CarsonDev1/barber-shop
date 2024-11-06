import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';
import Link from 'next/link';
import BackGroundRoot from '@/public/root/background-root.png';
import Image from 'next/image';

export default function Banner() {
	return (
		<div className='relative h-full md:min-h-screen flex items-center justify-center bg-[#0a0a0a]'>
			<Image
				src={BackGroundRoot}
				alt='Barber Shop Logo'
				width={1820}
				height={1200}
				className='absolute inset-0 w-full h-full object-cover'
			/>
			<div className='absolute inset-0 bg-black bg-opacity-50'></div>

			{/* Content */}
			<div className='relative z-10 container mx-auto px-4 py-20 text-center'>
				<div className='max-w-3xl mx-auto space-y-8'>
					<h1 className='text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight'>
						The best hair cutting system in Da Nang.
					</h1>
					<p className='text-lg md:text-xl text-gray-300'>
						Choose us because we will help you change your appearance
					</p>
					<div className='flex flex-col items-center gap-6'>
						<Link href='/login'>
							<Button className='h-12 px-8 text-lg font-semibold bg-[#F5A524] hover:bg-[#F5A524]/90 text-black'>
								Log in
							</Button>
						</Link>
						<Button className='bg-white rounded-full h-12 py-2 px-4 flex items-center gap-2 shadow-lg hover:bg-gray-200'>
							<Bot className='w-6 h-6 text-[#F5A524]' />
							<span className='text-black font-semibold'>AI Recommend</span>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

'use client';
import { Suspense, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';
import Link from 'next/link';
import BackGroundRoot from '@/public/root/background-root.png';
import { useTranslation } from 'next-i18next';
import { Input } from '@/components/ui/input';
import AI from '@/public/root/btn-ai.png';
import Image from 'next/image';
import { useAuth } from '@/context/AuthProvider';

export default function Banner() {
	const { t } = useTranslation('common');
	const [phone, setPhone] = useState('');
	const { dataProfile } = useAuth();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
	};

	return (
		<Suspense fallback={<div>Loading...</div>}>
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
						<h1 className='text-4xl md:text-5xl lg:text-6xl font-bold text-white !leading-tight'>
							{t('bannerTitle')}
						</h1>
						<p className='text-lg md:text-xl text-gray-300'>{t('bannerSubtitle')}</p>

						{dataProfile ? (
							<div className='w-full mx-auto px-4'>
								{/* Booking Card */}
								<div className='bg-gray-600/90 backdrop-blur-sm rounded-3xl p-6 mb-6'>
									<div className='mb-4'>
										<h2 className='text-2xl md:text-3xl font-bold text-white mb-1'>
											{t('letBook')}
										</h2>
										<p className='text-sm text-gray-200'>{t('payAffer')}</p>
									</div>

									<form onSubmit={handleSubmit} className='flex gap-3'>
										<Input
											type='tel'
											placeholder='Enter Phone number.....'
											value={phone}
											onChange={(e) => setPhone(e.target.value)}
											className='flex-1 h-12 bg-white text-black placeholder:text-gray-500'
										/>
										<Button
											type='submit'
											className='h-12 px-6 bg-[#F5A524] hover:bg-[#F5A524]/90 text-black font-medium'
										>
											BOOK NOW
										</Button>
									</form>
								</div>

								{/* AI Recommend Button */}
								<button className='mx-auto flex items-center gap-2 bg-white rounded-md pl-6 pr-4 py-3 shadow-lg hover:shadow-xl transition-shadow'>
									<span className='font-medium'>{t('hairRecommend')}</span>
									<div className='relative'>
										<Image src={AI} alt='btn-chat' className='size-10' />
									</div>
								</button>
							</div>
						) : (
							<div className='flex justify-center items-center gap-6'>
								<Link href='/login'>
									<Button className='h-12 px-8 text-lg font-semibold bg-[#F5A524] hover:bg-[#F5A524]/90 text-black'>
										{t('login')}
									</Button>
								</Link>
								<Button className='bg-white h-12 py-2 px-4 flex items-center gap-2 shadow-lg hover:bg-gray-200'>
									<Bot className='w-6 h-6 text-[#F5A524]' />
									<span className='text-black font-semibold'>{t('aiRecommend')}</span>
								</Button>
							</div>
						)}
					</div>
				</div>
			</div>
		</Suspense>
	);
}

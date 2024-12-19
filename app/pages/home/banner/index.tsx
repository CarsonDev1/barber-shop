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
					</div>
				</div>
			</div>
		</Suspense>
	);
}

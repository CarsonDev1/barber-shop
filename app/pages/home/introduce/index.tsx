import Image from 'next/image';
import IntroImage from '@/public/home/introduce-img.png';
import { useTranslation } from 'react-i18next';

export default function Introduce() {
	const { t } = useTranslation('common');
	return (
		<div className='bg-[#0a0a0a] sec-com'>
			<div className='container-lg'>
				<div className='flex flex-col md:flex-row gap-8 md:gap-24 lg:gap-32 items-center'>
					{/* Images Grid */}
					<div className='w-full md:w-1/2'>
						<Image
							src={IntroImage}
							alt="Barber cutting client's hair"
							width={600}
							height={400}
							className='w-full h-auto rounded-lg object-cover'
						/>
					</div>

					{/* Content */}
					<div className='space-y-6 w-full md:w-1/2'>
						<h2 className='text-4xl md:text-5xl font-bold text-white'>{t('introduce')}</h2>
						<p className='text-gray-300 text-lg leading-relaxed'>{t('introduceHome')}</p>
						<div className='text-[#F5A524] text-lg font-medium'>{t('introduceTime')}</div>
					</div>
				</div>
			</div>
		</div>
	);
}

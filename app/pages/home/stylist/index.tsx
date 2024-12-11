import Image from 'next/image';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { CustomersResponse } from '@/types/Customer.type';
import { useQuery } from '@tanstack/react-query';
import { getStaffs } from '@/app/api/customer/getStaffs';

export default function StyleList() {
	const {
		data: staffData,
		isLoading: isLoadingStaffs,
		error: errorStaffs,
	} = useQuery<CustomersResponse>({
		queryKey: ['dataStaffs'],
		queryFn: getStaffs,
	});

	const stylists = staffData?.payload || [];

	const { t } = useTranslation('common');

	return (
		<div className='bg-[#292828] sec-com relative'>
			{/* Vertical "STYLISTS" text */}
			<div className='hidden lg:block absolute left-8 top-1/2 -translate-y-1/2 transform -rotate-90 origin-center'>
				<span className='text-[#4A5568] text-6xl font-bold tracking-wider'>{t('stylist')}</span>
			</div>

			<div className='container-lg'>
				<h2 className='text-4xl md:text-5xl lg:text-6xl font-bold text-[#4A5568] text-center mb-16'>
					{t('topStylistMonth')}
				</h2>

				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto'>
					{stylists.slice(0, 3).map((stylist, index) => (
						<div key={index} className='relative group'>
							<div className='aspect-[4/5] relative overflow-hidden rounded-lg'>
								<Image src={stylist.avatar.thumbUrl} alt='stylist' fill className='object-contain' />
								{/* Gradient overlay */}
								<div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />
							</div>

							{/* Stylist name */}
							<div className='absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-6 items-center'>
								<h3 className='text-[#F5A524] text-xl font-medium mb-4 text-center'>{stylist.name}</h3>

								{/* Social icons */}
								<div className='flex items-center gap-4'>
									<Link href='' className='text-white hover:text-[#F5A524] transition-colors'>
										<Instagram className='w-5 h-5' />
									</Link>
									<Link href='' className='text-white hover:text-[#F5A524] transition-colors'>
										<Facebook className='w-5 h-5' />
									</Link>
									<Link href='' className='text-white hover:text-[#F5A524] transition-colors'>
										<Twitter className='w-5 h-5' />
									</Link>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

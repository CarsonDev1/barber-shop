import { getServices } from '@/app/api/service/getServices';
import { Card, CardContent } from '@/components/ui/card';
import Feature01 from '@/public/home/feature-01.png';
import Feature02 from '@/public/home/feature-02.png';
import Feature03 from '@/public/home/feature-03.png';
import { ServiceResponse } from '@/types/Service.type';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

export default function Feature() {
	const { t } = useTranslation('common');

	const {
		data: servicesData,
		isLoading: isLoadingServices,
		error: errorServices,
	} = useQuery<ServiceResponse>({
		queryKey: ['dataServices'],
		queryFn: getServices,
	});

	const services = servicesData?.payload || [];

	return (
		<div className='bg-white sec-com'>
			<div className='container-lg'>
				<div className='text-center max-w-2xl mx-auto mb-12'>
					<h2 className='text-3xl md:text-4xl font-bold mb-4'>{t('featuredService')}</h2>
					<p className='text-gray-600'>{t('serviceDes')}</p>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
					{services.slice(0, 3).map((service) => (
						<Card key={service.name} className='overflow-hidden group'>
							<CardContent className='p-0 relative'>
								<div className='aspect-square relative overflow-hidden'>
									<Image
										src={service?.images[0]?.thumbUrl}
										alt={service.name}
										fill
										className={`object-cover grayscale-0 transition-transform duration-500 group-hover:scale-105`}
									/>
								</div>
								<div className='p-4 flex justify-between items-center'>
									<h3 className='font-semibold text-lg line-clamp-1 w-40'>{service.name}</h3>
									<span className='bg-black text-white px-3 py-1 rounded-full text-sm'>
										{service.price.toLocaleString()} VNĐ
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

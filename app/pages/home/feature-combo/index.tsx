import { getCombos } from '@/app/api/combo/getCombo';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

export default function FeatureCombo() {
	const { t } = useTranslation('common');

	const {
		data: combosData,
		isLoading: isLoadingCombos,
		error: errorCombos,
	} = useQuery({
		queryKey: ['dataCombos'],
		queryFn: getCombos,
	});

	const services = combosData?.payload || [];

	return (
		<div className='bg-black sec-com text-white'>
			<div className='container-lg'>
				<div className='text-center max-w-2xl mx-auto mb-12'>
					<h2 className='text-3xl md:text-4xl font-bold mb-4'>{t('featuredCombo')}</h2>
					<p className=''>{t('serviceDes')}</p>
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
								<div className='p-4 flex flex-col justify-between items-center gap-2'>
									<h3 className='font-semibold text-lg line-clamp-1 w-44'>{service.name}</h3>
									<span className='bg-black text-white px-3 py-1 rounded-full text-sm'>
										{service.price.toLocaleString()} VNĐ
									</span>
									<p className='line-clamp-2'>{service.description}</p>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
}

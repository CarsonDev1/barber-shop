import { Card, CardContent } from '@/components/ui/card';
import Feature01 from '@/public/home/feature-01.png';
import Feature02 from '@/public/home/feature-02.png';
import Feature03 from '@/public/home/feature-03.png';
import Image from 'next/image';

export default function Feature() {
	const services = [
		{
			name: '10 Step Haircut',
			price: '100k',
			image: Feature01,
			className: 'grayscale',
		},
		{
			name: 'Chemical',
			price: '150k',
			image: Feature02,
			className: '',
		},
		{
			name: 'Ear cleaning',
			price: '20k',
			image: Feature03,
			className: 'brightness-75',
		},
	];

	return (
		<div className='bg-white sec-com'>
			<div className='container-lg'>
				<div className='text-center max-w-2xl mx-auto mb-12'>
					<h2 className='text-3xl md:text-4xl font-bold mb-4'>FEATURED SERVICES</h2>
					<p className='text-gray-600'>
						Our outstanding services will satisfy everyone and these are the most used services at Barbaer.
					</p>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
					{services.map((service) => (
						<Card key={service.name} className='overflow-hidden group'>
							<CardContent className='p-0 relative'>
								<div className='aspect-square relative overflow-hidden'>
									<Image
										src={service.image}
										alt={service.name}
										fill
										className={`object-cover grayscale-0 transition-transform duration-500 group-hover:scale-105 ${service.className}`}
									/>
								</div>
								<div className='p-4 flex justify-between items-center'>
									<h3 className='font-semibold text-lg'>{service.name}</h3>
									<span className='bg-black text-white px-3 py-1 rounded-full text-sm'>
										{service.price}
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

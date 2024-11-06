import Image from 'next/image';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import StyleList01 from '@/public/home/stylelist-01.png';
import StyleList02 from '@/public/home/stylelist-02.png';
import StyleList03 from '@/public/home/stylelist-03.png';
import Link from 'next/link';

export default function StyleList() {
	const stylists = [
		{
			name: '도반신',
			image: StyleList01,
			social: {
				instagram: '#',
				facebook: '#',
				twitter: '#',
			},
		},
		{
			name: 'Văn Sinh',
			image: StyleList02,
			social: {
				instagram: '#',
				facebook: '#',
				twitter: '#',
			},
		},
		{
			name: 'Văn Sinh',
			image: StyleList03,
			social: {
				instagram: '#',
				facebook: '#',
				twitter: '#',
			},
		},
	];

	return (
		<div className='bg-[#0a0a0a] sec-com relative'>
			{/* Vertical "STYLISTS" text */}
			<div className='hidden lg:block absolute left-8 top-1/2 -translate-y-1/2 transform -rotate-90 origin-center'>
				<span className='text-[#4A5568] text-6xl font-bold tracking-wider'>STYLISTS</span>
			</div>

			<div className='container-lg'>
				<h2 className='text-4xl md:text-5xl lg:text-6xl font-bold text-[#4A5568] text-center mb-16'>
					TOP STYLIST OF THE MONTH
				</h2>

				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto'>
					{stylists.map((stylist, index) => (
						<div key={index} className='relative group'>
							<div className='aspect-[4/5] relative overflow-hidden rounded-lg'>
								<Image src={stylist.image} alt={stylist.name} fill className='object-cover' />
								{/* Gradient overlay */}
								<div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />
							</div>

							{/* Stylist name */}
							<div className='absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-6 items-center'>
								<h3 className='text-[#F5A524] text-xl font-medium mb-4 text-center'>{stylist.name}</h3>

								{/* Social icons */}
								<div className='flex items-center gap-4'>
									<Link
										href={stylist.social.instagram}
										className='text-white hover:text-[#F5A524] transition-colors'
									>
										<Instagram className='w-5 h-5' />
									</Link>
									<Link
										href={stylist.social.facebook}
										className='text-white hover:text-[#F5A524] transition-colors'
									>
										<Facebook className='w-5 h-5' />
									</Link>
									<Link
										href={stylist.social.twitter}
										className='text-white hover:text-[#F5A524] transition-colors'
									>
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

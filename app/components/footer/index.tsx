'use client';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Facebook, Instagram, Mail, PhoneCall } from 'lucide-react';

function Footer() {
	const { t } = useTranslation('common');
	const [isCameraOn, setIsCameraOn] = useState(false);
	const videoRef = useRef(null);

	const address = [
		{
			location:
				'Toà nhà Clubhouse, Khu K5-5, Khu đô thị Công nghệ FPT, Phường Hoà Hải, Quận Ngũ Hành Sơn, Thành phố Đà Nẵng.',
			phone: '0398485185',
		},
	];

	return (
		<footer className='bg-gray-800 text-white py-12'>
			<div className='container-lg grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
				{/* Address Section */}
				<div>
					<h3 className='text-lg font-semibold mb-4'>{t('Address')}</h3>
					<ul className='space-y-4'>
						{address.map((item, index) => (
							<li key={index} className='flex flex-col space-y-2'>
								<span className='flex items-center gap-2'>
									<MapPin className='text-yellow-400' />
									<span>{item.location}</span>
								</span>
								<span className='flex items-center gap-2'>
									<Phone className='text-green-400' />
									<a href={`tel:${item.phone}`} className='hover:text-yellow-400'>
										{item.phone}
									</a>
								</span>
							</li>
						))}
					</ul>
				</div>

				{/* Opening Hours */}
				<div>
					<h3 className='text-lg font-semibold mb-4'>{t('Opening Hours')}</h3>
					<p className='text-gray-300 leading-relaxed'>
						{t(
							'From 8:00 - 22:00 all days of the week (except holidays and Tet days). Please arrive 15 minutes before the scheduled time.'
						)}
					</p>
				</div>

				{/* Social Links */}
				<div>
					<h3 className='text-lg font-semibold mb-4'>{t('LINK WITH US')}</h3>
					<div className='flex space-x-4'>
						<a
							href='https://facebook.com'
							className='p-2 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors'
						>
							<Facebook className='text-white' size={24} />
						</a>
						<a
							href='https://instagram.com'
							className='p-2 rounded-full bg-pink-500 hover:bg-pink-600 transition-colors'
						>
							<Instagram className='text-white' size={24} />
						</a>
					</div>
				</div>

				{/* Contact Info */}
				<div>
					<h3 className='text-lg font-semibold mb-4'>{t('COMMUNICATE')}</h3>
					<div className='space-y-4'>
						<div className='flex items-center gap-2'>
							<Mail className='text-red-400' />
							<span>{t('Mail')}: sinhlumia12@gmail.com</span>
						</div>
						<div className='flex items-center gap-2'>
							<PhoneCall className='text-blue-400' />
							<span>{t('Phone')}: 0398485185</span>
						</div>
					</div>
				</div>
			</div>

			{/* Footer Bottom */}
			<div className='mt-8 border-t border-gray-700 pt-4 text-center text-gray-400'>
				<p>&copy; {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
			</div>
		</footer>
	);
}

export default Footer;

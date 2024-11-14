'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, ChevronRight, Scissors, Upload } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';
import BackGroundRoot from '@/public/root/background-root.png';
import Face from '@/public/root/face.png';
import Link from 'next/link';
import { createBook } from '@/app/apis/booking/createBook';
import { useRouter } from 'next/navigation';

interface Image {
	id: number;
	name: string;
	url: string;
	thumbUrl: string;
	mediumUrl: string;
	createdAt: string;
	updatedAt: string;
}

interface Service {
	id: number;
	name: string;
	description: string;
	price: number;
	estimateTime: number;
	images: Image[];
	createdAt: string;
	updatedAt: string;
}

interface Combo {
	id: number;
	name: string;
	description: string;
	price: number;
	estimateTime: number;
	images: Image[];
	services: Service[];
}

interface Stylist {
	id: number;
	name: string;
	role: string;
	avatar: Image;
}

interface BookingData {
	selectedCombos: Combo[];
	totalPayment: number;
	selectedStylist?: Stylist;
}

export default function BookingForm() {
	const [date, setDate] = useState<Date | undefined>(new Date());
	const [selectedTime, setSelectedTime] = useState<string | null>(null);
	const [bookingData, setBookingData] = useState<BookingData | null>(null);
	const router = useRouter();

	useEffect(() => {
		const storedData = localStorage.getItem('bookingData');
		if (storedData) {
			try {
				const parsedData: BookingData = JSON.parse(storedData);
				setBookingData(parsedData);
			} catch (error) {
				console.error("Failed to parse 'bookingData' from localStorage", error);
			}
		}
	}, []);

	const timeSlots = [
		'7h20',
		'8h40',
		'10h20',
		'12h20',
		'13h40',
		'15h20',
		'7h40',
		'9h00',
		'10h40',
		'12h40',
		'14h00',
		'15h40',
		'8h00',
		'9h20',
		'11h00',
		'13h00',
		'14h20',
		'16h00',
		'8h20',
		'10h00',
		'12h00',
		'13h20',
		'15h00',
		'16h20',
	];

	const handleBooking = async () => {
		if (!bookingData || !date || !selectedTime) {
			alert('Please select a date, time, and stylist.');
			return;
		}

		const staff_id: any = bookingData.selectedStylist?.id;
		const comboIds = bookingData.selectedCombos.map((combo) => combo.id);
		const serviceIds = bookingData.selectedCombos.flatMap((combo) => combo.services.map((service) => service.id));
		const note = 'Customer requested booking';

		// Parse `selectedTime` into hours and minutes
		const [hours, minutes] = selectedTime.split('h').map(Number);
		const startDate = new Date(date);
		startDate.setHours(hours);
		startDate.setMinutes(minutes);

		// Format `startTime` as "YYYY-MM-DD HH:mm:ss"
		const startTime = format(startDate, 'yyyy-MM-dd HH:mm:ss');

		try {
			const response = await createBook({
				staff_id,
				note,
				startTime,
				serviceIds,
				comboIds,
			});
			localStorage.removeItem('bookingData');
			setBookingData(null);
			router.push('/booking-success');
		} catch (error) {
			alert('An error occurred while booking. Please try again.');
		}
	};

	return (
		<div className='!overflow-hidden bg-black h-full sec-com'>
			<div className='relative pt-10'>
				<Image
					src={BackGroundRoot}
					alt='Barber Shop Logo'
					width={1820}
					height={1200}
					className='absolute inset-0 w-full object-cover h-screen'
				/>
				<div className='absolute inset-0 bg-black bg-opacity-50 h-screen'></div>
				<div className='w-full max-w-xl mx-auto p-4 sec-com'>
					<div className='bg-white/10 backdrop-blur-sm rounded-3xl p-6 space-y-6'>
						<div className='space-y-4'>
							<h2 className='text-xl text-white font-semibold'>Choose service</h2>
							<Link href='/service'>
								<Button className='flex items-center justify-between w-full bg-white hover:bg-gray-300'>
									<div className='flex items-center'>
										<Scissors className='mr-2 h-4 w-4 text-gray-900' />
										<span className='text-gray-900'>See all attractive services..</span>
									</div>
									<ChevronRight className='ml-auto h-4 w-4 text-gray-900' />
								</Button>
							</Link>
						</div>

						{/* Display selected combos below the button */}
						{bookingData && bookingData.selectedCombos.length > 0 && (
							<div className='mt-4 p-4 bg-white/20 rounded-lg space-y-2'>
								<h3 className='text-lg font-semibold text-white'>Selected Combos</h3>
								<div className='space-y-1'>
									{bookingData.selectedCombos.map((combo) => (
										<div key={combo.id} className='flex justify-between text-white'>
											<span>{combo.name}</span>
											<span>{combo.price.toLocaleString()}₫</span>
										</div>
									))}
								</div>
								<div className='flex justify-between text-white font-semibold border-t border-gray-400 pt-2 mt-2'>
									<span>Total Payment:</span>
									<span>{bookingData.totalPayment.toLocaleString()}₫</span>
								</div>
							</div>
						)}

						<div className='space-y-4'>
							<h2 className='text-xl text-white font-semibold'>Choose date, time & stylist</h2>
							<div className='flex gap-2'>
								<Link href='/stylist'>
									<Button variant='outline' className='flex-1 bg-white text-black'>
										<Image src={Face} alt='face' className='mr-2 h-7 w-6' />
										Choose stylist
										<ChevronRight className='ml-auto h-4 w-4' />
									</Button>
								</Link>
								<Button variant='outline' className='flex-1 bg-white text-black'>
									<Upload className='mr-2 h-4 w-4' />
									Upload my hairstyle
								</Button>
							</div>
							{bookingData?.selectedStylist && (
								<div className='bg-white/20 rounded-lg p-4 space-y-2'>
									<h3 className='text-lg font-semibold text-white'>Selected Stylist</h3>
									<div className='flex items-center gap-4'>
										<Image
											src={bookingData.selectedStylist.avatar.thumbUrl}
											alt={bookingData.selectedStylist.name}
											width={40}
											height={40}
											className='rounded-full'
										/>
										<div>
											<div className='text-white font-medium'>
												{bookingData.selectedStylist.name}
											</div>
											<div className='text-gray-300 text-sm'>
												{bookingData.selectedStylist.role}
											</div>
										</div>
									</div>
								</div>
							)}

							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant='outline'
										className='w-full justify-start text-left font-normal bg-white text-black'
									>
										<CalendarIcon className='mr-2 h-4 w-4' />
										{date ? format(date, 'PPP') : <span>Pick a date</span>}
									</Button>
								</PopoverTrigger>
								<PopoverContent className='w-auto p-0' align='start'>
									<Calendar mode='single' selected={date} onSelect={setDate} initialFocus />
								</PopoverContent>
							</Popover>

							<div className='grid grid-cols-4 sm:grid-cols-6 gap-2'>
								{timeSlots.map((time) => (
									<Button
										key={time}
										variant='outline'
										className={`bg-white text-black ${
											selectedTime === time
												? 'bg-[#F0B35B] text-white ring-2 ring-black hover:bg-[#F0B35B] hover:text-white'
												: ''
										}`}
										onClick={() => setSelectedTime(time)}
									>
										{time}
									</Button>
								))}
							</div>
						</div>
					</div>

					<Button
						className='w-full mt-6 bg-[#F5A524] hover:bg-[#F5A524]/90 text-black font-semibold py-6 text-lg'
						onClick={handleBooking}
					>
						BOOK
					</Button>
				</div>
			</div>
		</div>
	);
}

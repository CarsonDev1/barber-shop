'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, ChevronRight, Scissors, Upload } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';
import BackGroundRoot from '@/public/root/background-root.png';
import Face from '@/public/root/face.png';
import Link from 'next/link';

export default function BookingForm() {
	const [date, setDate] = useState<Date | undefined>(new Date());
	const [selectedTime, setSelectedTime] = useState<string | null>(null);

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

					<Button className='w-full mt-6 bg-[#F5A524] hover:bg-[#F5A524]/90 text-black font-semibold py-6 text-lg'>
						BOOK
					</Button>
				</div>
			</div>
		</div>
	);
}

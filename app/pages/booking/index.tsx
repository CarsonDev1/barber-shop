'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, ChevronRight, Scissors, Upload } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';
import BackGroundRoot from '@/public/root/background-root.png';

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
		<div className='sec-com'>
			<div className='relative h-full md:min-h-dvh'>
				<Image
					src={BackGroundRoot}
					alt='Barber Shop Logo'
					width={1820}
					height={1200}
					className='absolute inset-0 w-full h-full object-cover'
				/>
				<div className='absolute inset-0 bg-black bg-opacity-50'></div>
				<div className='w-full max-w-xl mx-auto p-4'>
					<div className='bg-gray-800/80 backdrop-blur-sm rounded-3xl p-6 space-y-6'>
						<div className='space-y-4'>
							<h2 className='text-xl text-white font-semibold'>Choose service</h2>
							<Select>
								<SelectTrigger className='w-full bg-white text-black'>
									<SelectValue placeholder='See all attractive services...' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='haircut'>Haircut</SelectItem>
									<SelectItem value='shave'>Shave</SelectItem>
									<SelectItem value='coloring'>Hair Coloring</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className='space-y-4'>
							<h2 className='text-xl text-white font-semibold'>Choose date, time & stylist</h2>
							<div className='flex gap-2'>
								<Button variant='outline' className='flex-1 bg-white text-black'>
									<Scissors className='mr-2 h-4 w-4' />
									Choose stylist
									<ChevronRight className='ml-auto h-4 w-4' />
								</Button>
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
										className={`bg-white text-black hover:bg-gray-200 ${
											selectedTime === time ? 'ring-2 ring-black' : ''
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

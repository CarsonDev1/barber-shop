'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, ChevronRight, Scissors, Upload } from 'lucide-react';
import { format, addDays } from 'date-fns'; // Import addDays from date-fns
import Image from 'next/image';
import BackGroundRoot from '@/public/root/background-root.png';
import Face from '@/public/root/face.png';
import Link from 'next/link';
import { createBook } from '@/app/apis/booking/createBook';
import { useRouter } from 'next/navigation';
import { ApiResponseServiceType } from '@/types/ServiceType.type';
import { useQuery } from '@tanstack/react-query';
import { getStaffShiftById } from '@/app/apis/staff-shift/getStaffShiftById';

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
interface Shift {
	date: string;
	startTime: string;
	endTime: string;
}

interface BookingData {
	selectedCombos: Combo[];
	totalPayment: number;
	selectedStylist?: Stylist;
}

const generateTimeSlots = (startTime: string, endTime: string, interval: number): string[] => {
	const timeSlots: string[] = [];
	const start = new Date(`1970-01-01T${startTime}:00`);
	const end = new Date(`1970-01-01T${endTime}:00`);

	while (start <= end) {
		const hours = start.getHours();
		const minutes = start.getMinutes();
		timeSlots.push(`${hours}h${minutes.toString().padStart(2, '0')}`);
		start.setMinutes(start.getMinutes() + interval);
	}

	return timeSlots;
};

const getNextWeek = (date: Date) => {
	const nextWeekDate = new Date(date);
	nextWeekDate.setDate(date.getDate() + 7);
	const startDate = new Date(nextWeekDate.getFullYear(), 0, 1);
	const diff = nextWeekDate.getTime() - startDate.getTime();
	const oneDay = 1000 * 60 * 60 * 24;
	const dayOfYear = Math.floor(diff / oneDay);
	return Math.ceil((dayOfYear + 1) / 7);
};

export default function BookingForm() {
	const [date, setDate] = useState<Date | undefined>(addDays(new Date(), 1)); // Set initial date to tomorrow
	const [selectedTime, setSelectedTime] = useState<string | null>(null);
	const [bookingData, setBookingData] = useState<BookingData | null>(null);
	const currentDate = new Date();
	const currentYear = currentDate.getFullYear();
	const currentWeek = getNextWeek(currentDate);
	const router = useRouter();

	const staff_id = bookingData?.selectedStylist?.id || 0; // Đảm bảo có giá trị mặc định
	const {
		data: staffShiftByIdData,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['dataShiftById', { week: currentWeek, year: currentYear, staff_id }],
		queryFn: () => getStaffShiftById({ week: currentWeek, year: currentYear, staff_id }),
		enabled: !!staff_id, // Chỉ gọi API khi staff_id có giá trị
	});

	console.log('staffShiftByIdData', staffShiftByIdData);

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

	// Hàm kiểm tra xem timeSlot có bị trùng với ca làm việc đã có
	const isTimeSlotUnavailable = (time: string, selectedDate: Date | undefined): boolean => {
		if (!staffShiftByIdData?.payload || !selectedDate) return false;

		const selectedDateString = format(selectedDate, 'yyyy-MM-dd');

		return staffShiftByIdData.payload.some((shift: Shift) => {
			if (shift.date !== selectedDateString) return false;

			const [shiftStartHours, shiftStartMinutes] = shift.startTime.split(':').map(Number);
			const [shiftEndHours, shiftEndMinutes] = shift.endTime.split(':').map(Number);

			const shiftStart = new Date(1970, 0, 1, shiftStartHours, shiftStartMinutes);
			const shiftEnd = new Date(1970, 0, 1, shiftEndHours, shiftEndMinutes);

			const [slotHours, slotMinutes] = time.replace('h', ':').split(':').map(Number);
			const slotTime = new Date(1970, 0, 1, slotHours, slotMinutes);

			return slotTime >= shiftStart && slotTime < shiftEnd;
		});
	};

	const timeSlots = generateTimeSlots('07:20', '16:20', 20); // Generate time slots from 7:20 to 16:20, with 20-minute intervals

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
			localStorage.setItem('bookingResponse', JSON.stringify(response));

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
				<div className='w-full max-w-xl mx-auto p-4 sec-com relative z-10'>
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
						{bookingData && bookingData?.selectedCombos?.length > 0 && (
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
								{timeSlots.map((time) => {
									const isUnavailable = isTimeSlotUnavailable(time, date);
									return (
										<Button
											key={time}
											variant='outline'
											disabled={isUnavailable}
											className={`bg-white text-black ${
												selectedTime === time
													? 'bg-[#5bb4f0] text-white ring-2 ring-[#F0B35B]'
													: ''
											} ${isUnavailable ? 'opacity-50 cursor-not-allowed' : ''}`}
											onClick={() => !isUnavailable && setSelectedTime(time)}
										>
											{time}
										</Button>
									);
								})}
							</div>

							<Button
								variant='default'
								className='w-full bg-[#F0B35B] text-white'
								onClick={handleBooking}
							>
								Book Appointment
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

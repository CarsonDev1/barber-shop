'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, ChevronRight, Scissors, Upload } from 'lucide-react';
import { addDays, format } from 'date-fns'; // Import addDays from date-fns
import Image from 'next/image';
import BackGroundRoot from '@/public/root/background-root.png';
import Face from '@/public/root/face.png';
import Link from 'next/link';
import { createBook } from '@/app/api/booking/createBook';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getStaffShiftById } from '@/app/api/staff-shift/getStaffShiftById';
import { getBookings } from '@/app/api/booking/getBooking';
import Swal from 'sweetalert2';
import { useAuth } from '@/context/AuthProvider';
import { useTranslation } from 'react-i18next';
import { jwtDecode } from 'jwt-decode';
import { createAdminBook } from '@/app/api/booking/createAdminBooking';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';

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

interface Voucher {
	id: number;
	code: string;
	maxUses: number;
	discount: number;
	maxDiscount: number;
	startDate: string;
	endDate: string;
	disabled: boolean;
}

interface BookingData {
	selectedCombos: Combo[];
	selectedServices: Service[];
	totalPayment: number;
	selectedStylist?: Stylist;
	selectedOffers: Voucher[];
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

const getCurrentWeek = (date: Date) => {
	const startDate = new Date(date.getFullYear(), 0, 1);
	const diff = date.getTime() - startDate.getTime();
	const oneDay = 1000 * 60 * 60 * 24;
	const dayOfYear = Math.floor(diff / oneDay);
	return Math.ceil((dayOfYear + 1) / 7) + 1;
};

export default function BookingForm() {
	const [date, setDate] = useState<Date | undefined>(addDays(new Date(), 1));
	const [selectedTime, setSelectedTime] = useState<string | null>(null);
	const [bookingData, setBookingData] = useState<BookingData | null>(null);
	const currentDate = new Date();
	const currentYear = currentDate.getFullYear();
	const currentWeek = getCurrentWeek(currentDate);
	const router = useRouter();
	const { isAuthenticated } = useAuth();
	const { t } = useTranslation('common');
	const tokenData: any = localStorage?.getItem('accessToken');
	const [dialogOpen, setDialogOpen] = useState(false);

	let decoded: any = null;
	if (typeof tokenData === 'string' && tokenData.trim()) {
		try {
			decoded = jwtDecode(tokenData);
		} catch (error) {
			console.error('Error decoding token:', error);
		}
	}

	const userRole = decoded?.role;

	const staff_id = bookingData?.selectedStylist?.id || 0;
	const { data: staffShiftByIdData, isLoading } = useQuery({
		queryKey: ['dataShiftById', { week: 50, year: currentYear, staff_id }],
		queryFn: () => getStaffShiftById({ week: 50, year: currentYear, staff_id }),
		enabled: !!staff_id,
	});

	const dataStaffShift = staffShiftByIdData?.payload ?? [];

	const {
		data: bookingDatas,
		isLoading: isLoadingBookings,
		error: errorBookings,
	} = useQuery<ApiResponseBooking>({
		queryKey: ['dataBookings'],
		queryFn: getBookings,
	});

	const bookings = bookingDatas?.payload || [];

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

	// Hàm kiểm tra xem timeSlot có bị trùng với ca làm việc đã có hoặc đã COMPLETED không
	const isTimeSlotUnavailable = (time: string, selectedDate: Date | undefined): boolean => {
		if (!staffShiftByIdData?.payload || !selectedDate) return false;

		const selectedDateString = format(selectedDate, 'yyyy-MM-dd');

		// Check completed bookings first
		const isCompletedBooking = bookings.some((booking) => {
			if (booking.status !== 'COMPLETED') return false;

			const bookingStartTime = new Date(booking.startTime);
			const bookingEndTime = new Date(booking.endTime);

			if (format(bookingStartTime, 'yyyy-MM-dd') !== selectedDateString) return false;

			// Parse selected time to compare
			const [slotHours, slotMinutes] = time.replace('h', ':').split(':').map(Number);
			const slotTime = new Date(1970, 0, 1, slotHours, slotMinutes);

			// Check if the slot time is within the booking time range
			return slotTime >= bookingStartTime && slotTime < bookingEndTime;
		});

		if (isCompletedBooking) return true; // If there's a completed booking, the slot is unavailable

		// Check if the time falls within the staff's shift
		return !staffShiftByIdData.payload.some((shift: Shift) => {
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

	const timeSlots = generateTimeSlots('07:20', '16:20', 20);

	const handleBooking = async () => {
		if (!isAuthenticated) {
			Swal.fire({
				title: 'Please login first!',
				text: 'You need to be logged in to book an appointment.',
				icon: 'info',
				confirmButtonText: 'OK',
			});
			return;
		}

		if (!bookingData || !date || !selectedTime) {
			Swal.fire({
				title: 'Warning!',
				text: 'Please select a date, time, and stylist.',
				icon: 'warning',
				confirmButtonText: 'OK',
			});
			return;
		}

		// Ensure `date` is valid
		const selectedDate = new Date(date);
		if (isNaN(selectedDate.getTime())) {
			Swal.fire({
				title: 'Error!',
				text: 'Invalid date selected.',
				icon: 'error',
				confirmButtonText: 'OK',
			});
			return;
		}

		// Handle both formats "HHhMM" or "HH:MM"
		let hours: number;
		let minutes: number;

		if (selectedTime.includes('h')) {
			// Handle "HHhMM" format
			const timeParts = selectedTime.split('h');
			if (timeParts.length !== 2) {
				Swal.fire({
					title: 'Error!',
					text: 'Invalid time format. Please use the format HHhMM (e.g., 09h30).',
					icon: 'error',
					confirmButtonText: 'OK',
				});
				return;
			}
			[hours, minutes] = timeParts.map((part) => parseInt(part, 10));
		} else if (selectedTime.includes(':')) {
			// Handle "HH:MM" format
			const timeParts = selectedTime.split(':');
			if (timeParts.length !== 2) {
				Swal.fire({
					title: 'Error!',
					text: 'Invalid time format. Please use the format HH:MM (e.g., 09:30).',
					icon: 'error',
					confirmButtonText: 'OK',
				});
				return;
			}
			[hours, minutes] = timeParts.map((part) => parseInt(part, 10));
		} else {
			Swal.fire({
				title: 'Error!',
				text: 'Invalid time format. Please use the format HHhMM or HH:MM.',
				icon: 'error',
				confirmButtonText: 'OK',
			});
			return;
		}

		if (isNaN(hours) || isNaN(minutes)) {
			Swal.fire({
				title: 'Error!',
				text: 'Invalid time selected.',
				icon: 'error',
				confirmButtonText: 'OK',
			});
			return;
		}

		// Set the selected time (hours and minutes)
		selectedDate.setHours(hours);
		selectedDate.setMinutes(minutes);
		selectedDate.setSeconds(0);
		selectedDate.setMilliseconds(0);

		// Format `startTime` as "YYYY-MM-DD HH:mm:ss"
		const startTime = format(selectedDate, 'yyyy-MM-dd HH:mm:ss');

		const staff_id: any = bookingData.selectedStylist?.id;
		const comboIds = bookingData.selectedCombos.map((combo) => combo.id);
		const serviceIds = bookingData.selectedServices.map((service) => service.id);
		const note = 'Customer requested booking';

		try {
			const response =
				userRole === 'ROLE_ADMIN'
					? await createAdminBook({
							staff_id,
							note,
							startTime,
							serviceIds,
							comboIds,
					  })
					: await createBook({
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
		} catch (error: any) {
			Swal.fire({
				title: 'Lỗi!',
				text: error,
				icon: 'error',
				confirmButtonText: 'OK',
			});
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
							<h2 className='text-xl text-white font-semibold'>{t('chooseService')}</h2>
							<Link href='/combo'>
								<Button className='flex items-center justify-between w-full bg-white hover:bg-gray-300'>
									<div className='flex items-center'>
										<Scissors className='mr-2 h-4 w-4 text-gray-900' />
										<span className='text-gray-900'>See all attractive services..</span>
									</div>
									<ChevronRight className='ml-auto h-4 w-4 text-gray-900' />
								</Button>
							</Link>
						</div>

						{/* Display selected combos and services below the button */}
						{bookingData &&
							(bookingData.selectedCombos?.length > 0 || bookingData.selectedServices?.length > 0) && (
								<div className='mt-4 p-4 bg-white/20 rounded-lg space-y-2'>
									<h3 className='text-lg font-semibold text-white'>Selected Items</h3>
									{/* Display selected combos */}
									{bookingData.selectedCombos.length > 0 && (
										<div className='space-y-1'>
											<h4 className='text-md text-white font-semibold'>Selected Combos</h4>
											{bookingData.selectedCombos.map((combo) => (
												<div key={combo.id} className='flex justify-between text-white'>
													<span>{combo.name}</span>
													<span>{combo.price.toLocaleString()}₫</span>
												</div>
											))}
										</div>
									)}

									{/* Display selected services */}
									{bookingData.selectedServices.length > 0 && (
										<div className='space-y-1 mt-2'>
											<h4 className='text-md text-white font-semibold'>Selected Services</h4>
											{bookingData.selectedServices.map((service) => (
												<div key={service.id} className='flex justify-between text-white'>
													<span>{service.name}</span>
													<span>{service.price.toLocaleString()}₫</span>
												</div>
											))}
										</div>
									)}

									{bookingData.selectedOffers.length > 0 && (
										<div className='space-y-1 mt-2'>
											<div className='flex justify-between text-white font-semibold border-t border-gray-400 pt-2 mt-2'>
												<h4 className='text-md text-white font-semibold'>Total Offers:</h4>
												{bookingData.selectedOffers.map((offer) => (
													<div key={offer.id} className='flex justify-between text-white'>
														<span>{offer.code}</span>
														<span>-{offer.maxDiscount.toLocaleString()}₫</span>
													</div>
												))}
											</div>
										</div>
									)}

									{/* Display total payment */}
									<div className='flex justify-between text-white font-semibold border-t border-gray-400 pt-2 mt-2'>
										<span>Total Payment:</span>
										<span>{bookingData.totalPayment.toLocaleString()}₫</span>
									</div>
								</div>
							)}

						<div className='space-y-4'>
							<h2 className='text-xl text-white font-semibold'>{t('chooseDateStylist')}</h2>
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
									{t('uploadHairstyle')}
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

							<div>
								<label className='block text-white'>{t('chooseTime')}</label>
								<input
									type='time'
									className='w-full mt-2 p-2 text-black rounded-md border border-gray-300'
									disabled={!date}
									onBlur={(e) => {
										const selectedTime = e.target.value;
										// Ensure that the time is available
										setSelectedTime(selectedTime);
									}}
								/>
							</div>

							{bookingData && (
								<Dialog>
									{selectedTime !== null && (
										<DialogTrigger asChild>
											<Button variant='default' className='w-full bg-[#F0B35B] text-white'>
												{t('book')}
											</Button>
										</DialogTrigger>
									)}
									<DialogContent className='sm:max-w-[425px] bg-slate-800'>
										<div className='py-4 text-white'>
											{bookingData.selectedCombos.map((combo) => (
												<div key={combo.id} className='flex justify-between text-white'>
													<span>{combo.name}</span>
													<span>{combo.price.toLocaleString()}₫</span>
												</div>
											))}
											{bookingData.selectedServices.length > 0 && (
												<div className='space-y-1 mt-2'>
													{bookingData.selectedServices.map((service) => (
														<div
															key={service.id}
															className='flex justify-between text-white'
														>
															<span>{service.name}</span>
															<span>{service.price.toLocaleString()}₫</span>
														</div>
													))}
												</div>
											)}
											{bookingData.selectedOffers.length > 0 && (
												<div className='space-y-1 mt-2'>
													<div className='flex justify-between text-white font-semibold border-t border-gray-400 pt-2 mt-2'>
														<h4 className='text-md text-white font-semibold'>
															Total Offers:
														</h4>
														{bookingData.selectedOffers.map((offer) => (
															<div
																key={offer.id}
																className='flex justify-between text-white'
															>
																<span>{offer.code}</span>
																<span>-{offer.maxDiscount.toLocaleString()}₫</span>
															</div>
														))}
													</div>
												</div>
											)}
											<div className='flex justify-between text-white font-semibold border-t border-gray-400 pt-2 mt-2'>
												<span>Total Payment:</span>
												<span>{bookingData.totalPayment.toLocaleString()}₫</span>
											</div>
										</div>
										<DialogFooter className='flex items-center gap-2'>
											<DialogClose asChild>
												<Button type='button' variant='secondary'>
													Close
												</Button>
											</DialogClose>
											<Button onClick={handleBooking} type='submit'>
												Confirm
											</Button>
										</DialogFooter>
									</DialogContent>
								</Dialog>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

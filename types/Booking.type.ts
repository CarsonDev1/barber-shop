interface Images {
	id: number;
	name: string;
	url: string;
	thumbUrl: string;
	mediumUrl: string;
	createdAt: string;
	updatedAt: string;
}

interface Services {
	id: number;
	name: string;
	description: string;
	price: number;
	estimateTime: number;
	images: Images[];
	createdAt: string;
	updatedAt: string;
}

interface BookingDetail {
	bookingDetailId: any;
	id: number;
	service: Services;
	combo: null | any; // You can define this better if you have more information
	createdAt: string;
	updatedAt: string;
}

interface Staff {
	id: number;
	name: string;
	email: string;
	phone: string;
	dob: string;
	verified: boolean;
	blocked: boolean;
	role: string;
	createdAt: string;
	updatedAt: string;
}

interface Customer {
	id: number;
	name: string;
	email: string;
	phone: string;
	dob: string;
	verified: boolean;
	blocked: boolean;
	role: string;
	createdAt: string;
	updatedAt: string;
}

interface Booking {
	id: number;
	status: 'COMPLETED' | 'CANCELLED'; // You can extend this with other statuses if needed
	note: string;
	staff: Staff;
	customer: Customer;
	startTime: string;
	endTime: string;
	createdAt: string;
	updatedAt: string;
	bookingDetails: BookingDetail[];
}

type ApiResponseBooking = {
	status: number;
	message: string;
	payload: Booking[];
};

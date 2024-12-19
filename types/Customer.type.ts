export interface Avatar {
	id: number;
	name: string;
	url: string;
	thumbUrl: string;
	mediumUrl: string;
	createdAt: string;
	updatedAt: string;
}

export interface Customer {
	id: number;
	name: string | null;
	email: string;
	phone: string;
	dob: string | null;
	avatar: Avatar;
	verified: boolean;
	blocked: boolean;
	role: string;
	createdAt: string;
	updatedAt: string;
	description: string;
	rating: any;
	bookingCount: any;
	can_rank_up: boolean;
	bookings_count: number;
	money_used: number;
}

export interface CustomersResponse {
	status: number;
	message: string;
	payload: Customer[];
}

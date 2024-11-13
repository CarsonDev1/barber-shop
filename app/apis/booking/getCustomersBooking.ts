/* eslint-disable @typescript-eslint/no-explicit-any */

import { CustomersResponse } from '@/types/Customer.type';
import api from '@/utils/api';

export const getCustomersBookings = async (): Promise<CustomersResponse> => {
	try {
		const response = await api.get<CustomersResponse>('/booking/customer-get-bookings');
		return response.data;
	} catch (error: any) {
		console.error('Error fetching bookings customer details:', error.response?.data || error.message);
		throw error;
	}
};

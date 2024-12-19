/* eslint-disable @typescript-eslint/no-explicit-any */

import { CustomersResponse } from '@/types/Customer.type';
import api from '@/utils/api';
import { AxiosError } from 'axios';

export const getBookingInMonth = async (): Promise<CustomersResponse> => {
	try {
		const response = await api.get<CustomersResponse>('/booking/booking-in-month');
		return response.data;
	} catch (error: any) {
		if (error instanceof AxiosError && error.response) {
			throw new Error(error.response.data.payload?.vi || error.response.data.message || 'Unknown error occurred');
		} else {
			throw new Error('An unexpected error occurred');
		}
	}
};

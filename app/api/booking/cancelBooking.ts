/* eslint-disable @typescript-eslint/no-explicit-any */

import api from '@/utils/api';
import { AxiosError } from 'axios';

export const CancelBooking = async (id: number): Promise<any> => {
	try {
		// Use DELETE method for canceling bookings
		const response = await api.delete<any>(`/booking/cancel/${id}`);
		return response.data;
	} catch (error: any) {
		if (error instanceof AxiosError && error.response) {
			// Extract error message from the API response
			throw new Error(error.response.data.payload?.vi || error.response.data.message || 'Unknown error occurred');
		} else {
			// Handle unexpected errors
			throw new Error('An unexpected error occurred');
		}
	}
};

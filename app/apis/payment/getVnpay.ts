/* eslint-disable @typescript-eslint/no-explicit-any */

import { ApiResponseServiceType } from '@/types/ServiceType.type';
import api from '@/utils/api';

/**
 * Fetch VNPay URL for the given booking IDs
 * @param bookingIds Array of booking IDs
 * @returns Promise with VNPay URL response
 */
export const getVNPayUrl = async (bookingIds: number[]): Promise<any> => {
	try {
		const response = await api.get<ApiResponseServiceType>('/payment/get-vnpay-url', {
			params: { bookingIds: bookingIds.join(',') },
		});
		return response.data;
	} catch (error: any) {
		console.error('Error fetching VNPay URL:', error.response?.data || error.message);
		throw error;
	}
};

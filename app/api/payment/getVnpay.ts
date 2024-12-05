/* eslint-disable @typescript-eslint/no-explicit-any */

import { ApiResponseServiceType } from '@/types/ServiceType.type';
import api from '@/utils/api';

/**
 * Fetch VNPay URL for the given booking IDs with additional parameters
 * @param bookingIds Array of booking IDs
 * @param bankCode Bank code
 * @param language Language preference
 * @param voucherCode Voucher code
 * @returns Promise with VNPay URL response
 */
export const getVNPayUrl = async (
	bookingIds: number[],
	bankCode: string,
	language: string,
	voucherCode: string
): Promise<any> => {
	try {
		const response = await api.get<ApiResponseServiceType>('/payment/get-vnpay-url', {
			params: {
				bookingIds: bookingIds.join(','),
				bankCode,
				language,
				voucherCode
			},
		});
		return response.data;
	} catch (error: any) {
		console.error('Error fetching VNPay URL:', error.response?.data || error.message);
		throw error;
	}
};

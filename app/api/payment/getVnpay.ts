import { ApiResponseServiceType } from '@/types/ServiceType.type';
import api from '@/utils/api';
import { AxiosError } from 'axios';

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
				bookingIds: bookingIds.join(','), // Convert array to string
				bankCode,
				language,
				voucherCode,
			},
		});
		return response.data;
	} catch (error: any) {
		if (error instanceof AxiosError && error.response) {
			// Throw specific error from API response
			throw new Error(
				error.response.data.payload?.vi || // Prefer Vietnamese error
				error.response.data.message || // Generic error message
				'Unknown error occurred' // Fallback error
			);
		} else {
			// Fallback for unexpected errors
			throw new Error('An unexpected error occurred');
		}
	}
};

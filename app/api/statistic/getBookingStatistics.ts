/* eslint-disable @typescript-eslint/no-explicit-any */

import { ApiResponseServiceType } from '@/types/ServiceType.type';
import api from '@/utils/api';

export const getBookingStatistics = async (year: number): Promise<any> => {
	try {
		const response = await api.get<ApiResponseServiceType>('/statistic/booking', {
			params: { year },
		});
		return response.data;
	} catch (error: any) {
		console.error('Error fetching booking statistics:', error.response?.data || error.message);
		throw error;
	}
};

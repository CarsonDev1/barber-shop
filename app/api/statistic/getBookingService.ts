/* eslint-disable @typescript-eslint/no-explicit-any */

import { ApiResponseServiceType } from '@/types/ServiceType.type';
import api from '@/utils/api';

export const getBookingServiceStatistics = async (fromDate: string, toDate: string): Promise<any> => {
	try {
		const response = await api.get<ApiResponseServiceType>('/statistic/booking/service-popularity', {
			params: { fromDate, toDate },
		});
		return response.data;
	} catch (error: any) {
		console.error('Error fetching Booking statistics:', error.response?.data || error.message);
		throw error;
	}
};

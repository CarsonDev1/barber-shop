/* eslint-disable @typescript-eslint/no-explicit-any */

import { ApiResponseServiceType } from '@/types/ServiceType.type';
import api from '@/utils/api';

export const getStaffShift = async (week: number, year: number): Promise<ApiResponseServiceType> => {
	try {
		const response = await api.get<ApiResponseServiceType>('/staff-shift', {
			params: { week, year },
		});
		return response.data;
	} catch (error: any) {
		console.error('Error fetching staff shift details:', error.response?.data || error.message);
		throw error;
	}
};

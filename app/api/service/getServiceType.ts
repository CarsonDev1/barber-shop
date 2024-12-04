/* eslint-disable @typescript-eslint/no-explicit-any */

import { ApiResponseServiceType } from '@/types/ServiceType.type';
import api from '@/utils/api';

export const getServiceTypes = async (): Promise<ApiResponseServiceType> => {
	try {
		const response = await api.get<ApiResponseServiceType>('/service-type/get-all-service-types');
		return response.data;
	} catch (error: any) {
		console.error('Error fetching services details:', error.response?.data || error.message);
		throw error;
	}
};

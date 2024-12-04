/* eslint-disable @typescript-eslint/no-explicit-any */

import { ServiceResponse } from '@/types/Service.type';
import api from '@/utils/api';

export const getServices = async (): Promise<ServiceResponse> => {
	try {
		const response = await api.get<ServiceResponse>('/service/get-all-services');
		return response.data;
	} catch (error: any) {
		console.error('Error fetching service-type details:', error.response?.data || error.message);
		throw error;
	}
};

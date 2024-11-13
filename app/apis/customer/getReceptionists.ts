/* eslint-disable @typescript-eslint/no-explicit-any */

import { CustomersResponse } from '@/types/Customer.type';
import api from '@/utils/api';

export const getReceptionists = async (): Promise<CustomersResponse> => {
	try {
		const response = await api.get<CustomersResponse>('/users/get-all-receptionists');
		return response.data;
	} catch (error: any) {
		console.error('Error fetching receptionists details:', error.response?.data || error.message);
		throw error;
	}
};

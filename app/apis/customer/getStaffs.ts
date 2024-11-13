/* eslint-disable @typescript-eslint/no-explicit-any */

import { CustomersResponse } from '@/types/Customer.type';
import api from '@/utils/api';

export const getStaffs = async (): Promise<CustomersResponse> => {
	try {
		const response = await api.get<CustomersResponse>('/users/get-all-staffs');
		return response.data;
	} catch (error: any) {
		console.error('Error fetching staffs details:', error.response?.data || error.message);
		throw error;
	}
};

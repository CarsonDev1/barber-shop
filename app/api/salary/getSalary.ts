/* eslint-disable @typescript-eslint/no-explicit-any */

import api from '@/utils/api';

export const getSalary = async (): Promise<any> => {
	try {
		const response = await api.get<any>('/salary');
		return response.data;
	} catch (error: any) {
		console.error('Error fetching salary details:', error.response?.data || error.message);
		throw error;
	}
};

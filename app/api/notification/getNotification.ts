/* eslint-disable @typescript-eslint/no-explicit-any */

import api from '@/utils/api';

export const getNotification = async (): Promise<any> => {
	try {
		const response = await api.get<any>('/notification');
		return response.data;
	} catch (error: any) {
		console.error('Error fetching all notification details:', error.response?.data || error.message);
		throw error;
	}
};

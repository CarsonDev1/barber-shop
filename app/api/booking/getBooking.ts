import api from '@/utils/api';

export const getBookings = async (): Promise<ApiResponseBooking> => {
	try {
		const response = await api.get<ApiResponseBooking>('/booking');
		return response.data;
	} catch (error: any) {
		console.error('Error fetching booking details:', error.response?.data || error.message);
		throw error;
	}
};

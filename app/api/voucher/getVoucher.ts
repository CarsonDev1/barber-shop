import api from '@/utils/api';

export const getVouchers = async (): Promise<ApiResponseVoucher> => {
	try {
		const response = await api.get<ApiResponseVoucher>('/voucher');
		return response.data;
	} catch (error: any) {
		console.error('Error fetching combos details:', error.response?.data || error.message);
		throw error;
	}
};

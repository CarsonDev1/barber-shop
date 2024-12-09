import api from '@/utils/api';

export const getVoucherById = async (id: any): Promise<ApiResponseVoucher> => {
	try {
		const response = await api.get<ApiResponseVoucher>(`/voucher/${id}`);
		return response.data;
	} catch (error: any) {
		console.error('Error fetching voucher details:', error.response?.data || error.message);
		throw error;
	}
};

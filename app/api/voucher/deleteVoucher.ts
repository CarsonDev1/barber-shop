import api from '@/utils/api';

export const deleteVoucher = async (id: number) => {
	try {
		const response = await api.delete(`/voucher/${id}`);
		return response.data;
	} catch (error) {
		console.error('Error deleting voucher:', error);
		throw error;
	}
};

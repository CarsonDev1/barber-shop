import api from '@/utils/api';

export const getCombos = async (): Promise<ApiResponseCombo> => {
	try {
		const response = await api.get<ApiResponseCombo>('/combo/get-all-combos');
		return response.data;
	} catch (error: any) {
		console.error('Error fetching combos details:', error.response?.data || error.message);
		throw error;
	}
};

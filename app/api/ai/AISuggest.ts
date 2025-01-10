import api from '@/utils/api';

export const getAISuggest = async (): Promise<any> => {
	try {
		const response = await api.get<any>('/AI/allowed-values');
		return response.data;
	} catch (error: any) {
		console.error('Error fetching ai suggest:', error.response?.data || error.message);
		throw error;
	}
};

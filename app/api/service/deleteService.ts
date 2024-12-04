import api from '@/utils/api';

export const deleteService = async (id: number) => {
	try {
		const response = await api.delete(`/service/${id}`);
		return response.data;
	} catch (error) {
		console.error('Error deleting service:', error);
		throw error;
	}
};

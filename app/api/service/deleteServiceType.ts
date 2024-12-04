import api from '@/utils/api';

export const deleteServiceType = async (id: number) => {
	try {
		const response = await api.delete(`/service-type/${id}`);
		return response.data;
	} catch (error) {
		console.error('Error deleting service type:', error);
		throw error;
	}
};

import api from '@/utils/api';

export const deleteShift = async (id: number) => {
	try {
		const response = await api.delete(`/shift/${id}`);
		return response.data;
	} catch (error) {
		console.error('Error deleting shift:', error);
		throw error;
	}
};

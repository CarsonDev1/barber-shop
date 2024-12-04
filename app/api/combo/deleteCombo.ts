import api from '@/utils/api';

export const deleteCombo = async (id: number) => {
	try {
		const response = await api.delete(`/combo/${id}`);
		return response.data;
	} catch (error) {
		console.error('Error deleting combo:', error);
		throw error;
	}
};

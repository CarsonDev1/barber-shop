import api from '@/utils/api';

export const updateShift = async (shiftData: { id: number; name: string; startTime: string; endTime: string }) => {
	try {
		const response = await api.put('/shift', shiftData);
		return response.data;
	} catch (error) {
		console.error('Error updating shift:', error);
		throw error;
	}
};

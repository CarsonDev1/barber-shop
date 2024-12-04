import api from '@/utils/api';

export const deleteStaffShift = async (id: number) => {
	try {
		const response = await api.delete(`/staff-shift/${id}`);
		return response.data;
	} catch (error) {
		console.error('Error deleting staff shift:', error);
		throw error;
	}
};

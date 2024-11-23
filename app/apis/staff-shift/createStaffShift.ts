import api from '@/utils/api';

export const createStaffShift = async (staffShiftData: { staffId: number; shiftId: number; date: string }) => {
	try {
		const response = await api.post('/staff-shift', staffShiftData);
		return response.data;
	} catch (error) {
		console.error('Error creating staff shift:', error);
		throw error;
	}
};

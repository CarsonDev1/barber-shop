import api from '@/utils/api';
import { AxiosError } from 'axios';

export const createStaffShift = async (staffShiftData: { staffId: number; shiftId: number; dates: string[] }) => {
	try {
		const response = await api.post('/staff-shift', staffShiftData);
		return response.data;
	} catch (error) {
		if (error instanceof AxiosError && error.response) {
			throw new Error(error.response.data.payload?.vi || error.response.data.message || 'Unknown error occurred');
		} else {
			throw new Error('An unexpected error occurred');
		}
	}
};

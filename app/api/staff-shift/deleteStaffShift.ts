import api from '@/utils/api';
import { AxiosError } from 'axios';

export const deleteStaffShift = async (id: number) => {
	try {
		const response = await api.delete(`/staff-shift/${id}`);
		return response.data;
	} catch (error: any) {
		if (error instanceof AxiosError && error.response) {
			throw new Error(error.response.data.payload?.vi || error.response.data.message || 'Unknown error occurred');
		} else {
			throw new Error('An unexpected error occurred');
		}
	}
};

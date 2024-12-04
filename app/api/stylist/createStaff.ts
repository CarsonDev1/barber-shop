import api from '@/utils/api';
import { AxiosResponse } from 'axios';

interface StaffRequest {
	name: string;
	email: string;
	phone: string;
	dob: string;
	password: string;
	role: string;
}

interface StaffResponse {
	success: boolean;
	message?: string;
	data?: any;
}

export const createStaff = async (staffData: StaffRequest): Promise<StaffResponse> => {
	try {
		const response: AxiosResponse<StaffResponse> = await api.post('/users', staffData);
		return response.data;
	} catch (error: any) {
		console.error('Error creating staff:', error);
		throw new Error(error.response?.data?.message || 'Unable to create staff');
	}
};

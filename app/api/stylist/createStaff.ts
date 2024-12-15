import api from '@/utils/api';
import { AxiosError, AxiosResponse } from 'axios';

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
		if (error instanceof AxiosError && error.response) {
			throw new Error(error.response.data.payload?.vi || error.response.data.message || "Unknown error occurred");
		} else {
			throw new Error("An unexpected error occurred");
		}
	}
};

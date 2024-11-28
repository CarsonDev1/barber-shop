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

export const updateStaff = async (staffData: StaffRequest): Promise<StaffResponse> => {
  try {
    const response: AxiosResponse<StaffResponse> = await api.put(`/users`, staffData);
    return response.data;
  } catch (error: any) {
    console.error('Error updating staff:', error);
    throw new Error(error.response?.data?.message || 'Unable to update staff');
  }
};

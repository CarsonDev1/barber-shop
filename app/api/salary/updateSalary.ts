import api from '@/utils/api';
import { AxiosResponse } from 'axios';

interface SalaryRequest {
  staff_id: number;
  rate: number;
  percentage: number;
}

interface SalaryResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export const updateSalary = async (salaryData: SalaryRequest): Promise<SalaryResponse> => {
  try {
    const response: AxiosResponse<SalaryResponse> = await api.put(`/salary`, salaryData);
    return response.data;
  } catch (error: any) {
    console.error('Error updating Salary:', error);
    throw new Error(error.response?.data?.message || 'Unable to update salary');
  }
};

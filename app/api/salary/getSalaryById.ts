/* eslint-disable @typescript-eslint/no-explicit-any */

import api from '@/utils/api';

export const getSalaryById = async (id: number): Promise<any> => {
  try {
    const response = await api.get<any>(`/salary/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching salary details:', error.response?.data || error.message);
    throw error;
  }
};

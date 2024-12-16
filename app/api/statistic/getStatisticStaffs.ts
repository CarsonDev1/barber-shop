/* eslint-disable @typescript-eslint/no-explicit-any */

import { ApiResponseServiceType } from '@/types/ServiceType.type';
import api from '@/utils/api';

export const getStaffStatistics = async (
  fromDate: string,
  toDate: string
): Promise<any> => {
  try {
    const response = await api.get<ApiResponseServiceType>('/statistic/staffs', {
      params: { fromDate, toDate },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching staff statistics:', error.response?.data || error.message);
    throw error;
  }
};

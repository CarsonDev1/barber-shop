/* eslint-disable @typescript-eslint/no-explicit-any */

import { ApiResponseServiceType } from '@/types/ServiceType.type';
import api from '@/utils/api';

export const getCustomersStatistics = async (
  fromDate: string,
  toDate: string
): Promise<any> => {
  try {
    const response = await api.get<ApiResponseServiceType>('/statistic/customers', {
      params: { fromDate, toDate },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching customers statistics:', error.response?.data || error.message);
    throw error;
  }
};

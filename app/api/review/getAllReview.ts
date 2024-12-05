/* eslint-disable @typescript-eslint/no-explicit-any */

import api from '@/utils/api';

export const getAllReview = async (): Promise<any> => {
  try {
    const response = await api.get<any>('/review/all');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching all review details:', error.response?.data || error.message);
    throw error;
  }
};

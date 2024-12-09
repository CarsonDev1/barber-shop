/* eslint-disable @typescript-eslint/no-explicit-any */

import api from '@/utils/api';

export const CompleteBooking = async (id: number): Promise<any> => {
  try {
    const response = await api.put<any>(`/booking/complete-booking/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching complete booking details:', error.response?.data || error.message);
    throw error;
  }
};

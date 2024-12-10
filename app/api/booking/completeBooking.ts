/* eslint-disable @typescript-eslint/no-explicit-any */

import api from '@/utils/api';
import { AxiosError } from 'axios';

export const CompleteBooking = async (id: number): Promise<any> => {
  try {
    const response = await api.put<any>(`/booking/complete-booking/${id}`);
    return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.payload?.vi || error.response.data.message || "Unknown error occurred");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

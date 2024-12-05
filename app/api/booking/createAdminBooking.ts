import api from '@/utils/api';
import { AxiosResponse } from 'axios';

interface BookingRequest {
  staff_id: number;
  note: string;
  startTime: string;
  serviceIds: number[];
  comboIds: number[];
}

interface BookingResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export const createAdminBook = async (bookingData: BookingRequest): Promise<BookingResponse> => {
  try {
    const response: AxiosResponse<BookingResponse> = await api.post('/booking/admin-book', bookingData);
    return response.data;
  } catch (error: any) {
    console.error("Error admin booking appointment:", error);
    throw new Error(error.response?.data?.message || "Unable to admin book appointment");
  }
};

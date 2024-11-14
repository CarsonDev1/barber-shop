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

export const createBook = async (bookingData: BookingRequest): Promise<BookingResponse> => {
  try {
    const response: AxiosResponse<BookingResponse> = await api.post('/booking/book', bookingData);
    return response.data;
  } catch (error: any) {
    console.error("Error booking appointment:", error);
    throw new Error(error.response?.data?.message || "Unable to book appointment");
  }
};

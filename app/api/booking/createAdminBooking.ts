import api from '@/utils/api';
import { AxiosResponse, AxiosError } from 'axios';

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
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.response.data.payload?.vi || error.response.data.message || "Unknown error occurred");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

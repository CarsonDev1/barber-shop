import api from '@/utils/api';

export interface StaffShift {
	staff_id: number;
	shift_date: string;
	shift_name: string;
	start_time: string;
	end_time: string;
}

export interface GetStaffShiftParams {
	week: number;
	year: number;
	staff_id: number;
}

export const getStaffShiftById = async (params: GetStaffShiftParams): Promise<any> => {
	try {
		const response = await api.get<{ status: string; data: StaffShift[] }>('/staff-shift/get-staff-shift', {
			params,
		});
		return response.data.data;
	} catch (error) {
		console.error('Error fetching staff shifts:', error);
		throw error;
	}
};

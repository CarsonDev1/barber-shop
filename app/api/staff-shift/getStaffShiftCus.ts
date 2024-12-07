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

export const getStaffShiftCus = async (params: GetStaffShiftParams): Promise<any> => {
	try {
		const { staff_id, week, year } = params;
		const response = await api.get<{ status: string; data: StaffShift[] }>(
			`/staff-shift/get-staff-shift?staff_id=${staff_id}&week=${week}&year=${year}`
		);
		return response.data;
	} catch (error) {
		console.error('Error fetching staff shifts:', error);
		throw error;
	}
};

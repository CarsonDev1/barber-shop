import api from '@/utils/api';

export const createShift = async (shiftData: { name: string; startTime: string; endTime: string }) => {
	return await api.post('/shift', shiftData);
};

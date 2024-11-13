import { UserProfile } from '@/types/Profile.type';
import api from '@/utils/api';

export const getAccount = async (): Promise<UserProfile> => {
	try {
		const response = await api.get<{ status: string; message: string; payload: UserProfile }>('/users/profile');
		console.log('responseee', response);

		return response.data.payload;
	} catch (error: unknown) {
		console.error('Error fetching the profile:', (error as Error).message);
		throw error;
	}
};

// In createService.ts file
import api from '@/utils/api';

export const updateServiceType = async (serviceData: { name: string }) => {
	return await api.put('/service-type', serviceData);
};

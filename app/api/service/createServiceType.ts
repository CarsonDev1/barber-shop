// In createService.ts file
import api from '@/utils/api';

export const createServiceType = async (serviceData: { name: string }) => {
	return await api.post('/service-type/add-service-type', serviceData);
};

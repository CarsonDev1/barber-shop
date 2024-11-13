import api from '@/utils/api';

export const createService = async (serviceData: FormData) => {
	return await api.post('/service/add-service', serviceData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});
};

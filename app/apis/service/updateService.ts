import api from '@/utils/api';

export const updateService = async (serviceData: FormData) => {
	return await api.put('/service', serviceData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});
};

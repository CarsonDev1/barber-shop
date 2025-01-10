import api from '@/utils/api';

export const createAIChange = async (image: File, style: any, color: any) => {
	const formData = new FormData();
	formData.append('image', image);
	formData.append('style', style);
	formData.append('color', color);

	return await api.post('/AI/change-hair-style', formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});
};

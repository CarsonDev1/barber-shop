import api from '@/utils/api';

export const createCombo = async (comboData: FormData) => {
	return await api.post('/combo/add-combo', comboData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});
};

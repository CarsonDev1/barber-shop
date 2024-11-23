import api from '@/utils/api';

export const updateCombo = async (comboData: FormData) => {
	return await api.put(`/combo`, comboData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	});
};

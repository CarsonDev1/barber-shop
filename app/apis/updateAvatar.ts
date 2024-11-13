import api from '@/utils/api';

export const updateAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await api.post('/users/update-avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

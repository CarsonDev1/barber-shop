import api from '@/utils/api';

export const createAIPro = async (image: File) => {
  const formData = new FormData();
  formData.append('image', image); // Thêm file vào FormData

  return await api.post('/AI/pro', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

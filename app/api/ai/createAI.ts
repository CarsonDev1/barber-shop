import api from '@/utils/api';

export const createAI = async (AIData: { gender: string; characteristics: string[]; language: string }) => {
  try {
    const response = await api.post('/AI', AIData);
    return response.data;
  } catch (error) {
    console.error('Error creating AI:', error);
    throw error;
  }
};

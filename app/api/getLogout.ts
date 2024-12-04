import api from '@/utils/api';

export const getLogOut = async (logoutData: { Authorization: string }) => {
  return await api.get('/users/logout', {
    data: logoutData,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

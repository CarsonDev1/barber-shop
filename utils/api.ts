import axios from 'axios';

const api = axios.create({
	baseURL: 'https://52.187.14.110/api',
	headers: {
		'Content-Type': 'application/json',
	},
});

// Thêm interceptor vào axios instance
api.interceptors.request.use((config) => {
	const token = localStorage.getItem('accessToken');
	if (token) {
		config.headers['Authorization'] = `Bearer ${token}`;
	}
	return config;
});

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		console.log('Error in interceptor:', error.response?.status); // Debugging line
		const originalRequest = error.config;
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
			const refreshToken = localStorage.getItem('refreshToken');
			try {
				const response = await axios.post('/auth/refresh', { token: refreshToken });
				const { accessToken } = response.data;
				localStorage.setItem('accessToken', accessToken);
				originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
				return api(originalRequest);
			} catch {
				localStorage.removeItem('accessToken');
				localStorage.removeItem('refreshToken');
				window.location.href = '/login';
			}
		}
		return Promise.reject(error);
	}
);


export default api;

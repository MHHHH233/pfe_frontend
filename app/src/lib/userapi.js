import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
  },
});

// Request interceptor
apiClient.interceptors.request.use((config) => {
    // Update token on each request to ensure it's current
    const token = sessionStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error('Unauthorized access. Redirecting to login...');
            sessionStorage.removeItem('token');
            // Instead of using navigate, we'll redirect using window.location
            window.location.href = '/signin';
        }
        return Promise.reject(error);
    }
);

export default apiClient;
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

const apiGuest = axios.create({
    baseURL: API_URL,
    headers: {
    'Content-Type': 'application/json',
  },
});

console.log('Using API URL:', API_URL); // Debug log

// Request interceptor (e.g., add auth token)
apiGuest.interceptors.request.use((config) => {
  console.log('Making request to:', config.baseURL + config.url); // Debug log
  return config;
});

export default apiGuest;
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const apiGuest = axios.create({
    baseURL: API_URL,
    headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (e.g., add auth token)
apiGuest.interceptors.request.use((config) => {
  return config;
});

export default apiGuest;
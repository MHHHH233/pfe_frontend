import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://terranafa.moulweb.com/back',
  headers: {
    'Content-Type': 'application/json',
  },
  Authorization: `Bearer ${sessionStorage.getItem('token')}`
});

// Add request debugging in development
const isDevelopment = process.env.NODE_ENV === 'development';

// Add a request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Get the token from sessionStorage
    const token = sessionStorage.getItem('token');
    
    // If token exists, add it to the headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request details in development mode
    if (isDevelopment) {
      console.log(`🚀 API Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`, {
        params: config.params,
        headers: config.headers,
        data: config.data
      });
    }
    
    return config;
  },
  (error) => {
    if (isDevelopment) {
      console.error('❌ API Request Error:', error);
    }
    return Promise.reject(error);
  }
);

// Add a response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Log response in development mode
    if (isDevelopment) {
      console.log(`✅ API Response: ${response.config.method.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data
      });
    }
    return response;
  },
  (error) => {
    // Log error response in development mode
    if (isDevelopment) {
      console.error('❌ API Response Error:', {
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data
      });
    }
    
    // Handle 401 (Unauthorized) responses
    if (error.response && error.response.status === 401) {
      // Clear session storage
      sessionStorage.clear();
      // Redirect to login page
      window.location.href = '/sign-in';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
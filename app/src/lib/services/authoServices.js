import { autho } from "../endpoint/autho";
import guestapi from "../guestapi";
import userapi from "../userapi";

export const authService = {
  login: async (data) => {
    console.log('API URL:', process.env.REACT_APP_API_URL);
    console.log('Login endpoint:', autho.login());
    console.log('Request data:', data);
    
    const response = await guestapi.post(autho.login(), data);
    return response.data;
  },

  register: async (data) => {
    const response = await guestapi.post(autho.register(), data);
    return response.data;
  },

  logout: async () => {
    await userapi.get(autho.logout());
  },

  googleRedirect: async () => {
    const response = await guestapi.get(autho.googleRedirect());
    return response.data;
  },

  handleGoogleCallback: async (callbackUrl) => {
    try {
      // If the full URL is provided, extract the query parameters
      if (callbackUrl.includes('?')) {
        // Extract the code from the URL
        const params = new URLSearchParams(callbackUrl.split('?')[1]);
        const code = params.get('code');
        
        if (!code) {
          throw new Error('Authorization code not found in the callback URL');
        }
        
        // Add api=true parameter to get JSON response instead of redirect
        const callbackEndpoint = `${autho.googleCallback()}?code=${encodeURIComponent(code)}&api=true`;
        const response = await guestapi.get(callbackEndpoint);
        return response.data;
      } else {
        throw new Error('Invalid callback URL format');
      }
    } catch (error) {
      console.error('Google callback error:', error);
      throw error;
    }
  },
};

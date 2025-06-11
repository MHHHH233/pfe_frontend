import { autho } from "../endpoint/autho";
import guestapi from "../guestapi";
import userapi from "../userapi";

/**
 * Service for handling Google OAuth authentication
 */
const googleAuthService = {
  /**
   * Initiates Google OAuth login by redirecting to Google's auth page
   * @returns {Promise<string>} - The URL to redirect to
   */
  initiateGoogleAuth: async () => {
    try {
      const response = await guestapi.get(autho.googleRedirect());
      
      if (response.data.redirect_url) {
        return response.data.redirect_url;
      } else if (response.data.auth_url) {
        return response.data.auth_url;
      } else if (response.data.url) {
        return response.data.url;
      }
      
      throw new Error('No redirect URL returned from server');
    } catch (error) {
      console.error('Error initiating Google auth:', error);
      throw error;
    }
  },
  
  /**
   * Handles the Google OAuth callback by sending the code to the backend
   * @param {string} callbackUrl - The full callback URL with auth code
   * @returns {Promise<Object>} - User data and auth tokens
   */
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
        
        // Store auth data in session storage
        if (response.data.user && response.data.token) {
          try {
            sessionStorage.setItem('token', response.data.token);
            sessionStorage.setItem('userId', response.data.user.id);
            sessionStorage.setItem('name', response.data.user.name);
            sessionStorage.setItem('email', response.data.user.email);
            sessionStorage.setItem('type', response.data.user.type || 'client');
            
            // Store the full user object as JSON string
            sessionStorage.setItem('user', JSON.stringify(response.data.user));
          } catch (storageError) {
            console.warn('Failed to store auth data in sessionStorage:', storageError);
          }
        }
        
        return response.data;
      } else {
        throw new Error('Invalid callback URL format');
      }
    } catch (error) {
      console.error('Google callback error:', error);
      throw error;
    }
  },
  
  /**
   * Checks if the user is logged in through Google
   * @returns {boolean} - Whether user is logged in through Google
   */
  isGoogleAuthenticated: () => {
    try {
      const token = sessionStorage.getItem('token');
      const authProvider = sessionStorage.getItem('auth_provider');
      
      return !!token && authProvider === 'google';
    } catch (error) {
      return false;
    }
  }
};

export default googleAuthService; 
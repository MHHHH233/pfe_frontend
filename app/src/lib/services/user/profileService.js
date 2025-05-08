import profileEndpoints from '../../endpoint/user/profile';
import apiClient from '../../userapi';

const profileService = {
  /**
   * Get authenticated user's profile
   */
  async getProfile() {
    try {
      const response = await apiClient.get(profileEndpoints.getProfile);
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  /**
   * Update user's profile
   * @param {Object} data - User profile data
   */
  async updateProfile(data) {
    try {
      // Add headers to ensure proper content type
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      };
      
      console.log('Sending data to API:', data);
      
      // Convert age to number if it's a string
      const formattedData = { ...data };
      if (formattedData.age && typeof formattedData.age === 'string') {
        formattedData.age = parseInt(formattedData.age, 10);
      }
      
      const response = await apiClient.put(profileEndpoints.updateProfile, formattedData, config);
      console.log('Update response:', response);
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  /**
   * Change user's password
   * @param {Object} data - Password data containing current_password and new_password
   */
  async changePassword(data) {
    try {
      const response = await apiClient.post(profileEndpoints.changePassword, data);
      return response.data;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  },

  /**
   * Get user's activity history
   */
  async getActivityHistory() {
    try {
      const response = await apiClient.get(profileEndpoints.activityHistory);
      return response.data;
    } catch (error) {
      console.error('Error fetching activity history:', error);
      throw error;
    }
  },

  /**
   * Report a bug
   * @param {Object} data - Bug report data
   */
  async reportBug(data) {
    try {
      const response = await apiClient.post(profileEndpoints.reportBug, data);
      return response.data;
    } catch (error) {
      console.error('Error reporting bug:', error);
      throw error;
    }
  },

  /**
   * Reset user password (admin only)
   * @param {number} id - User ID
   * @param {Object} data - Reset password data
   */
  async resetPassword(id, data) {
    try {
      const response = await apiClient.patch(profileEndpoints.resetPassword(id), data);
      return response.data;
    } catch (error) {
      console.error(`Error resetting password for user ${id}:`, error);
      throw error;
    }
  }
};

export default profileService; 
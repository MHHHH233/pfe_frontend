import apiClient from '../../userapi';

const userEndpoints = {
  getProfile: '/api/user/v1/profile',
  updateProfile: '/api/user/v1/profile',
  changePassword: '/api/user/v1/change-password',
  updateNotificationPreferences: '/api/user/v1/notification-preferences',
  getActivityHistory: '/api/user/v1/activity-history',
};

const userService = {
  async getProfile() {
    try {
      const response = await apiClient.get(userEndpoints.getProfile);
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  async updateProfile(data) {
    try {
      const response = await apiClient.put(userEndpoints.updateProfile, data);
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  async changePassword(data) {
    try {
      const response = await apiClient.post(userEndpoints.changePassword, data);
      return response.data;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  },

  async updateNotificationPreferences(data) {
    try {
      const response = await apiClient.put(userEndpoints.updateNotificationPreferences, data);
      return response.data;
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      throw error;
    }
  },

  async getActivityHistory() {
    try {
      const response = await apiClient.get(userEndpoints.getActivityHistory);
      return response.data;
    } catch (error) {
      console.error('Error fetching activity history:', error);
      throw error;
    }
  },
};

export default userService; 
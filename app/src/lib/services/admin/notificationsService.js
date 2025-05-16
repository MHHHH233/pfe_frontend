import notificationsEndpoints from '../../endpoint/admin/notifications';
import apiClient from '../../userapi';

const notificationsService = {
  async getNotifications() {
    try {
      const response = await apiClient.get(notificationsEndpoints.getNotifications);
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  async markAsRead(id) {
    try {
      const response = await apiClient.patch(notificationsEndpoints.markAsRead(id));
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  async markAllAsRead() {
    try {
      const response = await apiClient.patch(notificationsEndpoints.markAllAsRead);
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }
};

export default notificationsService; 
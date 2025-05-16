const BASE_URL = '/api/admin/v1';

const notificationsEndpoints = {
  // Get notification analytics
  getNotificationAnalytics: `${BASE_URL}/analytics/notifications`,
  getNotifications: '/api/admin/v1/notifications',
  markAsRead: (id) => `/api/admin/v1/notifications/${id}/read`,
  markAllAsRead: '/api/admin/v1/notifications/mark-all-read'
};

export default notificationsEndpoints; 
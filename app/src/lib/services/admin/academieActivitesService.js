import academieActivitesEndpoints from '../../endpoint/admin/academieActivites';
import apiClient from '../../userapi';

const academieActivitesService = {
  async getAllActivites(params = {}) {
    try {
      const response = await apiClient.get(academieActivitesEndpoints.getAllActivites, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching activities:', error);
      throw error;
    }
  },

  async createActivite(formData) {
    try {
      const response = await apiClient.post(academieActivitesEndpoints.createActivite, formData);
      return response.data;
    } catch (error) {
      console.error('Error creating activity:', error);
      throw error;
    }
  },

  async updateActivite(id, payload) {
    try {
      const response = await apiClient.put(academieActivitesEndpoints.updateActivite(id), payload);
      return response.data;
    } catch (error) {
      console.error(`Error updating activity ${id}:`, error);
      throw error;
    }
  },

  async deleteActivite(id) {
    try {
      const response = await apiClient.delete(academieActivitesEndpoints.deleteActivite(id));
      return response.data;
    } catch (error) {
      console.error(`Error deleting activity ${id}:`, error);
      throw error;
    }
  }
};

export default academieActivitesService; 
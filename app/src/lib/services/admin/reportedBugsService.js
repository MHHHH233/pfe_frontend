import reportedBugsEndpoints from '../../endpoint/admin/reportedBugs';
import apiClient from '../../userapi';

const reportedBugsService = {
  async getAllReportedBugs(params = {}) {
    try {
      const response = await apiClient.get(reportedBugsEndpoints.getAllReportedBugs, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching reported bugs:', error);
      throw error;
    }
  },

  async getReportedBug(id) {
    try {
      const response = await apiClient.get(reportedBugsEndpoints.getReportedBug(id));
      return response.data;
    } catch (error) {
      console.error(`Error fetching reported bug ${id}:`, error);
      throw error;
    }
  },

  async createReportedBug(formData) {
    try {
      const response = await apiClient.post(reportedBugsEndpoints.createReportedBug, formData);
      return response.data;
    } catch (error) {
      console.error('Error creating reported bug:', error);
      throw error;
    }
  },

  async updateReportedBug(id, payload) {
    try {
      const response = await apiClient.put(reportedBugsEndpoints.updateReportedBug(id), payload);
      return response.data;
    } catch (error) {
      console.error(`Error updating reported bug ${id}:`, error);
      throw error;
    }
  },

  async updateStatus(id, status) {
    try {
      const response = await apiClient.patch(reportedBugsEndpoints.updateStatus(id), { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating bug status ${id}:`, error);
      throw error;
    }
  },

  async deleteReportedBug(id) {
    try {
      const response = await apiClient.delete(reportedBugsEndpoints.deleteReportedBug(id));
      return response.data;
    } catch (error) {
      console.error(`Error deleting reported bug ${id}:`, error);
      throw error;
    }
  }
};

export default reportedBugsService; 
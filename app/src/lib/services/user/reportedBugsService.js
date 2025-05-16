import reportedBugsEndpoints from '../../endpoint/user/reportedBugs';
import apiGuest from '../../userapi';

const reportedBugsService = {
  async createBugReport(formData) {
    try {
      const response = await apiGuest.post(reportedBugsEndpoints.createBugReport, formData);
      return response.data;
    } catch (error) {
      console.error('Error creating bug report:', error);
      throw error;
    }
  },

  async deleteBugReport(id) {
    try {
      const response = await apiGuest.delete(reportedBugsEndpoints.deleteBugReport(id));
      return response.data;
    } catch (error) {
      console.error(`Error deleting bug report ${id}:`, error);
      throw error;
    }
  }
};

export default reportedBugsService; 
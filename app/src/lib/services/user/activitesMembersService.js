import activitesMembersEndpoints from '../../endpoint/admin/activitesMembers';
import apiClient from '../../userapi';

const activitesMembersService = {
  async getAllMembers(params = {}) {
    try {
      const response = await apiClient.get(activitesMembersEndpoints.getAllMembers, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching members:', error);
      throw error;
    }
  },

  async createMember(formData) {
    try {
      const response = await apiClient.post(activitesMembersEndpoints.createMember, formData);
      return response.data;
    } catch (error) {
      console.error('Error creating member:', error);
      throw error;
    }
  },

  async updateMember(id, payload) {
    try {
      const response = await apiClient.put(activitesMembersEndpoints.updateMember(id), payload);
      return response.data;
    } catch (error) {
      console.error(`Error updating member ${id}:`, error);
      throw error;
    }
  },

  async deleteMember(id) {
    try {
      const response = await apiClient.delete(activitesMembersEndpoints.deleteMember(id));
      return response.data;
    } catch (error) {
      console.error(`Error deleting member ${id}:`, error);
      throw error;
    }
  }
};

export default activitesMembersService; 
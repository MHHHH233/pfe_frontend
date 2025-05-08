import academieMemberEndpoints from '../../endpoint/user/academieMember';
import apiClient from '../../userapi';

const academieMemberService = {
  /**
   * Subscribe to an academy
   * @param {Object} data - Subscription data: { id_academie, subscription_plan }
   * @returns {Promise} - API response
   */
  async subscribe(data) {
    try {
      const response = await apiClient.post(academieMemberEndpoints.subscribe, data);
      return response.data;
    } catch (error) {
      console.error('Error subscribing to academy:', error);
      throw error;
    }
  },

  /**
   * Cancel subscription to an academy
   * @param {number} academieId - The academy ID to cancel subscription for
   * @returns {Promise} - API response
   */
  async cancelSubscription(academieId) {
    try {
      const response = await apiClient.delete(academieMemberEndpoints.cancelSubscription(academieId));
      return response.data;
    } catch (error) {
      console.error(`Error cancelling academy subscription ${academieId}:`, error);
      throw error;
    }
  },

  /**
   * Get user's academy memberships
   * @returns {Promise} - API response with memberships
   */
  async getMyMemberships() {
    try {
      const response = await apiClient.get(academieMemberEndpoints.getMyMemberships);
      return response.data;
    } catch (error) {
      console.error('Error fetching academy memberships:', error);
      throw error;
    }
  },

  /**
   * Update membership subscription plan
   * @param {number} academieId - The academy ID
   * @param {Object} data - Update data: { subscription_plan }
   * @returns {Promise} - API response
   */
  async updatePlan(academieId, data) {
    try {
      const response = await apiClient.patch(
        academieMemberEndpoints.updatePlan(academieId), 
        data
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating academy subscription plan ${academieId}:`, error);
      throw error;
    }
  }
};

export default academieMemberService; 
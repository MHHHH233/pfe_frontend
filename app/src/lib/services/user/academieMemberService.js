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
      // First check if we've already processed this payment intent
      if (data.payment_intent_id) {
        // Check for session storage to see if this payment was already processed
        const lastPaymentId = sessionStorage.getItem('last_payment_id');
        if (lastPaymentId === data.payment_intent_id) {
          // Return a simulated successful response
          return {
            success: true,
            message: 'Subscription was already processed successfully',
            data: {
              id_member: sessionStorage.getItem('academy_member_id') || data.payment_intent_id,
              id_academie: data.id_academie,
              subscription_plan: data.subscription_plan,
              payment_method: data.payment_method,
              payment_intent_id: data.payment_intent_id,
              status: 'active',
              created_at: new Date().toISOString()
            }
          };
        }
      }
      
      // Attempt the API call
      const response = await apiClient.post(academieMemberEndpoints.subscribe, data);
      
      // On success, cache the payment ID to avoid duplicate processing
      if (data.payment_intent_id) {
        try {
          sessionStorage.setItem('last_payment_id', data.payment_intent_id);
          sessionStorage.setItem('last_payment_status', data.payment_status || 'succeeded');
          sessionStorage.setItem('last_payment_timestamp', Date.now().toString());
          
          // Also store the member ID if available
          if (response.data && response.data.id_member) {
            sessionStorage.setItem('academy_member_id', response.data.id_member);
          }
        } catch (storageError) {
          console.warn('Could not store payment data in session storage:', storageError);
        }
      }
      
      return response.data;
    } catch (error) {
      // Handle specific Stripe errors
      if (error.response && error.response.data) {
        const responseData = error.response.data;
        
        // Check for payment_intent_unexpected_state error
        if (responseData.error && 
            responseData.error.code === 'payment_intent_unexpected_state' && 
            data.payment_intent_id) {
          
          console.warn('Payment intent already processed by Stripe:', responseData.error.message);
          
          // Store the payment ID to avoid future duplicate processing
          try {
            sessionStorage.setItem('last_payment_id', data.payment_intent_id);
            sessionStorage.setItem('last_payment_status', 'succeeded');
            sessionStorage.setItem('last_payment_timestamp', Date.now().toString());
          } catch (storageError) {
            console.warn('Could not store payment data in session storage:', storageError);
          }
          
          // Return a simulated successful response
          return {
            success: true,
            message: 'Subscription activated with already processed payment',
            data: {
              id_member: data.payment_intent_id, // Use payment intent ID as fallback member ID
              id_academie: data.id_academie,
              subscription_plan: data.subscription_plan,
              payment_method: data.payment_method,
              payment_intent_id: data.payment_intent_id,
              status: 'active',
              created_at: new Date().toISOString()
            }
          };
        }
      }
      
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
import paymentEndpoints from '../../endpoint/admin/payments';
import apiClient from '../../userapi';

const paymentService = {
  async getAllPayments(params = {}) {
    try {
      const response = await apiClient.get(paymentEndpoints.getAllPayments, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }
  },

  async getPayment(id) {
    try {
      const response = await apiClient.get(paymentEndpoints.getPayment(id));
      return response.data;
    } catch (error) {
      console.error(`Error fetching payment ${id}:`, error);
      throw error;
    }
  },

  async updatePaymentStatus(id, payload) {
    try {
      const response = await apiClient.patch(paymentEndpoints.updatePaymentStatus(id), payload);
      return response.data;
    } catch (error) {
      console.error(`Error updating payment status ${id}:`, error);
      throw error;
    }
  },

  async deletePayment(id) {
    try {
      const response = await apiClient.delete(paymentEndpoints.deletePayment(id));
      return response.data;
    } catch (error) {
      console.error(`Error deleting payment ${id}:`, error);
      throw error;
    }
  }
};

export default paymentService; 
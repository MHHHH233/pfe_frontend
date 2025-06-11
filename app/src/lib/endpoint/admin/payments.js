const BASE_URL = '/api/admin/v1/payments';

const paymentEndpoints = {
  getAllPayments: BASE_URL,
  getPayment: (id) => `${BASE_URL}/${id}`,
  updatePaymentStatus: (id) => `${BASE_URL}/${id}/status`,
  deletePayment: (id) => `${BASE_URL}/${id}`,
};

export default paymentEndpoints; 
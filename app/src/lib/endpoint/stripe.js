const BASE_URL = "/api/";

export const stripe = {
  baseUrl: BASE_URL,
  createPaymentIntent: () => `${BASE_URL}create-payment-intent`,
  retrievePaymentIntent: (paymentIntentId) => `${BASE_URL}payment-intent/${paymentIntentId}`,
  attachPaymentMethod: () => `${BASE_URL}attach-payment-method`,
  webhook: () => `${BASE_URL}webhook/stripe`,
  getStripeKey: () => `${BASE_URL}payment/get-stripe-key`,
  createReservationIntent: () => `${BASE_URL}payment/create-reservation-intent`,
  createSubscriptionIntent: () => `${BASE_URL}payment/create-subscription-intent`,
  confirmPayment: () => `${BASE_URL}payment/confirm`,
}; 
/**
 * Service for handling Stripe payment operations
 */

import { stripe } from "../endpoint/stripe";
import guestapi from "../guestapi";
import userapi from "../userapi";

// Store the Stripe publishable key once received
let cachedStripeKey = null;

/**
 * Utility function to ensure amount is properly formatted in cents for Stripe
 * @param {number|string} amount - Amount in currency units or cents
 * @returns {number} - Amount in cents, properly rounded to an integer
 */
const ensureAmountInCents = (amount) => {
  if (!amount && amount !== 0) return 0;
  
  // Parse to number if it's a string
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount)) return 0;
  
  // If already in cents (large number)
  if (numAmount >= 1000) {
    return Math.round(numAmount);
  }
  
  // If amount is likely in currency units (small number with decimals)
  if (numAmount < 100 || !Number.isInteger(numAmount)) {
    return Math.round(numAmount * 100);
  }
  
  // For borderline cases, assume it's in cents if it's a whole number
  return Math.round(numAmount);
};

/**
 * Get the Stripe publishable key from the backend
 * @returns {Promise<string>} - Stripe publishable key
 */
export const getStripeKey = async () => {
  // Return cached key if available
  if (cachedStripeKey) {
    return cachedStripeKey;
  }
  
  // Check sessionStorage for previously saved key
  try {
    const sessionKey = sessionStorage.getItem('stripe_key');
    if (sessionKey) {
      cachedStripeKey = sessionKey;
      return sessionKey;
    }
  } catch (e) {
    console.warn('Could not access sessionStorage for Stripe key');
  }
  
  // Check environment variables before making API call
  // First try the newer STRIPE_KEY variable
  let envKey = process.env.STRIPE_KEY;
  
  // If not found, try the older REACT_APP_STRIPE_KEY pattern
  if (!envKey) {
    envKey = process.env.REACT_APP_STRIPE_KEY;
  }
  
  if (envKey) {
    cachedStripeKey = envKey;
    return envKey;
  }
  
  // If not found in environment, try to get from API
  try {
    const response = await guestapi.get(stripe.getStripeKey());
    
    if (response.data.publishableKey) {
      cachedStripeKey = response.data.publishableKey;
      
      // Also save to sessionStorage for recovery
      try {
        sessionStorage.setItem('stripe_key', response.data.publishableKey);
      } catch (e) {
        console.warn('Could not save Stripe key to sessionStorage');
      }
      
      return response.data.publishableKey;
    }
    
    throw new Error('No publishable key returned from server');
  } catch (error) {
    console.error('Error getting Stripe key from API:', error);
    
    // If all else fails, return a default test key
    const defaultKey = 'pk_test_TYooMQauvdEDq54NiTphI7jx';
    console.warn('Using default test Stripe key');
    
    cachedStripeKey = defaultKey;
    return defaultKey;
  }
};

/**
 * Create a generic payment intent
 * @param {Object} paymentData - Payment data including amount, currency, and metadata
 * @returns {Promise<Object>} - Payment intent with client secret
 */
export const createPaymentIntent = async (paymentData) => {
  try {
    // Ensure amount is in cents
    const amountInCents = ensureAmountInCents(paymentData.amount);
    
    const response = await guestapi.post(stripe.createPaymentIntent(), {
      amount: amountInCents,
      currency: paymentData.currency || 'mad',
      metadata: {
        ...paymentData.metadata || {},
        original_amount: paymentData.amount.toString(), // Save original amount for reference
      }
    });

    // Store the Stripe key if provided in the response
    if (response.data.publishableKey) {
      cachedStripeKey = response.data.publishableKey;
      
      // Also save to sessionStorage
      try {
        sessionStorage.setItem('stripe_key', response.data.publishableKey);
      } catch (e) {
        console.warn('Could not save Stripe key to sessionStorage');
      }
    }
    
    // Store the client secret in session storage for potential recovery
    if (response.data.clientSecret) {
      try {
        sessionStorage.setItem('last_client_secret', response.data.clientSecret);
        sessionStorage.setItem('last_client_secret_timestamp', Date.now().toString());
      } catch (e) {
        console.warn('Could not save client secret to sessionStorage');
      }
    }
    
    return response.data;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw {
      error: {
        type: 'api_error',
        message: error.message || 'Failed to create payment intent'
      }
    };
  }
};

/**
 * Create a payment intent for reservation payment
 * @param {Object} reservationData - Reservation data
 * @returns {Promise<Object>} - Payment intent with client secret
 */
export const createReservationPaymentIntent = async (reservationData) => {
  try {
    // Extract and validate price
    const price = parseFloat(reservationData.price || reservationData.prix || 100);
    if (isNaN(price) || price <= 0) {
      throw {
        error: {
          type: 'validation_error',
          message: 'Invalid price for reservation'
        }
      };
    }
    
    // Create metadata from reservation data
    const metadata = {
      type: 'reservation',
      id_terrain: reservationData.id_terrain,
      date: reservationData.date,
      heure: reservationData.heure,
      id_client: reservationData.id_client || null,
      original_price: price.toString(), // Store original price for reference
    };
    
    const response = await guestapi.post(stripe.createReservationIntent(), {
      amount: ensureAmountInCents(price),
      currency: 'mad',
      metadata: metadata
    });

    // Store the Stripe key if provided in the response
    if (response.data.publishableKey) {
      cachedStripeKey = response.data.publishableKey;
      
      // Also save to sessionStorage
      try {
        sessionStorage.setItem('stripe_key', response.data.publishableKey);
      } catch (e) {
        console.warn('Could not save Stripe key to sessionStorage');
      }
    }
    
    // Store successful payment intent for reservation for recovery
    if (response.data.clientSecret) {
      try {
        sessionStorage.setItem('last_reservation_client_secret', response.data.clientSecret);
        sessionStorage.setItem('last_reservation_data', JSON.stringify({
          id_terrain: reservationData.id_terrain,
          date: reservationData.date,
          heure: reservationData.heure,
          price: price
        }));
        sessionStorage.setItem('last_reservation_timestamp', Date.now().toString());
      } catch (e) {
        console.warn('Could not save reservation data to sessionStorage');
      }
    }

    return response.data;
  } catch (error) {
    console.error('Error creating reservation payment intent:', error);
    
    // Make sure we're returning a consistent error structure
    if (!error.error) {
      error = {
        error: {
          type: 'api_error',
          message: error.message || 'Failed to create reservation payment intent'
        }
      };
    }
    
    throw error;
  }
};

/**
 * Create a payment intent for subscription payment
 * @param {Object} subscriptionData - Subscription data
 * @returns {Promise<Object>} - Payment intent with client secret
 */
export const createSubscriptionPaymentIntent = async (subscriptionData) => {
  try {
    // Extract price from subscription data
    const price = parseFloat(subscriptionData.price);
    
    const response = await guestapi.post(stripe.createSubscriptionIntent(), {
      amount: ensureAmountInCents(price),
      currency: 'mad',
      metadata: {
        type: 'subscription',
        plan_name: subscriptionData.planName,
        is_annual: subscriptionData.isAnnual,
        user_id: subscriptionData.userId || null,
        original_price: price.toString(), // Store original price for reference
      }
    });

    // Store the Stripe key if provided in the response
    if (response.data.publishableKey) {
      cachedStripeKey = response.data.publishableKey;
    }

    return response.data;
  } catch (error) {
    console.error('Error creating subscription payment intent:', error);
    
    // Make sure we're returning a consistent error structure
    if (!error.error) {
      error = {
        error: {
          type: 'api_error',
          message: error.message || 'An unknown error occurred'
        }
      };
    }
    
    throw error;
  }
};

/**
 * Retrieve a payment intent by ID
 * @param {string} paymentIntentId - Payment intent ID from Stripe
 * @returns {Promise<Object>} - Payment intent details
 */
export const retrievePaymentIntent = async (paymentIntentId) => {
  try {
    const response = await guestapi.get(stripe.retrievePaymentIntent(paymentIntentId));
    return response.data;
  } catch (error) {
    console.error('Error retrieving payment intent:', error);
    throw {
      error: {
        type: 'api_error',
        message: error.message || 'Failed to retrieve payment intent'
      }
    };
  }
};

/**
 * Attach a payment method to a payment intent
 * @param {string} paymentIntentId - Payment intent ID
 * @param {string} paymentMethodId - Payment method ID
 * @returns {Promise<Object>} - Updated payment intent
 */
export const attachPaymentMethod = async (paymentIntentId, paymentMethodId) => {
  try {
    const response = await userapi.post(stripe.attachPaymentMethod(), {
      payment_intent_id: paymentIntentId,
      payment_method_id: paymentMethodId
    });
    return response.data;
  } catch (error) {
    console.error('Error attaching payment method:', error);
    throw {
      error: {
        type: 'api_error',
        message: error.message || 'Failed to attach payment method'
      }
    };
  }
};

/**
 * Confirm successful payment and update backend records
 * @param {string} paymentIntentId - Payment intent ID from Stripe
 * @param {Object} paymentData - Additional payment data
 * @returns {Promise<Object>} - Updated payment record
 */
export const confirmPayment = async (paymentIntentId, paymentData) => {
  try {
    const response = await userapi.post(stripe.confirmPayment(), {
      payment_intent_id: paymentIntentId,
      ...paymentData
    });

    return response.data;
  } catch (error) {
    console.error('Error confirming payment:', error);
    
    // Make sure we're returning a consistent error structure
    if (!error.error) {
      error = {
        error: {
          type: 'api_error',
          message: error.message || 'An unknown error occurred'
        }
      };
    }
    
    throw error;
  }
};

export default {
  getStripeKey,
  createPaymentIntent,
  createReservationPaymentIntent,
  createSubscriptionPaymentIntent,
  retrievePaymentIntent,
  attachPaymentMethod,
  confirmPayment,
  // Export the cached key for direct access
  get stripeKey() {
    return cachedStripeKey;
  }
}; 
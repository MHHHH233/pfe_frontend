import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CreditCard, CheckCircle, X, Lock, Calendar } from 'lucide-react';
import stripeService from '../../lib/services/stripeService';

const cardStyle = {
  style: {
    base: {
      color: '#ffffff',
      fontFamily: 'Arial, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};

const AcademicPaymentModal = ({ 
  show, 
  onClose, 
  planName,
  price,
  isAnnual,
  onSuccess,
  clientSecret,
  subscriptionData
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [succeeded, setSucceeded] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [paymentIntent, setPaymentIntent] = useState(null);

  useEffect(() => {
    if (show) {
      // Reset state when modal opens
      setError(null);
      setSucceeded(false);
      setProcessing(false);
      
      // Pre-fill with user data if available
      setEmailInput(sessionStorage.getItem("email") || '');
      setNameInput(sessionStorage.getItem("name") || '');
      setPhoneInput('');
      
      // If subscription data is provided, use it
      if (subscriptionData) {
        if (subscriptionData.email) setEmailInput(subscriptionData.email);
        if (subscriptionData.name) setNameInput(subscriptionData.name);
        if (subscriptionData.phone) setPhoneInput(subscriptionData.phone);
      }
      
      // If no client secret was provided, create a payment intent
      if (!clientSecret && !paymentIntent) {
        createSubscriptionIntent();
      }
    }
  }, [show, subscriptionData, clientSecret, paymentIntent]);
  
  const createSubscriptionIntent = async () => {
    try {
      setProcessing(true);
      
      const subscriptionPayload = {
        price: price,
        planName: planName,
        isAnnual: isAnnual,
        userId: parseInt(sessionStorage.getItem("userId")) || null,
      };
      
      const response = await stripeService.createSubscriptionPaymentIntent(subscriptionPayload);
      
      if (response.clientSecret) {
        setPaymentIntent(response);
      } else {
        throw new Error('No client secret returned from server');
      }
      
      setProcessing(false);
    } catch (error) {
      console.error('Error creating subscription intent:', error);
      setError(error.message || 'Failed to initialize payment. Please try again.');
      setProcessing(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      return;
    }
    
    // Validate inputs
    if (!nameInput.trim()) {
      setError('Please enter cardholder name');
      return;
    }
    
    if (!emailInput.trim() || !emailInput.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    setProcessing(true);
    setError(null);
    
    try {
      // Get a reference to the CardElement
      const cardElement = elements.getElement(CardElement);
      
      // Create payment method
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: nameInput,
          email: emailInput,
          phone: phoneInput || undefined,
        },
      });
      
      if (paymentMethodError) {
        setError(paymentMethodError.message);
        setProcessing(false);
        return;
      }
      
      // Get the client secret - either from props or from our created payment intent
      const secret = clientSecret || paymentIntent?.clientSecret;
      
      if (!secret) {
        throw new Error('No payment intent found. Please try again.');
      }
      
      // Confirm the payment
      const { error: confirmError, paymentIntent: confirmedIntent } = await stripe.confirmCardPayment(
        secret,
        {
          payment_method: paymentMethod.id,
        }
      );
      
      if (confirmError) {
        setError(confirmError.message);
        setProcessing(false);
        return;
      }
      
      if (confirmedIntent.status === 'succeeded') {
        // Payment succeeded, create or update subscription
        await processSuccessfulPayment(confirmedIntent);
      } else {
        throw new Error(`Payment status: ${confirmedIntent?.status || 'unknown'}. Please try again.`);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('An error occurred during payment processing. Please try again.');
      setProcessing(false);
    }
  };
  
  const processSuccessfulPayment = async (paymentIntent) => {
    try {
      // Confirm the payment with our backend
      const confirmationData = {
        type: 'subscription',
        plan_name: planName,
        is_annual: isAnnual,
        email: emailInput,
        name: nameInput,
        phone: phoneInput || undefined,
        user_id: parseInt(sessionStorage.getItem("userId")) || null,
      };
      
      await stripeService.confirmPayment(paymentIntent.id, confirmationData);
      
      // Mark payment as successful
      setSucceeded(true);
      setProcessing(false);
      
      // Notify parent component about successful payment
      if (onSuccess) {
        setTimeout(() => {
          onSuccess({
            ...confirmationData,
            payment_intent_id: paymentIntent.id,
            payment_status: 'paid',
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
          });
        }, 1500);
      }
      
      // Dispatch an event to notify about successful subscription
      const event = new CustomEvent('subscriptionSuccess', { 
        detail: { 
          refreshNeeded: true,
          subscription: {
            ...confirmationData,
            payment_intent_id: paymentIntent.id,
          }
        }
      });
      document.dispatchEvent(event);
      
    } catch (error) {
      console.error('Error confirming subscription payment:', error);
      // If payment was successful but confirmation failed, still show success
      // The webhook should handle updating the subscription status
      setSucceeded(true);
      setProcessing(false);
      
      // Call success handler anyway since the payment went through
      if (onSuccess) {
        setTimeout(() => {
          onSuccess({
            plan_name: planName,
            is_annual: isAnnual,
            payment_intent_id: paymentIntent.id,
            payment_status: 'paid',
          });
        }, 1500);
      }
    }
  };

  if (!show) return null;

  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };
  
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  // Calculate the billing period description
  const billingPeriod = isAnnual ? 'year' : 'month';
  const formattedPrice = `${price} MAD/${isAnnual ? 'year' : 'month'}`;
  
  // Format the total amount with 2 decimal places
  const formatAmount = (amount) => {
    if (!amount && amount !== 0) return '0.00';
    return parseFloat(amount).toFixed(2);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 backdrop-blur-sm"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={modalVariants}
      onClick={onClose}
    >
      <motion.div 
        className="bg-gray-900 rounded-xl p-6 max-w-[90%] w-[450px] border border-gray-800 shadow-xl"
        variants={containerVariants}
        onClick={e => e.stopPropagation()}
      >
        {succeeded ? (
          <div className="text-center py-8">
            <div className="flex justify-center mb-4">
              <CheckCircle size={60} className="text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Payment Successful!</h3>
            <p className="text-gray-400 mb-6">Your subscription to {planName} has been activated.</p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition duration-200"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Complete Payment</h3>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Plan Summary */}
            <div className="bg-gray-800 p-4 rounded-lg mb-6 border border-gray-700">
              <h4 className="text-green-400 font-medium mb-3">Subscription Details</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar size={18} className="text-blue-400 mr-2" />
                    <span className="text-white">{planName}</span>
                  </div>
                  <span className="font-medium text-white">{formattedPrice}</span>
                </div>
                
                {isAnnual && (
                  <div className="bg-blue-500/10 rounded-lg p-2 text-xs text-blue-400">
                    Annual subscription - save 10% compared to monthly billing
                  </div>
                )}
                
                <div className="pt-2 border-t border-gray-700 flex justify-between font-medium">
                  <span className="text-gray-400">Total billed today:</span>
                  <span className="text-white">{formatAmount(price)} MAD</span>
                </div>
              </div>
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Name on Card</label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Email</label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="email@example.com"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Phone (Optional)</label>
                  <input
                    type="tel"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="+212 6XX XXXXXX"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Card Details</label>
                  <div className="p-3 bg-gray-800 border border-gray-700 rounded-lg">
                    <CardElement options={cardStyle} />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    * For testing, use card number: 4242 4242 4242 4242
                  </p>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={!stripe || processing || !paymentIntent?.clientSecret && !clientSecret}
                className={`w-full py-3 rounded-lg font-medium transition duration-200 ${
                  processing || !paymentIntent?.clientSecret && !clientSecret
                    ? 'bg-gray-700 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700'
                } text-white`}
              >
                {processing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Processing...
                  </div>
                ) : !paymentIntent?.clientSecret && !clientSecret ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Initializing Payment...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <CreditCard className="mr-2" size={18} />
                    Pay {formatAmount(price)} MAD
                  </div>
                )}
              </button>
            </form>
            
            <div className="flex items-center justify-center mt-6 text-xs text-gray-500">
              <Lock size={12} className="mr-1" />
              Secure payment processed by Stripe
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default AcademicPaymentModal; 
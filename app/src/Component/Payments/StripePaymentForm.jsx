import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CreditCard, CheckCircle, X, Lock, AlertCircle, Mail } from 'lucide-react';
import stripeService from '../../lib/services/stripeService';
import userReservationService from '../../lib/services/user/reservationServices';
import adminReservationService from '../../lib/services/admin/reservationServices';

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

const fadeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

const StripePaymentForm = ({ 
  amount, 
  currency = 'mad',
  onSuccess, 
  onError,
  onCancel,
  metadata = {},
  buttonText = 'Pay Now',
  showBillingDetails = true,
  customDescription,
  hideSummary = false
}) => {
  const stripe = useStripe();
  const elements = useElements();
  
  // Form state
  const [billingDetails, setBillingDetails] = useState({
    name: sessionStorage.getItem("name") || '',
    email: sessionStorage.getItem("email") || '',
    phone: ''
  });
  
  // Payment state
  const [clientSecret, setClientSecret] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('initial'); // initial, processing, succeeded, error
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // New state for handling new user notifications
  const [isNewUser, setIsNewUser] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  // New state for handling email confirmation notifications
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [emailConfirmationDetails, setEmailConfirmationDetails] = useState({
    email: '',
    isReservation: false,
    reservationNumber: ''
  });
  
  // Create payment intent when component mounts
  useEffect(() => {
    const createPaymentIntent = async () => {
      if (!amount) return;
      
      setIsLoading(true);
      
      try {
        // Clear any cached client secret from previous payments
        sessionStorage.removeItem('stripe_client_secret');
        sessionStorage.removeItem('last_stripe_api_call_time');
        
        console.log('Creating payment intent with amount:', amount);
        
        // Ensure amount is properly formatted for Stripe
        // Stripe requires amount in cents (integer)
        let amountInCents = amount;
        
        // If amount is a string, parse it
        if (typeof amount === 'string') {
          amountInCents = Math.round(parseFloat(amount) * 100);
          console.log(`Converting string amount to cents: ${amount} -> ${amountInCents}`);
        } 
        // If amount is a small number (likely in MAD/dollars), convert to cents
        else if (typeof amount === 'number' && amount < 10000) {
          amountInCents = Math.round(amount * 100);
          console.log(`Converting MAD amount to cents: ${amount} -> ${amountInCents}`);
        }
        // If amount is already a large number, assume it's already in cents
        else if (typeof amount === 'number' && amount >= 10000) {
          console.log(`Amount appears to already be in cents: ${amount}`);
          amountInCents = Math.round(amount); // Ensure it's an integer
        }
        
        // Make a new API call for each payment attempt
        const response = await stripeService.createPaymentIntent({
          amount: amountInCents, // Send the processed amount in cents
          currency,
          metadata: {
            ...metadata,
            original_amount: amount.toString(), // Save original amount for reference
            timestamp: Date.now() // Add timestamp to make each request unique
          }
        });
        
        if (response.clientSecret) {
          // Save the client secret and current time
          setClientSecret(response.clientSecret);
          sessionStorage.setItem('stripe_client_secret', response.clientSecret);
          sessionStorage.setItem('last_stripe_api_call_time', Date.now().toString());
        } else {
          throw new Error('No client secret returned from the server');
        }
      } catch (error) {
        console.error('Error creating payment intent:', error);
        setErrorMessage(error.message || 'Failed to initialize payment. Please try again.');
        setPaymentStatus('error');
        if (onError) onError(error);
      } finally {
        setIsLoading(false);
      }
    };
    
    createPaymentIntent();
    
    // Cleanup function to reset state when unmounting
    return () => {
      // Clear any cached client secret when component unmounts
      sessionStorage.removeItem('stripe_client_secret');
      sessionStorage.removeItem('last_stripe_api_call_time');
    };
  }, [amount, currency, metadata, onError]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillingDetails(prev => ({ ...prev, [name]: value }));
  };
  
  const validateForm = () => {
    // Reset error message
    setErrorMessage('');
    
    // Validate name if billing details are shown
    if (showBillingDetails && !billingDetails.name.trim()) {
      setErrorMessage('Please enter your name');
      return false;
    }
    
    // Validate email if billing details are shown
    if (showBillingDetails && (!billingDetails.email.trim() || !billingDetails.email.includes('@'))) {
      setErrorMessage('Please enter a valid email address');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if Stripe is loaded
    if (!stripe || !elements) {
      setErrorMessage('Payment processor is still loading. Please try again in a moment.');
      return;
    }
    
    // Validate form
    if (!validateForm()) return;
    
    // Update UI state
    setPaymentStatus('processing');
    setIsLoading(true);
    
    try {
      // Get card element
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error('Card element not found');
      }
      
      // Create payment method
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: showBillingDetails ? {
          name: billingDetails.name,
          email: billingDetails.email,
          phone: billingDetails.phone || undefined,
        } : undefined,
      });
      
      // Handle payment method creation error
      if (paymentMethodError) {
        throw new Error(paymentMethodError.message);
      }
      
      // Try to confirm card payment
      let paymentIntent;
      try {
        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: paymentMethod.id,
        });
        
        if (result.error) {
          throw result.error;
        }
        
        // Get the payment intent from the result
        paymentIntent = result.paymentIntent;
      } catch (confirmError) {
        // Handle specific error cases
        if (confirmError.type === 'invalid_request_error' && 
            confirmError.code === 'payment_intent_unexpected_state') {
          console.log('Payment intent already succeeded, retrieving payment intent info...');
          
          // Extract payment intent from the error response
          if (confirmError.payment_intent && confirmError.payment_intent.status === 'succeeded') {
            // Use the payment intent from the error response
            paymentIntent = confirmError.payment_intent;
          } else {
            throw new Error('Payment intent already processed but details not available');
          }
        } else {
          // Rethrow other errors
          throw confirmError;
        }
      }
      
      // Handle successful payment
      if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('Payment succeeded:', paymentIntent);
        
        // Reset previous popup states
        setIsNewUser(false);
        setNewUserEmail('');
        setShowEmailConfirmation(false);
        setEmailConfirmationDetails({
          email: '',
          isReservation: false,
          reservationNumber: ''
        });
        
        // Store payment details in session storage
        try {
          sessionStorage.setItem('last_successful_payment_id', paymentIntent.id);
          sessionStorage.setItem('last_successful_client_secret', clientSecret);
          sessionStorage.setItem('last_payment_status', paymentIntent.status);
          sessionStorage.setItem('last_payment_amount', paymentIntent.amount.toString());
          // Store timestamp of successful payment
          sessionStorage.setItem('last_payment_timestamp', Date.now().toString());
          
          // Clear the current client secret to ensure a new one is generated for the next payment
          sessionStorage.removeItem('stripe_client_secret');
          sessionStorage.removeItem('last_stripe_api_call_time');
          
          // Increment the reservation count for successful online payments
          incrementReservationCount();
        } catch (error) {
          console.warn('Could not store payment details in session storage:', error);
        }
        
        // Create a reservation if this is a reservation payment
        if (metadata.type === 'reservation') {
          try {
            // Explicitly create a reservation
            // This function will handle setting popup states based on the response
            const reservationResponse = await createReservationAfterPayment(paymentIntent);
            console.log('Reservation response after payment:', reservationResponse);
            
            // The createReservationAfterPayment function already handles popup states
            // so we don't need to do it here.
            
            // Only call onSuccess if we didn't show any popups
            // Otherwise, let the useEffect handle calling onSuccess after popups are closed
            if (!isNewUser && !showEmailConfirmation && !reservationResponse.is_new_user && !reservationResponse.email_sent) {
              console.log('No popups shown, calling onSuccess directly');
              if (onSuccess) {
                onSuccess(paymentIntent, reservationResponse);
              }
            } else {
              console.log('Popups are being shown, onSuccess will be called after popups close');
            }
          } catch (error) {
            console.error('Error creating reservation:', error);
            
            // Still set success state for the payment itself
            setPaymentStatus('succeeded');
            
            // Call success with just the payment intent
            if (onSuccess) {
              onSuccess(paymentIntent);
            }
          }
        } else {
          // For non-reservation payments, just set success state and call the callback
          setPaymentStatus('succeeded');
          if (onSuccess) {
            onSuccess(paymentIntent);
          }
        }
      } else {
        // Payment requires additional actions
        throw new Error(`Payment status: ${paymentIntent?.status || 'unknown'}. Please try again.`);
      }
    } catch (error) {
      console.error('Payment error:', error);
      
      // Check if this is a Stripe error with a specific structure
      if (error.error && error.error.type === 'invalid_request_error') {
        if (error.error.code === 'payment_intent_unexpected_state') {
          // This error means the payment intent is already in a succeeded state
          // Extract the payment intent from the error and treat it as a success
          if (error.error.payment_intent && error.error.payment_intent.status === 'succeeded') {
            console.log('Found succeeded payment in error object, treating as success');
            
            const paymentIntent = error.error.payment_intent;
            setPaymentStatus('succeeded');
            
            // Store the payment intent ID in session storage
            try {
              sessionStorage.setItem('last_successful_payment_id', paymentIntent.id);
              sessionStorage.setItem('last_successful_client_secret', clientSecret);
              sessionStorage.setItem('last_payment_status', paymentIntent.status);
              sessionStorage.setItem('last_payment_amount', paymentIntent.amount.toString());
              sessionStorage.setItem('last_payment_timestamp', Date.now().toString());
              
              // Clear the current client secret
              sessionStorage.removeItem('stripe_client_secret');
              sessionStorage.removeItem('last_stripe_api_call_time');
            } catch (storageError) {
              console.warn('Could not store payment details in session storage:', storageError);
            }
            
            // Call success callback with the payment intent
            if (onSuccess) {
              onSuccess(paymentIntent);
            }
            
            return;
          }
        } else if (error.error.code === 'resource_missing') {
          setErrorMessage('Payment session has expired. Attempting to restart...');
          // Automatically regenerate the payment intent
          regeneratePaymentIntent();
          return; // Exit early as we're handling this error by regenerating
        } else {
          setErrorMessage(error.error.message || 'An error occurred during payment processing.');
        }
      } else {
        setErrorMessage(error.message || 'An error occurred during payment processing. Please try again.');
      }
      
      setPaymentStatus('error');
      
      // Call error callback
      if (onError) {
        onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Format amount for display - fix to handle cents correctly
  const formatAmount = (amount) => {
    if (!amount && amount !== 0) return '0.00';
    
    // Ensure amount is a number
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return '0.00';
    
    // Always display the original amount without dividing by 100
    // This is to ensure that what's passed in is what's displayed
    const displayValue = numAmount.toFixed(2);
    
    // Always ensure we have 2 decimal places
    return parseFloat(displayValue).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  
  // Add a new function to regenerate the payment intent
  const regeneratePaymentIntent = async () => {
    setErrorMessage('Payment session expired. Generating a new payment session...');
    setIsLoading(true);
    
    try {
      const response = await stripeService.createPaymentIntent({
        amount,
        currency,
        metadata
      });
      
      if (response.clientSecret) {
        setClientSecret(response.clientSecret);
        setErrorMessage('');
        setPaymentStatus('initial');
      } else {
        throw new Error('Failed to create a new payment session');
      }
    } catch (error) {
      console.error('Error regenerating payment intent:', error);
      setErrorMessage('Unable to restart payment session. Please try again later.');
      setPaymentStatus('error');
      if (onError) onError(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update the createReservationAfterPayment function to use reservationService
  const createReservationAfterPayment = async (paymentIntent) => {
    try {
      console.log('Creating reservation after payment success');
      console.log('Payment intent:', paymentIntent);
      console.log('Metadata:', metadata);
      
      // Extract required reservation data from metadata
      let reservationData = {};
      
      // First, try to parse the reservation_data from metadata
      if (metadata.reservation_data) {
        try {
          reservationData = JSON.parse(metadata.reservation_data);
          console.log('Parsed reservation data from metadata:', reservationData);
        } catch (parseError) {
          console.error('Error parsing reservation data from metadata:', parseError);
        }
      }
      
      // If we don't have a proper reservation data object, build it from individual metadata fields
      if (!reservationData.id_terrain) {
        reservationData = {
          id_terrain: metadata.id_terrain,
          date: metadata.date,
          heure: metadata.heure,
          id_client: metadata.id_client || null,
          // Use price from metadata if available
          price: metadata.price || null,
        };
      }
      
      // IMPORTANT: Get the original price from the metadata
      // This is crucial to maintain the actual price value
      const originalPrice = parseFloat(metadata.price || reservationData.price || 100);
      console.log('Original price from metadata:', originalPrice);
      
      // Use the original price directly without multiplying by 100
      let amountInCents = Math.round(originalPrice);
      console.log('Using original price value for amount:', amountInCents);
      
      // Ensure we have the client's info from session storage or billing details
      const userId = sessionStorage.getItem("userId");
      const userType = sessionStorage.getItem("type");
      const isAdmin = userType === "admin";
      
      // Combine data to create a complete reservation object
      const completeReservationData = {
        ...reservationData,
        id_client: reservationData.id_client || userId || null,
        Name: reservationData.Name || billingDetails.name || sessionStorage.getItem("name") || 'Guest',
        email: reservationData.email || billingDetails.email || sessionStorage.getItem("email") || '',
        telephone: reservationData.telephone || billingDetails.phone || '',
        // IMPORTANT: Use the original price value (dollars/MAD)
        price: originalPrice,
        payment_method: 'stripe', // Specifically use 'stripe' as the payment method
        payment_status: 'paid',
        payment_intent_id: paymentIntent.id,
        // Use the amount in cents we calculated above
        amount: amountInCents,
        currency: paymentIntent.currency || 'mad',
        type: reservationData.type || (isAdmin ? 'admin' : 'client'),
      };
      
      console.log('Complete reservation data with original price:', completeReservationData);
      
      // First try using the appropriate reservationService based on user type
      try {
        // Choose the appropriate service based on user type
        const reservationService = isAdmin ? adminReservationService : userReservationService;
        
        console.log(`Using ${isAdmin ? 'adminReservationService' : 'userReservationService'} to create reservation`);
        const serviceResponse = await reservationService.createReservation(completeReservationData);
        console.log('Reservation created successfully using service:', serviceResponse);

        // Increment the reservation count only for regular users
        if (!isAdmin) {
          incrementReservationCount();
        }

        // IMPORTANT: Check for is_new_user and email_sent flags in the response
        const isNewUser = serviceResponse.is_new_user === true;
        const emailSent = serviceResponse.email_sent === true;
        const userEmail = serviceResponse.user_email || billingDetails.email || '';
        const reservationNumber = serviceResponse.data?.num_res || '';
        
        console.log('Checking for special flags in response:', {
          isNewUser,
          emailSent,
          userEmail,
          reservationNumber
        });

        // IMPORTANT: Explicitly set popup states based on response flags
        if (isNewUser) {
          console.log('New user created, showing new user popup');
          // Reset any previous popup state
          setShowEmailConfirmation(false);
          
          // Set new user popup state
          setIsNewUser(true);
          setNewUserEmail(userEmail);
          
          // Store email details for later
          if (emailSent) {
            setEmailConfirmationDetails({
              email: userEmail,
              isReservation: true,
              reservationNumber: reservationNumber
            });
          }
        }
        else if (emailSent) {
          console.log('Email sent, showing email confirmation popup');
          // No new user, but email was sent - show email popup directly
          setIsNewUser(false);
          setShowEmailConfirmation(true);
          setEmailConfirmationDetails({
            email: userEmail,
            isReservation: true,
            reservationNumber: reservationNumber
          });
        }
        else {
          console.log('No special flags, setting payment status to succeeded');
          // No special flags, just set payment status to succeeded
          setPaymentStatus('succeeded');
        }

        // First dispatch the general reservation success event
        const reservationEvent = new CustomEvent('reservationSuccess', { 
          detail: { 
            response: serviceResponse,
            paymentIntent: paymentIntent,
            refreshNeeded: true,
            isAdmin: isAdmin,
            reservationConfirmed: true,
            is_new_user: isNewUser,
            user_email: userEmail,
            email_sent: emailSent,
            num_res: reservationNumber
          }
        });
        document.dispatchEvent(reservationEvent);

        // Then dispatch a more specific payment success event
        // This will trigger the email confirmation popups in Confirmation.jsx
        const paymentSuccessEvent = new CustomEvent('paymentSuccess', {
          detail: {
            type: 'reservation',
            paymentIntent,
            is_new_user: isNewUser,
            user_email: userEmail,
            email_sent: emailSent,
            num_res: reservationNumber,
            reservationData: serviceResponse
          }
        });
        document.dispatchEvent(paymentSuccessEvent);

        return serviceResponse;
      } catch (serviceError) {
        console.error('Error creating reservation via service:', serviceError);
        throw serviceError;
      }
    } catch (error) {
      console.error('Failed to create reservation after payment:', error);
      throw error;
    }
  };
  
  // Add this function to increment the reservation count
  const incrementReservationCount = () => {
    try {
      const userId = sessionStorage.getItem("userId");
      const isAdmin = sessionStorage.getItem("type") === "admin";
      
      // Only increment for regular users who are logged in
      if (userId && !isAdmin) {
        const currentCount = parseInt(sessionStorage.getItem("today_reservations_count") || "0");
        const newCount = currentCount + 1;
        console.log(`Incrementing reservation count: ${currentCount} -> ${newCount}`);
        sessionStorage.setItem("today_reservations_count", newCount.toString());
        
        // Dispatch event to notify about count update
        const event = new CustomEvent('reservationCountUpdated', { 
          detail: { count: newCount }
        });
        document.dispatchEvent(event);
        
        // ALWAYS call the API to refresh the count from the server
        console.log("Calling refreshReservationCount API after successful payment");
        userReservationService.refreshReservationCount()
          .then(serverCount => {
            console.log("Server count after refresh:", serverCount);
          })
          .catch(error => {
            console.error("Error refreshing count from server:", error);
          });
        
        return newCount;
      } else {
        console.log("Not incrementing count for admin user or non-logged in user");
        return null;
      }
    } catch (error) {
      console.error("Error incrementing reservation count:", error);
      return null;
    }
  };
  
  // Add the NewUserPopup component
  const NewUserPopup = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-[9999]">
        <motion.div
          className="bg-[#1a1a1a] rounded-2xl p-6 max-w-[90%] w-[380px] text-center shadow-xl border border-gray-800"
          variants={fadeVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="p-3 bg-blue-500/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Mail size={30} className="text-blue-400" />
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-2">Account Created Successfully!</h3>
          
          <p className="text-gray-300 mb-4">
            Your account has been automatically created. Please check your email at <span className="text-blue-400 font-medium">{newUserEmail}</span> for your password and login details.
          </p>
          
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-5">
            <p className="text-blue-400 text-sm mb-2">
              For a better experience, please log in with your credentials to manage your reservations and access more features.
            </p>
            <p className="text-yellow-400 text-sm flex items-center justify-center mt-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>If you don't see the email, please check your spam/junk folder and mark it as "not spam"</span>
            </p>
          </div>
          
          <button
            onClick={() => {
              console.log('Closing new user popup');
              setIsNewUser(false);
              // This will trigger the next popup (email confirmation) via useEffect
            }}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all w-full font-medium"
          >
            Got It
          </button>
        </motion.div>
      </div>
    );
  };
  
  // Add the EmailConfirmationPopup component
  const EmailConfirmationPopup = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-[9999]">
        <motion.div
          className="bg-[#1a1a1a] rounded-2xl p-6 max-w-[90%] w-[380px] text-center shadow-xl border border-gray-800"
          variants={fadeVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="p-3 bg-green-500/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Mail size={30} className="text-green-400" />
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-2">Confirmation Email Sent!</h3>
          
          <p className="text-gray-300 mb-4">
            {emailConfirmationDetails.isReservation 
              ? `Your reservation (${emailConfirmationDetails.reservationNumber}) has been confirmed. Check your email at ${emailConfirmationDetails.email} for reservation details.` 
              : `A confirmation has been sent to ${emailConfirmationDetails.email}. Please check your inbox.`}
          </p>
          
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-5">
            <p className="text-green-400 text-sm mb-2">
              {emailConfirmationDetails.isReservation 
                ? "Keep this email as proof of your reservation. You'll need it when you arrive." 
                : "The email contains important information about your account and reservation."}
            </p>
            <p className="text-yellow-400 text-sm flex items-center justify-center mt-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>If you don't see the email, please check your spam/junk folder and mark it as "not spam"</span>
            </p>
          </div>
          
          <button
            onClick={() => {
              console.log('Closing email confirmation popup');
              setShowEmailConfirmation(false);
              // This will trigger the success state via useEffect
              
              // Also call onCancel to ensure the popup is fully closed and removed
              setTimeout(() => {
                if (onCancel) onCancel();
              }, 300);
            }}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all w-full font-medium"
          >
            Got It
          </button>
        </motion.div>
      </div>
    );
  };
  
  // Update the renderContent function to handle hideSummary prop
  const renderContent = () => {
    // Only handle payment UI stages here, not popups
    switch (paymentStatus) {
      case 'succeeded':
        return (
          <motion.div 
            className="text-center py-6" 
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="flex justify-center mb-4">
              <CheckCircle size={60} className="text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Payment Successful!</h3>
            <p className="text-gray-400 mb-6">Your payment has been processed successfully.</p>
            <button
              onClick={onCancel}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition duration-200"
            >
              Close
            </button>
          </motion.div>
        );
      
      case 'error':
        return (
          <motion.div 
            className="text-center py-6" 
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="flex justify-center mb-4">
              <AlertCircle size={60} className="text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Payment Failed</h3>
            <p className="text-red-400 mb-6">{errorMessage}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={onCancel}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => setPaymentStatus('initial')}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-200"
              >
                Try Again
              </button>
            </div>
          </motion.div>
        );
      
      default:
        return (
          <motion.form 
            onSubmit={handleSubmit} 
            className="space-y-6"
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Payment Summary - only show if not hidden */}
            {!hideSummary && (
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h4 className="text-green-400 font-medium mb-3">Payment Summary</h4>
                {customDescription && (
                  <p className="text-gray-300 text-sm mb-3">{customDescription}</p>
                )}
                <div className="flex justify-between items-center font-medium">
                  <span className="text-gray-400">Total Amount:</span>
                  <span className="text-white text-lg">{formatAmount(amount)} {currency.toUpperCase()}</span>
                </div>
              </div>
            )}
            
            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 bg-red-900/30 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {errorMessage}
              </div>
            )}
            
            {/* Billing Details */}
            {showBillingDetails && (
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={billingDetails.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={billingDetails.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="email@example.com"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Phone (Optional)</label>
                  <input
                    type="tel"
                    name="phone"
                    value={billingDetails.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="+212 6XX XXXXXX"
                  />
                </div>
              </div>
            )}
            
            {/* Card Details */}
            <div>
              <label className="block text-gray-300 text-sm mb-2">Card Details</label>
              <div className="p-3 bg-gray-800 border border-gray-700 rounded-lg">
                <CardElement options={cardStyle} />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                * For testing, use card number: 4242 4242 4242 4242
              </p>
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={!stripe || isLoading || !clientSecret}
              className={`w-full py-3 rounded-lg font-medium transition duration-200 ${
                isLoading || !clientSecret 
                  ? 'bg-gray-700 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700'
              } text-white`}
            >
              {isLoading || !clientSecret ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  {!clientSecret ? 'Initializing...' : 'Processing...'}
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <CreditCard className="mr-2" size={18} />
                  {buttonText === 'Pay Now' ? `Pay ${formatAmount(amount)} ${currency.toUpperCase()}` : buttonText}
                </div>
              )}
            </button>
            
            {/* Cancel Button */}
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="w-full py-2 text-gray-400 hover:text-white bg-transparent hover:bg-gray-800 rounded-lg transition duration-200 text-sm"
            >
              Cancel
            </button>
            
            {/* Secure Payment Notice */}
            <div className="flex items-center justify-center text-xs text-gray-500">
              <Lock size={12} className="mr-1" />
              Secure payment processed by Stripe
            </div>
          </motion.form>
        );
    }
  };
  
  // Add an effect to handle transition between popups
  useEffect(() => {
    console.log('Popup state changed:', { isNewUser, showEmailConfirmation, emailConfirmationDetails });
    
    // If new user popup is closed and email confirmation is pending, show it
    if (!isNewUser && emailConfirmationDetails.email && !showEmailConfirmation) {
      console.log('Showing email confirmation popup after new user popup closed');
      setShowEmailConfirmation(true);
    }
    
    // If both new user and email confirmation popups have been dismissed, show success status
    if (!isNewUser && !showEmailConfirmation && emailConfirmationDetails.email) {
      console.log('Both popups closed, setting payment status to succeeded');
      
      // Short delay to ensure smooth transition
      setTimeout(() => {
        // Reset the payment status to show the success UI
        setPaymentStatus('succeeded');
        
        // Ensure reservation count is incremented if not already done
        const isAdmin = sessionStorage.getItem("type") === "admin";
        const isLoggedIn = !!sessionStorage.getItem("userId");
        if (!isAdmin && isLoggedIn) {
          incrementReservationCount();
        }
        
        // Call success callback if we have a payment intent in session storage
        const paymentIntentId = sessionStorage.getItem('last_successful_payment_id');
        if (paymentIntentId && onSuccess) {
          console.log('Calling onSuccess callback after popups closed');
          
          // Create a minimal payment intent object
          const paymentIntent = {
            id: paymentIntentId,
            status: 'succeeded',
            amount: parseInt(sessionStorage.getItem('last_payment_amount') || '0')
          };
          onSuccess(paymentIntent);
        }
      }, 300);
    }
  }, [isNewUser, showEmailConfirmation, emailConfirmationDetails, onSuccess, incrementReservationCount]);
  
  // Check if user is logged in for the effect
  const isLoggedIn = !!sessionStorage.getItem("userId");
  const isAdmin = sessionStorage.getItem("type") === "admin";
  
  return (
    <div className="w-full">
      {/* Always render the popup components when their state is true */}
      {isNewUser && <NewUserPopup />}
      {showEmailConfirmation && <EmailConfirmationPopup />}
      
      {/* Only render payment UI if no popups are showing */}
      {!isNewUser && !showEmailConfirmation && renderContent()}
    </div>
  );
};

export default StripePaymentForm; 
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle, Mail } from 'lucide-react';
import StripePaymentForm from './StripePaymentForm';

const modalVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

/**
 * A modal component for handling Stripe payments
 */
const StripePaymentModal = ({ 
  show, 
  onClose, 
  onSuccess, 
  amount,
  currency = 'mad',
  metadata = {},
  title = 'Complete Payment',
  description
}) => {
  const [succeeded, setSucceeded] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);
  const [showNewUserPopup, setShowNewUserPopup] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [emailConfirmationDetails, setEmailConfirmationDetails] = useState({
    email: '',
    isReservation: false,
    reservationNumber: ''
  });
  
  // Reset state when modal opens/closes
  useEffect(() => {
    if (!show) {
      // Reset with a delay to allow animation to complete
      setTimeout(() => {
        setSucceeded(false);
        setPaymentResult(null);
        setShowNewUserPopup(false);
        setNewUserEmail('');
        setShowEmailConfirmation(false);
        setEmailConfirmationDetails({
          email: '',
          isReservation: false,
          reservationNumber: ''
        });
        
        // Clear any cached client secret
        sessionStorage.removeItem('stripe_client_secret');
        sessionStorage.removeItem('last_stripe_api_call_time');
      }, 300);
    } else {
      // When opening the modal, ensure we have a clean state
      setSucceeded(false);
      setPaymentResult(null);
      setShowNewUserPopup(false);
      setNewUserEmail('');
      setShowEmailConfirmation(false);
      setEmailConfirmationDetails({
        email: '',
        isReservation: false,
        reservationNumber: ''
      });
    }
  }, [show]);

  // Listen for paymentSuccess event to handle email notifications
  useEffect(() => {
    const handlePaymentSuccess = (event) => {
      const { is_new_user, email_sent, user_email, num_res } = event.detail || {};
      
      console.log('Payment success event received with flags:', {
        is_new_user, email_sent, user_email, num_res
      });

      // Check if we need to show the new user notification
      if (is_new_user) {
        setShowNewUserPopup(true);
        setNewUserEmail(user_email || '');
        
        // Store email confirmation details for later if needed
        if (email_sent) {
          setEmailConfirmationDetails({
            email: user_email || '',
            isReservation: true,
            reservationNumber: num_res || ''
          });
        }
      } 
      // If just email confirmation is needed, show that
      else if (email_sent) {
        setEmailConfirmationDetails({
          email: user_email || sessionStorage.getItem("email") || '',
          isReservation: true,
          reservationNumber: num_res || ''
        });
        setShowEmailConfirmation(true);
      }

      // These flags need to be propagated to trigger the email notifications
      if (is_new_user !== undefined || email_sent !== undefined) {
        // Pass details to parent component after showing our own notifications
        setTimeout(() => {
          if (onSuccess) {
            onSuccess(event.detail.paymentIntent, {
              is_new_user,
              email_sent,
              user_email,
              num_res,
              data: event.detail.reservationData?.data || { num_res }
            });
          }
        }, 500);
      }
    };

    document.addEventListener('paymentSuccess', handlePaymentSuccess);
    return () => {
      document.removeEventListener('paymentSuccess', handlePaymentSuccess);
    };
  }, [onSuccess]);
  
  if (!show) return null;
  
  const handlePaymentSuccess = (paymentIntent, reservationData) => {
    console.log('Payment successful:', paymentIntent);
    console.log('Reservation data:', reservationData);
    
    // Store payment result for display
    setPaymentResult({
      paymentIntent,
      reservationData
    });
    
    // Mark as succeeded
    setSucceeded(true);
    
    // Store successful payment info in session storage
    try {
      sessionStorage.setItem('last_payment_id', paymentIntent.id);
      sessionStorage.setItem('last_payment_status', 'succeeded');
      sessionStorage.setItem('stripe_payment_success', 'true');
      
      // If this was a reservation payment, store that too
      if (metadata.type === 'reservation') {
        sessionStorage.setItem('last_reservation_payment_id', paymentIntent.id);
        // Store timestamp
        sessionStorage.setItem('last_payment_timestamp', Date.now().toString());
      }
    } catch (error) {
      console.warn('Could not store payment data in session storage:', error);
    }
    
    // Check for is_new_user and email_sent flags in reservationData
    const is_new_user = reservationData?.is_new_user;
    const email_sent = reservationData?.email_sent;
    const user_email = reservationData?.user_email;
    const num_res = reservationData?.data?.num_res;
    
    // Log if we found special flags
    if (is_new_user !== undefined || email_sent !== undefined) {
      console.log('Found special flags in reservation data:', {
        is_new_user, email_sent, user_email, num_res
      });
      
      // Check if we need to show the new user notification
      if (is_new_user) {
        setShowNewUserPopup(true);
        setNewUserEmail(user_email || '');
        
        // Store email confirmation details for later
        if (email_sent) {
          setEmailConfirmationDetails({
            email: user_email || '',
            isReservation: true,
            reservationNumber: num_res || ''
          });
        }
      }
      // If just email confirmation is needed, show that
      else if (email_sent) {
        setEmailConfirmationDetails({
          email: user_email || sessionStorage.getItem("email") || '',
          isReservation: true,
          reservationNumber: num_res || ''
        });
        setShowEmailConfirmation(true);
      }
      
      // Dispatch event with special flags to trigger email notifications
      const event = new CustomEvent('reservationSuccess', {
        detail: {
          refreshNeeded: true,
          reservationConfirmed: true,
          is_new_user,
          email_sent,
          user_email,
          num_res,
          paymentIntent: {
            id: paymentIntent.id,
            status: paymentIntent.status
          }
        }
      });
      document.dispatchEvent(event);
    }
    
    // Call onSuccess callback after a delay (regular payment success)
    if (!is_new_user && !email_sent) {
      setTimeout(() => {
        if (onSuccess) {
          onSuccess(paymentIntent, reservationData);
        }
      }, 1000);
    }
  };
  
  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
  };
  
  const handleClose = () => {
    // Clear any cached client secret before closing
    sessionStorage.removeItem('stripe_client_secret');
    sessionStorage.removeItem('last_stripe_api_call_time');
    
    // Reset notification states
    setShowNewUserPopup(false);
    setNewUserEmail('');
    setShowEmailConfirmation(false);
    setEmailConfirmationDetails({
      email: '',
      isReservation: false,
      reservationNumber: ''
    });
    
    // Call the onClose callback
    if (onClose) {
      onClose();
    }
  };
  
  // Handle closing the new user popup
  const handleNewUserClose = () => {
    setShowNewUserPopup(false);
    
    // If we have email confirmation details, show that popup next
    if (emailConfirmationDetails.email) {
      setShowEmailConfirmation(true);
    } else {
      // Otherwise just close the modal
      handleClose();
    }
  };
  
  // Handle closing the email confirmation popup
  const handleEmailConfirmationClose = () => {
    setShowEmailConfirmation(false);
    
    // Close the modal
    handleClose();
  };
  
  // Render the new user notification popup
  const renderNewUserPopup = () => {
    return (
      <div className="text-center py-8">
        <div className="p-3 bg-blue-500/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <Mail size={30} className="text-blue-400" />
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2">Account Created Successfully!</h3>
        
        <p className="text-gray-300 mb-4">
          Your account has been automatically created. Please check your email at <span className="text-blue-400 font-medium">{newUserEmail}</span> for your password and login details.
        </p>
        
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-5">
          <p className="text-blue-400 text-sm mb-2">
            For a better experience, please log in with your credentials to manage your reservations and access more features.
          </p>
        </div>
        
        <button
          onClick={handleNewUserClose}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-200"
        >
          Got It
        </button>
      </div>
    );
  };
  
  // Render the email confirmation popup
  const renderEmailConfirmation = () => {
    return (
      <div className="text-center py-8">
        <div className="p-3 bg-green-500/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <Mail size={30} className="text-green-400" />
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2">Confirmation Email Sent!</h3>
        
        <p className="text-gray-300 mb-4">
          {emailConfirmationDetails.isReservation 
            ? `Your reservation${emailConfirmationDetails.reservationNumber ? ` (${emailConfirmationDetails.reservationNumber})` : ''} has been confirmed. Check your email at ${emailConfirmationDetails.email} for reservation details.` 
            : `A confirmation has been sent to ${emailConfirmationDetails.email}. Please check your inbox.`}
        </p>
        
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-5">
          <p className="text-green-400 text-sm mb-2">
            {emailConfirmationDetails.isReservation 
              ? "Keep this email as proof of your reservation. You'll need it when you arrive." 
              : "The email contains important information about your account and reservation."}
          </p>
        </div>
        
        <button
          onClick={handleEmailConfirmationClose}
          className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition duration-200"
        >
          Got It
        </button>
      </div>
    );
  };
  
  // Render the success message
  const renderSuccessMessage = () => {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <CheckCircle size={60} className="text-green-500" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Payment Successful!</h3>
        <p className="text-gray-400 mb-6">
          {metadata.type === 'reservation' 
            ? 'Your reservation has been confirmed.' 
            : 'Your payment has been processed successfully.'}
        </p>
        <button
          onClick={handleClose}
          className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition duration-200"
        >
          Close
        </button>
      </div>
    );
  };
  
  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 backdrop-blur-sm"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={modalVariants}
      onClick={handleClose}
    >
      <motion.div 
        className="bg-gray-900 rounded-xl p-6 max-w-[90%] w-[450px] border border-gray-800 shadow-xl"
        variants={containerVariants}
        onClick={e => e.stopPropagation()}
      >
        {/* Show the new user popup if needed */}
        {showNewUserPopup ? (
          renderNewUserPopup()
        ) : showEmailConfirmation ? (
          renderEmailConfirmation()
        ) : succeeded ? (
          renderSuccessMessage()
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">{title}</h3>
              <button 
                onClick={handleClose}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            
            <StripePaymentForm
              amount={amount}
              currency={currency}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              onCancel={handleClose}
              metadata={{
                ...metadata,
                timestamp: Date.now() // Add timestamp to make each payment unique
              }}
              customDescription={description}
            />
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default StripePaymentModal; 
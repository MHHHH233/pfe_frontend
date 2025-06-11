import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle } from 'lucide-react';
import StripePaymentForm from '../Payments/StripePaymentForm';
import academieMemberService from '../../lib/services/user/academieMemberService';

const modalVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

/**
 * A modal component for handling Academy subscription payments through Stripe
 */
const AcademyPaymentModal = ({ 
  show, 
  onClose, 
  onSuccess, 
  planData,
  title = 'Complete Subscription Payment',
}) => {
  const [succeeded, setSucceeded] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);
  
  // Reset state when modal opens/closes
  useEffect(() => {
    if (!show) {
      // Reset with a delay to allow animation to complete
      setTimeout(() => {
        setSucceeded(false);
        setPaymentResult(null);
      }, 300);
    }
  }, [show]);
  
  if (!show || !planData) return null;
  
  // Calculate the amount in cents based on the plan price
  const getAmountInCents = () => {
    // Ensure price is a number and convert to cents for Stripe
    const price = parseFloat(planData.price || 0);
    
    // If price is already in cents (very large number), return as is
    if (price > 10000) {
      console.log('Price appears to already be in cents:', price);
      return price;
    }
    
    // Convert to cents (Stripe requires integer cents)
    const amountInCents = Math.round(price * 100);
    console.log(`Converting price to cents: ${price} MAD → ${amountInCents} cents`);
    return amountInCents;
  };
  
  // Generate a description for the payment
  const getDescription = () => {
    return `Subscription to ${planData.name || 'Academy plan'} - ${planData.isAnnual ? 'Annual' : 'Monthly'} plan`;
  };
  
  const handlePaymentSuccess = async (paymentIntent, subscriptionData) => {
    console.log('Payment successful:', paymentIntent);
    console.log('Subscription data:', subscriptionData);
    
    // Store payment result for display
    setPaymentResult({
      paymentIntent,
      subscriptionData
    });
    
    // Mark as succeeded
    setSucceeded(true);
    
    // Check if this payment intent has already been processed by looking at session storage
    const lastPaymentId = sessionStorage.getItem('last_payment_id');
    const isAlreadyProcessed = lastPaymentId === paymentIntent.id;
    
    if (isAlreadyProcessed) {
      console.log('Payment intent already processed, skipping API call:', paymentIntent.id);
      
      // Call onSuccess callback after a delay
      setTimeout(() => {
        if (onSuccess) {
          onSuccess(paymentIntent, subscriptionData);
        }
      }, 1500);
      
      // Dispatch event for successful payment
      const event = new CustomEvent('academySubscriptionSuccess', {
        detail: {
          plan: planData,
          paymentIntent,
          subscriptionData,
          alreadyProcessed: true
        }
      });
      document.dispatchEvent(event);
      
      return;
    }
    
    // Call the academy subscription API
    try {
      // Default academy ID is 1 if not provided
      const academieId = planData.academieId || 1;
      
      // Check if the payment status is 'succeeded'
      if (paymentIntent.status === 'succeeded') {
        const response = await academieMemberService.subscribe({
          id_academie: academieId,
          subscription_plan: planData.type === 'basic' || planData.type === 'base' ? 'base' : 'premium', // Use 'base' instead of 'basic'
          payment_method: 'online', // Required field
          payment_intent_id: paymentIntent.id,
          payment_status: paymentIntent.status,
          price: planData.price,
          is_annual: planData.isAnnual,
          amount: paymentIntent.amount / 100, // Convert from cents back to MAD
          currency: paymentIntent.currency || 'mad' // Include currency
        });
        
        console.log('Academy subscription created:', response);
        
        // If we have a member ID from the response, store it
        if (response && response.id_member) {
          // Store the individual member ID
          sessionStorage.setItem('academy_member_id', response.id_member);
        }
      } else {
        console.warn(`Payment intent status is not 'succeeded': ${paymentIntent.status}`);
      }
    } catch (apiError) {
      // Handle Stripe payment_intent_unexpected_state error
      if (apiError.error && apiError.error.code === 'payment_intent_unexpected_state') {
        console.warn('Payment intent already processed:', apiError.error.message);
        // Continue normally as if the subscription was created successfully
      } else {
        console.error('Error calling academy subscription API:', apiError);
        // Continue even if API call fails
      }
    }
    
    // Store successful payment info in session storage
    try {
      sessionStorage.setItem('last_payment_id', paymentIntent.id);
      sessionStorage.setItem('last_payment_status', 'succeeded');
      
      // Store subscription details
      sessionStorage.setItem('subscription_plan', planData.name);
      sessionStorage.setItem('subscription_type', planData.isAnnual ? 'annual' : 'monthly');
      sessionStorage.setItem('subscription_price', planData.price);
      // Store timestamp
      sessionStorage.setItem('last_payment_timestamp', Date.now().toString());
      
      // Set membership flag
      sessionStorage.setItem('has_academie_membership', 'true');
      
      // Create or update memberships array
      const existingMembershipsStr = sessionStorage.getItem('academie_memberships');
      let existingMemberships = [];
      
      if (existingMembershipsStr) {
        try {
          existingMemberships = JSON.parse(existingMembershipsStr);
        } catch (e) {
          console.error("Error parsing existing memberships:", e);
        }
      }
      
      // Create a new membership entry with correct subscription plan value
      const newMembership = {
        id_member: paymentIntent.id, // Use payment intent ID as temporary member ID
        id_academie: planData.academieId || 1, // Default academy ID
        subscription_plan: planData.type === 'basic' || planData.type === 'base' ? 'base' : 'premium', // Use 'base' instead of 'basic'
        payment_method: 'online',
        payment_intent_id: paymentIntent.id,
        status: 'active',
        created_at: new Date().toISOString()
      };
      
      // Add or update the membership with corrected plan type
      const updatedMemberships = [...existingMemberships];
      const existingIndex = updatedMemberships.findIndex(m => 
        m.id_academie === (planData.academieId || 1) && m.subscription_plan === (planData.type === 'basic' || planData.type === 'base' ? 'base' : 'premium')
      );
      
      if (existingIndex >= 0) {
        updatedMemberships[existingIndex] = newMembership;
      } else {
        updatedMemberships.push(newMembership);
      }
      
      // Store updated memberships
      sessionStorage.setItem('academie_memberships', JSON.stringify(updatedMemberships));
    } catch (error) {
      console.warn('Could not store payment data in session storage:', error);
    }
    
    // Call onSuccess callback after a delay
    setTimeout(() => {
      if (onSuccess) {
        onSuccess(paymentIntent, subscriptionData);
      }
    }, 1500);
    
    // Dispatch event for successful payment
    const event = new CustomEvent('academySubscriptionSuccess', {
      detail: {
        plan: planData,
        paymentIntent,
        subscriptionData
      }
    });
    document.dispatchEvent(event);
  };
  
  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
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
            <p className="text-gray-400 mb-6">
              Your subscription to {planData.name} has been activated.
            </p>
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
              <h3 className="text-xl font-bold text-white">{title}</h3>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Display plan information */}
            <div className="bg-gray-800 p-4 rounded-lg mb-6">
              <div className="flex justify-between">
                <div>
                  <h4 className="text-lg font-medium text-white">{planData.name}</h4>
                  <p className="text-gray-400 text-sm">
                    {planData.isAnnual ? 'Annual subscription' : 'Monthly subscription'}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-semibold text-white">{planData.price} MAD</div>
                  <div className="text-gray-400 text-sm">
                    {planData.isAnnual ? 'per year' : 'per month'}
                  </div>
                </div>
              </div>
              
              {planData.features && (
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <p className="text-sm text-gray-400 mb-2">Plan includes:</p>
                  <ul className="text-sm text-gray-300">
                    {planData.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 mb-1">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <StripePaymentForm
              amount={getAmountInCents()}
              currency="mad"
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              onCancel={onClose}
              metadata={{
                type: 'academy_subscription',
                plan_name: planData.name,
                plan_type: planData.isAnnual ? 'annual' : 'monthly',
                plan_price: planData.price,
                user_id: sessionStorage.getItem("userId") || null,
              }}
              customDescription={getDescription()}
              showBillingDetails={true}
              hideSummary={true}
              buttonText="Complete Subscription"
            />
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default AcademyPaymentModal; 
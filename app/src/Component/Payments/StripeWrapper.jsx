import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { AlertCircle, RefreshCw } from 'lucide-react';
import stripeService from '../../lib/services/stripeService';

// Default appearance for Stripe Elements
const appearance = {
  theme: 'night',
  variables: {
    colorPrimary: '#07f468',
    colorBackground: '#1a1a1a',
    colorText: '#ffffff',
    colorDanger: '#ff5555',
    fontFamily: 'Arial, sans-serif',
    spacingUnit: '4px',
    borderRadius: '8px',
  },
};

const StripeWrapper = ({ children, options = {} }) => {
  const [stripePromise, setStripePromise] = useState(null);
  const [stripeError, setStripeError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const initializeStripe = async () => {
      setIsLoading(true);
      try {
        // First check if we already have a cached key
        let stripeKey = sessionStorage.getItem('stripe_key');
        
        // If not, fetch it from the API
        if (!stripeKey) {
          try {
            stripeKey = await stripeService.getStripeKey();
            // Store the valid key in sessionStorage
            if (stripeKey) {
              sessionStorage.setItem('stripe_key', stripeKey);
            }
          } catch (error) {
            console.warn('Could not fetch Stripe key from API, trying environment variables');
            // Try the STRIPE_KEY variable first (newer projects)
            stripeKey = process.env.STRIPE_KEY;
            
            // If not found, fall back to the older REACT_APP_ prefix
            if (!stripeKey) {
              stripeKey = process.env.REACT_APP_STRIPE_KEY;
            }
            
            // If still not found, use a default key (test mode)
            if (!stripeKey) {
              console.warn('No Stripe key found in environment variables, using default test key');
              stripeKey = 'pk_test_TYooMQauvdEDq54NiTphI7jx';
            }
          }
        }
        
        // Log the key for debugging (remove in production)
        console.log('Using Stripe key:', stripeKey);
        
        // Load Stripe with the key
        const stripe = await loadStripe(stripeKey);
        setStripePromise(stripe);
      } catch (error) {
        console.error('Error initializing Stripe:', error);
        setStripeError('Failed to initialize payment system');
      } finally {
        setIsLoading(false);
      }
    };

    initializeStripe();
  }, []);
  
  // If Stripe is still loading, show a loading indicator
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <RefreshCw className="animate-spin text-green-500 mr-2" size={24} />
        <span className="text-gray-400">Loading payment system...</span>
      </div>
    );
  }
  
  // If Stripe failed to initialize, show an error
  if (stripeError) {
    return (
      <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 my-4">
        <div className="flex items-start">
          <AlertCircle className="text-red-500 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-red-500 font-medium mb-1">Payment System Error</h3>
            <p className="text-red-400 text-sm">
              {stripeError}. Please try again later or contact support.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  // If Stripe isn't initialized yet and there's no error, return null
  if (!stripePromise) {
    return null;
  }

  const elementsOptions = {
    appearance,
    ...options
  };

  return (
    <Elements stripe={stripePromise} options={elementsOptions}>
      {children}
    </Elements>
  );
};

export default StripeWrapper; 
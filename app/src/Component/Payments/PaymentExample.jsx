import React, { useState } from 'react';
import StripeWrapper from './StripeWrapper';
import StripePaymentModal from './StripePaymentModal';

// Example component demonstrating how to use the Stripe payment components
const PaymentExample = () => {
  const [showPayment, setShowPayment] = useState(false);
  const [amount, setAmount] = useState(10000); // 100.00 in cents
  const [paymentType, setPaymentType] = useState('reservation');
  const [metadata, setMetadata] = useState({
    type: 'reservation',
    item_id: '12345'
  });

  const handleSuccess = (paymentIntent) => {
    console.log('Payment successful:', paymentIntent);
    alert('Payment successful! Payment Intent ID: ' + paymentIntent.id);
    setShowPayment(false);
  };

  // Handle custom amount change
  const handleAmountChange = (e) => {
    // Convert to cents
    const newAmount = parseFloat(e.target.value) * 100;
    setAmount(isNaN(newAmount) ? 0 : newAmount);
  };

  // Handle payment type change
  const handleTypeChange = (e) => {
    const type = e.target.value;
    setPaymentType(type);
    
    // Update metadata based on type
    if (type === 'reservation') {
      setMetadata({
        type: 'reservation',
        item_id: '12345',
        date: '2024-06-30',
        time: '18:00'
      });
    } else if (type === 'subscription') {
      setMetadata({
        type: 'subscription',
        plan: 'pro',
        duration: 'monthly'
      });
    } else {
      setMetadata({
        type: 'product',
        product_id: '67890'
      });
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6">Stripe Payment Example</h2>
      
      <div className="bg-gray-800 p-5 rounded-xl border border-gray-700 mb-6">
        <h3 className="text-xl font-semibold text-white mb-4">Configure Payment</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Amount (MAD)
            </label>
            <input
              type="number"
              min="1"
              step="0.01"
              defaultValue="100.00"
              onChange={handleAmountChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Payment Type
            </label>
            <select
              onChange={handleTypeChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
            >
              <option value="reservation">Reservation</option>
              <option value="subscription">Subscription</option>
              <option value="product">Product</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800 p-5 rounded-xl border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-4">Process Payment</h3>
        <p className="text-gray-300 mb-4">
          {paymentType === 'reservation' && 'Pay for your court reservation'}
          {paymentType === 'subscription' && 'Subscribe to our premium plan'}
          {paymentType === 'product' && 'Purchase a product from our store'}
        </p>
        
        <div className="flex items-center justify-between bg-gray-700 p-3 rounded-lg mb-5">
          <span className="text-gray-300">Amount:</span>
          <span className="text-white font-semibold">{(amount / 100).toFixed(2)} MAD</span>
        </div>
        
        <button
          onClick={() => setShowPayment(true)}
          className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          Pay with Stripe
        </button>
      </div>
      
      {/* Stripe Payment Modal */}
      <StripeWrapper>
        <StripePaymentModal
          show={showPayment}
          onClose={() => setShowPayment(false)}
          onSuccess={handleSuccess}
          amount={amount}
          currency="mad"
          metadata={metadata}
          title={
            paymentType === 'reservation' ? 'Complete Reservation Payment' :
            paymentType === 'subscription' ? 'Complete Subscription Payment' :
            'Complete Purchase'
          }
          description={
            paymentType === 'reservation' ? 'Court reservation on June 30, 2024 at 18:00' :
            paymentType === 'subscription' ? 'Pro Plan - Monthly Subscription' :
            'Product purchase'
          }
        />
      </StripeWrapper>
    </div>
  );
};

export default PaymentExample; 
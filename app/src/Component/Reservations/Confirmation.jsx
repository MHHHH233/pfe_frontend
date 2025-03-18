import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import AnimatedCheck from './Status/Confirmed';
import AnimatedReserved from './Status/Failed';
import AnimatedPending from './Status/Pending';
import { CreditCard, Wallet, Calendar, Clock, MapPin, User, Lock } from 'lucide-react';
import userReservationService from '../../lib/services/user/reservationServices';
import adminReservationService from '../../lib/services/admin/reservationServices';

const Button = styled.button`
  /* Styling for the button */
  background-color: #07f468;
  color: #1a1a1a;
  border: none;
  border-radius: 50px;
  padding: 10px 25px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  height: 50px;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 6px rgba(7, 244, 104, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #06d35a;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(7, 244, 104, 0.2);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(7, 244, 104, 0.1);
  }

  &:disabled {
    background-color: #3e3e3e;
    color: #8a8a8a;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  @media (max-width: 500px) {
    padding: 8px 20px;
    font-size: 0.8rem;
  }
`;

const cardVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 20,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

export default function PopupCard({ isVisible, onClose, data, resetStatus }) {
  const [status, setStatus] = useState(null); 
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isLoggedIn = !!sessionStorage.getItem("userId");
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });
  const isAdmin = sessionStorage.getItem("type") === "admin";

  useEffect(() => {
    // Remove the auto-close timeout
    if (isVisible) {
      // Only handle cleanup if needed
      return () => {
        // Cleanup code if needed
      };
    }
  }, [isVisible]);
  
  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (paymentMethod) => {
    if (paymentMethod === 'online') {
      setShowPaymentForm(true);
      return;
    }
    
    // Make sure we have the heure field
    if (!data.heure && !data.heuredebut) {
      setMsg('Time is required');
      setStatus('failed');
      setLoading(false);
      return;
    }
    
    const formData = {
      id_terrain: data.id_terrain,
      date: data.date,
      heure: data.heure || data.heuredebut,
      type: data.type || "client",
      payment_method: paymentMethod,
      // For admin reservations, use the provided Name and id_client
      ...(sessionStorage.getItem("type") === "admin" ? {
        Name: data.Name,
        id_client: data.id_client || parseInt(sessionStorage.getItem("userId"))
      } : {
        // For user/guest reservations
        Name: data.Name || sessionStorage.getItem("guestName") || 'Guest',
        email: data.email || sessionStorage.getItem("guestEmail") || '',
        telephone: data.telephone || sessionStorage.getItem("guestTelephone") || ''
      })
    };
  
    console.log("Submitting reservation with data:", formData);
  
    try {
      const reservationService = sessionStorage.getItem("type") === "admin" 
        ? adminReservationService 
        : userReservationService;
      
      const response = await reservationService.createReservation(formData);
      
      if (response.status === 201) {
        setMsg('Reservation submitted successfully!');
        setStatus(paymentMethod === 'online' ? 'success' : 'pending');
      } else {
        setMsg('Failed to submit reservation. Please try again.');
        setStatus('failed');
        console.log(response.data?.message);
      }
    } catch (error) {
      console.error('Error:', error.message);
      setMsg('An error occurred. Please try again.');
      setStatus('failed');
    } finally {
      setLoading(false);
    }
  };
  
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Get the correct service based on user type
      const reservationService = sessionStorage.getItem("type") === "admin" 
        ? adminReservationService 
        : userReservationService;
      
      // Here you would typically process the payment with a payment gateway
      // For now, we'll just simulate a successful payment
      
      // Then create the reservation
      const formData = {
        ...data,
        payment_method: 'online',
        payment_status: 'paid'
      };
      
      const response = await reservationService.createReservation(formData);
      
      if (response.status === 201) {
        setMsg('Payment successful and reservation confirmed!');
        setStatus('success');
      } else {
        setMsg('Payment failed. Please try again.');
        setStatus('failed');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      setMsg('Payment processing failed. Please try again.');
      setStatus('failed');
    } finally {
      setLoading(false);
    }
  };
  
  const closePopup = () => {
    setStatus(null); // Reset the status
    resetStatus(); // Notify parent to reset visibility state
    onClose(); // Close the popup
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const handleConfirm = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Sending reservation data:', data);

      const service = sessionStorage.getItem("type") === "admin" 
        ? adminReservationService 
        : userReservationService;

      const response = await service.createReservation(data);
      
      if (response.status === "success") {
        resetStatus();
      } else {
        setError("Failed to create reservation");
        setMsg("Failed to create reservation");
      }
    } catch (error) {
      console.error('Error creating reservation:', error);
      setError(error.message || "Failed to create reservation");
      setMsg(error.message || "Failed to create reservation");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <AnimatePresence>
      {isVisible && status === null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={closePopup}
        >
          <motion.div
            className="bg-[#1a1a1a] rounded-3xl p-8 max-w-[90%] w-[400px] text-center shadow-lg"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-white mb-6 text-2xl font-bold">Confirm Reservation</h2>
            
            <div className="bg-gray-800 rounded-lg p-4 mb-6">
              <div className="space-y-4">
                {/* Only show client info if not in admin mode */}
                {!isAdmin && data.Name && (
                  <div className="flex items-center space-x-3">
                    <User size={18} className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-400">Client Name</p>
                      <p className="text-white">{data.Name}</p>
                    </div>
                  </div>
                )}

                {/* Time */}
                <div className="flex items-center space-x-3">
                  <Clock size={18} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Time</p>
                    <p className="text-white">{data.heure || data.heuredebut}</p>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-center space-x-3">
                  <Calendar size={18} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Date</p>
                    <p className="text-white">{formatDate(data.date)}</p>
                  </div>
                </div>

                {/* Terrain */}
                <div className="flex items-center space-x-3">
                  <MapPin size={18} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Terrain</p>
                    <p className="text-white">Terrain {data.id_terrain}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <h3 className="text-white mb-4 text-lg">Choose Payment Option</h3>
            
            {showPaymentForm ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full"
              >
                <div className="flex items-center mb-6">
                  <button 
                    onClick={() => setShowPaymentForm(false)}
                    className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h3 className="text-white text-xl font-semibold ml-2">Payment Details</h3>
                </div>

                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  {/* Card Number */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Card Number</label>
                    <div className="relative rounded-lg shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CreditCard className="text-gray-400" size={18} />
                      </div>
                      <input
                        type="text"
                        name="cardNumber"
                        value={paymentData.cardNumber}
                        onChange={handlePaymentChange}
                        placeholder="1234 5678 9012 3456"
                        className="block w-full pl-10 pr-3 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        required
                        maxLength="19"
                        pattern="\d*"
                      />
                    </div>
                  </div>

                  {/* Card Holder */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">Card Holder Name</label>
                    <div className="relative rounded-lg shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="text-gray-400" size={18} />
                      </div>
                      <input
                        type="text"
                        name="cardHolder"
                        value={paymentData.cardHolder}
                        onChange={handlePaymentChange}
                        placeholder="JOHN DOE"
                        className="block w-full pl-10 pr-3 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Expiry Date and CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">Expiry Date</label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={paymentData.expiryDate}
                        onChange={handlePaymentChange}
                        placeholder="MM/YY"
                        className="block w-full px-3 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        required
                        maxLength="5"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">CVV</label>
                      <div className="relative rounded-lg shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="text-gray-400" size={18} />
                        </div>
                        <input
                          type="password"
                          name="cvv"
                          value={paymentData.cvv}
                          onChange={handlePaymentChange}
                          placeholder="123"
                          className="block w-full pl-10 pr-3 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                          required
                          maxLength="3"
                          pattern="\d*"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Total Amount */}
                  <div className="bg-gray-800 rounded-lg p-4 mt-6">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Total Amount:</span>
                      <span className="text-white font-semibold text-lg">
                        {data.terrain?.prix || '100'} MAD
                      </span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-4 rounded-lg font-semibold text-black transition-all ${
                      loading 
                        ? 'bg-gray-600 cursor-not-allowed' 
                        : 'bg-[#07f468] hover:bg-[#06d35a] transform hover:-translate-y-0.5'
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                        <span className="ml-2">Processing...</span>
                      </div>
                    ) : (
                      'Pay Now'
                    )}
                  </button>
                </form>

                {msg && (
                  <div className="mt-4 p-3 rounded-lg bg-red-900/50 border border-red-500 text-red-400">
                    {msg}
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="flex flex-col gap-4">
                <Button onClick={() => handleSubmit('online')}>
                  <CreditCard className="mr-2" size={18} />
                  Pay Online
                </Button>
                <Button onClick={() => handleSubmit('cash')}>
                  <Wallet className="mr-2" size={18} />
                  Pay In-Store (Cash)
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      )}
      {status === 'success' && <AnimatedCheck onClose={closePopup} />}
      {status === 'failed' && <AnimatedReserved onClose={closePopup} />}
      {status === 'pending' && <AnimatedPending onClose={closePopup} />}
    </AnimatePresence>
  );
}
  

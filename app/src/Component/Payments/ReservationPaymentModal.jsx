import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import userReservationService from '../../lib/services/user/reservationServices';
import adminReservationService from '../../lib/services/admin/reservationServices';
import StripePaymentForm from './StripePaymentForm';

const modalVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const ReservationPaymentModal = ({ 
  show, 
  onClose, 
  reservationData, 
  onSuccess
}) => {
  const [succeeded, setSucceeded] = useState(false);
  const isAdmin = sessionStorage.getItem("type") === "admin";

  // Don't render if not shown
  if (!show) return null;

  const handleSuccess = async (paymentIntent, reservationData) => {
    try {
      if (!reservationData) {
        throw new Error('Reservation data is missing');
      }
      
      console.log('Payment succeeded with payment intent:', paymentIntent);
      console.log('Reservation data:', reservationData);
      
      // Check if we have a complete response with is_new_user and email_sent flags
      if (reservationData.is_new_user !== undefined) {
        console.log('Processing complete API response with is_new_user flag');
        
        // Mark payment as successful
        setSucceeded(true);
        
        // Dispatch event with all available flags directly from the response
        const event = new CustomEvent('reservationSuccess', { 
          detail: { 
            refreshNeeded: true,
            reservationConfirmed: true,
            reservationId: reservationData.data?.id_reservation,
            is_new_user: reservationData.is_new_user,
            user_email: reservationData.user_email,
            email_sent: reservationData.email_sent,
            num_res: reservationData.data?.num_res,
            paymentIntent: {
              id: paymentIntent.id,
              status: paymentIntent.status
            }
          }
        });
        document.dispatchEvent(event);
        
        // Don't close the modal yet - let the notifications be shown first
        // The modal will be closed automatically when those popups are done
        
        // Notify parent component
        if (onSuccess) {
          onSuccess(reservationData);
        }
        
        return;
      }
      
      // If we already have a reservation created by the payment form, use it
      if (reservationData.id_reservation) {
        console.log('Reservation already created with ID:', reservationData.id_reservation);
        setSucceeded(true);
        
        // Dispatch success event with reservation ID
        const event = new CustomEvent('reservationSuccess', { 
          detail: { 
            refreshNeeded: true,
            reservationConfirmed: true,
            reservationId: reservationData.id_reservation,
            paymentIntent: {
              id: paymentIntent.id,
              status: paymentIntent.status
            }
          }
        });
        document.dispatchEvent(event);
        
        // Notify parent component
        if (onSuccess) {
          onSuccess(reservationData);
        }
        
        return;
      }
      
      // If no reservation was created yet, create it now
      console.log('Creating reservation after payment success');
      
      // Choose the appropriate service based on user type
      const service = isAdmin 
        ? adminReservationService 
        : userReservationService;
      
      // Prepare reservation data with online payment details and payment intent ID
      const formData = {
        id_terrain: reservationData.id_terrain,
        date: reservationData.date,
        heure: reservationData.heure,
        type: reservationData.type || "client",
        payment_method: 'online',
        payment_status: 'paid',
        id_client: reservationData.id_client,
        Name: reservationData.Name,
        email: reservationData.email,
        telephone: reservationData.telephone || '',
        price: reservationData.price || reservationData.prix,
        payment_intent_id: paymentIntent.id,
        payment_status: paymentIntent.status,
        
        // Required fields for the API endpoint
        amount: paymentIntent.amount, // Amount in cents
        currency: paymentIntent.currency || 'mad'
      };
      
      console.log('Sending reservation data to service:', formData);
      
      // Create or update the reservation
      let response;
      
      if (reservationData.id_reservation) {
        // For existing reservations, update with payment info
        response = await service.updateReservation({
          id_reservation: reservationData.id_reservation,
          payment_method: 'online',
          payment_status: 'paid',
          etat: 'réservé',
          payment_intent_id: paymentIntent.id,
        });
      } else {
        // For new reservations, create with payment info
        try {
          // First try with the service
          response = await service.createReservation(formData);
        } catch (serviceError) {
          console.error('Service createReservation failed, trying direct API call:', serviceError);
          
          // If service fails, try direct API call
          // Try multiple endpoints starting with the known working one
          const apiUrls = [
            `${process.env.REACT_APP_API_URL || ''}/api/user/v1/reservations`,
            `http://127.0.0.1:8000/api/user/v1/reservations`,
            `${process.env.REACT_APP_API_URL || ''}/api/reservation/create`,
            `/api/user/v1/reservations`,
            `/api/reservation/create`,
            `${process.env.REACT_APP_API_URL || ''}/api/reservations/create`,
            `/api/reservations/create`
          ];
          
          let apiResponse = null;
          let apiError = null;
          
          for (const apiUrl of apiUrls) {
            try {
              console.log(`Trying direct API call to ${apiUrl}`);
              
              const fetchResponse = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
              });
              
              if (!fetchResponse.ok) {
                const errorData = await fetchResponse.json();
                console.warn(`Error with ${apiUrl}:`, errorData);
                apiError = new Error(errorData.message || `Failed with ${apiUrl}`);
                continue;
              }
              
              apiResponse = await fetchResponse.json();
              console.log(`Successfully created reservation with ${apiUrl}:`, apiResponse);
              break;
            } catch (fetchError) {
              console.warn(`Network error with ${apiUrl}:`, fetchError);
              apiError = fetchError;
            }
          }
          
          if (!apiResponse) {
            throw apiError || new Error('All API attempts failed');
          }
          
          response = apiResponse;
        }
      }
      
      console.log('Reservation processed with online payment:', response);
      
      // Add a function to increment the reservation count consistently
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
          }
        } catch (error) {
          console.error('Error incrementing reservation count:', error);
        }
      };

      // ALWAYS increment the reservation count for ANY successful reservation
      incrementReservationCount();
      
      // Mark payment as successful
      setSucceeded(true);
      
      // Check for is_new_user and email_sent flags in the response
      if (response.is_new_user !== undefined) {
        // Dispatch event with all relevant flags from the response
        const event = new CustomEvent('reservationSuccess', { 
          detail: { 
            refreshNeeded: true,
            reservationConfirmed: true,
            is_new_user: response.is_new_user,
            user_email: response.user_email,
            email_sent: response.email_sent,
            num_res: response.data?.num_res,
            paymentIntent: {
              id: paymentIntent.id,
              status: paymentIntent.status
            }
          }
        });
        document.dispatchEvent(event);
      } else {
        // Dispatch standard event without special flags
        const event = new CustomEvent('reservationSuccess', { 
          detail: { 
            refreshNeeded: true,
            reservationConfirmed: true,
            paymentIntent: {
              id: paymentIntent.id,
              status: paymentIntent.status
            }
          }
        });
        document.dispatchEvent(event);
      }
      
      // Notify parent component about successful payment after a delay
      setTimeout(() => {
        if (onSuccess) {
          onSuccess({
            ...reservationData,
            ...response, // Include any is_new_user and email_sent flags
            payment_method: 'online',
            payment_status: 'paid',
            etat: 'réservé',
            payment_intent_id: paymentIntent.id,
            payment_details: {
              id: paymentIntent.id,
              status: paymentIntent.status,
              amount: paymentIntent.amount,
            }
          });
        }
      }, 1500);
    } catch (error) {
      console.error('Error updating reservation:', error);
    }
  };

  const handleError = (error) => {
    console.error('Payment error:', error);
  };

  // Format the price to cents for Stripe
  const getAmountInCents = () => {
    const price = parseFloat(reservationData?.prix || reservationData?.price || 100);
    
    // Check if the price is already in cents (a large number)
    if (price >= 1000) {
      console.log('Price appears to already be in cents:', price);
      return Math.round(price); // Return as is, but ensure it's an integer
    }
    
    // Otherwise convert from currency units to cents
    console.log('Converting price to cents:', price, '->', Math.round(price * 100));
    return Math.round(price * 100); // Ensure it's an integer value in cents
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
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Complete Reservation Payment</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Better debugging and reservation info */}
        {reservationData && (
          <div className="mb-4 p-3 bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-300">
              <span className="font-medium text-white">Terrain:</span> {reservationData.terrain?.nom_terrain || 'Selected terrain'}
            </p>
            <p className="text-sm text-gray-300">
              <span className="font-medium text-white">Date:</span> {reservationData.date}
            </p>
            <p className="text-sm text-gray-300">
              <span className="font-medium text-white">Time:</span> {reservationData.heure}
            </p>
          </div>
        )}
        
        <StripePaymentForm
          amount={getAmountInCents()}
          currency="mad"
          onSuccess={handleSuccess}
          onError={handleError}
          onCancel={onClose}
          metadata={{
            type: 'reservation',
            id_terrain: reservationData?.id_terrain,
            date: reservationData?.date,
            heure: reservationData?.heure,
            id_client: reservationData?.id_client || null,
            // Store reservation object stringified for recovery
            reservation_data: JSON.stringify({
              id_terrain: reservationData?.id_terrain,
              terrain_name: reservationData?.terrain?.nom_terrain,
              date: reservationData?.date,
              heure: reservationData?.heure,
              price: reservationData?.prix || reservationData?.price,
            })
          }}
          customDescription={`Reservation for ${reservationData?.terrain?.nom_terrain || 'the selected terrain'} on ${reservationData?.date || 'the selected date'} at ${reservationData?.heure || 'the selected time'}.`}
        />
      </motion.div>
    </motion.div>
  );
};

export default ReservationPaymentModal; 
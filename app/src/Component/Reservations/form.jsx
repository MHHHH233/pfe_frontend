import React, { useState, useEffect } from "react";
import PopupCard from "./Confirmation";
import { useLocation, useNavigate } from "react-router-dom";
import AnimatedCheck from "./Status/Confirmed";
import AnimatedReserved from "./Status/Failed";
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, User, X, Mail, Phone, ChevronDown, CheckCircle, AlertCircle, DollarSign } from 'lucide-react';
import userReservationService from '../../lib/services/user/reservationServices';
import adminReservationService from '../../lib/services/admin/reservationServices';
import StripeWrapper from '../Payments/StripeWrapper';
import StripePaymentModal from '../Payments/StripePaymentModal';
import stripeService from '../../lib/services/stripeService';

// Maximum reservations per day for regular users
const MAX_DAILY_RESERVATIONS = 2;
// Refresh interval for reservation count (in milliseconds): 1 hour
const REFRESH_INTERVAL = 60 * 60 * 1000;

export default function FormResev({ Terrain, selectedHour, selectedTime, onSuccess }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = sessionStorage.getItem("type") === "admin";
  const userType = isAdmin ? "admin" : "client";
  const userId = sessionStorage.getItem("userId");
  const isLoggedIn = !!userId;
  
  // Add direct increment function
  const incrementReservationCount = () => {
    if (!isLoggedIn || isAdmin) return null;
    
    try {
      const currentCount = parseInt(sessionStorage.getItem("today_reservations_count") || "0");
      const newCount = currentCount + 1;
      
      // Immediately update both session storage and component state
      sessionStorage.setItem("today_reservations_count", newCount.toString());
      
      // Immediately update UI state for immediate visual feedback
      setDailyReservationCount(newCount);
      setReachedDailyLimit(newCount >= MAX_DAILY_RESERVATIONS);
      
      // Dispatch an event to notify other components about count change
      const countUpdateEvent = new CustomEvent('reservationCountUpdated', {
        detail: { count: newCount }
      });
      document.dispatchEvent(countUpdateEvent);
      
      return newCount;
    } catch (error) {
      return null;
    }
  };
  
  // Function to update count from session storage
  const updateCountFromSession = () => {
    const count = parseInt(sessionStorage.getItem("today_reservations_count") || "0");
    setDailyReservationCount(count);
    setReachedDailyLimit(count >= MAX_DAILY_RESERVATIONS);
  };
  
  // Function to refresh count from API
  const refreshCountFromAPI = async () => {
    try {
      setLoadingReservationCount(true);
      const count = await userReservationService.refreshReservationCount();
      
      // Get additional data from session storage
      const lastRefresh = sessionStorage.getItem('last_count_refresh');
      const recentReservations = sessionStorage.getItem('recent_reservations');
      
      if (recentReservations) {
        try {
        } catch (e) {
        }
      }
      
      setDailyReservationCount(count);
      setReachedDailyLimit(count >= MAX_DAILY_RESERVATIONS);
    } catch (error) {
      // Fallback to session storage
      updateCountFromSession();
    } finally {
      setLoadingReservationCount(false);
    }
  };
  
  // Initialize form with correct user ID
  const [formData, setFormData] = useState({
    id_terrain: Terrain?.id_terrain || sessionStorage.getItem("selectedTerrainId") || '',
    date: selectedTime || '',
    heure: selectedHour || '',
    type: userType,
    id_client: parseInt(sessionStorage.getItem("userId")),
    Name: '',
    email: '',
    telephone: '',
  });
  
  // Add state for user's daily reservations
  const [userDailyReservations, setUserDailyReservations] = useState([]);
  const [dailyReservationCount, setDailyReservationCount] = useState(0);
  const [reachedDailyLimit, setReachedDailyLimit] = useState(false);
  const [loadingReservationCount, setLoadingReservationCount] = useState(false);
  
  // Add state for Stripe payment
  const [showStripePayment, setShowStripePayment] = useState(false);
  const [reservationData, setReservationData] = useState(null);
  const [stripeClientSecret, setStripeClientSecret] = useState(null);
  const [loadingStripeIntent, setLoadingStripeIntent] = useState(false);
  
  // Use session storage reservation count
  useEffect(() => {
    if (isLoggedIn && !isAdmin) {
      const count = parseInt(sessionStorage.getItem("today_reservations_count") || "0");
      setDailyReservationCount(count);
      setReachedDailyLimit(count >= MAX_DAILY_RESERVATIONS);
    }
  }, [isLoggedIn, isAdmin]);
  
  // Add a refresh interval to keep the count in sync
  useEffect(() => {
    if (!isLoggedIn || isAdmin) return;
    
    // Refresh count immediately on component mount
    refreshCountFromAPI();
    
    // Set up interval to refresh count from API hourly
    const apiIntervalId = setInterval(refreshCountFromAPI, REFRESH_INTERVAL);
    
    // Set up more frequent session storage check for UI updates
    const sessionIntervalId = setInterval(updateCountFromSession, 5000);
    
    return () => {
      clearInterval(apiIntervalId);
      clearInterval(sessionIntervalId);
    };
  }, [isLoggedIn, isAdmin]);
  
  // When terrain changes, update form data
  useEffect(() => {
    // Check if we need to update the form based on new terrain
    if (Terrain && Terrain.id_terrain) {
      setFormData(prev => ({
        ...prev,
        id_terrain: Terrain.id_terrain,
      }));
    }
  }, [Terrain]);
  
  // When hour or date changes, update form data and check reservation limits
  useEffect(() => {
    if (selectedHour || selectedTime) {
      setFormData(prev => ({
        ...prev,
        heure: selectedHour || prev.heure,
        date: selectedTime || prev.date,
      }));
    }
  }, [selectedHour, selectedTime]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Remove login prompt - allow guest reservations
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Add a new state to control the confirmation popup
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Add state to store client ID when admin selects a name
  const [selectedClientId, setSelectedClientId] = useState('');

  useEffect(() => {
    const currentUserId = parseInt(sessionStorage.getItem("userId"));
    
    // Update form when props change
    setFormData(prev => ({
      ...prev,
      id_terrain: Terrain?.id_terrain || prev.id_terrain,
      heure: selectedHour || prev.heure,
      date: selectedTime || prev.date,
      id_client: currentUserId,
      Name: '',
      email: '',
      telephone: ''
    }));
  }, [Terrain, selectedHour, selectedTime]);

  // Add event listener for terrain selection events from parent components
  useEffect(() => {
    const handleTerrainSelected = (event) => {
      const { terrain } = event.detail;
      if (terrain) {
        setFormData(prev => ({
          ...prev,
          id_terrain: terrain.id_terrain
        }));
      }
    };

    document.addEventListener('terrainSelected', handleTerrainSelected);
    return () => {
      document.removeEventListener('terrainSelected', handleTerrainSelected);
    };
  }, []);

  // Add fallback to get terrain ID from sessionStorage if not provided as prop
  const terrainId = Terrain?.id_terrain || sessionStorage.getItem("selectedTerrainId") || '';
  const terrainName = Terrain?.nom_terrain || sessionStorage.getItem("selectedTerrainName") || '';
  const terrainPrice = Terrain?.prix || sessionStorage.getItem("selectedTerrainPrice") || '100';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Format the time to match the API's expected format H:i:s
  const formatTimeToHis = (timeString) => {
    // If it's already in H:i:s format, return it
    if (/^\d{1,2}:\d{2}:\d{2}$/.test(timeString)) {
      return timeString;
    }
    
    // If it's in H:i format, add seconds
    if (/^\d{1,2}:\d{2}$/.test(timeString)) {
      return timeString + ':00';
    }
    
    // If it's just a number (hour), format it properly
    if (/^\d{1,2}$/.test(timeString)) {
      return timeString + ':00:00';
    }
    
    // Default fallback - return as is
    return timeString;
  };

  // Modify the handleSubmit function to remove advance payment validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setError(null);
    
    // Basic validation
    if (!formData.id_terrain || !formData.date || !formData.heure) {
      setError("Please fill in all required fields");
      return;
    }
    
    // Check daily reservation limit for logged-in non-admin users
    if (isLoggedIn && !isAdmin && dailyReservationCount >= MAX_DAILY_RESERVATIONS) {
      setError(`You have reached the maximum limit of ${MAX_DAILY_RESERVATIONS} reservations per day.`);
      return;
    }
    
    // Additional validation for non-admin users who aren't logged in
    if (!isAdmin && !isLoggedIn) {
      if (!formData.Name || formData.Name.trim() === '') {
        setError("Please enter your name");
        return;
      }
      
      if (!formData.email || formData.email.trim() === '') {
        setError("Please enter your email address");
        return;
      }
      
      if (!formData.telephone || formData.telephone.trim() === '') {
        setError("Please enter your phone number");
        return;
      }
    }
    
    // Get user ID from session or use null for guest users
    const userId = isLoggedIn ? parseInt(sessionStorage.getItem("userId")) : null;
    
    // Create reservation data
    const reservationDetails = {
      id_terrain: parseInt(formData.id_terrain),
      date: formData.date,
      heure: formatTimeToHis(formData.heure),
      type: formData.type,
      id_client: userId, // Use null for non-logged in users
      payment_method: "cash",
      prix: terrainPrice, // Add the terrain price
      Name: formData.Name || sessionStorage.getItem("name") || "Guest",
      email: formData.email || sessionStorage.getItem("email") || '',
      telephone: formData.telephone || '',
    };
    
    setReservationData(reservationDetails);
    setShowConfirmation(true);
  };
  
  // Modify the handleStripePayment function to use our new components
  const handleStripePayment = async () => {
    if (!reservationData) {
      setError("Reservation data is missing. Please try again.");
      return;
    }
    
    setLoadingStripeIntent(true);
    setError(null);
    
    try {
      // Process the price correctly - IMPORTANT to store the original price
      const price = parseFloat(reservationData.price || reservationData.prix || terrainPrice || 100);
      console.log('Original price for Stripe payment:', price);
      
      // Ensure all required fields are included
      if (reservationData) {
        // Store the original price
        reservationData.price = price;
        
        // Add amount for online payments - use price directly WITHOUT multiplying by 100
        reservationData.amount = Math.round(price); // Keep the original price value
        reservationData.currency = 'mad';
        reservationData.payment_method = 'stripe';
      }
      
      // Ensure admin data is properly included
      if (isAdmin) {
        // Make sure Name is included for admin reservations
        if (!reservationData.Name && formData.Name) {
          reservationData.Name = formData.Name;
        }
      }
      
      // Set metadata for tracking
      const metadata = {
        type: 'reservation',
        id_terrain: reservationData.id_terrain,
        date: reservationData.date,
        heure: reservationData.heure,
        id_client: reservationData.id_client || null,
        is_admin: isAdmin ? 'true' : 'false',
        // Add the original price to metadata
        price: price,
        // Add terrain details
        terrain_name: Terrain?.nom_terrain || sessionStorage.getItem("selectedTerrainName") || 'Selected terrain',
      };
      
      console.log('Reservation data before payment:', reservationData);
      console.log('Metadata for payment:', metadata);
      
      // Hide the confirmation modal and show the Stripe payment modal
      setShowConfirmation(false);
      setShowStripePayment(true);
    } catch (error) {
      setError("Failed to initiate payment. Please try again.");
    } finally {
      setLoadingStripeIntent(false);
    }
  };

  // Add a function to handle closing the confirmation
  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    setReservationData(null);
  };

  // Handle closing the Stripe payment modal
  const handleCloseStripePayment = () => {
    setShowStripePayment(false);
    setStripeClientSecret(null);
    setReservationData(null); // Reset reservation data to allow new reservations
    
    // Reset any error state
    setError(null);
    
    // Check if we need to refresh the UI
    const refreshNeeded = sessionStorage.getItem("stripe_payment_success") === "true";
    if (refreshNeeded) {
      // Clear the flag
      sessionStorage.removeItem("stripe_payment_success");
      
      // Call success handler to refresh data
      handleReservationSuccess();
    }
  };

  // Update handleReservationSuccess to directly update the count from session storage
  const handleReservationSuccess = () => {
    setSuccess(true);
    setShowConfirmation(false);
    setShowStripePayment(false);
    
    // Check if we need to show a receipt for admin
    if (isAdmin && sessionStorage.getItem("show_admin_receipt") === "true") {
      try {
        // Get receipt data from session storage
        const receiptDataStr = sessionStorage.getItem("admin_receipt_data");
        if (receiptDataStr) {
          const receiptData = JSON.parse(receiptDataStr);
          
          // Create and dispatch an event to show the receipt
          const receiptEvent = new CustomEvent('showAdminReceipt', {
            detail: { 
              receiptData,
              isAdmin: true
            }
          });
          document.dispatchEvent(receiptEvent);
          
          // Clear the session storage flags
          sessionStorage.removeItem("show_admin_receipt");
          sessionStorage.removeItem("admin_receipt_data");
        }
      } catch (e) {
        console.error("Error processing receipt data:", e);
      }
    }
    
    setReservationData(null); // Reset reservation data to allow new reservations
    
    // IMMEDIATELY update the count from session storage
    if (isLoggedIn && !isAdmin) {
      try {
        const count = parseInt(sessionStorage.getItem("today_reservations_count") || "0");
        setDailyReservationCount(count);
        setReachedDailyLimit(count >= MAX_DAILY_RESERVATIONS);
        
        // Always call refreshReservationCount to ensure server-side count is updated
        userReservationService.refreshReservationCount()
          .then(serverCount => {
            console.log("Server count after refresh:", serverCount);
            // Update with server count if different from local count
            if (serverCount !== count) {
              setDailyReservationCount(serverCount);
              setReachedDailyLimit(serverCount >= MAX_DAILY_RESERVATIONS);
            }
          })
          .catch(error => {
            console.error("Error refreshing reservation count:", error);
          });
      } catch (error) {
        console.error("Error updating reservation count:", error);
      }
    }
    
    // Clear form with the correct structure
    setFormData({
      id_terrain: Terrain?.id_terrain || '',
      date: selectedTime || '',
      heure: selectedHour || '',
      type: userType,
      id_client: parseInt(sessionStorage.getItem("userId")) || null,
      Name: '',
      email: '',
      telephone: ''
    });
    
    // Call the onSuccess callback to refresh reservations via API
    if (onSuccess) {
      onSuccess();
    }
    
    // Dispatch event for successful reservation to trigger table refresh
    const event = new CustomEvent('reservationSuccess', {
      detail: { 
        refreshNeeded: true,
        timestamp: Date.now(), // Add timestamp to make each event unique
        refreshAPI: isLoggedIn && !isAdmin // Flag to refresh from API
      }
    });
    document.dispatchEvent(event);
    
    // Reset state to allow for new reservation
    setTimeout(() => {
      setSuccess(false);
    }, 3000);
    
    // Clear session storage if needed
    sessionStorage.removeItem("selectedHour");
    sessionStorage.removeItem("selectedTime");
    sessionStorage.removeItem("selectedTerrain");
    sessionStorage.removeItem("showReservationPopup");
    
    // If we're in the Admin component, close the popup after success
    if (location.pathname === "/Admin") {
      // Dispatch event to close popup
      setTimeout(() => {
        const closePopupEvent = new CustomEvent('closeReservationPopup');
        document.dispatchEvent(closePopupEvent);
      }, 2000); // Wait 2 seconds to show success message
    }
  };

  // Add event listener for status popup closed events
  useEffect(() => {
    const handleStatusPopupClosed = () => {
      setShowConfirmation(false);
      setReservationData(null);
      
      // Reset success state after a delay
      setTimeout(() => {
        setSuccess(false);
      }, 500);
      
      // Update reservation count from session storage
      if (isLoggedIn && !isAdmin) {
        const count = parseInt(sessionStorage.getItem("today_reservations_count") || "0");
        setDailyReservationCount(count);
        setReachedDailyLimit(count >= MAX_DAILY_RESERVATIONS);
      }
    };

    // Add event listener for reservation success events
    const handleReservationSuccess = (event) => {
      // Check for is_new_user and email_sent flags
      const { is_new_user, user_email, email_sent, num_res, reservationConfirmed } = event.detail || {};
      
      console.log('Reservation success event with details:', {
        is_new_user, user_email, email_sent, num_res, reservationConfirmed
      });
      
      // Always update the UI if there was a confirmed reservation
      if (reservationConfirmed) {
        setSuccess(true);
        
        // Update reservation count from session storage immediately
        if (isLoggedIn && !isAdmin) {
          try {
            const count = parseInt(sessionStorage.getItem("today_reservations_count") || "0");
            setDailyReservationCount(count);
            setReachedDailyLimit(count >= MAX_DAILY_RESERVATIONS);
          } catch (error) {
            console.error('Error updating count from session:', error);
          }
        }
        
        // Reset the form data
        setFormData({
          id_terrain: Terrain?.id_terrain || '',
          date: selectedTime || '',
          heure: selectedHour || '',
          type: userType,
          id_client: parseInt(sessionStorage.getItem("userId")) || null,
          Name: '',
          email: '',
          telephone: ''
        });
        
        // Hide confirmation and payment modals
        setShowConfirmation(false);
        setShowStripePayment(false);
        setReservationData(null);
        
        // Call the onSuccess callback to refresh reservations via API
        if (onSuccess) {
          onSuccess();
        }
      }
    };

    document.addEventListener('statusPopupClosed', handleStatusPopupClosed);
    document.addEventListener('reservationSuccess', handleReservationSuccess);
    
    return () => {
      document.removeEventListener('statusPopupClosed', handleStatusPopupClosed);
      document.removeEventListener('reservationSuccess', handleReservationSuccess);
    };
  }, [dailyReservationCount, isLoggedIn, isAdmin, Terrain, selectedTime, selectedHour, userType, onSuccess]);

  // Add event listener for confirmation popup closed events
  useEffect(() => {
    const handleConfirmationPopupClosed = (event) => {
      setReservationData(null);
      setShowConfirmation(false);
    };
    
    document.addEventListener('confirmationPopupClosed', handleConfirmationPopupClosed);
    
    return () => {
      document.removeEventListener('confirmationPopupClosed', handleConfirmationPopupClosed);
    };
  }, []);

  // Add navigation event listener
  useEffect(() => {
    const handleNavigateToProfile = (event) => {
      const { redirectAfterDelay, delay = 2000 } = event.detail;
      
      if (redirectAfterDelay) {
        // Set a timeout to navigate after the specified delay
        setTimeout(() => {
          navigate('/profile');
        }, delay);
      } else {
        // Navigate immediately
        navigate('/profile');
      }
    };
    
    // Add event listener
    document.addEventListener('navigateToProfile', handleNavigateToProfile);
    
    // Clean up
    return () => {
      document.removeEventListener('navigateToProfile', handleNavigateToProfile);
    };
  }, [navigate]);

  // Add event listener for successful Stripe payments
  useEffect(() => {
    const handlePaymentSuccess = (event) => {
      const { reservationData, paymentIntent } = event.detail || {};
      
      // Store success flag for when modal closes
      sessionStorage.setItem("stripe_payment_success", "true");
      
      // For admin users, show receipt after successful payment
      if (isAdmin && reservationData) {
        const responseData = reservationData.data || {};
        
        // Prepare receipt data for admin
        const receiptData = {
          reservationNumber: responseData.num_res || '',
          date: responseData.date || '',
          time: responseData.heure || '',
          terrainName: Terrain?.nom_terrain || 'Selected terrain',
          price: responseData.prix || terrainPrice,
          paymentMethod: 'stripe',
          paymentStatus: responseData.etat || 'paid',
          clientName: responseData.Name || '',
          advancePayment: responseData.advance_payment || 0,
          etat: responseData.etat || 'reserver',
          expiration_warning: reservationData.expiration_warning || ''
        };
        
        // Store receipt data in session storage for retrieval
        try {
          sessionStorage.setItem("admin_receipt_data", JSON.stringify(receiptData));
          sessionStorage.setItem("show_admin_receipt", "true");
        } catch (e) {
          console.error("Error storing receipt data:", e);
        }
      }
      
      // Reset reservation data to allow new reservations
      setReservationData(null);
      
      // Close the Stripe payment modal after a short delay
      setTimeout(() => {
        setShowStripePayment(false);
        
        // Call success handler to refresh data
        handleReservationSuccess();
      }, 1500);
    };
    
    document.addEventListener('paymentSuccess', handlePaymentSuccess);
    
    return () => {
      document.removeEventListener('paymentSuccess', handlePaymentSuccess);
    };
  }, [isAdmin, Terrain, terrainPrice]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-900 p-6 rounded-xl shadow-xl border border-gray-800"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-green-400">
          {isAdmin ? "Create Reservation" : "Book Your Session"}
        </h3>
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-medium"
          >
            <CheckCircle size={16} />
            <span>Reservation Confirmed</span>
          </motion.div>
        )}
      </div>
      
      {/* Daily Reservation Limit Info for logged-in users */}
      {isLoggedIn && !isAdmin && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 p-4 rounded-lg border ${
            reachedDailyLimit 
              ? "bg-red-500/10 border-red-500/30 text-red-400" 
              : "bg-blue-500/10 border-blue-500/30 text-blue-400"
          }`}
        >
          <div className="flex items-center gap-3">
            {loadingReservationCount ? (
              <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full"></div>
            ) : reachedDailyLimit ? (
              <AlertCircle size={20} />
            ) : (
              <Calendar size={20} />
            )}
            <div>
              <p className="font-medium">
                {reachedDailyLimit 
                  ? `Daily limit reached (${dailyReservationCount}/${MAX_DAILY_RESERVATIONS})` 
                  : `Reservations today: ${dailyReservationCount}/${MAX_DAILY_RESERVATIONS}`
                }
              </p>
              <p className="text-xs opacity-80 mt-1">
                {reachedDailyLimit 
                  ? "You've reached the maximum number of reservations for this day" 
                  : `You can make ${MAX_DAILY_RESERVATIONS - dailyReservationCount} more reservation(s) today`
                }
              </p>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Selected Terrain Card */}
      {terrainId && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <MapPin size={24} className="text-green-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-400">Selected Terrain</p>
              <h4 className="text-lg font-semibold text-white mt-1">{terrainName}</h4>
              {terrainPrice && (
                <p className="text-green-400 text-sm mt-1">{terrainPrice} MAD per hour</p>
              )}
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <X size={18} className="text-red-400" />
              </div>
              <p className="text-red-400 font-medium">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <input type="hidden" name="id_terrain" value={formData.id_terrain} />
        
        {/* Date and Time Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Date Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Select Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar size={18} className="text-green-400" />
              </div>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white
                         placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent
                         hover:border-gray-600 transition-all duration-200"
                required
              />
            </div>
          </div>
          
          {/* Time Select */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Select Time
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Clock size={18} className="text-green-400" />
              </div>
              <select
                name="heure"
                value={formData.heure}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white
                         appearance-none cursor-pointer focus:ring-2 focus:ring-green-500 focus:border-transparent
                         hover:border-gray-600 transition-all duration-200"
              >
                <option value="">Choose time</option>
                {["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", 
                  "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", 
                  "22:00", "23:00"].map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ChevronDown size={18} className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>
        
        {/* User Information Section */}
        {(isAdmin || !isLoggedIn) && (
          <div className="space-y-4 mt-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px flex-1 bg-gray-800"></div>
              <span className="text-sm font-medium text-gray-400">User Information</span>
              <div className="h-px flex-1 bg-gray-800"></div>
            </div>
            
            {/* Name Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                {isAdmin ? "Client Name" : "Your Name"}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-green-400" />
                </div>
                <input
                  type="text"
                  name="Name"
                  value={formData.Name}
                  onChange={handleChange}
                  placeholder={isAdmin ? "Enter client name" : "Enter your name"}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white
                           placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent
                           hover:border-gray-600 transition-all duration-200"
                  required={isAdmin}
                />
              </div>
            </div>
            
            {!isAdmin && !isLoggedIn && (
              <>
                {/* Email Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={18} className="text-green-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white
                               placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent
                               hover:border-gray-600 transition-all duration-200"
                    />
                  </div>
                </div>
                
                {/* Phone Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone size={18} className="text-green-400" />
                    </div>
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white
                               placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent
                               hover:border-gray-600 transition-all duration-200"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex justify-end items-center gap-4 pt-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => {
              sessionStorage.removeItem("selectedHour");
              sessionStorage.removeItem("selectedTime");
              sessionStorage.removeItem("selectedTerrain");
              sessionStorage.removeItem("showReservationPopup");
              
              const event = new CustomEvent('reservationCancelled');
              document.dispatchEvent(event);
              
              if (location.pathname === "/Admin") {
                const closePopupEvent = new CustomEvent('closeReservationPopup');
                document.dispatchEvent(closePopupEvent);
              }
            }}
            className="px-5 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700
                     border border-gray-700 hover:border-gray-600
                     transition-all duration-200 font-medium"
          >
            Cancel
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading || (!isAdmin && reachedDailyLimit)}
            className={`px-5 py-2 rounded-lg font-medium transition-all duration-200
                      bg-green-500 text-white
                      hover:bg-green-600
                      disabled:opacity-70 disabled:cursor-not-allowed
                      ${loading ? "animate-pulse" : ""}`}
          >
            {loading ? "Processing..." : "Confirm Reservation"}
          </motion.button>
        </div>
      </form>
      
      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && (
          <PopupCard 
            isVisible={showConfirmation}
            onClose={handleCloseConfirmation}
            data={reservationData}
            resetStatus={handleReservationSuccess}
            onPayOnline={handleStripePayment}
            loadingStripeIntent={loadingStripeIntent}
          />
        )}
      </AnimatePresence>
      
      {/* Stripe Payment Modal */}
      <StripeWrapper>
        <StripePaymentModal
          show={showStripePayment}
          onClose={handleCloseStripePayment}
          onSuccess={handleReservationSuccess}
          amount={(() => {
            // Get the price from either reservationData or terrain price
            const price = parseFloat(reservationData?.price || reservationData?.prix || terrainPrice || 100);
            
            // Ensure we're working with a valid number
            if (isNaN(price)) return 10000; // Default to 100.00 in cents
            
            // IMPORTANT: Do NOT multiply by 100 - use the price value directly
            // as the API is expecting the actual price value
            return Math.round(price);
          })()}
          currency="mad"
          metadata={{
            type: 'reservation',
            id_terrain: reservationData?.id_terrain,
            date: reservationData?.date,
            heure: reservationData?.heure,
            id_client: reservationData?.id_client || null,
            // Add the original price to metadata
            price: reservationData?.price || reservationData?.prix || terrainPrice || 100,
            // Add terrain details
            terrain_name: Terrain?.nom_terrain || sessionStorage.getItem("selectedTerrainName") || 'Selected terrain',
          }}
          title="Complete Reservation Payment"
          description={`Reservation for ${Terrain?.nom_terrain || 'Selected terrain'} on ${reservationData?.date || 'selected date'} at ${reservationData?.heure || 'selected time'}`}
        />
      </StripeWrapper>
    </motion.div>
  );
}
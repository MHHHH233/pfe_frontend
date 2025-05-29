import React, { useState, useEffect } from "react";
import PopupCard from "./Confirmation";
import { useLocation } from "react-router-dom";
import AnimatedCheck from "./Status/Confirmed";
import AnimatedReserved from "./Status/Failed";
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, User, X, Mail, Phone, ChevronDown, CheckCircle, AlertCircle } from 'lucide-react';
import userReservationService from '../../lib/services/user/reservationServices';
import adminReservationService from '../../lib/services/admin/reservationServices';

// Maximum reservations per day for regular users
const MAX_DAILY_RESERVATIONS = 2;

export default function FormResev({ Terrain, selectedHour, selectedTime, onSuccess }) {
  const location = useLocation();
  const isAdmin = sessionStorage.getItem("type") === "admin";
  const userType = isAdmin ? "admin" : "client";
  const userId = sessionStorage.getItem("userId");
  const isLoggedIn = !!userId;
  
  // Add direct increment function
  const incrementReservationCount = () => {
    if (!isLoggedIn || isAdmin) return;
    
    try {
      console.log("DIRECT INCREMENT FUNCTION CALLED");
      const currentCount = parseInt(sessionStorage.getItem("today_reservations_count") || "0");
      console.log("BEFORE direct increment - Current count:", currentCount);
      const newCount = currentCount + 1;
      console.log("AFTER direct increment - New count:", newCount);
      sessionStorage.setItem("today_reservations_count", newCount.toString());
      
      // Update component state
      setDailyReservationCount(newCount);
      setReachedDailyLimit(newCount >= MAX_DAILY_RESERVATIONS);
      
      return newCount;
    } catch (error) {
      console.error("Error incrementing reservation count:", error);
      return null;
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
  
  // Use session storage reservation count
  useEffect(() => {
    if (isLoggedIn && !isAdmin) {
      const count = parseInt(sessionStorage.getItem("today_reservations_count") || "0");
      console.log("Reading reservation count from session storage:", count);
      setDailyReservationCount(count);
      setReachedDailyLimit(count >= MAX_DAILY_RESERVATIONS);
    }
  }, [isLoggedIn, isAdmin]);
  
  // Add a refresh interval to keep the count in sync
  useEffect(() => {
    if (!isLoggedIn || isAdmin) return;
    
    // Function to update count from session storage
    const updateCountFromSession = () => {
      const count = parseInt(sessionStorage.getItem("today_reservations_count") || "0");
      setDailyReservationCount(count);
      setReachedDailyLimit(count >= MAX_DAILY_RESERVATIONS);
    };
    
    // Update immediately
    updateCountFromSession();
    
    // Set up interval to check for changes
    const intervalId = setInterval(updateCountFromSession, 1000);
    
    return () => clearInterval(intervalId);
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
  const [reservationData, setReservationData] = useState(null);

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

  // Modify the handleSubmit function to not increment the count yet
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
      Name: formData.Name || "Guest",
      ...(formData.email && { email: formData.email }),
      ...(formData.telephone && { telephone: formData.telephone })
    };
    
    console.log("Creating reservation with price:", terrainPrice);
    
    setReservationData(reservationDetails);
    setShowConfirmation(true);
  };

  // Add a function to handle closing the confirmation
  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    setReservationData(null);
  };

  // Update handleReservationSuccess to directly update the count from session storage
  const handleReservationSuccess = () => {
    setSuccess(true);
    setShowConfirmation(false);
    
    // IMMEDIATELY update the count from session storage
    if (isLoggedIn && !isAdmin) {
      try {
        const count = parseInt(sessionStorage.getItem("today_reservations_count") || "0");
        console.log("IMMEDIATE update of count in handleReservationSuccess:", count);
        setDailyReservationCount(count);
        setReachedDailyLimit(count >= MAX_DAILY_RESERVATIONS);
      } catch (error) {
        console.error("Error reading reservation count:", error);
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
      console.log("Refreshing reservation table via API call");
      onSuccess();
    }
    
    // Dispatch event for successful reservation to trigger table refresh
    const event = new CustomEvent('reservationSuccess', {
      detail: { refreshNeeded: true }
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
        console.log("Updating count after popup closed:", count);
        setDailyReservationCount(count);
        setReachedDailyLimit(count >= MAX_DAILY_RESERVATIONS);
      }
    };

    // Add event listener for reservation success events
    const handleReservationSuccess = (event) => {
      // Only increment the count if the reservation is confirmed
      if (event.detail && event.detail.reservationConfirmed && isLoggedIn && !isAdmin) {
        console.log("Confirmed reservation detected, incrementing count");
        incrementReservationCount();
      }
      
      // Always update from session storage as a fallback
      setTimeout(() => {
        if (isLoggedIn && !isAdmin) {
          const count = parseInt(sessionStorage.getItem("today_reservations_count") || "0");
          console.log("Delayed count update after reservation:", count);
          setDailyReservationCount(count);
          setReachedDailyLimit(count >= MAX_DAILY_RESERVATIONS);
        }
      }, 500);
    };

    document.addEventListener('statusPopupClosed', handleStatusPopupClosed);
    document.addEventListener('reservationSuccess', handleReservationSuccess);
    
    return () => {
      document.removeEventListener('statusPopupClosed', handleStatusPopupClosed);
      document.removeEventListener('reservationSuccess', handleReservationSuccess);
    };
  }, [dailyReservationCount, isLoggedIn, isAdmin]);

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
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
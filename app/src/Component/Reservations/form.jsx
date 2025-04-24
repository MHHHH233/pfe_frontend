import React, { useState, useEffect } from "react";
import PopupCard from "./Confirmation";
import { useLocation } from "react-router-dom";
import AnimatedCheck from "./Status/Confirmed";
import AnimatedReserved from "./Status/Failed";
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, MapPin, User, X, Mail, Phone, ChevronDown, CheckCircle } from 'lucide-react';
import userReservationService from '../../lib/services/user/reservationServices';
import adminReservationService from '../../lib/services/admin/reservationServices';

export default function FormResev({ Terrain, selectedHour, selectedTime, onSuccess }) {
  const location = useLocation();
  const isAdmin = sessionStorage.getItem("type") === "admin";
  const userType = isAdmin ? "admin" : "client";
  const userId = sessionStorage.getItem("userId");
  const isLoggedIn = !!userId;
  
  // Add more detailed logging to debug the terrain data
  console.log("FormResev initial props:", { 
    Terrain, 
    selectedHour, 
    selectedTime, 
    isAdmin, 
    userId 
  });
  
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
  
  // When terrain changes, update form data
  useEffect(() => {
    console.log("FormResev terrain changed:", Terrain);
    
    // Check if we need to update the form based on new terrain
    if (Terrain && Terrain.id_terrain) {
      setFormData(prev => ({
        ...prev,
        id_terrain: Terrain.id_terrain,
      }));
      console.log("Updated form with terrain ID:", Terrain.id_terrain);
    }
  }, [Terrain]);
  
  // When hour or date changes, update form data
  useEffect(() => {
    if (selectedHour || selectedTime) {
      setFormData(prev => ({
        ...prev,
        heure: selectedHour || prev.heure,
        date: selectedTime || prev.date,
      }));
      console.log("Updated form with hour/time:", { selectedHour, selectedTime });
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
    console.log("FormResev received props:", { Terrain, selectedHour, selectedTime });
    
    const currentUserId = parseInt(sessionStorage.getItem("userId"));
    console.log("Current User ID in useEffect:", currentUserId);
    
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
    
    console.log("Form data updated:", formData);
  }, [Terrain, selectedHour, selectedTime]);

  // Add event listener for terrain selection events from parent components
  useEffect(() => {
    const handleTerrainSelected = (event) => {
      const { terrain } = event.detail;
      console.log("Received terrain selection event:", terrain);
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
  
  console.log("FormResev terrain data:", { 
    terrainId, 
    terrainName, 
    propTerrain: Terrain 
  });

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

  // Modify the handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.id_terrain || !formData.date || !formData.heure) {
      setError("Please fill in all required fields");
      return;
    }
    
    // Debug alert for user ID
    const currentUserId = sessionStorage.getItem("userId");
    
    
    // Create reservation data with guaranteed user ID
    const reservationDetails = {
      id_terrain: parseInt(formData.id_terrain),
      date: formData.date,
      heure: formatTimeToHis(formData.heure),
      type: formData.type,
      id_client: parseInt(sessionStorage.getItem("userId")), // Explicitly set user ID
      payment_method: "cash",
      Name: formData.Name || "Guest",
      ...(formData.email && { email: formData.email }),
      ...(formData.telephone && { telephone: formData.telephone })
    };

    // Debug alert for final payload
    

    console.log('Submitting reservation:', reservationDetails); 
    
    setReservationData(reservationDetails);
    setShowConfirmation(true);
  };

  // Add a function to handle closing the confirmation
  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    setReservationData(null);
  };

  // Add a function to handle successful reservation
  const handleReservationSuccess = () => {
    setSuccess(true);
    setShowConfirmation(false);
    
    // Clear form with the correct structure
    setFormData({
      id_terrain: Terrain?.id_terrain || '',
      date: selectedTime || '',
      heure: selectedHour || '',
      type: userType,
      id_client: null,
      Name: '',
      email: '',
      telephone: ''
    });
    
    // Call the onSuccess callback to refresh reservations
    if (onSuccess) onSuccess();
    
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-900/90 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-gray-800"
    >
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-[#07f468] to-[#00d1ff] bg-clip-text text-transparent">
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
      
      {/* Selected Terrain Card */}
      {terrainId && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 backdrop-blur-sm"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#07f468]/10 rounded-lg">
              <MapPin size={24} className="text-[#07f468]" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-400">Selected Terrain</p>
              <h4 className="text-lg font-semibold text-white mt-1">{terrainName}</h4>
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
            className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl backdrop-blur-sm"
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
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <input type="hidden" name="id_terrain" value={formData.id_terrain} />
        
        {/* Date and Time Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Date Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Select Date
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Calendar size={18} className="text-[#07f468] group-hover:text-[#00d1ff] transition-colors duration-200" />
              </div>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-700 bg-gray-800/50 text-white
                         placeholder-gray-400 focus:ring-2 focus:ring-[#07f468] focus:border-transparent
                         hover:border-gray-600 transition-all duration-200 backdrop-blur-sm"
                required
              />
            </div>
          </div>
          
          {/* Time Select */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Select Time
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Clock size={18} className="text-[#07f468] group-hover:text-[#00d1ff] transition-colors duration-200" />
              </div>
              <select
                name="heure"
                value={formData.heure}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-10 py-3 rounded-xl border border-gray-700 bg-gray-800/50 text-white
                         appearance-none cursor-pointer focus:ring-2 focus:ring-[#07f468] focus:border-transparent
                         hover:border-gray-600 transition-all duration-200 backdrop-blur-sm"
              >
                <option value="">Choose time</option>
                {["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", 
                  "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", 
                  "22:00", "23:00"].map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <ChevronDown size={18} className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>
        
        {/* User Information Section */}
        {(isAdmin || !isLoggedIn) && (
          <div className="space-y-6 mt-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px flex-1 bg-gray-800"></div>
              <span className="text-sm font-medium text-gray-400">User Information</span>
              <div className="h-px flex-1 bg-gray-800"></div>
            </div>
            
            {/* Name Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                {isAdmin ? "Client Name" : "Your Name"}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User size={18} className="text-[#07f468] group-hover:text-[#00d1ff] transition-colors duration-200" />
                </div>
                <input
                  type="text"
                  name="Name"
                  value={formData.Name}
                  onChange={handleChange}
                  placeholder={isAdmin ? "Enter client name" : "Enter your name"}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-700 bg-gray-800/50 text-white
                           placeholder-gray-400 focus:ring-2 focus:ring-[#07f468] focus:border-transparent
                           hover:border-gray-600 transition-all duration-200 backdrop-blur-sm"
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
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail size={18} className="text-[#07f468] group-hover:text-[#00d1ff] transition-colors duration-200" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-700 bg-gray-800/50 text-white
                               placeholder-gray-400 focus:ring-2 focus:ring-[#07f468] focus:border-transparent
                               hover:border-gray-600 transition-all duration-200 backdrop-blur-sm"
                    />
                  </div>
                </div>
                
                {/* Phone Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Phone Number
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone size={18} className="text-[#07f468] group-hover:text-[#00d1ff] transition-colors duration-200" />
                    </div>
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-700 bg-gray-800/50 text-white
                               placeholder-gray-400 focus:ring-2 focus:ring-[#07f468] focus:border-transparent
                               hover:border-gray-600 transition-all duration-200 backdrop-blur-sm"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex justify-end items-center gap-4 pt-8">
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
            className="px-6 py-3 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700
                     border border-gray-700 hover:border-gray-600
                     transition-all duration-200 font-medium"
          >
            Cancel
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200
                      bg-gradient-to-r from-[#07f468] to-[#00d1ff] text-gray-900
                      hover:shadow-lg hover:shadow-[#07f468]/20
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
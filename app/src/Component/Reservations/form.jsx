import React, { useState, useEffect } from "react";
import PopupCard from "./Confirmation";
import { useLocation } from "react-router-dom";
import AnimatedCheck from "./Status/Confirmed";
import AnimatedReserved from "./Status/Failed";
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, User, X } from 'lucide-react';
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-gray-800 p-6 rounded-lg shadow-lg"
    >
      <h3 className="text-xl font-bold mb-4 text-[#07f468]">
        {isAdmin ? "Create Reservation" : "Book a Terrain"}
      </h3>
      
      {/* Display selected terrain name to confirm correct selection */}
      {terrainId && (
        <div className="mb-4 p-3 bg-gray-700/50 rounded-lg border border-gray-600">
          <p className="text-sm text-gray-300">Selected Terrain:</p>
          <p className="text-white font-medium">{terrainName}</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-900/30 border border-red-500 text-red-300 p-3 rounded-lg mb-4 flex items-center">
          <X size={18} className="mr-2 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-green-900/30 border border-green-500 text-green-300 p-3 rounded-lg mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <p>Reservation created successfully!</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Remove or hide the Terrain input field since it's shown above */}
        <input 
          type="hidden" 
          name="id_terrain" 
          value={formData.id_terrain} 
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar size={16} className="text-gray-400" />
            </div>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-3 pl-10 rounded-lg border border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-[#07f468] focus:outline-none"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Time</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Clock size={16} className="text-gray-400" />
            </div>
            <select
              name="heure"
              value={formData.heure}
              onChange={handleChange}
              required
              className="w-full p-3 pl-10 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#07f468] focus:outline-none appearance-none"
            >
              <option value="">Select a time</option>
              <option value="08:00">08:00</option>
              <option value="09:00">09:00</option>
              <option value="10:00">10:00</option>
              <option value="11:00">11:00</option>
              <option value="12:00">12:00</option>
              <option value="13:00">13:00</option>
              <option value="14:00">14:00</option>
              <option value="15:00">15:00</option>
              <option value="16:00">16:00</option>
              <option value="17:00">17:00</option>
              <option value="18:00">18:00</option>
              <option value="19:00">19:00</option>
              <option value="20:00">20:00</option>
              <option value="21:00">21:00</option>
              <option value="22:00">22:00</option>
              <option value="23:00">23:00</option>
            </select>
          </div>
        </div>
        
        {isAdmin && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Client Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                name="Name"
                value={formData.Name}
                onChange={handleChange}
                required
                placeholder="Enter client name"
                className="w-full p-3 pl-10 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#07f468] focus:outline-none"
              />
            </div>
          </div>
        )}
        
        {/* Always show name input for non-logged in users */}
        {!isAdmin && !isLoggedIn && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Your Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="Name"
                  value={formData.Name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full p-3 pl-10 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#07f468] focus:outline-none"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full p-3 pl-10 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#07f468] focus:outline-none"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <input
                  type="tel"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="w-full p-3 pl-10 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#07f468] focus:outline-none"
                />
              </div>
            </div>
          </>
        )}
        
        <div className="flex justify-end space-x-3 pt-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => {
              // Clear sessionStorage
              sessionStorage.removeItem("selectedHour");
              sessionStorage.removeItem("selectedTime");
              sessionStorage.removeItem("selectedTerrain");
              sessionStorage.removeItem("showReservationPopup");
              
              // Dispatch event to notify parent components
              const event = new CustomEvent('reservationCancelled');
              document.dispatchEvent(event);
              
              // If we're in the Admin component, we need to close the popup
              if (location.pathname === "/Admin") {
                // Find the parent component that can close the popup
                const closePopupEvent = new CustomEvent('closeReservationPopup');
                document.dispatchEvent(closePopupEvent);
              }
            }}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
          >
            Cancel
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className={`px-4 py-2 bg-[#07f468] text-gray-900 font-medium rounded-lg hover:bg-[#06d35a] transition-colors ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Creating..." : "Create Reservation"}
          </motion.button>
        </div>
      </form>
      
      {/* Add the Confirmation component */}
      {showConfirmation && (
        <PopupCard 
          isVisible={showConfirmation}
          onClose={handleCloseConfirmation}
          data={reservationData}
          resetStatus={handleReservationSuccess}
        />
      )}
    </motion.div>
  );
}
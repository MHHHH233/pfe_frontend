import React, { useState, useEffect } from "react";
import PopupCard from "./Confirmation";
import { useLocation } from "react-router-dom";
import AnimatedCheck from "./Status/Confirmed";
import AnimatedReserved from "./Status/Failed";
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, User, X } from 'lucide-react';
import reservationService from '../../lib/services/admin/reservationServices';

export default function FormResev({ Terrain, selectedHour, selectedTime, onSuccess }) {
  const location = useLocation();
  const isAdmin = sessionStorage.getItem("type") === "admin";
  const userType = isAdmin ? "admin" : "client";
  
  const [formData, setFormData] = useState({
    id_terrain: Terrain || '',
    date: '',
    heure: selectedTime || '',
    Name: '',
    id_client: sessionStorage.getItem("userId") || '',
    // Set default etat based on user role
    etat: isAdmin ? "reserver" : "en attente",
    type: userType // Add valid type value
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Update form when props change
    setFormData(prev => ({
      ...prev,
      id_terrain: Terrain || prev.id_terrain,
      heure: selectedHour || prev.heure,
      date: selectedTime || prev.date,
      id_client: sessionStorage.getItem("userId") || prev.id_client
    }));
    
    // Set today's date as default only if no date is provided
    if (!selectedTime && !formData.date) {
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0];
      setFormData(prev => ({
        ...prev,
        date: formattedDate
      }));
    }
    
    console.log("Form data updated:", {
      terrain: Terrain,
      hour: selectedHour,
      date: selectedTime
    });
  }, [Terrain, selectedHour, selectedTime]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Format the time to match the API's expected format H:i:s
      const dataToSubmit = {
        ...formData,
        id_client: sessionStorage.getItem("userId") || formData.id_client,
        heure: formatTimeToHis(formData.heure)
      };
      
      console.log("Submitting reservation with data:", dataToSubmit);
      
      const response = await reservationService.createReservation(dataToSubmit);
      
      if (response && response.status === 201) {
        setSuccess(true);
        // Clear form or reset to defaults
        setFormData({
          id_terrain: Terrain || '',
          date: selectedTime || '',
          heure: selectedHour || '',
          Name: '',
          id_client: sessionStorage.getItem("userId") || '',
          etat: isAdmin ? "reserver" : "en attente",
          type: userType // Add valid type value
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
      } else {
        setError(response?.data?.message || 'Failed to create reservation');
      }
    } catch (error) {
      console.error('Error creating reservation:', error);
      setError(error?.response?.data?.error?.heure?.[0] || 
               error?.response?.data?.message || 
               'An error occurred while creating the reservation');
    } finally {
      setLoading(false);
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
      
      {error && (
        <div className="bg-red-900/30 border border-red-500 text-red-300 p-3 rounded-lg mb-4 flex items-center">
          <X size={18} className="mr-2 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-green-900/30 border border-green-500 text-green-300 p-3 rounded-lg mb-4">
          Reservation created successfully!
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Terrain</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin size={16} className="text-gray-400" />
            </div>
            <select
              name="id_terrain"
              value={formData.id_terrain}
              onChange={handleChange}
              required
              className="w-full p-3 pl-10 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#07f468] focus:outline-none appearance-none"
            >
              <option value="">Select a terrain</option>
              <option value="1">Terrain 1</option>
              <option value="2">Terrain 2</option>
              <option value="3">Terrain 3</option>
              <option value="4">Terrain 4</option>
              <option value="5">Terrain 5</option>
            </select>
          </div>
        </div>
        
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
              required
              className="w-full p-3 pl-10 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#07f468] focus:outline-none"
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
    </motion.div>
  );
}
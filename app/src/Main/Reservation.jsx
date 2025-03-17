import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Buttons from "../Component/Reservations/buttons";
import Tableau from "../Component/Reservations/table";
import background from "../img/background1.png";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin } from "lucide-react";

export default function Reservations() {
  const [idTerrain, setIdTerrain] = useState(null);
  const [userReservations, setUserReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const userId = sessionStorage.getItem("userId");
  const userName = sessionStorage.getItem("name");

  const handleChange = (terrain) => {
    setIdTerrain(terrain);
  };

  // Fetch user's reservations
  useEffect(() => {
    if (userId) {
      // This would be implemented to fetch the user's reservations
      // For now, we'll just show the component
    }
  }, [userId]);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-cover bg-center py-6 px-2 sm:py-12 sm:px-4"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-white mb-6 sm:mb-12 relative">
          Book Your Terrain
          <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-green-400"></span>
        </h1>
        
        {/* Welcome message for logged in users */}
        {userName && (
          <div className="bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg mb-8 text-white">
            <h2 className="text-xl font-semibold mb-2">Welcome, {userName}!</h2>
            <p className="text-gray-300">Select a terrain and time slot to make your reservation.</p>
          </div>
        )}
        
        {/* Terrain selection buttons */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Select a Terrain</h2>
          <Buttons onChange={handleChange} />
        </div>
        
        {/* Reservation table */}
        <div className="bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Available Time Slots</h2>
          <Tableau Terrain={idTerrain} />
        </div>
        
        {/* Instructions */}
        <div className="mt-8 bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg text-white">
          <h3 className="text-lg font-semibold mb-2">How to Book</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-center">
              <MapPin size={18} className="mr-2 text-green-400" />
              Select your preferred terrain from the options above
            </li>
            <li className="flex items-center">
              <Calendar size={18} className="mr-2 text-green-400" />
              Choose an available date and time slot from the calendar
            </li>
            <li className="flex items-center">
              <Clock size={18} className="mr-2 text-green-400" />
              Confirm your booking details and submit
            </li>
          </ul>
        </div>
      </div>
    </motion.section>
  );
}

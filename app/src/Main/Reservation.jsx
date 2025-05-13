import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Buttons from "../Component/Reservations/buttons";
import Tableau from "../Component/Reservations/table";
import background from "../img/background1.png";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, LogIn } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import terrainService from "../lib/services/user/terrainServices";

// Create a cache for terrain data to prevent repeated API calls
const terrainCache = new Map();

export default function Reservations() {
  const [selectedTerrain, setSelectedTerrain] = useState(null);
  const [loading, setLoading] = useState(false);
  const userId = sessionStorage.getItem("userId");
  const userName = sessionStorage.getItem("nom") || sessionStorage.getItem("name");
  const isLoggedIn = !!userId;
  const navigate = useNavigate();
  const location = useLocation();
  
  // Use a ref to track API call status
  const apiCallInProgressRef = useRef(false);
  const initialLoadCompletedRef = useRef(false);
  
  // Get terrain from location state if available
  useEffect(() => {
    // Skip if we've already loaded a terrain or if an API call is in progress
    if (initialLoadCompletedRef.current || apiCallInProgressRef.current) {
      return;
    }
    
    const loadTerrain = async () => {
      // Set API call status
      apiCallInProgressRef.current = true;
      
      // Check for terrain in location state first
      const terrainFromState = location.state?.selectedTerrainId;
      const terrainNameFromState = location.state?.selectedTerrainName;
      
      // Try session storage as fallback
      const storedTerrainId = sessionStorage.getItem("selectedTerrainId");
      
      if (terrainFromState || storedTerrainId) {
        setLoading(true);
        try {
          // Get terrain ID
          const id = terrainFromState || storedTerrainId;
          
          // Check cache first
          if (terrainCache.has(id)) {
            console.log("Using cached terrain data for ID:", id);
            setSelectedTerrain(terrainCache.get(id));
          } else {
            // Only make API call if not in cache
            console.log("Fetching terrain data for ID:", id);
            const response = await terrainService.getTerrain(id);
            
            if (response.data) {
              // Store in cache
              terrainCache.set(id, response.data);
              setSelectedTerrain(response.data);
            } else {
              // Fallback to basic info
              const fallbackData = {
                id_terrain: id,
                nom_terrain: terrainNameFromState || sessionStorage.getItem("selectedTerrainName") || `Terrain ${id}`
              };
              terrainCache.set(id, fallbackData);
              setSelectedTerrain(fallbackData);
            }
          }
          
          // If we got the terrain from location state, store in session for persistence
          if (terrainFromState && !storedTerrainId) {
            try {
              sessionStorage.setItem("selectedTerrainId", terrainFromState);
              sessionStorage.setItem("selectedTerrainName", terrainNameFromState);
            } catch (error) {
              console.warn("Could not access sessionStorage", error);
            }
          }
        } catch (error) {
          console.error("Error loading terrain details:", error);
          // Fallback to basic info
          const fallbackData = {
            id_terrain: terrainFromState || storedTerrainId,
            nom_terrain: terrainNameFromState || sessionStorage.getItem("selectedTerrainName") || `Terrain ${terrainFromState || storedTerrainId}`
          };
          terrainCache.set(terrainFromState || storedTerrainId, fallbackData);
          setSelectedTerrain(fallbackData);
        } finally {
          setLoading(false);
          initialLoadCompletedRef.current = true;
          apiCallInProgressRef.current = false;
        }
      } else {
        initialLoadCompletedRef.current = true;
        apiCallInProgressRef.current = false;
      }
    };
    
    loadTerrain();
  }, [location]);

  const handleTerrainChange = (terrain) => {
    console.log("Terrain selected:", terrain);
    
    // Only update if it's a different terrain to avoid re-rendering
    if (!selectedTerrain || selectedTerrain.id_terrain !== terrain.id_terrain) {
      // Store in cache to prevent future API calls
      terrainCache.set(terrain.id_terrain, terrain);
      setSelectedTerrain(terrain);
      
      // Also update session storage if available
      try {
        sessionStorage.setItem("selectedTerrainId", terrain.id_terrain);
        sessionStorage.setItem("selectedTerrainName", terrain.nom_terrain);
      } catch (error) {
        console.warn("Could not access sessionStorage", error);
      }
    }
  };

  // Redirect to login
  const handleLoginRedirect = () => {
    sessionStorage.setItem("redirectAfterLogin", "/reservation");
    navigate("/login");
  };

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
        
        {/* Welcome message for all users */}
        <div className="bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg mb-8 text-white">
          <h2 className="text-xl font-semibold mb-2">
            {isLoggedIn ? `Welcome, ${userName}!` : "Welcome to our Reservation System"}
          </h2>
          <p className="text-gray-300">Select a terrain and time slot to make your reservation.</p>
        </div>

        {/* Show notification if terrain was pre-selected */}
        {selectedTerrain && !loading && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-500/20 backdrop-blur-sm border border-green-500/30 p-4 rounded-lg mb-8"
          >
            <p className="text-green-400 flex items-center">
              <MapPin size={18} className="mr-2" />
              <span className="font-medium">
                You've selected <strong>{selectedTerrain.nom_terrain}</strong>. You can choose a different terrain below.
              </span>
            </p>
          </motion.div>
        )}
        
        {/* Terrain selection buttons */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Select a Terrain</h2>
          <Buttons onChange={handleTerrainChange} selectedTerrainId={selectedTerrain?.id_terrain} />
        </div>
        
        {/* Reservation table */}
        <div className="bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Available Time Slots</h2>
          <Tableau terrain={selectedTerrain} />
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

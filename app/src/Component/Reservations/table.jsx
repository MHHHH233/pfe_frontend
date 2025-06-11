import React, { useEffect, useState, useCallback, memo, useRef } from "react";
import { motion } from "framer-motion";
import FormResev from "./form";
import { useLocation, useNavigate } from "react-router-dom";
import adminReservationService from "../../lib/services/admin/reservationServices";
import userReservationService from "../../lib/services/user/reservationServices";

// Create a cache for reservation data
const reservationsCache = new Map();
const CACHE_DURATION_MS = 60000; // Cache data for 1 minute

// Memoize the table cell to prevent unnecessary re-renders
const TableCell = memo(({ reservation, heure, colIndex, handleClick, isPast }) => {
  // Find if there's a reservation for this time slot by comparing only the hour part
  const isReserved = reservation?.heure.startsWith(heure);
  
  let bgColor = "bg-green-500"; // Default: available
  let textColor = "text-white";
  let buttonClass = "bg-green-600 hover:bg-green-700 text-white";
  let statusText = "Dispo";
  let tooltipText = "Available for booking";
  
  if (isPast) {
    bgColor = "bg-gray-600";
    textColor = "text-gray-400";
    statusText = "Passé";
    tooltipText = "This time slot has passed";
  } else if (isReserved) {
    if (reservation.etat === "en attente") {
      // Simplified - just show pending status without expiration logic
      bgColor = "bg-yellow-500";
      textColor = "text-black";
      statusText = "Pending";
      tooltipText = "Pending reservation";
    } else if (reservation.etat === "confirmed") {
      bgColor = "bg-blue-500";
      textColor = "text-white";
      statusText = "Confirmed";
      tooltipText = "This reservation is confirmed";
    } else {
      bgColor = "bg-red-500";
      textColor = "text-white";
      statusText = "Réservé";
      tooltipText = "This time slot is reserved";
    }
  }

  return (
    <td className={`border border-gray-700 p-1 sm:p-2 text-center ${bgColor} ${textColor}`}>
      <div className="group relative">
        {!isPast && !isReserved ? (
          <motion.button
            className={`text-2xs sm:text-xs font-semibold px-1 py-0.5 rounded ${buttonClass}`}
            onClick={() => handleClick(heure, colIndex)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {statusText}
          </motion.button>
        ) : (
          <motion.span className="text-2xs sm:text-xs font-semibold">
            {statusText}
          </motion.span>
        )}
        
        {/* Tooltip */}
        <div className="absolute z-10 invisible group-hover:visible bg-gray-900 text-white text-xs rounded py-1 px-2 
                      bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1 w-32 shadow-lg">
          {tooltipText}
          <svg className="absolute text-gray-900 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255">
            <polygon className="fill-current" points="0,0 127.5,127.5 255,0"/>
          </svg>
        </div>
      </div>
    </td>
  );
});

// Fix the isTimeSlotInPast function to correctly identify past time slots
const isTimeSlotInPast = (heure, dayIndex) => {
  const now = new Date();
  const today = new Date();
  
  // Create a new date for the day we're checking
  const checkDate = new Date();
  checkDate.setDate(checkDate.getDate() + dayIndex);
  
  // First check if the day is in the past
  if (checkDate.getFullYear() < now.getFullYear() ||
      (checkDate.getFullYear() === now.getFullYear() && 
       checkDate.getMonth() < now.getMonth()) ||
      (checkDate.getFullYear() === now.getFullYear() && 
       checkDate.getMonth() === now.getMonth() && 
       checkDate.getDate() < now.getDate())) {
    return true;
  }
  
  // If it's today, check if the hour is in the past
  if (checkDate.getFullYear() === now.getFullYear() && 
      checkDate.getMonth() === now.getMonth() && 
      checkDate.getDate() === now.getDate()) {
    
    const [hours, minutes] = heure.split(':').map(Number);
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    
    // Compare hours and minutes
    if (hours < currentHours || (hours === currentHours && minutes <= currentMinutes)) {
      return true;
    }
  }
  
  return false;
};

export default function Tableau({ terrain }) {
  const location = useLocation();
  const navigate = useNavigate();
  const Heures = [
    "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00",
    "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"
  ];
  
  const [reservations, setReservations] = useState([]);
  const [selectedHour, setSelectedHour] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useMockData, setUseMockData] = useState(false);
  const [selectedTerrain, setSelectedTerrain] = useState(terrain?.id_terrain || null);
  const [terrainDetails, setTerrainDetails] = useState(terrain || null);
  
  // Add state to track current reservation count
  const [currentReservationCount, setCurrentReservationCount] = useState(0);
  const isAdmin = sessionStorage.getItem("type") === "admin";
  const isLoggedIn = !!sessionStorage.getItem("userId");
  
  // Add effect to update reservation count from session storage
  useEffect(() => {
    if (isLoggedIn && !isAdmin) {
      const updateCountFromSession = () => {
        const count = parseInt(sessionStorage.getItem("today_reservations_count") || "0");
        setCurrentReservationCount(count);
      };
      
      // Update immediately
      updateCountFromSession();
      
      // Set up interval to check for changes
      const intervalId = setInterval(updateCountFromSession, 1000);
      
      return () => clearInterval(intervalId);
    }
  }, [isLoggedIn, isAdmin]);
  
  // Add a debouncing mechanism to prevent multiple rapid API calls
  const debounceTimeoutRef = useRef(null);
  const isInitialMount = useRef(true);
  const lastTerrainId = useRef(null);
  
  // Only fetch reservations when terrain actually changes
  useEffect(() => {
    // Skip on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    if (!terrainDetails) {
      return;
    }
    
    // Skip if it's the same terrain we already fetched for
    if (lastTerrainId.current === terrainDetails.id_terrain) {
      return;
    }
    
    // Update last terrain id
    lastTerrainId.current = terrainDetails.id_terrain;
    
    // Clear any pending debounce
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    // Debounce the fetchReservations call
    debounceTimeoutRef.current = setTimeout(() => {
      fetchReservations();
      debounceTimeoutRef.current = null;
    }, 300);
    
    // Cleanup
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [terrainDetails]);

  // Use useCallback to prevent recreation of this function on every render
  const fetchReservations = useCallback(async (forceRefresh = false) => {
    if (!terrainDetails) return;
    
    // Check cache first (unless force refresh is requested)
    const cacheKey = `terrain_${terrainDetails.id_terrain}`;
    const cachedData = reservationsCache.get(cacheKey);
    
    if (!forceRefresh && cachedData && (Date.now() - cachedData.timestamp < CACHE_DURATION_MS)) {
      setReservations(cachedData.data);
      setError(null);
      return;
    }
    
    setLoading(true);
    try {
      // Check if user is admin - ensure consistent check throughout the app
      const isAdmin = sessionStorage.getItem("type") === "admin";
      
      const reservationService = isAdmin 
        ? adminReservationService 
        : userReservationService;
        
      const response = await reservationService.getAllReservations({
        per_page: 100 // Request all reservations
      });
      
      if (response.status === "success" && Array.isArray(response.data)) {
        // Map the data with proper structure depending on role
        const mappedReservations = response.data.map(res => {
          // For admin API response, terrain and client are nested objects
          // For user API response, terrain and client data are flattened
          return {
            id_reservation: res.id_reservation,
            num_res: res.num_res || "",
            id_client: res.client?.id_client || res.id_client,
            id_terrain: parseInt(res.terrain?.id_terrain || res.id_terrain),
            date: res.date,
            heure: res.heure,
            etat: res.etat || "en attente",
            created_at: res.created_at,
            client: res.client || {
              id_client: res.id_client,
              nom: res.name || "",
              prenom: "",
              telephone: "",
              email: ""
            },
            terrain: res.terrain || {
              id_terrain: parseInt(res.id_terrain),
              nom: res.nom_terrain || `Terrain ${res.id_terrain}`,
              type: res.type || "",
              prix: res.prix || 0
            }
          };
        });

        // Store in cache with timestamp
        reservationsCache.set(cacheKey, {
          data: mappedReservations,
          timestamp: Date.now()
        });
        
        setReservations(mappedReservations);
        setError(null); // Clear any existing errors
        
        // Handle pagination if available in the response
        if (response.pagination) {
          // Store pagination info if needed in the future
        }
      } else if (response.status === "error" && response.message === "No reservations found.") {
        // If no reservations found, set empty array and clear error
        setReservations([]);
        setError(null); // Clear any existing errors
      } else {
        // Only set error for actual error cases
        setError("Failed to fetch reservations");
        setUseMockData(true);
      }
    } catch (error) {
      setError("Error fetching reservations");
      setUseMockData(true);
    } finally {
      setLoading(false);
    }
  }, [terrainDetails]);

  useEffect(() => {
    // Only fetch when terrain changes - no automatic polling
    if (terrainDetails) {
      fetchReservations();
    } else {
      setLoading(false);
    }
  }, [fetchReservations, terrainDetails]);

  useEffect(() => {
    if (terrain) {
      setSelectedTerrain(terrain.id_terrain);
      setTerrainDetails(terrain);
    }
  }, [terrain]);

  // Memoize this function to prevent recreation on every render
  const getReservationsForDay = useCallback((dayIndex) => {
    if (!terrainDetails) return [];
    
    const date = new Date();
    date.setDate(date.getDate() + dayIndex);
    const dateString = formatDateForAPI(date);
    
    const currentTerrainId = parseInt(terrainDetails.id_terrain);
    
    return reservations.filter(res => {
      const resTerrainId = parseInt(res.id_terrain);
      const matches = res.date === dateString && resTerrainId === currentTerrainId;
      return matches;
    });
  }, [reservations, terrainDetails]);

  // Format date in YYYY-MM-DD format for API
  const formatDateForAPI = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleClick = (heure, dayIndex) => {
    // Check if the time slot is in the past
    if (isTimeSlotInPast(heure, dayIndex)) {
      return; // Do nothing if the time slot is in the past
    }
    
    // Get the date for the specified day index
    const today = new Date();
    today.setDate(today.getDate() + dayIndex);
    
    // Format date for API (YYYY-MM-DD)
    const dateString = formatDateForAPI(today);
    
    setSelectedHour(heure);
    setSelectedTime(dateString);
    
    // Use sessionStorage instead of localStorage for temporary data
    if(location.pathname === "/Admin"){
      sessionStorage.setItem("selectedHour", heure);
      sessionStorage.setItem("selectedTime", dateString);
      
      // Ensure terrain ID is stored as a number
      const terrainId = parseInt(terrainDetails?.id_terrain || '0');
      sessionStorage.setItem("selectedTerrain", terrainId);
      
      // Trigger the popup in Admin component
      sessionStorage.setItem("showReservationPopup", "true");
      
      // Dispatch a custom event to notify the Admin component
      const event = new CustomEvent('reservationCellClicked', {
        detail: { 
          hour: heure, 
          date: dateString, 
          terrain: {
            id_terrain: terrainId,
            nom_terrain: terrainDetails?.nom_terrain || `Terrain ${terrainId}`
          }
        }
      });
      document.dispatchEvent(event);
    }
  };

  // Add event listeners for reservation status updates
  useEffect(() => {
    // Event listener for when a reservation is completed
    const handleReservationComplete = (event) => {
      // Always force a fresh API call by invalidating cache
      if (event.detail && event.detail.refreshNeeded) {
        // Clear cache for this terrain
        if (terrainDetails && terrainDetails.id_terrain) {
          const cacheKey = `terrain_${terrainDetails.id_terrain}`;
          reservationsCache.delete(cacheKey);
        }
        
        // Force refresh by passing true
        fetchReservations(true);
      } else {
        // Normal refresh
        fetchReservations();
      }
    };
    
    // Listen for reservation success events
    document.addEventListener('reservationSuccess', handleReservationComplete);
    document.addEventListener('reservationCancelled', handleReservationComplete);
    
    // Clean up
    return () => {
      document.removeEventListener('reservationSuccess', handleReservationComplete);
      document.removeEventListener('reservationCancelled', handleReservationComplete);
    };
  }, [fetchReservations]);

  // Add a polling mechanism to refresh data every 5 minutes
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      if (terrainDetails) {
        fetchReservations();
      }
    }, 300000); // 5 minutes
    
    return () => clearInterval(refreshInterval);
  }, [fetchReservations, terrainDetails]);

  // Show loading state only on initial load
  if (loading && !reservations.length) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // Remove the error check here since we want to show the table regardless
  // Only show error for actual network/server errors, not for "no reservations"
  if (error && error !== "No reservations found.") {
    return (
      <div className="bg-red-900/20 border border-red-500 p-4 rounded-lg text-center">
        <p className="text-red-400 mb-2">{error}</p>
        <button 
          onClick={fetchReservations}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={`${location.pathname === "/Admin" ? '' : 'mt-6 sm:mt-12 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8'}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-full bg-white/10 sm:backdrop-blur-md rounded-lg shadow-lg p-2 sm:p-4 ${
          sessionStorage.getItem("type") === "admin" ? "w-full" : ""
        }`}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
          <h2 className="text-lg sm:text-xl font-semibold text-white">
            Terrain sélectionné :{" "}
            <span className="text-green-400">
              {terrainDetails ? terrainDetails.nom_terrain : "Aucun terrain sélectionné"}
            </span>
          </h2>
        </div>
        
        {/* Status legend */}
        <div className="mb-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-white">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-white">Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-white">Réservé</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-600 rounded"></div>
            <span className="text-white">Past</span>
          </div>
        </div>
        
        {/* Debug reservation count for non-admin users */}
        {isLoggedIn && !isAdmin && (
          <div className="mb-4 p-2 bg-gray-800/80 rounded-lg text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Today's reservations:</span>
              <span className="font-mono font-bold text-white">{currentReservationCount}/2</span>
            </div>
          </div>
        )}
        
        {!terrainDetails ? (
          <div className="text-center p-6 text-gray-400">
            Please select a terrain to view availability
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs sm:text-sm">
              <thead>
                <tr>
                  <th className="bg-gray-800 text-white p-1 sm:p-2 border border-gray-700">Heures</th>
                  {Array(7).fill(null).map((_, index) => {
                    const today = new Date();
                    today.setDate(today.getDate() + index);
                    const dateStr = today.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
                    const apiDateStr = formatDateForAPI(today);
                    const weekday = today.toLocaleDateString('fr-FR', { weekday: 'short' });
                    
                    return (
                      <th key={index} className="bg-gray-800 text-white p-1 sm:p-2 border border-gray-700">
                        <div>{weekday}</div>
                        <div className="text-xs text-gray-400">{dateStr}</div>
                        <div className="text-xs text-gray-500">{apiDateStr}</div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {Heures.map((heure, rowIndex) => {
                  return (
                    <tr key={rowIndex} className="hover:bg-gray-700/30 transition-colors duration-150">
                      <td className="border border-gray-700 p-1 sm:p-2 text-center font-medium text-gray-200">
                        {heure}
                      </td>
                      {Array(7).fill(null).map((_, colIndex) => {
                        const dayReservations = getReservationsForDay(colIndex);
                        const reservation = dayReservations.find(res => res.heure.startsWith(heure));
                        const isPast = isTimeSlotInPast(heure, colIndex);

                        return (
                          <TableCell
                            key={colIndex}
                            reservation={reservation}
                            heure={heure}
                            colIndex={colIndex}
                            handleClick={handleClick}
                            isPast={isPast}
                          />
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
      
      {location.pathname !== "/Admin" ? (
        <FormResev 
          Terrain={terrainDetails} 
          selectedHour={selectedHour} 
          selectedTime={selectedTime} 
          onSuccess={fetchReservations} // Refresh after successful reservation
        />
      ) : null}
      
    </div>
  );
}
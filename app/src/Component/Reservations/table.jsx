import React, { useEffect, useState, useCallback, memo } from "react";
import { motion } from "framer-motion";
import FormResev from "./form";
import { useLocation } from "react-router-dom";
import reservationService from "../../lib/services/admin/reservationServices";

// Memoize the table cell to prevent unnecessary re-renders
const TableCell = memo(({ reservationState, heure, colIndex, handleClick, isPast }) => {
  // Determine cell background color based on reservation state and whether it's in the past
  let bgColor = "bg-green-500"; // Default: available
  let textColor = "text-white";
  let buttonClass = "bg-green-600 hover:bg-green-700 text-white";
  let statusText = "Dispo";
  
  // If the time slot is in the past, override with gray
  if (isPast) {
    bgColor = "bg-gray-600";
    textColor = "text-gray-400";
    statusText = "Passé";
  } else if (reservationState === "reserver") {
    bgColor = "bg-red-500";
    textColor = "text-white";
    statusText = "Réservé";
  } else if (reservationState === "en attente") {
    bgColor = "bg-yellow-500";
    textColor = "text-black";
    buttonClass = "bg-yellow-500 hover:bg-yellow-600 text-black";
    statusText = "En attente";
  }
  
  return (
    <td
      className={`border border-gray-700 p-1 sm:p-2 text-center ${bgColor} ${textColor}`}
    >
      {!isPast && reservationState !== "reserver" ? (
        <motion.button
          className={`text-2xs sm:text-xs font-semibold px-1 py-0.5 rounded ${buttonClass}`}
          onClick={() => handleClick(heure, colIndex)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {statusText}
        </motion.button>
      ) : (
        <motion.span
          className="text-2xs sm:text-xs font-semibold"
          whileHover={!isPast ? { scale: 1.1 } : {}}
          whileTap={!isPast ? { scale: 0.95 } : {}}
        >
          {statusText}
        </motion.span>
      )}
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

export default function Tableau({ Terrain }) {
  const location = useLocation();
  const Heures = [
    "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00",
    "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"
  ];

  const Jours = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  
  const [reservations, setReservations] = useState([]);
  const [selectedHour, setSelectedHour] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useMockData, setUseMockData] = useState(false);
  
  // Debug useEffect - MOVED HERE before any conditional returns
  useEffect(() => {
    if (reservations && reservations.length > 0) {
      console.log("Current reservations in state:", reservations);
      console.log("Reservations with 'en attente' status:", 
        reservations.filter(res => res.etat === "en attente"));
    }
  }, [reservations]);
  
  // Use useCallback to prevent recreation of this function on every render
  const fetchReservations = useCallback(async () => {
    // Don't fetch if no terrain is selected
    if (!Terrain) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Prepare params for filtering by terrain
      const params = { id_terrain: Terrain };
      
      const response = await reservationService.getAllReservations(params);
      console.log("Raw API Response:", response); // Debug log
      
      if (response && response.status === "success" && Array.isArray(response.data)) {
        // Process the API data
        const processedData = response.data
          .filter(res => {
            // Make sure we only include reservations for the selected terrain
            const terrainMatch = parseInt(res.id_terrain) === parseInt(Terrain);
            console.log(`Reservation ${res.id_reservation} terrain match: ${terrainMatch} (${res.id_terrain} vs ${Terrain})`);
            return terrainMatch;
          })
          .map(res => {
            const id_terrain = parseInt(res.id_terrain);
            let [hours, minutes, seconds] = (res.heure || "00:00:00").split(':').map(Number);
            
            if (hours > 23) {
              hours = hours % 24;
            }
            
            const normalizedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            // Log each processed reservation
            console.log(`Processed reservation: ID=${res.id_reservation}, Terrain=${id_terrain}, Date=${res.date}, Time=${normalizedTime}, Status=${res.etat}`);
            
            return {
              ...res,
              id_terrain,
              heure: normalizedTime
            };
          });
        
        console.log("Final processed reservations:", processedData);
        setReservations(processedData);
      } else {
        // Handle empty data case
        console.warn("No reservation data from API");
        setReservations([]);
      }
    } catch (error) {
      console.error("Error fetching reservations:", error);
      setError("Failed to load reservation data. Please try again.");
      setReservations([]);
    } finally {
      setLoading(false);
    }
  }, [Terrain]);

  useEffect(() => {
    // Only fetch when terrain changes - no automatic polling
    if (Terrain) {
      fetchReservations();
    } else {
      setLoading(false);
    }
  }, [fetchReservations, Terrain]);

  // Memoize this function to prevent recreation on every render
  const getReservationState = useCallback((heure, dayIndex) => {
    if (!reservations || !reservations.length) return null;
    
    // Get the date for the specified day index
    const today = new Date();
    today.setDate(today.getDate() + dayIndex); 
    const dateString = formatDateForAPI(today);

    // Find matching reservation
    const reservation = reservations.find((res) => {
      try {
        // Only compare hours and minutes, ignore seconds
        const reservationTime = (res.heure || "").slice(0, 5);
        const hourToCheck = heure.slice(0, 5); // Make sure we're comparing the same format
        
        // Check if terrain, date and hour match
        const terrainMatch = parseInt(res.id_terrain) === parseInt(Terrain);
        const dateMatch = res.date === dateString;
        const timeMatch = reservationTime === hourToCheck;
        
        const match = terrainMatch && dateMatch && timeMatch;
        
        return match;
      } catch (error) {
        return false;
      }
    });

    // Return the reservation state if found, otherwise null
    return reservation ? reservation.etat : null;
  }, [reservations, Terrain]);

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
      sessionStorage.setItem("selectedTerrain", Terrain);
      
      // Trigger the popup in Admin component
      sessionStorage.setItem("showReservationPopup", "true");
      
      // Dispatch a custom event to notify the Admin component
      const event = new CustomEvent('reservationCellClicked', {
        detail: { hour: heure, date: dateString, terrain: Terrain }
      });
      document.dispatchEvent(event);
    }
  };

  // Show loading state only on initial load
  if (loading && !reservations.length) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // Show error state
  if (error) {
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
        <div className="flex justify-between items-center mb-2 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-white">
            Terrain sélectionné :{" "}
            <span className="text-green-400">
              {Terrain !== null ? "Terrain " + Terrain : "Aucun terrain sélectionné"}
            </span>
          </h2>
          
          {/* Only keep the refresh button */}
          <button 
            onClick={fetchReservations}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors"
            title="Refresh data"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
        
        {!Terrain ? (
          <div className="text-center p-6 text-gray-400">
            Please select a terrain to view availability
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs sm:text-sm">
              <thead>
                <tr>
                  <th className="bg-gray-800 text-white p-1 sm:p-2 border border-gray-700">Heures</th>
                  {Jours.map((jour, index) => {
                    const today = new Date();
                    today.setDate(today.getDate() + index);
                    const dateStr = today.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
                    const apiDateStr = formatDateForAPI(today);
                    
                    return (
                      <th key={index} className="bg-gray-800 text-white p-1 sm:p-2 border border-gray-700">
                        <div>{jour}</div>
                        <div className="text-xs text-gray-400">{dateStr}</div>
                        <div className="text-xs text-gray-500">{apiDateStr}</div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {Heures.map((heure, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-gray-700/30 transition-colors duration-150">
                    <td className="border border-gray-700 p-1 sm:p-2 text-center font-medium text-gray-200">
                      {heure}
                    </td>
                    {Jours.map((_, colIndex) => {
                      // Check if this time slot is in the past
                      const isPast = isTimeSlotInPast(heure, colIndex);
                      return (
                        <TableCell 
                          key={colIndex}
                          reservationState={getReservationState(heure, colIndex)}
                          heure={heure}
                          colIndex={colIndex}
                          handleClick={handleClick}
                          isPast={isPast}
                        />
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
      
      {sessionStorage.getItem("type") !== "admin" ? (
        <FormResev 
          Terrain={Terrain} 
          selectedHour={selectedHour} 
          selectedTime={selectedTime} 
          onSuccess={fetchReservations} // Refresh after successful reservation
        />
      ) : null}
    </div>
  );
}
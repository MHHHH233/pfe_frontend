import React, { useEffect, useState, useCallback, memo } from "react";
import { motion } from "framer-motion";
import FormResev from "./form";
import { useLocation, useNavigate } from "react-router-dom";
import adminReservationService from "../../lib/services/admin/reservationServices";
import userReservationService from "../../lib/services/user/reservationServices";

// Memoize the table cell to prevent unnecessary re-renders
const TableCell = memo(({ reservation, heure, colIndex, handleClick, isPast }) => {
  // Find if there's a reservation for this time slot by comparing only the hour part
  const isReserved = reservation?.heure.startsWith(heure);
  
  let bgColor = "bg-green-500"; // Default: available
  let textColor = "text-white";
  let buttonClass = "bg-green-600 hover:bg-green-700 text-white";
  let statusText = "Dispo";
  
  if (isPast) {
    bgColor = "bg-gray-600";
    textColor = "text-gray-400";
    statusText = "Passé";
  } else if (isReserved) {
    if (reservation.etat === "en attente") {
      bgColor = "bg-yellow-500";
      textColor = "text-black";
      buttonClass = "bg-yellow-500 hover:bg-yellow-600 text-black";
      statusText = "En attente";
    } else {
      bgColor = "bg-red-500";
      textColor = "text-white";
      statusText = "Réservé";
    }
  }

  return (
    <td className={`border border-gray-700 p-1 sm:p-2 text-center ${bgColor} ${textColor}`}>
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
  const navigate = useNavigate();
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
    if (!Terrain) return;
    
    setLoading(true);
    try {
      const reservationService = sessionStorage.getItem("type") === "admin" 
        ? adminReservationService 
        : userReservationService;
        
      const response = await reservationService.getAllReservations();
      if (response.status === "success") {
        const reservationData = response.data.map(res => {
          if (sessionStorage.getItem("type") === "admin") {
            return {
              id_reservation: res.id_reservation,
              num_res: res.num_res,
              client: {
                id_client: res.client?.id_client || null,
                nom: res.client?.nom || '',
                prenom: res.client?.prenom || '',
                telephone: res.client?.telephone || '',
                email: res.client?.email || ''
              },
              terrain: {
                id_terrain: res.terrain?.id_terrain,
                nom: res.terrain?.nom || '',
                type: res.terrain?.type || '',
                prix: res.terrain?.prix || 0
              },
              date: res.date,
              heure: res.heure,
              etat: res.etat,
              created_at: res.created_at
            };
          } else {
            // Handle user service format
            return {
              id_reservation: res.id_reservation,
              num_res: res.num_res,
              id_client: res.id_client,
              id_terrain: res.id_terrain,
              client: {
                id_client: res.id_client,
                nom: res.name || '',
                prenom: '',
                telephone: '',
                email: ''
              },
              terrain: {
                id_terrain: res.id_terrain,
                nom: `Terrain ${res.id_terrain}`,
                type: '',
                prix: 0
              },
              date: res.date,
              heure: res.heure,
              etat: res.etat,
              created_at: res.created_at
            };
          }
        });
        
        setReservations(reservationData);
        console.log("Mapped reservations:", reservationData);
      } else {
        setError("Failed to fetch reservations");
        setUseMockData(true);
      }
    } catch (error) {
      console.error("Error fetching reservations:", error);
      setError("Error fetching reservations");
      setUseMockData(true);
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
  const getReservationsForDay = useCallback((dayIndex) => {
    if (!Terrain) return []; // Return empty array if no terrain selected
    
    const date = new Date();
    date.setDate(date.getDate() + dayIndex);
    const dateString = formatDateForAPI(date);
    
    // Filter reservations for this day and terrain
    return reservations.filter(res => {
      // First check if we have a valid date match
      if (res.date !== dateString) return false;

      // Then handle terrain comparison based on user type
      if (sessionStorage.getItem("type") === "admin") {
        return res.terrain?.id_terrain?.toString() === Terrain.toString();
      } else {
        return res.id_terrain?.toString() === Terrain.toString();
      }
    });
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
                {Heures.map((heure, rowIndex) => {
                  // Add this debug log
                  console.log(`Rendering row for ${heure}:`, Jours.map((_, colIndex) => 
                    getReservationsForDay(colIndex).find(res => res.heure.startsWith(heure))
                  ));
                  
                  return (
                    <tr key={rowIndex} className="hover:bg-gray-700/30 transition-colors duration-150">
                      <td className="border border-gray-700 p-1 sm:p-2 text-center font-medium text-gray-200">
                        {heure}
                      </td>
                      {Jours.map((_, colIndex) => {
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
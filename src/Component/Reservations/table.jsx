import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Tableau({ Terrain }) {
  const Heures = [
    "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00",
    "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"
  ];

  const Jours = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  
  const [reservations, setReservations] = useState([]);

  useEffect(() => {    
    const fetchReservations = async () => {
      try {
        const response = await fetch("http://localhost/PFR/3AFAK-PFE/backend/API/ReservationAPI.php");
        const data = await response.json();
        if (data.status === "success") {
          setReservations(data.data);
        }
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };

    fetchReservations();
  }, [reservations]); 

  const getReservationState = (heure, dayIndex) => {
    const today = new Date();
    today.setDate(today.getDate() + dayIndex); 
    const dateString = today.toISOString().split('T')[0]; 

    const reservation = reservations.find((res) => {
      const reservationTime = res.heure.slice(0, 5); 
      return (
        res.id_terrain === Terrain &&
        res.date === dateString &&
        reservationTime === heure
      );
    });

    return reservation ? reservation.etat : null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-white/10 backdrop-blur-md rounded-lg shadow-lg p-2 sm:p-4"
    >
      <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 text-center text-white">
        Terrain sélectionné :{" "}
        <span className="text-green-400">
          {Terrain !== null ? "Terrain "+Terrain : "Aucun terrain sélectionné"}
        </span>
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs sm:text-sm">
          <thead>
            <tr>
              <th className="bg-gray-800 text-white p-1 sm:p-2 border border-gray-700">Heures</th>
              {Jours.map((jour, index) => (
                <th key={index} className="bg-gray-800 text-white p-1 sm:p-2 border border-gray-700">
                  {jour}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Heures.map((heure, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-700/30 transition-colors duration-150">
                <td className="border border-gray-700 p-1 sm:p-2 text-center font-medium text-gray-200">
                  {heure}
                </td>
                {Jours.map((_, colIndex) => {
                  const reservationState = getReservationState(heure, colIndex); // Get the state of the reservation
                  return (
                    <td
                      key={colIndex}
                      className={`border border-gray-700 p-1 sm:p-2 text-center ${
                        reservationState === "reserver"
                          ? "bg-red-500 text-white"
                          : reservationState === "en attente"
                          ? "bg-yellow-500 text-black"                          
                          : "bg-green-500 text-white"
                      }`}
                    >
                      <motion.span
                        className="text-2xs sm:text-xs font-semibold"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {reservationState
                          ? reservationState.charAt(0).toUpperCase() + reservationState.slice(1)
                          : "Dispo"}
                      </motion.span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

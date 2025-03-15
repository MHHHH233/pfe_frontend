import { Calendar } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion"
import { useState, useEffect } from "react";

export const Myreservations = ({ matches }) => {
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await fetch("http://localhost/PFR/3AFAK-PFE/backend/API/UserReservations.php", {
                    credentials: "include", 
                });
                const data = await response.json();
                if (data.success) {
                    setReservations(data.reservations);
                } else {
                    console.error("Failed to fetch reservations:", data.error);
                }
            } catch (error) {
                console.error("An error occurred:", error);
            }
        };

        const intervalId = setInterval(fetchReservations, 5000);
        fetchReservations();
    }, []);


    return (
      <motion.div 
        className="bg-[#333] rounded-xl p-6 flex flex-col cursor-pointer hover:bg-[#444] transition-colors"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <h3 className="text-xl text-center font-semibold mb-4">Upcoming Matches</h3>
        {reservations.splice(1,4).map((reservation, index) => (
        <div key={index} className="flex items-center mb-4 last:mb-0">
          <Calendar className="w-8 h-8 text-[#07f468] mr-4" />
          <div>
            <p className="font-semibold">Terrain {reservation.id_terrain}</p>
            <p className="text-gray-300">
              {reservation.date} at {reservation.heure.slice(0, 5)}
            </p>
          </div>
        </div>
      ))}
      </motion.div>
    );
  };
  
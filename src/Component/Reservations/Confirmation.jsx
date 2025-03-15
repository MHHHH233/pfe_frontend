import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import AnimatedCheck from './Status/Confirmed';
import AnimatedReserved from './Status/Failed';
import { Type } from 'lucide-react';

const Button = styled.button`
  /* Styling for the button */
  background-color: #07f468;
  color: #1a1a1a;
  border: none;
  border-radius: 50px;
  padding: 10px 25px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  height: 50px;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 6px rgba(7, 244, 104, 0.1);

  &:hover {
    background-color: #06d35a;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(7, 244, 104, 0.2);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(7, 244, 104, 0.1);
  }

  @media (max-width: 500px) {
    padding: 8px 20px;
    font-size: 0.8rem;
  }
`;

const cardVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 20,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

export default function PopupCard({ isVisible, onClose, data, resetStatus }) {
    const [status, setStatus] = useState(null); 
    const [msg, setMsg] = useState('');

    useEffect(() => {
        if (isVisible) {
          const timeoutId = setTimeout(() => {
            onClose(); 
          }, 9000);
    
         
          return () => clearTimeout(timeoutId);
        }
      }, [isVisible, onClose]);
  
    const handleSubmit = async (paymentMethod) => {
      const formData = {
        id_compte: data.id_compte,
        idTerrain: data.idTerrain,
        date: data.date,
        heuredebut: data.heuredebut,
        type:data.type,
        // heurefin: data.heurefin,
        // payment_methode: paymentMethod,
      };
  
      try {
        const response = await fetch(
          'http://localhost/PFR/3AFAK-PFE/backend/Controleur/ReserverHour.php',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          }
        );
        const result = await response.json();
        
        console.log(result); // Debugging API response
        isVisible=false;
        console.log(isVisible)
        
        if (result.success) {
          setMsg('Reservation submitted successfully!');
          setStatus('success');
        } else {
          setMsg('Failed to submit reservation. Please try again.',result.message);
          setStatus('failed');
          console.log(result.message)

        }
      } catch (error) {
        console.error('Fetch error:', error.message);
        setMsg('An error occurred. Please try again.');
        setStatus('failed');
      }
    };
  
    const closePopup = () => {
      setStatus(null); // Reset the status
      resetStatus(); // Notify parent to reset visibility state
      onClose(); // Close the popup
    };
  
    return (
      <AnimatePresence>
        {isVisible && status === null && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={closePopup}
          >
            <motion.div
              className="bg-[#1a1a1a] rounded-3xl p-8 max-w-[90%] w-[400px] text-center shadow-lg"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <h6 className="text-white text-sm mb-2">
                Terrain {data.idTerrain} Heure {data.heuredebut} Jour {data.date}
              </h6>
              <h2 className="text-white mb-6 text-2xl">Choose Payment Option</h2>
              <div className="flex flex-col gap-4">
                <Button onClick={() => handleSubmit('online')}>Pay Online</Button>
                <Button onClick={() => handleSubmit('cash')}>Pay In-Store (Cash)</Button>
                {msg && <div className="text-red-500 mt-4">{msg}</div>}
              </div>
            </motion.div>
          </div>
        )}
        {status === 'success' && <AnimatedCheck onClose={closePopup} />}
        {status === 'failed' && <AnimatedReserved onClose={closePopup} />}
      </AnimatePresence>
    );
  }
  

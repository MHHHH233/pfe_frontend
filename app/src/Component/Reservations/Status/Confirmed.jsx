import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import {X} from  'lucide-react';

export default function AnimatedCheck() {
  const [mounted, setMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    // window.location.reload();
  }

  if (!mounted || !isVisible) {
    return null
  }

  return (
    <div className="popup-overlay">
      <div className="popup-card">
        <button className="close-button" onClick={handleClose}><X/></button>
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="200"
          height="200"
          viewBox="0 0 100 100"
          className="svg"
        >
          <motion.path
            d="M 25 50 L 45 70 L 75 30"
            fill="transparent"
            stroke="#4ade80"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="transparent"
            stroke="#4ade80"
            strokeWidth="5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          />
        </motion.svg>
        <motion.h2
          className="text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          Reservation Successfuly
        </motion.h2>
        <p>Go to the store to validate ur Reservation</p>
      </div>
      <style jsx>{`
        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .popup-card {
          background-color: #1a1a1a;
          border-radius: 20px;
          padding: 2rem;
          max-width: 90%;
          width: 400px;
          height: 400px;
          text-align: center;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          position: relative;
        }
        .close-button {
          position: absolute;
          top: 10px;
          right: 10px;
          background: none;
          border: none;
          color: #fff;
          font-size: 1.5rem;
          cursor: pointer;
        }
        .svg {
          margin-bottom: 20px;
        }
        .text {
          color: #4ade80;
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
          font-weight: 600;
        }
        p {
          color: white;
        }
        @media (max-width: 480px) {
          .popup-card {
            padding: 1.5rem;
          }
          .text {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </div>
  )
}


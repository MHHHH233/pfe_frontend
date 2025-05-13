import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { X, CheckCircle } from 'lucide-react'
import styled from 'styled-components'

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`

const PopupCard = styled.div`
  background-color: #1a1a1a;
  border-radius: 16px;
  padding: 2rem;
  max-width: 90%;
  width: 380px;
  height: 380px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 480px) {
    padding: 1.5rem;
    width: 320px;
    height: 320px;
  }
`

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
`

const Title = styled(motion.h2)`
  color: #4ade80;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 600;

  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`

const Message = styled.p`
  color: white;
  font-size: 0.95rem;
`

export default function AnimatedCheck({ onClose }) {
  const [mounted, setMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    setMounted(true)
    
    // Auto-close after 3 seconds to allow new reservations
    const timer = setTimeout(() => {
      handleClose();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    
    // Call parent onClose if provided
    if (onClose) {
      onClose();
    }
    
    // Dispatch event to allow for new reservations
    const event = new CustomEvent('statusPopupClosed');
    document.dispatchEvent(event);
  }

  if (!mounted || !isVisible) {
    return null
  }

  return (
    <PopupOverlay>
      <PopupCard>
        <CloseButton onClick={handleClose}><X /></CloseButton>
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="200"
          height="200"
          viewBox="0 0 100 100"
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
        <Title
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          Reservation Successful
        </Title>
        <Message>Your reservation has been confirmed.</Message>
      </PopupCard>
    </PopupOverlay>
  )
}


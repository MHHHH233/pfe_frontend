import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Clock , X } from 'lucide-react'
import styled from 'styled-components'

const PopupOverlay = styled.div`
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
`

const PopupCard = styled.div`
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

  @media (max-width: 480px) {
    padding: 1.5rem;
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
  color: #fbbf24;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 600;

  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`

const Message = styled.p`
  color: white;
`

export default function AnimatedPending() {
  const [mounted, setMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    window.location.reload();
  }

  if (!mounted || !isVisible) {
    return null
  }

  return (
    <PopupOverlay>
      <PopupCard>
        <CloseButton onClick={handleClose}><X/></CloseButton>
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="200"
          height="200"
          viewBox="0 0 100 100"
        >
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="transparent"
            stroke="#fbbf24"
            strokeWidth="5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
          <motion.line
            x1="50"
            y1="50"
            x2="50"
            y2="25"
            stroke="#fbbf24"
            strokeWidth="5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.3, delay: 0.7 }}
          />
          <motion.line
            x1="50"
            y1="50"
            x2="75"
            y2="50"
            stroke="#fbbf24"
            strokeWidth="5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.3, delay: 1 }}
          />
        </motion.svg>
        <Title
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.3 }}
        >
          Reservation Pending
        </Title>
        <Message>Please go to the store to pay to confirm your reservation.</Message>
      </PopupCard>
    </PopupOverlay>
  )
}


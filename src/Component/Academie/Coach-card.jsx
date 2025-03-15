"use client"

import { motion } from "framer-motion"
import { SocialIcons } from "./social-icons"

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
}

export function CoachCard({ name, description, social }) {
  return (
    <motion.div 
    variants={cardVariants}
    whileHover={{ scale: 1.03 }}
    transition={{ type: "spring", stiffness: 300 }}
    className="bg-[#333333] rounded-lg p-8 shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 hover:translate-y-[-5px] hover:bg-[#444444] hover:shadow-[0_8px_32px_rgba(7,244,104,0.1)]"
  >
    <div className="flex flex-col items-center">
      <motion.div 
        className="w-24 h-24 bg-green-500 rounded-full mb-6"
        whileHover={{ scale: 1.1, rotate: 5 }}
      />
      <h3 className="text-2xl font-semibold mb-4">{name}</h3>
      <p className="text-gray-300 text-center mb-6 leading-relaxed">{description}</p>
      <SocialIcons social={social} />
    </div>
  </motion.div>
  
  )
}


"use client"

import { motion } from "framer-motion"
import { Instagram } from "lucide-react"
import { User } from "lucide-react"

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
}

export function CoachCard({ name, description, social, image_url }) {
  return (
    <motion.div 
      variants={cardVariants}
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-gradient-to-br from-[#333333] to-[#222222] rounded-lg p-8 shadow-xl transition-all duration-300 ease-in-out transform hover:shadow-[0_8px_32px_rgba(7,244,104,0.15)] border border-gray-700"
    >
      <div className="flex flex-col items-center">
        <motion.div 
          className="w-32 h-32 rounded-full mb-6 overflow-hidden relative bg-green-500 flex items-center justify-center border-4 border-green-500 shadow-lg"
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          {image_url ? (        
            <img
              src={image_url}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-16 h-16 text-white" />
          )}
        </motion.div>
        <h3 className="text-2xl font-semibold mb-3 text-white">{name}</h3>
        <p className="text-gray-300 text-center mb-6 leading-relaxed max-w-xs">{description}</p>
        
        {/* Instagram Social Icon */}
        {social?.instagram && social.instagram !== "#" && (
          <a 
            href={`https://instagram.com/${social.instagram.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-300 hover:text-green-400 transition-colors"
          >
            <Instagram className="w-5 h-5" />
            <span>{social.instagram}</span>
          </a>
        )}
      </div>
    </motion.div>
  )
}


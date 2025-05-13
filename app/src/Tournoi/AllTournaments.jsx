import React from 'react'
import { motion } from 'framer-motion'
import { TournamentsSection } from '../Client/ClientDashboard'

export default function AllTournaments() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white font-sans pt-20">
      {/* Page Header */}
      <section className="py-12 bg-gradient-to-b from-[#222] to-[#1a1a1a] relative">
        {/* Top gradient border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#07f468] to-transparent opacity-70"></div>
        
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              All Tournaments
              <motion.span
                className="block h-1 w-24 bg-gradient-to-r from-[#07f468] to-[#34d399] rounded-full mx-auto mt-4"
                initial={{ width: 0 }}
                animate={{ width: "6rem" }}
                transition={{ duration: 0.8, delay: 0.4 }}
              ></motion.span>
            </motion.h1>
            
            <motion.p
              className="text-gray-300 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Browse and join the most exciting football tournaments in your area
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Tournaments Section */}
      <TournamentsSection />
    </div>
  )
} 
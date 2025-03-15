"use client"

import { motion } from "framer-motion"

const headerVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
}

export function Header() {
  return (
    <motion.header
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      className="text-center mb-12 mt-16"
    >
      <motion.h1 
        className="text-4xl md:text-5xl font-bold mb-4"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        Bienvenue à l&apos;Académie Terrana FC
      </motion.h1>
      <motion.p 
        className="text-xl text-gray-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Développez vos compétences en football avec des entraînements personnalisés.
      </motion.p>
    </motion.header>
  )
}


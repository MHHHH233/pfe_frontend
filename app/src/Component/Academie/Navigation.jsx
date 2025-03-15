"use client"

import { motion } from "framer-motion"

const menuItems = ["About", "Coachs", "Activités", "Tarifs", "Programmes", "Local"]

const navVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.5,
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 }
  }
}

export function Navigation() {
  return (
    <motion.nav 
      variants={navVariants}
      initial="hidden"
      animate="visible"
      className="mb-16"
    >
      <ul className="flex flex-wrap justify-center gap-4 bg-green-400 rounded-lg p-4 shadow-lg">
        {menuItems.map((item) => (
          <motion.li key={item} variants={itemVariants}>
            <motion.button
              className="px-6 py-3 text-lg font-medium rounded-md transition-colors hover:bg-[#1a1a1a]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {item}
            </motion.button>
          </motion.li>
        ))}
      </ul>
    </motion.nav>
  )
}


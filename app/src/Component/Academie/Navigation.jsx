"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { FaHome, FaUsers, FaCalendarAlt, FaMoneyBillWave, FaListAlt, FaMapMarkerAlt, FaBars, FaTimes } from 'react-icons/fa'

const menuItems = [
  { name: "About", icon: <FaHome className="text-xl" /> },
  { name: "Coachs", icon: <FaUsers className="text-xl" /> },
  { name: "Activités", icon: <FaCalendarAlt className="text-xl" /> },
  { name: "Tarifs", icon: <FaMoneyBillWave className="text-xl" /> },
  { name: "Programmes", icon: <FaListAlt className="text-xl" /> },
  { name: "Local", icon: <FaMapMarkerAlt className="text-xl" /> }
]

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

const mobileMenuVariants = {
  hidden: { opacity: 0, x: '100%' },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  },
  exit: {
    opacity: 0,
    x: '100%',
    transition: {
      ease: 'easeInOut',
      duration: 0.3
    }
  }
}

export function Navigation() {
  const [activeItem, setActiveItem] = useState("About");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on a mobile device
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const handleItemClick = (item) => {
    setActiveItem(item);
    setIsMobileMenuOpen(false);
    
    // Get the corresponding section element
    const sectionId = item.toLowerCase();
    const sectionElement = document.getElementById(sectionId);
    
    if (sectionElement) {
      // Scroll to the section with smooth behavior
      sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <motion.nav 
      variants={navVariants}
      initial="hidden"
      animate="visible"
      className="sticky top-0 z-50"
    >
      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <ul className="flex flex-wrap justify-center gap-4 bg-green-400 rounded-lg p-4 shadow-lg">
          {menuItems.map((item) => (
            <motion.li key={item.name} variants={itemVariants}>
              <motion.button
                className={`px-6 py-3 text-lg font-medium rounded-md transition-colors flex items-center gap-2 ${
                  activeItem === item.name 
                    ? "bg-[#1a1a1a] text-white"
                    : "hover:bg-[#1a1a1a] hover:text-white"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleItemClick(item.name)}
              >
                {item.icon}
                <span>{item.name}</span>
              </motion.button>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        {/* Mobile Toggle Button */}
        <div className="flex justify-end p-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="bg-green-400 text-black p-3 rounded-full shadow-lg z-50 relative"
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </motion.button>
        </div>

        {/* Active Section Indicator */}
        <div className="fixed top-4 left-4 bg-green-400 text-black px-4 py-2 rounded-full shadow-lg z-40 flex items-center gap-2">
          {menuItems.find(item => item.name === activeItem)?.icon}
          <span className="font-medium">{activeItem}</span>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 right-0 h-screen w-3/4 bg-[#1a1a1a] z-40 shadow-lg flex flex-col"
            >
              <div className="p-6 flex flex-col gap-6 mt-16">
                {menuItems.map((item) => (
                  <motion.button
                    key={item.name}
                    variants={itemVariants}
                    className={`px-6 py-4 text-lg font-medium rounded-md transition-colors flex items-center gap-3 ${
                      activeItem === item.name 
                        ? "bg-green-500 text-black"
                        : "bg-[#333] text-white hover:bg-[#444]"
                    }`}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleItemClick(item.name)}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}


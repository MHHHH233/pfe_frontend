"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import { FaHome, FaUsers, FaCalendarAlt, FaMoneyBillWave, FaListAlt, FaMapMarkerAlt, FaBars, FaTimes } from 'react-icons/fa'

const menuItems = [
  { name: "About", icon: <FaHome className="text-xl" />, color: "#10b981" },
  { name: "Coachs", icon: <FaUsers className="text-xl" />, color: "#06b6d4" },
  { name: "Activités", icon: <FaCalendarAlt className="text-xl" />, color: "#8b5cf6" },
  { name: "Tarifs", icon: <FaMoneyBillWave className="text-xl" />, color: "#f59e0b" },
  { name: "Programmes", icon: <FaListAlt className="text-xl" />, color: "#ef4444" },
  { name: "Local", icon: <FaMapMarkerAlt className="text-xl" />, color: "#ec4899" }
]

const navVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.5,
      staggerChildren: 0.1,
      ease: [0.6, 0.05, 0.01, 0.99]
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: -10, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, type: "spring", stiffness: 200 }
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
      damping: 30,
      staggerChildren: 0.07,
      delayChildren: 0.2
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

const mobileBgVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3 }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3 }
  }
}

const menuItemVariants = {
  hidden: { x: 20, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  },
  hover: { 
    scale: 1.05,
    transition: { type: "spring", stiffness: 400, damping: 10 }
  },
  tap: { scale: 0.95 }
}

export function Navigation() {
  const [activeItem, setActiveItem] = useState("About");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef(null);

  // Check if we're on a mobile device and handle scroll
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
      setIsScrolled(position > 50);
    };
    
    // Initial checks
    checkIfMobile();
    handleScroll();
    
    // Add event listeners
    window.addEventListener('resize', checkIfMobile);
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkIfMobile);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

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
      <motion.div 
        className="hidden md:block"
        animate={{
          y: isScrolled ? -10 : 0,
          scale: isScrolled ? 0.95 : 1,
          opacity: isScrolled ? 0.95 : 1
        }}
        transition={{ duration: 0.3 }}
      >
        <motion.div 
          className={`flex flex-wrap justify-center gap-4 bg-[#262626] backdrop-blur-md rounded-xl p-3 shadow-xl mx-4 mt-4 ${
            isScrolled ? 'border border-green-500/20' : ''
          }`}
          style={{
            boxShadow: isScrolled 
              ? '0 10px 25px -5px rgba(7, 244, 104, 0.1), 0 10px 10px -5px rgba(7, 244, 104, 0.04)'
              : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
          }}
        >
          {menuItems.map((item) => (
            <motion.div
              key={item.name}
              variants={itemVariants}
              whileHover="hover"
              whileTap="tap"
              className="relative"
            >
              <motion.button
                className={`px-5 py-2.5 text-base font-medium rounded-lg transition-all flex items-center gap-2 ${
                  activeItem === item.name 
                    ? "bg-gradient-to-br from-green-500/90 to-green-400/90 text-black"
                    : "bg-[#333]/50 text-white hover:bg-[#333] hover:text-white"
                }`}
                onClick={() => handleItemClick(item.name)}
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: activeItem === item.name ? "" : "rgba(69, 69, 69, 0.8)",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                {item.icon}
                <span>{item.name}</span>
              </motion.button>
              
              {/* Active Indicator */}
              {activeItem === item.name && (
                <motion.div 
                  className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-green-400 rounded-full"
                  layoutId="activeIndicator"
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25
                  }}
                />
              )}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        {/* Mobile Toggle Button */}
        <motion.div 
          className="fixed top-4 right-4 z-50"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20,
            delay: 0.2
          }}
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-3 rounded-full shadow-lg relative ${
              isMobileMenuOpen 
                ? "bg-white text-black" 
                : "bg-gradient-to-r from-green-500 to-green-400 text-black"
            }`}
            style={{
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)"
            }}
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -45, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 45, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaTimes size={24} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 45, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -45, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaBars size={24} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>

        {/* Active Section Indicator */}
        <motion.div 
          className="fixed top-4 left-4 z-40 flex items-center gap-2"
          initial={{ x: -100, opacity: 0 }}
          animate={{ 
            x: 0, 
            opacity: 1,
            transition: { 
              type: "spring", 
              stiffness: 260, 
              damping: 20,
              delay: 0.1
            }
          }}
        >
          <div className="bg-gradient-to-r from-green-500 to-green-400 text-black px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
            {menuItems.find(item => item.name === activeItem)?.icon}
            <span className="font-medium">{activeItem}</span>
          </div>
        </motion.div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Background Overlay */}
              <motion.div
                variants={mobileBgVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              
              {/* Menu Panel */}
              <motion.div
                ref={menuRef}
                variants={mobileMenuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="fixed top-0 right-0 h-screen w-4/5 max-w-sm bg-gradient-to-b from-[#1a1a1a] to-[#111] z-40 shadow-2xl overflow-y-auto"
              >
                <div className="p-6 flex flex-col gap-4 mt-16">
                  <motion.div 
                    className="text-xl font-bold text-white mb-6"
                    variants={menuItemVariants}
                  >
                    Menu
                  </motion.div>
                  
                  {menuItems.map((item, index) => (
                    <motion.button
                      key={item.name}
                      variants={menuItemVariants}
                      whileHover="hover"
                      whileTap="tap"
                      className={`px-6 py-4 rounded-xl transition-all flex items-center gap-3 ${
                        activeItem === item.name 
                          ? "bg-gradient-to-r from-green-500 to-green-400 text-black font-medium"
                          : "bg-[#333]/50 text-white hover:bg-[#444]"
                      }`}
                      onClick={() => handleItemClick(item.name)}
                      style={{
                        boxShadow: activeItem === item.name 
                          ? `0 10px 15px -3px rgba(7, 244, 104, 0.2)` 
                          : 'none'
                      }}
                    >
                      <div 
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          activeItem === item.name 
                            ? "bg-black/10" 
                            : `bg-[${item.color}]/10`
                        }`}
                      >
                        {item.icon}
                      </div>
                      <span>{item.name}</span>
                    </motion.button>
                  ))}
                  
                  {/* Footer Info */}
                  <motion.div 
                    className="mt-auto pt-6 border-t border-white/10 text-gray-400 text-sm"
                    variants={menuItemVariants}
                  >
                    <p>© 2023 Terrana FC</p>
                    <p className="mt-1">Tous droits réservés</p>
                  </motion.div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}


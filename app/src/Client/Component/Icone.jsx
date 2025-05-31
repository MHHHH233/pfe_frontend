"use client";

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Mail, LogOut, X, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../../lib/services/authoServices'

const UserIcon = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [profilePicture, setProfilePicture] = useState(sessionStorage.getItem('pfp'))
  const navigate = useNavigate()
  const menuRef = useRef(null)
  
  // Parse user data from session storage
  useEffect(() => {
    const storedUserData = sessionStorage.getItem('userdetails')
    const storedEmail = sessionStorage.getItem('email')
    
    if (storedUserData) {
      const userData = JSON.parse(storedUserData)
      const fullName = `${userData.nom} ${userData.prenom}`.trim()
      setUserName(fullName)
    }
    if (storedEmail) setEmail(storedEmail)
  }, [])
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleNavigate = (path) => {
    navigate(`/${path}`)
    setIsOpen(false)
  }

  const handleLogout = async () => {
    try {
      await authService.logout();
      sessionStorage.clear();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      sessionStorage.clear();
      window.location.href = '/sign-in';
    }
  }

  // Animation variants
  const dropdownVariants = {
    hidden: { 
      opacity: 0,
      y: -5,
      scale: 0.95
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.2, 
        ease: "easeOut" 
      }
    },
    exit: { 
      opacity: 0,
      y: -5,
      scale: 0.95,
      transition: { 
        duration: 0.2, 
        ease: "easeIn" 
      }
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Profile Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center space-x-2 px-2 py-1 rounded-full 
                 bg-white/10 hover:bg-white/20 transition-colors border border-white/10"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-green-500 to-green-600 
                       flex items-center justify-center shadow-inner">
          {profilePicture ? (
            <img 
              src={profilePicture} 
              alt={userName}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white text-sm font-bold">
              {userName?.charAt(0).toUpperCase() || 'U'}
            </span>
          )}
        </div>
        <span className="text-white text-sm font-medium hidden sm:block pr-1 max-w-[100px] truncate">
          {userName || 'User'}
        </span>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute top-full right-0 mt-2 w-56 rounded-lg overflow-hidden
                     bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700
                     shadow-xl z-50"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-700 bg-black/20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-green-500 flex-shrink-0
                              flex items-center justify-center shadow-lg border border-green-400/30">
                  {profilePicture ? (
                    <img src={profilePicture} alt={userName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white text-sm font-bold">
                      {userName?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium text-sm truncate">{userName}</h3>
                  <p className="text-gray-400 text-xs truncate">{email}</p>
                </div>
              </div>
            </div>
            
            {/* Menu Items */}
            <div className="py-1">
              <MenuItem 
                icon={<User size={16} />} 
                text="My Profile" 
                onClick={() => handleNavigate('profile')}
              />
              <MenuItem 
                icon={<Mail size={16} />} 
                text="Contact Us" 
                onClick={() => handleNavigate('contactus')}
              />
              <div className="border-t border-gray-700 my-1"></div>
              <MenuItem 
                icon={<LogOut size={16} />} 
                text="Disconnect" 
                onClick={handleLogout}
                danger
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Menu Item Component
const MenuItem = ({ icon, text, onClick, danger = false }) => (
  <motion.button
    className={`w-full px-4 py-2.5 text-sm flex items-center space-x-3
              ${danger ? 'text-red-400 hover:text-red-300' : 'text-gray-200 hover:text-white'}
              hover:bg-white/10 transition-colors`}
    onClick={onClick}
    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
    whileTap={{ scale: 0.98 }}
  >
    <span className={`${danger ? 'text-red-400' : 'text-gray-400'}`}>{icon}</span>
    <span>{text}</span>
  </motion.button>
)

export default UserIcon


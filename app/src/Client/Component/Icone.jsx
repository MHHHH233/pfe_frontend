"use client";

import React, { useState, useEffect } from 'react'
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
  const [scrollPosition, setScrollPosition] = useState(0)

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

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY)
      if (window.scrollY > 100) {
        setIsOpen(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      setProfilePicture(URL.createObjectURL(file))
    }
  }

  const sidebarVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.1
      }
    },
    closed: {
      x: '100%',
      opacity: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  }

  const handleNavigate = (event) => {
    navigate(`/${event}`)
    setIsOpen(false)
  }

  const handleLogout = async () => {
    try {
      await authService.logout();
      // Clear session storage and redirect regardless of response
      sessionStorage.clear();
      window.location.href = '/'; // Redirect to signin page
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear and redirect even if there's an error
      sessionStorage.clear();
      window.location.href = '/sign-in';
    }
  }

  const actions = [
    { text: 'My Profile', icon: User, action: () => handleNavigate('profile') },
    { text: 'Contact Us', icon: Mail, action: () => handleNavigate('contactus') },
    { text: 'Disconnect', icon: LogOut, action: handleLogout }
  ]

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="relative w-12 h-12 rounded-full overflow-hidden 
                   bg-gradient-to-r from-green-400 to-green-600 
                   cursor-pointer flex items-center justify-center 
                   shadow-lg hover:shadow-xl transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {profilePicture ? (
          <img 
            src={profilePicture} 
            alt={userName}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-white text-xl font-bold">
            {userName?.charAt(0).toUpperCase() || 'U'}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            className={`fixed top-0 right-0 h-[100dvh] w-80 
                      bg-gradient-to-b from-gray-900 to-gray-800 
                      shadow-[-5px_0_15px_rgba(0,0,0,0.3)] 
                      z-50 flex flex-col overflow-hidden
                      ${scrollPosition > 0 ? 'backdrop-blur-lg bg-opacity-95' : ''}`}
          >
            <div className="p-6 bg-black/20">
              <motion.button
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full
                          hover:bg-white/10 transition-colors
                          text-white/80 hover:text-white"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={24} />
              </motion.button>
            </div>

            <motion.div 
              className="flex flex-col items-center py-8 px-6 border-b border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div 
                className="w-32 h-32 rounded-full overflow-hidden 
                          border-4 border-green-400/20 shadow-xl"
              >
                <img 
                  src={profilePicture} 
                  alt={userName} 
                  className="w-full h-full object-cover" 
                />
              </motion.div>
              <h2 className="mt-4 text-2xl font-bold text-white">{userName}</h2>
              <p className="text-green-400">{email}</p>
            </motion.div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-3">
                {actions.map((item, index) => (
                  <motion.button
                    key={item.text}
                    className={`w-full p-3 rounded-xl flex items-center 
                              justify-between text-white/90 hover:text-white
                              ${item.text === 'Disconnect' 
                                ? 'bg-red-500/20 hover:bg-red-500/30' 
                                : 'bg-white/5 hover:bg-white/10'
                              } transition-all duration-200`}
                    onClick={item.action}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <span className="flex items-center gap-3">
                      <item.icon size={20} />
                      {item.text}
                    </span>
                    <ChevronRight size={18} />
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default UserIcon


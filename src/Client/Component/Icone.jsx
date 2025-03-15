"use client";

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Info, LogOut, X, Key, Mail, ChevronRight, User2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import UserInfoCard from './Userinfos'

const UserIcon = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [showinfo, setShowinfo] = useState(false)
  const [profilePicture, setProfilePicture] = useState('https://discuss.cakewalk.com/uploads/monthly_2024_03/imported-photo-22646.thumb.jpeg.34bfea5fe763a56356574f4c413f0f17.jpeg')
  const navigate = useNavigate()

  useEffect(() => {
    const storedUserName = sessionStorage.getItem('nom') + " " + sessionStorage.getItem('prenom')
    const storedEmail = sessionStorage.getItem('email')
    if (storedUserName) setUserName(storedUserName)
    if (storedEmail) setEmail(storedEmail)
  }, [])

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      setProfilePicture(URL.createObjectURL(file))
    }
  }

  const sidebarVariants = {
    open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { x: '100%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
  }

  const handleNavigate = (event) => {
    navigate(`/${event}`)
    setIsOpen(false)
  }

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost/PFR/3AFAK-PFE/backend/controleur/Logout.php', {
        method: 'POST',
        credentials: 'include',
      })

      if (response.ok) {
        sessionStorage.clear()
        window.location.reload()
        navigate('/sign-in')
      }
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const Infos = () => {
    setShowinfo(!showinfo)
    setIsOpen(false)
  }

  const actions = [
    { text: 'My Info', icon: Info, action: Infos },
    { text: 'Change Password', icon: Key, action: () => handleNavigate('changepw') },
    { text: 'Contact Us', icon: Mail, action: () => handleNavigate('contactus') },
    { text: 'Disconnect', icon: LogOut, action: handleLogout }
  ]

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="relative w-12 h-12 rounded-full p-0 border-none bg-[#ffffff] cursor-pointer flex items-center justify-center shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <motion.div className="w-10 h-10 rounded-full overflow-hidden bg-[#fff] flex items-center justify-center text-lg font-bold text-[#07f468]">
          {userName ? userName.charAt(0).toUpperCase() : 'U'}
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            className="fixed top-0 right-0 h-screen w-80 rounded-l-lg bg-[#1a1a1a] shadow-[-5px_0_15px_rgba(0,0,0,0.3)] z-50 flex flex-col p-8 overflow-y-auto"
          >
            <motion.button
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 bg-transparent border-none cursor-pointer text-[#07f468]"
              whileHover={{ scale: 1.1, color: '#06d35a' }}
            >
              <X size={22} />
            </motion.button>

            <motion.div className="flex flex-col items-center mb-10 mt-3">
              <motion.div className="w-32 h-32 rounded-full overflow-hidden bg-[#333] mb-5 shadow-md">
                <motion.img 
                  src={profilePicture} 
                  alt={userName} 
                  className="w-full h-full object-cover" 
                />
              </motion.div>
              <motion.h2 className="m-0 mb-2 text-2xl font-semibold text-[#07f468]">{userName}</motion.h2>
              <motion.p className="m-0 text-base text-[#999]">{email}</motion.p>
            </motion.div>

            <motion.div className="flex-1 flex flex-col gap-4">
              {actions.map((item) => (
                <motion.button
                  key={item.text}
                  className={`w-full py-3 px-5 border-none rounded-full font-medium uppercase cursor-pointer flex items-center justify-between text-l ${
                    item.text === 'Disconnect'
                      ? 'bg-[#dc3545] text-white hover:bg-[#b52c3a]'
                      : 'bg-[#07f468] text-[#1a1a1a] hover:bg-[#06d35a]'
                  } transition-all duration-300 ease-in-out  hover:transform hover:-translate-y-0.5 hover:shadow-lg active:transform active:translate-y-0 active:shadow-md`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={item.action}
                >
                  <span className="flex items-center">
                    <item.icon size={18} className="mr-3" />
                    {item.text}
                  </span>
                  <ChevronRight size={18} />
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showinfo && <UserInfoCard isOpen={showinfo} setIsOpen={setShowinfo} />}
    </>
  )
}

export default UserIcon


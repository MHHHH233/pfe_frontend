"use client"

import { useState, useEffect } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Bell, Menu, User, Calendar, Trophy, Search, ChevronDown, ArrowRight, ChevronRight, Users, Star, Clock, MapPin, Shield, Mail, MailX, Phone, AlertCircle } from 'lucide-react'
import LogoLight from "../img/logoLight.png"
import { Navigate, Route, useNavigate } from "react-router-dom"
import tournament1 from "../img/tournament1.webp"
import tournament2 from "../img/tournament2.webp"
import tournament7 from "../img/tournament7.webp"
import reservationService from "../lib/services/admin/reservationServices"
import userService from '../lib/services/user/userServices'


export default function EnhancedClientDashboard() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { scrollYProgress } = useScroll()
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const headerTranslateY = useTransform(scrollYProgress, [0, 0.2], [0, -100])


  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        document.body.classList.add('scrolled')
      } else {
        document.body.classList.remove('scrolled')
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] text-white relative">
      {/* Top gradient border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#07F468] to-transparent z-10"></div>
      
      {/* <Header opacity={headerOpacity} translateY={headerTranslateY} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} /> */}
      <main className="pt-16">
        <HeroSection />
        <OverviewSection />
        {/* <ReservationSection /> */}
        <div id="reservation-section" className="text-black">
        </div>
        <TournamentsSection />
        <FindPlayersSection />
      </main>
      <Footer />
    </div>
  )
}


function Header({ opacity, translateY, isMenuOpen, setIsMenuOpen }) {
  const isLoggedIn = !!sessionStorage.getItem("userId");
  const userName = sessionStorage.getItem("nom") || '';
  const [notificationCount, setNotificationCount] = useState(0);
  
  // Fetch notifications count (mock for now)
  useEffect(() => {
    if (isLoggedIn) {
      // This would be a real API call in production
      setNotificationCount(3); // Mock notification count
    }
  }, [isLoggedIn]);
  
  const navigate = useNavigate();
  
  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 bg-[#1a1a1a] border-b border-[#333] transition-colors duration-300"
      style={{ opacity, translateY }}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <img
              className="w-28 h-auto transition-transform duration-300 hover:scale-105 cursor-pointer"
              src={LogoLight}
              alt="Logo"
              onClick={() => navigate('/')}
            />
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <NavLink href="#overview">Overview</NavLink>
            <NavLink href="#reservation">Reservation</NavLink>
            <NavLink href="#tournaments">Tournaments</NavLink>
            <NavLink href="#find-players">Find Players</NavLink>
          </div>
          <div className="flex items-center space-x-2">
            {isLoggedIn ? (
              <>
                <div className="relative">
                  <button className="p-2 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1a1a1a] focus:ring-[#1DB954] transition-colors duration-200">
                    <Bell className="h-6 w-6" />
                    {notificationCount > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                        {notificationCount}
                      </span>
                    )}
                  </button>
                </div>
                <button 
                  onClick={() => navigate('/reservation')}
                  className="p-2 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1a1a1a] focus:ring-[#1DB954] transition-colors duration-200"
                >
                  <Calendar className="h-6 w-6" />
                </button>
                <div className="ml-3 relative">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-300 hidden sm:inline">
                      {userName}
                    </span>
                    <button
                     className="bg-[#282828] flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1a1a1a] focus:ring-[#1DB954]"
                     onClick={() => navigate('/profile')}
                    >
                      <img
                        className="h-8 w-8 rounded-full"
                        src= {sessionStorage.getItem("pfp")}
                        alt="Profile"
                      />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex space-x-2">
                <button 
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 rounded-md text-sm font-medium text-white bg-[#282828] hover:bg-[#333] transition-colors duration-200"
                >
                  Log in
                </button>
                <button 
                  onClick={() => navigate('/signup')}
                  className="px-4 py-2 rounded-md text-sm font-medium text-[#1a1a1a] bg-[#1DB954] hover:bg-[#1ed760] transition-colors duration-200"
                >
                  Sign up
                </button>
              </div>
            )}
            <div className="ml-3 md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-[#282828] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#1DB954]"
              >
                <Menu className="block h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </nav>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <MobileNavLink href="#overview">Overview</MobileNavLink>
            <MobileNavLink href="#reservation">Reservation</MobileNavLink>
            <MobileNavLink href="#tournaments">Tournaments</MobileNavLink>
            <MobileNavLink href="#find-players">Find Players</MobileNavLink>
            {isLoggedIn ? (
              <>
                <MobileNavLink href="/profile">Profile</MobileNavLink>
                <MobileNavLink href="/reservation">My Reservations</MobileNavLink>
                <button 
                  onClick={() => {
                    sessionStorage.clear();
                    window.location.href = '/';
                  }}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-red-400 hover:bg-[#282828] hover:text-red-300 rounded-md"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <MobileNavLink href="/login">Log in</MobileNavLink>
                <MobileNavLink href="/signup">Sign up</MobileNavLink>
              </>
            )}
          </div>
        </div>
      )}
    </motion.header>
  )
}

function NavLink({ href, children }) {
  return (
    <a 
      href={href} 
      className="text-gray-300 hover:bg-[#282828] hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
    >
      {children}
    </a>
  )
}

function MobileNavLink({ href, children }) {
  return (
    <a
      href={href}
      className="text-gray-300 hover:bg-[#282828] hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
    >
      {children}
    </a>
  )
}

function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <video
          className="object-cover w-full h-full opacity-50"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/football-background.mp4" type="video/mp4" />
        </video>
        {/* Enhanced gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a]/80 via-[#1a1a1a]/60 to-[#1a1a1a]/90"></div>
        
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#07F468] to-transparent z-10 opacity-70"></div>
      </div>
      
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <motion.h1 
          className="text-5xl md:text-7xl font-bold mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-white block mb-2">Welcome to Your</span>
          <span className="bg-gradient-to-r from-[#07F468] to-[#34d399] bg-clip-text text-transparent">Dashboard</span>
        </motion.h1>
        
        <motion.p 
          className="text-xl md:text-2xl mb-12 text-gray-200 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Manage your football journey with ease and discover new opportunities to play, compete, and connect with players around you
        </motion.p>
        
        <motion.a
          href="#overview"
          className="bg-[#07F468] text-[#1a1a1a] font-bold py-3.5 px-10 rounded-full inline-flex items-center transition-all duration-300 
            shadow-lg hover:shadow-[#07F468]/30 hover:bg-[#06d35a] hover:translate-y-[-2px] relative overflow-hidden group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="relative z-10">Get Started</span>
          <ArrowRight className="ml-2 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
          
          {/* Shine effect on hover */}
          <div className="absolute top-0 -left-[100%] w-[250%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:left-[100%] transition-all duration-700 ease-in-out z-0"></div>
        </motion.a>
      </div>
      
      {/* Enhanced scroll indicator */}
      <motion.div 
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-white/80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <span className="text-sm uppercase tracking-widest mb-3 font-light">Scroll Down</span>
        <motion.div
          className="bg-[#07F468]/10 p-2 rounded-full"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <ChevronDown className="h-6 w-6 text-[#07F468]" />
        </motion.div>
      </motion.div>
    </section>
  )
}

const OverviewSection = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await userService.getProfile();
        setUserData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <section id="overview" className="py-24 bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] text-white relative">
      {/* Enhanced top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#07F468] to-transparent opacity-70"></div>
      
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-4xl font-bold mb-3 inline-block relative"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Dashboard Overview
            <motion.span
              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#07F468] to-[#34d399] rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            ></motion.span>
          </motion.h2>
          
          <motion.p
            className="text-gray-300 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Manage your profile, reservations and player connections all in one place
          </motion.p>
        </motion.div>
        
        {loading ? (
          <motion.div 
            className="flex flex-col justify-center items-center h-48 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-2 border-gray-800"></div>
              <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-t-2 border-l-2 border-[#07F468] animate-spin"></div>
            </div>
            <p className="text-gray-400">Loading your dashboard...</p>
          </motion.div>
        ) : error ? (
          <motion.div 
            className="text-red-400 text-center py-6 px-4 bg-red-400/10 border border-red-400/20 rounded-lg max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="mb-3 flex justify-center">
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
            <p>{error}</p>
          </motion.div>
        ) : userData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ProfileCard userData={userData} />
            <Myreservations userData={userData} />
            <PlayerRequests userData={userData} />
          </div>
        ) : (
          <div className="text-gray-400 text-center py-8 bg-gray-800/30 rounded-lg">
            Failed to load user data. Please refresh the page.
          </div>
        )}
      </div>
    </section>
  );
};

const ProfileCard = ({ userData }) => {
  const [activityData, setActivityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActivityHistory = async () => {
      try {
        // Temporarily disable activity history fetch since endpoint doesn't exist yet
        setLoading(false);
      } catch (err) {
        console.error("Error fetching activity history:", err);
        setLoading(false);
      }
    };

    fetchActivityHistory();
  }, []);

  if (!userData) return null;

  return (
    <motion.div 
      className="bg-[#111] rounded-xl overflow-hidden shadow-lg hover:shadow-[#07F468]/10 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      {/* Top gradient border */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#07F468] to-transparent"></div>
      
      <div className="p-6 flex flex-col items-center">
        <div className="w-24 h-24 rounded-full mb-6 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#07f468] to-[#34d399] opacity-70 rounded-full"></div>
          {userData.pfp && userData.pfp !== "null" ? (
            <img 
              src={userData.pfp} 
              alt="Profile" 
              className="w-full h-full object-cover relative z-10"
            />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center relative z-10">
              <User className="w-12 h-12 text-[#07f468]" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[#07f468] to-[#34d399] opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full"></div>
        </div>
        
        <h3 className="text-xl font-semibold mb-1">{`${userData.nom || 'N/A'} ${userData.prenom || ''}`}</h3>
        <p className="text-gray-400 mb-1 flex items-center">
          <Mail className="w-4 h-4 mr-1 text-[#07f468]" />
          {userData.email || 'N/A'}
        </p>
        <p className="text-gray-400 mb-4 flex items-center">
          <Calendar className="w-4 h-4 mr-1 text-[#07f468]" />
          Member since: {userData.created_at ? new Date(userData.created_at).toLocaleDateString() : 'N/A'}
        </p>
        
        <div className="flex items-center mb-6 bg-[#07f468]/10 px-3 py-1 rounded-full">
          <span className="mr-2 text-white">N/A</span>
          <Star className="w-5 h-5 text-[#07f468]" fill="#07f468" />
        </div>
        
        <button 
          onClick={() => navigate('/profile')}
          className="bg-transparent text-[#07f468] border border-[#07f468] rounded-full w-full py-2.5 px-4 text-sm font-bold 
            tracking-wide cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#07f468]/10
            hover:shadow-[0_0_10px_rgba(7,_244,_104,_0.2)] flex items-center justify-center"
        >
          View Profile
          <ChevronRight className="ml-1 w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};


const PlayerRequests = ({ userData }) => {
  const [activeTab, setActiveTab] = useState('received');
  const navigate = useNavigate();
  
  // Get the player data if it exists
  const player = userData?.player || null;
  
  // Get sent and received requests
  const sentRequests = player?.sentRequests || [];
  const receivedRequests = player?.receivedRequests || [];
  
  // Get the active requests based on the selected tab
  const activeRequests = activeTab === 'received' ? receivedRequests : sentRequests;

  const formatDate = (dateString) => {
    if (!dateString) return 'Invalid Date';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleDateString();
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'Invalid Date';
    }
  };
  
  const formatTime = (timeString) => {
    if (!timeString) return 'Not specified';
    try {
      // Extract time portion if it's a datetime string
      const timePart = timeString.includes('T') 
        ? timeString.split('T')[1]
        : timeString;
      
      // Format time (first 5 chars for HH:MM)
      return timePart.substring(0, 5);
    } catch (error) {
      console.error("Error formatting time:", error);
      return 'Invalid Time';
    }
  };

  return (
    <motion.div 
      className="bg-[#111] rounded-xl overflow-hidden shadow-lg hover:shadow-[#07F468]/10 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      viewport={{ once: true }}
    >
      {/* Top gradient border */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#07F468] to-transparent"></div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-6 text-center flex items-center justify-center">
          <Users className="w-5 h-5 mr-2 text-[#07f468]" />
          Player Requests
        </h3>
        
        {!player ? (
          <div className="flex flex-col items-center py-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#07f468]/5 rounded-full mb-4">
              <Users className="h-8 w-8 text-[#07f468] opacity-50" />
            </div>
            <p className="text-gray-400 text-center mb-6">Create a player profile to manage requests</p>
            <button 
              onClick={() => navigate('/players')}
              className="bg-transparent text-[#07f468] border border-[#07f468] rounded-full py-2.5 px-6 text-sm font-bold 
                tracking-wide cursor-pointer transition-all duration-300 hover:bg-[#07f468]/10
                hover:shadow-[0_0_10px_rgba(7,_244,_104,_0.2)] inline-flex items-center"
            >
              Create Player Profile
              <ArrowRight className="ml-2 w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-center mb-6">
              <div className="inline-flex rounded-full bg-[#1a1a1a] p-1">
                <button
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeTab === 'received' 
                      ? 'bg-[#07f468] text-black shadow-md' 
                      : 'text-white hover:bg-[#07f468]/10'
                  }`}
                  onClick={() => setActiveTab('received')}
                >
                  Received
                </button>
                <button
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeTab === 'sent' 
                      ? 'bg-[#07f468] text-black shadow-md' 
                      : 'text-white hover:bg-[#07f468]/10'
                  }`}
                  onClick={() => setActiveTab('sent')}
                >
                  Sent
                </button>
              </div>
            </div>
            
            <AnimatePresence mode="wait">
              {activeRequests.length === 0 ? (
                <motion.div 
                  key="empty"
                  className="text-gray-400 text-center py-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-[#07f468]/5 rounded-full mb-3">
                    <MailX className="h-6 w-6 text-[#07f468] opacity-50" />
                  </div>
                  <p>No {activeTab} requests found</p>
                </motion.div>
              ) : (
                <motion.div 
                  key="list"
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {activeRequests.slice(0, 3).map((request, index) => (
                    <motion.div 
                      key={request.id_request || index} 
                      className="bg-[#1a1a1a] rounded-lg p-4 border border-gray-800 hover:border-[#07f468]/30 transition-colors"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ x: 5 }}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-medium text-white flex items-center">
                          <User className="h-4 w-4 text-[#07f468] mr-1.5" />
                          {activeTab === 'sent' ? 'To: ' : 'From: '}
                          Player #{activeTab === 'sent' ? request.receiver : request.sender}
                        </span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          request.status === "accepted" 
                            ? "bg-[#07f468]/10 text-[#07f468]" 
                            : request.status === "pending"
                            ? "bg-yellow-500/10 text-yellow-400"
                            : "bg-red-500/10 text-red-400"}`}>
                          {request.status || 'Pending'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400">
                        <div className="flex items-center mb-1">
                          <Calendar className="h-4 w-4 text-[#07f468] mr-2" />
                          <p>{formatDate(request.match_date)}</p>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-[#07f468] mr-2" />
                          <p>{formatTime(request.starting_time)}</p>
                        </div>
                        {request.message && (
                          <p className="mt-2 text-xs italic bg-gray-800/50 p-2 rounded-md mt-3">"{request.message}"</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  
                  {activeRequests.length > 3 && (
                    <div className="text-center mt-4 pt-2 border-t border-gray-800">
                      <button 
                        onClick={() => navigate('/players')}
                        className="text-[#07f468] hover:text-[#06d35a] flex items-center mx-auto transition-colors font-medium text-sm"
                      >
                        View all ({activeRequests.length})
                        <ChevronRight className="ml-1 w-4 h-4" />
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </motion.div>
  );
};

function TournamentsSection() {
  const Navigate = useNavigate();
  const tournaments = [
    {
      name: "Summer League Tournament",
      teams: 16,
      startDate: "July 15, 2024",
      status: "Registration Open",
      prize: "$10,000",
      image: tournament1
    },
    {
      name: "Winter Cup",
      teams: 32,
      startDate: "December 1, 2024",
      status: "Coming Soon",
      prize: "$15,000",
      image: tournament2
    },
    {
      name: "Youth Championship",
      teams: 24,
      startDate: "August 5, 2024",
      status: "Registration Open",
      prize: "$5,000",
      image: tournament7
    }
  ]

  return (
    <section id="tournaments" className="py-24 bg-gradient-to-b from-[#111] to-[#0a0a0a] relative">
      {/* Top gradient border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#07F468] to-transparent opacity-70"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-4xl font-bold mb-3 inline-block relative text-white"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Upcoming Tournaments
            <motion.span
              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#07F468] to-[#34d399] rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            ></motion.span>
          </motion.h2>
          
          <motion.p
            className="text-gray-300 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Join competitive tournaments and showcase your skills on the field
          </motion.p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tournaments.map((tournament, index) => (
            <motion.div 
              key={index}
              className="bg-[#1a1a1a] rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-[#07F468]/10 border border-gray-800 hover:border-[#07F468]/30 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="relative overflow-hidden h-52">
                <img 
                  src={tournament.image} 
                  alt={tournament.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent opacity-80"></div>
                
                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#07F468] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3 text-white">{tournament.name}</h3>
                
                <div className="space-y-2 mb-5">
                  <div className="flex items-center text-sm text-gray-300">
                    <Users className="h-4 w-4 text-[#07F468] mr-2 flex-shrink-0" />
                    <p>{tournament.teams} Teams</p>
                  </div>
                  <div className="flex items-center text-sm text-gray-300">
                    <Calendar className="h-4 w-4 text-[#07F468] mr-2 flex-shrink-0" />
                    <p>Starts on {tournament.startDate}</p>
                  </div>
                  <div className="flex items-center text-sm text-gray-300">
                    <Trophy className="h-4 w-4 text-[#07F468] mr-2 flex-shrink-0" />
                    <p>Prize Pool: {tournament.prize}</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                    tournament.status === "Registration Open" 
                      ? "bg-[#07F468]/10 text-[#07F468] border border-[#07F468]/30" 
                      : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30"
                  }`}>
                    {tournament.status}
                  </span>
                  <motion.button 
                    className="bg-transparent text-[#07F468] border border-[#07F468] hover:bg-[#07F468]/10 font-bold py-2 px-4 rounded-full text-sm transition-all duration-300 flex items-center"
                    whileHover={{ scale: 1.05, x: 3 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => Navigate("/tournoi")}
                  >
                    View Details
                    <ChevronRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.button
            className="bg-[#07F468] hover:bg-[#06d35a] text-[#1a1a1a] font-bold py-3.5 px-8 rounded-full text-base transition-all duration-300 flex items-center mx-auto shadow-lg hover:shadow-[#07F468]/20 relative overflow-hidden group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => Navigate("/tournoi")}
          >
            <span className="relative z-10">See More Tournaments</span>
            <ChevronRight className="ml-2 h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
            
            {/* Shine effect */}
            <div className="absolute top-0 -left-[100%] w-[250%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:left-[100%] transition-all duration-700 ease-in-out z-0"></div>
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}


function FindPlayersSection() {
  const Navigate=useNavigate();
  const players = [
    { id: 1, name: 'John Doe', position: 'Forward', rating: 4.8, image: 'https://discuss.cakewalk.com/uploads/monthly_2024_03/imported-photo-22646.thumb.jpeg.34bfea5fe763a56356574f4c413f0f17.jpeg' },
    { id: 2, name: 'Jane Smith', position: 'Midfielder', rating: 4.7, image: 'https://discuss.cakewalk.com/uploads/monthly_2024_03/imported-photo-22646.thumb.jpeg.34bfea5fe763a56356574f4c413f0f17.jpeg' },
    { id: 3, name: 'Mike Johnson', position: 'Defender', rating: 4.9, image: 'https://discuss.cakewalk.com/uploads/monthly_2024_03/imported-photo-22646.thumb.jpeg.34bfea5fe763a56356574f4c413f0f17.jpeg' },
    { id: 4, name: 'Sarah Williams', position: 'Goalkeeper', rating: 4.6, image: 'https://discuss.cakewalk.com/uploads/monthly_2024_03/imported-photo-22646.thumb.jpeg.34bfea5fe763a56356574f4c413f0f17.jpeg' },
    { id: 5, name: 'David Brown', position: 'Forward', rating: 4.5, image: 'https://discuss.cakewalk.com/uploads/monthly_2024_03/imported-photo-22646.thumb.jpeg.34bfea5fe763a56356574f4c413f0f17.jpeg' },
  ];
  
  const teams = [
    { id: 1, name: 'Thunderbolts FC', rating: 4.9, image: 'https://discuss.cakewalk.com/uploads/monthly_2024_03/imported-photo-22646.thumb.jpeg.34bfea5fe763a56356574f4c413f0f17.jpeg' },
    { id: 2, name: 'Royal Eagles', rating: 4.8, image: 'https://discuss.cakewalk.com/uploads/monthly_2024_03/imported-photo-22646.thumb.jpeg.34bfea5fe763a56356574f4c413f0f17.jpeg' },
    { id: 3, name: 'Crimson Warriors', rating: 4.7, image: 'https://discuss.cakewalk.com/uploads/monthly_2024_03/imported-photo-22646.thumb.jpeg.34bfea5fe763a56356574f4c413f0f17.jpeg' },
    { id: 4, name: 'Emerald United', rating: 4.6, image: 'https://discuss.cakewalk.com/uploads/monthly_2024_03/imported-photo-22646.thumb.jpeg.34bfea5fe763a56356574f4c413f0f17.jpeg' },
    { id: 5, name: 'Silver Wolves', rating: 4.5, image: 'https://discuss.cakewalk.com/uploads/monthly_2024_03/imported-photo-22646.thumb.jpeg.34bfea5fe763a56356574f4c413f0f17.jpeg' },
  ];  
    const [searchQuery, setSearchQuery] = useState('');
    const [filterPosition, setFilterPosition] = useState('');
    const [activeTab, setActiveTab] = useState('players');
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [selectedTeam, setSelectedTeam] = useState(null);
  return (
   <section className="py-24 bg-[#1a1a1a]">
           <div className="container mx-auto px-4">
             <h2 className="text-4xl font-bold mb-12 text-center">Top Rated</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <div className="bg-[#333] rounded-2xl p-8 shadow-lg">
                 <h3 className="text-2xl font-semibold mb-6 flex items-center">
                   <Users className="w-6 h-6 mr-2 text-[#07f468]" />
                   Top Players
                 </h3>
                 <ul className="space-y-4">
                   {players.slice(0, 5).map((player) => (
                     <li key={player.id} className="flex items-center justify-between">
                       <div className="flex items-center">
                         <img src={player.image} alt={player.name} className="w-10 h-10 rounded-full mr-3 object-cover" />
                         <span className="font-medium">{player.name}</span>
                       </div>
                       <div className="flex items-center">
                         <span className="mr-2">{player.rating}</span>
                         <Star className="w-5 h-5 text-[#07f468]" fill="#07f468" />
                       </div>
                     </li>
                   ))}
                 </ul>
               </div>
               <div className="bg-[#333] rounded-2xl p-8 shadow-lg">
                 <h3 className="text-2xl font-semibold mb-6 flex items-center">
                   <Trophy className="w-6 h-6 mr-2 text-[#07f468]" />
                   Top Teams
                 </h3>
                 <ul className="space-y-4">
                   {teams.slice(0, 5).map((team) => (
                     <li key={team.id} className="flex items-center justify-between">
                       <div className="flex items-center">
                         <img src={team.image} alt={team.name} className="w-10 h-10 rounded-full mr-3 object-cover" />
                         <span className="font-medium">{team.name}</span>
                       </div>
                       <div className="flex items-center">
                         <span className="mr-2">{team.rating}</span>
                         <Star className="w-5 h-5 text-[#07f468]" fill="#07f468" />
                       </div>
                     </li>
                   ))}
                 </ul>
               </div>
             </div>
           </div>
           <div className="mt-12 text-center">
          <motion.button
            className="bg-[#07f468] hover:bg-[#06d35a] text-[#1a1a1a] font-bold py-3 px-6 rounded-full text-lg transition-colors duration-200 flex items-center mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={()=>Navigate("/players")}
          >
            View All Players / Teams
            <ChevronRight className="ml-2 h-5 w-5" />
          </motion.button>
        </div>
         </section>
  )
}

const Myreservations = ({ userData }) => {
  const reservations = userData?.reservations || [];
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    if (!dateString) return 'Invalid Date';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleDateString();
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'Invalid Date';
    }
  };

  return (
    <motion.div 
      className="bg-[#111] rounded-xl overflow-hidden shadow-lg hover:shadow-[#07F468]/10 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      viewport={{ once: true }}
    >
      {/* Top gradient border */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#07F468] to-transparent"></div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-6 text-center flex items-center justify-center">
          <Calendar className="w-5 h-5 mr-2 text-[#07f468]" />
          My Reservations
        </h3>
        
        {reservations.length === 0 ? (
          <div className="text-center py-8 px-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#07f468]/5 rounded-full mb-4">
              <Calendar className="h-8 w-8 text-[#07f468] opacity-50" />
            </div>
            <p className="text-gray-400 mb-6">No upcoming reservations found</p>
            <button 
              onClick={() => navigate('/reservation')}
              className="bg-transparent text-[#07f468] border border-[#07f468] rounded-full py-2 px-6 text-sm font-medium 
                tracking-wide transition-all duration-300 hover:bg-[#07f468]/10 inline-flex items-center"
            >
              Book a Field
              <ChevronRight className="ml-1 w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {reservations.slice(0, 3).map((reservation, index) => (
              <motion.div 
                key={reservation.id_reservation || index} 
                className="bg-[#1a1a1a] rounded-lg p-4 border border-gray-800 hover:border-[#07f468]/30 transition-colors"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ x: 5 }}
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium text-white">
                    {reservation.terrain?.nom || reservation.Name || 'Unnamed Field'}
                  </span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    reservation.etat === "reserver" 
                      ? "bg-[#07f468]/10 text-[#07f468]" 
                      : reservation.etat === "en attente"
                      ? "bg-yellow-500/10 text-yellow-400"
                      : "bg-red-500/10 text-red-400"}`}>
                    {reservation.etat || 'Pending'}
                  </span>
                </div>
                <div className="text-sm text-gray-400">
                  <div className="flex items-center mb-1">
                    <Calendar className="h-4 w-4 text-[#07f468] mr-2" />
                    <p>{formatDate(reservation.date)}</p>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-[#07f468] mr-2" />
                    <p>{reservation.heure ? reservation.heure.substring(0, 5) : 'Time not specified'}</p>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {reservations.length > 3 && (
              <div className="text-center mt-4 pt-2 border-t border-gray-800">
                <button 
                  onClick={() => navigate('/reservation')}
                  className="text-[#07f468] hover:text-[#06d35a] flex items-center mx-auto transition-colors font-medium text-sm"
                >
                  View all ({reservations.length})
                  <ChevronRight className="ml-1 w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#111] to-[#0a0a0a] py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Top gradient border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#07F468] to-transparent z-10"></div>
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-2 space-y-5">
            <img
              className="w-36 h-auto mb-4 transition-all duration-300 hover:scale-105 cursor-pointer"
              src={LogoLight}
              alt="Logo"
            />
            <p className="text-gray-300 text-sm leading-relaxed">
              Empowering football enthusiasts with cutting-edge technology and seamless experiences for booking fields, joining tournaments, and connecting with players.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-gray-300 hover:text-[#07F468] hover:scale-110 transform transition-all duration-300">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-[#07F468] hover:scale-110 transform transition-all duration-300">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-[#07F468] hover:scale-110 transform transition-all duration-300">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
          
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4 relative inline-block text-white">
              Navigation
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-[#07F468] transform origin-left transition-all duration-300"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#overview" className="text-gray-300 hover:text-[#07F468] transition-colors duration-300 hover:translate-x-2 inline-flex items-center transform">
                  <span className="bg-[#07F468] h-1.5 w-1.5 rounded-full mr-2"></span>
                  Overview
                </a>
              </li>
              <li>
                <a href="#reservation-section" className="text-gray-300 hover:text-[#07F468] transition-colors duration-300 hover:translate-x-2 inline-flex items-center transform">
                  <span className="bg-[#07F468] h-1.5 w-1.5 rounded-full mr-2"></span>
                  Reservations
                </a>
              </li>
              <li>
                <a href="#tournaments" className="text-gray-300 hover:text-[#07F468] transition-colors duration-300 hover:translate-x-2 inline-flex items-center transform">
                  <span className="bg-[#07F468] h-1.5 w-1.5 rounded-full mr-2"></span>
                  Tournaments
                </a>
              </li>
              <li>
                <a href="#find-players" className="text-gray-300 hover:text-[#07F468] transition-colors duration-300 hover:translate-x-2 inline-flex items-center transform">
                  <span className="bg-[#07F468] h-1.5 w-1.5 rounded-full mr-2"></span>
                  Find Players
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4 relative inline-block text-white">
              Contact Us
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-[#07F468] transform origin-left transition-all duration-300"></span>
            </h3>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-center gap-3 hover:text-[#07F468] transition-colors duration-300 group cursor-pointer">
                <Mail className="w-5 h-5 text-[#07F468] group-hover:scale-110 transition-transform" />
                <a href="mailto:contact@terranafc.com" className="hover:underline">
                  contact@terranafc.com
                </a>
              </li>
              <li className="flex items-center gap-3 hover:text-[#07F468] transition-colors duration-300 group cursor-pointer">
                <Phone className="w-5 h-5 text-[#07F468] group-hover:scale-110 transition-transform" />
                <a href="tel:+212612345678" className="hover:underline">
                  +212 6 12 34 56 78
                </a>
              </li>
              <li className="flex items-center gap-3 hover:text-[#07F468] transition-colors duration-300 group cursor-pointer">
                <MapPin className="w-5 h-5 text-[#07F468] group-hover:scale-110 transition-transform" />
                <span>Fès, Maroc</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left text-gray-400 text-sm">
              © {new Date().getFullYear()} <span className="text-[#07F468]">Terrana FC</span>. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-400">
              <a href="/privacy" className="hover:text-[#07F468] transition-colors relative group">
                Privacy Policy
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#07F468] group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="/terms" className="hover:text-[#07F468] transition-colors relative group">
                Terms of Service
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#07F468] group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="/faq" className="hover:text-[#07F468] transition-colors relative group">
                FAQ
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#07F468] group-hover:w-full transition-all duration-300"></span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}


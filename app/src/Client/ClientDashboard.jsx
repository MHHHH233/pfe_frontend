"use client"
import { useState, useEffect } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Bell, Menu, User, Calendar, Trophy, Search, ChevronDown, ArrowRight, ChevronRight, Users, Star, Clock, MapPin, Shield, Mail, MailX, Phone, AlertCircle, X, InfoIcon, ChevronLeft, DollarSign } from 'lucide-react'
import LogoLight from "../img/logoLight.png"
import { Navigate, Route, useNavigate, useLocation } from "react-router-dom"
import tournament1 from "../img/tournament1.webp"
import tournament2 from "../img/tournament2.webp"
import tournament7 from "../img/tournament7.webp"
import reservationService from "../lib/services/admin/reservationServices"
import userService from '../lib/services/user/userServices'
import tournoiService from '../lib/services/user/tournoiService'
import playersService from '../lib/services/user/playersService'
import teamsService from '../lib/services/user/teamsService'
import tournoiTeamsService from '../lib/services/user/tournoiTeamsService'


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

export function TournamentsSection() {
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const location = useLocation();
  const path = location.pathname;
  // Helper to determine tournament status
  const getTournamentStatus = (tournament) => {
    if (!tournament.date_debut) return 'TBA';
    
    const now = new Date();
    const startDate = new Date(tournament.date_debut);
    const endDate = tournament.date_fin ? new Date(tournament.date_fin) : null;
    
    if (endDate && now > endDate) return 'Completed';
    if (now >= startDate) return 'In Progress';
    return 'Upcoming';
  };

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await tournoiService.getAllTournois();
        console.log('Tournaments API response:', response);
        
        // The API response has data in response.data
        if (response && response.data) {
          setTournaments(response.data);
        } else {
          setTournaments([]);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching tournaments:", err);
        setError("Failed to load tournaments");
        setLoading(false);
      }
    };

    fetchTournaments();
    
    // Cleanup function to ensure scrolling is restored when component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const openTournamentDetails = (tournament) => {
    setSelectedTournament(tournament);
    // Prevent scrolling when popup is open
    document.body.style.overflow = 'hidden';
  };

  const closeTournamentDetails = () => {
    setSelectedTournament(null);
    // Re-enable scrolling
    document.body.style.overflow = 'auto';
  };

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
            <p className="text-gray-400">Loading tournaments...</p>
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
            {/* Fallback to static data */}
            <button 
              onClick={() => {
                setError(null);
                // Display fallback data
                setTournaments([
                  {
                    id_tournoi: 1,
                    name: "Summer League Tournament",
                    capacite: 16,
                    date_debut: "2024-07-15",
                    date_fin: "2024-07-22",
                    type: "5v5",
                    description: "Annual summer football tournament featuring the best teams from around the region. Come and showcase your skills!",
                    image: tournament1
                  },
                  {
                    id_tournoi: 2,
                    name: "Winter Cup",
                    capacite: 32,
                    date_debut: "2024-12-01",
                    date_fin: "2024-12-15",
                    type: "7v7",
                    description: "The premier winter football competition with teams competing for the prestigious Winter Cup trophy.",
                    image: tournament2
                  },
                  {
                    id_tournoi: 3,
                    name: "Youth Championship",
                    capacite: 24,
                    date_debut: "2024-08-05",
                    date_fin: "2024-08-12",
                    type: "5v5",
                    description: "A tournament dedicated to young players under 18, offering a platform to showcase emerging talent.",
                    image: tournament7
                  }
                ]);
              }}
              className="mt-4 text-white bg-red-500/30 hover:bg-red-500/50 px-4 py-2 rounded-md text-sm"
            >
              Load Demo Data
            </button>
          </motion.div>
        ) : tournaments.length === 0 ? (
          <motion.div 
            className="text-gray-400 text-center py-6 px-4 bg-gray-800/30 border border-gray-700 rounded-lg max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="mb-3 flex justify-center">
              <Trophy className="h-8 w-8 text-gray-400" />
            </div>
            <p>No tournaments available at the moment.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tournaments.slice(0, 3).map((tournament, index) => {
              const status = getTournamentStatus(tournament);
              const tournamentImage = tournament.image || (index === 0 ? tournament1 : index === 1 ? tournament2 : tournament7);
              
              return (
                <motion.div 
                  key={tournament.id_tournoi || index}
                  className="bg-[#1a1a1a] rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-[#07F468]/10 border border-gray-800 hover:border-[#07F468]/30 group cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  onClick={() => openTournamentDetails(tournament)}
                >
                  <div className="relative overflow-hidden h-52">
                    <img 
                      src={tournamentImage} 
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
                        <p>{tournament.capacite || 'N/A'} Teams</p>
                      </div>
                      <div className="flex items-center text-sm text-gray-300">
                        <Calendar className="h-4 w-4 text-[#07F468] mr-2 flex-shrink-0" />
                        <p>Starts on {tournament.date_debut ? new Date(tournament.date_debut).toLocaleDateString() : 'TBA'}</p>
                      </div>
                      <div className="flex items-center text-sm text-gray-300">
                        <Trophy className="h-4 w-4 text-[#07F468] mr-2 flex-shrink-0" />
                        <p>Prize Pool: {tournament.award || tournament.frais_entree || 'TBA'}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                        status === 'In Progress'
                          ? "bg-[#07F468]/10 text-[#07F468] border border-[#07F468]/30" 
                          : status === 'Completed' 
                          ? "bg-red-500/10 text-red-400 border border-red-500/30"
                          : status === 'Upcoming'
                          ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                          : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30"
                      }`}>
                        {status}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
        
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
            onClick={() => {
              
              if (path === "/Client") {
                navigate("/tournoi");
              } 
              else if (path === "/all-tournaments") {
                navigate("/tournoi");
              }
              else {
                navigate("/all-tournaments");
              }
            }}
          >
            <span className="relative z-10">{path === "/all-tournaments" ? "Back to Tournaments" : "See More Tournaments"}</span>
            <ChevronRight className="ml-2 h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
            
            {/* Shine effect */}
            <div className="absolute top-0 -left-[100%] w-[250%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:left-[100%] transition-all duration-700 ease-in-out z-0"></div>
          </motion.button>
        </motion.div>

        {/* Popup for tournament details */}
        {selectedTournament && (
          <TournamentDetailsPopup
            tournament={selectedTournament}
            onClose={closeTournamentDetails}
          />
        )}
      </div>
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
              src={sessionStorage.getItem("pfp")} 
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
          <span className="mr-2 text-white">{userData.player?.rating || 'N/A'}</span>
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
  const sentRequests = player?.sent_requests || player?.sentRequests || [];
  const receivedRequests = player?.received_requests || player?.receivedRequests || [];
  
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
          Player Profile
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
            {/* Player Stats Overview */}
            <div className="mb-6">
              <div className="bg-[#1a1a1a] rounded-xl p-4 border border-gray-800 mb-4">
                <div className="flex items-center mb-3">
                  <div className="bg-[#07f468]/10 p-2 rounded-full mr-3">
                    <User className="h-5 w-5 text-[#07f468]" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Position: {player.position || 'Not set'}</h4>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-[#07f468] mr-1" fill="#07f468" />
                      <span className="text-gray-300 text-sm">{player.rating || '0'}/5 Rating</span>
                    </div>
                  </div>
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#252525] p-3 rounded-lg">
                    <p className="text-gray-400 text-xs mb-1">Total Matches</p>
                    <p className="text-white font-semibold">{player.total_matches || 0}</p>
                  </div>
                  <div className="bg-[#252525] p-3 rounded-lg">
                    <p className="text-gray-400 text-xs mb-1">Invites</p>
                    <p className="text-white font-semibold">
                      <span className="text-[#07f468]">{player.invites_accepted || 0}</span> / 
                      <span className="text-red-400">{player.invites_refused || 0}</span>
                    </p>
                  </div>
                </div>
                
                {/* Time availability */}
                <div className="mt-3 bg-[#252525] p-3 rounded-lg">
                  <p className="text-gray-400 text-xs mb-1">Availability</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 text-[#07f468] mr-1" />
                      <span className="text-white text-sm">{player.starting_time?.substring(0, 5) || '00:00'}</span>
                    </div>
                    <span className="text-gray-500">to</span>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 text-[#07f468] mr-1" />
                      <span className="text-white text-sm">{player.finishing_time?.substring(0, 5) || '00:00'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Requests Tabs */}
            <h4 className="font-medium text-white mb-3">Match Requests</h4>
            <div className="flex justify-center mb-4">
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
                  className="text-gray-400 text-center py-4"
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

function FindPlayersSection() {
  const Navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loadingPlayers, setLoadingPlayers] = useState(true);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [errorPlayers, setErrorPlayers] = useState(null);
  const [errorTeams, setErrorTeams] = useState(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await playersService.getAllPlayers({ limit: 5, sort: 'rating' });
        // Players data comes in response.data
        setPlayers(response.data || []);
        setLoadingPlayers(false);
      } catch (err) {
        console.error("Error fetching players:", err);
        setErrorPlayers("Failed to load players");
        setLoadingPlayers(false);
        // Set fallback data
        setPlayers([
          { id_player: 1, id_compte: 1, position: 'Forward', rating: 4.8, pfp: 'https://discuss.cakewalk.com/uploads/monthly_2024_03/imported-photo-22646.thumb.jpeg.34bfea5fe763a56356574f4c413f0f17.jpeg' },
          { id_player: 2, id_compte: 2, position: 'Midfielder', rating: 4.7, pfp: 'https://discuss.cakewalk.com/uploads/monthly_2024_03/imported-photo-22646.thumb.jpeg.34bfea5fe763a56356574f4c413f0f17.jpeg' },
          { id_player: 3, id_compte: 3, position: 'Defender', rating: 4.9, pfp: 'https://discuss.cakewalk.com/uploads/monthly_2024_03/imported-photo-22646.thumb.jpeg.34bfea5fe763a56356574f4c413f0f17.jpeg' },
        ]);
      }
    };

    const fetchTeams = async () => {
      try {
        const response = await teamsService.getAllTeams({ limit: 5, sort: 'rating' });
        // Teams data comes in response.data
        setTeams(response.data || []);
        setLoadingTeams(false);
      } catch (err) {
        console.error("Error fetching teams:", err);
        setErrorTeams("Failed to load teams");
        setLoadingTeams(false);
        // Set fallback data
        setTeams([
          { id_teams: 1, capitain: 1, rating: 4.9, logo: 'https://discuss.cakewalk.com/uploads/monthly_2024_03/imported-photo-22646.thumb.jpeg.34bfea5fe763a56356574f4c413f0f17.jpeg' },
          { id_teams: 2, capitain: 2, rating: 4.8, logo: 'https://discuss.cakewalk.com/uploads/monthly_2024_03/imported-photo-22646.thumb.jpeg.34bfea5fe763a56356574f4c413f0f17.jpeg' },
          { id_teams: 3, capitain: 3, rating: 4.7, logo: 'https://discuss.cakewalk.com/uploads/monthly_2024_03/imported-photo-22646.thumb.jpeg.34bfea5fe763a56356574f4c413f0f17.jpeg' },
        ]);
      }
    };

    fetchPlayers();
    fetchTeams();
  }, []);

  // Default placeholder images
  const defaultPlayerImg = 'https://discuss.cakewalk.com/uploads/monthly_2024_03/imported-photo-22646.thumb.jpeg.34bfea5fe763a56356574f4c413f0f17.jpeg';
  const defaultTeamLogo = 'https://discuss.cakewalk.com/uploads/monthly_2024_03/imported-photo-22646.thumb.jpeg.34bfea5fe763a56356574f4c413f0f17.jpeg';

  return (
    <section id="find-players" className="py-24 bg-gradient-to-b from-[#111] to-[#0a0a0a] relative">
      {/* Top gradient border */}
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
            className="text-4xl font-bold mb-3 inline-block relative text-white"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Top Rated
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
            Connect with the highest-rated players and teams in your area
          </motion.p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div 
            className="bg-[#1a1a1a] rounded-xl overflow-hidden shadow-lg border border-gray-800 hover:border-[#07F468]/30 transition-all duration-300 p-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-semibold mb-6 flex items-center">
              <Users className="w-6 h-6 mr-2 text-[#07f468]" />
              Top Players
            </h3>
            
            {loadingPlayers ? (
              <div className="flex justify-center items-center h-48">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full border-2 border-gray-800"></div>
                  <div className="absolute top-0 left-0 w-10 h-10 rounded-full border-t-2 border-l-2 border-[#07F468] animate-spin"></div>
                </div>
              </div>
            ) : players.length === 0 ? (
              <div className="text-gray-400 text-center py-8">
                <User className="w-10 h-10 mx-auto mb-3 text-gray-500" />
                <p>No players found</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {players.slice(0, 5).map((player) => (
                  <motion.li 
                    key={player.id_player} 
                    className="flex items-center justify-between bg-[#252525] hover:bg-[#2a2a2a] p-3 rounded-lg transition-colors"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    viewport={{ once: true }}
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-[#07f468]/30">
                        {player.pfp ? (
                          <img src={player.pfp} alt={`Player ${player.id_player}`} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-[#333] flex items-center justify-center">
                            <User className="w-5 h-5 text-[#07f468]" />
                          </div>
                        )}
                      </div>
                      <div className="ml-3">
                        <span className="font-medium text-white">Player #{player.id_player}</span>
                        {player.position && (
                          <p className="text-xs text-gray-400">{player.position}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center bg-[#07f468]/10 px-2 py-1 rounded-full">
                      <span className="mr-1 text-white text-sm">{player.rating || 'N/A'}</span>
                      <Star className="w-4 h-4 text-[#07f468]" fill="#07f468" />
                    </div>
                  </motion.li>
                ))}
              </ul>
            )}
          </motion.div>
          
          <motion.div 
            className="bg-[#1a1a1a] rounded-xl overflow-hidden shadow-lg border border-gray-800 hover:border-[#07F468]/30 transition-all duration-300 p-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-semibold mb-6 flex items-center">
              <Trophy className="w-6 h-6 mr-2 text-[#07f468]" />
              Top Teams
            </h3>
            
            {loadingTeams ? (
              <div className="flex justify-center items-center h-48">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full border-2 border-gray-800"></div>
                  <div className="absolute top-0 left-0 w-10 h-10 rounded-full border-t-2 border-l-2 border-[#07F468] animate-spin"></div>
                </div>
              </div>
            ) : teams.length === 0 ? (
              <div className="text-gray-400 text-center py-8">
                <Users className="w-10 h-10 mx-auto mb-3 text-gray-500" />
                <p>No teams found</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {teams.slice(0, 5).map((team) => (
                  <motion.li 
                    key={team.id_teams} 
                    className="flex items-center justify-between bg-[#252525] hover:bg-[#2a2a2a] p-3 rounded-lg transition-colors"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    viewport={{ once: true }}
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-[#07f468]/30">
                        {team.logo ? (
                          <img src={team.logo} alt={`Team ${team.id_teams}`} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-[#333] flex items-center justify-center">
                            <Users className="w-5 h-5 text-[#07f468]" />
                          </div>
                        )}
                      </div>
                      <span className="ml-3 font-medium text-white">Team #{team.id_teams}</span>
                    </div>
                    <div className="flex items-center bg-[#07f468]/10 px-2 py-1 rounded-full">
                      <span className="mr-1 text-white text-sm">{team.rating || '0'}</span>
                      <Star className="w-4 h-4 text-[#07f468]" fill="#07f468" />
                    </div>
                  </motion.li>
                ))}
              </ul>
            )}
          </motion.div>
        </div>
        
        <div className="mt-12 text-center">
          <motion.button
            className="bg-[#07f468] hover:bg-[#06d35a] text-[#1a1a1a] font-bold py-3 px-6 rounded-full text-lg transition-all duration-300 flex items-center mx-auto shadow-lg hover:shadow-[#07F468]/20 relative overflow-hidden group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => Navigate("/players")}
          >
            <span className="relative z-10">View All Players / Teams</span>
            <ChevronRight className="ml-2 h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
            
            {/* Shine effect */}
            <div className="absolute top-0 -left-[100%] w-[250%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:left-[100%] transition-all duration-700 ease-in-out z-0"></div>
          </motion.button>
        </div>
      </div>
    </section>
  );
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

// Add at the end of the file, right before the last export statement
function TournamentDetailsPopup({ tournament, onClose }) {
  const [registrationData, setRegistrationData] = useState({
    team_name: '',
    description: ''
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [userTeams, setUserTeams] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [hasRegisteredTeam, setHasRegisteredTeam] = useState(false);
  
  const navigate = useNavigate();

  // Helper to determine tournament status
  const getTournamentStatus = (tournament) => {
    if (!tournament.date_debut) return 'TBA';
    
    const now = new Date();
    const startDate = new Date(tournament.date_debut);
    const endDate = tournament.date_fin ? new Date(tournament.date_fin) : null;
    
    if (endDate && now > endDate) return 'Completed';
    if (now >= startDate) return 'In Progress';
    return 'Upcoming';
  };

  useEffect(() => {
    // Check if the user is already registered with a team in this tournament
    const checkRegistration = async () => {
      try {
        // We'd ideally fetch from the API to check registration status
        // For now, we'll just simulate this check
        
        // This is where we would check if the user is registered for this tournament
        // setHasRegisteredTeam(userIsRegistered);
      } catch (error) {
        console.error("Error checking registration status:", error);
      }
    };
    
    const fetchUserTeams = async () => {
      setLoadingTeams(true);
      try {
        // Get the current player ID
        const playerId = sessionStorage.getItem('player_id');
        if (!playerId) {
          setError("You need to create a player profile first");
          setLoadingTeams(false);
          return;
        }
        
        // Ideally fetch the user's teams from the API
        // const response = await teamsService.getUserTeams(playerId);
        // setUserTeams(response.data || []);
        
        // For now, set a test team or check if there's a team in sessionStorage
        const teamsData = sessionStorage.getItem('teams');
        if (teamsData) {
          try {
            const teams = JSON.parse(teamsData);
            setUserTeams(teams);
          } catch (e) {
            console.error("Error parsing teams data", e);
            setUserTeams([]);
          }
        } else {
          setUserTeams([]);
        }
      } catch (error) {
        console.error("Error fetching user teams:", error);
        setError("Failed to load your teams");
      } finally {
        setLoadingTeams(false);
      }
    };
    
    checkRegistration();
    fetchUserTeams();
  }, [tournament]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegistrationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClose = () => {
    if (!isRegistering) {
      onClose();
    }
  };

  const handleRegister = async () => {
    setIsRegistering(true);
    setError(null);
    
    try {
      // Get player ID
      const playerId = sessionStorage.getItem('player_id');
      if (!playerId) {
        setError("You need to create a player profile to register for tournaments");
        setIsRegistering(false);
        return;
      }
      
      // Check if we have team name
      if (!registrationData.team_name.trim()) {
        setError("Team name is required");
        setIsRegistering(false);
        return;
      }
      
      // Registration data with required id_teams field
      const data = {
        id_tournoi: tournament.id_tournoi,
        team_name: registrationData.team_name,
        descrption: registrationData.description || '', // Note the intentional typo in field name to match backend
        capitain: parseInt(playerId, 10),
        id_teams: userTeams.length > 0 ? userTeams[0].id_teams : null // Use existing team ID if available
      };
      
      console.log("Sending registration data:", data);
      
      // Call API to register
      const response = await tournoiTeamsService.registerForTournament(data);
      
      setSuccess(true);
      
      // Store team info
      if (response && response.data) {
        // Update team info in session storage or state as needed
        // Wait 2 seconds and then close the popup
        setTimeout(() => {
          onClose();
          // Optionally refresh data
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.error("Error registering for tournament:", error);
      
      // Handle specific error messages
      if (error.response && error.response.data) {
        if (error.response.data.error) {
          // Handle field validation errors
          if (typeof error.response.data.error === 'object') {
            const errMsg = Object.values(error.response.data.error)
              .flat()
              .join(", ");
            setError(errMsg);
          } else {
            setError(error.response.data.error);
          }
        } else if (error.response.data.message) {
          setError(error.response.data.message);
        } else {
          setError("Failed to register for tournament");
        }
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsRegistering(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4 backdrop-blur-sm overflow-y-auto"
      onClick={handleClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 50, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 50, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] rounded-xl overflow-hidden shadow-2xl max-w-md w-full mx-auto my-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <img
            src={tournament.image || tournament1}
            alt={tournament.name}
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
          
          {/* Top gradient border */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#07F468] to-transparent z-10"></div>
          
          <motion.button
            className="absolute top-3 right-3 text-white bg-black/40 hover:bg-black/60 p-2 rounded-full transition-colors z-20"
            onClick={handleClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            disabled={isRegistering}
          >
            <X className="w-5 h-5" />
          </motion.button>
          
          <div className="absolute bottom-4 left-4 right-4">
            <motion.h2 
              className="text-2xl font-bold text-white mb-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {tournament.name}
            </motion.h2>
            <motion.div 
              className="flex items-center text-xs text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Calendar className="w-3 h-3 mr-1 text-[#07F468]" />
              <span>{tournament.date_debut ? new Date(tournament.date_debut).toLocaleDateString() : 'TBD'}</span>
            </motion.div>
          </div>
        </div>
        
        <div className="p-5">
          <motion.div 
            className="grid grid-cols-2 gap-3 mb-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-[#1e1e1e] rounded-lg p-3 border border-gray-800 hover:border-[#07F468]/30 transition-all">
              <h3 className="text-xs font-medium text-gray-400 mb-1 flex items-center">
                <MapPin className="w-3 h-3 mr-1 text-[#07F468]" />
                Location
              </h3>
              <p className="text-white text-sm font-medium">{tournament.lieu || "Unspecified location"}</p>
            </div>
            
            <div className="bg-[#1e1e1e] rounded-lg p-3 border border-gray-800 hover:border-[#4a65ff]/30 transition-all">
              <h3 className="text-xs font-medium text-gray-400 mb-1 flex items-center">
                <Users className="w-3 h-3 mr-1 text-[#4a65ff]" />
                Tournament Type
              </h3>
              <p className="text-white text-sm font-medium">{tournament.type || "5v5"}</p>
            </div>
            
            <div className="bg-[#1e1e1e] rounded-lg p-3 border border-gray-800 hover:border-[#f7a307]/30 transition-all">
              <h3 className="text-xs font-medium text-gray-400 mb-1 flex items-center">
                <Trophy className="w-3 h-3 mr-1 text-[#f7a307]" />
                Prize
              </h3>
              <p className="text-white text-sm font-medium">{tournament.award || "To be announced"}</p>
            </div>
            
            <div className="bg-[#1e1e1e] rounded-lg p-3 border border-gray-800 hover:border-[#f45a07]/30 transition-all">
              <h3 className="text-xs font-medium text-gray-400 mb-1 flex items-center">
                <DollarSign className="w-3 h-3 mr-1 text-[#f45a07]" />
                Entry Fee
              </h3>
              <p className="text-white text-sm font-medium">{tournament.frais_entree || "Free"}</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="mb-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-sm font-semibold mb-2 flex items-center">
              <InfoIcon className="w-4 h-4 text-[#07F468] mr-2" />
              About This Tournament
            </h3>
            <p className="text-sm text-gray-300 bg-[#1e1e1e] p-3 rounded-lg border border-gray-800">
              {tournament.description || "Join us for an exciting soccer tournament featuring teams competing for glory and amazing prizes. Don't miss this opportunity to showcase your skills and enjoy a day of thrilling matches!"}
            </p>
          </motion.div>
          
          {success ? (
            <motion.div 
              className="bg-green-500/10 p-4 rounded-lg border border-green-500/30 text-center my-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Trophy className="h-10 w-10 text-green-500 mx-auto mb-2" />
              <h3 className="text-lg font-bold text-green-500 mb-1">Registration Successful!</h3>
              <p className="text-sm text-gray-300">Your team has been registered for this tournament.</p>
            </motion.div>
          ) : hasRegisteredTeam ? (
            <motion.div 
              className="mb-4 p-4 rounded-lg bg-green-500/10 border border-green-500/30"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                  <Users className="w-4 h-4 text-green-500" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-green-500">You're Registered</h3>
                  <p className="text-xs text-gray-300">Your team is already registered for this tournament</p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              className="mb-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-sm font-semibold mb-3 flex items-center">
                <Users className="w-4 h-4 text-[#07F468] mr-2" />
                Register Your Team
              </h3>
              
              {loadingTeams ? (
                <div className="flex justify-center items-center py-4">
                  <div className="w-8 h-8 border-2 border-[#07F468] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : userTeams.length === 0 ? (
                <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/30 mb-4">
                  <p className="text-sm text-blue-400 mb-2">You don't have a team yet</p>
                  <p className="text-xs text-gray-300 mb-3">You need to create a team profile before registering for tournaments.</p>
                  <motion.button 
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/players')}
                  >
                    Create a Team Profile
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/30 mb-4">
                    <p className="text-sm text-blue-400 mb-2">Using team: {userTeams[0].team_name || userTeams[0].name}</p>
                    <p className="text-xs text-gray-300">You'll register with your existing team.</p>
                  </div>
                  
                  <div>
                    <label htmlFor="team_name" className="block text-xs font-medium text-gray-300 mb-1">
                      Team Name for Tournament*
                    </label>
                    <input
                      type="text"
                      id="team_name"
                      name="team_name"
                      value={registrationData.team_name}
                      onChange={handleChange}
                      className="w-full p-3 bg-[#1e1e1e] text-white text-sm rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#07F468] focus:border-transparent transition-all"
                      placeholder={userTeams[0]?.team_name || userTeams[0]?.name || "Enter your team name"}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-xs font-medium text-gray-300 mb-1">
                      Team Description (Optional)
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={registrationData.description}
                      onChange={handleChange}
                      rows="3"
                      className="w-full p-3 bg-[#1e1e1e] text-white text-sm rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#07F468] focus:border-transparent transition-all"
                      placeholder="Tell us about your team"
                    ></textarea>
                  </div>
                </div>
              )}
            </motion.div>
          )}
          
          {error && (
            <div className="bg-red-500/10 p-3 rounded-lg border border-red-500/30 mb-4 text-sm text-red-400">
              {error}
            </div>
          )}
          
          {!success && !hasRegisteredTeam && userTeams.length > 0 && (
            <motion.button
              className="w-full bg-gradient-to-r from-[#07F468] to-[#06d35a] text-[#1a1a1a] border-none rounded-lg px-4 py-3 font-bold
              cursor-pointer transition-all duration-300 ease-in-out hover:from-[#06d35a] hover:to-[#07F468] shadow-lg hover:shadow-xl hover:shadow-[#07F468]/20 text-sm relative overflow-hidden"
              onClick={handleRegister}
              disabled={isRegistering || !registrationData.team_name.trim()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isRegistering ? (
                <div className="flex items-center justify-center">
                  <motion.div 
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Registering...
                </div>
              ) : (
                <>
                  <span className="relative z-10">Register Team</span>
                  {/* Shine effect */}
                  <div className="absolute top-0 -left-[100%] w-[250%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:left-[100%] transition-all duration-700 ease-in-out z-0"></div>
                </>
              )}
            </motion.button>
          )}
          
          {!success && (hasRegisteredTeam || userTeams.length === 0) && (
            <motion.button
              className="w-full mt-4 bg-white/10 text-white border-none rounded-lg px-4 py-3 font-bold
              cursor-pointer transition-all duration-300 ease-in-out hover:bg-white/20 text-sm"
              onClick={handleClose}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Close
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}


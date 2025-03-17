"use client"

import { useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Bell, Menu, User, Calendar, Trophy, Search, ChevronDown, ArrowRight, ChevronRight, Users, Star, Clock } from 'lucide-react'
import LogoLight from "../img/logoLight.png"
import { Navigate, Route, useNavigate } from "react-router-dom"
import tournament1 from "../img/tournament1.webp"
import tournament2 from "../img/tournament2.webp"
import tournament7 from "../img/tournament7.webp"
import reservationService from "../lib/services/admin/reservationServices"


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
    <div className="min-h-screen bg-[#1a1a1a] text-white">
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
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
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
      </div>
      <div className="relative z-10 text-center">
        <motion.h1 
          className="text-5xl md:text-7xl font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Welcome to Your Dashboard
        </motion.h1>
        <motion.p 
          className="text-xl md:text-2xl mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Manage your football journey with ease
        </motion.p>
        <motion.a
          href="#overview"
          className="bg-[#1DB954] hover:bg-[#1ed760] text-white font-bold py-3 px-6 rounded-full inline-flex items-center transition-colors duration-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Get Started
          <ArrowRight className="ml-2" />
        </motion.a>
      </div>
    </section>
  )
}

const OverviewSection = () => {
  const clientInfo = {
    name: sessionStorage.getItem("nom") + " " + sessionStorage.getItem("prenom"),
    email: sessionStorage.getItem("email"),
    memberSince: sessionStorage.getItem("date_inscription"),
  };

  const upcomingMatches = [
    { date: "2024-03-15", opponent: "FC Barcelona", time: "15:00" },
    { date: "2024-03-22", opponent: "Real Madrid", time: "18:30" },
  ];

  return (
    <section id="overview" className="py-24 bg-[#222] text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ProfileCard clientInfo={clientInfo} />
          {/* <UpcomingMatches matches={upcomingMatches} /> */}
          <Myreservations/>
          <QuickActions />
        </div>
      </div>
    </section>
  );
};

const ProfileCard = ({ clientInfo }) => {
  return (
    <motion.div 
      className="bg-[#333] rounded-xl p-6 flex flex-col items-center cursor-pointer hover:bg-[#444] transition-colors"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="w-24 h-24 bg-gradient-to-r from-[#07f468] to-[#06d35a] rounded-full flex items-center justify-center mb-4">
        <User className="w-12 h-12 text-[#1a1a1a]" />
      </div>
      <h3 className="text-xl font-semibold mb-1">{clientInfo.name}</h3>
      <p className="text-gray-300 mb-2">{clientInfo.email}</p>
      <p className="text-gray-300 mb-4">Member since: {clientInfo.memberSince}</p>
      <div className="flex items-center mb-4">
        <span className="mr-2">4.8</span>
        <Star className="w-5 h-5 text-[#07f468]" fill="#07f468" />
      </div>
      <button className="bg-[#07f468] text-[#1a1a1a] border-none rounded-full justify-center w-full py-2 px-4 text-sm font-bold uppercase tracking-wide 
        cursor-pointer transition-all duration-300 ease-in-out shadow-[0_4px_6px_rgba(7,_244,_104,_0.1)] hover:bg-[#06d35a] 
        hover:translate-y-[-2px] hover:shadow-[0_6px_12px_rgba(7,_244,_104,_0.2)] 
        active:translate-y-0 active:shadow-[0_2px_4px_rgba(7,_244,_104,_0.1)] flex items-center">
        View Profile
        <ArrowRight className="ml-2 w-4 h-4" />
      </button>
    </motion.div>
  );
};


const QuickActions = () => {
  const actions = [
    { name: "Make a Reservation", icon: Calendar,
      action: () => {
      const reservationSection = document.getElementById('reservation-section');
      if (reservationSection) {
        reservationSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  },
    { name: "Join a Tournament", icon: Trophy },
    { name: "Find Players/Teams", icon: Users },
    { name: "Your Reservations", icon: ArrowRight },
  ];

  return (
    <motion.div 
      className="bg-[#333] rounded-xl p-6 flex flex-col cursor-pointer hover:bg-[#444] transition-colors"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      viewport={{ once: true }}
    >
      <h3 className="text-xl text-center font-semibold mb-4">Quick Actions</h3>
      <div className="space-y-4">
        {actions.map((action, index) => (
          <button
            key={index}
            className="bg-[#07f468] text-[#1a1a1a] border-none rounded-full justify-center w-full h-12  py-4 px-6 text-sm font-bold uppercase tracking-wide 
            cursor-pointer transition-all duration-300 ease-in-out shadow-[0_4px_6px_rgba(7,_244,_104,_0.1)] hover:bg-[#06d35a] 
            hover:translate-y-[-2px] hover:shadow-[0_6px_12px_rgba(7,_244,_104,_0.2)] 
            active:translate-y-0 active:shadow-[0_2px_4px_rgba(7,_244,_104,_0.1)] flex items-center"
          >
            {action.icon != ArrowRight ? 
            <action.icon className="mr-2 w-4 h-4" />
            : "" }
            {action.name}
            {action.icon == ArrowRight ? 
            <action.icon className="mr-2 w-4 h-4" />
            : "" }
          </button>
        ))}
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
    <section id="tournaments" className="py-16 bg-[#222]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-8 text-center">Upcoming Tournaments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tournaments.map((tournament, index) => (
            <motion.div 
              key={index}
              className="bg-[#333] rounded-lg shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <img src={tournament.image} alt={tournament.name} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{tournament.name}</h3>
                <div className="flex items-center mb-2 text-sm text-gray-300">
                  <Users className="h-4 w-4 text-[#07f468] mr-2" />
                  <p>{tournament.teams} Teams</p>
                </div>
                <div className="flex items-center mb-2 text-sm text-gray-300">
                  <Calendar className="h-4 w-4 text-[#07f468] mr-2" />
                  <p>Starts on {tournament.startDate}</p>
                </div>
                <div className="flex items-center mb-4 text-sm text-gray-300">
                  <Trophy className="h-4 w-4 text-[#07f468] mr-2" />
                  <p>Prize Pool: {tournament.prize}</p>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    tournament.status === "Registration Open" 
                      ? "bg-[#07f468] bg-opacity-10 text-[#07f468]" 
                      : "bg-yellow-500 bg-opacity-10 text-yellow-500"
                  }`}>
                    {tournament.status}
                  </span>
                  <motion.button 
                    className="bg-[#07f468] hover:bg-[#06d35a] text-[#1a1a1a] font-bold py-2 px-4 rounded-full text-sm transition-colors duration-200 flex items-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={()=>Navigate("/tournoi")}

                  >
                    View Details
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <motion.button
            className="bg-[#07f468] hover:bg-[#06d35a] text-[#1a1a1a] font-bold py-3 px-6 rounded-full text-lg transition-colors duration-200 flex items-center mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={()=>Navigate("/tournoi")}
          >
            See More
            <ChevronRight className="ml-2 h-5 w-5" />
          </motion.button>
        </div>
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

const Myreservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const userId = sessionStorage.getItem("userId");
        if (!userId) {
          setError("User ID not found in session storage");
          setLoading(false);
          return;
        }
        
        const response = await reservationService.getReservation(userId);
        setReservations(Array.isArray(response) ? response : [response]);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching reservations:", err);
        setError("Failed to load reservations");
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  return (
    <motion.div 
      className="bg-[#333] rounded-xl p-6 flex flex-col cursor-pointer hover:bg-[#444] transition-colors"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      viewport={{ once: true }}
    >
      <h3 className="text-xl text-center font-semibold mb-4">My Reservations</h3>
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#07f468]"></div>
        </div>
      ) : error ? (
        <div className="text-red-400 text-center py-4">{error}</div>
      ) : reservations.length === 0 ? (
        <div className="text-gray-300 text-center py-4">No reservations found</div>
      ) : (
        <div className="space-y-4">
          {reservations.slice(0, 3).map((reservation, index) => (
            <div key={index} className="bg-[#444] rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{reservation.terrain?.nom || 'Unknown Field'}</span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  reservation.status === "confirmed" 
                    ? "bg-[#07f468] bg-opacity-10 text-[#07f468]" 
                    : reservation.status === "pending"
                    ? "bg-yellow-500 bg-opacity-10 text-yellow-500"
                    : "bg-red-500 bg-opacity-10 text-red-500"
                }`}>
                  {reservation.status || 'Pending'}
                </span>
              </div>
              <div className="text-sm text-gray-300">
                <div className="flex items-center mb-1">
                  <Calendar className="h-4 w-4 text-[#07f468] mr-2" />
                  <p>{new Date(reservation.date).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-[#07f468] mr-2" />
                  <p>{reservation.heure_debut} - {reservation.heure_fin}</p>
                </div>
              </div>
            </div>
          ))}
          
          {reservations.length > 3 && (
            <div className="text-center mt-2">
              <button className="text-[#07f468] hover:underline text-sm">
                View all ({reservations.length})
              </button>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

function Footer() {
  return (
    <footer className="bg-[#282828] border-t border-[#333]">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <img
              className="w-36 h-auto mb-4 transition-transform duration-300 hover:scale-105"
              src={LogoLight}
              alt="Logo"
            />
            <p className="text-gray-400">Empowering football enthusiasts with cutting-edge technology and seamless experiences.</p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-[#1DB954] transition-colors duration-200">Home</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#1DB954] transition-colors duration-200">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#1DB954] transition-colors duration-200">Services</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#1DB954] transition-colors duration-200">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-[#1DB954] transition-colors duration-200">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-[#1DB954] transition-colors duration-200">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-[#1DB954] transition-colors duration-200">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-[#333] pt-8">
          <p className="text-gray-400 text-sm text-center">&copy; 2024 Football Club. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}


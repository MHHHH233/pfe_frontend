"use client"

import { useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Bell, Menu, User, Calendar, Trophy, Search, ChevronDown, ArrowRight } from 'lucide-react'
import LogoLight from "../img/logoLight.png"
import Reservations from "../Main/Reservation"
import { Navigate } from "react-router-dom"

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
        <div className="text-black">
        <Reservations/>
        </div>
        <TournamentsSection />
        <FindPlayersSection />
      </main>
      <Footer />
    </div>
  )
}


function Header({ opacity, translateY, isMenuOpen, setIsMenuOpen }) {
  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 bg-[#1a1a1a] border-b border-[#333] transition-colors duration-300"
      style={{ opacity, translateY }}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <img
              className="w-28 h-auto transition-transform duration-300 hover:scale-105"
              src={LogoLight}
              alt="Logo"
            />
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <NavLink href="#overview">Overview</NavLink>
            <NavLink href="#reservation">Reservation</NavLink>
            <NavLink href="#tournaments">Tournaments</NavLink>
            <NavLink href="#find-players">Find Players</NavLink>
          </div>
          <div className="flex items-center">
            <button className="p-2 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1a1a1a] focus:ring-[#1DB954] transition-colors duration-200">
              <Bell className="h-6 w-6" />
            </button>
            <div className="ml-3 relative">
              <button
               className="bg-[#282828] flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1a1a1a] focus:ring-[#1DB954]">
                <img
                  className="h-8 w-8 rounded-full"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                />
              </button>
            </div>
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

function OverviewSection() {
  const clientInfo = {
    name: sessionStorage.getItem("nom")+" "+sessionStorage.getItem("prenom"),
    email: sessionStorage.getItem("email"),
    memberSince: sessionStorage.getItem("date_inscription"),
  }

  const upcomingMatches = [
    { date: "2024-03-15", opponent: "FC Barcelona", time: "15:00" },
    { date: "2024-03-22", opponent: "Real Madrid", time: "18:30" },
  ]

  return (
    <section id="overview" className="py-16 bg-[#282828]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-8">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ProfileCard clientInfo={clientInfo} />
          <UpcomingMatches matches={upcomingMatches} />
          <QuickActions />
        </div>
      </div>
    </section>
  )
}

function ProfileCard({ clientInfo }) {
  
  
  return (
    <motion.div 
      className="bg-[#1a1a1a] rounded-lg shadow-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="bg-gradient-to-r from-[#1DB954] to-[#1ed760] rounded-full p-3 mr-4">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">{clientInfo.name}</h3>
            <p className="text-gray-400">{clientInfo.email}</p>
          </div>
        </div>
        <p className="text-gray-400 mb-4">Member since: {clientInfo.memberSince}</p>
        <button
        type="submit"        
          className="w-full bg-[#1DB954] hover:bg-[#1ed760] text-white font-bold py-2 px-4 rounded transition-colors duration-200">
          View Profil
        </button>
      </div>
    </motion.div>
  );
}

function UpcomingMatches({ matches }) {
  return (
    <motion.div 
      className="bg-[#1a1a1a] rounded-lg shadow-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      viewport={{ once: true }}
    >
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-4">Upcoming Matches</h3>
        {matches.map((match, index) => (
          <div key={index} className="flex items-center mb-4 last:mb-0">
            <Calendar className="h-8 w-8 text-[#1DB954] mr-4" />
            <div>
              <p className="font-semibold">{match.opponent}</p>
              <p className="text-gray-400">{match.date} at {match.time}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function QuickActions() {
  const actions = [
    { name: "Make a Reservation", href: "#reservation" },
    { name: "Join a Tournament", href: "#tournaments" },
    { name: "Find Players/Teams", href: "#find-players" },
  ]

  return (
    <motion.div 
      className="bg-[#1a1a1a] rounded-lg shadow-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      viewport={{ once: true }}
    >
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
        <div className="space-y-4">
          {actions.map((action, index) => (
            <a
              key={index}
              href={action.href}
              className="block w-full text-center bg-[#1DB954] hover:bg-[#1ed760] text-white font-bold py-2 px-4 rounded transition-colors duration-200"
            >
              {action.name}
            </a>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function ReservationSection() {
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)

  const dates = ["2024-03-15", "2024-03-16", "2024-03-17", "2024-03-18", "2024-03-19"]
  const times = ["09:00", "11:00", "13:00", "15:00", "17:00", "19:00"]

  return (
    <section id="reservation" className="py-16 bg-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-8">Make a Reservation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div 
            className="bg-[#282828] rounded-lg shadow-lg p-6"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold mb-4">Select Date</h3>
            <div className="grid grid-cols-3 gap-4">
              {dates.map((date) => (
                <button
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`p-2 rounded ${
                    selectedDate === date
                      ? "bg-[#1DB954] text-white"
                      : "bg-[#333] text-gray-300 hover:bg-[#444]"
                  } transition-colors duration-200`}
                >
                  {date}
                </button>
              ))}
            </div>
          </motion.div>
          <motion.div 
            className="bg-[#282828] rounded-lg shadow-lg p-6"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold mb-4">Select Time</h3>
            <div className="grid grid-cols-3 gap-4">
              {times.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`p-2 rounded ${
                    selectedTime === time
                      ? "bg-[#1DB954] text-white"
                      : "bg-[#333] text-gray-300 hover:bg-[#444]"
                  } transition-colors duration-200`}
                >
                  {time}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
        <motion.div 
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <button 
            className="bg-[#1DB954] hover:bg-[#1ed760] text-white font-bold py-3 px-6 rounded-full inline-flex items-center transition-colors duration-200"
            disabled={!selectedDate || !selectedTime}
          >
            Confirm Reservation
            <ArrowRight className="ml-2" />
          </button>
        </motion.div>
      </div>
    </section>
  )
}

function TournamentsSection() {
  const tournaments = [
    {
      name: "Summer League Tournament",
      teams: 16,
      startDate: "July 15, 2024",
      status: "Registration Open"
    },
    {
      name: "Winter Cup",
      teams: 32,
      startDate: "December 1, 2024",
      status: "Coming Soon"
    },
    {
      name: "Youth Championship",
      teams: 24,
      startDate: "August 5, 2024",
      status: "Registration Open"
    }
  ]

  return (
    <section id="tournaments" className="py-16 bg-[#282828]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-8">Tournaments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tournaments.map((tournament, index) => (
            <motion.div 
              key={index}
              className="bg-[#1a1a1a] rounded-lg shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{tournament.name}</h3>
                <p className="text-gray-400 mb-4">{tournament.teams} Teams</p>
                <div className="flex items-center mb-4">
                  <Calendar className="h-5 w-5 text-[#1DB954] mr-2" />
                  <p className="text-gray-300">Starts on {tournament.startDate}</p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-[#1DB954] bg-opacity-10 text-[#1DB954]">
                    {tournament.status}
                  </span>
                  <button className="bg-[#1DB954] hover:bg-[#1ed760] text-white font-bold py-2 px-4 rounded transition-colors duration-200">
                    View Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FindPlayersSection() {
  const players = [
    { name: "Alex Johnson", position: "Forward", team: "Red Dragons" },
    { name: "Sarah Lee", position: "Midfielder", team: "Blue Sharks" },
    { name: "Mike Chen", position: "Defender", team: "Green Lions" },
    { name: "Emma Wilson", position: "Goalkeeper", team: "Purple Tigers" },
    { name: "Carlos Rodriguez", position: "Forward", team: "Yellow Eagles" },
    { name: "Olivia Brown", position: "Midfielder", team: "Orange Foxes" },
  ]

  return (
    <section id="find-players" className="py-16 bg-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-8">Find Players or Teams</h2>
        <motion.div 
          className="bg-[#282828] rounded-lg shadow-lg overflow-hidden mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-4">Search for Players or Teams</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-grow">
                <label htmlFor="search" className="sr-only">Search</label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="text"
                    name="search"
                    id="search"
                    className="block w-full bg-[#333] border border-[#444] rounded-md py-2 pl-10 pr-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1DB954] focus:border-[#1DB954] sm:text-sm transition-colors duration-200"
                    placeholder="Search by name, position, or team"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
              <button className="bg-[#1DB954] hover:bg-[#1ed760] text-white font-bold py-2 px-6 rounded-md transition-colors duration-200">
                Search
              </button>
            </div>
          </div>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {players.map((player, index) => (
            <motion.div 
              key={index}
              className="bg-[#282828] rounded-lg shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <User className="h-10 w-10 text-[#1DB954] mr-4" />
                  <div>
                    <h3 className="text-lg font-semibold">{player.name}</h3>
                    <p className="text-gray-400">{player.position}</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">Team: {player.team}</p>
                <button className="w-full bg-[#1DB954] hover:bg-[#1ed760] text-white font-bold py-2 px-4 rounded transition-colors duration-200">
                  View Profile
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

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


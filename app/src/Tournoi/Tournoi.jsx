'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import footbal from "../img/football-1350720_1920.webp"
import tournament1 from "../img/tournament1.webp"
import tournament2 from "../img/tournament2.webp"
import tournament3 from "../img/tournament3.webp"
import tournament4 from "../img/tournament4.webp"
import tournament5 from "../img/tournament5.webp"
import tournament6 from "../img/tournament6.webp"
import tournament7 from "../img/tournament7.webp"
import { toast } from 'react-hot-toast'
import { Search, Star, Filter, X, Calendar, Clock, Trophy, ChevronDown, Users, MapPin, DollarSign, Award, ClubIcon as Soccer, LocateIcon, LocateFixed, Locate, SearchCheckIcon, UserRoundSearch, Loader, PlusCircle, ChevronRight, InfoIcon } from 'lucide-react'
import tournoiService from '../lib/services/user/tournoiService'
import tournoiTeamsService from '../lib/services/user/tournoiTeamsService'
import matchesService from '../lib/services/user/matchesService'
import teamsService from '../lib/services/user/teamsService'
import TeamForm from './TeamForm'
import { Link, useNavigate } from 'react-router-dom'
import { TournamentsSection } from '../Client/ClientDashboard'
// Define an array of tournament images to use for tournaments that don't have their own images
const tournamentImages = [tournament1, tournament2, tournament3, tournament4, tournament5, tournament6, tournament7]

// Default match results for when API fails
const defaultMatchResults = [
  {
    id: 1,
    tournoi_name: "Summer League",
    team1_name: "FC Thunder",
    team2_name: "United Stars",
    score1: 3,
    score2: 2,
    match_date: "2024-05-15"
  },
  {
    id: 2,
    tournoi_name: "Championship Cup",
    team1_name: "Eagles FC",
    team2_name: "Phoenix Risers",
    score1: 1,
    score2: 1,
    match_date: "2024-05-14"
  },
  {
    id: 3,
    tournoi_name: "City Tournament",
    team1_name: "Sporting Club",
    team2_name: "Athletic Union",
    score1: 2,
    score2: 0,
    match_date: "2024-05-12"
  }
];

// Default tournaments for when API fails
const defaultTournaments = [
  {
    id_tournoi: 1,
    name: "Summer Championship",
    description: "Annual summer football tournament for amateur teams",
    date_debut: "2024-06-15",
    date_fin: "2024-07-10",
    capacite: 16,
    frais_entree: "$100",
    award: "$1000",
    type: "5v5"
  },
  {
    id_tournoi: 2,
    name: "City League Cup",
    description: "City-wide league competition for local clubs",
    date_debut: "2024-07-01",
    date_fin: "2024-08-30",
    capacite: 24,
    frais_entree: "$150",
    award: "$1500",
    type: "7v7"
  },
  {
    id_tournoi: 3,
    name: "Weekend Tournament",
    description: "Fast-paced weekend tournament with group stages and knockouts",
    date_debut: "2024-05-25",
    date_fin: "2024-05-26",
    capacite: 8,
    frais_entree: "$50",
    award: "$500",
    type: "5v5"
  }
];

function HeroSection({ searchQuery, setSearchQuery }) {
  return (
    <section className="relative h-[calc(100vh-170px)] pt-20 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          className="w-full h-full object-cover"
          src={footbal}
          alt="Football field"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/90"></div>
        
        {/* Animated overlay patterns */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <motion.div 
            className="absolute w-[500px] h-[500px] rounded-full border border-[#07f468]/30 top-1/2 left-1/4"
            initial={{ scale: 0.8, x: -100, y: -100 }}
            animate={{ scale: 1.2, x: 100, y: 100, opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          ></motion.div>
          <motion.div 
            className="absolute w-300px] h-[300px] rounded-full border border-[#07f468]/30 bottom-1/4 right-1/4"
            initial={{ scale: 1, x: 100, y: 100 }}
            animate={{ scale: 1.5, x: -100, y: -100, opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 15, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 2 }}
          ></motion.div>
        </div>
      </div>
      
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <motion.span 
            className="inline-block bg-[#07f468] text-[#1a1a1a] text-sm font-bold px-4 py-1.5 rounded-full mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ scale: 1.05, backgroundColor: "#06d35a" }}
          >
            Football Tournaments
          </motion.span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 text-white">
            Find Your <motion.span 
              className="text-[#07f468] inline-block"
              animate={{ 
                color: ["#07f468", "#0cf268", "#07f468"],
                textShadow: ["0 0 8px rgba(7, 244, 104, 0)", "0 0 12px rgba(7, 244, 104, 0.5)", "0 0 8px rgba(7, 244, 104, 0)"]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >Perfect Match</motion.span>
          </h1>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-gray-300 leading-relaxed"
        >
          Discover and join the most exciting soccer tournaments in your area. Compete with the best, showcase your skills, and win amazing prizes!
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative w-full max-w-xl mx-auto"
        >
          <motion.input
            type="text"
            placeholder="Search tournaments by name, location, or type..."
            className="w-full py-4 px-6 pr-14 rounded-full bg-white/10 backdrop-blur-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#07f468] shadow-lg text-base border border-white/20 focus:border-transparent transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            whileFocus={{ boxShadow: "0 0 0 3px rgba(7, 244, 104, 0.3)" }}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <motion.div
              className="bg-[#07f468] rounded-full p-2.5 cursor-pointer"
              whileHover={{ scale: 1.1, backgroundColor: "#06d35a" }}
              whileTap={{ scale: 0.95 }}
            >
              <Search className="text-[#1a1a1a] w-5 h-5" />
            </motion.div>
          </div>
        </motion.div>
        
        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <span className="text-sm text-gray-400 uppercase tracking-widest mb-2 font-light">Scroll Down</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <ChevronDown className="h-6 w-6 text-[#07f468]" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function StatsSection({ stats }) {
  return (
    <section className="py-12 bg-gradient-to-r from-[#1f1f1f] to-[#222] relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <motion.div 
          className="absolute w-64 h-64 rounded-full border border-[#07f468]/30 -bottom-20 -left-20"
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        ></motion.div>
        <motion.div 
          className="absolute w-96 h-96 rounded-full border border-[#07f468]/30 -top-40 -right-20"
          animate={{ rotate: -360 }}
          transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
        ></motion.div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <motion.div 
            className="bg-gradient-to-br from-[#333] to-[#272727] rounded-xl p-5 flex items-center shadow-lg border border-gray-800 hover:border-[#07f468]/20 transition-all overflow-hidden relative group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
          >
            <div className="w-14 h-14 rounded-full bg-[#07f468]/10 flex items-center justify-center mr-4 group-hover:bg-[#07f468]/20 transition-colors">
              <Soccer className="w-7 h-7 text-[#07f468]" />
            </div>
            <div>
              <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Active Tournaments</h3>
              <motion.p 
                className="text-2xl font-bold"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                viewport={{ once: true }}
              >
                {stats.activeTournaments}
              </motion.p>
            </div>
            
            {/* Accent line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#07f468] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </motion.div>
          
          <motion.div 
            className="bg-gradient-to-br from-[#333] to-[#272727] rounded-xl p-5 flex items-center shadow-lg border border-gray-800 hover:border-[#4a65ff]/20 transition-all overflow-hidden relative group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
          >
            <div className="w-14 h-14 rounded-full bg-[#4a65ff]/10 flex items-center justify-center mr-4 group-hover:bg-[#4a65ff]/20 transition-colors">
              <Users className="w-7 h-7 text-[#4a65ff]" />
            </div>
            <div>
              <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Registered Teams</h3>
              <motion.p 
                className="text-2xl font-bold"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
                viewport={{ once: true }}
              >
                {stats.registeredTeams}
              </motion.p>
            </div>
            
            {/* Accent line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#4a65ff] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </motion.div>
          
          <motion.div 
            className="bg-gradient-to-br from-[#333] to-[#272727] rounded-xl p-5 flex items-center shadow-lg border border-gray-800 hover:border-[#f7a307]/20 transition-all overflow-hidden relative group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
          >
            <div className="w-14 h-14 rounded-full bg-[#f7a307]/10 flex items-center justify-center mr-4 group-hover:bg-[#f7a307]/20 transition-colors">
              <Trophy className="w-7 h-7 text-[#f7a307]" />
            </div>
            <div>
              <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Prize Money</h3>
              <motion.p 
                className="text-2xl font-bold"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                viewport={{ once: true }}
              >
                {stats.totalPrizeMoney}
              </motion.p>
            </div>
            
            {/* Accent line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#f7a307] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </motion.div>
          
          <motion.div 
            className="bg-gradient-to-br from-[#333] to-[#272727] rounded-xl p-5 flex items-center shadow-lg border border-gray-800 hover:border-[#f45a07]/20 transition-all overflow-hidden relative group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
          >
            <div className="w-14 h-14 rounded-full bg-[#f45a07]/10 flex items-center justify-center mr-4 group-hover:bg-[#f45a07]/20 transition-colors">
              <Award className="w-7 h-7 text-[#f45a07]" />
            </div>
            <div>
              <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Champions Crowned</h3>
              <motion.p 
                className="text-2xl font-bold"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, type: "spring" }}
                viewport={{ once: true }}
              >
                {stats.championsCrowned}
              </motion.p>
            </div>
            
            {/* Accent line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#f45a07] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function TournamentCard({ tournament, onClick, isUserRegistered }) {
  // Generate a random image from the collection if tournament doesn't have an image
  const tournamentImage = tournament.image_url || tournamentImages[tournament.id_tournoi % tournamentImages.length];
  
  // Format date if available
  const formattedDate = tournament.date_debut ? new Date(tournament.date_debut).toLocaleDateString('fr-FR', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  }) : 'TBD';

  // Calculate days remaining until tournament
  const daysRemaining = tournament.date_debut ? 
    Math.max(0, Math.ceil((new Date(tournament.date_debut) - new Date()) / (1000 * 60 * 60 * 24))) : null;

  return (
    <motion.div
      className="bg-gradient-to-b from-[#333] to-[#2a2a2a] rounded-lg overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-all"
      onClick={onClick}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative">
      <img
          src={tournamentImage}
        alt={tournament.name}
          className="w-full h-40 object-cover"
        />
        <div className="absolute top-0 right-0 bg-[#07f468] text-[#1a1a1a] text-xs font-bold px-3 py-1 m-2 rounded-full">
          {tournament.type || "5v5"}
        </div>
        {daysRemaining !== null && (
          <div className="absolute bottom-0 left-0 bg-black bg-opacity-70 text-white text-xs px-3 py-1 m-2 rounded-full">
            {daysRemaining === 0 ? "Today!" : `${daysRemaining} days left`}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-3 line-clamp-1">{tournament.name}</h3>
        
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="flex items-center text-sm">
            <Calendar className="w-4 h-4 mr-1 text-[#07f468]" />
            <span className="text-gray-300 truncate">{formattedDate}</span>
          </div>
          <div className="flex items-center text-sm">
        <MapPin className="w-4 h-4 mr-1 text-[#07f468]" />
            <span className="text-gray-300 truncate">{tournament.lieu || "TBD"}</span>
      </div>
          <div className="flex items-center text-sm">
        <Users className="w-4 h-4 mr-1 text-[#07f468]" />
            <span className="text-gray-300">{tournament.teams_count || "0"} teams</span>
      </div>
          <div className="flex items-center text-sm">
        <Trophy className="w-4 h-4 mr-1 text-[#07f468]" />
            <span className="text-gray-300 truncate">Prize: {tournament.prix || "TBD"}</span>
          </div>
      </div>
        
        <button 
          className={`w-full rounded-md py-2 text-sm font-medium transition-colors ${
            isUserRegistered 
            ? "bg-green-500/20 text-green-500" 
            : "bg-[#07f468] bg-opacity-10 hover:bg-opacity-20 text-[#07f468]"
          }`}
          disabled={isUserRegistered}
        >
          {isUserRegistered ? "Joined" : "Join Tournament"}
        </button>
      </div>
    </motion.div>
  )
}

function TournamentModal({ tournament, onClose, onRegister, loading, isUserRegistered }) {
  const [formData, setFormData] = useState({
    team_name: '',
    description: ''
  });
  const [error, setError] = useState(null);

  // Generate a random image from the collection if tournament doesn't have an image
  const tournamentImage = tournament.image_url || tournamentImages[tournament.id_tournoi % tournamentImages.length]
  
  // Format date if available
  const formattedDate = tournament.date_debut ? new Date(tournament.date_debut).toLocaleDateString('fr-FR', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  }) : 'TBD';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      // Check if user has a player ID
      const playerId = sessionStorage.getItem('player_id');
      if (!playerId) {
        setError("You need to create a player profile first");
        return;
      }
      
      // Get the user's team ID (if available) from session storage
      const userTeams = [];
      const teamsData = sessionStorage.getItem('teams');
      let teamId = null;
      
      if (teamsData) {
        try {
          const parsedTeams = JSON.parse(teamsData);
          if (Array.isArray(parsedTeams) && parsedTeams.length > 0) {
            teamId = parsedTeams[0].id_teams;
          }
        } catch (error) {
          console.error("Error parsing teams data:", error);
        }
      }
      
      // Registration data with required id_teams field
      const registrationData = {
        id_tournoi: tournament.id_tournoi,
        team_name: formData.team_name,
        descrption: formData.description, // Note the intentional misspelling to match backend
        capitain: parseInt(playerId, 10),
        id_teams: teamId // This field is required by the backend
      };
      
      console.log("Sending registration data:", registrationData);
      
      // Call the registration service
      await tournoiService.registerTeam(registrationData);
      
      // Show success message and close modal
      onRegister();
      
      // Wait a bit before closing
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Registration error:", error);
      
      // Extract error message from response
      let errorMessage = "Failed to register for tournament";
      
      if (error.response && error.response.data) {
        if (error.response.data.error) {
          // Handle field validation errors
          if (typeof error.response.data.error === 'object') {
            const errMsg = Object.values(error.response.data.error)
              .flat()
              .join(", ");
            errorMessage = errMsg;
          } else {
            errorMessage = error.response.data.error;
          }
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }
      
      setError(errorMessage);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-[#1a1a1a] rounded-xl overflow-hidden shadow-xl max-w-md w-full mx-auto"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 400 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative">
            <img 
              src={tournamentImage}
              alt={tournament.name}
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent"></div>
            
            <button
              className="absolute top-3 right-3 text-white bg-black/40 hover:bg-black/60 p-2 rounded-full transition-colors z-10"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="text-2xl font-bold text-white">{tournament.name}</h2>
              <div className="flex items-center text-sm text-white/70">
                <Calendar className="w-4 h-4 mr-1 text-[#07f468]" />
                {formattedDate}
              </div>
            </div>
          </div>
          
          <div className="p-5">
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-[#262626] rounded-lg p-3">
                <h3 className="text-xs font-medium text-gray-400 mb-1">Type</h3>
                <p className="text-white font-medium">{tournament.type || "5v5"}</p>
              </div>
              
              <div className="bg-[#262626] rounded-lg p-3">
                <h3 className="text-xs font-medium text-gray-400 mb-1">Teams</h3>
                <p className="text-white font-medium">{tournament.capacite} max</p>
              </div>
              
              <div className="bg-[#262626] rounded-lg p-3">
                <h3 className="text-xs font-medium text-gray-400 mb-1">Entry Fee</h3>
                <p className="text-white font-medium">{tournament.frais_entree || "Free"}</p>
              </div>
              
              <div className="bg-[#262626] rounded-lg p-3">
                <h3 className="text-xs font-medium text-gray-400 mb-1">Prize</h3>
                <p className="text-white font-medium">{tournament.award || "TBA"}</p>
              </div>
            </div>
            
            <div className="mb-5">
              <h3 className="text-sm font-medium mb-2">Description</h3>
              <p className="text-sm text-gray-300 bg-[#262626] p-3 rounded-lg">
                {tournament.description || "Join us for this exciting tournament!"}
              </p>
            </div>
            
            {/* Display error message if there is one */}
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}
            
            {isUserRegistered ? (
              <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                    <Trophy className="w-4 h-4 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-green-500">You're Registered</h3>
                    <p className="text-xs text-gray-300">Your team is registered for this tournament</p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="team_name" className="block text-xs font-medium text-gray-300 mb-1">
                    Team Name *
                  </label>
                  <input
                    type="text"
                    id="team_name"
                    name="team_name"
                    value={formData.team_name}
                    onChange={handleChange}
                    className="w-full p-3 bg-[#262626] text-white rounded-lg border border-gray-700 focus:border-[#07f468] focus:ring-1 focus:ring-[#07f468] focus:outline-none"
                    placeholder="Enter your team name"
                    required
                  />
                </div>
                
                <div className="mb-5">
                  <label htmlFor="description" className="block text-xs font-medium text-gray-300 mb-1">
                    Team Description (Optional)
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full p-3 bg-[#262626] text-white rounded-lg border border-gray-700 focus:border-[#07f468] focus:ring-1 focus:ring-[#07f468] focus:outline-none"
                    placeholder="Tell us about your team"
                  ></textarea>
                </div>
                
                <motion.button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#07f468] to-[#06d35a] text-[#1a1a1a] border-none rounded-lg px-4 py-3 font-bold
                  cursor-pointer transition-all duration-300 ease-in-out hover:from-[#06d35a] hover:to-[#07f468] shadow-lg hover:shadow-xl hover:shadow-[#07f468]/20 text-sm relative overflow-hidden"
                  disabled={loading || !formData.team_name.trim()}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-[#1a1a1a] border-t-transparent rounded-full animate-spin mr-2"></div>
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
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function MatchResultCard({ result }) {
  return (
    <motion.div
      className="bg-gradient-to-br from-[#333] to-[#292929] rounded-lg p-4 overflow-hidden border border-gray-800 hover:border-[#07f468]/30 transition-all shadow-md"
      whileHover={{ scale: 1.02, y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-gradient-to-r from-[#2d2d2d] to-[#3a3a3a] rounded-lg p-3 mb-3 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-center mb-1 text-white">{result.tournoi_name || result.tournament}</h3>
        <div className="text-xs text-gray-400 text-center flex items-center justify-center">
          <Calendar className="w-3 h-3 mr-1" />
          {result.match_date || result.date}
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-[#07f468]/10 rounded-full flex items-center justify-center text-[#07f468]">
            <Trophy className="w-4 h-4" />
          </div>
          <span className="font-medium text-white">{result.team1_name || result.teamA}</span>
        </div>
        
        <div className="px-3 py-1 font-bold text-lg">
          {result.score1 || result.score?.split('-')[0] || 0}
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-[#07f468]/10 rounded-full flex items-center justify-center text-[#07f468]">
            <Trophy className="w-4 h-4" />
          </div>
          <span className="font-medium text-white">{result.team2_name || result.teamB}</span>
        </div>
        
        <div className="px-3 py-1 font-bold text-lg">
          {result.score2 || result.score?.split('-')[1] || 0}
        </div>
      </div>
    </motion.div>
  )
}

function StatsCard({ icon: Icon, title, value }) {
  return (
    <div className="bg-[#333] rounded-lg p-4 flex items-center">
      <Icon className="w-8 h-8 mr-3 text-[#07f468]" />
      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  )
}

function TournamentSection({ tournaments, isLoading, searchQuery, setSelectedTournament, userRegisteredTournaments }) {
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

  const filteredTournaments = tournaments.filter((tournament) =>
    tournament.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <motion.div 
        className="flex justify-center items-center h-64"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-2 border-gray-800"></div>
          <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-t-2 border-l-2 border-[#07f468] animate-spin"></div>
        </div>
        <p className="text-gray-400 ml-3">Loading tournaments...</p>
      </motion.div>
    );
  }

  if (filteredTournaments.length === 0) {
    return (
      <motion.div 
        className="text-center py-12 bg-[#333] rounded-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Search className="h-12 w-12 mx-auto text-gray-400 mb-2" />
        <p className="text-gray-400 mb-2">No tournaments found matching your search.</p>
        <p className="text-sm text-gray-500">Try adjusting your search criteria or check back later for new tournaments.</p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredTournaments.map((tournament, index) => {
        const status = getTournamentStatus(tournament);
        const tournamentImage = tournament.image_url || tournamentImages[tournament.id_tournoi % tournamentImages.length];
        
        return (
          <motion.div 
            key={tournament.id_tournoi || index}
            className="bg-[#1a1a1a] rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-[#07f468]/10 border border-gray-800 hover:border-[#07f468]/30 group cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            whileHover={{ y: -5 }}
            onClick={() => setSelectedTournament(tournament)}
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
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#07f468] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3 text-white">{tournament.name}</h3>
              
              <div className="space-y-2 mb-5">
                <div className="flex items-center text-sm text-gray-300">
                  <Users className="h-4 w-4 text-[#07f468] mr-2 flex-shrink-0" />
                  <p>{tournament.capacite || 'N/A'} Teams</p>
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <Calendar className="h-4 w-4 text-[#07f468] mr-2 flex-shrink-0" />
                  <p>Starts on {tournament.date_debut ? new Date(tournament.date_debut).toLocaleDateString() : 'TBA'}</p>
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <Trophy className="h-4 w-4 text-[#07f468] mr-2 flex-shrink-0" />
                  <p>Prize Pool: {tournament.prix || tournament.frais_entree || 'TBA'}</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                  status === 'In Progress'
                    ? "bg-[#07f468]/10 text-[#07f468] border border-[#07f468]/30" 
                    : status === 'Completed' 
                    ? "bg-red-500/10 text-red-400 border border-red-500/30"
                    : status === 'Upcoming'
                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                    : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30"
                }`}>
                  {status}
                </span>
                
                {userRegisteredTournaments && userRegisteredTournaments.includes(tournament.id_tournoi) && (
                  <span className="bg-green-500/10 text-green-400 border border-green-500/30 px-2.5 py-1 text-xs font-semibold rounded-full">
                    Registered
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function OrganizeTournamentSection() {
  const navigate = useNavigate();
  
  // Function to handle navigation and scroll to top
  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <section className="py-16 bg-gradient-to-b from-[#222] to-[#1a1a1a] relative">
      {/* Top gradient border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#07f468] to-transparent opacity-70"></div>
      
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-2xl md:text-3xl font-bold mb-3 inline-block relative"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Organize Your Own Tournament
            <motion.span
              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#07f468] to-[#34d399] rounded-full"
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
            Create and manage your own tournaments or find players for your team
          </motion.p>
        </motion.div>
        
        <div className="flex flex-col md:flex-row gap-8 justify-center">
          {/* Reserve a Field Card */}
          <motion.div
            className="bg-gradient-to-br from-[#272727] to-[#1e1e1e] rounded-xl overflow-hidden shadow-lg border border-gray-800 hover:border-[#07f468]/30 transition-all duration-300 w-full md:w-1/2 max-w-md"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            whileHover={{ y: -10, scale: 1.02 }}
          >
            <div className="h-40 bg-gradient-to-r from-[#07f468] to-[#05c052] flex items-center justify-center overflow-hidden relative group">
              <MapPin className="w-16 h-16 text-white/80 group-hover:scale-110 transition-transform duration-500" />
              
              {/* Animated circle patterns */}
              <motion.div 
                className="absolute w-64 h-64 rounded-full border-2 border-white/10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                animate={{ scale: [1, 1.2, 1], rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              ></motion.div>
              <motion.div 
                className="absolute w-48 h-48 rounded-full border-2 border-white/10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                animate={{ scale: [1.2, 1, 1.2], rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              ></motion.div>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-white">Reserve a Field</h3>
              <p className="mb-6 text-sm text-gray-300 leading-relaxed">
                Book your field for tournaments, practice sessions, or friendly matches. Our network includes the best fields in the city.
              </p>
              <div onClick={() => handleNavigation('/reservation')}>
                <motion.button
                  className="w-full bg-[#07f468] text-[#1a1a1a] border-none rounded-lg px-6 py-3 text-sm font-bold tracking-wide 
                  cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#06d35a] relative overflow-hidden group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10 flex items-center justify-center">
                    Reserve Now
                    <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                  
                  {/* Shine effect */}
                  <div className="absolute top-0 -left-[100%] w-[250%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:left-[100%] transition-all duration-700 ease-in-out z-0"></div>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Find Players/Teams Card */}
          <motion.div
            className="bg-gradient-to-br from-[#272727] to-[#1e1e1e] rounded-xl overflow-hidden shadow-lg border border-gray-800 hover:border-[#4a65ff]/30 transition-all duration-300 w-full md:w-1/2 max-w-md"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            whileHover={{ y: -10, scale: 1.02 }}
          >
            <div className="h-40 bg-gradient-to-r from-[#4a65ff] to-[#3f56d9] flex items-center justify-center overflow-hidden relative group">
              <UserRoundSearch className="w-16 h-16 text-white/80 group-hover:scale-110 transition-transform duration-500" />
              
              {/* Animated circle patterns */}
              <motion.div 
                className="absolute w-64 h-64 rounded-full border-2 border-white/10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                animate={{ scale: [1, 1.2, 1], rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              ></motion.div>
              <motion.div 
                className="absolute w-48 h-48 rounded-full border-2 border-white/10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                animate={{ scale: [1.2, 1, 1.2], rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              ></motion.div>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-white">Find Players & Teams</h3>
              <p className="mb-6 text-sm text-gray-300 leading-relaxed">
                Connect with players and teams in your area. Find teammates, opponents, or join existing teams for upcoming tournaments.
              </p>
              <div onClick={() => handleNavigation('/players')}>
                <motion.button
                  className="w-full bg-[#4a65ff] text-white border-none rounded-lg px-6 py-3 text-sm font-bold tracking-wide 
                  cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#3f56d9] relative overflow-hidden group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10 flex items-center justify-center">
                    Find Now
                    <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                  
                  {/* Shine effect */}
                  <div className="absolute top-0 -left-[100%] w-[250%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:left-[100%] transition-all duration-700 ease-in-out z-0"></div>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function TournamentPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTournament, setSelectedTournament] = useState(null)
  const [tournaments, setTournaments] = useState([])
  const [matchResults, setMatchResults] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    activeTournaments: 0,
    registeredTeams: 0,
    totalPrizeMoney: 0,
    championsCrowned: 0
  })
  const [registerLoading, setRegisterLoading] = useState(false)
  const [userRegisteredTournaments, setUserRegisteredTournaments] = useState([])
  const navigate = useNavigate();

  // Function to handle navigation and scroll to top
  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    fetchTournaments()
    fetchMatchResults()
    fetchUserRegisteredTournaments()
  }, [])

  const fetchTournaments = async () => {
    try {
      setIsLoading(true);
      const response = await tournoiService.getAllTournois();
      
      if (response && response.data) {
        // Format tournaments from the API response
        const tournaments = response.data.map(tournament => ({
          id_tournoi: tournament.id_tournoi,
          name: tournament.name,
          description: tournament.description,
          date_debut: tournament.date_debut,
          date_fin: tournament.date_fin,
          capacite: tournament.capacite,
          frais_entree: tournament.frais_entree,
          award: tournament.award,
          type: tournament.type,
          teams: tournament.teams || []
        }));
        
        setTournaments(tournaments);
        
        // Update stats
        setStats({
          activeTournaments: tournaments.length,
          registeredTeams: tournaments.reduce((acc, curr) => acc + (curr.teams?.length || 0), 0),
          totalPrizeMoney: "$" + tournaments.reduce((acc, curr) => acc + (parseFloat(curr.award) || 0), 0).toFixed(2),
          championsCrowned: Math.floor(Math.random() * 30) // This would ideally come from the API
        });
      } else {
        // Fall back to demo data if API returns empty result
        setTournaments(defaultTournaments);
        
        // Update stats with default data
        setStats({
          activeTournaments: defaultTournaments.length,
          registeredTeams: 24,
          totalPrizeMoney: "$2,500",
          championsCrowned: 8
        });
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching tournaments:', error);
      setTournaments(defaultTournaments);
      
      // Update stats with default data on error
      setStats({
        activeTournaments: defaultTournaments.length,
        registeredTeams: 24,
        totalPrizeMoney: "$2,500",
        championsCrowned: 8
      });
      
      setIsLoading(false);
    }
  };

  const fetchUserRegisteredTournaments = async () => {
    try {
      const userId = sessionStorage.getItem("userId");
      
      if (!userId) {
        return; // User not logged in
      }
      
      // Here we would fetch from API the tournaments the user is registered for
      // For now, let's simulate with local query to the tournaments we already have
      const result = await tournoiTeamsService.getUserRegisteredTournaments();
      
      if (result.data && Array.isArray(result.data)) {
        const registeredTournamentIds = result.data.map(registration => registration.id_tournoi);
        setUserRegisteredTournaments(registeredTournamentIds);
      }
    } catch (error) {
      console.error('Failed to fetch user registered tournaments:', error)
      // Don't show error toast as this is a background operation
    }
  }

  const fetchMatchResults = async () => {
    try {
      const result = await matchesService.getAllMatches({
        include: 'tournoi,team1,team2',
        sort_by: 'match_date',
        sort_order: 'desc',
        limit: 6 // Limit to 6 matches
      });
      
      if (result.data && result.data.length > 0) {
        const formattedMatches = result.data.map(match => ({
          id: match.id_match,
          tournoi_name: match.tournoi?.name || 'Unknown Tournament',
          team1_name: match.team1?.team_name || 'Team A',
          team2_name: match.team2?.team_name || 'Team B',
          score1: match.score_team1 || 0,
          score2: match.score_team2 || 0,
          match_date: match.match_date ? new Date(match.match_date).toLocaleDateString() : 'Unknown date'
        }));
        setMatchResults(formattedMatches);
      } else {
        setMatchResults(defaultMatchResults);
      }
    } catch (error) {
      console.error('Failed to fetch match results:', error);
      setMatchResults(defaultMatchResults);
    }
  };

  const handleRegisterTeam = async (formData) => {
    setRegisterLoading(true);
    try {
      // Get player ID from session storage for captain field
      const playerId = sessionStorage.getItem("player_id");
      
      if (!playerId) {
        toast.error("You must create a player profile before registering for a tournament");
        setRegisterLoading(false);
        return;
      }
      
      // Check if user is already registered for this tournament
      if (userRegisteredTournaments.includes(selectedTournament.id_tournoi)) {
        toast.error("You're already registered for this tournament");
        setRegisterLoading(false);
        return;
      }
      
      // Get the user's team ID (required by the backend)
      const teamsData = sessionStorage.getItem('teams');
      let teamId = null;
      
      if (teamsData) {
        try {
          const parsedTeams = JSON.parse(teamsData);
          if (Array.isArray(parsedTeams) && parsedTeams.length > 0) {
            teamId = parsedTeams[0].id_teams;
          }
        } catch (error) {
          console.error("Error parsing teams data:", error);
        }
      }
      
      if (!teamId) {
        toast.error("You must be part of a team before registering for a tournament");
        setRegisterLoading(false);
        return;
      }
      
      // Register team with required fields matching backend validation
      const registerData = {
        id_tournoi: selectedTournament.id_tournoi,
        id_teams: teamId,
        team_name: formData.team_name,
        capitain: parseInt(playerId, 10) // Not required by backend but keeping it
      };
      
      const response = await tournoiTeamsService.registerForTournament(registerData);
      
      toast.success(response.message || "Successfully registered for the tournament!");
      
      // Update local state to reflect the registration
      setUserRegisteredTournaments(prev => [...prev, selectedTournament.id_tournoi]);
      
      setSelectedTournament(null);
      
      // Refresh tournaments to update the count
      fetchTournaments();
    } catch (error) {
      console.error('Failed to register team:', error);
      let errorMessage = 'Failed to register team';
      
      if (error.response?.data?.error) {
        if (typeof error.response.data.error === 'object') {
          errorMessage = Object.values(error.response.data.error).flat().join(", ");
        } else {
          errorMessage = error.response.data.error;
        }
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setRegisterLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white font-sans">
      {/* Hero Section */}
      <HeroSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Stats Section */}
      <StatsSection stats={stats} />

      {/* Tournaments Section - Using imported component */}
      <TournamentsSection />

      {/* Enhanced Match Results Section */}
      <section className="py-12 bg-[#222]">
        <div className="container mx-auto px-4">
          <motion.div 
            className="flex justify-between items-center mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h2 
              className="text-2xl md:text-3xl font-bold relative inline-block"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Recent Match Results
              <motion.span
                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#07f468] to-[#34d399] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8, delay: 0.2 }}
              ></motion.span>
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <button 
                className="text-sm text-[#07f468] hover:underline flex items-center group"
                onClick={() => handleNavigation("/all-matches")}
              >
                View All Matches
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
          
          {matchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {matchResults.map((result, index) => (
                <MatchResultCard key={result.id || index} result={result} />
              ))}
            </div>
          ) : (
            <motion.div 
              className="text-center py-12 bg-[#333] rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Trophy className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-400">No match results available yet.</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Create Tournament Section */}
      <OrganizeTournamentSection />

      {/* Tournament Modal */}
      <AnimatePresence>
        {selectedTournament && (
          <TournamentModal
            tournament={selectedTournament}
            onClose={() => setSelectedTournament(null)}
            onRegister={handleRegisterTeam}
            loading={registerLoading}
            isUserRegistered={userRegisteredTournaments.includes(selectedTournament.id_tournoi)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}


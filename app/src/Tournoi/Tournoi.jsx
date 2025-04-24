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
import { Search, Star, Filter, X, Calendar, Clock, Trophy, ChevronDown, Users, MapPin, DollarSign, Award, ClubIcon as Soccer, LocateIcon, LocateFixed, Locate, SearchCheckIcon, UserRoundSearch, Loader, PlusCircle } from 'lucide-react'
import tournoiService from '../lib/services/user/tournoiService'
import tournoiTeamsService from '../lib/services/user/tournoiTeamsService'
import matchesService from '../lib/services/user/matchesService'
import teamsService from '../lib/services/user/teamsService'
import TeamForm from './TeamForm'
import { Link } from 'react-router-dom'

// Fallback images for tournaments that don't have images
const tournamentImages = [tournament1, tournament2, tournament3, tournament4, tournament5, tournament6, tournament7]

// Default match results to show if no matches are available from API
const defaultMatchResults = [
  { id: 1, tournament: 'Spring Classic', teamA: 'Team Alpha', teamB: 'Team Beta', score: '3-2', date: '2023-05-15' },
  { id: 2, tournament: 'Summer Cup', teamA: 'Team Gamma', teamB: 'Team Delta', score: '2-1', date: '2023-06-22' },
  { id: 3, tournament: 'Fall Championship', teamA: 'Team Epsilon', teamB: 'Team Zeta', score: '4-3', date: '2023-09-10' },
]

function HeroSection({ searchQuery, setSearchQuery }) {
  return (
    <section className="relative h-[calc(100vh-170px)] pt-20 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          className="w-full h-full object-cover"
          src={footbal}
          alt="Football field"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80"></div>
      </div>
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-4"
        >
          <span className="inline-block bg-[#07f468] text-[#1a1a1a] text-sm font-bold px-4 py-1 rounded-full mb-4">
            Soccer Tournaments
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 text-white">
            Find Your <span className="text-[#07f468]">Perfect Match</span>
          </h1>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-gray-300"
        >
          Discover and join the most exciting soccer tournaments in your area. Compete with the best, showcase your skills, and win amazing prizes!
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative w-full max-w-xl mx-auto"
        >
          <input
            type="text"
            placeholder="Search tournaments by name, location, or type..."
            className="w-full py-4 px-6 rounded-full bg-white/10 backdrop-blur-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#07f468] shadow-lg text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-[#07f468] rounded-full p-2">
            <Search className="text-[#1a1a1a] w-5 h-5" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function StatsSection({ stats }) {
  return (
    <section className="py-12 bg-gradient-to-r from-[#1f1f1f] to-[#222]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <motion.div 
            className="bg-gradient-to-br from-[#333] to-[#272727] rounded-lg p-5 flex items-center shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="w-12 h-12 rounded-full bg-[#07f468]/20 flex items-center justify-center mr-4">
              <Soccer className="w-6 h-6 text-[#07f468]" />
            </div>
            <div>
              <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Active Tournaments</h3>
              <p className="text-2xl font-bold">{stats.activeTournaments}</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-gradient-to-br from-[#333] to-[#272727] rounded-lg p-5 flex items-center shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-12 h-12 rounded-full bg-[#4a65ff]/20 flex items-center justify-center mr-4">
              <Users className="w-6 h-6 text-[#4a65ff]" />
            </div>
            <div>
              <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Registered Teams</h3>
              <p className="text-2xl font-bold">{stats.registeredTeams}</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-gradient-to-br from-[#333] to-[#272727] rounded-lg p-5 flex items-center shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="w-12 h-12 rounded-full bg-[#f7a307]/20 flex items-center justify-center mr-4">
              <Trophy className="w-6 h-6 text-[#f7a307]" />
            </div>
            <div>
              <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Prize Money</h3>
              <p className="text-2xl font-bold">{stats.totalPrizeMoney}</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-gradient-to-br from-[#333] to-[#272727] rounded-lg p-5 flex items-center shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="w-12 h-12 rounded-full bg-[#f45a07]/20 flex items-center justify-center mr-4">
              <Award className="w-6 h-6 text-[#f45a07]" />
            </div>
            <div>
              <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Champions Crowned</h3>
              <p className="text-2xl font-bold">{stats.championsCrowned}</p>
            </div>
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

  const handleRegister = async () => {
    if (!formData.team_name.trim()) {
      toast.error("Team name is required");
      return;
    }
    
    // Call the parent component's handler with the form data
    onRegister(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        className="bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] rounded-lg overflow-hidden shadow-2xl max-w-md w-full mx-auto my-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <img
            src={tournamentImage}
            alt={tournament.name}
            className="w-full h-40 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <button
            className="absolute top-2 right-2 text-white bg-black/40 hover:bg-black/60 p-2 rounded-full transition-colors"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-xl font-bold text-white mb-1">{tournament.name}</h2>
            <div className="flex items-center text-xs text-gray-300">
              <Calendar className="w-3 h-3 mr-1 text-[#07f468]" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-[#333] rounded-lg p-2">
              <h3 className="text-xs font-medium text-gray-400 mb-1">Location</h3>
              <div className="flex items-center">
                <MapPin className="w-3 h-3 mr-1 text-[#07f468]" />
                <span className="text-xs">{tournament.lieu || "Unspecified location"}</span>
              </div>
            </div>
            <div className="bg-[#333] rounded-lg p-2">
              <h3 className="text-xs font-medium text-gray-400 mb-1">Tournament Type</h3>
              <div className="flex items-center">
                <Users className="w-3 h-3 mr-1 text-[#4a65ff]" />
                <span className="text-xs">{tournament.type || "5v5"}</span>
              </div>
            </div>
            <div className="bg-[#333] rounded-lg p-2">
              <h3 className="text-xs font-medium text-gray-400 mb-1">Prize</h3>
              <div className="flex items-center">
                <Trophy className="w-3 h-3 mr-1 text-[#f7a307]" />
                <span className="text-xs">{tournament.prix || "To be announced"}</span>
              </div>
            </div>
            <div className="bg-[#333] rounded-lg p-2">
              <h3 className="text-xs font-medium text-gray-400 mb-1">Entry Fee</h3>
              <div className="flex items-center">
                <DollarSign className="w-3 h-3 mr-1 text-[#f45a07]" />
                <span className="text-xs">{tournament.frais_entree || "Free"}</span>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <h3 className="text-sm font-semibold mb-1">About This Tournament</h3>
            <p className="text-xs text-gray-300">
              {tournament.description || "Join us for an exciting soccer tournament featuring teams competing for glory and amazing prizes. Don't miss this opportunity to showcase your skills and enjoy a day of thrilling matches!"}
            </p>
          </div>

          {isUserRegistered ? (
            <div className="mb-4 p-4 rounded-lg bg-green-500/10 border border-green-500/30">
              <div className="flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                  <Users className="w-4 h-4 text-green-500" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-green-500">You're Registered</h3>
                  <p className="text-xs text-gray-300">Your team is already registered for this tournament</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Team Creation Form */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2 flex items-center">
                  <Users className="w-4 h-4 text-[#07f468] mr-1" />
                  Register Your Team
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <label htmlFor="team_name" className="block text-xs font-medium text-gray-300 mb-1">
                      Team Name*
                    </label>
                    <input
                      type="text"
                      id="team_name"
                      name="team_name"
                      value={formData.team_name}
                      onChange={handleChange}
                      className="w-full p-2 bg-[#333] text-white text-sm rounded-lg border border-[#444] focus:outline-none focus:ring-2 focus:ring-[#07f468] focus:border-transparent"
                      placeholder="Enter your team name"
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
                      value={formData.description}
                      onChange={handleChange}
                      rows="2"
                      className="w-full p-2 bg-[#333] text-white text-sm rounded-lg border border-[#444] focus:outline-none focus:ring-2 focus:ring-[#07f468] focus:border-transparent"
                      placeholder="Tell us about your team"
                    ></textarea>
                  </div>
                </div>
              </div>

              <button
                className="w-full bg-gradient-to-r from-[#07f468] to-[#06d35a] text-[#1a1a1a] border-none rounded-lg px-4 py-3 font-bold
                cursor-pointer transition-all duration-300 ease-in-out hover:from-[#06d35a] hover:to-[#07f468] shadow-lg hover:shadow-xl hover:shadow-[#07f468]/20 text-sm"
                onClick={handleRegister}
                disabled={loading || !formData.team_name.trim()}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loader className="w-4 h-4 animate-spin mr-2" />
                    Registering...
                  </div>
                ) : (
                  "Register Team"
                )}
              </button>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

function MatchResultCard({ result }) {
  return (
    <motion.div
      className="bg-[#333] rounded-lg p-4 overflow-hidden"
      whileHover={{ scale: 1.02 }}
    >
      <div className="bg-[#3a3a3a] rounded p-2 mb-2">
        <h3 className="text-lg font-semibold text-center mb-1">{result.tournoi_name || result.tournament}</h3>
        <div className="text-xs text-gray-400 text-center">{result.match_date || result.date}</div>
      </div>
      <div className="flex justify-between items-center text-sm">
        <div className="flex-1 text-center">
          <div className="font-semibold mb-1">{result.team1_name || result.teamA}</div>
          <div className="text-2xl font-bold">{result.score1 || result.score?.split('-')[0] || 0}</div>
        </div>
        <div className="px-4">
          <span className="text-[#07f468] font-bold text-xs">VS</span>
        </div>
        <div className="flex-1 text-center">
          <div className="font-semibold mb-1">{result.team2_name || result.teamB}</div>
          <div className="text-2xl font-bold">{result.score2 || result.score?.split('-')[1] || 0}</div>
        </div>
      </div>
      <div className="mt-3 pt-2 border-t border-[#444] flex justify-center">
        <button className="text-xs text-[#07f468] hover:underline">View Match Details</button>
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
  const filteredTournaments = tournaments.filter((tournament) =>
    tournament.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="w-10 h-10 animate-spin text-[#07f468]" />
      </div>
    );
  }

  if (filteredTournaments.length === 0) {
    return (
      <div className="text-center py-12 bg-[#333] rounded-lg">
        <Search className="h-12 w-12 mx-auto text-gray-400 mb-2" />
        <p className="text-gray-400 mb-2">No tournaments found matching your search.</p>
        <p className="text-sm text-gray-500">Try adjusting your search criteria or check back later for new tournaments.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredTournaments.map((tournament) => (
        <TournamentCard
          key={tournament.id_tournoi}
          tournament={tournament}
          onClick={() => setSelectedTournament(tournament)}
          isUserRegistered={userRegisteredTournaments.includes(tournament.id_tournoi)}
        />
      ))}
    </div>
  );
}

function OrganizeTournamentSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-[#222] to-[#1a1a1a]">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Organize Your Own Tournament</h2>
        
        <div className="flex flex-col md:flex-row gap-6 justify-center">
          {/* Reserve a Field Card */}
          <motion.div
            className="bg-gradient-to-br from-[#333] to-[#272727] rounded-lg overflow-hidden shadow-lg cursor-pointer w-full md:max-w-md"
            whileHover={{ y: -5 }}
          >
            <div className="h-32 bg-gradient-to-r from-[#07f468] to-[#05c052] flex items-center justify-center">
              <MapPin className="w-12 h-12 text-white" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Reserver un terrain</h3>
              <p className="mb-6 text-sm text-gray-300">
                Book your field for tournaments, practice sessions, or friendly matches. Our network includes the best fields in the city.
              </p>
              <Link to='/reservation'>
              <button
                className="w-full bg-[#07f468] text-[#1a1a1a] border-none rounded-md px-6 py-3 text-sm font-bold uppercase tracking-wide 
                cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#06d35a]"
              >
                Reserve Maintenant
              </button>
              </Link>
            </div>
          </motion.div>

          {/* Find Players/Teams Card */}
          <motion.div
            className="bg-gradient-to-br from-[#333] to-[#272727] rounded-lg overflow-hidden shadow-lg cursor-pointer w-full md:max-w-md"
            whileHover={{ y: -5 }}
          >
            <div className="h-32 bg-gradient-to-r from-[#4a65ff] to-[#3f56d9] flex items-center justify-center">
              <UserRoundSearch className="w-12 h-12 text-white" />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Trouver des Joueurs / Equipes</h3>
              <p className="mb-6 text-sm text-gray-300">
                Connect with players and teams in your area. Find teammates, opponents, or join existing teams for upcoming tournaments.
              </p>
              <button
                className="w-full bg-[#4a65ff] text-white border-none rounded-md px-6 py-3 text-sm font-bold uppercase tracking-wide 
                cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#3f56d9]"
              >
                Chercher Maintenant
              </button>
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

  useEffect(() => {
    fetchTournaments()
    fetchMatchResults()
    fetchUserRegisteredTournaments()
  }, [])

  const fetchTournaments = async () => {
    setIsLoading(true)
    try {
      const result = await tournoiService.getAllTournois({
        include: 'teams',
        sort_by: 'date_debut',
        sort_order: 'asc'
      })
      setTournaments(result.data || [])
      
      // Update stats
      setStats({
        activeTournaments: (result.data || []).length,
        registeredTeams: (result.data || []).reduce((acc, curr) => acc + (curr.teams_count || 0), 0),
        totalPrizeMoney: "$" + (result.data || []).reduce((acc, curr) => acc + (Number(curr.prix) || 0), 0),
        championsCrowned: Math.floor(Math.random() * 30) // This would ideally come from the API
      })
    } catch (error) {
      console.error('Failed to fetch tournaments:', error)
      toast.error('Failed to load tournaments')
    } finally {
      setIsLoading(false)
    }
  }

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
        paginationSize: 3
      })
      
      if (result.data && result.data.length > 0) {
        const formattedMatches = result.data.map(match => ({
          id: match.id,
          tournoi_name: match.tournoi?.name || 'Unknown Tournament',
          team1_name: match.team1?.name || 'Team A',
          team2_name: match.team2?.name || 'Team B',
          score1: match.score1 || 0,
          score2: match.score2 || 0,
          match_date: match.match_date
        }))
        setMatchResults(formattedMatches)
      } else {
        setMatchResults(defaultMatchResults)
      }
    } catch (error) {
      console.error('Failed to fetch match results:', error)
      setMatchResults(defaultMatchResults)
    }
  }

  const handleRegisterTeam = async (formData) => {
    setRegisterLoading(true);
    try {
      // Get user ID from session storage for captain field
      const userId = sessionStorage.getItem("userId");
      
      if (!userId) {
        toast.error("You must be logged in to register for a tournament");
        setRegisterLoading(false);
        return;
      }
      
      // Check if user is already registered for this tournament
      if (userRegisteredTournaments.includes(selectedTournament.id_tournoi)) {
        toast.error("You're already registered for this tournament");
        setRegisterLoading(false);
        return;
      }
      
      // Register directly for the tournament with the correct field names from migration
      const registerData = {
        id_tournoi: selectedTournament.id_tournoi,
        team_name: formData.team_name,
        descrption: formData.description || '',  // Note the intentional typo to match the database field
        capitain: userId // Set the logged-in user as captain
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
      toast.error(error.response?.data?.message || 'Failed to register team');
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

      {/* Tournaments Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Upcoming Tournaments</h2>
            <button className="text-sm text-[#07f468] hover:underline flex items-center">
              View Calendar
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <TournamentSection 
            tournaments={tournaments} 
            isLoading={isLoading} 
            searchQuery={searchQuery} 
            setSelectedTournament={setSelectedTournament} 
            userRegisteredTournaments={userRegisteredTournaments} 
          />
        </div>
      </section>

      {/* Enhanced Match Results Section */}
      <section className="py-12 bg-[#222]">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">Recent Match Results</h2>
            <button className="text-sm text-[#07f468] hover:underline flex items-center">
              View All Matches
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          {matchResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {matchResults.map((result) => (
              <MatchResultCard key={result.id} result={result} />
            ))}
          </div>
          ) : (
            <div className="text-center py-12 bg-[#333] rounded-lg">
              <Trophy className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-400">No match results available yet.</p>
        </div>
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


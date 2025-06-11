import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, Filter, X, Calendar, Clock, UserPlus, Users, Trophy, ChevronDown, Play, Pause, ArrowRight, MapPin, Shield, Award, InfoIcon } from 'lucide-react';
import NavBar from '../Component/NavBar';
import { useNavigate } from 'react-router-dom';
// Import services
import teamsService from '../lib/services/user/teamsService';
import playersService from '../lib/services/user/playersService';
import playerRequestsService from '../lib/services/user/playerRequestsService';

const FindPlayerTeam = () => {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPosition, setFilterPosition] = useState('');
  const [activeTab, setActiveTab] = useState('players');
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const videoRef = useRef(null);

  // Current user information
  const [currentUser, setCurrentUser] = useState(null);
  
  // New state variables for API data
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // New state for player and team registration forms
  const [showPlayerForm, setShowPlayerForm] = useState(false);
  const [showTeamForm, setShowTeamForm] = useState(false);
  
  // Get current user info on component mount
  useEffect(() => {
    // Check if we need to show the player form based on global state
    if (window.showPlayerForm) {
      setShowPlayerForm(true);
      window.showPlayerForm = false;
    }
    
    // Try to get user from session storage or local storage
    const userId = sessionStorage.getItem('userId') || localStorage.getItem('userId');
    const userToken = sessionStorage.getItem('token') || localStorage.getItem('token');
    
    if (userId && userToken) {
      setCurrentUser({
        id: userId,
        token: userToken
      });
    }
  }, []);
  
  // Functions to handle button clicks
  const handleCreatePlayerProfile = () => {
    setShowPlayerForm(true);
  };
  
  const handleRegisterTeam = () => {
    // Check if user is a player first
    const isUserPlayer = sessionStorage.getItem('isPlayer') === 'true';
    
    if (!isUserPlayer) {
      // If user is not a player, show player form with message
      setError("You need to register as a player before creating a team. Please create a player profile first.");
      setShowPlayerForm(true);
    } else {
      // If user is a player, show team registration form
      setShowTeamForm(true);
    }
  };

  // Toggle video play/pause
  const handleVideoToggle = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };
  
  // Reference for top-rated section for search scroll
  const topRatedRef = useRef(null);
  
  // Handle search on enter key
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && topRatedRef.current) {
      topRatedRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Fetch players and teams on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Check if user is already a player or team captain from session storage
        const isPlayer = sessionStorage.getItem('isPlayer') === 'true';
        const hasTeams = sessionStorage.getItem('has_teams') === 'true';
        
        // Fetch players
        const playersResponse = await playersService.getAllPlayers();
        
        // Handle the new response format with data property
        let playersData = [];
        if (playersResponse && playersResponse.data) {
          playersData = playersResponse.data;
        } else if (Array.isArray(playersResponse)) {
          playersData = playersResponse;
        }
        
        // Map API response to the format needed for UI
        const formattedPlayers = Array.isArray(playersData) 
          ? playersData.map(player => {
              if (!player) return null;
              
              // Extract user details from compte property
              const userInfo = player.compte || {};
              
              // Get account ID to potentially fetch profile info like name
              const accountId = player.id_compte || 0;
              
              // Check if this player is the current logged-in user
              const isCurrentUser = accountId === parseInt(sessionStorage.getItem('userId'), 10);
              if (isCurrentUser && !isPlayer) {
                // Update session storage to mark user as a player
                sessionStorage.setItem('isPlayer', 'true');
                sessionStorage.setItem('player_id', player.id);
              }
              
              return {
                id: player.id || 0,
                id_compte: accountId,
                name: userInfo.full_name || userInfo.nom || `Player ${player.id}`,
                position: player.position || 'Unknown',
                rating: typeof player.rating === 'number' ? player.rating : 0,
                matchesPlayed: typeof player.total_matches === 'number' ? player.total_matches : 0,
                image: userInfo.pfp || null,
                starting_time: player.starting_time || null,
                finishing_time: player.finishing_time || null,
                invites_accepted: player.invites_accepted || 0,
                invites_refused: player.invites_refused || 0,
                total_invites: player.total_invites || 0,
                misses: player.misses || 0,
                isCurrentUser
              };
            }).filter(Boolean) // Remove any null entries
          : [];
        
        setPlayers(formattedPlayers);
        
        // Fetch teams
        const teamsResponse = await teamsService.getAllTeams();
        
        // Handle the new response format with data property
        let teamsData = [];
        if (teamsResponse && teamsResponse.data) {
          teamsData = teamsResponse.data;
        } else if (Array.isArray(teamsResponse)) {
          teamsData = teamsResponse;
        }
        
        // Map API response to expected format if needed
        const formattedTeams = Array.isArray(teamsData)
          ? teamsData.map(team => {
              if (!team) return null;
              
              // Get player_id from session storage
              const playerId = parseInt(sessionStorage.getItem('player_id'), 10);
              
              // Check if this team belongs to the current user using player_id
              const isUserTeam = playerId && (team.capitain === playerId || parseInt(team.capitain, 10) === playerId);
              
              // If we find the user's team and it's not already marked, update session storage
              if (isUserTeam && !hasTeams) {
                sessionStorage.setItem('has_teams', 'true');
                sessionStorage.setItem('id_teams', team.id_teams);
                
                // Store this team in session storage
                // We can't reference formattedTeams here as it's still being built
                const userTeam = {
                  id_teams: team.id_teams,
                  name: team.team_name || `Team ${team.id_teams}`,
                  capitain: team.capitain
                };
                sessionStorage.setItem('teams', JSON.stringify([userTeam]));
              }
              
              // Get captain details if available
              const captainDetails = team.captain_details || {};
              
              return {
                id: team.id_teams || 0,
                name: team.team_name || `Team ${team.id_teams}`,
                rating: typeof team.rating === 'number' ? team.rating : 0,
                image: null, // Team images not available in the API response
                captain: team.capitain || null, // Store the captain ID from 'capitain' field
                captainName: captainDetails.name || 'Unknown', // Store the captain name from captain_details
                members_count: team.members_count || 0,
                starting_time: team.starting_time || null,
                finishing_time: team.finishing_time || null,
                total_matches: team.total_matches || 0,
                invites_accepted: team.invites_accepted || 0,
                invites_refused: team.invites_refused || 0,
                total_invites: team.total_invites || 0,
                misses: team.misses || 0,
                isUserTeam
              };
            }).filter(Boolean) // Remove any null entries
          : [];
        
        setTeams(formattedTeams);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
        setLoading(false);
        // Initialize with empty arrays to prevent filter errors
        setPlayers([]);
        setTeams([]);
      }
    };
    
    fetchData();
  }, []);

  const filteredPlayers = Array.isArray(players) 
    ? players.filter(
        (player) => {
          // Make sure player and its properties exist
          if (!player) return false;
          
          // Check if name exists and matches search query
          const nameMatches = player.name && 
            typeof player.name === 'string' && 
            player.name.toLowerCase().includes((searchQuery || '').toLowerCase());
          
          // Check if position matches filter (if any)
          const positionMatches = !filterPosition || 
            (player.position && 
             typeof player.position === 'string' && 
             player.position.toLowerCase() === filterPosition.toLowerCase());
          
          return nameMatches && positionMatches;
        }
      ) 
    : [];

  const filteredTeams = Array.isArray(teams)
    ? teams.filter((team) => {
        // Make sure team and its name property exist
        if (!team) return false;
        
        // Check if name exists and matches search query
        return team.name && 
          typeof team.name === 'string' && 
          team.name.toLowerCase().includes((searchQuery || '').toLowerCase());
      })
    : [];

  // Get user player status
  const isUserPlayer = sessionStorage.getItem('isPlayer') === 'true';
  const hasTeams = sessionStorage.getItem('has_teams') === 'true';
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121212] to-[#1e1e1e] text-white font-sans">      
      {/* Hero Section with Video Background */}
      <section className="h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        
        {/* Video background */}
        <div className="absolute inset-0 w-full h-full">
          <video 
            ref={videoRef}
            autoPlay 
            loop 
            muted 
            className="w-full h-full object-cover"
            playsInline
            onCanPlay={() => setIsVideoPlaying(true)}
            onWaiting={() => setIsVideoPlaying(false)}
          >
            <source src="https://moulweb.com/back/pfe_backend/public/2249402-uhd_3840_2160_24fps.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {/* Video controls */}
          <button 
            onClick={handleVideoToggle}
            className="absolute bottom-8 right-8 z-30 bg-white/10 backdrop-blur-md rounded-full p-3 hover:bg-white/20 transition-all"
            aria-label={isVideoPlaying ? "Pause video" : "Play video"}
          >
            {isVideoPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
        </div>
        
        {/* Navbar can go here */}
        
        <div className="container mx-auto px-6 relative z-20 h-full flex flex-col">
          <div className="flex-grow flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
              className="text-center max-w-4xl"
            >
              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-[#07f468] to-[#9EF01A]">
                FIND YOUR PERFECT MATCH
              </h1>
              <p className="text-xl mb-12 max-w-2xl mx-auto text-gray-300 font-light">
                Connect with top players and teams in your area. Join the community and elevate your game to the next level.
              </p>
              
              <div className="relative w-full max-w-3xl mx-auto mb-12">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="text-gray-400 w-5 h-5" />
                </div>
            <input
              type="text"
              placeholder="Search players or teams..."
                  className="w-full py-4 pl-12 pr-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#07f468] focus:border-transparent transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`${activeTab === 'players' ? 'bg-[#07f468] text-black' : 'bg-white/10 backdrop-blur-md text-white'} font-bold py-3 px-8 rounded-xl inline-flex items-center justify-center hover:bg-[#06d35a] transition-all shadow-lg ${activeTab === 'players' ? 'shadow-[#07f468]/20' : ''}`}
                  onClick={() => setActiveTab('players')}
                >
                  <Users className="w-5 h-5 mr-2" />
                  Find Players
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`${activeTab === 'teams' ? 'bg-[#07f468] text-black' : 'bg-white/10 backdrop-blur-md text-white'} font-bold py-3 px-8 rounded-xl inline-flex items-center justify-center hover:bg-[#06d35a] transition-all border ${activeTab === 'teams' ? 'border-[#07f468]/30' : 'border-white/10'}`}
                  onClick={() => setActiveTab('teams')}
                >
                  <Trophy className="w-5 h-5 mr-2" />
                  Find Teams
                </motion.button>
          </div>
        </motion.div>
          </div>
          
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
            className="pb-12 flex justify-center"
        >
            <a href="#top-rated" className="flex flex-col items-center">
              <span className="text-sm font-medium mb-2 text-gray-400">Scroll to explore</span>
              <ChevronDown className="w-6 h-6 text-[#07f468]" />
            </a>
        </motion.div>
        </div>
      </section>

      {/* Top Ratings Section */}
      <section id="top-rated" ref={topRatedRef} className="py-24 bg-[#111]">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-bold mb-3 inline-block relative">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#07f468] to-[#9EF01A]">Top Rated</span>
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[#07f468] to-[#9EF01A] rounded-full"></div>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto mt-6">Discover the highest-rated players and teams in our community based on performance and peer reviews.</p>
          </div>
          
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-[#07f468] border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-medium text-[#07f468]">Loading</span>
                </div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-white p-6 rounded-xl mb-8 text-center shadow-lg backdrop-blur-md">
              <X className="w-8 h-8 mx-auto mb-4 text-red-400" />
              <p className="text-lg font-medium">{error}</p>
              <p className="text-sm text-gray-300 mt-2">Please refresh the page or try again later.</p>
            </div>
          )}
          
          {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-[#222] to-[#1a1a1a] rounded-2xl p-8 shadow-xl border border-white/5 backdrop-blur-lg"
            >
              <h3 className="text-2xl font-bold mb-8 flex items-center">
                <div className="p-2 bg-[#07f468]/10 rounded-lg mr-3">
                  <Users className="w-6 h-6 text-[#07f468]" />
                </div>
                Top Players
              </h3>
              <ul className="space-y-6">
                  {Array.isArray(players) && players
                    .filter(player => player && typeof player === 'object')
                    .sort((a, b) => ((b.rating || 0) - (a.rating || 0)))
                    .slice(0, 5)
                    .map((player, index) => (
                    <motion.li 
                      key={player.id || `player-${index}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-all cursor-pointer backdrop-blur-sm"
                      onClick={() => setSelectedPlayer(player)}
                    >
                    <div className="flex items-center">
                        <div className="relative mr-4">
                          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#07f468] to-[#9EF01A] blur-[1px]"></div>
                          <img 
                            src={player.image ? 
                              (player.image.startsWith('http') ? player.image : `${process.env.REACT_APP_API_URL}/${player.image}`) : 
                              'https://discuss.cakewalk.com/uploads/monthly_2024_03/imported-photo-22646.thumb.jpeg.34bfea5fe763a56356574f4c413f0f17.jpeg'} 
                            alt={player.name || 'Player'} 
                            className="w-12 h-12 rounded-full relative border-2 border-[#07f468] object-cover" 
                          />
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#222] border-2 border-[#07f468] flex items-center justify-center">
                            <span className="text-xs font-bold">{index + 1}</span>
                    </div>
                    </div>
                        <div>
                          <span className="font-semibold">{player.name || 'Unknown Player'}</span>
                          <p className="text-xs text-gray-400">{player.position || 'Position not specified'}</p>
                        </div>
                      </div>
                      <div className="flex items-center bg-[#07f468]/10 px-3 py-1 rounded-full">
                        <span className="mr-1 font-medium">{player.rating || '4.5'}</span>
                        <Star className="w-4 h-4 text-[#07f468]" fill="#07f468" />
                      </div>
                    </motion.li>
                ))}
              </ul>
              <button
                className="mt-8 w-full py-3 rounded-xl border border-[#07f468]/30 text-[#07f468] flex items-center justify-center hover:bg-[#07f468]/10 transition-all"
                onClick={() => navigate('/all-players')}
              >
                View All Players
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-[#222] to-[#1a1a1a] rounded-2xl p-8 shadow-xl border border-white/5 backdrop-blur-lg"
            >
              <h3 className="text-2xl font-bold mb-8 flex items-center">
                <div className="p-2 bg-[#07f468]/10 rounded-lg mr-3">
                  <Trophy className="w-6 h-6 text-[#07f468]" />
            </div>
                Top Teams
              </h3>
              <ul className="space-y-6">
                  {Array.isArray(teams) && teams
                    .filter(team => team && typeof team === 'object')
                    .sort((a, b) => ((b.rating || 0) - (a.rating || 0)))
                    .slice(0, 5)
                    .map((team, index) => (
                    <motion.li 
                      key={team.id || `team-${index}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-all cursor-pointer backdrop-blur-sm"
                      onClick={() => setSelectedTeam(team)}
                    >
                    <div className="flex items-center">
                        <div className="relative mr-4">
                          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#07f468] to-[#9EF01A] blur-[1px]"></div>
                          <img 
                            src={team.image ? 
                              (team.image.startsWith('http') ? team.image : `${process.env.REACT_APP_API_URL}/${team.image}`) : 
                              'https://discuss.cakewalk.com/uploads/monthly_2024_03/imported-photo-22646.thumb.jpeg.34bfea5fe763a56356574f4c413f0f17.jpeg'} 
                            alt={team.name || 'Team'} 
                            className="w-12 h-12 rounded-full relative border-2 border-[#07f468] object-cover" 
                          />
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#222] border-2 border-[#07f468] flex items-center justify-center">
                            <span className="text-xs font-bold">{index + 1}</span>
                    </div>
                    </div>
                        <span className="font-semibold">{team.name || 'Unknown Team'}</span>
                      </div>
                      <div className="flex items-center bg-[#07f468]/10 px-3 py-1 rounded-full">
                        <span className="mr-1 font-medium">{team.rating || '4.5'}</span>
                        <Star className="w-4 h-4 text-[#07f468]" fill="#07f468" />
                      </div>
                    </motion.li>
                ))}
              </ul>
              <button
                className="mt-8 w-full py-3 rounded-xl border border-[#07f468]/30 text-[#07f468] flex items-center justify-center hover:bg-[#07f468]/10 transition-all"
                onClick={() => navigate('/all-teams')}
              >
                View All Teams
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </motion.div>
          </div>
          )}
        </div>
      </section>

      {/* Players and Teams Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <h1 className="text-4xl font-bold mb-3 inline-block relative">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#07f468] to-[#9EF01A]">{activeTab === 'players' ? 'Players' : 'Teams'}</span>
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[#07f468] to-[#9EF01A] rounded-full"></div>
            </h1>
            <p className="text-gray-400 max-w-xl mx-auto mt-6">
              {activeTab === 'players' 
                ? 'Browse and connect with talented players looking for their next match or team opportunity.'
                : 'Discover teams in your area looking for new players and competitive matches.'}
            </p>
          </div>

          <div className="bg-gradient-to-r from-[#222] to-[#1A1A1A] rounded-2xl p-6 mb-10 shadow-xl border border-white/5">
            <div className="flex justify-center mb-6">
              <div className="inline-flex rounded-xl bg-[#333] p-1.5">
              <button
                  className={`px-6 py-2.5 rounded-lg font-medium ${
                    activeTab === 'players' ? 'bg-[#07f468] text-black' : 'text-white hover:bg-white/5'
                } transition-colors duration-200`}
                onClick={() => setActiveTab('players')}
              >
                  <Users className="w-4 h-4 inline mr-2" />
                Players
              </button>
              <button
                  className={`px-6 py-2.5 rounded-lg font-medium ${
                    activeTab === 'teams' ? 'bg-[#07f468] text-black' : 'text-white hover:bg-white/5'
                } transition-colors duration-200`}
                onClick={() => setActiveTab('teams')}
              >
                  <Trophy className="w-4 h-4 inline mr-2" />
                Teams
              </button>
            </div>
          </div>

            <div className="flex flex-col lg:flex-row items-stretch gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="text-gray-400 w-5 h-5" />
                </div>
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
                  className="w-full py-3 pl-12 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#07f468] focus:border-transparent transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
              </div>
              
            {activeTab === 'players' && (
                <div className="relative lg:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Filter className="text-gray-400 w-5 h-5" />
                  </div>
              <select
                    className="w-full py-3 pl-12 pr-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#07f468] focus:border-transparent appearance-none"
                value={filterPosition}
                onChange={(e) => setFilterPosition(e.target.value)}
                    style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1rem' }}
                  >
                    <option className='bg-[#222]' value="">All Positions</option>
                    <option className='bg-[#222]' value="Forward">Forward</option>
                    <option className='bg-[#222]' value="Midfielder">Midfielder</option>
                    <option className='bg-[#222]' value="Defender">Defender</option>
                    <option className='bg-[#222]' value="Goalkeeper">Goalkeeper</option>
              </select>
                </div>
            )}
            </div>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-[#07f468] border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-medium text-[#07f468]">Loading</span>
                </div>
              </div>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-white p-6 rounded-xl mb-8 text-center shadow-lg backdrop-blur-md">
              <X className="w-8 h-8 mx-auto mb-4 text-red-400" />
              <p className="text-lg font-medium">{error}</p>
              <p className="text-sm text-gray-300 mt-2">Please refresh the page or try again later.</p>
            </div>
          )}

          {/* Data display */}
          {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {activeTab === 'players'
                ? (Array.isArray(filteredPlayers) ? filteredPlayers : []).map((player, index) => {
                    // Add null check before rendering
                    if (!player) return null;
                    
                    return (
                      <motion.div
                          key={player.id || `player-grid-${index}`}
                        className="bg-gradient-to-br from-[#222] to-[#1a1a1a] rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-white/5 group"
                        onClick={() => setSelectedPlayer(player)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -5, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="h-44 relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent z-10"></div>
                        <img
                            src={player.image ? 
                              (player.image.startsWith('http') ? player.image : `${process.env.REACT_APP_API_URL}/${player.image}`) : 
                              'https://discuss.cakewalk.com/uploads/monthly_2024_03/imported-photo-22646.thumb.jpeg.34bfea5fe763a56356574f4c413f0f17.jpeg'}
                            alt={player.name || 'Player'}
                            className="w-full h-full object-cover object-center group-hover:scale-110 transition-all duration-700 ease-in-out"
                          />
                          <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
                            <span className="bg-[#07f468] text-black text-sm font-bold px-3 py-1 rounded-full">
                              {player.position || 'Unknown'}
                            </span>
                            {player && player.isCurrentUser && (
                              <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                You
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="p-5">
                          <div className="flex justify-between items-center mb-3">
                            <h3 className="text-xl font-bold truncate">{player.name || 'Unknown Player'}</h3>
                            <div className="flex items-center bg-[#07f468]/10 px-2 py-1 rounded-full">
                              <span className="mr-1 font-medium">{player.rating || '0'}</span>
                              <Star className="w-4 h-4 text-[#07f468]" fill="#07f468" />
                            </div>
                          </div>
                          <div className="text-gray-400 text-sm space-y-1 mb-4">
                            <p className="flex items-center">
                              <Trophy className="w-4 h-4 mr-2 text-[#07f468]" />
                              Matches: {player.matchesPlayed || '0'}
                            </p>
                            <p className="flex items-center">
                              <Clock className="w-4 h-4 mr-2 text-[#07f468]" />
                              Available: {player.starting_time ? player.starting_time.slice(0, 5) : '--:--'} - {player.finishing_time ? player.finishing_time.slice(0, 5) : '--:--'}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button className="flex-1 py-2.5 rounded-lg bg-white/5 text-white text-sm font-medium hover:bg-white/10 transition-all duration-300 flex items-center justify-center"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPlayer(player);
                              }}
                            >
                              View Profile
                            </button>
                            <button 
                              className="flex-1 py-2.5 rounded-lg bg-[#07f468] text-black text-sm font-medium hover:bg-[#07f468]/80 transition-all duration-300 flex items-center justify-center"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPlayer(player);
                                setShowInviteForm(true);
                              }}
                              disabled={player.isCurrentUser}
                            >
                              {player.isCurrentUser ? "You" : "Invite"}
                              {!player.isCurrentUser && <UserPlus className="w-4 h-4 ml-2" />}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                : (Array.isArray(filteredTeams) ? filteredTeams : []).map((team, index) => {
                    // Add null check before rendering
                    if (!team) return null;
                    
                    return (
                      <motion.div
                          key={team.id || `team-grid-${index}`}
                        className="bg-gradient-to-br from-[#222] to-[#1a1a1a] rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-white/5 group"
                        onClick={() => setSelectedTeam(team)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -5, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="h-44 relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent z-10"></div>
                        <img
                            src={team.image ? 
                              (team.image.startsWith('http') ? team.image : `${process.env.REACT_APP_API_URL}/${team.image}`) : 
                              'https://discuss.cakewalk.com/uploads/monthly_2024_03/imported-photo-22646.thumb.jpeg.34bfea5fe763a56356574f4c413f0f17.jpeg'}
                            alt={team.name || 'Team'}
                            className="w-full h-full object-cover object-center group-hover:scale-110 transition-all duration-700 ease-in-out"
                          />
                          <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
                            <span className="bg-[#07f468] text-black text-sm font-bold px-3 py-1 rounded-full">
                              Team
                            </span>
                            {team && team.isUserTeam && (
                              <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                Your Team
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="p-5">
                          <div className="flex justify-between items-center mb-3">
                            <h3 className="text-xl font-bold truncate">{team.name || `Team ${team.id || 'Unknown'}`}</h3>
                            <div className="flex items-center bg-[#07f468]/10 px-2 py-1 rounded-full">
                              <span className="mr-1 font-medium">{team.rating || '0'}</span>
                              <Star className="w-4 h-4 text-[#07f468]" fill="#07f468" />
                            </div>
                          </div>
                          <div className="text-gray-400 text-sm space-y-1 mb-4">
                            <p className="flex items-center">
                              <Users className="w-4 h-4 mr-2 text-[#07f468]" />
                              Members: {team.members_count || '0'}
                            </p>
                            <p className="flex items-center">
                              <Trophy className="w-4 h-4 mr-2 text-[#07f468]" />
                              Matches: {team.total_matches || '0'}
                            </p>
                            <p className="flex items-center text-xs truncate">
                              <Shield className="w-4 h-4 mr-2 text-[#07f468]" />
                              Captain: {team.captainName || 'Unknown'}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button className="flex-1 py-2.5 rounded-lg bg-white/5 text-white text-sm font-medium hover:bg-white/10 transition-all duration-300 flex items-center justify-center"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTeam(team);
                              }}
                            >
                              View Team
                            </button>
                            <button 
                              className="flex-1 py-2.5 rounded-lg bg-[#07f468] text-black text-sm font-medium hover:bg-[#07f468]/80 transition-all duration-300 flex items-center justify-center"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTeam(team);
                                setShowInviteForm(true);
                              }}
                              disabled={team.isUserTeam}
                            >
                              {team.isUserTeam ? "Yours" : "Contact"}
                              {!team.isUserTeam && <Calendar className="w-4 h-4 ml-2" />}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
          </div>
          )}

          {/* No results state */}
          {!loading && !error && activeTab === 'players' && filteredPlayers.length === 0 && (
            <div className="text-center py-16 bg-white/5 rounded-xl border border-white/10">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-500" />
              <p className="text-xl font-medium text-white mb-2">No players found</p>
              <p className="text-base text-gray-400 mb-6 max-w-md mx-auto">We couldn't find any players matching your search criteria. Try adjusting your filters or create a new player profile.</p>
              {!isUserPlayer ? (
                <button 
                  className="bg-[#07f468] text-black font-bold py-2.5 px-6 rounded-lg hover:bg-[#06d35a] transition-all"
                  onClick={handleCreatePlayerProfile}
                >
                  Create Player Profile
                </button>
              ) : (
                <div className="text-center bg-blue-500/20 p-4 inline-block rounded-lg border border-blue-500/30">
                  <p className="text-blue-400">You already have a player profile</p>
                </div>
              )}
            </div>
          )}

          {!loading && !error && activeTab === 'teams' && filteredTeams.length === 0 && (
            <div className="text-center py-16 bg-white/5 rounded-xl border border-white/10">
              <Trophy className="w-12 h-12 mx-auto mb-4 text-gray-500" />
              <p className="text-xl font-medium text-white mb-2">No teams found</p>
              <p className="text-base text-gray-400 mb-6 max-w-md mx-auto">We couldn't find any teams matching your search. Try adjusting your search terms or register a new team.</p>
              <button 
                className="bg-[#07f468] text-black font-bold py-2.5 px-6 rounded-lg hover:bg-[#06d35a] transition-all"
                onClick={handleRegisterTeam}
              >
                Register Team
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Add Yourself/Team Section */}
      <section className="py-24 bg-gradient-to-br from-[#111] to-[#171717]" id="create-player-section">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-bold mb-3 inline-block relative">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#07f468] to-[#9EF01A]">Join the Community</span>
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[#07f468] to-[#9EF01A] rounded-full"></div>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto mt-6">
              Become part of our growing community. Create your profile and start connecting with players and teams.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-2xl group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#07f468]/20 to-[#333] z-0 group-hover:opacity-80 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1570498839593-e565b39455fc')] bg-cover bg-center opacity-20 group-hover:opacity-30 group-hover:scale-110 transition-all duration-700 ease-in-out"></div>
              
              <div className="relative z-10 p-10 h-full flex flex-col">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-[#07f468]/20 rounded-xl mr-4">
                    <UserPlus className="w-8 h-8 text-[#07f468]" />
                  </div>
                  <h3 className="text-2xl font-bold">Register as a Player</h3>
                </div>
                
                <p className="mb-8 text-gray-300 max-w-md">
                  Create your player profile to showcase your skills, availability, and preferred positions. 
                  Connect with teams looking for new talent and get invited to matches.
                </p>
                
                <div className="mt-auto">
                  {!isUserPlayer ? (
                    <>
                      <div className="mb-8 space-y-3">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-[#07f468]/20 flex items-center justify-center mr-3">
                            <Trophy className="w-4 h-4 text-[#07f468]" />
                          </div>
                          <p className="text-white">Showcase your skills and achievements</p>
                        </div>
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-[#07f468]/20 flex items-center justify-center mr-3">
                            <Users className="w-4 h-4 text-[#07f468]" />
                          </div>
                          <p className="text-white">Get discovered by teams in your area</p>
                        </div>
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-[#07f468]/20 flex items-center justify-center mr-3">
                            <Calendar className="w-4 h-4 text-[#07f468]" />
                          </div>
                          <p className="text-white">Manage your availability and matches</p>
                        </div>
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}              
                        whileTap={{ scale: 0.95 }}
                        className="bg-[#07f468] text-black font-bold py-3 px-8 rounded-xl inline-flex items-center justify-center hover:bg-[#06d35a] transition-all shadow-lg shadow-[#07f468]/20 w-full"
                        onClick={handleCreatePlayerProfile}
                        id="create-player-btn"
                      >
                        <UserPlus className="w-5 h-5 mr-2" />
                        Create Player Profile
                      </motion.button>
                    </>
                  ) : (
                    <div className="bg-blue-500/20 p-6 rounded-xl border border-blue-500/30 text-center">
                      <div className="w-16 h-16 mx-auto bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                        <UserPlus className="w-8 h-8 text-blue-400" />
                      </div>
                      <h3 className="text-xl font-medium text-blue-400 mb-2">You're Already a Player</h3>
                      <p className="text-gray-300">Your player profile is active. You can manage your profile and check invitations in the dashboard.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-2xl group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#07f468]/20 to-[#333] z-0 group-hover:opacity-80 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1574629810360-7efbbe195018')] bg-cover bg-center opacity-20 group-hover:opacity-30 group-hover:scale-110 transition-all duration-700 ease-in-out"></div>
              
              <div className="relative z-10 p-10 h-full flex flex-col">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-[#07f468]/20 rounded-xl mr-4">
                    <Shield className="w-8 h-8 text-[#07f468]" />
                  </div>
                  <h3 className="text-2xl font-bold">Register Your Team</h3>
                </div>
                
                <p className="mb-8 text-gray-300 max-w-md">
                  Create a team profile to find players, organize matches, and track your team's 
                  performance. Build your roster and compete with other teams in your area.
                </p>
                
                <div className="mt-auto">
                  {!hasTeams ? (
                    <>
                      <div className="mb-8 space-y-3">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-[#07f468]/20 flex items-center justify-center mr-3">
                            <Users className="w-4 h-4 text-[#07f468]" />
                          </div>
                          <p className="text-white">Find and recruit talented players</p>
                        </div>
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-[#07f468]/20 flex items-center justify-center mr-3">
                            <Trophy className="w-4 h-4 text-[#07f468]" />
                          </div>
                          <p className="text-white">Organize and participate in tournaments</p>
                        </div>
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-[#07f468]/20 flex items-center justify-center mr-3">
                            <Award className="w-4 h-4 text-[#07f468]" />
                          </div>
                          <p className="text-white">Build your team's reputation and ranking</p>
                        </div>
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}              
                        whileTap={{ scale: 0.95 }}
                        className="bg-[#07f468] text-black font-bold py-3 px-8 rounded-xl inline-flex items-center justify-center hover:bg-[#06d35a] transition-all shadow-lg shadow-[#07f468]/20 w-full"
                        onClick={handleRegisterTeam}
                      >
                        <Trophy className="w-5 h-5 mr-2" />
                        Register Team
                      </motion.button>
                    </>
                  ) : (
                    <div className="bg-blue-500/20 p-6 rounded-xl border border-blue-500/30 text-center">
                      <div className="w-16 h-16 mx-auto bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                        <Shield className="w-8 h-8 text-blue-400" />
                      </div>
                      <h3 className="text-xl font-medium text-blue-400 mb-2">You Already Have a Team</h3>
                      <p className="text-gray-300">Your team is registered. You can manage your team and check match requests in the dashboard.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Player Profile Modal */}
      <AnimatePresence>
        {selectedPlayer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedPlayer(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-gradient-to-br from-[#1a1a1a] to-[#111] rounded-2xl max-w-4xl w-full mx-4 overflow-hidden border border-white/5 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-40 bg-gradient-to-r from-[#07f468]/80 to-[#9EF01A]/80 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1508098682722-e99c643e7f76')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
                <button
                  className="absolute top-4 right-4 text-white bg-black/30 hover:bg-black/50 p-2 rounded-full transition-colors"
                  onClick={() => setSelectedPlayer(null)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="px-8 pb-8">
                <div className="flex flex-col md:flex-row items-start -mt-16 mb-8 gap-6">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#07f468] to-[#9EF01A] rounded-full blur-sm opacity-70"></div>
                  <img
                    src={selectedPlayer.image ? 
                          (selectedPlayer.image.startsWith('http') ? selectedPlayer.image : `${process.env.REACT_APP_API_URL}/${selectedPlayer.image}`) : 
                          'https://discuss.cakewalk.com/uploads/monthly_2024_03/imported-photo-22646.thumb.jpeg.34bfea5fe763a56356574f4c413f0f17.jpeg'}
                    alt={selectedPlayer.name}
                      className="relative w-32 h-32 rounded-full border-4 border-[#1a1a1a] object-cover"
                    />
                  </div>
                  <div className="pt-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-[#07f468]/20 text-[#07f468] text-xs font-semibold px-2.5 py-1 rounded-md">
                        {selectedPlayer.position || 'Position Not Set'}
                      </span>
                      <div className="flex items-center bg-white/10 px-2 py-1 rounded-full">
                        <span className="mr-1 font-medium">{selectedPlayer.rating || '0'}</span>
                        <Star className="w-3.5 h-3.5 text-[#07f468]" fill="#07f468" />
                      </div>
                      {selectedPlayer && selectedPlayer.isCurrentUser && (
                        <span className="bg-blue-500/20 text-blue-400 text-xs font-semibold px-2.5 py-1 rounded-md">
                          Your Profile
                        </span>
                      )}
                    </div>
                    <h2 className="text-3xl font-bold">{selectedPlayer.name}</h2>
                    <p className="text-gray-400 mt-1">Player ID: {selectedPlayer.id}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                      <Trophy className="w-5 h-5 mr-2 text-[#07f468]" />
                      Player Statistics
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-white/5 p-4 rounded-xl">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-400">Position</span>
                          <span className="font-bold">{selectedPlayer.position || 'Not specified'}</span>
                        </div>
                      </div>
                      
                      <div className="bg-white/5 p-4 rounded-xl">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-400">Matches Played</span>
                          <span className="font-bold">{selectedPlayer.matchesPlayed || '0'}</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2.5">
                          <div className="bg-gradient-to-r from-[#07f468] to-[#9EF01A] h-2.5 rounded-full" 
                               style={{ width: `${Math.min(100, ((selectedPlayer.matchesPlayed || 0) / 20) * 100)}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-[#07f468]" />
                      Availability
                    </h3>
                    <div className="bg-white/5 p-4 rounded-xl mb-6">
                      <p className="text-gray-400 mb-2">Available Times</p>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-5 h-5 text-[#07f468]" />
                        <span>
                          {selectedPlayer.starting_time 
                            ? selectedPlayer.starting_time.substring(0, 5)
                            : '--:--'} - 
                          {selectedPlayer.finishing_time 
                            ? selectedPlayer.finishing_time.substring(0, 5)
                            : '--:--'}
                        </span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                      <Award className="w-5 h-5 mr-2 text-[#07f468]" />
                      Player Rating
                    </h3>
                    <div className="bg-white/5 p-4 rounded-xl">
                      <div className="flex items-center mb-3">
                        <div className="flex-1">Overall Rating</div>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`w-5 h-5 ${star <= (selectedPlayer.rating || 0) ? 'text-[#07f468]' : 'text-gray-600'}`} 
                              fill={star <= (selectedPlayer.rating || 0) ? '#07f468' : 'none'} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-center md:justify-end">
                  {selectedPlayer && (selectedPlayer.isCurrentUser === false || selectedPlayer.isCurrentUser === undefined) ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-[#07f468] text-black font-bold py-3 px-8 rounded-xl inline-flex items-center justify-center hover:bg-[#06d35a] transition-all shadow-lg shadow-[#07f468]/20"
                      onClick={() => setSelectedPlayer(null)}
                    >
                      <X className="w-5 h-5 mr-2" />
                      Close
                    </motion.button>
                  ) : (
                    <div className="flex flex-col items-center bg-blue-500/20 p-4 rounded-xl border border-blue-500/30">
                      <p className="text-blue-400 mb-2">This is your player profile</p>
                      <p className="text-sm text-gray-400">You can view your matches and requests in the dashboard.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Team Profile Modal */}
      <AnimatePresence>
        {selectedTeam && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedTeam(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-gradient-to-br from-[#1a1a1a] to-[#111] rounded-2xl max-w-4xl w-full mx-4 overflow-hidden border border-white/5 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-40 bg-gradient-to-r from-[#07f468]/80 to-[#9EF01A]/80 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517466787929-bc90951d0974')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
                <button
                  className="absolute top-4 right-4 text-white bg-black/30 hover:bg-black/50 p-2 rounded-full transition-colors"
                  onClick={() => setSelectedTeam(null)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="px-8 pb-8">
                <div className="flex flex-col md:flex-row items-start -mt-16 mb-8 gap-6">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#07f468] to-[#9EF01A] rounded-full blur-sm opacity-70"></div>
                  <img
                    src={selectedTeam.image ? 
                          (selectedTeam.image.startsWith('http') ? selectedTeam.image : `${process.env.REACT_APP_API_URL}/${selectedTeam.image}`) : 
                          'https://discuss.cakewalk.com/uploads/monthly_2024_03/imported-photo-22646.thumb.jpeg.34bfea5fe763a56356574f4c413f0f17.jpeg'}
                    alt={selectedTeam.name}
                      className="relative w-32 h-32 rounded-full border-4 border-[#1a1a1a] object-cover"
                    />
                  </div>
                  <div className="pt-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-[#07f468]/20 text-[#07f468] text-xs font-semibold px-2.5 py-1 rounded-md">
                        Team
                      </span>
                      <div className="flex items-center bg-white/10 px-2 py-1 rounded-full">
                        <span className="mr-1 font-medium">{selectedTeam.rating || '0'}</span>
                        <Star className="w-3.5 h-3.5 text-[#07f468]" fill="#07f468" />
                      </div>
                      {selectedTeam && selectedTeam.isUserTeam && (
                        <span className="bg-blue-500/20 text-blue-400 text-xs font-semibold px-2.5 py-1 rounded-md">
                          Your Team
                        </span>
                      )}
                    </div>
                    <h2 className="text-3xl font-bold">{selectedTeam.name || `Team ${selectedTeam.id}`}</h2>
                    <p className="text-gray-400 mt-1">Team ID: {selectedTeam.id}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                      <Users className="w-5 h-5 mr-2 text-[#07f468]" />
                      Team Info
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-white/5 p-4 rounded-xl">
                        <div className="flex mb-2">
                          <div className="w-32 text-gray-400">Captain</div>
                          <div className="font-medium">{selectedTeam.captainName || 'Unknown'}</div>
                        </div>
                        <div className="flex mb-2">
                          <div className="w-32 text-gray-400">Total Matches</div>
                          <div className="font-medium">{selectedTeam.total_matches || '0'}</div>
                        </div>
                        <div className="flex">
                          <div className="w-32 text-gray-400">Members</div>
                          <div className="font-medium">{selectedTeam.members_count || '0'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                      <Trophy className="w-5 h-5 mr-2 text-[#07f468]" />
                      Team Rating
                    </h3>
                    <div className="bg-white/5 p-4 rounded-xl">
                      <div className="flex items-center mb-6">
                        <div className="flex-1">Overall Rating</div>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`w-5 h-5 ${star <= (selectedTeam.rating || 0) ? 'text-[#07f468]' : 'text-gray-600'}`} 
                              fill={star <= (selectedTeam.rating || 0) ? '#07f468' : 'none'} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-center md:justify-end">
                  {selectedTeam && (selectedTeam.isUserTeam === false || selectedTeam.isUserTeam === undefined) ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-[#07f468] text-black font-bold py-3 px-8 rounded-xl inline-flex items-center justify-center hover:bg-[#06d35a] transition-all shadow-lg shadow-[#07f468]/20"
                      onClick={() => setSelectedTeam(null)}
                    >
                      <X className="w-5 h-5 mr-2" />
                      Close
                    </motion.button>
                  ) : (
                    <div className="flex flex-col items-center bg-blue-500/20 p-4 rounded-xl border border-blue-500/30">
                      <p className="text-blue-400 mb-2">This is your team</p>
                      <p className="text-sm text-gray-400">You can manage your team from the dashboard</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invite Form Modal */}
      <AnimatePresence>
        {showInviteForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={() => setShowInviteForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-[#1a1a1a] rounded-xl p-8 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-4">
                {selectedPlayer 
                  ? `Invite ${selectedPlayer.name} to Play`
                  : `Contact ${selectedTeam?.name || 'Team'}`
                }
              </h2>
              
              <InviteForm 
                selectedPlayer={selectedPlayer} 
                selectedTeam={selectedTeam} 
                currentUser={currentUser}
                onClose={() => setShowInviteForm(false)}
                handleCreatePlayerProfile={() => setShowPlayerForm(true)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PlayerForm component */}
      <AnimatePresence>
        {showPlayerForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={() => setShowPlayerForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-[#1a1a1a] rounded-xl p-8 max-w-2xl w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <PlayerForm onClose={() => setShowPlayerForm(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TeamForm component */}
      <AnimatePresence>
        {showTeamForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={() => setShowTeamForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-[#1a1a1a] rounded-xl p-8 max-w-2xl w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <TeamForm onClose={() => setShowTeamForm(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// InviteForm component
const InviteForm = ({ selectedPlayer, selectedTeam, currentUser, onClose, handleCreatePlayerProfile }) => {
  const [formData, setFormData] = useState({
    match_date: '',
    starting_time: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [availableTeams, setAvailableTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [isPlayerCreated, setIsPlayerCreated] = useState(false);

  // Get tomorrow's date as the default minimum date for the calendar
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowFormatted = tomorrow.toISOString().split('T')[0];

  useEffect(() => {
    // Check if user has a player profile
    const playerId = sessionStorage.getItem('player_id');
    if (playerId) {
      setIsPlayerCreated(true);
    }

    // If the user is sending a request to a player, we need to fetch their teams
    if (selectedPlayer && !selectedTeam) {
      fetchUserTeams();
    }

    // Set default match date to tomorrow
    setFormData(prev => ({
      ...prev,
      match_date: tomorrowFormatted
    }));

    // If a player or team is selected, set a default time based on their availability
    if (selectedPlayer) {
      const defaultTime = selectedPlayer.starting_time ? 
        selectedPlayer.starting_time.substring(0, 5) : '18:00';
      setFormData(prev => ({ ...prev, starting_time: defaultTime }));
    } else if (selectedTeam) {
      const defaultTime = selectedTeam.starting_time ? 
        selectedTeam.starting_time.substring(0, 5) : '18:00';
      setFormData(prev => ({ ...prev, starting_time: defaultTime }));
    }
  }, [selectedPlayer, selectedTeam]);

  const fetchUserTeams = async () => {
    try {
      setLoadingTeams(true);
      
      // First check if we have team info in session storage
      const hasTeams = sessionStorage.getItem('has_teams') === 'true';
      const teamsData = sessionStorage.getItem('teams');
      
      if (hasTeams && teamsData) {
        try {
          const parsedTeams = JSON.parse(teamsData);
          if (Array.isArray(parsedTeams) && parsedTeams.length > 0) {
            setAvailableTeams(parsedTeams);
            setSelectedTeamId(parsedTeams[0].id_teams);
            setLoadingTeams(false);
            return;
          }
        } catch (error) {
          console.error('Error parsing teams data from session storage:', error);
        }
      }
      
      // If no valid teams in session storage, fetch from API
      const response = await teamsService.getAllTeams();
      
      // Filter teams where the user is the captain
      let userTeams = [];
      if (response && response.data) {
        const playerId = parseInt(sessionStorage.getItem('player_id'), 10);
        
        // Prioritize filtering by player_id
        if (playerId) {
          userTeams = response.data.filter(team => 
            team.capitain === playerId || 
            parseInt(team.capitain, 10) === playerId
          );
        }
        
        // If no teams found by player_id, try with userId as fallback (legacy support)
        if (userTeams.length === 0) {
          const userId = parseInt(sessionStorage.getItem('userId'), 10);
          userTeams = response.data.filter(team => 
            team.capitain === userId || 
            parseInt(team.capitain, 10) === userId
          );
        }
        
        // Update session storage with the teams data
        if (userTeams.length > 0) {
          sessionStorage.setItem('has_teams', 'true');
          sessionStorage.setItem('teams', JSON.stringify(userTeams));
          sessionStorage.setItem('id_teams', userTeams[0].id_teams);
        }
      }
      
      setAvailableTeams(userTeams);
      
      // Set the first team as selected by default if available
      if (userTeams.length > 0) {
        setSelectedTeamId(userTeams[0].id_teams);
      }
    } catch (error) {
      console.error('Error fetching user teams:', error);
      // Use validationErrors state instead of submitError to avoid redeclaration
      setValidationErrors(prev => ({
        ...prev,
        teams: 'Failed to load your teams. Please try again later.'
      }));
    } finally {
      setLoadingTeams(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Validate date
    if (!formData.match_date) {
      errors.match_date = 'Date is required';
    } else {
      const selectedDate = new Date(formData.match_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        errors.match_date = 'Date cannot be in the past';
      }
    }
    
    // Validate time
    if (!formData.starting_time) {
      errors.starting_time = 'Time is required';
    } else {
      // Check if time is within available hours
      if (selectedPlayer) {
        const playerStartTime = selectedPlayer.starting_time ? 
          selectedPlayer.starting_time.substring(0, 5) : '00:00';
        const playerEndTime = selectedPlayer.finishing_time ? 
          selectedPlayer.finishing_time.substring(0, 5) : '23:59';
          
        if (formData.starting_time < playerStartTime || formData.starting_time > playerEndTime) {
          errors.starting_time = `Time must be between ${playerStartTime} and ${playerEndTime}`;
        }
      } else if (selectedTeam) {
        const teamStartTime = selectedTeam.starting_time ? 
          selectedTeam.starting_time.substring(0, 5) : '00:00';
        const teamEndTime = selectedTeam.finishing_time ? 
          selectedTeam.finishing_time.substring(0, 5) : '23:59';
          
        if (formData.starting_time < teamStartTime || formData.starting_time > teamEndTime) {
          errors.starting_time = `Time must be between ${teamStartTime} and ${teamEndTime}`;
        }
      }
    }
    
    // Validate team selection when inviting a player
    if (selectedPlayer && !selectedTeam && !selectedTeamId && isPlayerCreated) {
      errors.team = 'Please select a team';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error when field is changed
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Check if user is logged in
      if (!currentUser || !currentUser.id) {
        setSubmitError('You must be logged in to send requests.');
        setIsSubmitting(false);
        return;
      }

      // Get player_id from session storage
      const playerId = sessionStorage.getItem('player_id');
      if (!playerId) {
        setSubmitError('You need to create a player profile before sending requests.');
        setIsSubmitting(false);
        return;
      }

      // Prepare data for API with the correct field names
      const requestData = {
        sender: parseInt(playerId, 10),
        receiver: selectedPlayer ? selectedPlayer.id : (selectedTeam ? selectedTeam.id : null),
        match_date: formData.match_date,
        starting_time: formData.starting_time + ':00', // Add seconds to match the required H:i:s format
        message: formData.message || (selectedPlayer ? 'Would you like to play a match?' : 'Would your team like to play a match?'),
        request_type: selectedPlayer ? 'match' : 'team_match'
      };
      
      // If inviting a player, add the team_id
      if (selectedPlayer && selectedTeamId) {
        requestData.team_id = parseInt(selectedTeamId, 10);
      }

      console.log('Sending request data:', requestData);

      // Send request to the API
      await playerRequestsService.createPlayerRequest(requestData);

      setSubmitSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error submitting request:', error);
      if (error.response && error.response.data) {
        if (error.response.data.error && typeof error.response.data.error === 'object') {
          // Handle validation errors from the API
          const apiErrors = error.response.data.error;
          const formattedErrors = {};
          
          Object.keys(apiErrors).forEach(key => {
            formattedErrors[key] = apiErrors[key][0];
          });
          
          setValidationErrors(formattedErrors);
        } else if (error.response.data.message) {
          setSubmitError(error.response.data.message);
        } else {
          setSubmitError('Failed to send request. Please check your inputs and try again.');
        }
      } else {
        setSubmitError('Failed to send request. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="text-center py-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-green-500/20 border border-green-500 text-white p-6 rounded-xl"
        >
          <div className="w-16 h-16 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-xl font-bold mb-2">Request Sent Successfully!</h3>
          <p className="mb-4">Your invitation has been sent. You'll be notified when they respond.</p>
          <button
            onClick={onClose}
            className="bg-white text-green-700 font-semibold py-2 px-6 rounded-lg hover:bg-green-50 transition-colors"
          >
            Close
          </button>
        </motion.div>
      </div>
    );
  }
  
  if (!isPlayerCreated) {
    return (
      <div className="text-center py-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-yellow-500/20 border border-yellow-500 text-white p-6 rounded-xl"
        >
          <div className="w-16 h-16 mx-auto bg-yellow-500/20 rounded-full flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-yellow-500" />
          </div>
          <h3 className="text-xl font-bold mb-2">Player Profile Required</h3>
          <p className="mb-4">You need to create a player profile before sending invites.</p>
          <button 
            onClick={() => {
              onClose(); // First close the invite form
              handleCreatePlayerProfile(); // Then show the player form
            }}
            className="bg-white text-yellow-700 font-semibold py-2 px-6 rounded-lg hover:bg-yellow-50 transition-colors inline-block"
          >
            Create Player Profile
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-[#07f468]" />
          {selectedPlayer 
            ? `Invite ${selectedPlayer.name} to Play` 
            : `Contact ${selectedTeam?.name || 'Team'}`
          }
        </h3>
        <p className="text-gray-400 text-sm">
          {selectedPlayer 
            ? `Available: ${selectedPlayer.starting_time ? selectedPlayer.starting_time.substring(0, 5) : '--:--'} - ${selectedPlayer.finishing_time ? selectedPlayer.finishing_time.substring(0, 5) : '--:--'}`
            : selectedTeam 
              ? `Available: ${selectedTeam.starting_time ? selectedTeam.starting_time.substring(0, 5) : '--:--'} - ${selectedTeam.finishing_time ? selectedTeam.finishing_time.substring(0, 5) : '--:--'}`
              : 'Select a time for your match'
          }
        </p>
      </div>

      {submitError && (
        <div className="mb-6 bg-red-500/20 border border-red-500 text-white p-4 rounded-lg flex items-start">
          <X className="w-5 h-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
          <p>{submitError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Team selection is hidden but we still use the selectedTeamId value */}
        {selectedPlayer && !selectedTeam && loadingTeams && (
          <div className="mb-4 bg-[#07f468]/10 p-4 rounded-lg border border-[#07f468]/30">
            <div className="flex items-center">
              <div className="w-5 h-5 border-2 border-[#07f468] border-t-transparent rounded-full animate-spin mr-2"></div>
              <p className="text-[#07f468]">Loading your team information...</p>
            </div>
          </div>
        )}
        
        {selectedPlayer && !selectedTeam && !loadingTeams && availableTeams.length > 0 && (
          <div>
            <label htmlFor="team_id" className="block text-sm font-medium text-gray-300 mb-1">
              Select Your Team *
            </label>
            <select
              id="team_id"
              name="team_id"
              value={selectedTeamId}
              onChange={(e) => setSelectedTeamId(e.target.value)}
              required
              className={`w-full py-3 px-4 rounded-lg bg-white/5 border ${validationErrors.team ? 'border-red-500' : 'border-white/10'} text-white focus:outline-none focus:ring-2 focus:ring-[#07f468] focus:border-transparent transition-all`}
            >
              <option value="" className="bg-[#222]">Select a team</option>
              {availableTeams.map(team => (
                <option 
                  key={team.id_teams} 
                  value={team.id_teams} 
                  className="bg-[#222]"
                >
                  {team.team_name || `Team ${team.id_teams}`}
                </option>
              ))}
            </select>
            {validationErrors.team && (
              <p className="mt-1 text-sm text-red-500">{validationErrors.team}</p>
            )}
          </div>
        )}
        
        {selectedPlayer && !selectedTeam && !loadingTeams && availableTeams.length === 0 && (
          <div className="mb-4 bg-yellow-500/20 border border-yellow-500/30 text-white p-4 rounded-lg">
            <p className="text-center">You don't have any teams. Please register a team first.</p>
          </div>
        )}

        {/* Date picker */}
        <div>
          <label htmlFor="match_date" className="block text-sm font-medium text-gray-300 mb-1">
            Match Date *
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="date"
              id="match_date"
              name="match_date"
              value={formData.match_date}
              onChange={handleChange}
              min={tomorrowFormatted}
              required
              className={`w-full py-3 pl-10 pr-4 rounded-lg bg-white/5 border ${validationErrors.match_date ? 'border-red-500' : 'border-white/10'} text-white focus:outline-none focus:ring-2 focus:ring-[#07f468] focus:border-transparent transition-all`}
            />
          </div>
          {validationErrors.match_date && (
            <p className="mt-1 text-sm text-red-500">{validationErrors.match_date}</p>
          )}
        </div>

        {/* Time picker */}
        <div>
          <label htmlFor="starting_time" className="block text-sm font-medium text-gray-300 mb-1">
            Match Time *
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="time"
              id="starting_time"
              name="starting_time"
              value={formData.starting_time}
              onChange={handleChange}
              required
              className={`w-full py-3 pl-10 pr-4 rounded-lg bg-white/5 border ${validationErrors.starting_time ? 'border-red-500' : 'border-white/10'} text-white focus:outline-none focus:ring-2 focus:ring-[#07f468] focus:border-transparent transition-all`}
            />
          </div>
          {validationErrors.starting_time && (
            <p className="mt-1 text-sm text-red-500">{validationErrors.starting_time}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {selectedPlayer 
              ? `${selectedPlayer.name} is available between ${selectedPlayer.starting_time ? selectedPlayer.starting_time.substring(0, 5) : '--:--'} and ${selectedPlayer.finishing_time ? selectedPlayer.finishing_time.substring(0, 5) : '--:--'}`
              : selectedTeam 
                ? `${selectedTeam.name} is available between ${selectedTeam.starting_time ? selectedTeam.starting_time.substring(0, 5) : '--:--'} and ${selectedTeam.finishing_time ? selectedTeam.finishing_time.substring(0, 5) : '--:--'}`
                : 'Select a time for your match'
            }
          </p>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
            Message (optional)
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="3"
            className={`w-full py-3 px-4 rounded-lg bg-white/5 border ${validationErrors.message ? 'border-red-500' : 'border-white/10'} text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#07f468] focus:border-transparent transition-all`}
            placeholder="Add a personal message..."
          ></textarea>
          {validationErrors.message && (
            <p className="mt-1 text-sm text-red-500">{validationErrors.message}</p>
          )}
        </div>
        
        <div className="flex justify-end space-x-3 mt-8">
          <button
            type="button"
            onClick={onClose}
            className="border border-white/20 text-white py-2.5 px-6 rounded-lg hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || (selectedPlayer && !selectedTeam && availableTeams.length === 0)}
            className="bg-[#07f468] text-black font-semibold py-2.5 px-6 rounded-lg hover:bg-[#06d35a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                Sending...
              </>
            ) : (
              <>
                Send Request
                <Calendar className="w-5 h-5 ml-2" />
              </>
            )}
          </button>
        </div>
      </form>
    </>
  );
};

// PlayerForm component
const PlayerForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    position: '',
    starting_time: '',
    finishing_time: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [userIdError, setUserIdError] = useState(false);
  const [existingPlayerError, setExistingPlayerError] = useState(false);

  useEffect(() => {
    // Set default times if not already set
    if (!formData.starting_time) {
      setFormData(prev => ({ ...prev, starting_time: '18:00' }));
    }
    if (!formData.finishing_time) {
      setFormData(prev => ({ ...prev, finishing_time: '22:00' }));
    }
    
    // Check if user is logged in
    const userId = sessionStorage.getItem('userId') || localStorage.getItem('userId');
    if (!userId) {
      setUserIdError(true);
      return;
    }
    
    // Check if user already has a player profile from session storage
    const isPlayer = sessionStorage.getItem('isPlayer') === 'true';
    const playerId = sessionStorage.getItem('player_id');
    
    if (isPlayer && playerId) {
      setExistingPlayerError(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setUserIdError(false);

    // Check if user already has a player profile
    const isPlayer = sessionStorage.getItem('isPlayer') === 'true';
    if (isPlayer) {
      setExistingPlayerError(true);
      setIsSubmitting(false);
      return;
    }

    // Validate times
    const startTime = formData.starting_time;
    const finishTime = formData.finishing_time;
    
    // Check if finish time is after start time in 24-hour format
    if (startTime >= finishTime) {
      setSubmitError('Finish time must be after start time');
      setIsSubmitting(false);
      return;
    }

    try {
      // Get user ID from session storage
      const userId = sessionStorage.getItem('userId') || localStorage.getItem('userId');
      
      if (!userId) {
        setUserIdError(true);
        setSubmitError('You must be logged in to create a player profile. Please log in and try again.');
        setIsSubmitting(false);
        return;
      }

      // Create payload for API
      const playerData = {
        id_compte: parseInt(userId, 10),
        position: formData.position,
        // Format the times to match the expected API format (H:i:s)
        // Make sure to add seconds to comply with the H:i:s format
        starting_time: `${startTime}:00`,
        finishing_time: `${finishTime}:00`,
        total_matches: 0,
        rating: 0,
        misses: 0,
        invites_accepted: 0,
        invites_refused: 0,
        total_invites: 0
      };

      console.log('Sending player data:', playerData);

      // Create player profile
      const response = await playersService.createPlayer(playerData);
      
      // Update session storage
      if (response && response.data) {
        const playerId = response.data.id;
        sessionStorage.setItem('isPlayer', 'true');
        sessionStorage.setItem('player_id', playerId);
      }

      setSubmitSuccess(true);
      setTimeout(() => {
        onClose();
        // Refresh player list
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Error creating player profile:', error);
      
      // Handle the specific validation errors from the backend
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        
        if (errorData.details && errorData.details.id_compte && 
            errorData.details.id_compte.includes("The id compte has already been taken.")) {
          setExistingPlayerError(true);
        } else if (errorData.error && typeof errorData.error === 'object') {
          // Handle validation errors for time format
          let errorMessage = "";
          
          if (errorData.error.starting_time) {
            errorMessage += errorData.error.starting_time[0] + " ";
          }
          
          if (errorData.error.finishing_time) {
            errorMessage += errorData.error.finishing_time[0];
          }
          
          setSubmitError(errorMessage || 'Please ensure your available times are in the correct format (H:i:s)');
        } else {
          setSubmitError(errorData.error ? String(errorData.error) : (errorData.message || 'Failed to create player profile. Please try again later.'));
        }
      } else {
        setSubmitError('Failed to create player profile. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="text-center py-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-green-500/20 border border-green-500 text-white p-6 rounded-lg"
        >
          <h3 className="text-xl font-bold mb-2">Player Profile Created!</h3>
          <p>Your player profile has been created successfully. You can now be discovered by teams and receive invites to play.</p>
        </motion.div>
      </div>
    );
  }

  if (userIdError) {
  return (
      <div className="text-center py-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-red-500/20 border border-red-500 text-white p-6 rounded-lg"
        >
          <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center mb-4">
            <X className="w-8 h-8 text-red-500" />
      </div>
          <h3 className="text-xl font-bold mb-2">Authentication Required</h3>
          <p className="mb-4">You need to be logged in to create a player profile.</p>
          <button
            onClick={onClose}
            className="bg-white text-red-500 font-semibold py-2 px-4 rounded-lg hover:bg-red-50 transition-colors"
          >
            Close
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Register</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
    
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
        <label htmlFor="position" className="block text-sm font-medium text-gray-300 mb-1">
          Position *
        </label>
        <select
          id="position"
          name="position"
          value={formData.position}
          onChange={handleChange}
          required
              className="w-full py-3 px-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#07f468] focus:border-transparent transition-all"
            >
              <option value="" className="bg-[#222]">Select Position</option>
              <option value="Forward" className="bg-[#222]">Forward</option>
              <option value="Midfielder" className="bg-[#222]">Midfielder</option>
              <option value="Defender" className="bg-[#222]">Defender</option>
              <option value="Goalkeeper" className="bg-[#222]">Goalkeeper</option>
        </select>
      </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="starting_time" className="block text-sm font-medium text-gray-300 mb-1">
                Available From *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="time"
                  id="starting_time"
                  name="starting_time"
                  value={formData.starting_time}
                  onChange={handleChange}
                  required
                  className="w-full py-3 pl-10 pr-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#07f468] focus:border-transparent transition-all"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Time will be stored in 24-hour format (HH:MM:SS)</p>
            </div>
            <div>
              <label htmlFor="finishing_time" className="block text-sm font-medium text-gray-300 mb-1">
                Available Until *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="time"
                  id="finishing_time"
                  name="finishing_time"
                  value={formData.finishing_time}
                  onChange={handleChange}
                  required
                  min={formData.starting_time} // HTML5 validation to help ensure finishing time is after starting time
                  className="w-full py-3 pl-10 pr-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#07f468] focus:border-transparent transition-all"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Must be later than start time</p>
            </div>
          </div>
      </div>
      
      {submitError && (
          <div className="mt-6 bg-red-500/20 border border-red-500 text-white p-4 rounded-lg text-sm">
          {submitError}
        </div>
      )}
      
        <div className="flex justify-end space-x-3 mt-8">
        <button
          type="button"
          onClick={onClose}
            className="border border-white/20 text-white py-3 px-6 rounded-lg hover:bg-white/5 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
            className="bg-[#07f468] text-black font-semibold py-3 px-6 rounded-lg hover:bg-[#06d35a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                Create Profile
                <UserPlus className="w-5 h-5 ml-2" />
              </>
            )}
        </button>
      </div>
    </form>
    </>
  );
};

// TeamForm component
const TeamForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    starting_time: '',
    finishing_time: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [userIdError, setUserIdError] = useState(false);
  const [existingTeamError, setExistingTeamError] = useState(false);
  const [isPlayerError, setIsPlayerError] = useState(false);
  const [captainInfo, setCaptainInfo] = useState(null);

  useEffect(() => {
    // Set default times if not already set
    if (!formData.starting_time) {
      setFormData(prev => ({ ...prev, starting_time: '18:00' }));
    }
    if (!formData.finishing_time) {
      setFormData(prev => ({ ...prev, finishing_time: '22:00' }));
    }

    // Check if user is logged in
    const userId = sessionStorage.getItem('userId');
    
    if (!userId) {
      setUserIdError(true);
      return;
    }
    
    // Check if user is a player
    const isPlayer = sessionStorage.getItem('isPlayer') === 'true';
    if (!isPlayer) {
      setIsPlayerError(true);
      return;
    }
    
    // Check if user already has a team
    const hasTeams = sessionStorage.getItem('has_teams') === 'true';
    const teamId = sessionStorage.getItem('id_teams');
    
    if (hasTeams && teamId) {
      setExistingTeamError(true);
      // Try to get team details from session storage
      try {
        const teamsData = sessionStorage.getItem('teams');
        if (teamsData) {
          const teams = JSON.parse(teamsData);
          if (teams && teams.length > 0) {
            setCaptainInfo(prev => ({
              ...prev,
              teamId: teams[0].id_teams,
              teamName: teams[0].name || `Team ${teams[0].id_teams}`
            }));
          }
        }
      } catch (error) {
        console.error('Error parsing teams data from session storage:', error);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setUserIdError(false);
    
    // Double-check if user is a player
    const isPlayer = sessionStorage.getItem('isPlayer') === 'true';
    if (!isPlayer) {
      setIsPlayerError(true);
      setIsSubmitting(false);
      return;
    }
    
    // Check if user already has a team
    const hasTeams = sessionStorage.getItem('has_teams') === 'true';
    if (hasTeams) {
      setExistingTeamError(true);
      setIsSubmitting(false);
      return;
    }

    // Validate times
    const startTime = formData.starting_time;
    const finishTime = formData.finishing_time;
    
    // Check if finish time is after start time in 24-hour format
    if (startTime >= finishTime) {
      setSubmitError('Finish time must be after start time');
      setIsSubmitting(false);
      return;
    }

    try {
      // Get user ID from session storage (the team captain)
      const userId = sessionStorage.getItem('userId') || localStorage.getItem('userId');
      
      if (!userId) {
        setSubmitError('You must be logged in to register a team. Please log in and try again.');
        setIsSubmitting(false);
        return;
      }

      // Create the payload as required by the API
      const teamData = {
        capitain: parseInt(userId, 10), // Use userId from session storage
        // Format the times to match the expected API format (H:i:s)
        starting_time: `${startTime}:00`,
        finishing_time: `${finishTime}:00`,
        total_matches: 0,
        rating: 0,
        misses: 0,
        invites_accepted: 0,
        invites_refused: 0,
        total_invites: 0
      };

      console.log('Sending team data:', teamData);

      // Create team
      const response = await teamsService.createTeam(teamData);
      console.log('Team creation response:', response);

      // Store team information in session storage
      if (response && response.data) {
        const teamId = response.data.id_teams;
        
        if (teamId) {
          // Store team ID in session storage
          sessionStorage.setItem("id_teams", teamId);
          
          // Update has_teams flag
          sessionStorage.setItem("has_teams", "true");
          
          // Store team object in session storage
          const teamObj = response.data;
          const teamsArray = [teamObj];
          sessionStorage.setItem("teams", JSON.stringify(teamsArray));
          
          console.log("Team data stored in session storage:", teamId);
        }
      }

      setSubmitSuccess(true);
      setTimeout(() => {
        onClose();
        // Refresh team list
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Error creating team:', error);
      
      // Check for specific error message about captain already having a team
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        
        // Check for the specific error message about captain
        if (errorData.error === true && errorData.message === "This player is already a captain of another team") {
          setExistingTeamError(true);
          // Update session storage to reflect that user has teams
          sessionStorage.setItem('has_teams', 'true');
          
          // Try to fetch the team details
          try {
            const teamsResponse = await teamsService.getAllTeams();
            if (teamsResponse && teamsResponse.data) {
              const playerId = parseInt(sessionStorage.getItem('player_id'), 10);
              
              // Filter teams using the player_id instead of userId
              const userTeams = teamsResponse.data.filter(team => 
                team.capitain === playerId || parseInt(team.capitain, 10) === playerId
              );
              
              if (userTeams.length > 0) {
                const teamId = userTeams[0].id_teams;
                sessionStorage.setItem('id_teams', teamId);
                
                // Store team object in session storage
                sessionStorage.setItem('teams', JSON.stringify(userTeams));
                
                // Update captain info with team details
                setCaptainInfo(prev => ({
                  ...prev,
                  teamId: userTeams[0].id_teams,
                  teamName: userTeams[0].team_name || `Team ${userTeams[0].id_teams}`
                }));
              }
            }
          } catch (teamError) {
            console.error('Error fetching team details:', teamError);
          }
        } else if (errorData.error && typeof errorData.error === 'object') {
          // Handle validation errors for time format
          let errorMessage = "";
          
          if (errorData.error.starting_time) {
            errorMessage += errorData.error.starting_time[0] + " ";
          }
          
          if (errorData.error.finishing_time) {
            errorMessage += errorData.error.finishing_time[0];
          }
          
          setSubmitError(errorMessage || 'Please ensure your available times are in the correct format (H:i:s)');
        } else {
          setSubmitError(errorData.message || (errorData.error ? String(errorData.error) : 'Failed to register team. Please try again later.'));
        }
      } else {
        setSubmitError('Failed to register team. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="text-center py-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-green-500/20 border border-green-500 text-white p-6 rounded-lg"
        >
          <div className="w-16 h-16 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-4">
            <Trophy className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-xl font-bold mb-2">Team Created Successfully!</h3>
          <p>Your team has been registered. You can now invite players and arrange matches with other teams.</p>
        </motion.div>
      </div>
    );
  }
  
  if (existingTeamError) {
    return (
      <div className="text-center py-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-yellow-500/20 border border-yellow-500 text-white p-6 rounded-lg"
        >
          <div className="w-16 h-16 mx-auto bg-yellow-500/20 rounded-full flex items-center justify-center mb-4">
            <InfoIcon className="w-8 h-8 text-yellow-500" />
          </div>
          <h3 className="text-xl font-bold mb-2">Team Already Exists</h3>
          <p className="mb-4">You are already the captain of a team. Each user can only be the captain of one team at a time.</p>
          
          {captainInfo && captainInfo.teamId && (
            <div className="bg-yellow-500/10 p-4 rounded-lg mb-4 text-left">
              <h4 className="font-medium mb-2 flex items-center">
                <Trophy className="w-4 h-4 mr-2 text-yellow-400" />
                Your Team Details
              </h4>
              <p className="text-sm mb-1"><span className="text-yellow-300">Team ID:</span> {captainInfo.teamId}</p>
              <p className="text-sm">{captainInfo.teamName || 'Unknown'}</p>
            </div>
          )}
          
          <div className="flex justify-center space-x-3">
            <button
              onClick={onClose}
              className="bg-white text-yellow-700 font-semibold py-2 px-6 rounded-lg hover:bg-yellow-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => window.location.href = '/Client'}
              className="bg-yellow-500 text-black font-semibold py-2 px-6 rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (userIdError) {
  return (
      <div className="text-center py-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-red-500/20 border border-red-500 text-white p-6 rounded-lg"
        >
          <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center mb-4">
            <X className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-bold mb-2">Authentication Required</h3>
          <p className="mb-4">You need to be logged in to register a team.</p>
          <button
            onClick={onClose}
            className="bg-white text-red-500 font-semibold py-2 px-4 rounded-lg hover:bg-red-50 transition-colors"
          >
            Close
          </button>
        </motion.div>
      </div>
    );
  }
  
  if (isPlayerError) {
    return (
      <div className="text-center py-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-blue-500/20 border border-blue-500 text-white p-6 rounded-lg"
        >
          <div className="w-16 h-16 mx-auto bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
            <UserPlus className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-xl font-bold mb-2">Player Profile Required</h3>
          <p className="mb-4">You need to create a player profile before you can register a team. Please create your player profile first.</p>
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm text-blue-300 mb-2">Register as a player to unlock team creation:</p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={onClose}
                className="bg-white text-blue-500 font-semibold py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Close
              </button>
              <a 
                href="#create-player-section"
                onClick={() => {
                  onClose();
                }}
                className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-400 transition-colors"
              >
                Go to Player Registration
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Register</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
    
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Captain Information */}
          <div className="bg-white/5 p-4 rounded-lg mb-4">
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-[#07f468]" />
              Team Information
            </h3>
            <p className="text-sm text-gray-300">
              You'll be registered as the team captain. You can add team members after registration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="starting_time" className="block text-sm font-medium text-gray-300 mb-1">
                Available From *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="time"
                  id="starting_time"
                  name="starting_time"
                  value={formData.starting_time}
                  onChange={handleChange}
                  required
                  className="w-full py-3 pl-10 pr-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#07f468] focus:border-transparent transition-all"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">When you're typically available to play</p>
            </div>
            <div>
              <label htmlFor="finishing_time" className="block text-sm font-medium text-gray-300 mb-1">
                Available Until *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="time"
                  id="finishing_time"
                  name="finishing_time"
                  value={formData.finishing_time}
                  onChange={handleChange}
                  required
                  min={formData.starting_time} // HTML5 validation to help ensure finishing time is after starting time
                  className="w-full py-3 pl-10 pr-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#07f468] focus:border-transparent transition-all"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Must be later than start time</p>
            </div>
          </div>
          
          {/* Explanation section */}
          <div className="bg-[#07f468]/10 p-4 rounded-lg text-sm text-gray-300 border border-[#07f468]/20 mt-4">
            <p className="flex items-start">
              <InfoIcon className="w-5 h-5 text-[#07f468] mr-2 flex-shrink-0 mt-0.5" />
              Upon registration, your team will be created with a default name, which can be customized later from your profile. Team statistics (matches, rating, etc.) will be initialized with default values.
            </p>
          </div>
      </div>
      
      {submitError && (
          <div className="mt-6 bg-red-500/20 border border-red-500 text-white p-4 rounded-lg text-sm">
          {submitError}
        </div>
      )}
      
        <div className="flex justify-end space-x-3 mt-8">
        <button
          type="button"
          onClick={onClose}
            className="border border-white/20 text-white py-3 px-6 rounded-lg hover:bg-white/5 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
            className="bg-[#07f468] text-black font-semibold py-3 px-6 rounded-lg hover:bg-[#06d35a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                Registering...
              </>
            ) : (
              <>
                Register Team
                <Shield className="w-5 h-5 ml-2" />
              </>
            )}
        </button>
      </div>
    </form>
    </>
  );
};

export default FindPlayerTeam;


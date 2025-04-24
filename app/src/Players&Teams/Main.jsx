import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, Filter, X, Calendar, Clock, UserPlus, Users, Trophy, ChevronDown, Play, Pause, ArrowRight, MapPin, Shield, Award } from 'lucide-react';
import NavBar from '../Component/NavBar';

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
    setShowTeamForm(true);
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
  
  // Fetch players and teams on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch players
        const playersResponse = await playersService.getAllPlayers();
        console.log('Players API response:', playersResponse);
        
        // Check for the specific response format with data property
        let playersData = [];
        if (playersResponse && playersResponse.data) {
          playersData = playersResponse.data;
        } else if (Array.isArray(playersResponse)) {
          playersData = playersResponse;
        }
        
        // Map API response to expected format if needed
        const formattedPlayers = Array.isArray(playersData) 
          ? playersData.map(player => {
              if (!player) return null;
              return {
                id: player.id_player || 0,
          // Use placeholder name since actual name might be in a user/compte table
                name: player.name || `Player ${player.id_player || 'Unknown'}`,
                position: player.position || 'Unknown',
                rating: typeof player.rating === 'number' ? player.rating : 0,
                matchesPlayed: typeof player.total_matches === 'number' ? player.total_matches : 0,
                image: player.image || null,
                starting_time: player.starting_time || null,
                finishing_time: player.finishing_time || null,
                id_compte: player.id_compte || null  // Keep this for reference
          // Add other properties as needed
              };
            }).filter(Boolean) // Remove any null entries
          : [];
        
        setPlayers(formattedPlayers);
        
        // Fetch teams
        const teamsResponse = await teamsService.getAllTeams();
        console.log('Teams API response:', teamsResponse);
        
        // Check for the specific response format with data property
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
              return {
                id: team.id_teams || 0,
          // Use placeholder name since actual name might be in another table
                name: team.name || `Team ${team.id_teams || 'Unknown'}`,
                rating: typeof team.rating === 'number' ? team.rating : 0,
                image: team.image || null,
                captain: team.capitain || null,  // Maintain original property name from API
                starting_time: team.starting_time || null,
                finishing_time: team.finishing_time || null
          // Add other properties as needed
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
          >
            <source src="https://res.cloudinary.com/dlt4bs1dn/video/upload/v1680732060/soccer-video_pgfovl.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {/* Video controls */}
          <button 
            onClick={handleVideoToggle}
            className="absolute bottom-8 right-8 z-30 bg-white/10 backdrop-blur-md rounded-full p-3 hover:bg-white/20 transition-all"
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
            />
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#07f468] text-black font-bold py-3 px-8 rounded-xl inline-flex items-center justify-center hover:bg-[#06d35a] transition-all shadow-lg shadow-[#07f468]/20"
                  onClick={() => setActiveTab('players')}
                >
                  <Users className="w-5 h-5 mr-2" />
                  Find Players
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/10 backdrop-blur-md text-white font-bold py-3 px-8 rounded-xl inline-flex items-center justify-center hover:bg-white/20 transition-all border border-white/10"
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
      <section id="top-rated" className="py-24 bg-[#111]">
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
                            src={player.image || 'https://discuss.cakewalk.com/uploads/monthly_2024_03/imported-photo-22646.thumb.jpeg.34bfea5fe763a56356574f4c413f0f17.jpeg'} 
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
                onClick={() => setActiveTab('players')}
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
                            src={team.image || 'https://discuss.cakewalk.com/uploads/monthly_2024_03/imported-photo-22646.thumb.jpeg.34bfea5fe763a56356574f4c413f0f17.jpeg'} 
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
                onClick={() => setActiveTab('teams')}
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
                ? (Array.isArray(filteredPlayers) ? filteredPlayers : []).map((player, index) => (
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
                        src={player.image || 'https://discuss.cakewalk.com/uploads/monthly_2024_03/imported-photo-22646.thumb.jpeg.34bfea5fe763a56356574f4c413f0f17.jpeg'}
                        alt={player.name || 'Player'}
                        className="w-full h-full object-cover object-center group-hover:scale-110 transition-all duration-700 ease-in-out"
                      />
                      <div className="absolute bottom-4 left-4 z-20 flex items-center">
                        <span className="bg-[#07f468] text-black text-sm font-bold px-3 py-1 rounded-full">
                          {player.position || 'Player'}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xl font-bold truncate">{player.name || 'Unknown Player'}</h3>
                        <div className="flex items-center bg-[#07f468]/10 px-2 py-1 rounded-full">
                          <span className="mr-1 font-medium">{player.rating || '4.5'}</span>
                          <Star className="w-4 h-4 text-[#07f468]" fill="#07f468" />
                        </div>
                      </div>
                      <div className="text-gray-400 text-sm mb-4">
                        <p className="flex items-center">
                          <Trophy className="w-4 h-4 mr-2 text-[#07f468]" />
                          Matches: {player.matchesPlayed || '0'}
                        </p>
                      </div>
                      <button className="w-full py-2.5 mt-2 rounded-lg bg-white/5 text-white text-sm font-medium hover:bg-[#07f468]/80 hover:text-black transition-all duration-300 flex items-center justify-center">
                        View Profile
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </button>
                    </div>
                  </motion.div>
                ))
                : (Array.isArray(filteredTeams) ? filteredTeams : []).map((team, index) => (
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
                        src={team.image || 'https://discuss.cakewalk.com/uploads/monthly_2024_03/imported-photo-22646.thumb.jpeg.34bfea5fe763a56356574f4c413f0f17.jpeg'}
                        alt={team.name || 'Team'}
                        className="w-full h-full object-cover object-center group-hover:scale-110 transition-all duration-700 ease-in-out"
                      />
                      <div className="absolute bottom-4 left-4 z-20 flex items-center">
                        <span className="bg-[#07f468] text-black text-sm font-bold px-3 py-1 rounded-full">
                          Team
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xl font-bold truncate">{team.name || 'Unknown Team'}</h3>
                        <div className="flex items-center bg-[#07f468]/10 px-2 py-1 rounded-full">
                          <span className="mr-1 font-medium">{team.rating || '4.5'}</span>
                          <Star className="w-4 h-4 text-[#07f468]" fill="#07f468" />
                        </div>
                      </div>
                      <div className="text-gray-400 text-sm mb-4">
                        <p className="flex items-center">
                          <Shield className="w-4 h-4 mr-2 text-[#07f468]" />
                          Team ID: {team.id || 'N/A'}
                        </p>
                      </div>
                      <button className="w-full py-2.5 mt-2 rounded-lg bg-white/5 text-white text-sm font-medium hover:bg-[#07f468]/80 hover:text-black transition-all duration-300 flex items-center justify-center">
                        View Team
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </button>
                    </div>
                  </motion.div>
                ))}
          </div>
          )}

          {/* No results state */}
          {!loading && !error && activeTab === 'players' && filteredPlayers.length === 0 && (
            <div className="text-center py-16 bg-white/5 rounded-xl border border-white/10">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-500" />
              <p className="text-xl font-medium text-white mb-2">No players found</p>
              <p className="text-base text-gray-400 mb-6 max-w-md mx-auto">We couldn't find any players matching your search criteria. Try adjusting your filters or create a new player profile.</p>
              <button 
                className="bg-[#07f468] text-black font-bold py-2.5 px-6 rounded-lg hover:bg-[#06d35a] transition-all"
                onClick={handleCreatePlayerProfile}
              >
                Create Player Profile
              </button>
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
      <section className="py-24 bg-gradient-to-br from-[#111] to-[#171717]">
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
                  >
                    <UserPlus className="w-5 h-5 mr-2" />
                Create Player Profile
                  </motion.button>
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
                    src={selectedPlayer.image || 'https://discuss.cakewalk.com/uploads/monthly_2024_03/imported-photo-22646.thumb.jpeg.34bfea5fe763a56356574f4c413f0f17.jpeg'}
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
                        <span className="mr-1 font-medium">{selectedPlayer.rating || '4.5'}</span>
                        <Star className="w-3.5 h-3.5 text-[#07f468]" fill="#07f468" />
                      </div>
                    </div>
                    <h2 className="text-3xl font-bold">{selectedPlayer.name}</h2>
                    <p className="text-gray-400 mt-1">Member since {new Date().getFullYear()}</p>
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
                          <span className="text-gray-400">Matches Played</span>
                          <span className="font-bold">{selectedPlayer.matchesPlayed || '0'}</span>
              </div>
                        <div className="w-full bg-white/10 rounded-full h-2.5">
                          <div className="bg-gradient-to-r from-[#07f468] to-[#9EF01A] h-2.5 rounded-full" 
                               style={{ width: `${Math.min(100, ((selectedPlayer.matchesPlayed || 0) / 50) * 100)}%` }}></div>
              </div>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-400">Goals Scored</span>
                          <span className="font-bold">{selectedPlayer.goalsScored || '0'}</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2.5">
                          <div className="bg-gradient-to-r from-[#07f468] to-[#9EF01A] h-2.5 rounded-full" 
                               style={{ width: `${Math.min(100, ((selectedPlayer.goalsScored || 0) / 30) * 100)}%` }}></div>
                        </div>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-400">Assists</span>
                          <span className="font-bold">{selectedPlayer.assists || '0'}</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2.5">
                          <div className="bg-gradient-to-r from-[#07f468] to-[#9EF01A] h-2.5 rounded-full" 
                               style={{ width: `${Math.min(100, ((selectedPlayer.assists || 0) / 20) * 100)}%` }}></div>
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
                        <span>{selectedPlayer.starting_time || '18:00'} - {selectedPlayer.finishing_time || '22:00'}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                      <Award className="w-5 h-5 mr-2 text-[#07f468]" />
                      Achievements
                    </h3>
                    <div className="bg-white/5 p-4 rounded-xl">
                {selectedPlayer.history && selectedPlayer.history.length > 0 ? (
                        <ul className="space-y-2">
                    {selectedPlayer.history.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <div className="w-2 h-2 mt-1.5 rounded-full bg-[#07f468] mr-2"></div>
                              <span className="text-sm">{item}</span>
                            </li>
                    ))}
                </ul>
                ) : (
                        <p className="text-gray-400">No achievements recorded yet</p>
                )}
              </div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-center md:justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-[#07f468] text-black font-bold py-3 px-8 rounded-xl inline-flex items-center justify-center hover:bg-[#06d35a] transition-all shadow-lg shadow-[#07f468]/20"
                  onClick={() => setShowInviteForm(true)}
                >
                    <Calendar className="w-5 h-5 mr-2" />
                  Invite to Play
                  </motion.button>
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
              />
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
                    src={selectedTeam.image || 'https://discuss.cakewalk.com/uploads/monthly_2024_03/imported-photo-22646.thumb.jpeg.34bfea5fe763a56356574f4c413f0f17.jpeg'}
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
                        <span className="mr-1 font-medium">{selectedTeam.rating || '4.5'}</span>
                        <Star className="w-3.5 h-3.5 text-[#07f468]" fill="#07f468" />
                      </div>
                    </div>
                    <h2 className="text-3xl font-bold">{selectedTeam.name}</h2>
                    <p className="text-gray-400 mt-1">Founded: {selectedTeam.founded || 'Not specified'}</p>
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
                          <div className="font-medium">{selectedTeam.captain || 'Not specified'}</div>
              </div>
                        <div className="flex mb-2">
                          <div className="w-32 text-gray-400">Home Stadium</div>
                          <div className="font-medium">{selectedTeam.homeStadium || 'Not specified'}</div>
              </div>
                        <div className="flex mb-2">
                          <div className="w-32 text-gray-400">League</div>
                          <div className="font-medium">{selectedTeam.league || 'Not specified'}</div>
                        </div>
                        <div className="flex">
                          <div className="w-32 text-gray-400">Team ID</div>
                          <div className="font-medium">{selectedTeam.id || 'N/A'}</div>
                        </div>
                      </div>
                      
                      <div className="bg-white/5 p-4 rounded-xl">
                        <h4 className="font-medium mb-3">Team Description</h4>
                        <p className="text-gray-300 text-sm">{selectedTeam.description || 'No team description available.'}</p>
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
                        <span>{selectedTeam.starting_time || '18:00'} - {selectedTeam.finishing_time || '22:00'}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                      <Trophy className="w-5 h-5 mr-2 text-[#07f468]" />
                      Team Achievements
                    </h3>
                    <div className="bg-white/5 p-4 rounded-xl">
                {selectedTeam.achievements && selectedTeam.achievements.length > 0 ? (
                        <ul className="space-y-3">
                    {selectedTeam.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-[#07f468]/20 flex items-center justify-center mr-3">
                                <Trophy className="w-4 h-4 text-[#07f468]" />
                              </div>
                        <span>{achievement}</span>
                  </li>
                    ))}
                </ul>
                ) : (
                        <p className="text-gray-400">No tournament history available</p>
                )}
              </div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-center md:justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-[#07f468] text-black font-bold py-3 px-8 rounded-xl inline-flex items-center justify-center hover:bg-[#06d35a] transition-all shadow-lg shadow-[#07f468]/20"
                  onClick={() => setShowInviteForm(true)}
                >
                    <Calendar className="w-5 h-5 mr-2" />
                  Contact Team
                  </motion.button>
                </div>
              </div>
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
const InviteForm = ({ selectedPlayer, selectedTeam, currentUser, onClose }) => {
  const [formData, setFormData] = useState({
    match_date: '',
    starting_time: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Check if user is logged in
      if (!currentUser || !currentUser.id) {
        setSubmitError('You must be logged in to send requests.');
        setIsSubmitting(false);
        return;
      }

      // Prepare data for API with the correct field names
      const requestData = {
        sender: parseInt(currentUser.id, 10),
        receiver: selectedPlayer ? selectedPlayer.id_compte || selectedPlayer.id : (selectedTeam ? selectedTeam.id : null),
        match_date: formData.match_date,
        starting_time: formData.starting_time + ':00', // Add seconds to match the required H:i:s format
        message: formData.message || '',
        type: selectedPlayer ? 'PLAYER_REQUEST' : 'TEAM_REQUEST'
      };

      console.log('Sending request data:', requestData);

      // Send request to the API
      await playerRequestsService.createPlayerRequest(requestData);

      setSubmitSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error submitting request:', error);
      if (error.response && error.response.data && error.response.data.error) {
        // Display the specific error from the API if available
        setSubmitError(JSON.stringify(error.response.data.error));
      } else {
        setSubmitError('Failed to send request. Please try again later.');
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
          className="bg-green-500 bg-opacity-20 border border-green-500 text-white p-4 rounded-lg"
        >
          Request sent successfully!
        </motion.div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="match_date" className="block text-sm font-medium text-gray-300 mb-1">
          Date
        </label>
        <div className="relative">
          <input
            type="date"
            id="match_date"
            name="match_date"
            value={formData.match_date}
            onChange={handleChange}
            required
            className="w-full py-2 px-4 rounded-lg bg-white bg-opacity-10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#07f468]"
          />
          <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300" />
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="starting_time" className="block text-sm font-medium text-gray-300 mb-1">
          Time
        </label>
        <div className="relative">
          <input
            type="time"
            id="starting_time"
            name="starting_time"
            value={formData.starting_time}
            onChange={handleChange}
            required
            className="w-full py-2 px-4 rounded-lg bg-white bg-opacity-10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#07f468]"
          />
          <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300" />
        </div>
      </div>
      <div className="mb-6">
        <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
          Message (optional)
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows="3"
          className="w-full py-2 px-4 rounded-lg bg-white bg-opacity-10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#07f468]"
          placeholder="Add a personal message..."
        ></textarea>
      </div>
      
      {submitError && (
        <div className="mb-4 bg-red-500 bg-opacity-20 border border-red-500 text-white p-3 rounded-lg text-sm">
          {submitError}
        </div>
      )}
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#07f468] text-black font-semibold py-2 px-4 rounded-lg hover:bg-[#06d35a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Sending...' : 'Send Request'}
        </button>
      </div>
    </form>
  );
};

// PlayerForm component
const PlayerForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    position: '',
    starting_time: '',
    finishing_time: '',
    bio: '',
    image: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [userIdError, setUserIdError] = useState(false);

  useEffect(() => {
    // Set default times if not already set
    if (!formData.starting_time) {
      setFormData(prev => ({ ...prev, starting_time: '18:00' }));
    }
    if (!formData.finishing_time) {
      setFormData(prev => ({ ...prev, finishing_time: '22:00' }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files.length > 0) {
      setFormData(prev => ({ ...prev, image: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setUserIdError(false);

    // Validate times
    const startTime = formData.starting_time;
    const finishTime = formData.finishing_time;
    
    // Ensure time is in H:i:s format by adding seconds
    const formattedStartTime = startTime.includes(':') && startTime.split(':').length === 2 
      ? `${startTime}:00` 
      : startTime;
    
    const formattedFinishTime = finishTime.includes(':') && finishTime.split(':').length === 2 
      ? `${finishTime}:00` 
      : finishTime;
    
    // Check if finish time is after start time
    if (formattedStartTime >= formattedFinishTime) {
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

      // First check if this user already has a player profile
      try {
        // You can add a simple GET request to check if a player with this id_compte exists
        const existingPlayersResponse = await playersService.getAllPlayers();
        const allPlayers = Array.isArray(existingPlayersResponse) ? existingPlayersResponse : 
                          (existingPlayersResponse.data || []);
        
        const userAlreadyHasProfile = allPlayers.some(player => 
          player.id_compte === parseInt(userId) || player.id_compte === userId
        );
        
        if (userAlreadyHasProfile) {
          setSubmitError('You already have a player profile. You cannot create multiple profiles with the same account.');
          setIsSubmitting(false);
          return;
        }
      } catch (checkError) {
        console.error('Error checking existing player:', checkError);
        // Continue with creation attempt even if check fails
      }

      // Create FormData object for file upload
      const playerFormData = new FormData();
      
      // Add user ID from session as id_compte
      playerFormData.append('id_compte', userId);
      
      // Add player specific fields from Players.php model with correct time format
      playerFormData.append('position', formData.position);
      playerFormData.append('starting_time', formattedStartTime);
      playerFormData.append('finishing_time', formattedFinishTime);
      
      // Set initial values for all required fields from Players.php model
      playerFormData.append('total_matches', 0);
      playerFormData.append('rating', 0);
      playerFormData.append('misses', 0);
      playerFormData.append('invites_accepted', 0);
      playerFormData.append('invites_refused', 0);
      playerFormData.append('total_invites', 0);
      
      // Add additional data that might be useful
      playerFormData.append('bio', formData.bio || '');
      
      if (formData.image) {
        playerFormData.append('image', formData.image);
      }

      // Create player profile
      await playersService.createPlayer(playerFormData);

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
          setSubmitError("You already have a player profile. You cannot create multiple profiles with the same account.");
        } else if (errorData.details && 
                  (errorData.details.starting_time || errorData.details.finishing_time)) {
          setSubmitError("Please ensure your available times are in the correct format and that finish time is after start time.");
        } else {
          setSubmitError(errorData.error || errorData.message || 'Failed to create player profile. Please try again later.');
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
          <div className="w-16 h-16 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-4">
            <Trophy className="w-8 h-8 text-green-500" />
          </div>
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
        <h2 className="text-2xl font-bold">Create Player Profile</h2>
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
          
          <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-300 mb-1">
          Profile Image
        </label>
            <div className="relative">
        <input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          onChange={handleChange}
                className="w-full py-3 px-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#07f468] focus:border-transparent transition-all"
        />
      </div>
            <p className="text-xs text-gray-400 mt-1">Recommended size: 300x300 pixels</p>
          </div>
          
          <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-1">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
              rows="4"
              className="w-full py-3 px-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#07f468] focus:border-transparent transition-all"
              placeholder="Tell us about yourself, your experience, preferred play style, etc."
        ></textarea>
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
    name: '',
    starting_time: '',
    finishing_time: '',
    image: null,
    homeStadium: '',
    league: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [userIdError, setUserIdError] = useState(false);

  useEffect(() => {
    // Set default times if not already set
    if (!formData.starting_time) {
      setFormData(prev => ({ ...prev, starting_time: '18:00' }));
    }
    if (!formData.finishing_time) {
      setFormData(prev => ({ ...prev, finishing_time: '22:00' }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files.length > 0) {
      setFormData(prev => ({ ...prev, image: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setUserIdError(false);

    // Validate team name
    if (!formData.name || formData.name.trim() === '') {
      setSubmitError('Team name is required');
      setIsSubmitting(false);
      return;
    }

    // Validate times
    const startTime = formData.starting_time;
    const finishTime = formData.finishing_time;
    
    // Ensure time is in H:i:s format by adding seconds
    const formattedStartTime = startTime.includes(':') && startTime.split(':').length === 2 
      ? `${startTime}:00` 
      : startTime;
    
    const formattedFinishTime = finishTime.includes(':') && finishTime.split(':').length === 2 
      ? `${finishTime}:00` 
      : finishTime;
    
    // Check if finish time is after start time
    if (formattedStartTime >= formattedFinishTime) {
      setSubmitError('Finish time must be after start time');
      setIsSubmitting(false);
      return;
    }

    try {
      // Get user ID from session storage (the team captain)
      const userId = sessionStorage.getItem('userId') || localStorage.getItem('userId');
      
      if (!userId) {
        setUserIdError(true);
        setSubmitError('You must be logged in to register a team. Please log in and try again.');
        setIsSubmitting(false);
        return;
      }

      // Create FormData object for file upload
      const teamFormData = new FormData();

      // Add required fields from Teams.php model
      teamFormData.append('name', formData.name);
      teamFormData.append('capitain', userId); // Set current user as captain
      teamFormData.append('starting_time', formattedStartTime);
      teamFormData.append('finishing_time', formattedFinishTime);
      
      // Set initial values for all required fields from Teams.php model
      teamFormData.append('total_matches', 0);
      teamFormData.append('rating', 0);
      teamFormData.append('misses', 0);
      teamFormData.append('invites_accepted', 0);
      teamFormData.append('invites_refused', 0);
      teamFormData.append('total_invites', 0);
      
      // Add additional data
      teamFormData.append('homeStadium', formData.homeStadium || '');
      teamFormData.append('league', formData.league || '');
      teamFormData.append('description', formData.description || '');
      
      if (formData.image) {
        teamFormData.append('logo', formData.image); // Note: backend expects 'logo', not 'image'
      }

      // Create team
      await teamsService.createTeam(teamFormData);

      setSubmitSuccess(true);
      setTimeout(() => {
        onClose();
        // Refresh team list
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Error creating team:', error);
      
      // Handle the specific validation errors from the backend
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        
        if (errorData.errors && errorData.errors.name) {
          setSubmitError("Team name already exists. Please choose a different name.");
        } else if (errorData.details && 
                  (errorData.details.starting_time || errorData.details.finishing_time)) {
          setSubmitError("Please ensure your available times are in the correct format and that finish time is after start time.");
        } else if (errorData.errors && errorData.errors.logo) {
          setSubmitError("Logo image is invalid. Please use JPEG, PNG, or GIF format under 2MB.");
        } else {
          setSubmitError(errorData.error || errorData.message || 'Failed to register team. Please try again later.');
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

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Register a Team</h2>
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
        <label htmlFor="team-name" className="block text-sm font-medium text-gray-300 mb-1">
          Team Name *
        </label>
        <input
          type="text"
          id="team-name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
              className="w-full py-3 px-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#07f468] focus:border-transparent transition-all"
              placeholder="Enter your team name"
        />
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
          
          <div>
        <label htmlFor="team-image" className="block text-sm font-medium text-gray-300 mb-1">
          Team Logo
        </label>
            <div className="relative">
        <input
          type="file"
          id="team-image"
          name="image"
          accept="image/*"
          onChange={handleChange}
                className="w-full py-3 px-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#07f468] focus:border-transparent transition-all"
        />
      </div>
            <p className="text-xs text-gray-400 mt-1">Recommended size: 300x300 pixels</p>
      </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
        <label htmlFor="homeStadium" className="block text-sm font-medium text-gray-300 mb-1">
          Home Stadium
        </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          id="homeStadium"
          name="homeStadium"
          value={formData.homeStadium}
          onChange={handleChange}
                  className="w-full py-3 pl-10 pr-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#07f468] focus:border-transparent transition-all"
                  placeholder="Where does your team play?"
        />
      </div>
            </div>
            <div>
        <label htmlFor="league" className="block text-sm font-medium text-gray-300 mb-1">
          League
        </label>
              <div className="relative">
                <Trophy className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          id="league"
          name="league"
          value={formData.league}
          onChange={handleChange}
                  className="w-full py-3 pl-10 pr-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#07f468] focus:border-transparent transition-all"
                  placeholder="Team's league or division"
        />
      </div>
            </div>
          </div>
          
          <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
          Team Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
              rows="4"
              className="w-full py-3 px-4 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#07f468] focus:border-transparent transition-all"
              placeholder="Tell us about your team, your achievements, playing style, etc."
        ></textarea>
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


import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, Filter, X, Users, Trophy, ChevronLeft, ChevronRight, ArrowLeft, Shield, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import teamsService from '../lib/services/user/teamsService';
import playerRequestsService from '../lib/services/user/playerRequestsService';

const AllTeams = () => {
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRating, setFilterRating] = useState('');
  
  // Client-side pagination state (since API doesn't provide pagination for teams)
  const [currentPage, setCurrentPage] = useState(1);
  const [teamsPerPage] = useState(8);
  
  // Team invitation state
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Get user ID and player ID for "Your Team" label
  const userId = parseInt(sessionStorage.getItem('userId'), 10);
  const playerId = parseInt(sessionStorage.getItem('player_id'), 10);
  
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
  
  // Fetch teams from API
  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      try {
        // First try the new API format with parameters
        let response;
        try {
          response = await teamsService.getAllTeams();
        } catch (firstError) {
          console.error('Error with initial API call, trying fallback:', firstError);
          // If that fails, try a simpler approach without params
          response = await fetch(`${process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000'}/api/user/v1/teams`)
            .then(res => {
              if (!res.ok) throw new Error('Network response was not ok');
              return res.json();
            });
        }
        
        console.log('Teams API response:', response);
        
        // Extract teams data from response
        let teamsData = [];
        if (response && response.data) {
          teamsData = response.data;
        } else if (Array.isArray(response)) {
          teamsData = response;
        } else if (response && Array.isArray(response.teams)) {
          // Alternative response format
          teamsData = response.teams;
        }
        
        // Map API response to the format needed for UI
        const formattedTeams = Array.isArray(teamsData)
          ? teamsData.map(team => {
              if (!team) return null;
              
              // Get captain details if available
              const captainDetails = team.captain_details || {};
              
              // Check if this team belongs to the current user using player_id
              const isUserTeam = userId && (
                team.capitain === userId || 
                parseInt(team.capitain, 10) === userId || 
                (playerId && team.capitain === playerId) ||
                (playerId && parseInt(team.capitain, 10) === playerId)
              );
              
              return {
                id: team.id_teams || 0,
                name: team.team_name || `Team ${team.id_teams}`,
                rating: typeof team.rating === 'number' ? team.rating : 0,
                image: null, // Team images not available in the API response
                captain: team.capitain || null, // Store the captain ID from 'capitain' field
                captainName: captainDetails.name || 'Unknown',
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
        console.error('Error fetching teams:', err);
        setError('Failed to load teams. Please try again later.');
        setLoading(false);
        
        // Try to use test data as a last resort
        const dummyTeams = [
          {
            id: 1,
            name: 'Test Team 1',
            rating: 4,
            captain: null,
            captainName: 'Captain 1',
            members_count: 5,
            total_matches: 10,
            isUserTeam: false
          },
          {
            id: 2,
            name: 'Test Team 2',
            rating: 3,
            captain: null,
            captainName: 'Captain 2',
            members_count: 8,
            total_matches: 6,
            isUserTeam: false
          },
          {
            id: 3,
            name: 'Your Team',
            rating: 5,
            captain: userId,
            captainName: 'You',
            members_count: 7,
            total_matches: 15,
            isUserTeam: true
          }
        ];
        
        setTeams(dummyTeams);
      }
    };
    
    fetchTeams();
  }, [userId, playerId]);
  
  // Update filtered teams when search query, filter rating, or teams change
  useEffect(() => {
    if (!Array.isArray(teams)) {
      setFilteredTeams([]);
      return;
    }
    
    const filtered = teams.filter(team => {
      if (!team) return false;
      
      // Check if name matches search query
      const nameMatches = team.name && 
        typeof team.name === 'string' && 
        team.name.toLowerCase().includes((searchQuery || '').toLowerCase());
      
      // Check if rating matches filter (if any)
      const ratingMatches = !filterRating || 
        (typeof team.rating === 'number' && 
         filterRating === team.rating.toString());
      
      return nameMatches && ratingMatches;
    });
    
    setFilteredTeams(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [teams, searchQuery, filterRating]);
  
  // Get current teams for pagination
  const indexOfLastTeam = currentPage * teamsPerPage;
  const indexOfFirstTeam = indexOfLastTeam - teamsPerPage;
  const currentTeams = filteredTeams.slice(indexOfFirstTeam, indexOfLastTeam);
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredTeams.length / teamsPerPage);
  
  // Handle page change
  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };
  
  // Generate pagination buttons
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 5;
    
    // If there's only one page, don't show pagination
    if (totalPages <= 1) return [];
    
    // Always show first page
    buttons.push(
      <button
        key="first"
        onClick={() => handlePageChange(1)}
        className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-[#07f468] text-black font-bold' : 'bg-white/10 hover:bg-white/20'}`}
      >
        1
      </button>
    );
    
    // Calculate range of visible page buttons
    let startPage = Math.max(2, currentPage - Math.floor(maxVisibleButtons / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisibleButtons - 3);
    
    if (endPage - startPage < maxVisibleButtons - 3) {
      startPage = Math.max(2, endPage - (maxVisibleButtons - 3) + 1);
    }
    
    // Add ellipsis after first page if needed
    if (startPage > 2) {
      buttons.push(
        <span key="ellipsis1" className="px-2">
          ...
        </span>
      );
    }
    
    // Add page buttons
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded-md ${currentPage === i ? 'bg-[#07f468] text-black font-bold' : 'bg-white/10 hover:bg-white/20'}`}
        >
          {i}
        </button>
      );
    }
    
    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      buttons.push(
        <span key="ellipsis2" className="px-2">
          ...
        </span>
      );
    }
    
    // Always show last page if there is more than one page
    if (totalPages > 1) {
      buttons.push(
        <button
          key="last"
          onClick={() => handlePageChange(totalPages)}
          className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'bg-[#07f468] text-black font-bold' : 'bg-white/10 hover:bg-white/20'}`}
        >
          {totalPages}
        </button>
      );
    }
    
    return buttons;
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121212] to-[#1e1e1e] text-white font-sans py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            to="/players" 
            className="flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>Back to Players & Teams</span>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-3 inline-block relative">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#07f468] to-[#9EF01A]">All Teams</span>
            <div className="absolute -bottom-2 left-0 w-24 h-1 bg-gradient-to-r from-[#07f468] to-[#9EF01A] rounded-full"></div>
          </h1>
          <p className="text-gray-400 mt-4 max-w-2xl">
            Find and connect with football teams in your area. Join a team that matches your playing style and schedule.
          </p>
        </div>
        
        {/* Search and Filter */}
        <div className="bg-gradient-to-r from-[#222] to-[#1A1A1A] rounded-xl p-6 mb-8 shadow-xl border border-white/5">
          <div className="flex flex-col md:flex-row items-stretch gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="text-gray-400 w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Search teams by name..."
                className="w-full py-3 pl-12 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#07f468] focus:border-transparent transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="relative md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="text-gray-400 w-5 h-5" />
              </div>
              <select
                className="w-full py-3 pl-12 pr-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#07f468] focus:border-transparent appearance-none"
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1rem' }}
              >
                <option className='bg-[#222]' value="">All Ratings</option>
                <option className='bg-[#222]' value="5">★★★★★ (5)</option>
                <option className='bg-[#222]' value="4">★★★★☆ (4)</option>
                <option className='bg-[#222]' value="3">★★★☆☆ (3)</option>
                <option className='bg-[#222]' value="2">★★☆☆☆ (2)</option>
                <option className='bg-[#222]' value="1">★☆☆☆☆ (1)</option>
                <option className='bg-[#222]' value="0">☆☆☆☆☆ (0)</option>
              </select>
            </div>
          </div>
        </div>
          
        {/* Teams Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-[#07f468] border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-medium text-[#07f468]">Loading</span>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-500/20 border border-red-500 text-white p-6 rounded-xl mb-8 text-center shadow-lg backdrop-blur-md">
            <X className="w-8 h-8 mx-auto mb-4 text-red-400" />
            <p className="text-lg font-medium">{error}</p>
            <p className="text-sm text-gray-300 mt-2">Please refresh the page or try again later.</p>
          </div>
        ) : (
          <>
            {filteredTeams.length === 0 ? (
              <div className="text-center py-16 bg-white/5 rounded-xl border border-white/10">
                <Search className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                <p className="text-xl font-medium text-white mb-2">No teams found</p>
                <p className="text-base text-gray-400 mb-6 max-w-md mx-auto">We couldn't find any teams matching your search criteria. Try adjusting your filters or create a new team.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {currentTeams.map((team, index) => {
                  // Add null check before rendering
                  if (!team) return null;
                  
                  return (
                    <motion.div
                      key={team.id || `team-grid-${index}`}
                      className="bg-gradient-to-br from-[#222] to-[#1a1a1a] rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-white/5 group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="h-44 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent z-10"></div>
                        <img
                          src="https://discuss.cakewalk.com/uploads/monthly_2024_03/imported-photo-22646.thumb.jpeg.34bfea5fe763a56356574f4c413f0f17.jpeg"
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
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTeam(team);
                            setShowInviteForm(true);
                          }}
                          className="w-full py-2.5 mt-2 rounded-lg bg-[#07f468] text-black text-sm font-medium hover:bg-[#07f468]/80 transition-all duration-300 flex items-center justify-center"
                          disabled={team.isUserTeam}
                        >
                          {team.isUserTeam ? "Your Team" : "Contact Team"}
                          {!team.isUserTeam && <Calendar className="w-4 h-4 ml-2" />}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
            
            {/* Pagination */}
            {filteredTeams.length > 0 && totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-10">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg ${currentPage === 1 ? 'text-gray-500 cursor-not-allowed' : 'bg-white/10 hover:bg-white/20'}`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <div className="flex space-x-1">
                  {renderPaginationButtons()}
                </div>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg ${currentPage === totalPages ? 'text-gray-500 cursor-not-allowed' : 'bg-white/10 hover:bg-white/20'}`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
            
            {/* Pagination info */}
            {filteredTeams.length > 0 && (
              <div className="text-center text-gray-400 text-sm mt-4">
                Showing {indexOfFirstTeam + 1}-{Math.min(indexOfLastTeam, filteredTeams.length)} of {filteredTeams.length} teams
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Team Invite Form Modal */}
      <AnimatePresence>
        {showInviteForm && selectedTeam && (
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
                Contact {selectedTeam.name || "Team"}
              </h2>
              
              <TeamInviteForm 
                selectedTeam={selectedTeam}
                currentUser={currentUser}
                onClose={() => setShowInviteForm(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// TeamInviteForm component
const TeamInviteForm = ({ selectedTeam, currentUser, onClose }) => {
  const [formData, setFormData] = useState({
    match_date: '',
    starting_time: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
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

    // Set default match date to tomorrow
    setFormData(prev => ({
      ...prev,
      match_date: tomorrowFormatted
    }));

    // Set a default time based on team's availability
    if (selectedTeam) {
      const defaultTime = selectedTeam.starting_time ? 
        selectedTeam.starting_time.substring(0, 5) : '18:00';
      setFormData(prev => ({ ...prev, starting_time: defaultTime }));
    }
  }, [selectedTeam]);

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
    } else if (selectedTeam) {
      // Check if time is within available hours
      const teamStartTime = selectedTeam.starting_time ? 
        selectedTeam.starting_time.substring(0, 5) : '00:00';
      const teamEndTime = selectedTeam.finishing_time ? 
        selectedTeam.finishing_time.substring(0, 5) : '23:59';
        
      if (formData.starting_time < teamStartTime || formData.starting_time > teamEndTime) {
        errors.starting_time = `Time must be between ${teamStartTime} and ${teamEndTime}`;
      }
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
        setSubmitError('You need to create a player profile before contacting teams.');
        setIsSubmitting(false);
        return;
      }

      // Prepare data for API
      const requestData = {
        sender: parseInt(playerId, 10),
        receiver: selectedTeam.id,
        match_date: formData.match_date,
        starting_time: formData.starting_time + ':00',
        message: formData.message || 'Would your team like to play a match?',
        request_type: 'team_match'
      };
      
      console.log('Sending team request data:', requestData);

      // Send request to the API
      await playerRequestsService.createPlayerRequest(requestData);

      setSubmitSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error submitting team request:', error);
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
          <p className="mb-4">Your match request has been sent to the team. You'll be notified when they respond.</p>
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
          <p className="mb-4">You need to create a player profile before contacting teams.</p>
          <Link 
            to="/players"
            className="bg-white text-yellow-700 font-semibold py-2 px-6 rounded-lg hover:bg-yellow-50 transition-colors inline-block"
          >
            Create Player Profile
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-[#07f468]" />
          {`Contact ${selectedTeam?.name || 'Team'}`}
        </h3>
        <p className="text-gray-400 text-sm">
          {`Team available: ${selectedTeam?.starting_time ? selectedTeam.starting_time.substring(0, 5) : '--:--'} - ${selectedTeam?.finishing_time ? selectedTeam.finishing_time.substring(0, 5) : '--:--'}`}
        </p>
      </div>

      {submitError && (
        <div className="mb-6 bg-red-500/20 border border-red-500 text-white p-4 rounded-lg flex items-start">
          <X className="w-5 h-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
          <p>{submitError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
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
            {selectedTeam && `${selectedTeam.name} is available between ${selectedTeam.starting_time ? selectedTeam.starting_time.substring(0, 5) : '--:--'} and ${selectedTeam.finishing_time ? selectedTeam.finishing_time.substring(0, 5) : '--:--'}`}
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
            placeholder="Add details about the match proposal..."
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
            disabled={isSubmitting}
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

export default AllTeams; 
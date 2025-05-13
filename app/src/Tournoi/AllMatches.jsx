import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Calendar, Clock, Trophy, ChevronDown, Users, Filter, X, ArrowUpDown, Loader, ChevronLeft, ChevronRight } from 'lucide-react'
import matchesService from '../lib/services/user/matchesService'

export default function AllMatches() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [filters, setFilters] = useState({
    status: 'all', // all, upcoming, completed
    sortBy: 'date', // date, tournament
    sortOrder: 'desc' // asc, desc
  })
  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 10
  })

  useEffect(() => {
    fetchMatches(1) // Start with page 1
  }, [filters])

  const fetchMatches = async (page = 1) => {
    setLoading(true)
    try {
      const params = {
        include: 'tournoi,team1,team2',
        sort_by: filters.sortBy === 'tournament' ? 'tournoi_name' : 'match_date',
        sort_order: filters.sortOrder,
        page: page
      }

      if (filters.status === 'upcoming') {
        params.status = 'upcoming'
      } else if (filters.status === 'completed') {
        params.status = 'completed'
      }

      const result = await matchesService.getAllMatches(params)
      
      if (result.data && result.data.length > 0) {
        const formattedMatches = result.data.map(match => ({
          id: match.id_match,
          tournoi_name: match.tournoi?.name || 'Unknown Tournament',
          tournoi_id: match.id_tournoi,
          team1_name: match.team1?.team_name || 'Team A',
          team2_name: match.team2?.team_name || 'Team B',
          score1: match.score_team1 || 0,
          score2: match.score_team2 || 0,
          match_date: match.match_date ? new Date(match.match_date) : new Date(),
          status: match.status || 'scheduled',
          location: match.location || 'TBD',
          time: match.time || '00:00'
        }))
        setMatches(formattedMatches)
        
        // Update pagination info from meta data
        if (result.meta) {
          setPagination({
            currentPage: result.meta.current_page,
            lastPage: result.meta.last_page,
            total: result.meta.total,
            perPage: result.meta.per_page
          })
        }
      } else {
        // Set default matches if API returns empty
        setMatches(defaultMatches)
        setPagination({
          currentPage: 1,
          lastPage: 1,
          total: defaultMatches.length,
          perPage: 10
        })
      }
    } catch (error) {
      console.error('Failed to fetch match results:', error)
      setError('Failed to load matches')
      setMatches(defaultMatches)
      setPagination({
        currentPage: 1,
        lastPage: 1,
        total: defaultMatches.length,
        perPage: 10
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle page change
  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.lastPage) return
    fetchMatches(page)
  }

  // Filter matches based on search query
  const filteredMatches = matches.filter(match => 
    match.tournoi_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    match.team1_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    match.team2_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Toggle filter panel
  const toggleFilter = () => setFilterOpen(!filterOpen)

  // Update filter values
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  // Format date
  const formatDate = (date) => {
    try {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch (e) {
      return 'Invalid Date'
    }
  }

  // Generate pagination buttons
  const renderPagination = () => {
    const pages = []
    const { currentPage, lastPage } = pagination
    
    // Previous button
    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center justify-center w-10 h-10 rounded-full ${
          currentPage === 1 
            ? 'text-gray-500 cursor-not-allowed' 
            : 'text-white hover:bg-[#333] transition-colors'
        }`}
        aria-label="Previous page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
    )
    
    // First page
    if (currentPage > 3) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className={`flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#333] transition-colors`}
        >
          1
        </button>
      )
      
      if (currentPage > 4) {
        pages.push(
          <span key="ellipsis1" className="flex items-center justify-center w-10 h-10">
            ...
          </span>
        )
      }
    }
    
    // Pages around current
    for (let i = Math.max(1, currentPage - 1); i <= Math.min(lastPage, currentPage + 1); i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`flex items-center justify-center w-10 h-10 rounded-full ${
            i === currentPage 
              ? 'bg-[#07f468] text-[#1a1a1a] font-bold' 
              : 'text-white hover:bg-[#333] transition-colors'
          }`}
        >
          {i}
        </button>
      )
    }
    
    // Last page
    if (currentPage < lastPage - 2) {
      if (currentPage < lastPage - 3) {
        pages.push(
          <span key="ellipsis2" className="flex items-center justify-center w-10 h-10">
            ...
          </span>
        )
      }
      
      pages.push(
        <button
          key={lastPage}
          onClick={() => handlePageChange(lastPage)}
          className={`flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#333] transition-colors`}
        >
          {lastPage}
        </button>
      )
    }
    
    // Next button
    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === lastPage}
        className={`flex items-center justify-center w-10 h-10 rounded-full ${
          currentPage === lastPage 
            ? 'text-gray-500 cursor-not-allowed' 
            : 'text-white hover:bg-[#333] transition-colors'
        }`}
        aria-label="Next page"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    )
    
    return pages
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white font-sans pt-20">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-b from-[#222] to-[#1a1a1a]">
        {/* Top gradient border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#07f468] to-transparent opacity-70"></div>
        
        {/* Background pattern */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <motion.div 
            className="absolute w-[500px] h-[500px] rounded-full border border-[#07f468]/30 top-1/2 left-1/4"
            initial={{ scale: 0.8, x: -100, y: -100 }}
            animate={{ scale: 1.2, x: 100, y: 100, opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          ></motion.div>
          <motion.div 
            className="absolute w-[300px] h-[300px] rounded-full border border-[#07f468]/30 bottom-1/4 right-1/4"
            initial={{ scale: 1, x: 100, y: 100 }}
            animate={{ scale: 1.5, x: -100, y: -100, opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 15, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 2 }}
          ></motion.div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Match Results
              <motion.span
                className="block h-1 w-24 bg-gradient-to-r from-[#07f468] to-[#34d399] rounded-full mx-auto mt-4"
                initial={{ width: 0 }}
                animate={{ width: "6rem" }}
                transition={{ duration: 0.8, delay: 0.4 }}
              ></motion.span>
            </motion.h1>
            
            <motion.p
              className="text-gray-300 text-lg mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Stay updated with the latest scores and upcoming matches
            </motion.p>
            
            {/* Search and Filter Bar */}
            <motion.div 
              className="bg-[#252525] p-2 rounded-xl shadow-lg max-w-2xl mx-auto flex flex-col md:flex-row gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search by team or tournament..."
                  className="w-full bg-[#333] text-white rounded-lg py-3 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-[#07f468]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
              
              <button 
                className="bg-[#333] hover:bg-[#444] text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors relative"
                onClick={toggleFilter}
              >
                <Filter className="h-5 w-5 text-[#07f468]" />
                <span>Filters</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
              </button>
            </motion.div>
            
            {/* Filter Panel */}
            <AnimatePresence>
              {filterOpen && (
                <motion.div 
                  className="bg-[#252525] p-4 rounded-xl shadow-lg max-w-2xl mx-auto mt-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                      <select 
                        className="w-full bg-[#333] text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#07f468]"
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                      >
                        <option value="all">All Matches</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                    
                   
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">Order</label>
                      <select 
                        className="w-full bg-[#333] text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#07f468]"
                        value={filters.sortOrder}
                        onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                      >
                        <option value="desc">Newest First</option>
                        <option value="asc">Oldest First</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <button 
                      className="bg-[#07f468] hover:bg-[#06d35a] text-[#1a1a1a] px-4 py-2 rounded-lg text-sm font-medium"
                      onClick={() => setFilterOpen(false)}
                    >
                      Apply Filters
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Matches Section */}
      <section className="py-12 bg-[#1a1a1a]">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <motion.div 
                className="w-16 h-16 relative"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="absolute inset-0 border-4 border-[#07f468]/30 rounded-full"
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                ></motion.div>
                <div className="absolute inset-2 border-t-4 border-[#07f468] rounded-full"></div>
              </motion.div>
              <p className="mt-4 text-gray-400">Loading matches...</p>
            </div>
          ) : error ? (
            <motion.div 
              className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 max-w-md mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <X className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Error Loading Matches</h3>
              <p className="text-gray-300 mb-4">{error}</p>
              <button 
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                onClick={() => fetchMatches(1)}
              >
                Try Again
              </button>
            </motion.div>
          ) : filteredMatches.length === 0 ? (
            <motion.div 
              className="bg-[#252525] rounded-xl p-8 max-w-md mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Search className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Matches Found</h3>
              <p className="text-gray-300">Try adjusting your search or filters</p>
            </motion.div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMatches.map((match, index) => (
                  <MatchCard key={match.id || index} match={match} />
                ))}
              </div>
              
              {/* Pagination */}
              {pagination.lastPage > 1 && (
                <motion.div 
                  className="flex justify-center mt-12 space-x-1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {renderPagination()}
                </motion.div>
              )}
              
              {/* Showing results summary */}
              <motion.div 
                className="text-center text-gray-400 text-sm mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                Showing {filteredMatches.length} of {pagination.total} matches
              </motion.div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}

function MatchCard({ match }) {
  // Determine if match is completed or upcoming
  const isCompleted = match.status === 'completed' || 
    (match.score1 > 0 || match.score2 > 0) || 
    (new Date(match.match_date) < new Date());
  
  // Format date
  const formatDate = (date) => {
    try {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch (e) {
      return 'Invalid Date'
    }
  }
  
  // Determine winner or if it's a draw
  const getResult = () => {
    if (!isCompleted) return null;
    if (match.score1 > match.score2) return 'team1';
    if (match.score1 < match.score2) return 'team2';
    return 'draw';
  }
  
  const result = getResult();
  
  return (
    <motion.div
      className="bg-gradient-to-br from-[#252525] to-[#1e1e1e] rounded-xl overflow-hidden shadow-lg border border-gray-800 hover:border-[#07f468]/30 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(7, 244, 104, 0.1)' }}
    >
      {/* Tournament name header */}
      <div className="bg-gradient-to-r from-[#333] to-[#222] p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white truncate">{match.tournoi_name}</h3>
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
            isCompleted 
              ? "bg-[#07f468]/10 text-[#07f468] border border-[#07f468]/30" 
              : "bg-blue-500/10 text-blue-400 border border-blue-500/30"
          }`}>
            {isCompleted ? 'Completed' : 'Upcoming'}
          </span>
        </div>
        <div className="flex items-center text-gray-400 text-sm mt-1">
          <Calendar className="w-4 h-4 mr-1.5 text-[#07f468]" />
          {formatDate(match.match_date)}
          <Clock className="w-4 h-4 ml-3 mr-1.5 text-[#07f468]" />
          {match.time || '00:00'}
        </div>
      </div>
      
      {/* Match content */}
      <div className="p-5">
        {/* Team 1 */}
        <div className={`flex items-center justify-between mb-6 ${result === 'team1' ? 'opacity-100' : 'opacity-80'}`}>
          <div className="flex items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              result === 'team1' 
                ? 'bg-[#07f468]/20 text-[#07f468]' 
                : 'bg-gray-800/50 text-gray-400'
            }`}>
              <Trophy className="w-6 h-6" />
            </div>
            <div className="ml-3">
              <p className={`font-semibold ${result === 'team1' ? 'text-white' : 'text-gray-300'}`}>
                {match.team1_name}
              </p>
              {result === 'team1' && (
                <span className="text-xs text-[#07f468]">Winner</span>
              )}
            </div>
          </div>
          <div className={`text-2xl font-bold ${
            result === 'team1' ? 'text-[#07f468]' : 'text-white'
          }`}>
            {match.score1}
          </div>
        </div>
        
        {/* Divider with match status */}
        <div className="relative flex items-center justify-center my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative bg-[#252525] px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
            {result === 'draw' ? 'Draw' : (isCompleted ? 'vs' : 'upcoming')}
          </div>
        </div>
        
        {/* Team 2 */}
        <div className={`flex items-center justify-between ${result === 'team2' ? 'opacity-100' : 'opacity-80'}`}>
          <div className="flex items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              result === 'team2' 
                ? 'bg-[#07f468]/20 text-[#07f468]' 
                : 'bg-gray-800/50 text-gray-400'
            }`}>
              <Trophy className="w-6 h-6" />
            </div>
            <div className="ml-3">
              <p className={`font-semibold ${result === 'team2' ? 'text-white' : 'text-gray-300'}`}>
                {match.team2_name}
              </p>
              {result === 'team2' && (
                <span className="text-xs text-[#07f468]">Winner</span>
              )}
            </div>
          </div>
          <div className={`text-2xl font-bold ${
            result === 'team2' ? 'text-[#07f468]' : 'text-white'
          }`}>
            {match.score2}
          </div>
        </div>
        
        {/* Location info */}
        <div className="mt-6 pt-4 border-t border-gray-700/50">
          <div className="flex items-center text-sm text-gray-400">
            <Users className="w-4 h-4 text-[#07f468] mr-2" />
            <span>Location: {match.location || 'TBD'}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Default matches data for when API fails
const defaultMatches = [
  {
    id: 1,
    tournoi_name: "Summer League",
    team1_name: "FC Thunder",
    team2_name: "United Stars",
    score1: 3,
    score2: 2,
    match_date: new Date("2024-05-15"),
    status: 'completed',
    location: 'Central Stadium',
    time: '18:30'
  },
  {
    id: 2,
    tournoi_name: "Championship Cup",
    team1_name: "Eagles FC",
    team2_name: "Phoenix Risers",
    score1: 1,
    score2: 1,
    match_date: new Date("2024-05-14"),
    status: 'completed',
    location: 'Sports Complex',
    time: '19:00'
  },
  {
    id: 3,
    tournoi_name: "City Tournament",
    team1_name: "Sporting Club",
    team2_name: "Athletic Union",
    score1: 2,
    score2: 0,
    match_date: new Date("2024-05-12"),
    status: 'completed',
    location: 'Municipal Field',
    time: '17:00'
  },
  {
    id: 4,
    tournoi_name: "Regional Finals",
    team1_name: "Victory United",
    team2_name: "Royal FC",
    score1: 0,
    score2: 0,
    match_date: new Date(new Date().setDate(new Date().getDate() + 5)),
    status: 'scheduled',
    location: 'National Arena',
    time: '20:00'
  },
  {
    id: 5,
    tournoi_name: "Friendship Cup",
    team1_name: "Galaxy Stars",
    team2_name: "Titans FC",
    score1: 0,
    score2: 0,
    match_date: new Date(new Date().setDate(new Date().getDate() + 2)),
    status: 'scheduled',
    location: 'Community Field',
    time: '16:30'
  },
  {
    id: 6,
    tournoi_name: "League Group Stage",
    team1_name: "Dynamo FC",
    team2_name: "City Warriors",
    score1: 0,
    score2: 0,
    match_date: new Date(new Date().setDate(new Date().getDate() + 7)),
    status: 'scheduled',
    location: 'Olympic Stadium',
    time: '18:00'
  }
]; 
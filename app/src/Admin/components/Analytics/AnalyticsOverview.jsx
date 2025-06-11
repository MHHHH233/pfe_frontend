import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp,
  Trophy,
  User,
  School,
  ArrowUp,
  Filter,
  X,
  ChevronDown,
  CalendarRange,
  UserRoundSearch,
  MapPin
} from 'lucide-react';
import analyticsService from '../../../lib/services/admin/analyticsServices';

const AnalyticsOverview = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [isFiltered, setIsFiltered] = useState(false);

  // Get default date range (last 30 days)
  useEffect(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    setDateRange({
      startDate: thirtyDaysAgo.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0]
    });
    
    // Load analytics data immediately after component mount
    const loadInitialData = async () => {
      console.log('AnalyticsOverview: Loading initial data...');
      try {
        setLoading(true);
        setError(null);
        
        const result = await analyticsService.getAnalytics();
        console.log('AnalyticsOverview: API response received:', result);
        
        if (!result) {
          throw new Error('Empty response from analytics API');
        }
        
        setAnalyticsData(result); // Store the raw analytics data
        
        // Transform the data into the format needed for display
        const transformedData = [
          { 
            label: "Total Users", 
            value: result.total_comptes || 0, 
            Icon: "Users",
            color: "#07f468",
            description: "Registered accounts"
          },
          { 
            label: "Reservations", 
            value: result.total_reservations || 0, 
            Icon: "Calendar",
            color: "#3b82f6",
            description: "Booked sessions"
          },
          { 
            label: "Revenue", 
            value: `${result.total_revenue ? parseFloat(result.total_revenue).toLocaleString() : '0'} MAD`,
            Icon: "DollarSign",
            color: "#eab308",
            description: "Total earnings"
          },
          { 
            label: "Fields", 
            value: result.total_terrains || 0, 
            Icon: "TrendingUp",
            color: "#ec4899",
            description: "Available terrains"
          }
        ];
        
        setData(transformedData);
      } catch (err) {
        console.error('AnalyticsOverview: Error fetching data:', err);
        setError('Failed to load analytics data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    loadInitialData();
  }, []);

  const fetchAnalytics = async (start, end) => {
    console.log('AnalyticsOverview: Fetching analytics with params:', { start, end });
    try {
      setLoading(true);
      setError(null);
      let result;
      
      if (start && end) {
        console.log('AnalyticsOverview: Using date range API endpoint');
        result = await analyticsService.getAnalyticsByDateRange(start, end);
        setIsFiltered(true);
      } else {
        console.log('AnalyticsOverview: Using default analytics API endpoint');
        result = await analyticsService.getAnalytics();
        setIsFiltered(false);
      }
      
      console.log('AnalyticsOverview: API response:', result);
      
      if (!result) {
        throw new Error('Empty or invalid response from analytics API');
      }
      
      setAnalyticsData(result); // Store the raw analytics data
      
      // Transform the data into the format needed for display
      const transformedData = [
        { 
          label: "Total Users", 
          value: result.total_comptes || 0, 
          Icon: "Users",
          color: "#07f468",
          description: "Registered accounts"
        },
        { 
          label: "Reservations", 
          value: result.total_reservations || 0, 
          Icon: "Calendar",
          color: "#3b82f6",
          description: "Booked sessions"
        },
        { 
          label: "Revenue", 
          value: `${result.total_revenue ? parseFloat(result.total_revenue).toLocaleString() : '0'} MAD`,
          Icon: "DollarSign",
          color: "#eab308",
          description: "Total earnings"
        },
        { 
          label: "Fields", 
          value: result.total_terrains || 0, 
          Icon: "TrendingUp",
          color: "#ec4899",
          description: "Available terrains"
        }
      ];
      
      setData(transformedData);
    } catch (err) {
      console.error('AnalyticsOverview: Error fetching analytics:', err);
      setError('Failed to load dashboard data. Please check your network connection and try again.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    // Initial data fetch with default date range
    if (dateRange.startDate && dateRange.endDate) {
      fetchAnalytics();
    }
  }, []);
  
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const applyDateFilter = () => {
    fetchAnalytics(dateRange.startDate, dateRange.endDate);
    setShowDateFilter(false);
  };
  
  const resetDateFilter = () => {
    fetchAnalytics();
    setShowDateFilter(false);
  };

  // Function to dynamically return the correct icon based on the name
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Calendar':
        return <Calendar size={40} />;
      case 'Users':
        return <Users size={40} />;
      case 'DollarSign':
        return <DollarSign size={40} />;
      case 'TrendingUp':
        return <TrendingUp size={40} />;
      default:
        return null;
    }
  };

  // Format currency helper function
  const formatCurrency = (value) => {
    if (!value) return '0.00 MAD';
    return `${parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MAD`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-[#07f468] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500 p-4 rounded-lg text-center">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-2xl font-bold text-white">Business Overview</h3>
        <div className="flex items-center gap-3">
          {isFiltered && (
            <span className="text-sm bg-gray-700/60 text-gray-300 px-3 py-1 rounded-full flex items-center">
              <CalendarRange size={14} className="mr-1" />
              {new Date(dateRange.startDate).toLocaleDateString()} - {new Date(dateRange.endDate).toLocaleDateString()}
            </span>
          )}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center"
              onClick={() => setShowDateFilter(!showDateFilter)}
            >
              <Filter size={16} className="mr-2" />
              Date Filter
              <ChevronDown size={16} className={`ml-2 transform transition-transform duration-200 ${showDateFilter ? 'rotate-180' : ''}`} />
            </motion.button>
            
            {showDateFilter && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10 w-72"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-white">Date Range Filter</h4>
                    <button 
                      onClick={() => setShowDateFilter(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Start Date</label>
                      <input
                        type="date"
                        name="startDate"
                        value={dateRange.startDate}
                        onChange={handleDateChange}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#07f468]"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">End Date</label>
                      <input
                        type="date"
                        name="endDate"
                        value={dateRange.endDate}
                        onChange={handleDateChange}
                        min={dateRange.startDate}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#07f468]"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-between pt-2">
                    <button
                      onClick={resetDateFilter}
                      className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-sm"
                    >
                      Reset
                    </button>
                    <button
                      onClick={applyDateFilter}
                      className="px-3 py-1.5 bg-[#07f468] hover:bg-[#06d35a] text-gray-900 font-medium rounded-md text-sm"
                    >
                      Apply Filter
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center"
            onClick={() => fetchAnalytics(isFiltered ? dateRange.startDate : null, isFiltered ? dateRange.endDate : null)}
          >
            <ArrowUp size={16} className="mr-2" />
            Refresh
          </motion.button>
        </div>
      </div>
      
      {/* Improved Card Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-br from-gray-700 to-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px] border border-gray-600/30"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">{stat.label}</p>
                <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
                <p className="text-xs text-gray-400 mt-1">{stat.description}</p>
              </div>
              <div className={`p-3 rounded-full bg-gray-800/50 text-${stat.Icon === 'Users' ? '[#07f468]' : stat.Icon === 'Calendar' ? 'blue-400' : stat.Icon === 'DollarSign' ? 'yellow-400' : 'pink-400'}`}>
                {getIcon(stat.Icon)}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-gray-700 to-gray-800 p-6 rounded-lg shadow-lg border border-gray-600/30"
        >
          <h3 className="text-xl font-bold mb-6 text-white">Sports Activities</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-gray-800/70 text-yellow-400">
                  <Trophy size={20} />
                </div>
                <span className="ml-3">Tournaments</span>
              </div>
              <span className="text-xl font-semibold text-white">
                {analyticsData?.total_tournois || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-gray-800/70 text-blue-400">
                  <Users size={20} />
                </div>
                <span className="ml-3">Teams</span>
              </div>
              <span className="text-xl font-semibold text-white">
                {analyticsData?.total_teams || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-gray-800/70 text-green-400">
                  <User size={20} />
                </div>
                <span className="ml-3">Players</span>
              </div>
              <span className="text-xl font-semibold text-white">
                {analyticsData?.total_players || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-gray-800/70 text-purple-400">
                  <School size={20} />
                </div>
                <span className="ml-3">Academies</span>
              </div>
              <span className="text-xl font-semibold text-white">
                {analyticsData?.total_academie_programmes || 0}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Daily Revenue Chart Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-gray-700 to-gray-800 p-6 rounded-lg shadow-lg border border-gray-600/30"
        >
          <h3 className="text-xl font-bold mb-4 text-white">Revenue Analysis</h3>
          
          {analyticsData?.daily_revenue && analyticsData.daily_revenue.length > 0 ? (
            <>
              <div className="h-48 flex items-end justify-between mt-4">
                {analyticsData.daily_revenue.map((day, index) => {
                  const maxRevenue = Math.max(...analyticsData.daily_revenue.map(d => parseFloat(d.daily_revenue) || 0));
                  const height = maxRevenue > 0 
                    ? `${(parseFloat(day.daily_revenue) / maxRevenue) * 100}%` 
                    : '0%';
                  
                  return (
                    <div key={index} className="flex flex-col items-center">
                      <div className="w-8 relative" style={{ height: '100%' }}>
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height }}
                          transition={{ duration: 0.8, delay: index * 0.1 }}
                          className="absolute bottom-0 w-full bg-gradient-to-t from-[#07f468] to-[#06d35a]/70 rounded-t"
                        />
                      </div>
                      <span className="text-xs text-gray-400 mt-2 w-20 text-center overflow-hidden text-ellipsis whitespace-nowrap">
                        {new Date(day.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-600">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Revenue</span>
                  <span className="text-2xl font-bold text-[#07f468]">
                    {formatCurrency(analyticsData.total_revenue)}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="h-48 flex items-center justify-center">
              <p className="text-gray-400">No revenue data available for the selected period</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-gray-700 to-gray-800 p-6 rounded-lg shadow-lg border border-gray-600/30"
        >
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <div className="p-2 rounded-full bg-gray-800/70 text-[#07f468] mr-2">
              <UserRoundSearch size={18} />
            </div>
            Player Requests
          </h3>
          <div className="text-3xl font-bold text-center my-4 text-white">
            {analyticsData?.total_player_requests || 0}
          </div>
          <p className="text-sm text-gray-400 text-center">Pending player applications</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-gray-700 to-gray-800 p-6 rounded-lg shadow-lg border border-gray-600/30"
        >
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <div className="p-2 rounded-full bg-gray-800/70 text-[#07f468] mr-2">
              <MapPin size={18} />
            </div>
            Fields Available
          </h3>
          <div className="text-3xl font-bold text-center my-4 text-white">
            {analyticsData?.total_terrains || 0}
          </div>
          <p className="text-sm text-gray-400 text-center">Active playing fields</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-br from-gray-700 to-gray-800 p-6 rounded-lg shadow-lg border border-gray-600/30"
        >
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <div className="p-2 rounded-full bg-gray-800/70 text-[#07f468] mr-2">
              <School size={18} />
            </div>
            Academy Coaches
          </h3>
          <div className="text-3xl font-bold text-center my-4 text-white">
            {analyticsData?.total_academie_coaches || 0}
          </div>
          <p className="text-sm text-gray-400 text-center">Professional trainers</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-br from-gray-700 to-gray-800 p-6 rounded-lg shadow-lg border border-gray-600/30"
        >
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <div className="p-2 rounded-full bg-gray-800/70 text-[#07f468] mr-2">
              <Trophy size={18} />
            </div>
            Active Tournaments
          </h3>
          <div className="text-3xl font-bold text-center my-4 text-white">
            {analyticsData?.total_tournois || 0}
          </div>
          <p className="text-sm text-gray-400 text-center">Ongoing competitions</p>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsOverview; 
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
  ArrowUp
} from 'lucide-react';
import analyticsService from '../../../lib/services/admin/analyticsServices';

const AnalyticsOverview = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const result = await analyticsService.getAnalytics();
        setAnalyticsData(result); // Store the raw analytics data
        
        // Transform the data into the format needed for display
        const transformedData = [
          { 
            label: "Total Users", 
            value: result.total_comptes, 
            Icon: "Users",
            color: "#07f468",
            description: "Registered accounts"
          },
          { 
            label: "Reservations", 
            value: result.total_reservations, 
            Icon: "Calendar",
            color: "#3b82f6",
            description: "Booked sessions"
          },
          { 
            label: "Revenue", 
            value: `$${(result.total_reservations * 50).toLocaleString()}`, // Example calculation
            Icon: "DollarSign",
            color: "#eab308",
            description: "Estimated earnings"
          },
          { 
            label: "Fields", 
            value: result.total_terrains, 
            Icon: "TrendingUp",
            color: "#ec4899",
            description: "Available terrains"
          }
        ];
        
        setData(transformedData);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalytics();
  }, []);

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
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-white">Business Overview</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center"
          onClick={() => window.location.reload()}
        >
          <ArrowUp size={16} className="mr-2" />
          Refresh
        </motion.button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-700 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px]"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">{stat.label}</p>
                <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
                <p className="text-xs text-gray-400 mt-1">{stat.description}</p>
              </div>
              <div className="text-[#07f468]">
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
          className="bg-gray-700 p-6 rounded-lg shadow-lg"
        >
          <h3 className="text-xl font-bold mb-6 text-white">Sports Activities</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Trophy size={20} className="text-yellow-400 mr-2" />
                <span>Tournaments</span>
              </div>
              <span className="text-xl font-semibold text-white">
                {analyticsData?.total_tournois || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Users size={20} className="text-blue-400 mr-2" />
                <span>Teams</span>
              </div>
              <span className="text-xl font-semibold text-white">
                {analyticsData?.total_teams || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <User size={20} className="text-green-400 mr-2" />
                <span>Players</span>
              </div>
              <span className="text-xl font-semibold text-white">
                {analyticsData?.total_players || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <School size={20} className="text-purple-400 mr-2" />
                <span>Academies</span>
              </div>
              <span className="text-xl font-semibold text-white">
                {analyticsData?.total_academie_programmes || 0}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-700 p-6 rounded-lg shadow-lg"
        >
          <h3 className="text-xl font-bold mb-4">User Activity</h3>
          <div className="h-48 flex items-end justify-between">
            <div className="w-8 bg-[#07f468] rounded-t" style={{ height: '60%' }}></div>
            <div className="w-8 bg-[#07f468] rounded-t" style={{ height: '80%' }}></div>
            <div className="w-8 bg-[#07f468] rounded-t" style={{ height: '40%' }}></div>
            <div className="w-8 bg-[#07f468] rounded-t" style={{ height: '70%' }}></div>
            <div className="w-8 bg-[#07f468] rounded-t" style={{ height: '50%' }}></div>
            <div className="w-8 bg-[#07f468] rounded-t" style={{ height: '90%' }}></div>
            <div className="w-8 bg-[#07f468] rounded-t" style={{ height: '30%' }}></div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-400">
            <span>Mon</span> <span>Tue</span> <span>Wed</span> <span>Thu</span>
            <span>Fri</span> <span>Sat</span> <span>Sun</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsOverview; 
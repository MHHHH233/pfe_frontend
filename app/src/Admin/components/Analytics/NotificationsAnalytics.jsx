import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell,
  BarChart2, 
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Calendar,
  User,
  Trophy,
  Users,
  PieChart
} from 'lucide-react';
import notificationsService from '../../../lib/services/admin/notificationsService';

const NotificationsAnalytics = () => {
  const [notificationData, setNotificationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotificationAnalytics = async () => {
      try {
        setLoading(true);
        const response = await notificationsService.getNotifications();
        setNotificationData(response);
      } catch (err) {
        setError('Failed to load notification data');
      } finally {
        setLoading(false);
      }
    };

    fetchNotificationAnalytics();
  }, []);

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

  // If no notification data
  if (!notificationData) {
    return null;
  }

  // Helper function to get appropriate icon for notification type
  const getNotificationTypeIcon = (type) => {
    switch (type) {
      case 'reservations':
        return <Calendar size={18} className="text-blue-400" />;
      case 'player_requests':
        return <User size={18} className="text-yellow-400" />;
      case 'matches':
        return <Trophy size={18} className="text-purple-400" />;
      case 'new_players':
        return <User size={18} className="text-green-400" />;
      case 'new_teams':
        return <Users size={18} className="text-[#07f468]" />;
      default:
        return <Bell size={18} className="text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-white">Notification Analytics</h3>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-700 p-6 rounded-lg shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-white">All Activities</h4>
            <Bell size={24} className="text-[#07f468]" />
          </div>
          <div className="text-3xl font-bold mb-2 text-white">
            {notificationData.total_activities || 0}
          </div>
          <div className="text-sm text-gray-400">Total tracked activities</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-gray-700 p-6 rounded-lg shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-white">Notifications</h4>
            <CheckCircle size={24} className="text-green-400" />
          </div>
          <div className="text-3xl font-bold mb-2 text-white">
            {notificationData.notifications?.length || 0}
          </div>
          <div className="text-sm text-gray-400">Total notifications</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-gray-700 p-6 rounded-lg shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-white">Unread</h4>
            <AlertCircle size={24} className="text-yellow-400" />
          </div>
          <div className="text-3xl font-bold mb-2 text-white">
            {notificationData.unread_count || 0}
          </div>
          <div className="text-sm text-gray-400">Unread notifications</div>
        </motion.div>
      </div>
      
      {/* Activity Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-gray-700 p-6 rounded-lg shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-white">Activity Distribution</h4>
            <PieChart size={24} className="text-[#07f468]" />
          </div>
          
          {notificationData.activity_distribution && notificationData.activity_distribution.length > 0 ? (
            <div className="space-y-4">
              {notificationData.activity_distribution.map((item, index) => (
                <div key={index} className="relative pt-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center text-sm font-medium text-white">
                      {getNotificationTypeIcon(item.type.toLowerCase().replace(' ', '_'))}
                      <span className="ml-2">{item.type}</span>
                    </div>
                    <div className="text-sm text-gray-400">{item.count}</div>
                  </div>
                  <div className="bg-gray-600 h-2 rounded-full">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.count / notificationData.total_activities) * 100}%` }}
                      transition={{ duration: 1, delay: 0.5 + (index * 0.1) }}
                      className="h-2 rounded-full"
                      style={{ 
                        backgroundColor: index === 0 ? '#3b82f6' : 
                                        index === 1 ? '#eab308' : 
                                        index === 2 ? '#a855f7' :
                                        index === 3 ? '#22c55e' : '#07f468'
                      }}
                    ></motion.div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 p-4">
              No activity distribution data available
            </div>
          )}
        </motion.div>
        
        {/* Activity Counts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="bg-gray-700 p-6 rounded-lg shadow-lg"
        >
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-white">Activity Breakdown</h4>
            <BarChart2 size={24} className="text-[#07f468]" />
          </div>
          
          {notificationData.activity_counts ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800/70 rounded-md p-3">
                <div className="flex justify-center mb-2">
                  <Calendar size={20} className="text-blue-400" />
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-400">Reservations</div>
                  <div className="text-xl font-semibold text-white">{notificationData.activity_counts.reservations || 0}</div>
                </div>
              </div>
              
              <div className="bg-gray-800/70 rounded-md p-3">
                <div className="flex justify-center mb-2">
                  <User size={20} className="text-yellow-400" />
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-400">Player Requests</div>
                  <div className="text-xl font-semibold text-white">{notificationData.activity_counts.player_requests || 0}</div>
                </div>
              </div>
              
              <div className="bg-gray-800/70 rounded-md p-3">
                <div className="flex justify-center mb-2">
                  <Trophy size={20} className="text-purple-400" />
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-400">Matches</div>
                  <div className="text-xl font-semibold text-white">{notificationData.activity_counts.matches || 0}</div>
                </div>
              </div>
              
              <div className="bg-gray-800/70 rounded-md p-3">
                <div className="flex justify-center mb-2">
                  <Users size={20} className="text-[#07f468]" />
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-400">New Teams</div>
                  <div className="text-xl font-semibold text-white">{notificationData.activity_counts.new_teams || 0}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400 p-4">
              No activity count data available
            </div>
          )}
        </motion.div>
      </div>
      
      {/* Recent Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        className="bg-gray-700 p-6 rounded-lg shadow-lg"
      >
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-semibold text-white">Recent Notifications</h4>
          <MessageSquare size={24} className="text-[#07f468]" />
        </div>
        
        {notificationData.notifications && notificationData.notifications.length > 0 ? (
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {notificationData.notifications.slice(0, 8).map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className="bg-gray-800/50 p-4 rounded-lg hover:bg-gray-800/70 transition-colors"
              >
                <div className="flex">
                  <div className="flex-shrink-0 mt-0.5 rounded-full p-2 bg-gray-700/50">
                    {notification.type === 'reservation' ? (
                      <Calendar size={18} className="text-blue-400" />
                    ) : notification.type === 'player_request' ? (
                      <User size={18} className={notification.status === 'accepted' ? 'text-green-400' : 
                                                notification.status === 'rejected' ? 'text-red-400' : 'text-yellow-400'} />
                    ) : notification.type === 'match' ? (
                      <Trophy size={18} className="text-purple-400" />
                    ) : (
                      <Bell size={18} className="text-gray-400" />
                    )}
                  </div>
                  
                  <div className="ml-3 flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs px-1.5 py-0.5 rounded-md ${
                            notification.type === 'reservation' ? 'bg-blue-900/50 text-blue-300' :
                            notification.type === 'match' ? 'bg-purple-900/50 text-purple-300' :
                            notification.type === 'player_request' ? 'bg-yellow-900/50 text-yellow-300' :
                            'bg-gray-900/50 text-gray-300'
                          }`}>
                            {notification.type.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="text-sm font-medium text-white">
                          {notification.message}
                        </div>
                        
                        {notification.terrain && (
                          <p className="text-xs text-[#07f468] mt-1">
                            {notification.terrain} • {notification.reservation_date || notification.date}
                          </p>
                        )}
                        
                        {notification.tournament && (
                          <p className="text-xs text-purple-400 mt-1">
                            {notification.tournament}
                          </p>
                        )}
                      </div>
                      
                      <div className="mt-2 sm:mt-0">
                        <span className="text-xs text-gray-500">
                          {new Date(notification.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                        {notification.status && (
                          <div className="mt-1">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              notification.status === 'accepted' ? 'bg-green-900/50 text-green-300' :
                              notification.status === 'rejected' ? 'bg-red-900/50 text-red-300' :
                              'bg-yellow-900/50 text-yellow-300'
                            }`}>
                              {notification.status}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 p-4">
            No recent notifications available
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default NotificationsAnalytics; 
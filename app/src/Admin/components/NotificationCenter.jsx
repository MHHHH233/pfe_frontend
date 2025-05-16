import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  X, 
  MessageSquare, 
  Calendar, 
  User, 
  CheckCircle,
  AlertTriangle,
  Info,
  MoreVertical,
  Check,
  Trophy,
  Users,
  RefreshCw,
  BarChart2
} from 'lucide-react';
import notificationsService from '../../lib/services/admin/notificationsService';

const NotificationCenter = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [activityCounts, setActivityCounts] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const notificationRef = useRef(null);
  const navigate = useNavigate();
  
  // Function to fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationsService.getNotifications();
      setNotifications(response.notifications || []);
      setActivityCounts(response.activity_counts || {});
      setUnreadCount(response.unread_count || 0);
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch notifications on component mount and set up refresh interval
  useEffect(() => {
    fetchNotifications();
    
    // Set up interval to refresh notifications every 30 seconds
    const intervalId = setInterval(fetchNotifications, 30000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  
  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Mark a notification as read
  const markAsRead = async (id) => {
    try {
      await notificationsService.markAsRead(id);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  
  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await notificationsService.markAllAsRead();
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };
  
  // Get icon based on notification type
  const getNotificationIcon = (type, status) => {
    switch (type) {
      case 'reservation':
        return <Calendar className="text-blue-400" />;
      case 'player_request':
        return status === 'accepted' ? 
          <CheckCircle className="text-green-400" /> :
          status === 'rejected' ?
          <X className="text-red-400" /> :
          <User className="text-yellow-400" />;
      case 'match':
        return <Trophy className="text-purple-400" />;
      case 'new_player':
        return <User className="text-green-400" />;
      case 'new_team':
        return <Users className="text-[#07f468]" />;
      default:
        return <Info className="text-gray-400" />;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  return (
    <div className="relative" ref={notificationRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="text-white focus:outline-none relative"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4">
            {unreadCount}
          </span>
        )}
      </motion.button>
      
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 md:w-96 bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700 z-50"
            style={{ maxHeight: 'calc(100vh - 100px)' }}
          >
            <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-900">
              <h3 className="font-semibold text-white">Notifications</h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-xs text-gray-400 hover:text-[#07f468] transition-colors flex items-center"
                  >
                    <Check size={14} className="mr-1" /> 
                    Mark all as read
                  </button>
                )}
                <button 
                  onClick={fetchNotifications}
                  className="text-gray-400 hover:text-white transition-colors"
                  disabled={loading}
                >
                  <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                </button>
                <button 
                  onClick={() => setOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
              {loading ? (
                <div className="flex justify-center items-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#07f468] border-t-transparent"></div>
                </div>
              ) : error ? (
                <div className="p-8 text-center text-red-400">
                  <AlertTriangle className="mx-auto mb-2 h-8 w-8" />
                  <p>{error}</p>
                </div>
              ) : notifications.length > 0 ? (
                <div className="divide-y divide-gray-700">
                  {notifications.slice(0, 4).map(notification => (
                    <div 
                      key={notification.id} 
                      className={`p-4 hover:bg-gray-700/50 transition-colors ${!notification.read ? 'bg-gray-700/30' : ''}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex">
                        <div className="flex-shrink-0 mt-0.5 rounded-full p-2 bg-gray-700/50">
                          {getNotificationIcon(notification.type, notification.status)}
                        </div>
                        
                        <div className="ml-3 flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className={`text-xs px-1.5 py-0.5 rounded-md ${
                                  notification.type === 'reservation' ? 'bg-blue-900/50 text-blue-300' :
                                  notification.type === 'match' ? 'bg-purple-900/50 text-purple-300' :
                                  notification.type === 'player_request' ? 'bg-yellow-900/50 text-yellow-300' :
                                  notification.type === 'new_player' ? 'bg-green-900/50 text-green-300' :
                                  notification.type === 'new_team' ? 'bg-[#07f468]/20 text-[#07f468]' :
                                  'bg-gray-900/50 text-gray-300'
                                }`}>
                                  {notification.type.replace('_', ' ')}
                                </span>
                                {!notification.read && <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>}
                              </div>
                              <div className={`text-sm font-medium mt-1 ${!notification.read ? 'text-white' : 'text-gray-300'}`}>
                                {notification.message}
                              </div>
                            </div>
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
                          
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">
                              {formatDate(notification.date)}
                            </span>
                            {notification.status && (
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                notification.status === 'accepted' ? 'bg-green-900/50 text-green-300' :
                                notification.status === 'rejected' ? 'bg-red-900/50 text-red-300' :
                                'bg-yellow-900/50 text-yellow-300'
                              }`}>
                                {notification.status}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="flex justify-center mb-4">
                    <Bell size={40} className="text-gray-600" />
                  </div>
                  <p className="text-gray-400">No notifications yet</p>
                </div>
              )}
            </div>
            
            {notifications.length > 0 && (
              <div className="p-3 border-t border-gray-700 bg-gray-900">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-gray-800/70 rounded-md p-2">
                    <div className="flex justify-center mb-1">
                      <Calendar size={14} className="text-blue-400" />
                    </div>
                    <div className="text-xs text-gray-400">Reservations</div>
                    <div className="text-sm font-semibold text-white">{activityCounts?.reservations || 0}</div>
                  </div>
                  <div className="bg-gray-800/70 rounded-md p-2">
                    <div className="flex justify-center mb-1">
                      <User size={14} className="text-yellow-400" />
                    </div>
                    <div className="text-xs text-gray-400">Requests</div>
                    <div className="text-sm font-semibold text-white">{activityCounts?.player_requests || 0}</div>
                  </div>
                  <div className="bg-gray-800/70 rounded-md p-2">
                    <div className="flex justify-center mb-1">
                      <Trophy size={14} className="text-purple-400" />
                    </div>
                    <div className="text-xs text-gray-400">Matches</div>
                    <div className="text-sm font-semibold text-white">{activityCounts?.matches || 0}</div>
                  </div>
                </div>
                {unreadCount > 4 && (
                  <div className="mt-2 text-center text-xs text-gray-400">
                    + {unreadCount - 4} more unread notifications
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter; 
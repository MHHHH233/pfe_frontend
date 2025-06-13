import axios from 'axios'
import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Bell,
  User,
  Home,
  Users,
  Calendar,
  MessageSquare,
  BarChart2,
  Settings,
  Mail,
  Star,
  Trash2,
  Edit,
  Phone,
  MapPin,
  Clock,
  DollarSign,
  PieChart,
  TrendingUp,
  Plus,
  X,
  Trash,
  MoreVertical,
  Calendar1Icon,
  Users2Icon,
  DollarSignIcon,
  TrendingUpIcon,
  CopyX,
  CopyCheck,
  UserRoundSearch,
  Trophy,
  School,
  CircleEllipsis,
  ArrowUp,
  Eye,
  EyeOff,
  Key,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  UserCog,
  Lock,
  UserX,
  Check,
  Bug,
  CheckCircle,
  Globe,
  CalendarRange,
  Filter,
  ChevronUp,
} from "lucide-react";
import { Navigate, Link } from "react-router-dom";
import Loader from "../Component/Loading";
import Tableau from "../Component/Reservations/table";
import Buttons from "../Component/Reservations/buttons";
import FormResev from "../Component/Reservations/form";
import EnhancedTournamentManagement from './components/Tournoi';
import AcademieManagement from './components/Academie';
import PlayersTeams from './components/Players-teams';
import Terrains from './components/Terrains';
import SettingsManagement from './components/Settings';
import SocialMediaManagement from './components/SocialMedia';
import PaymentManagement from './components/Payments/Payemnet';
import { authService } from '../lib/services/authoServices';
import analyticsService from '../lib/services/admin/analyticsServices';
import compteService from '../lib/services/admin/compteServices';
import reservationService from '../lib/services/admin/reservationServices';
import { ReportedBugs, Reviews } from './components/Assistance';
import NotificationCenter from './components/NotificationCenter';
import UserMenu from './components/UserMenu';
import AnalyticsPage from './components/Analytics';
import ProfilePage from '../Client/Component/ProfilePage';
import adminTerrainService from '../lib/services/admin/terrainServices';

const FootballAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  
  return (
    <div className="flex min-h-screen bg-gray-900 relative">
      {/* Sidebar - fixed position */}
      <Sidebar
        isOpen={sidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        closeSidebar={() => setSidebarOpen(false)}
      />
      
      {/* Main Content - full width when sidebar closed */}
      <div 
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out
                   ${!sidebarOpen ? 'ml-0' : 'ml-0 md:ml-64'}`}
        style={{width: sidebarOpen ? 'calc(100% - 16rem)' : '100%'}}
      >
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-6 bg-gray-800 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "overview" && <Overview />}
              {activeTab === "users" && <UsersManagement />}
              {activeTab === "reservations" && <Reservations />}
              {activeTab === "inbox" && <Inbox />}
              {activeTab === "analytics" && <AnalyticsPage />}
              {activeTab === "tournoi" && <EnhancedTournamentManagement />}
              {activeTab === "academie" && <AcademieManagement />}
              {activeTab === "player-teams" && <PlayersTeams />}
              {activeTab === "terrains" && <Terrains />}
              {activeTab === "settings" && <SettingsManagement />}
              {activeTab === "socialmedia" && <SocialMediaManagement />}
              {activeTab === "profile" && <ProfilePage />}
              {activeTab === "bugs" && <ReportedBugs />}
              {activeTab === "reviews" && <Reviews />}
              {activeTab === "payments" && <PaymentManagement />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile menu button */}
      {!sidebarOpen && (
        <motion.button
          className="fixed bottom-4 right-4 z-50 bg-gray-700 text-white p-3 rounded-full shadow-lg md:hidden"
          onClick={() => setSidebarOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Menu size={24} />
        </motion.button>
      )}
    </div>
  );
};

const Header = ({ toggleSidebar }) => {
  return (
    <header className="bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleSidebar}
        className="text-white focus:outline-none md:block hidden"
      >
        <Menu size={24} />
      </motion.button>
      
      <Link to="/" className="text-xl font-bold">
        <span className="text-white">TERRAIN</span>
        <span className="text-green-500">FC</span>
        <span className="text-gray-400 text-sm ml-2">Admin</span>
      </Link>

      <div className="flex items-center space-x-4">
        <NotificationCenter />
        <UserMenu />
      </div>
    </header>
  );
};

const Sidebar = ({ isOpen, activeTab, setActiveTab, closeSidebar }) => {
  const [dropdowns, setDropdowns] = useState({
    management: false,
    analytics: false,
    assistance: false,
    settings: false
  });
  const sidebarRef = useRef(null);

  // Handle click outside for mobile
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target) && window.innerWidth < 768) {
        closeSidebar();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeSidebar]);

  // Add window resize handler to close sidebar on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && isOpen) {
        closeSidebar();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, closeSidebar]);

  const toggleDropdown = (section) => {
    setDropdowns(prev => {
      // Create a new object with all dropdowns set to false
      const allClosed = Object.keys(prev).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {});
      
      // Toggle only the clicked section
      return {
        ...allClosed,
        [section]: !prev[section]
      };
    });
  };

  const handleMenuClick = (tab) => {
    setActiveTab(tab);
    if (window.innerWidth < 768) {
      closeSidebar();
    }
  };

  return (
    <div 
      ref={sidebarRef}
      className={`fixed top-0 left-0 h-full bg-gray-900 text-white transition-all duration-300 ease-in-out z-50 
                  border-r border-gray-800 shadow-xl overflow-y-auto
                  ${isOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full'}`}
    >
      <div className="p-6">
        {/* Logo and Title */}
        <div className="mb-8">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white">TERRAIN</span>
            <span className="text-2xl font-bold text-[#07f468]">FC</span>
          </Link>
          <p className="text-sm text-gray-400 mt-2">Administration Panel</p>
        </div>

        {/* Navigation */}
        <nav className="space-y-6">
          {/* Main Navigation */}
          <div className="space-y-1">
            <button
              onClick={() => handleMenuClick('overview')}
              className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                        ${activeTab === 'overview' 
                          ? 'bg-[#07f468] text-gray-900' 
                          : 'text-gray-300 hover:bg-gray-800/80'}`}
            >
              <Home size={18} className="mr-3" />
              Aperçu
            </button>

            <button
              onClick={() => handleMenuClick('users')}
              className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                        ${activeTab === 'users' 
                          ? 'bg-[#07f468] text-gray-900' 
                          : 'text-gray-300 hover:bg-gray-800/80'}`}
            >
              <Users size={18} className="mr-3" />
              Utilisateurs
            </button>

            <button
              onClick={() => handleMenuClick('reservations')}
              className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                        ${activeTab === 'reservations' 
                          ? 'bg-[#07f468] text-gray-900' 
                          : 'text-gray-300 hover:bg-gray-800/80'}`}
            >
              <Calendar size={18} className="mr-3" />
              Réservations
            </button>
          </div>

          {/* Management Section */}
          <div>
            <button
              onClick={() => toggleDropdown('management')}
              className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-white transition-colors"
            >
              <span>Management</span>
              <ChevronRight 
                size={16} 
                className={`transform transition-transform duration-200 ${dropdowns.management ? 'rotate-90' : ''}`}
              />
            </button>
            <AnimatePresence>
              {dropdowns.management && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-1 mt-2 overflow-hidden"
                >
                  <button
                    onClick={() => handleMenuClick('tournoi')}
                    className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                              ${activeTab === 'tournoi' 
                                ? 'bg-[#07f468] text-gray-900' 
                                : 'text-gray-300 hover:bg-gray-800/80'}`}
                  >
                    <Trophy size={18} className="mr-3" />
                    Tournois
                  </button>

                  <button
                    onClick={() => handleMenuClick('academie')}
                    className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                              ${activeTab === 'academie' 
                                ? 'bg-[#07f468] text-gray-900' 
                                : 'text-gray-300 hover:bg-gray-800/80'}`}
                  >
                    <School size={18} className="mr-3" />
                    Académie
                  </button>

                  <button
                    onClick={() => handleMenuClick('player-teams')}
                    className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                              ${activeTab === 'player-teams' 
                                ? 'bg-[#07f468] text-gray-900' 
                                : 'text-gray-300 hover:bg-gray-800/80'}`}
                  >
                    <Users2Icon size={18} className="mr-3" />
                    Joueurs & Équipes
                  </button>

                  <button
                    onClick={() => handleMenuClick('terrains')}
                    className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                              ${activeTab === 'terrains' 
                                ? 'bg-[#07f468] text-gray-900' 
                                : 'text-gray-300 hover:bg-gray-800/80'}`}
                  >
                    <MapPin size={18} className="mr-3" />
                    Terrains
                  </button>

                  <button
                    onClick={() => handleMenuClick('payments')}
                    className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                              ${activeTab === 'payments' 
                                ? 'bg-[#07f468] text-gray-900' 
                                : 'text-gray-300 hover:bg-gray-800/80'}`}
                  >
                    <DollarSign size={18} className="mr-3" />
                    Payments
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Analytics Section */}
          <div>
            <button
              onClick={() => toggleDropdown('analytics')}
              className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-white transition-colors"
            >
              <span>Analytics</span>
              <ChevronRight 
                size={16} 
                className={`transform transition-transform duration-200 ${dropdowns.analytics ? 'rotate-90' : ''}`}
              />
            </button>
            <AnimatePresence>
              {dropdowns.analytics && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-1 mt-2 overflow-hidden"
                >
                  <button
                    onClick={() => handleMenuClick('analytics')}
                    className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                              ${activeTab === 'analytics' 
                                ? 'bg-[#07f468] text-gray-900' 
                                : 'text-gray-300 hover:bg-gray-800/80'}`}
                  >
                    <BarChart2 size={18} className="mr-3" />
                    Analytiques
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Assistance Section */}
          <div>
            <button
              onClick={() => toggleDropdown('assistance')}
              className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-white transition-colors"
            >
              <span>Assistance</span>
              <ChevronRight 
                size={16} 
                className={`transform transition-transform duration-200 ${dropdowns.assistance ? 'rotate-90' : ''}`}
              />
            </button>
            <AnimatePresence>
              {dropdowns.assistance && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-1 mt-2 overflow-hidden"
                >
                  <button
                    onClick={() => handleMenuClick('bugs')}
                    className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                              ${activeTab === 'bugs' 
                                ? 'bg-[#07f468] text-gray-900' 
                                : 'text-gray-300 hover:bg-gray-800/80'}`}
                  >
                    <Bug size={18} className="mr-3" />
                    Bug Reports
                  </button>

                  <button
                    onClick={() => handleMenuClick('reviews')}
                    className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                              ${activeTab === 'reviews' 
                                ? 'bg-[#07f468] text-gray-900' 
                                : 'text-gray-300 hover:bg-gray-800/80'}`}
                  >
                    <Star size={18} className="mr-3" />
                    Reviews
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Settings Section */}
          <div>
            <button
              onClick={() => toggleDropdown('settings')}
              className="w-full flex items-center justify-between px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-white transition-colors"
            >
              <span>Settings</span>
              <ChevronRight 
                size={16} 
                className={`transform transition-transform duration-200 ${dropdowns.settings ? 'rotate-90' : ''}`}
              />
            </button>
            <AnimatePresence>
              {dropdowns.settings && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-1 mt-2 overflow-hidden"
                >
                  <button
                    onClick={() => handleMenuClick('profile')}
                    className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                              ${activeTab === 'profile' 
                                ? 'bg-[#07f468] text-gray-900' 
                                : 'text-gray-300 hover:bg-gray-800/80'}`}
                  >
                    <User size={18} className="mr-3" />
                    Profile
                  </button>

                  <button
                    onClick={() => handleMenuClick('socialmedia')}
                    className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                              ${activeTab === 'socialmedia' 
                                ? 'bg-[#07f468] text-gray-900' 
                                : 'text-gray-300 hover:bg-gray-800/80'}`}
                  >
                    <Globe size={18} className="mr-3" />
                    Social Media
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>
      </div>
    </div>
  );
};

const Overview = () => {
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

  useEffect(() => {
    // Initial data fetch when component mounts
    const fetchInitialData = async () => {
      console.log('Fetching initial analytics data...');
      try {
        // Clear any previous data
        setData([]);
        setAnalyticsData(null);
        setLoading(true);
        setError(null);
        
        // Make API call
        const result = await analyticsService.getAnalytics();
        console.log('Analytics data received:', result);
        
        if (!result) {
          throw new Error('Invalid response from analytics service');
        }
        
        // Process and store the data
        setAnalyticsData(result);
        
        // Transform the data for display
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
        console.error('Error fetching initial analytics data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    // Execute the fetch function
    fetchInitialData();
    
    // Get default date range (last 30 days)
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    setDateRange({
      startDate: thirtyDaysAgo.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0]
    });
  }, []); // Empty dependency array to run only once on mount

  const fetchAnalytics = async (start, end) => {
    console.log('Fetching analytics with dates:', { start, end });
    try {
      setLoading(true);
      setError(null);
      let result;
      
      if (start && end) {
        console.log('Using date range API endpoint');
        result = await analyticsService.getAnalyticsByDateRange(start, end);
        setIsFiltered(true);
      } else {
        console.log('Using default analytics API endpoint');
        result = await analyticsService.getAnalytics();
        setIsFiltered(false);
      }
      
      console.log('Analytics response:', result);
      
      // Check if result exists and has the expected properties
      if (!result) {
        throw new Error('Invalid response from analytics service');
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
      console.error('Error fetching analytics:', err);
      setError('Failed to load dashboard data. Please check your network connection and try again.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    // Initial data fetch with default date range
    if (dateRange.startDate && dateRange.endDate) {
      // Prevent duplicate API calls
      const timer = setTimeout(() => {
        fetchAnalytics();
      }, 100);
      
      // Cleanup function to prevent memory leaks
      return () => clearTimeout(timer);
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
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    const newDateRange = {
      startDate: thirtyDaysAgo.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0]
    };
    
    setDateRange(newDateRange);
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

  // Format currency helper function
  const formatCurrency = (value) => {
    if (!value) return '0.00 MAD';
    return `${parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MAD`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-bold text-[#07f468]">Dashboard Overview</h2>
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

const Reservations = () => {
  const [reservations, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [idTerrain, setIdTerrain] = useState();
  const [reserv, setReserv] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTerrain, setSelectedTerrain] = useState("all");
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const modalRef = useRef(null);
  const menuRef = useRef(null);
  // Add this new state for the detail modal
  const [selectedReservation, setSelectedReservation] = useState(null);
  // Add notification state
  const [showNotification, setShowNotification] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: 'success' });
  // Add state for terrains list
  const [terrainsList, setTerrainsList] = useState([]);
  
  // Utility function to show notifications
  const showSuccessNotification = (message) => {
    setNotification({ message, type: 'success' });
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const showErrorNotification = (message) => {
    setNotification({ message, type: 'error' });
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };
  
  // Fetch terrains data
  const fetchTerrains = useCallback(async () => {
    try {
      const response = await adminTerrainService.getAllTerrains();
      if (response && response.data) {
        setTerrainsList(response.data);
      }
    } catch (error) {
      console.error('Error fetching terrains:', error);
    }
  }, []);
  
  // Updated fetch data function without polling
  const fetchData = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      // Prepare params object for filtering
      const params = {
        per_page: 100, // Request 100 items per page
        page: page
      };
      
      if (selectedTerrain !== "all") {
        params.id_terrain = selectedTerrain;
      }
      
      const response = await reservationService.getAllReservations(params);
      
      if (response.status === "success") {
        // Process the data to ensure consistent structure regardless of API source
        const processedData = response.data.map(res => ({
          id_reservation: res.id_reservation,
          num_res: res.num_res || "",
          id_client: res.client?.id_client || res.id_client,
          id_terrain: parseInt(res.terrain?.id_terrain || res.id_terrain),
          date: res.date,
          heure: res.heure,
          etat: res.etat || "en attente",
          created_at: res.created_at,
          client: res.client || {
            id_client: res.id_client,
            nom: res.name || "",
            prenom: "",
            telephone: "",
            email: ""
          },
          terrain: res.terrain || {
            id_terrain: parseInt(res.id_terrain),
            nom: res.nom_terrain || `Terrain ${res.id_terrain}`,
            type: res.type || "",
            prix: res.prix || 0
          }
        }));
        
        setData(processedData);
        
        // Set pagination data if available
        if (response.pagination) {
          setTotalPages(response.pagination.last_page);
          setCurrentPage(response.pagination.current_page);
        }
      } else {
        // Handle empty data case
        setData([]);
        setTotalPages(1);
        setCurrentPage(1);
      }
    } catch (error) {
      setError("Failed to load reservations. Please try again.");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [selectedTerrain]);

  useEffect(() => {
    // Check sessionStorage for selected hour and time
    if (sessionStorage.getItem("selectedHour") && sessionStorage.getItem("selectedTime")) {
      setReserv(true);
    } else {
      setReserv(false); // Reset if values are not present
    }

    // Listen for custom event from table component
    const handleReservationClick = (event) => {
      setReserv(true);
      if (event.detail.terrain) {
        setIdTerrain(event.detail.terrain);
      }
    };

    document.addEventListener('reservationCellClicked', handleReservationClick);

    // Fetch terrains data
    fetchTerrains();
    
    // Fetch reservations data
    fetchData();

    // Add event listener for click outside
    document.addEventListener("mousedown", handleClickOutside);

    // Listen for cancel event
    const handleReservationCancel = () => {
      setReserv(false);
      // Refresh data after cancel
      fetchData();
    };
    
    // Listen for successful reservation
    const handleReservationSuccess = () => {
      // Refresh data after successful reservation
      fetchData();
    };
    
    document.addEventListener('closeReservationPopup', handleReservationCancel);
    document.addEventListener('reservationSuccess', handleReservationSuccess);

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener('reservationCellClicked', handleReservationClick);
      document.removeEventListener('closeReservationPopup', handleReservationCancel);
      document.removeEventListener('reservationSuccess', handleReservationSuccess);
    };
  }, [fetchData, fetchTerrains]);

  // Handle click outside modal and menu
  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setReserv(false);
      // Clear sessionStorage instead of localStorage
      sessionStorage.removeItem("selectedHour");
      sessionStorage.removeItem("selectedTime");
      sessionStorage.removeItem("selectedTerrain");
    }
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setActiveMenu(null);
    }
  };

  // Handle terrain change
  const handleChange = (terrain) => {
    setIdTerrain(terrain);
    
    // Store terrain data in sessionStorage
    if (terrain) {
      const terrainId = parseInt(terrain.id_terrain);
      sessionStorage.setItem("selectedTerrainId", terrainId);
      sessionStorage.setItem("selectedTerrainName", terrain.nom_terrain);
      
      // If there's an open form modal, we need to update it
      if (reserv) {
        // Dispatch a custom event to notify form
        const event = new CustomEvent('terrainSelected', {
          detail: { terrain: {
            ...terrain,
            id_terrain: terrainId
          }}
        });
        document.dispatchEvent(event);
      }
    }
  };

  // Toggle menu
  const toggleMenu = (id) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  // Updated handle actions with proper etat parameter
  const handleAction = async (action, id) => {
    try {
      if (action === "valider") {
        // Pass etat: "reserver" for validation and update payment status
        await reservationService.validateReservation(id, { 
          etat: "reserver",
          payment_status: "paid" 
        });
        
        // Update the local state to reflect the change
        setData(prevData => 
          prevData.map(res => 
            res.id_reservation === id ? {
              ...res, 
              etat: "reserver",
              payment_status: "paid"
            } : res
          )
        );
        
        showSuccessNotification("Reservation validated successfully");
      } else if (action === "devalider") {
        // Pass etat: "en attente" for invalidation
        await reservationService.invalidateReservation(id, { 
          etat: "en attente",
          payment_status: "pending" 
        });
        
        // Update the local state to reflect the change
        setData(prevData => 
          prevData.map(res => 
            res.id_reservation === id ? {
              ...res, 
              etat: "en attente",
              payment_status: "pending"
            } : res
          )
        );
        
        showSuccessNotification("Reservation marked as pending");
      }
      
      // Refresh data after action completes
      fetchData();
    } catch (error) {
      console.error(`Error performing ${action} action:`, error);
      // Show error notification
      showErrorNotification(`Failed to ${action === "valider" ? "validate" : "invalidate"} reservation. Please try again.`);
    }
  };

  // Updated handle delete confirmation using our service
  const handleConfirmDelete = async () => {
    if (reservationToDelete) {
      try {
        await reservationService.deleteReservation(reservationToDelete);
        // Remove the deleted reservation from the state
        setData(prevData => 
          prevData.filter(res => res.id_reservation !== reservationToDelete)
        );
        showSuccessNotification("Reservation deleted successfully");
        setShowConfirmation(false);
        setReservationToDelete(null);
      } catch (error) {
        console.error("Error deleting reservation:", error);
        showErrorNotification("Failed to delete reservation. Please try again.");
      }
    }
  };
  
  // Handle terrain change
  const handleTerrainChange = (e) => {
    setSelectedTerrain(e.target.value);
    setClientSidePage(1); // Reset to first page when terrain filter changes
  };

  // Handle search query change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setClientSidePage(1); // Reset to first page when search query changes
  };
  
  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchData(page);
  };

  // Filter reservations based on search query and selected terrain
  const filteredReservations = reservations.filter((reservation) => {
    const searchLower = searchQuery.toLowerCase();
    
    // Handle client as an object instead of a string
    const clientName = reservation.client?.nom 
      ? `${reservation.client.nom} ${reservation.client.prenom || ''}`.trim()
      : '';
    
    const matchesSearch = 
      clientName.toLowerCase().includes(searchLower) ||
      reservation.date?.includes(searchQuery);
    
    // Filter by terrain if a specific one is selected
    const matchesTerrain = selectedTerrain === "all" || 
      (reservation.terrain?.id_terrain?.toString() === selectedTerrain || 
       reservation.id_terrain?.toString() === selectedTerrain);
    
    return matchesSearch && matchesTerrain;
  });

  // Add pagination control for the filtered reservations
  const [clientSidePage, setClientSidePage] = useState(1);
  const itemsPerPage = 10;
  const totalClientSidePages = Math.ceil(filteredReservations.length / itemsPerPage);
  
  // Get current page reservations for display
  const currentReservations = filteredReservations.slice(
    (clientSidePage - 1) * itemsPerPage, 
    clientSidePage * itemsPerPage
  );
  
  // Go to a specific page
  const handleClientSidePageChange = (page) => {
    setClientSidePage(page);
  };

  // Add this function to handle row click for mobile view
  const handleRowClick = (reservation) => {
    // Only open detail view on mobile
    if (window.innerWidth < 640) {
      setSelectedReservation(reservation);
    }
  };

  // Add this function to close the detail modal
  const closeDetailModal = () => {
    setSelectedReservation(null);
  };

  // Update in Admin.jsx to ensure terrain data is correctly passed
  const handleOpenReservationForm = () => {
    setReserv(true);
    
    // Make sure we have the terrain data in the form
    if (idTerrain) {
      // Ensure terrain ID is handled as a number
      const terrainId = parseInt(idTerrain.id_terrain);
      
      // Explicitly set the selectedTerrain in sessionStorage
      sessionStorage.setItem("selectedTerrainId", terrainId);
      sessionStorage.setItem("selectedTerrainName", idTerrain.nom_terrain);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#07f468]">Réservations</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleOpenReservationForm}
          className="flex items-center gap-2 bg-[#07f468] hover:bg-[#05c757] text-gray-900 font-medium px-4 py-2 rounded-lg shadow-lg transition duration-200"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Ajouter Réservation</span>
        </motion.button>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-700/80 sm:backdrop-blur-sm p-4 sm:p-6 rounded-lg shadow-lg border border-gray-600/50"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-white">Calendrier de Réservation</h3>
        </div>
        
        {/* Reservation form popup */}
        <div className="text-[#000]">
          <AnimatePresence>
            {reserv && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 sm:backdrop-blur-sm flex justify-center items-center z-50 p-4"
                onClick={handleClickOutside}
              >
                <motion.div
                  ref={modalRef}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 20 }}
                  transition={{ type: "spring", damping: 15, stiffness: 300 }}
                  className="bg-gray-800 rounded-xl shadow-2xl h-auto p-6 w-full max-w-md mx-4 border border-gray-700"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FormResev
                    Terrain={idTerrain}
                    selectedHour={sessionStorage.getItem("selectedHour")}
                    selectedTime={sessionStorage.getItem("selectedTime")}
                    onSuccess={() => {
                      fetchData();
                      setReserv(false); // Close modal after success
                    }}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <Buttons onChange={handleChange} />
        <div className="mt-4">
          <Tableau terrain={idTerrain} />
        </div>
      </motion.div>
   
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-gray-700/80 sm:backdrop-blur-sm p-4 sm:p-8 rounded-xl shadow-2xl border border-gray-600/50"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h3 className="text-xl sm:text-2xl font-bold text-white">Réservations à venir</h3>
        </div>

        {/* Search Bar and Terrain Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Rechercher par client ou date..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#07f468] focus:border-transparent"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <div className="relative w-full sm:w-48">
            <select
              value={selectedTerrain}
              onChange={handleTerrainChange}
              className="w-full pl-10 pr-8 py-2.5 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#07f468] focus:border-transparent appearance-none"
            >
              <option value="all">Tous les Terrains</option>
              {terrainsList.map(terrain => (
                <option key={terrain.id_terrain} value={terrain.id_terrain}>
                  {terrain.nom_terrain || `Terrain ${terrain.id_terrain}`}
                </option>
              ))}
            </select>
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Responsive Table - Fixed overflow issues */}
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#07f468]"></div>
          </div>
        ) : error ? (
          <div className="bg-red-900/20 border border-red-500 p-4 rounded-lg text-center">
            <p className="text-red-400 mb-2">{error}</p>
            <button 
              onClick={fetchData}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
            >
              Réessayer
            </button>
          </div>
        ) : filteredReservations.length === 0 ? (
          <div className="bg-gray-800/50 rounded-xl p-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-xl font-medium text-white mb-2">Aucune réservation trouvée</h3>
            <p className="text-gray-400 mb-6">Essayez d'ajuster vos critères de recherche ou de filtre</p>
            <button 
              onClick={() => {
                setSearchQuery("");
                setSelectedTerrain("all");
                setClientSidePage(1); // Reset to first page when filters change
              }}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
            >
              Effacer les filtres
            </button>
          </div>
        ) : (
          <div className="bg-gray-800/70 rounded-xl shadow-xl border border-gray-700">
            <div className="max-w-full">
              <table className="w-full table-auto">
                <thead className="bg-gray-900/80 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Heure</th>
                    <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Terrain</th>
                    <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Client</th>
                    <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Téléphone</th>
                    <th className="hidden xl:table-cell px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                    {/* Show Status on mobile, hide on larger screens */}
                    <th className="sm:hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Statut</th>
                    {/* Hide Status on mobile, show on larger screens */}
                    <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Statut</th>
                    {/* Hide Actions on mobile, show on larger screens */}
                    <th className="hidden sm:table-cell px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {currentReservations.map((reservation, index) => (
                    <motion.tr 
                      key={reservation.id_reservation}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="group hover:bg-gray-700/50 transition-all cursor-pointer"
                      onClick={() => handleRowClick(reservation)}
                    >
                      <td className="px-4 py-3.5 text-sm text-white">{reservation.date}</td>
                      <td className="px-4 py-3.5 text-sm text-white">{reservation.heure}</td>
                      <td className="hidden md:table-cell px-4 py-3.5 text-sm text-white">
                        {reservation.terrain?.nom || `Terrain ${reservation.id_terrain || ''}`}
                      </td>
                      <td className="hidden sm:table-cell px-4 py-3.5 text-sm text-white">
                        {reservation.client?.nom 
                          ? `${reservation.client.nom} ${reservation.client.prenom || ''}`.trim()
                          : 'Client inconnu'}
                      </td>
                      <td className="hidden lg:table-cell px-4 py-3.5 text-sm text-white">
                        {reservation.client?.telephone || 'N/A'}
                      </td>
                      <td className="hidden xl:table-cell px-4 py-3.5 text-sm text-white">
                        {reservation.client?.email || 'N/A'}
                      </td>
                      {/* Show Status on mobile */}
                      <td className="sm:hidden px-4 py-3.5 text-sm">
                        <span
                          className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                            reservation.etat === "reserver"
                              ? "bg-green-900/50 text-green-300 border border-green-500/30"
                              : "bg-yellow-900/50 text-yellow-300 border border-yellow-500/30"
                          }`}
                        >
                          {reservation.etat === "reserver" ? "Confirmé" : "En attente"}
                        </span>
                      </td>
                      {/* Hide Status on mobile */}
                      <td className="hidden sm:table-cell px-4 py-3.5 text-sm">
                        <span
                          className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                            reservation.etat === "reserver"
                              ? "bg-green-900/50 text-green-300 border border-green-500/30"
                              : "bg-yellow-900/50 text-yellow-300 border border-yellow-500/30"
                          }`}
                        >
                          {reservation.etat === "reserver" ? "Confirmé" : "En attente"}
                        </span>
                      </td>
                      {/* Hide Actions on mobile */}
                      <td className="hidden sm:table-cell px-4 py-3.5 text-sm text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="relative inline-block">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => toggleMenu(reservation.id_reservation)}
                            className="text-white hover:text-[#07f468] transition-colors p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#07f468] focus:ring-opacity-50"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                          </motion.button>

                          <AnimatePresence>
                            {activeMenu === reservation.id_reservation && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                transition={{ duration: 0.2 }}
                                ref={menuRef}
                                className="absolute right-0 z-10 mt-2 w-48 bg-gray-900 rounded-lg shadow-xl border border-gray-700"
                                style={{ top: "100%" }}
                              >
                                <div className="py-1">
                                  <motion.button
                                    whileHover={{ backgroundColor: "#1f2937" }}
                                    className="flex items-center w-full px-4 py-3 text-sm text-white hover:text-[#07f468] transition-colors focus:outline-none"
                                    onClick={() => handleAction("valider", reservation.id_reservation)}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Valider
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ backgroundColor: "#1f2937" }}
                                    className="flex items-center w-full px-4 py-3 text-sm text-white hover:text-[#07f468] transition-colors focus:outline-none"
                                    onClick={() => handleAction("devalider", reservation.id_reservation)}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Dévalider
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ backgroundColor: "#1f2937" }}
                                    className="flex items-center w-full px-4 py-3 text-sm text-white hover:text-red-500 transition-colors focus:outline-none"
                                    onClick={() => {
                                      setReservationToDelete(reservation.id_reservation);
                                      setShowConfirmation(true);
                                    }}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Annuler Réservation
                                  </motion.button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalClientSidePages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 bg-gray-800/50 p-4 rounded-xl">
            <div className="text-sm text-gray-400 mb-4 sm:mb-0">
              Showing {filteredReservations.length > 0 ? (clientSidePage - 1) * itemsPerPage + 1 : 0} to {Math.min(clientSidePage * itemsPerPage, filteredReservations.length)} of {filteredReservations.length} reservations
            </div>
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleClientSidePageChange(clientSidePage - 1)}
                disabled={clientSidePage === 1}
                className={`p-2 rounded-lg ${
                  clientSidePage === 1
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-gray-700 text-white hover:bg-gray-600"
                }`}
              >
                <ChevronLeft size={16} />
              </motion.button>
              {Array.from({ length: Math.min(5, totalClientSidePages) }, (_, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleClientSidePageChange(i + 1)}
                  className={`px-3 py-1 rounded-md ${
                    clientSidePage === i + 1
                      ? 'bg-[#07f468] text-gray-900 font-medium'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                >
                  {i + 1}
                </motion.button>
              ))}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleClientSidePageChange(clientSidePage + 1)}
                disabled={clientSidePage === totalClientSidePages}
                className={`p-2 rounded-lg ${
                  clientSidePage === totalClientSidePages
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-gray-700 text-white hover:bg-gray-600"
                }`}
              >
                <ChevronRight size={16} />
              </motion.button>
            </div>
          </div>
        )}

        {/* Confirmation Dialog */}
        <AnimatePresence>
          {showConfirmation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 sm:backdrop-blur-sm flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-gray-800 p-6 rounded-xl shadow-2xl max-w-md w-full border border-gray-700"
              >
                <h3 className="text-xl font-bold text-white mb-2">Confirmer la suppression</h3>
                <p className="text-gray-300 mb-6">Êtes-vous sûr de vouloir supprimer cette réservation ? Cette action ne peut pas être annulée.</p>
                <div className="flex justify-end space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowConfirmation(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                  >
                    Annuler
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleConfirmDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Supprimer
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedReservation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={closeDetailModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-gray-800 p-5 rounded-xl shadow-2xl max-w-md w-full border border-gray-700 sm:max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Détails de la réservation</h3>
                <button 
                  onClick={closeDetailModal}
                  className="p-1 rounded-full hover:bg-gray-700"
                >
                  <X size={20} className="text-gray-400 hover:text-white" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Calendar size={18} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Date</p>
                    <p className="text-white">{selectedReservation.date}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Clock size={18} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Heure</p>
                    <p className="text-white">{selectedReservation.heure}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin size={18} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Terrain</p>
                    <p className="text-white">
                      {selectedReservation.terrain?.nom || `Terrain ${selectedReservation.id_terrain || ''}`}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <User size={18} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Client</p>
                    <p className="text-white">
                      {selectedReservation.client?.nom 
                        ? `${selectedReservation.client.nom} ${selectedReservation.client.prenom || ''}`.trim()
                        : 'Client inconnu'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone size={18} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Téléphone</p>
                    <p className="text-white">
                      {selectedReservation.client?.telephone || 'N/A'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail size={18} className="text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Email</p>
                    <p className="text-white">
                      {selectedReservation.client?.email || 'N/A'}
                    </p>
                  </div>
                </div>
                
                <div className="sm:col-span-2 flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    selectedReservation.etat === "reserver" 
                      ? "bg-green-500" 
                      : "bg-yellow-500"
                  }`}></div>
                  <div>
                    <p className="text-xs text-gray-400">Statut</p>
                    <p className={`text-sm font-medium px-2.5 py-1 rounded-full ${
                      selectedReservation.etat === "reserver"
                        ? "bg-green-900/50 text-green-300 border border-green-500/30"
                        : "bg-yellow-900/50 text-yellow-300 border border-yellow-500/30"
                    }`}>
                      {selectedReservation.etat === "reserver" ? "Confirmé" : "En attente"}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => {
                    handleAction(
                      selectedReservation.etat === "reserver" ? "devalider" : "valider", 
                      selectedReservation.id_reservation
                    );
                    closeDetailModal();
                  }}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center space-x-2"
                >
                  {selectedReservation.etat === "reserver" ? (
                    <>
                      <X size={16} />
                      <span>Dévalider</span>
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      <span>Valider</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => {
                    setReservationToDelete(selectedReservation.id_reservation);
                    setShowConfirmation(true);
                    closeDetailModal();
                  }}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center space-x-2"
                >
                  <Trash size={16} />
                  <span>Supprimer</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Toast Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg z-[9999] flex items-center ${
              notification.type === 'success' 
                ? 'bg-green-800 text-green-100' 
                : 'bg-red-800 text-red-100'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle className="mr-2" size={20} />
            ) : (
              <X className="mr-2" size={20} />
            )}
            <span>{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Inbox = () => {
  const messages = [
    {
      id: 1,
      from: "John Doe",
      subject: "Reservation Confirmation",
      date: "2023-06-15",
      read: false,
    },
    {
      id: 2,
      from: "Jane Smith",
      subject: "Field Maintenance Update",
      date: "2023-06-14",
      read: true,
    },
    {
      id: 3,
      from: "Bob Johnson",
      subject: "Tournament Inquiry",
      date: "2023-06-13",
      read: false,
    },
  ];

  return (
    <div className="space-y-6">
      {" "}
      <h2 className="text-3xl font-bold text-[#07f468]">Inbox</h2>{" "}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-700 rounded-lg shadow-lg overflow-hidden"
      >
        <ul className="divide-y divide-gray-600">
          {" "}
          {messages.map((message) => (
            <motion.li
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`p-4 hover:bg-gray-600 cursor-pointer ${
                message.read ? "opacity-70" : ""
              }`}
            >
              {" "}
              <div className="flex items-center justify-between">
                {" "}
                <div className="flex items-center space-x-4">
                  {" "}
                  <Mail
                    size={20}
                    className={`${
                      message.read ? "text-gray-400" : "text-[#07f468]"
                    }`}
                  />{" "}
                  <div>
                    {" "}
                    <p
                      className={`font-semibold ${
                        message.read ? "text-gray-300" : "text-white"
                      }`}
                    >
                      {message.from}
                    </p>{" "}
                    <p className="text-sm text-gray-400">{message.subject}</p>{" "}
                  </div>{" "}
                </div>{" "}
                <div className="flex items-center space-x-2">
                  {" "}
                  <span className="text-sm text-gray-400">
                    {message.date}
                  </span>{" "}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-yellow-400 hover:text-yellow-300"
                  >
                    {" "}
                    <Star size={20} />
                  </motion.button>{" "}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-red-400 hover:text-red-300"
                  >
                    {" "}
                    <Trash2 size={20} />{" "}
                  </motion.button>{" "}
                </div>{" "}
              </div>{" "}
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};

const Analytics = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-[#07f468]">Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-700 p-6 rounded-lg shadow-lg"
        >
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <BarChart2 size={24} className="text-[#07f468] mr-2" />
            Reservation Trends
          </h3>
          <div className="h-64 flex items-end justify-between">
            {[60, 80, 40, 70, 50, 90, 30].map((height, index) => (
              <motion.div
                key={index}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="w-8 bg-[#07f468] rounded-t"
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-400">
            {" "}
            <span>Mon</span> <span>Tue</span> <span>Wed</span> <span>Thu</span>{" "}
            <span>Fri</span> <span>Sat</span> <span>Sun</span>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-gray-700 p-6 rounded-lg shadow-lg"
        >
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <PieChart size={24} className="text-[#07f468] mr-2" />
            Field Usage Distribution
          </h3>
          <div className="h-64 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-48 h-48">
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#07f468"
                strokeWidth="20"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 0.45 }}
                transition={{ duration: 1 }}
              />
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#3b82f6"
                strokeWidth="20"
                strokeDasharray="0 251.2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 0.3 }}
                transition={{ duration: 1, delay: 0.5 }}
              />
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#eab308"
                strokeWidth="20"
                strokeDasharray="0 251.2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 0.25 }}
                transition={{ duration: 1, delay: 1 }}
              />
            </svg>
          </div>
          <div className="flex justify-center space-x-4 mt-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-[#07f468] rounded-full mr-2"></div>
              <span className="text-sm">Field A (45%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
              <span className="text-sm">Field B (30%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
              <span className="text-sm">Field C (25%)</span>{" "}
            </div>{" "}
          </div>{" "}
        </motion.div>{" "}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-gray-700 p-6 rounded-lg shadow-lg"
        >
          {" "}
          <h3 className="text-xl font-bold mb-4 flex items-center">
            {" "}
            <TrendingUp size={24} className="text-[#07f468] mr-2" /> User Growth{" "}
          </h3>{" "}
          <div className="h-64 relative">
            {" "}
            <div className="absolute inset-0 flex items-end">
              {" "}
              <div className="flex-1 bg-gradient-to-t from-[#07f468] to-transparent"></div>{" "}
            </div>{" "}
            <div className="absolute inset-0 flex items-end justify-between">
              {" "}
              <div className="w-1 bg-white h-1/4"></div>{" "}
              <div className="w-1 bg-white h-1/3"></div>{" "}
              <div className="w-1 bg-white h-1/2"></div>{" "}
              <div className="w-1 bg-white h-3/4"></div>{" "}
              <div className="w-1 bg-white h-full"></div>{" "}
            </div>{" "}
          </div>{" "}
          <div className="flex justify-between mt-2 text-sm text-gray-400">
            {" "}
            <span>Jan</span> <span>Mar</span> <span>May</span> <span>Jul</span>{" "}
            <span>Sep</span>{" "}
          </div>{" "}
        </motion.div>{" "}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-gray-700 p-6 rounded-lg shadow-lg"
        >
          {" "}
          <h3 className="text-xl font-bold mb-4 flex items-center">
            {" "}
            <DollarSign size={24} className="text-[#07f468] mr-2" /> Revenue
            Overview{" "}
          </h3>{" "}
          <div className="space-y-4">
            {" "}
            <div className="flex justify-between items-center">
              {" "}
              <span>Total Revenue</span>{" "}
              <span className="text-2xl font-bold text-[#07f468]">$24,500</span>{" "}
            </div>{" "}
            <div className="flex justify-between items-center">
              {" "}
              <span>This Month</span>{" "}
              <span className="text-xl font-semibold text-white">$8,200</span>{" "}
            </div>{" "}
            <div className="flex justify-between items-center">
              {" "}
              <span>Last Month</span>{" "}
              <span className="text-xl font-semibold text-white">$7,800</span>{" "}
            </div>{" "}
            <div className="pt-4 border-t border-gray-600">
              {" "}
              <div className="flex justify-between items-center text-sm">
                {" "}
                <span>Growth</span>{" "}
                <span className="text-[#07f468]">+5.13%</span>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </motion.div>{" "}
      </div>
    </div>
  );
};

const menuItems = [
  { id: "overview", icon: Home, label: "Dashboard" },
  { id: "users", icon: Users, label: "Utilisateurs" },
  { id: "reservations", icon: Calendar, label: "Réservations" },
  { id: "academie", icon: School, label: "Académie" },
  { id: "terrains", icon: MapPin, label: "Terrains" },
  { id: "tournoi", icon: Trophy, label: "Tournois" },
  { id: "joueurs/Equips", icon: UserRoundSearch, label: "Joueurs & Équipes" },
  { id: "inbox", icon: MessageSquare, label: "Messages" },
  { id: "analytics", icon: BarChart2, label: "Statistiques" },
  { id: "settings", icon: Settings, label: "Paramètres" }
];

// Add Users component implementation
const UsersManagement = () => {
  const searchDebounceTimer = useRef(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRole, setSelectedRole] = useState('all');
  const [sortBy, setSortBy] = useState('id_compte');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    age: '',
    password: '',
    password_confirmation: '',
    role: 'user'
  });
  const [formErrors, setFormErrors] = useState({});
  const [showNotification, setShowNotification] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: 'success' });
  const [passwordData, setPasswordData] = useState({
    new_password: '',
    new_password_confirmation: ''
  });
  const [showPassword, setShowPassword] = useState({
    password: false,
    password_confirmation: false,
    new_password: false,
    new_password_confirmation: false
  });
  const [passwordStrength, setPasswordStrength] = useState({
    password: 0, // 0 = none, 1 = weak, 2 = medium, 3 = strong
    new_password: 0
  });
  
  // Notification utility functions
  const showSuccessNotification = (message) => {
    setNotification({ message, type: 'success' });
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const showErrorNotification = (message) => {
    setNotification({ message, type: 'error' });
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  // Fetch users with pagination, filtering, and sorting
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use the compteService instead of direct URL call
      const params = {
        page: currentPage,
        per_page: 10,
        sort_by: sortBy,
        sort_order: sortOrder
      };
      
      // Add role filter if selected
      if (selectedRole !== 'all') {
        params.role = selectedRole;
      }
      
      // Add search query if present
      if (searchQuery.trim() !== '') {
        params.search = searchQuery;
      }
      
      const response = await compteService.getAllComptes(params.page, params.per_page, params);
      
      if (response && response.success) {
        setUsers(response.data || []);
        
        // Update pagination state if available
        if (response.meta) {
          // Use the last_page value for pagination
          const { total, last_page } = response.meta;
          // Store total pages for pagination component
          setTotalPages(last_page || 1);
        }
      } else {
        setError('Failed to load users data');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users data');
    } finally {
      setLoading(false);
    }
  }, [currentPage, sortBy, sortOrder, selectedRole, searchQuery]);
  
  // Create a new user
  const createUser = async (userData) => {
    try {
      setLoading(true);
      const response = await compteService.createCompte(userData);
      showSuccessNotification('User created successfully');
      fetchUsers(); // Refresh the user list
      return true;
    } catch (error) {
      console.error('Error creating user:', error);
      showErrorNotification(error.response?.data?.message || 'Failed to create user');
      setFormErrors(error.response?.data?.error || {});
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Update user
  const updateUser = async (id, userData) => {
    try {
      setLoading(true);
      const response = await compteService.updateCompte(id, userData);
      showSuccessNotification('User updated successfully');
      fetchUsers(); // Refresh the user list
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      showErrorNotification(error.response?.data?.message || 'Failed to update user');
      setFormErrors(error.response?.data?.error || {});
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Update user role
  const updateUserRole = async (id, role) => {
    try {
      setLoading(true);
      const response = await compteService.updateRole(id, { role });
      showSuccessNotification('User role updated successfully');
      fetchUsers(); // Refresh the user list
      return true;
    } catch (error) {
      console.error('Error updating user role:', error);
      showErrorNotification(error.response?.data?.message || 'Failed to update user role');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Delete user
  const deleteUser = async (id) => {
    try {
      setLoading(true);
      const response = await compteService.deleteCompte(id);
      showSuccessNotification('User deleted successfully');
      fetchUsers(); // Refresh the user list
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      showErrorNotification(error.response?.data?.message || 'Failed to delete user');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Reset user password
  const resetPassword = async (id, passwordData) => {
    try {
      setLoading(true);
      const response = await compteService.resetPassword(id, passwordData);
      showSuccessNotification('Password reset successfully');
      return true;
    } catch (error) {
      console.error('Error resetting password:', error);
      showErrorNotification(error.response?.data?.message || 'Failed to reset password');
      setFormErrors(error.response?.data?.error || {});
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  
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
  
  // Form event handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Calculate password strength for password field
    if (name === 'password') {
      calculatePasswordStrength(value, 'password');
    }
    
    // Clear the error for this field when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Calculate password strength for new_password field
    if (name === 'new_password') {
      calculatePasswordStrength(value, 'new_password');
    }
    
    // Clear the error for this field when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  // Calculate password strength
  const calculatePasswordStrength = (password, field) => {
    let strength = 0;
    
    if (password.length > 0) {
      // Start with 1 (weak) if any password is entered
      strength = 1;
      
      // Medium if length >= 8 and has a number
      if (password.length >= 8 && /\d/.test(password)) {
        strength = 2;
      }
      
      // Strong if medium criteria + uppercase + lowercase
      if (strength === 2 && /[A-Z]/.test(password) && /[a-z]/.test(password)) {
        strength = 3;
      }
    }
    
    setPasswordStrength(prev => ({
      ...prev,
      [field]: strength
    }));
  };
  
  // Modal management
  const openAddUserModal = () => {
    setFormData({
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      age: '',
      password: '',
      password_confirmation: '',
      role: 'user'
    });
    setFormErrors({});
    setModalType('add');
    setShowModal(true);
    // Reset password visibility
    setShowPassword({
      password: false,
      password_confirmation: false,
      new_password: false,
      new_password_confirmation: false
    });
  };
  
  const openEditUserModal = (user) => {
    setSelectedUser(user);
    setFormData({
      nom: user.nom || '',
      prenom: user.prenom || '',
      email: user.email || '',
      telephone: user.telephone || '',
      age: user.age || '',
      role: user.role || 'user'
    });
    setFormErrors({});
    setModalType('edit');
    setShowModal(true);
  };
  
  const openDeleteConfirmation = (user) => {
    setSelectedUser(user);
    setShowDeleteConfirm(true);
  };
  
  const openResetPasswordModal = (user) => {
    setSelectedUser(user);
    setPasswordData({
      new_password: '',
      new_password_confirmation: ''
    });
    setFormErrors({});
    setShowResetPasswordModal(true);
    // Reset password visibility
    setShowPassword({
      password: false,
      password_confirmation: false,
      new_password: false,
      new_password_confirmation: false
    });
  };
  
  const closeModal = () => {
    setShowModal(false);
    setShowDeleteConfirm(false);
    setShowResetPasswordModal(false);
    setFormErrors({});
    // Reset password visibility
    setShowPassword({
      password: false,
      password_confirmation: false,
      new_password: false,
      new_password_confirmation: false
    });
  };
  
  // Password visibility toggle functions
  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };
  
  // Password complexity validation
  const validatePasswordStrength = (password) => {
    // Password should be at least 8 characters
    if (password.length < 8) {
      return 'Le mot de passe doit contenir au moins 8 caractères';
    }
    
    // Check for at least one number
    if (!/\d/.test(password)) {
      return 'Le mot de passe doit contenir au moins un chiffre';
    }
    
    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      return 'Le mot de passe doit contenir au moins une lettre majuscule';
    }
    
    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      return 'Le mot de passe doit contenir au moins une lettre minuscule';
    }
    
    return null; // Password is strong
  };
  
  // Form submission handlers
  const handleAddUser = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.password_confirmation) {
      setFormErrors({
        ...formErrors,
        password_confirmation: ['Les mots de passe ne correspondent pas']
      });
      return;
    }
    
    // Validate password strength
    const passwordError = validatePasswordStrength(formData.password);
    if (passwordError) {
      setFormErrors({
        ...formErrors,
        password: [passwordError]
      });
      return;
    }
    
    const success = await createUser(formData);
    if (success) {
      closeModal();
    }
  };
  
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    
    const success = await updateUser(selectedUser.id_compte, formData);
    if (success) {
      closeModal();
    }
  };
  
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    const success = await deleteUser(selectedUser.id_compte);
    if (success) {
      setShowDeleteConfirm(false);
    }
  };
  
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    
    // Validate passwords match
    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      setFormErrors({
        ...formErrors,
        new_password_confirmation: ['Les mots de passe ne correspondent pas']
      });
      return;
    }
    
    // Validate password strength
    const passwordError = validatePasswordStrength(passwordData.new_password);
    if (passwordError) {
      setFormErrors({
        ...formErrors,
        new_password: [passwordError]
      });
      return;
    }
    
    const success = await resetPassword(selectedUser.id_compte, passwordData);
    if (success) {
      setShowResetPasswordModal(false);
    }
  };
  
  const handleRoleChange = async (userId, newRole) => {
    const success = await updateUserRole(userId, newRole);
    if (success) {
      // Update the local state to reflect the change immediately
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id_compte === userId ? { ...user, role: newRole } : user
        )
      );
    }
  };
  
  // Search and filter functions with debounce
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when search changes
    
    // Use debouncing to prevent too many API calls while typing
    clearTimeout(searchDebounceTimer.current);
    searchDebounceTimer.current = setTimeout(() => {
      fetchUsers();
    }, 500);
  };

  // Remove the duplicate declaration here
  
  const handleRoleFilterChange = (e) => {
    setSelectedRole(e.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };
  
  const handleSortChange = (field) => {
    if (sortBy === field) {
      // If already sorting by this field, toggle the order
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Otherwise, sort by the new field in ascending order
      setSortBy(field);
      setSortOrder('asc');
    }
    setCurrentPage(1); // Reset to first page when sort changes
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#07f468]">Gestion des Utilisateurs</h2>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={openAddUserModal}
          className="flex items-center gap-2 bg-[#07f468] hover:bg-[#05c757] text-gray-900 font-medium px-4 py-2 rounded-lg shadow-lg transition duration-200"
        >
          <Plus size={18} />
          <span>Ajouter Utilisateur</span>
        </motion.button>
      </div>
      
      {/* <div className="bg-gray-800/50 p-4 sm:p-6 rounded-xl shadow-lg mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Rechercher par nom, prénom ou email..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#07f468] focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
          
          <select
            value={selectedRole}
            onChange={handleRoleFilterChange}
            className="w-full sm:w-48 pl-10 pr-4 py-2.5 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#07f468] focus:border-transparent appearance-none"
          >
            <option value="all">Tous les rôles</option>
            <option value="admin">Admin</option>
            <option value="user">Utilisateur</option>
          </select>
        </div>
      </div> */}
      
      <div className="bg-gray-700 rounded-xl shadow-lg overflow-hidden border border-gray-600/50">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-600">
            <thead className="bg-gray-800">
              <tr>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-700"
                  onClick={() => handleSortChange('nom')}
                >
                  <div className="flex items-center">
                    Utilisateur
                    {sortBy === 'nom' && (
                      <span className="ml-1">
                        {sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-700"
                  onClick={() => handleSortChange('email')}
                >
                  <div className="flex items-center">
                    Email
                    {sortBy === 'email' && (
                      <span className="ml-1">
                        {sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden md:table-cell">
                  Téléphone
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-700 divide-y divide-gray-600">
              {users.length > 0 ? (
                users.map((user, index) => (
                  <motion.tr 
                    key={user.id_compte || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="hover:bg-gray-600/50 transition-colors"
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-600 rounded-full flex items-center justify-center overflow-hidden">
                          {user.pfp ? (
                            <img src={user.pfp} alt={user.nom} className="h-full w-full object-cover" />
                          ) : (
                            <User size={20} className="text-gray-300" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{user.nom} {user.prenom}</div>
                          <div className="text-xs text-gray-400 sm:hidden">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap hidden sm:table-cell">
                      <div className="text-sm text-white">{user.email}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap hidden md:table-cell">
                      <div className="text-sm text-white">{user.telephone || 'N/A'}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                        user.role === 'admin' 
                          ? 'bg-purple-900/50 text-purple-300 border border-purple-500/30' 
                          : 'bg-blue-900/50 text-blue-300 border border-blue-500/30'
                      }`}>
                        {user.role === 'admin' ? 'Admin' : 'Utilisateur'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex justify-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => openEditUserModal(user)}
                          className="text-indigo-400 hover:text-indigo-300 p-1.5 rounded-full hover:bg-gray-600 transition-colors"
                          title="Modifier"
                        >
                          <Edit size={16} />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => openResetPasswordModal(user)}
                          className="text-yellow-400 hover:text-yellow-300 p-1.5 rounded-full hover:bg-gray-600 transition-colors"
                          title="Réinitialiser le mot de passe"
                        >
                          <Key size={16} />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleRoleChange(user.id_compte, user.role === 'admin' ? 'user' : 'admin')}
                          className="text-blue-400 hover:text-blue-300 p-1.5 rounded-full hover:bg-gray-600 transition-colors"
                          title="Changer le rôle"
                        >
                          <UserCog size={16} />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => openDeleteConfirmation(user)}
                          className="text-red-400 hover:text-red-300 p-1.5 rounded-full hover:bg-gray-600 transition-colors"
                          title="Supprimer"
                        >
                          <Trash size={16} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                    <div className="flex flex-col items-center">
                      <UserRoundSearch size={40} className="text-gray-500 mb-2" />
                      <p>Aucun utilisateur trouvé</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {users.length > 0 && (
          <div className="bg-gray-800 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs sm:text-sm text-gray-400">
              Affichage de {(currentPage - 1) * 10 + 1} à {Math.min(currentPage * 10, (currentPage - 1) * 10 + users.length)} sur {users.length} utilisateurs
            </div>
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg ${
                  currentPage === 1
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-gray-700 text-white hover:bg-gray-600"
                }`}
              >
                <ChevronLeft size={16} />
              </motion.button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Calculate the correct page number to show, centered around the current page
                let pageNum = currentPage;
                if (totalPages <= 5) {
                  // If we have 5 or fewer pages, just show them all in order
                  pageNum = i + 1;
                } else {
                  // Otherwise, center around current page
                  if (currentPage <= 3) {
                    // At the beginning, show pages 1-5
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    // At the end, show the last 5 pages
                    pageNum = totalPages - 4 + i;
                  } else {
                    // In the middle, show current page and 2 pages on each side
                    pageNum = currentPage - 2 + i;
                  }
                }
                
                return (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === pageNum
                        ? 'bg-[#07f468] text-gray-900 font-medium'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                  >
                    {pageNum}
                  </motion.button>
                );
              })}
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg ${
                  currentPage === totalPages
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-gray-700 text-white hover:bg-gray-600"
                }`}
              >
                <ChevronRight size={16} />
              </motion.button>
            </div>
          </div>
        )}
      </div>
      
      {/* Add User Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md mx-auto border border-gray-700"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">
                  {modalType === 'add' ? 'Ajouter un utilisateur' : 'Modifier l\'utilisateur'}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={modalType === 'add' ? handleAddUser : handleUpdateUser} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nom" className="block text-sm font-medium text-gray-300 mb-1">
                      Nom
                    </label>
                    <input
                      type="text"
                      id="nom"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#07f468] focus:border-transparent"
                      required
                    />
                    {formErrors.nom && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.nom}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="prenom" className="block text-sm font-medium text-gray-300 mb-1">
                      Prénom
                    </label>
                    <input
                      type="text"
                      id="prenom"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#07f468] focus:border-transparent"
                      required
                    />
                    {formErrors.prenom && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.prenom}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#07f468] focus:border-transparent"
                    required
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="telephone" className="block text-sm font-medium text-gray-300 mb-1">
                    Téléphone
                  </label>
                  <input
                    type="text"
                    id="telephone"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#07f468] focus:border-transparent"
                    required
                  />
                  {formErrors.telephone && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.telephone}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-300 mb-1">
                    Âge
                  </label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    min="1"
                    max="120"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#07f468] focus:border-transparent"
                    required
                  />
                  {formErrors.age && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.age}</p>
                  )}
                </div>

                {modalType === 'add' && (
                  <>
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                        Mot de passe
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword.password ? "text" : "password"}
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#07f468] focus:border-transparent"
                          required
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                          onClick={() => togglePasswordVisibility('password')}
                        >
                          {showPassword.password ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {formErrors.password && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
                      )}
                      {/* Password strength meter */}
                      {formData.password && (
                        <div className="mt-1">
                          <div className="flex items-center gap-1">
                            <div className={`h-1 flex-1 rounded-full ${
                              passwordStrength.password >= 1 ? 'bg-red-500' : 'bg-gray-600'
                            }`}></div>
                            <div className={`h-1 flex-1 rounded-full ${
                              passwordStrength.password >= 2 ? 'bg-yellow-500' : 'bg-gray-600'
                            }`}></div>
                            <div className={`h-1 flex-1 rounded-full ${
                              passwordStrength.password >= 3 ? 'bg-green-500' : 'bg-gray-600'
                            }`}></div>
                          </div>
                          <p className="text-xs mt-1 text-gray-400">
                            {passwordStrength.password === 1 && 'Mot de passe faible'}
                            {passwordStrength.password === 2 && 'Mot de passe moyen'}
                            {passwordStrength.password === 3 && 'Mot de passe fort'}
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-300 mb-1">
                        Confirmer le mot de passe
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword.password_confirmation ? "text" : "password"}
                          id="password_confirmation"
                          name="password_confirmation"
                          value={formData.password_confirmation}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#07f468] focus:border-transparent"
                          required
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                          onClick={() => togglePasswordVisibility('password_confirmation')}
                        >
                          {showPassword.password_confirmation ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      {formErrors.password_confirmation && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.password_confirmation}</p>
                      )}
                    </div>
                  </>
                )}

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-1">
                    Rôle
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#07f468] focus:border-transparent"
                  >
                    <option value="user">Utilisateur</option>
                    <option value="admin">Administrateur</option>
                  </select>
                  {formErrors.role && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.role}</p>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    Annuler
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="px-4 py-2 bg-[#07f468] hover:bg-[#06d35a] text-gray-900 font-medium rounded-lg transition-colors"
                  >
                    {modalType === 'add' ? 'Ajouter' : 'Mettre à jour'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md mx-auto border border-gray-700"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Confirmation de suppression</h3>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <p className="text-gray-300 mb-6">
                Êtes-vous sûr de vouloir supprimer cet utilisateur? Cette action ne peut pas être annulée.
              </p>

              <div className="flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Annuler
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDeleteUser}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Supprimer
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset Password Modal */}
      <AnimatePresence>
        {showResetPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            onClick={() => setShowResetPasswordModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md mx-auto border border-gray-700"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Réinitialiser le mot de passe</h3>
                <button
                  onClick={() => setShowResetPasswordModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label htmlFor="new_password" className="block text-sm font-medium text-gray-300 mb-1">
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.new_password ? "text" : "password"}
                      id="new_password"
                      name="new_password"
                      value={passwordData.new_password}
                      onChange={handlePasswordInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#07f468] focus:border-transparent"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                      onClick={() => togglePasswordVisibility('new_password')}
                    >
                      {showPassword.new_password ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {formErrors.new_password && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.new_password}</p>
                  )}
                  {/* Password strength meter */}
                  {passwordData.new_password && (
                    <div className="mt-1">
                      <div className="flex items-center gap-1">
                        <div className={`h-1 flex-1 rounded-full ${
                          passwordStrength.new_password >= 1 ? 'bg-red-500' : 'bg-gray-600'
                        }`}></div>
                        <div className={`h-1 flex-1 rounded-full ${
                          passwordStrength.new_password >= 2 ? 'bg-yellow-500' : 'bg-gray-600'
                        }`}></div>
                        <div className={`h-1 flex-1 rounded-full ${
                          passwordStrength.new_password >= 3 ? 'bg-green-500' : 'bg-gray-600'
                        }`}></div>
                      </div>
                      <p className="text-xs mt-1 text-gray-400">
                        {passwordStrength.new_password === 1 && 'Mot de passe faible'}
                        {passwordStrength.new_password === 2 && 'Mot de passe moyen'}
                        {passwordStrength.new_password === 3 && 'Mot de passe fort'}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="new_password_confirmation" className="block text-sm font-medium text-gray-300 mb-1">
                    Confirmer le nouveau mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.new_password_confirmation ? "text" : "password"}
                      id="new_password_confirmation"
                      name="new_password_confirmation"
                      value={passwordData.new_password_confirmation}
                      onChange={handlePasswordInputChange}
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#07f468] focus:border-transparent"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                      onClick={() => togglePasswordVisibility('new_password_confirmation')}
                    >
                      {showPassword.new_password_confirmation ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {formErrors.new_password_confirmation && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.new_password_confirmation}</p>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setShowResetPasswordModal(false)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    Annuler
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Réinitialiser
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2 ${
              notification.type === 'success' 
                ? 'bg-green-800 text-green-100' 
                : 'bg-red-800 text-red-100'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle size={20} />
            ) : (
              <X size={20} />
            )}
            <span>{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FootballAdminDashboard;
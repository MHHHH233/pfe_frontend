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
} from "lucide-react";
import { Navigate } from "react-router-dom";
import Loader from "../Component/Loading";
import Tableau from "../Component/Reservations/table";
import Buttons from "../Component/Reservations/buttons";
import FormResev from "../Component/Reservations/form";
import EnhancedTournamentManagement from './components/Tournoi';
import AcademieManagement from './components/Academie';
import PlayersTeams from './components/Players-teams';
import Terrains from './components/Terrains';
import SettingsManagement from './components/Settings';
import { authService } from '../lib/services/authoServices';
import analyticsService from '../lib/services/admin/analyticsServices';
import compteService from '../lib/services/admin/compteServices';
import reservationService from '../lib/services/admin/reservationServices';

const FootballAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  
  // Close sidebar automatically on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen bg-gray-900 text-white relative">
      <Sidebar
        isOpen={sidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        closeSidebar={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        {" "}
        <Header toggleSidebar={toggleSidebar} />{" "}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-800 p-6">
          {" "}
          <AnimatePresence mode="wait">
            {" "}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {" "}
              {activeTab === "overview" && <Overview />}{" "}
              {activeTab === "users" && <Users1 />}{" "}
              {activeTab === "reservations" && <Reservations />}{" "}
              {activeTab === "inbox" && <Inbox />}{" "}
              {activeTab === "analytics" && <Analytics />}{" "}
              {activeTab === "joueurs/Equips" && <PlayersTeams />}{" "}
              {activeTab === "terrains" && <Terrains />}{" "}
              {activeTab === "tournoi" && <EnhancedTournamentManagement />}{" "}
              {activeTab === "settings" && <SettingsManagement/>}{" "}
              {activeTab === "academie" && <AcademieManagement />}{" "}
            </motion.div>{" "}
          </AnimatePresence>{" "}
        </main>{" "}
      </div>
      
      {/* Floating menu button for mobile */}
      {!sidebarOpen && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          className="fixed bottom-4 right-4 z-50 bg-[#07f468] text-gray-900 p-2.5 rounded-lg shadow-lg md:hidden hover:bg-[#06d35a] transition-colors duration-200"
          onClick={toggleSidebar}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Menu size={20} />
        </motion.button>
      )}
    </div>
  );
};

const Header = ({ toggleSidebar }) => {
  const handleLogout = async () => {
    try {
      await authService.logout();
      // Clear session storage and redirect regardless of response
      sessionStorage.clear();
      window.location.href = '/'; // Redirect to signin page
    } catch (error) { 
      console.error('Logout error:', error);
      // Still clear and redirect even if there's an error
      sessionStorage.clear();
      window.location.href = '/sign-in';
    }
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleSidebar}
        className="text-white focus:outline-none md:block hidden" // Hide on mobile, show on md screens
      >
        <Menu size={24} />
      </motion.button>
      <h1 className="text-2xl font-bold text-[#07f468]">TerranAdmin</h1>
      <div className="flex items-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="text-white focus:outline-none relative"
        >
          <Bell size={24} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="text-white focus:outline-none"
        >
          <User size={24} onClick={handleLogout}/>
        </motion.button>
      </div>
    </header>
  );
};

const Sidebar = ({ isOpen, activeTab, setActiveTab, closeSidebar }) => {
  // Close sidebar when clicking a menu item on mobile
  const handleMenuItemClick = (tabId) => {
    setActiveTab(tabId);
    if (window.innerWidth < 768) {
      closeSidebar();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay for mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={closeSidebar}
          />
          
          {/* Sidebar */}
          <motion.nav
            initial={{ x: window.innerWidth < 768 ? 256 : -256 }}  // Slide from right on mobile, left on desktop
            animate={{ x: 0 }}
            exit={{ x: window.innerWidth < 768 ? 256 : -256 }}    // Exit to right on mobile, left on desktop
            transition={{ duration: 0.3 }}
            className={`bg-gray-900 min-h-screen overflow-hidden fixed md:relative z-50 shadow-xl ${
              window.innerWidth < 768 ? 'right-0' : 'left-0'  // Position right on mobile, left on desktop
            }`}
          >
            <div className="w-64 p-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#07f468]">Menu</h2>
                <button 
                  className="md:hidden text-gray-400 hover:text-white"
                  onClick={closeSidebar}
                >
                  <X size={20} />
                </button>
              </div>
              <ul className="space-y-2">
                {menuItems.map((item) => (
                  <li key={item.id}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleMenuItemClick(item.id)}
                      className={`w-full flex items-center space-x-2 p-2 rounded-lg ${
                        activeTab === item.id
                          ? "bg-[#07f468] text-gray-900"
                          : "text-gray-300 hover:bg-gray-800"
                      }`}
                    >
                      <item.icon size={20} />
                      <span>{item.label}</span>
                    </motion.button>
                  </li>
                ))}
              </ul>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
};

const Overview = () => {
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
        <h2 className="text-3xl font-bold text-[#07f468]">Dashboard Overview</h2>
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-700 p-6 rounded-lg shadow-lg"
        >
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <UserRoundSearch size={20} className="text-[#07f468] mr-2" />
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
          className="bg-gray-700 p-6 rounded-lg shadow-lg"
        >
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <MapPin size={20} className="text-[#07f468] mr-2" />
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
          className="bg-gray-700 p-6 rounded-lg shadow-lg"
        >
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <School size={20} className="text-[#07f468] mr-2" />
            Academy Coaches
          </h3>
          <div className="text-3xl font-bold text-center my-4 text-white">
            {analyticsData?.total_academie_coaches || 0}
          </div>
          <p className="text-sm text-gray-400 text-center">Professional trainers</p>
        </motion.div>
      </div>
    </div>
  );
};

const Users1 = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [formValues, setFormValues] = useState({
    id: "",
    nom: "",
    prenom: "",
    email: "",
    password: "",
    telephone: "",
    role: "",
    age: "",
  });
  const [formErrors, setFormErrors] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    role: "",
    telephone: "",
    age: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenu, setOpenMenu] = useState(null);
  const [filterRole, setFilterRole] = useState("all");
  const menuRef = useRef(null);
  // Add these state variables to the Users1 component
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState({ type: null, id: null });
  const [showNotification, setShowNotification] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: 'success' });

  // Fetch users data
  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      const response = await compteService.getAllComptes(page);
      setData(response.data);
      setTotalPages(response.meta.last_page);
      setCurrentPage(response.meta.current_page);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle click outside menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef]);

  // Filter users based on search query and role
  const filteredData = data.filter((user) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      user.nom?.toLowerCase().includes(searchLower) ||
      user.prenom?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.telephone?.toLowerCase().includes(searchLower);
    
    const matchesRole = filterRole === "all" || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  // Form validation
  const validateForm = () => {
    const errors = {};
    if (!formValues.nom) errors.nom = "First name is required";
    if (!formValues.prenom) errors.prenom = "Last name is required";
    if (!formValues.email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formValues.email))
      errors.email = "Email is invalid";
    if (!isEditing && !formValues.password) errors.password = "Password is required";
    if (!formValues.role) errors.role = "Role is required";
    if (!formValues.telephone) errors.telephone = "Phone number is required";
    if (!formValues.age) errors.age = "Age is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle edit user
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setFormValues({
      id: user.id_compte,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      password: "",
      telephone: user.telephone,
      role: user.role,
      age: user.age,
    });
    setIsEditing(true);
    setIsCreating(false);
  };

  // Handle create new user
  const handleCreateClick = () => {
    setSelectedUser(null);
    setFormValues({
      id: "",
      nom: "",
      prenom: "",
      email: "",
      password: "",
      telephone: "",
      role: "user",
      age: "",
    });
    setIsCreating(true);
    setIsEditing(false);
  };

  // Replace the handleDeleteClick function with this
  const handleDeleteClick = (userId) => {
    setConfirmAction({ type: 'delete', id: userId });
    setShowConfirmDialog(true);
  };

  // Replace the handleResetPassword function with this
  const handleResetPassword = (userId) => {
    setConfirmAction({ type: 'reset', id: userId });
    setShowConfirmDialog(true);
  };

  // Add this function to execute the confirmed action
  const executeConfirmedAction = async () => {
    try {
      if (confirmAction.type === 'delete') {
        await compteService.deleteCompte(confirmAction.id);
        showSuccessNotification('User deleted successfully');
        fetchUsers(currentPage);
      } else if (confirmAction.type === 'reset') {
        const newPassword = document.getElementById('newPassword').value;
        if (!newPassword || newPassword.length < 8) {
          showErrorNotification('Password must be at least 8 characters');
          return;
        }
        
        await compteService.resetPassword(confirmAction.id, { 
          new_password: newPassword,
          new_password_confirmation: newPassword 
        });
        showSuccessNotification('Password reset successfully');
      }
      setShowConfirmDialog(false);
      } catch (error) {
      console.error(`Error during ${confirmAction.type} operation:`, error);
      showErrorNotification(`Failed to ${confirmAction.type} user: ${error.response?.data?.error || error.message}`);
    }
  };

  // Add these helper functions for notifications
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

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // Map form values to match the API expectations
      const userData = {
        nom: formValues.nom,
        prenom: formValues.prenom,
        email: formValues.email,
        telephone: formValues.telephone,
        role: formValues.role,
        age: formValues.age || 18,
      };

      if (isCreating) {
        // Add password for new users
        userData.password = formValues.password;
        await compteService.createCompte(userData);
      } else if (isEditing) {
        await compteService.updateCompte(formValues.id, userData);
      }
      
      setIsEditing(false);
      setIsCreating(false);
      fetchUsers(currentPage); // Refresh the list
    } catch (error) {
      console.error("Error saving user:", error);
      alert(`Failed to save user: ${error.response?.data?.error || error.message}`);
    }
  };

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  // Toggle user action menu
  const toggleMenu = (userId) => {
    setOpenMenu(openMenu === userId ? null : userId);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    fetchUsers(page);
  };

  // Handle role filter change
  const handleRoleFilterChange = (e) => {
    setFilterRole(e.target.value);
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Add a new function to handle role changes specifically
  const handleRoleChange = async (e) => {
    // First update the form values as usual
    handleFormChange(e);
    
    // If we're editing an existing user, also update the role immediately
    if (isEditing && formValues.id) {
      const newRole = e.target.value;
      const originalRole = formValues.role; // Store the original role before change
      
      try {
        // Pass the role as a string, not in an array
        await compteService.updateRole(formValues.id, { role: newRole });
        console.log(`Role updated to ${newRole} successfully`);
        showSuccessNotification(`Role updated to ${newRole} successfully`);
      } catch (error) {
        console.error("Error updating role:", error);
        showErrorNotification(`Failed to update role: ${error.response?.data?.error || error.message}`);
        // Revert the form value if the API call fails
        setFormValues(prev => ({
          ...prev,
          role: originalRole // Revert to original role
        }));
      }
    }
  };

  // Add a function to toggle user role directly from the table
  const handleRoleToggle = async (userId, currentRole) => {
    try {
      // Determine the new role (toggle between user and admin)
      const newRole = currentRole === 'admin' ? 'user' : 'admin';
      
      // Update the UI optimistically
      setData(prevData => 
        prevData.map(user => 
          user.id_compte === userId ? {...user, role: newRole} : user
        )
      );
      
      // Call the API to update the role - pass role as a string
      await compteService.updateRole(userId, { role: newRole });
      
      showSuccessNotification(`User role changed to ${newRole} successfully`);
      
      // Refresh the data to ensure consistency
      fetchUsers(currentPage);
    } catch (error) {
      console.error("Error toggling role:", error);
      showErrorNotification(`Failed to update role: ${error.response?.data?.error || error.message}`);
      
      // Revert the UI change on error
      fetchUsers(currentPage);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#07f468] mb-2">User Management</h2>
          <p className="text-gray-400 text-sm">Manage user accounts, roles and permissions</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCreateClick}
          className="bg-[#07f468] hover:bg-[#06d35a] text-gray-900 px-6 py-3 rounded-lg flex items-center font-medium shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Plus size={18} className="mr-2" />
          Add New User
        </motion.button>
      </div>

      <div className="bg-gray-800/50 p-4 sm:p-5 rounded-xl shadow-lg mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full p-3 pl-10 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#07f468] focus:outline-none shadow-inner"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search size={18} />
            </div>
          </div>
          <select
            value={filterRole}
            onChange={handleRoleFilterChange}
            className="w-full sm:w-48 p-3 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#07f468] focus:outline-none shadow-inner"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="coach">Coach</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center h-64 bg-gray-800/50 rounded-xl p-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-12 h-12 border-4 border-[#07f468] border-t-transparent rounded-full mb-4"
          />
          <p className="text-gray-400">Loading users...</p>
        </div>
      ) : filteredData.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800/50 rounded-xl shadow-lg overflow-hidden"
        >
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="text-xs uppercase bg-gray-900 text-gray-400 border-b border-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-4 font-medium tracking-wider w-[40%] sm:w-[30%]">
                    User
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium tracking-wider hidden sm:table-cell w-[25%]">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium tracking-wider hidden lg:table-cell w-[10%]">
                    Age
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium tracking-wider w-[20%] sm:w-[15%]">
                    Role
                  </th>
                  <th scope="col" className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">
                    <span className="md:hidden">Actions</span>
                    <span className="hidden md:inline">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((user, index) => (
                  <motion.tr
                    key={user.id_compte}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`border-b border-gray-700 ${index % 2 === 0 ? 'bg-gray-800/30' : 'bg-gray-800/50'} hover:bg-gray-700 transition-colors duration-200`}
                  >
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-700 flex items-center justify-center text-[#07f468] font-bold text-xs sm:text-sm">
                          {user.nom?.charAt(0)}{user.prenom?.charAt(0)}
                        </div>
                        <div className="ml-2 sm:ml-4">
                          <div className="text-xs sm:text-sm font-medium text-white truncate max-w-[80px] sm:max-w-[150px]">{`${user.nom} ${user.prenom}`}</div>
                          <div className="text-xs sm:text-sm text-gray-400 truncate max-w-[80px] sm:max-w-[150px]">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap hidden sm:table-cell">
                      <div className="flex items-center">
                        <Phone size={16} className="text-[#07f468] mr-2" />
                        <span className="text-sm text-gray-300">{user.telephone}</span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap hidden lg:table-cell">
                      <span className="text-sm text-gray-300">{user.age}</span>
                    </td>
                    <td className="px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <button 
                        onClick={() => handleRoleToggle(user.id_compte, user.role)}
                        className={`px-2 sm:px-3 py-1 sm:py-1.5 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer transition-all duration-300 ${
                          user.role === 'admin' 
                            ? 'bg-red-900/50 text-red-300 border border-red-500/30 hover:bg-red-800/70' 
                            : user.role === 'coach'
                            ? 'bg-blue-900/50 text-blue-300 border border-blue-500/30 hover:bg-blue-800/70'
                            : 'bg-green-900/50 text-green-300 border border-green-500/30 hover:bg-green-800/70'
                        }`}
                        title={`Click to change role from ${user.role}`}
                      >
                        {user.role}
                      </button>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="relative inline-block">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => toggleMenu(user.id_compte)}
                          className="text-white hover:text-[#07f468] transition-colors p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#07f468] focus:ring-opacity-50"
                        >
                          <MoreVertical size={16} />
                        </motion.button>
                        
                        <AnimatePresence>
                          {openMenu === user.id_compte && (
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
                                  onClick={() => handleEditClick(user)}
                                >
                                  <Edit size={16} className="mr-3" />
                                  Edit User
                                </motion.button>
                                <motion.button
                                  whileHover={{ backgroundColor: "#1f2937" }}
                                  className="flex items-center w-full px-4 py-3 text-sm text-white hover:text-yellow-400 transition-colors focus:outline-none"
                                  onClick={() => handleResetPassword(user.id_compte)}
                                >
                                  <Key size={16} className="mr-3" />
                                  Reset Password
                                </motion.button>
                                <motion.button
                                  whileHover={{ backgroundColor: "#1f2937" }}
                                  className="flex items-center w-full px-4 py-3 text-sm text-white hover:text-red-400 transition-colors focus:outline-none"
                                  onClick={() => handleDeleteClick(user.id_compte)}
                                >
                                  <Trash2 size={16} className="mr-3" />
                                  Delete User
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
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center bg-gray-800/50 rounded-xl p-12 text-center">
          <UserX size={48} className="text-gray-600 mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">No users found</h3>
          <p className="text-gray-400 mb-6">Try adjusting your search or filter criteria</p>
          <button 
            onClick={() => {
              setSearchQuery("");
              setFilterRole("all");
            }}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Pagination with improved styling */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 bg-gray-800/50 p-4 rounded-xl">
          <div className="text-sm text-gray-400 mb-4 sm:mb-0">
            Showing {filteredData.length > 0 ? (currentPage - 1) * 10 + 1 : 0} to {Math.min(currentPage * 10, filteredData.length)} of {filteredData.length} users
          </div>
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg ${
                currentPage === 1
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-gray-700 text-white hover:bg-gray-600"
              }`}
            >
              <ChevronLeft size={16} />
            </motion.button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`px-4 py-2 rounded-md mx-1 ${
                  currentPage === i + 1
                    ? 'bg-[#07f468] text-gray-900 font-medium'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                } transition-colors`}
              >
                {i + 1}
              </button>
            ))}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePageChange(currentPage + 1)}
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

      {/* User Form Modal with improved styling */}
      {(isEditing || isCreating) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 p-4 z-50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-gray-800 text-white p-8 rounded-xl shadow-2xl w-full max-w-md relative border border-gray-700"
          >
            <div className="absolute top-4 right-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setIsEditing(false);
                  setIsCreating(false);
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </motion.button>
            </div>
            
            <h2 className="text-2xl font-bold text-[#07f468] mb-6">
              {isCreating ? "Create New User" : "Edit User"}
            </h2>
            
            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">First Name</label>
                  <input
                    type="text"
                    name="nom"
                    value={formValues.nom}
                    onChange={handleFormChange}
                    placeholder="First Name"
                    className="w-full p-3 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#07f468] focus:outline-none"
                  />
                  {formErrors.nom && (
                    <p className="text-red-400 text-sm mt-1">{formErrors.nom}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Last Name</label>
                  <input
                    type="text"
                    name="prenom"
                    value={formValues.prenom}
                    onChange={handleFormChange}
                    placeholder="Last Name"
                    className="w-full p-3 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#07f468] focus:outline-none"
                  />
                  {formErrors.prenom && (
                    <p className="text-red-400 text-sm mt-1">{formErrors.prenom}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formValues.email}
                    onChange={handleFormChange}
                    placeholder="Email address"
                    className="w-full p-3 pl-10 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#07f468] focus:outline-none"
                  />
                </div>
                {formErrors.email && (
                  <p className="text-red-400 text-sm mt-1">{formErrors.email}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="telephone"
                      value={formValues.telephone}
                      onChange={handleFormChange}
                      placeholder="Phone Number"
                      className="w-full p-3 pl-10 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#07f468] focus:outline-none"
                    />
                  </div>
                  {formErrors.telephone && (
                    <p className="text-red-400 text-sm mt-1">{formErrors.telephone}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formValues.age}
                    onChange={handleFormChange}
                    placeholder="Age"
                    min="1"
                    max="120"
                    className="w-full p-3 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#07f468] focus:outline-none"
                  />
                  {formErrors.age && (
                    <p className="text-red-400 text-sm mt-1">{formErrors.age}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserCog size={16} className="text-gray-400" />
                  </div>
                  <select
                    name="role"
                    value={formValues.role}
                    onChange={handleRoleChange}
                    className="w-full p-3 pl-10 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#07f468] focus:outline-none appearance-none"
                  >
                    <option value="">Select a role</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="coach">Coach</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ChevronDown size={16} className="text-gray-400" />
                  </div>
                </div>
                {formErrors.role && (
                  <p className="text-red-400 text-sm mt-1">{formErrors.role}</p>
                )}
              </div>

              {isCreating && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={16} className="text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formValues.password}
                      onChange={handleFormChange}
                      placeholder="Password"
                      className="w-full p-3 pl-10 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#07f468] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {formErrors.password && (
                    <p className="text-red-400 text-sm mt-1">{formErrors.password}</p>
                  )}
                </div>
              )}

              <div className="flex justify-end space-x-4 mt-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  className="px-5 py-2.5 rounded-lg border border-gray-600 text-white hover:bg-gray-700 transition-colors"
                  onClick={() => {
                    setIsEditing(false);
                    setIsCreating(false);
                  }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-[#07f468] hover:bg-[#06d35a] text-gray-900 font-medium transition-colors"
                >
                  {isCreating ? "Create User" : "Save Changes"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-xl"
          >
            <h3 className="text-xl font-bold text-white mb-4">
              {confirmAction.type === 'delete' ? 'Confirm Deletion' : 'Reset Password'}
            </h3>
            
            {confirmAction.type === 'delete' ? (
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete this user? This action cannot be undone.
              </p>
            ) : (
              <div className="mb-6">
                <p className="text-gray-300 mb-4">
                  Enter a new password for this user:
                </p>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={16} className="text-gray-400" />
                  </div>
                  <input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    className="w-full p-3 pl-10 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#07f468] focus:outline-none"
                    placeholder="New password"
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                onClick={() => setShowConfirmDialog(false)}
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-lg text-white transition-colors ${
                  confirmAction.type === 'delete' 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-[#07f468] hover:bg-[#06d35a] text-gray-900'
                }`}
                onClick={executeConfirmedAction}
              >
                {confirmAction.type === 'delete' ? 'Delete' : 'Reset Password'}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

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
              <CopyCheck className="mr-2" size={20} />
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
  const modalRef = useRef(null);
  const menuRef = useRef(null);
  // Add this new state for the detail modal
  const [selectedReservation, setSelectedReservation] = useState(null);
  
  // Updated fetch data function without polling
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Prepare params object for filtering
      const params = {};
      if (selectedTerrain !== "all") {
        params.id_terrain = selectedTerrain;
      }
      
      const response = await reservationService.getAllReservations(params);
      
      if (response.status === "success") {
        setData(response.data);
      } else {
        // Handle empty data case
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching reservations:", error);
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
      // Also set the terrain if it's stored
      // if (sessionStorage.getItem("selectedTerrain")) {
      //   setIdTerrain(sessionStorage.getItem("selectedTerrain"));
      // }
    } else {
      setReserv(false); // Reset if values are not present
    }

    // Listen for custom event from table component
    const handleReservationClick = (event) => {
      console.log("Reservation cell clicked event received:", event.detail);
      setReserv(true);
      if (event.detail.terrain) {
        setIdTerrain(event.detail.terrain);
      }
    };

    document.addEventListener('reservationCellClicked', handleReservationClick);

    // Fetch data only once when component mounts or when selectedTerrain changes
    fetchData();

    // Add event listener for click outside
    document.addEventListener("mousedown", handleClickOutside);

    // Listen for cancel event
    const handleReservationCancel = () => {
      setReserv(false);
    };
    
    document.addEventListener('closeReservationPopup', handleReservationCancel);

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener('reservationCellClicked', handleReservationClick);
      document.removeEventListener('closeReservationPopup', handleReservationCancel);
    };
  }, [fetchData]);

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
    console.log("Selected terrain in Admin:", terrain);
    setIdTerrain(terrain);
    
    // Store terrain data in sessionStorage
    if (terrain) {
      sessionStorage.setItem("selectedTerrainId", terrain.id_terrain);
      sessionStorage.setItem("selectedTerrainName", terrain.nom_terrain);
      
      // If there's an open form modal, we need to update it
      if (reserv) {
        // Dispatch a custom event to notify form
        const event = new CustomEvent('terrainSelected', {
          detail: { terrain: terrain }
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
        // Pass etat: "reserver" for validation
        await reservationService.validateReservation(id, { etat: "reserver" });
        // Update the local state to reflect the change
        setData(prevData => 
          prevData.map(res => 
            res.id_reservation === id ? {...res, etat: "reserver"} : res
          )
        );
      } else if (action === "devalider") {
        // Pass etat: "en attente" for invalidation
        await reservationService.invalidateReservation(id, { etat: "en attente" });
        // Update the local state to reflect the change
        setData(prevData => 
          prevData.map(res => 
            res.id_reservation === id ? {...res, etat: "en attente"} : res
          )
        );
      }
      
      // Refresh data after action completes
      fetchData();
    } catch (error) {
      console.error(`Error performing ${action} action:`, error);
      // Show error notification
      alert(`Failed to ${action === "valider" ? "validate" : "invalidate"} reservation. Please try again.`);
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
        setShowConfirmation(false);
        setReservationToDelete(null);
      } catch (error) {
        console.error("Error deleting reservation:", error);
        // Show an error notification or handle the error appropriately
      }
    }
  };
  
  // Handle terrain change
  const handleTerrainChange = (e) => {
    setSelectedTerrain(e.target.value);
  };

  // Handle search query change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
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
      console.log("Opening form with terrain data:", idTerrain);
      // Explicitly set the selectedTerrain in sessionStorage
      sessionStorage.setItem("selectedTerrainId", idTerrain.id_terrain);
      sessionStorage.setItem("selectedTerrainName", idTerrain.nom_terrain);
    } else {
      console.warn("No terrain selected when opening reservation form");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#07f468]">Reservations</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleOpenReservationForm}
          className="flex items-center gap-2 bg-[#07f468] hover:bg-[#05c757] text-gray-900 font-medium px-4 py-2 rounded-lg shadow-lg transition duration-200"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Add Reservation</span>
        </motion.button>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-700/80 sm:backdrop-blur-sm p-4 sm:p-6 rounded-lg shadow-lg border border-gray-600/50"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-white">Reservation Calendar</h3>
          
          {/* Refresh button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchData}
            className="p-2 bg-gray-600 hover:bg-gray-500 rounded-full text-white transition-colors"
            title="Refresh data"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </motion.button>
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
          <h3 className="text-xl sm:text-2xl font-bold text-white">Upcoming Reservations</h3>
          
          {/* Refresh button for reservations list */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchData}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-600 hover:bg-gray-500 rounded-lg text-white text-sm transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh</span>
          </motion.button>
        </div>

        {/* Search Bar and Terrain Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search by client or date..."
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
              <option value="all">All Terrains</option>
              <option value="1">Terrain 1</option>
              <option value="2">Terrain 2</option>
              <option value="3">Terrain 3</option>
              <option value="4">Terrain 4</option>
              <option value="5">Terrain 5</option>
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
              Retry
            </button>
          </div>
        ) : filteredReservations.length === 0 ? (
          <div className="bg-gray-800/50 rounded-xl p-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-xl font-medium text-white mb-2">No reservations found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your search or filter criteria</p>
            <button 
              onClick={() => {
                setSearchQuery("");
                setSelectedTerrain("all");
              }}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="bg-gray-800/70 rounded-xl shadow-xl border border-gray-700">
            <div className="max-w-full">
              <table className="w-full table-auto">
                <thead className="bg-gray-900/80 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Time</th>
                    <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Terrain</th>
                    <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Client</th>
                    {/* Show Status on mobile, hide on larger screens */}
                    <th className="sm:hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                    {/* Hide Status on mobile, show on larger screens */}
                    <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                    {/* Hide Actions on mobile, show on larger screens */}
                    <th className="hidden sm:table-cell px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredReservations.map((reservation, index) => (
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
                          : 'Unknown Client'}
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
                          {reservation.etat === "reserver" ? "Confirmed" : "Pending"}
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
                          {reservation.etat === "reserver" ? "Confirmed" : "Pending"}
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
                                    Devalider
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
                                    Cancel Reservation
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
                <h3 className="text-xl font-bold text-white mb-2">Confirm Deletion</h3>
                <p className="text-gray-300 mb-6">Are you sure you want to delete this reservation? This action cannot be undone.</p>
                <div className="flex justify-end space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowConfirmation(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleConfirmDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
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
                <h3 className="text-xl font-bold text-white">Reservation Details</h3>
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
                    <p className="text-xs text-gray-400">Time</p>
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
                        : 'Unknown Client'}
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
                    <p className="text-xs text-gray-400">Status</p>
                    <p className={`text-sm font-medium px-2.5 py-1 rounded-full ${
                      selectedReservation.etat === "reserver"
                        ? "bg-green-900/50 text-green-300 border border-green-500/30"
                        : "bg-yellow-900/50 text-yellow-300 border border-yellow-500/30"
                    }`}>
                      {selectedReservation.etat === "reserver" ? "Confirmed" : "Pending"}
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
                      <span>Devalider</span>
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
                  <span>Delete</span>
                </button>
              </div>
            </motion.div>
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
  { id: "overview", icon: Home, label: "Overview" },
  { id: "users", icon: Users, label: "Users" },
  { id: "reservations", icon: Calendar, label: "Reservations" },
  { id: "academie", icon: School, label: "Academie" },
  { id: "terrains", icon: MapPin, label: "Terrains" },
  { id: "tournoi", icon: Trophy, label: "Tournoi" },
  { id: "joueurs/Equips", icon: UserRoundSearch, label: "joueurs/Equips" },
  { id: "inbox", icon: MessageSquare, label: "Inbox" },
  { id: "analytics", icon: BarChart2, label: "Analytics" },
  { id: "settings", icon: Settings, label: "Settings" },
  { id: "More", icon: CircleEllipsis, label: "More" },
];
export default FootballAdminDashboard;
import axios from 'axios'
import React, { useEffect, useRef, useState } from "react";
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
const FootballAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar
        isOpen={sidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
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
    </div>
  );
};

const Header = ({ toggleSidebar }) => {
  const handleLogout = async () => {
    try {
      const response = await authService.logout();

      if (response.status) {
        sessionStorage.clear()
        window.location.reload()
        Navigate('/')
      }
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <header className="bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleSidebar}
        className="text-white focus:outline-none"
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

const Sidebar = ({ isOpen, activeTab, setActiveTab }) => {
  return (
    <motion.nav
      initial={{ width: 0 }}
      animate={{ width: isOpen ? 256 : 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-900 min-h-screen overflow-hidden"
    >
      <div className="w-64 p-4">
        <h2 className="text-2xl font-bold text-[#07f468] mb-6">Menu</h2>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(item.id)}
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
  );
};


const Overview = () => {
  // const stats = [
  //   { icon: Users},
  //   { icon: Calendar},
  //   { icon: DollarSign},
  //   { icon: TrendingUp},
  // ];

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost/PFR/3AFAK-PFE/backend/API/Analytics.php');
        const result = await response.json();
        console.log(result);
        setData(result.data);  // Set the data from the API response
      } catch (error) {
        console.error('Error fetching data:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Function to dynamically return the correct icon based on the name
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Calendar':
        return <Calendar1Icon size={40} />;
      case 'Users':
        return <Users2Icon size={35} />;
      case 'DollarSign':
        return <DollarSignIcon size={45} />;
      case 'TrendingUp':
        return <TrendingUpIcon size={55} />;

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-[#07f468]">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-700 p-6 rounded-lg shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">{stat.label}</p>
                <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
              </div>
              <div className="text-[#07f468]">
                {getIcon(stat.Icon)} {/* Render the icon dynamically */}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-700 p-6 rounded-lg shadow-lg"
        >
          <h3 className="text-xl font-bold mb-4">Recent Reservations</h3>
          <ul className="space-y-2">
            <li className="flex justify-between items-center">
              <span>Field A - Red Dragons</span>
              <span className="text-[#07f468]">Today, 2:00 PM</span>
            </li>
            <li className="flex justify-between items-center">
              <span>Field B - Blue Sharks</span>
              <span className="text-[#07f468]">Tomorrow, 4:00 PM</span>
            </li>
            <li className="flex justify-between items-center">
              <span>Field C - Green Lions</span>
              <span className="text-[#07f468]">Jun 18, 10:00 AM</span>
            </li>
          </ul>
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


const Users1 = ()=> {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [formValues, setFormValues] = useState({
    id: "",
    nom: "",
    prenom: "",
    email: "",
    password: "",
    telephone: "",
    type: "",
    action: "",
  })
  const [formErrors, setFormErrors] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    type: "",
    telephone: "",
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [openMenu, setOpenMenu] = useState(null)
  const menuRef = useRef(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost/PFR/3AFAK-PFE/backend/API/CompteAPI.php"
        )
        setData(response.data.data)
      } catch (error) {
        console.error("Error fetching data:", error.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuRef])

  const filteredData = data.filter((user) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      user.nom.toLowerCase().includes(searchLower) ||
      user.prenom.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.telephone.toLowerCase().includes(searchLower)
    )
  })

  const validateForm = () => {
    const errors = {}
    if (!formValues.nom) errors.nom = "First name is required"
    if (!formValues.prenom) errors.prenom = "Last name is required"
    if (!formValues.email) errors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formValues.email))
      errors.email = "Email is invalid"
    if (!formValues.password) errors.password = "Password is required"
    if (!formValues.type) errors.type = "Role is required"
    if (!formValues.telephone) errors.telephone = "Phone number is required"
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleEditClick = (user) => {
    setSelectedUser(user)
    setFormValues({
      id: user.id_compte,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      password: user.password,
      telephone: user.telephone,      
      action: "update",
    })
    setIsEditing(true)
  }

  const handleDeleteClick = async (userId) => {
    if (window.confirm("Are you sure you want to delete this account?")) {
      try {
        const payload = { id: userId, action: "delete" }
        await axios.post(
          "http://localhost/PFR/3AFAK-PFE/backend/Controleur/ControleurCLient.php",
          payload
        )
        const response = await axios.get(
          "http://localhost/PFR/3AFAK-PFE/backend/API/CompteAPI.php"
        )
        setData(response.data.data)
      } catch (error) {
        console.error("Error deleting user:", error.message)
      }
    }
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      const response = await axios.post(
        "http://localhost/PFR/3AFAK-PFE/backend/Controleur/ControleurCLient.php",
        formValues
      )
      if (response.data.success) {
        setIsEditing(false)
        const fetchResponse = await axios.get(
          "http://localhost/PFR/3AFAK-PFE/backend/API/CompteAPI.php"
        )
        setData(fetchResponse.data.data)
      }
    } catch (error) {
      console.error("Error updating user:", error.message)
    }
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormValues({ ...formValues, [name]: value })
  }

  const toggleMenu = (userId) => {
    setOpenMenu(openMenu === userId ? null : userId)
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 bg-gray-900 rounded-lg shadow-xl">
      <h2 className="text-2xl sm:text-3xl font-bold text-[#07f468]">User Management</h2>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name, email, or phone"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#07f468] focus:outline-none"
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 rounded-lg shadow-lg overflow-x-auto"
      >
        {loading ? (
          <p className="text-center text-white py-6">Loading...</p>
        ) : filteredData.length > 0 ? (
          <table className="w-full min-w-full divide-y divide-gray-600">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden sm:table-cell">
                  Email
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider hidden md:table-cell">
                  Phone
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
              {filteredData.map((user) => (
                <motion.tr
                  key={user.id_compte}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-800 hover:bg-gray-700 transition-colors duration-150"
                >
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User size={20} className="text-[#07f468] mr-2" />
                      <span className="text-gray-300">{`${user.nom} ${user.prenom}`}</span>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                    <div className="flex items-center">
                      <Mail size={20} className="text-[#07f468] mr-2" />
                      <span className="text-gray-300">{user.email}</span>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                    <div className="flex items-center">
                      <Phone size={20} className="text-[#07f468] mr-2" />
                      <span className="text-gray-300">{user.telephone}</span>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="relative" ref={menuRef}>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleMenu(user.id_compte)}
                        className="text-gray-400 hover:text-[#07f468] transition-colors duration-200"
                      >
                        <MoreVertical size={20} />
                      </motion.button>
                      <AnimatePresence>
                        {openMenu === user.id_compte && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-10 overflow-hidden"
                          >
                            <div className="py-1">
                              {[
                                { icon: Eye, label: 'View', action: () => console.log('View user', user) },
                                { icon: Edit, label: 'Edit', action: () => handleEditClick(user) },
                                { icon: Key, label: 'Reset Password', action: () => console.log('Reset password for', user) },
                                { icon: Trash2, label: 'Delete', action: () => handleDeleteClick(user.id_compte) },
                              ].map((item) => (
                                <motion.button
                                  key={item.label}
                                  onClick={item.action}
                                  className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-[#07f468] w-full text-left transition-colors duration-150"
                                  whileHover={{ x: 5 }}
                                  transition={{ type: 'spring', stiffness: 300 }}
                                >
                                  <item.icon size={16} className="mr-2" />
                                  {item.label}
                                </motion.button>
                              ))}
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
        ) : (
          <p className="text-center text-white py-6">No users found.</p>
        )}
      </motion.div>

      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-gray-800 text-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-md"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 text-center">
              Edit User
            </h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <input
                type="text"
                name="nom"
                value={formValues.nom}
                onChange={handleFormChange}
                placeholder="First Name"
                className="w-full p-3 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#07f468] focus:outline-none"
              />
              {formErrors.nom && (
                <p className="text-red-500 text-sm">{formErrors.nom}</p>
              )}

              <input
                type="text"
                name="prenom"
                value={formValues.prenom}
                onChange={handleFormChange}
                placeholder="Last Name"
                className="w-full p-3 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#07f468] focus:outline-none"
              />
              {formErrors.prenom && (
                <p className="text-red-500 text-sm">{formErrors.prenom}</p>
              )}

              <input
                type="email"
                name="email"
                value={formValues.email}
                onChange={handleFormChange}
                placeholder="Email"
                className="w-full p-3 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#07f468] focus:outline-none"
              />
              {formErrors.email && (
                <p className="text-red-500 text-sm">{formErrors.email}</p>
              )}

              <input
                type="text"
                name="telephone"
                value={formValues.telephone}
                onChange={handleFormChange}
                placeholder="Phone Number"
                className="w-full p-3 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#07f468] focus:outline-none"
              />
              {formErrors.telephone && (
                <p className="text-red-500 text-sm">{formErrors.telephone}</p>
              )}

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formValues.password}
                  onChange={handleFormChange}
                  placeholder="Password"
                  className="w-full p-3 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#07f468] focus:outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {formErrors.password && (
                <p className="text-red-500 text-sm">{formErrors.password}</p>
              )}
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <button
                  type="submit"
                  className="bg-[#07f468] hover:bg-[#06d35a] text-gray-900 font-bold p-3 rounded-md w-full sm:w-1/2 transition-colors duration-200"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-md w-full sm:w-1/2 transition-colors duration-200"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}




const Reservations = () => {  
  const [reservations, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [idTerrain, setIdTerrain] = useState(null);
  const [reserv, setReserv] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState(null);
  const [click, setClick] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTerrain, setSelectedTerrain] = useState("all");
  const modalRef = useRef(null);
  const menuRef = useRef(null);

  // Fetch data function
  const fetchData = async () => {
    try {
      const response = await fetch(
        "http://localhost/PFR/3AFAK-PFE/backend/API/ReservationAPI.php"
      );
      const result = await response.json();
      setData(result.data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check localStorage for selected hour and time
    if (localStorage.getItem("selectedHour") && localStorage.getItem("selectedTime")) {
      setReserv(true);
    } else {
      setReserv(false); // Reset if values are not present
    }

    // Fetch data immediately and set up interval
    fetchData();
    const intervalId = setInterval(fetchData, 5000);
  
    // Add event listener for click outside
    document.addEventListener("mousedown", handleClickOutside);
  
    // Cleanup
    return () => {
      clearInterval(intervalId);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [localStorage.getItem("selectedHour"), localStorage.getItem("selectedTime"), localStorage.getItem("click")]);

  // Handle click outside modal and menu
  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setReserv(false);
      localStorage.removeItem("selectedHour");
      localStorage.removeItem("selectedTime");
      localStorage.removeItem("click");
    }
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setActiveMenu(null);
    }
  };

  // Handle terrain change
  const handleChange = (terrain) => {
    setIdTerrain(terrain);
  };

  // Toggle menu
  const toggleMenu = (id) => {
    setActiveMenu(activeMenu === id ? null : id);
  };

  // Handle actions (e.g., delete)
  const handleAction = async (action, id) => {
    try {
      const response = await fetch(
        "http://localhost/PFR/3AFAK-PFE/backend/Controleur/ReservationController.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: action,
            id,
          }),
        }
      );
      const data = await response.json();
      console.log("Action response:", data);
      if (action === "delete") {
        setData((prevReservations) =>
          prevReservations.filter((res) => res.id_reservation !== id)
        );
      }
    } catch (error) {
      console.error(`Error performing ${action} action:`, error.message);
    }
  };

  // Handle delete confirmation
  const handleConfirmDelete = () => {
    if (reservationToDelete) {
      handleAction("delete", reservationToDelete);
      setShowConfirmation(false);
      setReservationToDelete(null);
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
    const matchesSearch = reservation.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          reservation.date.includes(searchQuery);
    const matchesTerrain = selectedTerrain === "all" || reservation.id_terrain === selectedTerrain;
    return matchesSearch && matchesTerrain;
  });

  return (
    <div className="space-y-6">
    <h2 className="text-3xl font-bold text-[#07f468]">Reservations</h2>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-700 p-6 rounded-lg shadow-lg"
    >
      <div className="flex items-center justify-between">
  <h3 className="text-xl font-bold mb-4">Reservation Calendar</h3>
  <button
    onClick={() => setReserv(!reserv)}
    className="bg-[#07f468] text-white font-bold px-2 py-2 rounded-lg shadow hover:bg-[#05c757] transition duration-200"
  >
    {reserv ? <X /> : <Plus />}
  </button>
</div>
<div className="text-[#000]">
{reserv ? (
    <AnimatePresence>
  <div
    className="fixed top-0 left-0 w-full min-h-screen flex justify-center items-center z-50"
    onClick={handleClickOutside}
  >
    <motion.div
      ref={modalRef}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", damping: 15, stiffness: 300 }}
      className="bg-[#333] rounded-lg shadow-lg h-auto p-6 w-full max-w-md mx-4"
    >
       <FormResev
          Terrain={idTerrain}
          selectedHour={localStorage.getItem("selectedHour")}
          selectedTime={localStorage.getItem("selectedTime")}
        />
    </motion.div>
  </div>
</AnimatePresence>
  ):""}
</div>

      <Buttons onChange={handleChange} />
      <br />
      <Tableau Terrain={idTerrain} />
    </motion.div>
   
   
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-gray-700 p-8 rounded-xl shadow-2xl"
    >
      <h3 className="text-2xl font-bold mb-6 text-white">Upcoming Reservations</h3>

      {/* Search Bar and Terrain Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by client or date..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full sm:w-64 px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07f468]"
        />
        <select
          value={selectedTerrain}
          onChange={handleTerrainChange}
          className="w-full sm:w-48 px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07f468]"
        >
          <option value="all">All Terrains</option>
          <option value="1">Terrain 1</option>
          <option value="2">Terrain 2</option>
          <option value="3">Terrain 3</option>
          <option value="4">Terrain 4</option>
          <option value="5">Terrain 5</option>
          
        </select>
      </div>

      {/* Responsive Table */}
      <div className="w-full overflow-x-auto bg-gray-800 rounded-2xl shadow-xl">
      <table className="w-full table-auto">
        <thead className="bg-gray-900 text-white">
          <tr>
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Heure</th>
            <th className="hidden md:table-cell px-4 py-2 text-left">Terrain</th>
            <th className="hidden sm:table-cell px-4 py-2 text-left">Client</th>
            <th className="px-4 py-2 text-left">État</th>
            <th className="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredReservations.map((reservation) => (
            <tr key={reservation.id_reservation} className="border-b border-gray-700 group hover:bg-gray-700 transition-all">
              <td className="px-4 py-3 text-white">{reservation.date}</td>
              <td className="px-4 py-3 text-white">{reservation.heure}</td>
              <td className="hidden md:table-cell px-4 py-3 text-white">{"Terrain " + reservation.id_terrain}</td>
              <td className="hidden sm:table-cell px-4 py-3 text-white">{reservation.client}</td>
              <td className="px-4 py-3 text-white">
                <span
                  className={`px-2 py-1 rounded ${
                    reservation.etat === "reserver"
                      ? "bg-green-500 text-white"
                      : "bg-yellow-500 text-white"
                  }`}
                >
                  {reservation.etat}
                </span>
              </td>
              <td className="px-4 py-3 text-center relative">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleMenu(reservation.id_reservation)}
                  className="text-white hover:text-[#07f468] transition-colors p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#07f468] focus:ring-opacity-50"
                >
                  <MoreVertical size={20} />
                </motion.button>

                <AnimatePresence>
                  {activeMenu === reservation.id_reservation && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      ref={menuRef}
                      className="absolute right-0 top-10 w-56 bg-gray-900 rounded-lg shadow-xl py-2 z-10"
                    >
                      <motion.button
                        whileHover={{ backgroundColor: "#1f2937" }}
                        className="flex items-center px-4 py-3 text-sm text-white w-full hover:text-[#07f468] transition-colors focus:outline-none focus:bg-gray-800"
                        onClick={() => handleAction("valider", reservation.id_reservation)}
                      >
                        <CopyCheck size={18} className="mr-3" />
                        Valider
                      </motion.button>
                      <motion.button
                        whileHover={{ backgroundColor: "#1f2937" }}
                        className="flex items-center px-4 py-3 text-sm text-white w-full hover:text-[#07f468] transition-colors focus:outline-none focus:bg-gray-800"
                        onClick={() => handleAction("devalider", reservation.id_reservation)}
                      >
                        <CopyX size={18} className="mr-3" />
                        Devalider
                      </motion.button>
                      <motion.button
                        whileHover={{ backgroundColor: "#1f2937" }}
                        className="flex items-center px-4 py-3 text-sm text-white w-full hover:text-[#07f468] transition-colors focus:outline-none focus:bg-gray-800"
                        onClick={() => handleAction("edit", reservation.id_reservation)}
                      >
                        <Edit size={18} className="mr-3" />
                        Edit Reservation
                      </motion.button>
                      <motion.button
                        whileHover={{ backgroundColor: "#1f2937" }}
                        className="flex items-center px-4 py-3 text-sm text-white w-full hover:text-red-500 transition-colors focus:outline-none focus:bg-gray-800"
                        onClick={() => {
                          setReservationToDelete(reservation.id_reservation);
                          setShowConfirmation(true);
                        }}
                      >
                        <Trash size={18} className="mr-3" />
                        Cancel Reservation
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-gray-800 p-6 rounded-lg shadow-xl"
            >
              <p className="text-white text-lg mb-4">Are you sure you want to delete this reservation?</p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>

      
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
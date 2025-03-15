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
} from "lucide-react";
import { Navigate } from "react-router-dom";
import Loader from "../Component/Loading";
import Tableau from "../Component/Reservations/table";
import Buttons from "../Component/Reservations/buttons";
import FormResev from "../Component/Reservations/form";

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
      const response = await fetch('http://localhost/PFR/3AFAK-PFE/backend/controleur/Logout.php', {
        method: 'POST',
        credentials: 'include',
      })

      if (response.ok) {
        sessionStorage.clear()
        window.location.reload()
        Navigate('/sign-in')
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
  const stats = [
    { icon: Users, label: "Total Users", value: "1,234" },
    { icon: Calendar, label: "Reservations", value: "56" },
    { icon: DollarSign, label: "Revenue", value: "$12,345" },
    { icon: TrendingUp, label: "Growth", value: "+15%" },
  ];

  return (
    <div className="space-y-6">
      {" "}
      <h2 className="text-3xl font-bold text-[#07f468]">
        Dashboard Overview
      </h2>{" "}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {" "}
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-700 p-6 rounded-lg shadow-lg"
          >
            {" "}
            <div className="flex items-center justify-between">
              {" "}
              <div>
                {" "}
                <p className="text-sm text-gray-400">{stat.label}</p>{" "}
                <h3 className="text-2xl font-bold text-white mt-1">
                  {stat.value}
                </h3>{" "}
              </div>{" "}
              <stat.icon size={32} className="text-[#07f468]" />{" "}
            </div>{" "}
          </motion.div>
        ))}{" "}
      </div>{" "}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {" "}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-700 p-6 rounded-lg shadow-lg"
        >
          {" "}
          <h3 className="text-xl font-bold mb-4">Recent Reservations</h3>{" "}
          <ul className="space-y-2">
            {" "}
            <li className="flex justify-between items-center">
              {" "}
              <span>Field A - Red Dragons</span>{" "}
              <span className="text-[#07f468]">Today, 2:00 PM</span>{" "}
            </li>{" "}
            <li className="flex justify-between items-center">
              {" "}
              <span>Field B - Blue Sharks</span>{" "}
              <span className="text-[#07f468]">Tomorrow, 4:00 PM</span>{" "}
            </li>{" "}
            <li className="flex justify-between items-center">
              {" "}
              <span>Field C - Green Lions</span>{" "}
              <span className="text-[#07f468]">Jun 18, 10:00 AM</span>{" "}
            </li>{" "}
          </ul>{" "}
        </motion.div>{" "}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-700 p-6 rounded-lg shadow-lg"
        >
          {" "}
          <h3 className="text-xl font-bold mb-4">User Activity</h3>{" "}
          <div className="h-48 flex items-end justify-between">
            {" "}
            <div
              className="w-8 bg-[#07f468] rounded-t"
              style={{ height: "60%" }}
            ></div>{" "}
            <div
              className="w-8 bg-[#07f468] rounded-t"
              style={{ height: "80%" }}
            ></div>{" "}
            <div
              className="w-8 bg-[#07f468] rounded-t"
              style={{ height: "40%" }}
            ></div>{" "}
            <div
              className="w-8 bg-[#07f468] rounded-t"
              style={{ height: "70%" }}
            ></div>{" "}
            <div
              className="w-8 bg-[#07f468] rounded-t"
              style={{ height: "50%" }}
            ></div>{" "}
            <div
              className="w-8 bg-[#07f468] rounded-t"
              style={{ height: "90%" }}
            ></div>{" "}
            <div
              className="w-8 bg-[#07f468] rounded-t"
              style={{ height: "30%" }}
            ></div>{" "}
          </div>{" "}
          <div className="flex justify-between mt-2 text-sm text-gray-400">
            {" "}
            <span>Mon</span> <span>Tue</span> <span>Wed</span> <span>Thu</span>{" "}
            <span>Fri</span> <span>Sat</span> <span>Sun</span>{" "}
          </div>{" "}
        </motion.div>{" "}
      </div>{" "}
    </div>
  );
};


const Users1 = () => {
  const [data, setData] = useState([]); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost/PFR/3AFAK-PFE/backend/API/CompteAPI.php');        
        const result = await response.json();
        console.log(result)
        setData(result.data); 
      } catch (error) {
        console.error('Error fetching data:', error.message);
      } finally {
        setLoading(false); 
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-[#07f468]">User Management</h2>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-700 rounded-lg shadow-lg overflow-hidden"
      >
        {loading ? (
          <Loader/>
        ) : data.length > 0 ? (
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
              {data.map((user) => (
                <motion.tr
                  key={user.id_compte}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User size={20} className="text-[#07f468] mr-2" />
                      <span>{user.nom+' '+user.prenom}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Mail size={20} className="text-[#07f468] mr-2" />
                      <span>{user.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Phone size={20} className="text-[#07f468] mr-2" />
                      <span>{user.telephone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Edit size={20} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={20} />
                      </motion.button>
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
    </div>
  );
};

const Reservations = () => {

  // http://localhost/PFR/3AFAK-PFE/backend/API/ReservationAPI.php

  const [reservations, setData] = useState([]); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost/PFR/3AFAK-PFE/backend/API/ReservationAPI.php');        
        const result = await response.json();
        // console.log(result)
        setData(result.data); 
      } catch (error) {
        console.error('Error fetching data:', error.message);
      } finally {
        setLoading(false); 
      }
    };
    fetchData();
  }, [reservations]);

  const [idTerrain, setIdTerrain] = useState(null);
  const [reserv, setReserv] = useState(false);

  // console.log(sessionStorage.getItem("email"))
    const handleChange = (terrain) => {
      setIdTerrain(terrain);
    };

    const modalRef = useRef(null)

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setReserv(false)
    }
  }

  const [activeMenu, setActiveMenu] = useState(null)

  const toggleMenu = (id) => {
    setActiveMenu(activeMenu === id ? null : id)
  }

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
  {reserv && (
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
      <FormResev Terrain={idTerrain} />
    </motion.div>
  </div>
</AnimatePresence>
  )}
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
      <ul className="space-y-6">
        {reservations.map((reservation) => (
          <motion.li
            key={reservation.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-800 p-6 rounded-xl relative overflow-hidden group hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-4 text-white">
                <Calendar size={24} className="text-[#07f468]" />
                <span className="font-medium">{reservation.date}</span>
                <Clock size={24} className="text-[#07f468] ml-4" />
                <span className="font-medium">{reservation.heure}</span>
              </div>
              <div className="flex items-center space-x-4 text-white">
                <MapPin size={24} className="text-[#07f468]" />
                <span className="font-medium">{"Terrain " + reservation.id_terrain}</span>
                <Users size={24} className="text-[#07f468] ml-4" />
                <span className="font-medium">{reservation.id_client + "-" + reservation.client}</span>
              </div>
            </div>
            <div className="absolute top-3 right-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleMenu(reservation.id)}
                className="text-white hover:text-[#07f468] transition-colors p-2 rounded-full hover:bg-gray-700"
              >
                <MoreVertical size={20} />
              </motion.button>
              <AnimatePresence>
                {activeMenu === reservation.id && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 bg-gray-900 rounded-lg shadow-xl py-2 z-10"
                  >
                    <motion.button
                      whileHover={{ backgroundColor: "#1f2937" }}
                      className="flex items-center px-4 py-3 text-sm text-white w-full hover:text-[#07f468] transition-colors"
                    >
                      <Edit size={18} className="mr-3" />
                      Edit Reservation
                    </motion.button>
                    <motion.button
                      whileHover={{ backgroundColor: "#1f2937" }}
                      className="flex items-center px-4 py-3 text-sm text-white w-full hover:text-red-500 transition-colors"
                    >
                      <Trash size={18} className="mr-3" />
                      Cancel Reservation
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#07f468] to-teal-500"
            />
          </motion.li>
        ))}
      </ul>
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
  { id: "inbox", icon: MessageSquare, label: "Inbox" },
  { id: "analytics", icon: BarChart2, label: "Analytics" },
  { id: "settings", icon: Settings, label: "Settings" },
];
export default FootballAdminDashboard;

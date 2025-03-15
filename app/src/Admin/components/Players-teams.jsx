import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Edit, Trash2, Plus, Search, Filter, Eye, X, Star, User, Shield, Shirt, Activity, CheckCircle, AlertCircle, MoreVertical, MessageSquare, Award, Ban, UserPlus, Download, Upload, BarChart2, FileJson, FileSpreadsheet } from 'lucide-react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CSVDownload, CSVLink } from 'react-csv';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import * as XLSX from 'xlsx';

// Animation variants
const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  },
  exit: { 
    opacity: 0,
    y: -20,
    transition: { duration: 0.3 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const buttonVariants = {
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Mock data
const MOCK_PLAYERS = [
  {
    id: 1,
    name: "Mohamed Salah",
    team: "Liverpool FC",
    position: "Forward",
    age: 29,
    experience: 12,
    status: "active",
    image: "https://resources.premierleague.com/premierleague/photos/players/250x250/p118748.png"
  },
  {
    id: 2,
    name: "Kevin De Bruyne",
    team: "Manchester City",
    position: "Midfielder",
    age: 30,
    experience: 13,
    status: "injured",
    image: "https://resources.premierleague.com/premierleague/photos/players/250x250/p61366.png"
  },
  {
    id: 3,
    name: "Virgil van Dijk",
    team: "Liverpool FC",
    position: "Defender",
    age: 30,
    experience: 14,
    status: "active",
    image: "https://resources.premierleague.com/premierleague/photos/players/250x250/p97032.png"
  },
  {
    id: 4,
    name: "Alisson Becker",
    team: "Liverpool FC",
    position: "Goalkeeper",
    age: 29,
    experience: 11,
    status: "active",
    image: "https://resources.premierleague.com/premierleague/photos/players/250x250/p116535.png"
  },
  {
    id: 5,
    name: "Bruno Fernandes",
    team: "Manchester United",
    position: "Midfielder",
    age: 27,
    experience: 10,
    status: "suspended",
    image: "https://resources.premierleague.com/premierleague/photos/players/250x250/p141746.png"
  }
];

const MOCK_TEAMS = [
  {
    id: 1,
    name: "Liverpool FC",
    location: "Liverpool, England",
    founded: 1892,
    playerCount: 25,
    ranking: "Premier League - 2nd",
    logo: "https://resources.premierleague.com/premierleague/badges/t14.svg",
    stats: {
      wins: 20,
      draws: 6,
      losses: 2
    }
  },
  {
    id: 2,
    name: "Manchester City",
    location: "Manchester, England",
    founded: 1880,
    playerCount: 24,
    ranking: "Premier League - 1st",
    logo: "https://resources.premierleague.com/premierleague/badges/t43.svg",
    stats: {
      wins: 22,
      draws: 3,
      losses: 3
    }
  },
  {
    id: 3,
    name: "Manchester United",
    location: "Manchester, England",
    founded: 1878,
    playerCount: 26,
    ranking: "Premier League - 4th",
    logo: "https://resources.premierleague.com/premierleague/badges/t1.svg",
    stats: {
      wins: 17,
      draws: 5,
      losses: 6
    }
  },
  {
    id: 4,
    name: "Chelsea FC",
    location: "London, England",
    founded: 1905,
    playerCount: 25,
    ranking: "Premier League - 3rd",
    logo: "https://resources.premierleague.com/premierleague/badges/t8.svg",
    stats: {
      wins: 18,
      draws: 8,
      losses: 2
    }
  }
];

// Notification Context and Provider (same as in Academie.jsx)
const NotificationContext = React.createContext();

const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = (message, type = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };
  
    return (
    <NotificationContext.Provider value={showNotification}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {notifications.map(({ id, message, type }) => (
      <motion.div
              key={id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg ${
                type === 'success' 
                  ? 'bg-[#07f468]/90 text-gray-900' 
                  : 'bg-red-500/90 text-white'
              }`}
            >
              {type === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <p className="font-medium">{message}</p>
        </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};

const useNotification = () => {
  const showNotification = React.useContext(NotificationContext);
  if (!showNotification) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return showNotification;
};

const ImportModal = ({ isOpen, onClose, onImport, section }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const processFile = useCallback(async (file) => {
    try {
      if (file.type === "application/json") {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target.result);
            console.log('Parsed JSON data:', data);
            const formattedData = section === 'Teams' ? 
              data.map(team => {
                console.log('Processing team:', team);
                return {
                  id: Date.now() + Math.random(),
                  name: team.name || '',
                  location: team.location || '',
                  founded: team.founded || new Date().getFullYear(),
                  playerCount: team.playerCount || 0,
                  ranking: team.ranking || '',
                  logo: team.logo || team.image || 'https://via.placeholder.com/100',
                  stats: {
                    wins: parseInt(team.wins || 0),
                    draws: parseInt(team.draws || 0),
                    losses: parseInt(team.losses || 0)
                  }
                };
              }) :
              data.map(player => {
                console.log('Processing player:', player);
                return {
                  id: Date.now() + Math.random(),
                  name: player.name || '',
                  team: player.team || '',
                  position: player.position || '',
                  age: parseInt(player.age || 0),
                  experience: parseInt(player.experience || 0),
                  status: player.status || 'active',
                  image: player.image || player.img || player.avatar || player.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(player.name || 'Unknown')}&background=random`
                };
              });
            console.log('Formatted data:', formattedData);
            onImport(formattedData);
            onClose();
          } catch (err) {
            console.error('JSON parsing error:', err);
            setError('Invalid JSON format');
          }
        };
        reader.readAsText(file);
      } else if (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || 
                file.type === "application/vnd.ms-excel") {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const workbook = XLSX.read(e.target.result, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const rawData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
            console.log('Parsed Excel data:', rawData);
            const formattedData = section === 'Teams' ? 
              rawData.map(team => ({
                id: Date.now() + Math.random(),
                name: team.name || '',
                location: team.location || '',
                founded: team.founded || new Date().getFullYear(),
                playerCount: team.playerCount || 0,
                ranking: team.ranking || '',
                logo: team.logo || team.image || 'https://via.placeholder.com/100',
                stats: {
                  wins: parseInt(team.wins || 0),
                  draws: parseInt(team.draws || 0),
                  losses: parseInt(team.losses || 0)
                }
              })) :
              rawData.map(player => ({
                id: Date.now() + Math.random(),
                name: player.name || '',
                team: player.team || '',
                position: player.position || '',
                age: parseInt(player.age || 0),
                experience: parseInt(player.experience || 0),
                status: player.status || 'active',
                image: player.image || player.img || player.avatar || player.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(player.name || 'Unknown')}&background=random`
              }));
            console.log('Formatted data:', formattedData);
            onImport(formattedData);
            onClose();
          } catch (err) {
            console.error('Excel parsing error:', err);
            setError('Invalid Excel format');
          }
        };
        reader.readAsArrayBuffer(file);
      } else if (file.type === "text/csv" || file.name.endsWith('.csv')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const csvText = e.target.result;
            console.log('Raw CSV text:', csvText);
            const lines = csvText.split('\n');
            const headers = lines[0].split(',').map(header => header.trim().toLowerCase()); // Convert headers to lowercase
            console.log('CSV headers:', headers);
            
            const rawData = lines.slice(1)
              .filter(line => line.trim())
              .map(line => {
                const values = line.split(',').map(value => value.trim());
                const obj = {};
                headers.forEach((header, index) => {
                  // Map CSV headers to object properties
                  const value = values[index] || '';
                  switch(header.toLowerCase()) {
                    case 'name':
                      obj.name = value;
                      break;
                    case 'team':
                      obj.team = value;
                      break;
                    case 'position':
                      obj.position = value;
                      break;
                    case 'age':
                      obj.age = parseInt(value) || 0;
                      break;
                    case 'experience':
                      obj.experience = parseInt(value) || 0;
                      break;
                    case 'status':
                      obj.status = value || 'active';
                      break;
                    case 'image':
                      obj.image = value || '';
                      break;
                    case 'logo':
                      obj.logo = value || '';
                      break;
                    case 'location':
                      obj.location = value;
                      break;
                    case 'founded':
                      obj.founded = parseInt(value) || new Date().getFullYear();
                      break;
                    case 'player count':
                    case 'playercount':
                      obj.playerCount = parseInt(value) || 0;
                      break;
                    case 'ranking':
                      obj.ranking = value;
                      break;
                    case 'wins':
                      obj.wins = parseInt(value) || 0;
                      break;
                    case 'draws':
                      obj.draws = parseInt(value) || 0;
                      break;
                    case 'losses':
                      obj.losses = parseInt(value) || 0;
                      break;
                    default:
                      obj[header] = value;
                  }
                });
                return obj;
              });

            console.log('Parsed CSV data:', rawData);
            const formattedData = section === 'Teams' ? 
              rawData.map(team => ({
                id: Date.now() + Math.random(),
                name: team.name || '',
                location: team.location || '',
                founded: team.founded || new Date().getFullYear(),
                playerCount: team.playerCount || 0,
                ranking: team.ranking || '',
                logo: team.logo || team.image || 'https://via.placeholder.com/100',
                stats: {
                  wins: parseInt(team.wins || 0),
                  draws: parseInt(team.draws || 0),
                  losses: parseInt(team.losses || 0)
                }
              })) :
              rawData.map(player => ({
                id: Date.now() + Math.random(),
                name: player.name || '',
                team: player.team || '',
                position: player.position || '',
                age: parseInt(player.age || 0),
                experience: parseInt(player.experience || 0),
                status: player.status || 'active',
                image: player.image || player.img || player.avatar || player.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(player.name || 'Unknown')}&background=random`
              }));
            
            console.log('Formatted data:', formattedData);
            onImport(formattedData);
            onClose();
          } catch (err) {
            console.error('CSV parsing error:', err);
            setError('Invalid CSV format');
          }
        };
        reader.readAsText(file);
      } else {
        setError('Please upload a JSON, Excel, or CSV file');
      }
    } catch (err) {
      console.error('File processing error:', err);
      setError('Error processing file');
    }
  }, [onImport, onClose, section]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [processFile]);

  const handleChange = useCallback((e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  }, [processFile]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 sm:p-6 w-full max-w-[95vw] sm:max-w-md max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-700/50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Import {section} Data</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div 
          className={`relative p-6 border-2 border-dashed rounded-xl transition-all duration-300 ${
            dragActive ? 'border-[#07f468] bg-[#07f468]/10' : 'border-gray-600 hover:border-[#07f468]/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".json,.xlsx,.xls,.csv"
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="space-y-4 text-center">
            <div className="flex justify-center">
              <div className="p-4 bg-gray-800/50 rounded-full">
                <Upload className="w-8 h-8 text-[#07f468]" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-300">
                Drag and drop your file here, or click to select
              </p>
              <p className="text-sm text-gray-400">
                Supports JSON, Excel, and CSV files
              </p>
            </div>
            <div className="flex justify-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <FileJson className="w-5 h-5 text-[#07f468]" />
                <span>JSON</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <FileSpreadsheet className="w-5 h-5 text-[#07f468]" />
                <span>Excel/CSV</span>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

const PlayersTeamsManagement = () => {
  const [view, setView] = useState('players');
  const [players, setPlayers] = useState(MOCK_PLAYERS);
  const [teams, setTeams] = useState(MOCK_TEAMS);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showStats, setShowStats] = useState(false);
  const showNotification = useNotification();
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Add handleImport function
  const handleImport = (data) => {
    console.log('Importing data:', data);
    try {
      if (Array.isArray(data)) {
        if (view === 'players') {
          const newPlayers = data.map(player => ({
            id: Date.now() + Math.random(),
            name: player.name || '',
            team: player.team || '',
            position: player.position || '',
            age: parseInt(player.age) || 0,
            experience: parseInt(player.experience) || 0,
            status: player.status || 'active',
            image: player.image || player.img || player.avatar || player.photo || 
              `https://ui-avatars.com/api/?name=${encodeURIComponent(player.name || 'Unknown')}&background=random`
          }));
          console.log('Formatted players:', newPlayers);
          setPlayers(prev => [...prev, ...newPlayers]);
          showNotification(`Successfully imported ${newPlayers.length} players`);
        } else {
          const newTeams = data.map(team => ({
            id: Date.now() + Math.random(),
            name: team.name || '',
            location: team.location || '',
            founded: parseInt(team.founded) || new Date().getFullYear(),
            playerCount: parseInt(team.playerCount) || 0,
            ranking: team.ranking || '',
            logo: team.logo || team.image || 'https://via.placeholder.com/100',
            stats: {
              wins: parseInt(team.wins || 0),
              draws: parseInt(team.draws || 0),
              losses: parseInt(team.losses || 0)
            }
          }));
          console.log('Formatted teams:', newTeams);
          setTeams(prev => [...prev, ...newTeams]);
          showNotification(`Successfully imported ${newTeams.length} teams`);
        }
      } else {
        console.error('Invalid data format:', data);
        showNotification('Invalid data format', 'error');
      }
    } catch (error) {
      console.error('Import error:', error);
      showNotification('Error importing data', 'error');
    }
    setIsImportModalOpen(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Add stats calculation
  const playerStats = {
    byPosition: [
      { name: 'Forward', value: players.filter(p => p.position === 'Forward').length },
      { name: 'Midfielder', value: players.filter(p => p.position === 'Midfielder').length },
      { name: 'Defender', value: players.filter(p => p.position === 'Defender').length },
      { name: 'Goalkeeper', value: players.filter(p => p.position === 'Goalkeeper').length },
    ],
    byStatus: [
      { name: 'Active', value: players.filter(p => p.status === 'active').length },
      { name: 'Injured', value: players.filter(p => p.status === 'injured').length },
      { name: 'Suspended', value: players.filter(p => p.status === 'suspended').length },
      { name: 'Inactive', value: players.filter(p => p.status === 'inactive').length },
    ]
  };

  const teamStats = teams.map(team => ({
    name: team.name,
    wins: team.stats.wins,
    draws: team.stats.draws,
    losses: team.stats.losses,
  }));

  const COLORS = ['#07f468', '#00c4ff', '#ff0099', '#ffbb28'];

  // Update CSV export data preparation
  const playersCSV = players.map(player => ({
    Name: player.name,
    Team: player.team,
    Position: player.position,
    Age: player.age,
    Experience: player.experience,
    Status: player.status,
    Image: player.image || '',
  }));

  const teamsCSV = teams.map(team => ({
    Name: team.name,
    Location: team.location,
    Founded: team.founded,
    'Player Count': team.playerCount,
    Ranking: team.ranking,
    Logo: team.logo || '',
    Wins: team.stats.wins,
    Draws: team.stats.draws,
    Losses: team.stats.losses,
  }));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#07f468]"></div>
      </div>
    );
  }

  return (
    <motion.div 
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen rounded-3xl bg-gray-900 text-white p-2 sm:p-4 md:p-6 space-y-4 sm:space-y-6 md:space-y-8"
    >
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-gradient-to-r from-gray-800/80 to-gray-900/80 p-4 sm:p-6 rounded-xl shadow-lg backdrop-blur-xl border border-gray-700/50">
        <motion.h1 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold bg-[#07f468] bg-clip-text text-transparent flex items-center gap-3"
        >
          <Users className="text-[#07f468] w-8 h-8 sm:w-10 sm:h-10" />
          {view === 'players' ? 'Players' : 'Teams'} Management
        </motion.h1>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => setShowStats(!showStats)}
            className={`p-2 sm:px-4 sm:py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              showStats ? 'bg-[#07f468] text-gray-900' : 'bg-gray-700 text-white'
            }`}
          >
            <BarChart2 className="w-5 h-5" />
            <span className="hidden sm:inline">Stats</span>
          </motion.button>
          
          <CSVLink
            data={view === 'players' ? playersCSV : teamsCSV}
            filename={view === 'players' ? 'players.csv' : 'teams.csv'}
            className="p-2 sm:px-4 sm:py-2 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-all flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            <span className="hidden sm:inline">Export</span>
          </CSVLink>

          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => setIsImportModalOpen(true)}
            className="p-2 sm:px-4 sm:py-2 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-all flex items-center gap-2"
          >
            <Upload className="w-5 h-5" />
            <span className="hidden sm:inline">Import</span>
          </motion.button>

          <div className="h-8 w-px bg-gray-700 hidden sm:block" />
          
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => setView('players')}
            className={`p-2 sm:px-4 sm:py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              view === 'players' ? 'bg-[#07f468] text-gray-900' : 'bg-gray-700 text-white'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="hidden sm:inline">Players</span>
          </motion.button>

          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => setView('teams')}
            className={`p-2 sm:px-4 sm:py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              view === 'teams' ? 'bg-[#07f468] text-gray-900' : 'bg-gray-700 text-white'
            }`}
          >
            <Shield className="w-5 h-5" />
            <span className="hidden sm:inline">Teams</span>
          </motion.button>
        </div>
      </div>

      {showStats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full max-w-[1400px] mx-auto p-4"
        >
          {view === 'players' ? (
            <>
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-4 backdrop-blur-xl border border-gray-700/50 w-full">
                <h3 className="text-lg sm:text-xl font-bold mb-4 text-center">Players by Position</h3>
                <div className="w-full h-[250px] sm:h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={playerStats.byPosition}
                        cx="50%"
                        cy="50%"
                        innerRadius={window.innerWidth < 768 ? "35%" : "45%"}
                        outerRadius={window.innerWidth < 768 ? "60%" : "70%"}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {playerStats.byPosition.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-4 backdrop-blur-xl border border-gray-700/50 w-full">
                <h3 className="text-lg sm:text-xl font-bold mb-4 text-center">Players by Status</h3>
                <div className="w-full h-[250px] sm:h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={playerStats.byStatus}
                        cx="50%"
                        cy="50%"
                        innerRadius={window.innerWidth < 768 ? "35%" : "45%"}
                        outerRadius={window.innerWidth < 768 ? "60%" : "70%"}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {playerStats.byStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          ) : (
            <div className="col-span-2 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-4 backdrop-blur-xl border border-gray-700/50 w-full">
              <h3 className="text-lg sm:text-xl font-bold mb-4 text-center">Team Performance</h3>
              <div className="w-full h-[250px] sm:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={teamStats}
                    margin={{ 
                      top: 20, 
                      right: window.innerWidth < 768 ? 10 : 30, 
                      left: window.innerWidth < 768 ? 10 : 20, 
                      bottom: 60 
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name"
                      tick={{ fontSize: window.innerWidth < 768 ? 10 : 12 }}
                      interval={0}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend 
                      verticalAlign="top" 
                      height={36}
                      wrapperStyle={{ paddingBottom: '20px' }}
                    />
                    <Bar dataKey="wins" fill="#07f468" />
                    <Bar dataKey="draws" fill="#00c4ff" />
                    <Bar dataKey="losses" fill="#ff0099" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </motion.div>
      )}

      <motion.div 
        variants={staggerContainer}
        initial="initial"
        animate="animate" 
        className="space-y-8"
      >
        {view === 'players' ? (
          <PlayersSection 
            players={players}
            setPlayers={setPlayers}
            teams={teams}
          />
        ) : (
          <TeamsSection 
            teams={teams}
            setTeams={setTeams}
          />
        )}
      </motion.div>

      <ImportModal 
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImport}
        section={view === 'players' ? 'Players' : 'Teams'}
      />
    </motion.div>
  );
};

const PlayerCard = ({ player, onEdit, onDelete }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl overflow-hidden shadow-lg border border-gray-700/50"
  >
    <div className="relative h-48">
      <img
        src={player.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(player.name)}&background=random`}
        alt={player.name}
        className="w-full h-48 object-cover"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(player.name)}&background=random`;
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
      <span
        className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${
          player.status === 'active'
            ? 'bg-green-500 text-white'
            : player.status === 'inactive'
            ? 'bg-gray-500 text-white'
            : player.status === 'suspended'
            ? 'bg-red-500 text-white'
            : 'bg-yellow-500 text-white'
        }`}
      >
        {player.status}
      </span>
    </div>

    <div className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-white">{player.name || 'Unnamed Player'}</h3>
          <p className="text-gray-400">{player.team || 'No Team'}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-800/30 rounded-lg p-3">
          <p className="text-gray-400 text-sm">Position</p>
          <p className="text-white font-medium">{player.position || 'Unspecified'}</p>
        </div>
        <div className="bg-gray-800/30 rounded-lg p-3">
          <p className="text-gray-400 text-sm">Age</p>
          <p className="text-white font-medium">{player.age ? `${player.age} years` : 'N/A'}</p>
        </div>
        <div className="bg-gray-800/30 rounded-lg p-3">
          <p className="text-gray-400 text-sm">Experience</p>
          <p className="text-white font-medium">{player.experience ? `${player.experience} years` : 'N/A'}</p>
        </div>
        <div className="bg-gray-800/30 rounded-lg p-3">
          <p className="text-gray-400 text-sm">Status</p>
          <p className="text-white font-medium capitalize">{player.status || 'Unknown'}</p>
        </div>
      </div>

      <div className="flex space-x-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onEdit}
          className="flex-1 bg-[#07f468] text-gray-900 py-2 rounded-lg font-bold hover:bg-[#06d35a] transition-colors flex items-center justify-center gap-2"
        >
          <Edit size={18} />
          Edit
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onDelete}
          className="flex-1 bg-red-500 text-white py-2 rounded-lg font-bold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
        >
          <Trash2 size={18} />
          Delete
        </motion.button>
      </div>
    </div>
  </motion.div>
);

const TeamCard = ({ team, onEdit, onDelete }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
  >
    <div className="relative">
      <img
        src={team.logo}
        alt={team.name}
        className="w-full h-48 object-cover"
      />
    </div>

    <div className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-white">{team.name}</h3>
          <p className="text-gray-400">{team.location}</p>
        </div>
        <div className="flex items-center">
          <span className="text-lg font-bold text-[#07f468]">{team.ranking}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-700 p-3 rounded-lg">
          <p className="text-sm text-gray-400">Founded</p>
          <p className="text-lg font-bold text-white">{team.founded}</p>
        </div>
        <div className="bg-gray-700 p-3 rounded-lg">
          <p className="text-sm text-gray-400">Players</p>
          <p className="text-lg font-bold text-white">{team.playerCount}</p>
        </div>
      </div>

      <div className="flex space-x-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onEdit}
          className="flex-1 bg-[#07f468] text-gray-900 py-2 rounded-lg font-bold hover:bg-[#06d35a] transition-colors flex items-center justify-center gap-2"
        >
          <Edit size={18} />
          Edit
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onDelete}
          className="flex-1 bg-red-500 text-white py-2 rounded-lg font-bold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
        >
          <Trash2 size={18} />
          Delete
        </motion.button>
      </div>
    </div>
  </motion.div>
);

const PlayerModal = ({ player, teams, onClose, onSave }) => {
  const [formData, setFormData] = useState(
    player || {
      name: '',
      team: '',
      position: '',
      age: '',
      experience: '',
      status: 'active',
      image: ''
    }
  );

  const positions = [
    'Goalkeeper',
    'Defender',
    'Midfielder',
    'Forward'
  ];

  const statuses = [
    'active',
    'inactive',
    'injured',
    'suspended'
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto border border-gray-700/50"
      >
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <User className="w-8 h-8 text-[#07f468]" />
          {player ? 'Edit Player' : 'Add New Player'}
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(formData);
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-gray-400 mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07f468] backdrop-blur-xl"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Team</label>
            <select
              value={formData.team}
              onChange={(e) => setFormData({ ...formData, team: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07f468] backdrop-blur-xl"
              required
            >
              <option value="">Select Team</option>
              {teams.map(team => (
                <option key={team.id} value={team.name}>{team.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Position</label>
            <select
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07f468] backdrop-blur-xl"
              required
            >
              <option value="">Select Position</option>
              {positions.map(position => (
                <option key={position} value={position}>{position}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 mb-2">Age</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07f468] backdrop-blur-xl"
                required
                min="15"
                max="50"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Experience (years)</label>
              <input
                type="number"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07f468] backdrop-blur-xl"
                required
                min="0"
                max="35"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07f468] backdrop-blur-xl"
              required
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Image URL</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07f468] backdrop-blur-xl"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-700 text-white rounded-lg font-bold hover:bg-gray-600 transition-colors"
            >
              Cancel
            </motion.button>
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              type="submit"
              className="px-6 py-2 bg-[#07f468] text-gray-900 rounded-lg font-bold hover:bg-[#06d35a] transition-colors"
            >
              {player ? 'Update' : 'Create'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

const TeamModal = ({ team, onClose, onSave }) => {
    const [formData, setFormData] = useState(
      team || {
        name: '',
        location: '',
        founded: '',
        playerCount: '',
        ranking: '',
        logo: '',
        stats: {
          wins: 0,
          draws: 0,
          losses: 0
        }
      }
    );
  
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-800 rounded-lg p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto"
        >
          <h2 className="text-2xl font-bold text-white mb-6">
            {team ? 'Edit Team' : 'Add New Team'}
          </h2>
  
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSave(formData);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-gray-400 mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07f468]"
                required
              />
            </div>
  
            <div>
              <label className="block text-gray-400 mb-2">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07f468]"
                required
              />
            </div>
  
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-2">Founded</label>
                <input
                  type="number"
                  value={formData.founded}
                  onChange={(e) => setFormData({ ...formData, founded: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07f468]"
                  required
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Player Count</label>
                <input
                  type="number"
                  value={formData.playerCount}
                  onChange={(e) => setFormData({ ...formData, playerCount: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07f468]"
                  required
                  min="1"
                  max="50"
                />
              </div>
            </div>
  
            <div>
              <label className="block text-gray-400 mb-2">Ranking</label>
              <input
                type="text"
                value={formData.ranking}
                onChange={(e) => setFormData({ ...formData, ranking: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07f468]"
                required
              />
            </div>
  
            <div>
              <label className="block text-gray-400 mb-2">Logo URL</label>
              <input
                type="url"
                value={formData.logo}
                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07f468]"
                required
              />
            </div>
  
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-400 mb-2">Wins</label>
                <input
                  type="number"
                  value={formData.stats.wins}
                  onChange={(e) => setFormData({ ...formData, stats: { ...formData.stats, wins: e.target.value } })}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07f468]"
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Draws</label>
                <input
                  type="number"
                  value={formData.stats.draws}
                  onChange={(e) => setFormData({ ...formData, stats: { ...formData.stats, draws: e.target.value } })}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07f468]"
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Losses</label>
                <input
                  type="number"
                  value={formData.stats.losses}
                  onChange={(e) => setFormData({ ...formData, stats: { ...formData.stats, losses: e.target.value } })}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07f468]"
                  required
                  min="0"
                />
              </div>
            </div>
  
            <div className="flex justify-end space-x-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-gray-700 text-white rounded-lg font-bold hover:bg-gray-600 transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-6 py-2 bg-[#07f468] text-gray-900 rounded-lg font-bold hover:bg-[#06d35a] transition-colors"
              >
                {team ? 'Update' : 'Create'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    );
  };

  const PlayersSection = ({ players, setPlayers, teams }) => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterTeam, setFilterTeam] = useState('all');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [playerToDelete, setPlayerToDelete] = useState(null);
    const showNotification = useNotification();
  
    const filteredPlayers = players.filter(player => {
      const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.team.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || player.status === filterStatus;
      const matchesTeam = filterTeam === 'all' || player.team === filterTeam;
      return matchesSearch && matchesStatus && matchesTeam;
    });
  
    const handleAdd = (playerData) => {
      console.log('Adding new players:', playerData);
      const newPlayers = Array.isArray(playerData) ? playerData : [playerData];
      setPlayers(prev => [...prev, ...newPlayers]);
      showNotification(`Successfully added ${newPlayers.length} player(s)`);
    };
  
    const handleUpdate = (playerData) => {
      setPlayers(prev => prev.map(p => 
        p.id === playerData.id ? playerData : p
      ));
      showNotification('Player updated successfully');
    };
  
    const handleDelete = (playerId) => {
      setPlayers(prev => prev.filter(p => p.id !== playerId));
      showNotification('Player deleted successfully');
      setIsDeleteModalOpen(false);
    };
  
    // Add this to see what players are being rendered
    useEffect(() => {
      console.log('Current players:', players);
    }, [players]);
  
    return (
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search players..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07f468] backdrop-blur-xl"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'active', 'inactive', 'injured', 'suspended'].map((status) => (
              <motion.button
                key={status}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filterStatus === status
                    ? 'bg-[#07f468] text-gray-900'
                    : 'bg-gray-800/50 text-gray-400 backdrop-blur-xl'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </motion.button>
            ))}
          </div>
          <select
            value={filterTeam}
            onChange={(e) => setFilterTeam(e.target.value)}
            className="px-4 py-2 bg-gray-800/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07f468] backdrop-blur-xl"
          >
            <option value="all">All Teams</option>
            {teams.map(team => (
              <option key={team.id} value={team.name}>{team.name}</option>
            ))}
          </select>
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => setShowAddModal(true)}
            className="bg-[#07f468] text-gray-900 px-6 py-2 rounded-full font-medium hover:bg-[#06d35a] transition-colors duration-300 flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Add Player
          </motion.button>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredPlayers.length > 0 ? (
              filteredPlayers.map((player) => (
                <motion.div
                  key={player.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 backdrop-blur-xl border border-gray-700/50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={player.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(player.name)}&background=random`}
                          alt={player.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-900 ${
                          player.status === 'active' ? 'bg-green-500' :
                          player.status === 'injured' ? 'bg-yellow-500' :
                          player.status === 'suspended' ? 'bg-red-500' :
                          'bg-gray-500'
                        }`} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{player.name || 'Unnamed Player'}</h3>
                        <p className="text-gray-400">{player.team || 'No Team'}</p>
                      </div>
                    </div>
                    <PlayerActions
                      player={player}
                      onEdit={() => setSelectedPlayer(player)}
                      onDelete={() => {
                        setPlayerToDelete(player);
                        setIsDeleteModalOpen(true);
                      }}
                    />
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="bg-gray-800/30 rounded-lg p-3">
                      <p className="text-gray-400 text-sm">Position</p>
                      <p className="text-white font-medium">{player.position || 'Unspecified'}</p>
                    </div>
                    <div className="bg-gray-800/30 rounded-lg p-3">
                      <p className="text-gray-400 text-sm">Age</p>
                      <p className="text-white font-medium">{player.age ? `${player.age} years` : 'N/A'}</p>
                    </div>
                    <div className="bg-gray-800/30 rounded-lg p-3">
                      <p className="text-gray-400 text-sm">Experience</p>
                      <p className="text-white font-medium">{player.experience ? `${player.experience} years` : 'N/A'}</p>
                    </div>
                    <div className="bg-gray-800/30 rounded-lg p-3">
                      <p className="text-gray-400 text-sm">Status</p>
                      <p className="text-white font-medium capitalize">{player.status || 'Unknown'}</p>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-3 flex flex-col items-center justify-center h-64 text-gray-400"
              >
                <X className="w-12 h-12 mb-4" />
                <p>No players found matching your criteria</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
  
        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={() => {
            handleDelete(playerToDelete?.id);
            setIsDeleteModalOpen(false);
          }}
          itemName={playerToDelete ? ` ${playerToDelete.name}` : "this player"}
        />
  
        {/* Player Modal */}
        <AnimatePresence>
          {(showAddModal || selectedPlayer) && (
            <PlayerModal
              player={selectedPlayer}
              teams={teams}
              onClose={() => {
                setShowAddModal(false);
                setSelectedPlayer(null);
              }}
              onSave={(playerData) => {
                if (selectedPlayer) {
                  handleUpdate(playerData);
                } else {
                  handleAdd(playerData);
                }
                setShowAddModal(false);
                setSelectedPlayer(null);
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    );
  };
  const TeamsSection = ({ teams, setTeams }) => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [teamToDelete, setTeamToDelete] = useState(null);
    const showNotification = useNotification();
  
    const filteredTeams = teams.filter(team =>
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
    const handleAdd = (teamData) => {
      console.log('Adding new teams:', teamData);
      const newTeams = Array.isArray(teamData) ? teamData : [teamData];
      setTeams(prev => [...prev, ...newTeams]);
      showNotification(`Successfully added ${newTeams.length} team(s)`);
    };
  
    const handleUpdate = (teamData) => {
      setTeams(prev => prev.map(t => 
        t.id === teamData.id ? teamData : t
      ));
      showNotification('Team updated successfully');
    };
  
    const handleDelete = (teamId) => {
      setTeams(prev => prev.filter(t => t.id !== teamId));
      showNotification('Team deleted successfully');
      setIsDeleteModalOpen(false);
    };
  
    // Add this to see what teams are being rendered
    useEffect(() => {
      console.log('Current teams:', teams);
    }, [teams]);
  
    return (
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-6"
      >
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07f468] backdrop-blur-xl"
            />
          </div>
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => setShowAddModal(true)}
            className="bg-[#07f468] text-gray-900 px-6 py-2 rounded-full font-medium hover:bg-[#06d35a] transition-colors duration-300 flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Add Team
          </motion.button>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredTeams.length > 0 ? (
              filteredTeams.map((team) => (
                <motion.div
                  key={team.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 backdrop-blur-xl border border-gray-700/50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <img
                        src={team.logo || 'https://via.placeholder.com/100'}
                        alt={team.name}
                        className="w-16 h-16 rounded-full object-cover bg-gray-700"
                      />
                      <div>
                        <h3 className="text-xl font-bold text-white">{team.name}</h3>
                        <p className="text-gray-400">{team.location}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => setSelectedTeam(team)}
                        className="p-2 bg-gray-700/50 text-gray-400 rounded-lg hover:text-white transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => {
                          setTeamToDelete(team);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-2 bg-gray-700/50 text-gray-400 rounded-lg hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="bg-gray-800/30 rounded-lg p-3">
                      <p className="text-gray-400 text-sm">Founded</p>
                      <p className="text-white font-medium">{team.founded}</p>
                    </div>
                    <div className="bg-gray-800/30 rounded-lg p-3">
                      <p className="text-gray-400 text-sm">Players</p>
                      <p className="text-white font-medium">{team.playerCount}</p>
                    </div>
                    <div className="bg-gray-800/30 rounded-lg p-3">
                      <p className="text-gray-400 text-sm">Ranking</p>
                      <p className="text-white font-medium">{team.ranking}</p>
                    </div>
                    <div className="bg-gray-800/30 rounded-lg p-3">
                      <p className="text-gray-400 text-sm">Win Rate</p>
                      <p className="text-white font-medium">
                        {Math.round(
                          (team.stats.wins / (team.stats.wins + team.stats.draws + team.stats.losses)) * 100
                        )}%
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <div className="flex-1 bg-gray-800/30 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <p className="text-gray-400 text-sm">Performance</p>
                        <div className="flex gap-4">
                          <p className="text-green-500">{team.stats.wins}W</p>
                          <p className="text-gray-400">{team.stats.draws}D</p>
                          <p className="text-red-500">{team.stats.losses}L</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-3 flex flex-col items-center justify-center h-64 text-gray-400"
              >
                <X className="w-12 h-12 mb-4" />
                <p>No teams found matching your criteria</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
  
        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={() => {
            handleDelete(teamToDelete?.id);
            setIsDeleteModalOpen(false);
          }}
          itemName={teamToDelete ? ` ${teamToDelete.name}` : "this team"}
        />
  
        {/* Team Modal */}
        <AnimatePresence>
          {(showAddModal || selectedTeam) && (
            <TeamModal
              team={selectedTeam}
              onClose={() => {
                setShowAddModal(false);
                setSelectedTeam(null);
              }}
              onSave={(teamData) => {
                if (selectedTeam) {
                  handleUpdate(teamData);
                } else {
                  handleAdd(teamData);
                }
                setShowAddModal(false);
                setSelectedTeam(null);
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

const ActionMenu = ({ onMessage, onAward, onBan, onPromote }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 bg-gray-700/50 text-gray-400 rounded-lg hover:text-white transition-colors"
      >
        <MoreVertical className="w-4 h-4" />
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-1 z-50"
          >
            <button
              onClick={() => { onMessage(); setIsOpen(false); }}
              className="w-full px-4 py-2 text-left text-white hover:bg-gray-700 flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Send Message
            </button>
            <button
              onClick={() => { onAward(); setIsOpen(false); }}
              className="w-full px-4 py-2 text-left text-white hover:bg-gray-700 flex items-center gap-2"
            >
              <Award className="w-4 h-4" />
              Give Award
            </button>
            <button
              onClick={() => { onBan(); setIsOpen(false); }}
              className="w-full px-4 py-2 text-left text-white hover:bg-gray-700 flex items-center gap-2"
            >
              <Ban className="w-4 h-4" />
              Ban Player
            </button>
            <button
              onClick={() => { onPromote(); setIsOpen(false); }}
              className="w-full px-4 py-2 text-left text-white hover:bg-gray-700 flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Promote
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PlayerActions = ({ player, onEdit, onDelete }) => {
  const showNotification = useNotification();

  return (
    <div className="flex gap-2">
      <ActionMenu
        onMessage={() => showNotification(`Message sent to ${player.name}`)}
        onAward={() => showNotification(`Award given to ${player.name}`)}
        onBan={() => showNotification(`${player.name} has been banned`)}
        onPromote={() => showNotification(`${player.name} has been promoted`)}
      />
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        onClick={onEdit}
        className="p-2 bg-gray-700/50 text-gray-400 rounded-lg hover:text-white transition-colors"
      >
        <Edit className="w-4 h-4" />
      </motion.button>
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        onClick={onDelete}
        className="p-2 bg-gray-700/50 text-gray-400 rounded-lg hover:text-red-500 transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </motion.button>
    </div>
  );
};

const App = () => (
  <NotificationProvider>
    <PlayersTeamsManagement />
  </NotificationProvider>
);

export default App;
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, itemName }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 w-full max-w-md border border-gray-700/50"
      >
        <h3 className="text-xl font-bold text-white mb-4">Confirm Deletion</h3>
        <p className="text-gray-300 mb-6">
          Are you sure you want to delete <span className='text-red-500'>{itemName}</span> ? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </motion.button>
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Delete
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};
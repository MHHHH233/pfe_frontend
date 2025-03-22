import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Edit, Trash2, Plus, Search, Filter, Eye, X, Star, User, Shield, Shirt, Activity, CheckCircle, AlertCircle, MoreVertical, MessageSquare, Award, Ban, UserPlus, Download, Upload, BarChart2, FileJson, FileSpreadsheet, Calendar, RefreshCw, Check } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CSVDownload, CSVLink } from 'react-csv';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import * as XLSX from 'xlsx';
import playersService from '../../lib/services/admin/playersService';
import teamsService from '../../lib/services/admin/teamsService';
import ratingsService from '../../lib/services/admin/ratingsService';
import playerRequestsService from '../../lib/services/admin/playerRequestsService';
import compteServices from '../../lib/services/admin/compteServices';
import { format, parseISO } from 'date-fns';

// Animation variants
const COLORS = ['#07f468', '#00c4ff', '#ff0099', '#ffb800', '#9c27b0', '#3f51b5'];

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
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showStats, setShowStats] = useState(false);
  const showNotification = useNotification();
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [error, setError] = useState(null);

  // Fetch data on component mount and when view changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (view === 'players') {
          const response = await playersService.getAllPlayers({
            include: 'compte,ratings',
            sort_by: 'rating',
            sort_order: 'desc'
          });
          setPlayers(response.data || []);
        } else {
          const response = await teamsService.getAllTeams({
            include: 'captain,ratings',
            sort_by: 'rating',
            sort_order: 'desc'
          });
          setTeams(response.data || []);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
        showNotification('Failed to load data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [view]);

  // Add handleImport function with API integration
  const handleImport = async (data) => {
    console.log('Importing data:', data);
    try {
      if (Array.isArray(data)) {
        const service = view === 'players' ? playersService : teamsService;
        const results = await Promise.all(
          data.map(item => service.createPlayer(item))
        );
        
        if (view === 'players') {
          setPlayers(prev => [...prev, ...results.map(r => r.data)]);
      } else {
          setTeams(prev => [...prev, ...results.map(r => r.data)]);
        }
        
        showNotification(`Successfully imported ${results.length} ${view}`);
      }
    } catch (error) {
      console.error('Import error:', error);
      showNotification('Error importing data', 'error');
    }
    setIsImportModalOpen(false);
  };

  // Calculate stats from real data
  const playerStats = {
    byPosition: players.reduce((acc, player) => {
      const position = player.position || 'Unknown';
      acc[position] = (acc[position] || 0) + 1;
      return acc;
    }, {}),
    byStatus: players.reduce((acc, player) => {
      const status = player.status || 'Unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {})
  };

  const teamStats = teams.map(team => ({
    name: team.name,
    wins: team.total_matches ? Math.round((team.rating / 5) * team.total_matches) : 0,
    draws: team.total_matches ? Math.round((team.total_matches - (team.rating / 5) * team.total_matches) / 2) : 0,
    losses: team.total_matches ? Math.round((team.total_matches - (team.rating / 5) * team.total_matches) / 2) : 0,
  }));

  // Format data for CSV export
  const playersCSV = players.map(player => ({
    Name: player.compte?.nom + ' ' + player.compte?.prenom || '',
    Position: player.position || '',
    'Total Matches': player.total_matches || 0,
    Rating: player.rating || 0,
    'Starting Time': player.starting_time || '',
    'Finishing Time': player.finishing_time || '',
    Misses: player.misses || 0,
    'Invites Accepted': player.invites_accepted || 0,
    'Invites Refused': player.invites_refused || 0,
    'Total Invites': player.total_invites || 0
  }));

  const teamsCSV = teams.map(team => ({
    Captain: team.captain?.nom + ' ' + team.captain?.prenom || '',
    'Total Matches': team.total_matches || 0,
    Rating: team.rating || 0,
    'Starting Time': team.starting_time || '',
    'Finishing Time': team.finishing_time || '',
    Misses: team.misses || 0,
    'Invites Accepted': team.invites_accepted || 0,
    'Invites Refused': team.invites_refused || 0,
    'Total Invites': team.total_invites || 0
  }));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#07f468]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Error Loading Data</h2>
          <p className="text-gray-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[#07f468] text-gray-900 rounded-lg hover:bg-[#06d35a] transition-colors"
          >
            Retry
          </button>
        </div>
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
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-gray-800/80 to-gray-900/80 p-4 sm:p-6 rounded-xl shadow-lg backdrop-blur-xl border border-gray-700/50">
        <motion.h1 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold bg-[#07f468] bg-clip-text text-transparent flex items-center gap-3"
        >
          <Users className="text-[#07f468] w-8 h-8 sm:w-10 sm:h-10" />
          {view === 'players' ? 'Players' : 'Teams'} Management
        </motion.h1>

        {/* Controls Container */}
        <div className="w-full sm:w-auto flex flex-wrap items-center gap-2 sm:gap-4">
        

          <div className="w-full sm:w-auto flex flex-wrap gap-2">
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => setView('players')}
              className={`flex-1 sm:flex-none p-2 sm:px-4 sm:py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                view === 'players' ? 'bg-[#07f468] text-gray-900' : 'bg-gray-700 text-white'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="sm:inline">Players</span>
            </motion.button>

            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => setView('teams')}
              className={`flex-1 sm:flex-none p-2 sm:px-4 sm:py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                view === 'teams' ? 'bg-[#07f468] text-gray-900' : 'bg-gray-700 text-white'
              }`}
            >
              <Shield className="w-5 h-5" />
              <span className="sm:inline">Teams</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
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
                        {Object.values(playerStats.byPosition).map((value, index) => (
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
                        {Object.values(playerStats.byStatus).map((value, index) => (
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

      {/* Main Content */}
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

      {/* ... existing modals ... */}
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

const PlayerModal = ({ player, teams, onClose, onSave, players }) => {
  const [formData, setFormData] = useState({
    id_compte: player?.id_compte || '',
    position: player?.position || '',
    total_matches: player?.total_matches || 0,
    rating: player?.rating || 0,
    starting_time: player?.starting_time || '',
    finishing_time: player?.finishing_time || '',
    total_invites: player?.total_invites || 0,
    misses: player?.misses || 0,
    invites_accepted: player?.invites_accepted || 0,
    invites_refused: player?.invites_refused || 0
  });

  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // Add errors state
  const [errors, setErrors] = useState({});
  const showNotification = useNotification();

  const positions = [
    'Goalkeeper',
    'Defender',
    'Midfielder',
    'Forward'
  ];

  // Fetch accounts on component mount
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        const response = await compteServices.getAllComptes(1, 100);
        
        // Get all existing player account IDs
        const existingPlayerAccountIds = players.map(player => player.id_compte);
        console.log('Existing player account IDs:', existingPlayerAccountIds);
        
        // Filter out accounts that are already players, except for the current player being edited
        const availableAccounts = response.data.filter(account => {
          // If editing a player, allow their own account to be selected
          if (player && player.id_compte === account.id_compte) {
            return true;
          }
          // Filter out accounts that are already associated with players
          return !existingPlayerAccountIds.includes(account.id_compte);
        });
        
        console.log('Available accounts:', availableAccounts);
        setAccounts(availableAccounts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching accounts:', error);
        setError('Failed to fetch accounts');
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [players, player]);

  // Validate and set account when id_compte changes
  useEffect(() => {
    const validateAccount = async () => {
      if (formData.id_compte) {
        try {
          const response = await compteServices.getCompte(formData.id_compte);
          setSelectedAccount(response.data);
          setError('');
        } catch (err) {
          console.error('Error validating account:', err);
          setSelectedAccount(null);
          setError('Invalid account ID');
          showNotification('Invalid account ID', 'error');
        }
      } else {
        setSelectedAccount(null);
      }
    };

    validateAccount();
  }, [formData.id_compte]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validatePlayerForm(formData);
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }
    onSave(formData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;

    // Convert numeric fields to numbers
    if (['total_matches', 'rating', 'total_invites', 'misses'].includes(name)) {
      updatedValue = parseInt(value) || 0;
    }

    // Handle time fields
    if (['starting_time', 'finishing_time'].includes(name)) {
      updatedValue = value + ':00';
    }

    setFormData(prev => {
      const newData = { ...prev, [name]: updatedValue };

      // Automatically calculate invites statistics when total_invites or misses change
      if (name === 'total_invites' || name === 'misses') {
        const total = parseInt(newData.total_invites) || 0;
        const misses = parseInt(newData.misses) || 0;
        
        // Ensure misses cannot exceed total invites
        const validMisses = Math.min(misses, total);
        
        if (name === 'misses' && validMisses !== misses) {
          newData.misses = validMisses;
        }
        
        // Calculate refused invites (misses)
        newData.invites_refused = validMisses;
        
        // Calculate accepted invites (total - refused)
        newData.invites_accepted = Math.max(0, total - validMisses);
      }

      return newData;
    });
  };

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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-2">Account</label>
            <select
              value={formData.id_compte}
              onChange={(e) => setFormData({ ...formData, id_compte: parseInt(e.target.value) })}
              className={`w-full px-4 py-2 bg-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07f468] backdrop-blur-xl ${
                errors.id_compte ? 'border-red-500' : 'border-gray-600'
              }`}
              required
            >
              <option value="">Select Account</option>
              {accounts.map(account => (
                <option key={account.id_compte} value={account.id_compte}>
                  {account.nom} {account.prenom} ({account.email})
                </option>
              ))}
            </select>
            {errors.id_compte && <p className="mt-1 text-sm text-red-500">{errors.id_compte}</p>}
            {selectedAccount && (
              <div className="mt-2 p-3 bg-gray-700/30 rounded-lg">
                <p className="text-sm text-gray-400">Selected Account:</p>
                <p className="text-white">{selectedAccount.nom} {selectedAccount.prenom}</p>
                <p className="text-gray-400 text-sm">{selectedAccount.email}</p>
              </div>
            )}
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
              <label className="block text-gray-400 mb-2">Total Matches</label>
              <input
                type="number"
                name="total_matches"
                value={formData.total_matches}
                onChange={(e) => handleInputChange(e)}
                min="0"
                className="w-full px-4 py-2 bg-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07f468] backdrop-blur-xl"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Rating</label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={(e) => handleInputChange(e)}
                min="0"
                max="5"
                className="w-full px-4 py-2 bg-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07f468] backdrop-blur-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 mb-2">Starting Time</label>
              <input
                type="time"
                name="starting_time"
                value={formData.starting_time ? formData.starting_time.slice(0, 5) : ''}
                onChange={(e) => handleInputChange(e)}
                className="w-full px-4 py-2 bg-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07f468] backdrop-blur-xl"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Finishing Time</label>
              <input
                type="time"
                name="finishing_time"
                value={formData.finishing_time ? formData.finishing_time.slice(0, 5) : ''}
                onChange={(e) => handleInputChange(e)}
                className="w-full px-4 py-2 bg-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07f468] backdrop-blur-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 mb-2">Misses</label>
              <input
                type="number"
                name="misses"
                value={formData.misses}
                onChange={handleInputChange}
                min="0"
                max={formData.total_invites}
                className="w-full px-4 py-2 bg-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07f468] backdrop-blur-xl"
              />
              {formData.misses > formData.total_invites && (
                <p className="text-sm text-red-500 mt-1">Misses cannot exceed total invites</p>
              )}
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Total Invites</label>
              <input
                type="number"
                name="total_invites"
                value={formData.total_invites}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-2 bg-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07f468] backdrop-blur-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 mb-2">
              <p className="text-sm text-gray-400 italic">These values are automatically calculated based on Total Invites and Misses</p>
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Invites Accepted</label>
              <input
                type="number"
                value={formData.invites_accepted}
                readOnly
                className="w-full px-4 py-2 bg-gray-800/50 text-gray-400 rounded-lg focus:outline-none backdrop-blur-xl cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Invites Refused</label>
              <input
                type="number"
                value={formData.invites_refused}
                readOnly
                className="w-full px-4 py-2 bg-gray-800/50 text-gray-400 rounded-lg focus:outline-none backdrop-blur-xl cursor-not-allowed"
              />
            </div>
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
              disabled={!selectedAccount || loading}
              className={`px-6 py-2 ${!selectedAccount || loading ? 'bg-gray-500' : 'bg-[#07f468]'} text-gray-900 rounded-lg font-bold hover:bg-[#06d35a] transition-colors flex items-center gap-2`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                  Loading...
                </>
              ) : (
                player ? 'Update' : 'Create'
              )}
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
      capitain: '',
      total_matches: 0,
      rating: 0,
      starting_time: '',
      finishing_time: '',
      misses: 0,
      invites_accepted: 0,
      invites_refused: 0,
      total_invites: 0
    }
  );

  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // Add errors state
  const [errors, setErrors] = useState({});
  const showNotification = useNotification();

  // Fetch accounts on component mount
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        const response = await compteServices.getAllComptes(1, 100); // Get first 100 accounts
        setAccounts(response.data || []);
      } catch (err) {
        console.error('Error fetching accounts:', err);
        setError('Failed to load accounts');
        showNotification('Failed to load accounts', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  // Validate and set account when capitain changes
  useEffect(() => {
    const validateAccount = async () => {
      if (formData.capitain) {
        try {
          const response = await compteServices.getCompte(formData.capitain);
          setSelectedAccount(response.data);
          setError('');
        } catch (err) {
          console.error('Error validating account:', err);
          setSelectedAccount(null);
          setError('Invalid account ID');
          showNotification('Invalid account ID', 'error');
        }
      } else {
        setSelectedAccount(null);
      }
    };

    validateAccount();
  }, [formData.capitain]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateTeamForm(formData);
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }
    onSave(formData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;

    // Convert numeric fields to numbers
    if (['total_matches', 'rating', 'total_invites', 'misses'].includes(name)) {
      updatedValue = parseInt(value) || 0;
    }

    // Handle time fields
    if (['starting_time', 'finishing_time'].includes(name)) {
      updatedValue = value + ':00';
    }

    setFormData(prev => {
      const newData = { ...prev, [name]: updatedValue };

      // Automatically calculate invites statistics when total_invites or misses change
      if (name === 'total_invites' || name === 'misses') {
        const total = parseInt(newData.total_invites) || 0;
        const misses = parseInt(newData.misses) || 0;
        
        // Ensure misses cannot exceed total invites
        const validMisses = Math.min(misses, total);
        
        if (name === 'misses' && validMisses !== misses) {
          newData.misses = validMisses;
        }
        
        // Calculate refused invites (misses)
        newData.invites_refused = validMisses;
        
        // Calculate accepted invites (total - refused)
        newData.invites_accepted = Math.max(0, total - validMisses);
      }

      return newData;
    });
  };

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
          <Shield className="w-8 h-8 text-[#07f468]" />
          {team ? 'Edit Team' : 'Add New Team'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-2">Captain Account</label>
            <select
              value={formData.capitain}
              onChange={(e) => setFormData({ ...formData, capitain: parseInt(e.target.value) })}
              className={`w-full px-4 py-2 bg-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07f468] backdrop-blur-xl ${
                errors.capitain ? 'border-red-500' : 'border-gray-600'
              }`}
              required
            >
              <option value="">Select Captain</option>
              {accounts.map(account => (
                <option key={account.id_compte} value={account.id_compte}>
                  {account.nom} {account.prenom} ({account.email})
                </option>
              ))}
            </select>
            {errors.capitain && <p className="mt-1 text-sm text-red-500">{errors.capitain}</p>}
            {selectedAccount && (
              <div className="mt-2 p-3 bg-gray-700/30 rounded-lg">
                <p className="text-sm text-gray-400">Selected Captain:</p>
                <p className="text-white">{selectedAccount.nom} {selectedAccount.prenom}</p>
                <p className="text-gray-400 text-sm">{selectedAccount.email}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 mb-2">Total Matches</label>
              <input
                type="number"
                value={formData.total_matches}
                onChange={(e) => setFormData({ ...formData, total_matches: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07f468] backdrop-blur-xl"
                min="0"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Rating</label>
              <input
                type="number"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                className="w-full px-4 py-2 bg-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07f468] backdrop-blur-xl"
                min="0"
                max="5"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 mb-2">Starting Time</label>
              <input
                type="time"
                value={formData.starting_time ? formData.starting_time.slice(0, 5) : ''}
                onChange={(e) => setFormData({ ...formData, starting_time: e.target.value + ':00' })}
                className="w-full px-4 py-2 bg-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07f468] backdrop-blur-xl"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Finishing Time</label>
              <input
                type="time"
                value={formData.finishing_time ? formData.finishing_time.slice(0, 5) : ''}
                onChange={(e) => setFormData({ ...formData, finishing_time: e.target.value + ':00' })}
                className="w-full px-4 py-2 bg-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07f468] backdrop-blur-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 mb-2">Misses</label>
              <input
                type="number"
                value={formData.misses}
                onChange={(e) => {
                  const misses = parseInt(e.target.value) || 0;
                  const total = parseInt(formData.total_invites) || 0;
                  const validMisses = Math.min(misses, total);
                  setFormData(prev => ({
                    ...prev,
                    misses: validMisses,
                    invites_refused: validMisses,
                    invites_accepted: Math.max(0, total - validMisses)
                  }));
                }}
                className="w-full px-4 py-2 bg-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07f468] backdrop-blur-xl"
                min="0"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Total Invites</label>
              <input
                type="number"
                value={formData.total_invites}
                onChange={(e) => {
                  const total = parseInt(e.target.value) || 0;
                  const misses = parseInt(formData.misses) || 0;
                  const validMisses = Math.min(misses, total);
                  setFormData(prev => ({
                    ...prev,
                    total_invites: total,
                    misses: validMisses,
                    invites_refused: validMisses,
                    invites_accepted: Math.max(0, total - validMisses)
                  }));
                }}
                className="w-full px-4 py-2 bg-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07f468] backdrop-blur-xl"
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 mb-2">
              <p className="text-sm text-gray-400 italic">These values are automatically calculated based on Total Invites and Misses</p>
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Invites Accepted</label>
              <input
                type="number"
                value={formData.invites_accepted}
                readOnly
                className="w-full px-4 py-2 bg-gray-800/50 text-gray-400 rounded-lg focus:outline-none backdrop-blur-xl cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-2">Invites Refused</label>
              <input
                type="number"
                value={formData.invites_refused}
                readOnly
                className="w-full px-4 py-2 bg-gray-800/50 text-gray-400 rounded-lg focus:outline-none backdrop-blur-xl cursor-not-allowed"
              />
            </div>
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
              disabled={!selectedAccount || loading}
              className={`px-6 py-2 ${!selectedAccount || loading ? 'bg-gray-500' : 'bg-[#07f468]'} text-gray-900 rounded-lg font-bold hover:bg-[#06d35a] transition-colors flex items-center gap-2`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                  Loading...
                </>
              ) : (
                team ? 'Update' : 'Create'
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

const PlayerRequestModal = ({ request, onClose, onSave, players }) => {
  const [formData, setFormData] = useState({
    sender: request?.sender || '',
    receiver: request?.receiver || '',
    match_date: request?.match_date ? format(parseISO(request.match_date), 'yyyy-MM-dd') : '',
    starting_time: request?.starting_time ? format(parseISO(request.starting_time), 'HH:mm') : '',
    message: request?.message || ''
  });
  const [errors, setErrors] = useState({});
  const showNotification = useNotification();

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validatePlayerRequestForm(formData);
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    // Create a copy of formData with properly formatted datetime
    const submissionData = {
      ...formData,
      // Format the time to include seconds
      starting_time: formData.starting_time + ':00'
    };

    onSave(submissionData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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
          <MessageSquare className="w-8 h-8 text-[#07f468]" />
          {request ? 'Edit Request' : 'New Player Request'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Sender Selection */}
          <div>
            <label className="block text-gray-400 mb-2">Sender</label>
            <select
              name="sender"
              value={formData.sender}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 bg-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07f468] backdrop-blur-xl ${
                errors.sender ? 'border-red-500' : 'border-gray-600'
              }`}
            >
              <option value="">Select Sender</option>
              {players.map((player) => (
                <option key={player.id_player} value={player.id_player}>
                  {player.compte.nom} {player.compte.prenom}
                </option>
              ))}
            </select>
            {errors.sender && <p className="text-sm text-red-500 mt-1">{errors.sender}</p>}
          </div>

          {/* Receiver Selection */}
          <div>
            <label className="block text-gray-400 mb-2">Receiver</label>
            <select
              name="receiver"
              value={formData.receiver}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 bg-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07f468] backdrop-blur-xl ${
                errors.receiver ? 'border-red-500' : 'border-gray-600'
              }`}
            >
              <option value="">Select Receiver</option>
              {players.map((player) => (
                <option key={player.id_player} value={player.id_player}>
                  {player.compte.nom} {player.compte.prenom}
                </option>
              ))}
            </select>
            {errors.receiver && <p className="text-sm text-red-500 mt-1">{errors.receiver}</p>}
          </div>

          {/* Match Date */}
          <div>
            <label className="block text-gray-400 mb-2">Match Date</label>
            <input
              type="date"
              name="match_date"
              value={formData.match_date}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 bg-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07f468] backdrop-blur-xl ${
                errors.match_date ? 'border-red-500' : 'border-gray-600'
              }`}
            />
            {errors.match_date && <p className="text-sm text-red-500 mt-1">{errors.match_date}</p>}
          </div>

          {/* Starting Time */}
          <div>
            <label className="block text-gray-400 mb-2">Starting Time</label>
            <input
              type="time"
              name="starting_time"
              value={formData.starting_time}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 bg-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07f468] backdrop-blur-xl ${
                errors.starting_time ? 'border-red-500' : 'border-gray-600'
              }`}
            />
            {errors.starting_time && <p className="text-sm text-red-500 mt-1">{errors.starting_time}</p>}
          </div>

          {/* Message */}
          <div>
            <label className="block text-gray-400 mb-2">Message (Optional)</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 bg-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07f468] backdrop-blur-xl ${
                errors.message ? 'border-red-500' : 'border-gray-600'
              }`}
              maxLength={50}
              rows={3}
              placeholder="Enter a message (max 50 characters)"
            />
            <div className="flex justify-between mt-1">
              <p className={`text-sm ${formData.message?.length >= 45 ? 'text-red-500' : 'text-gray-400'}`}>
                {formData.message?.length || 0}/50 characters
              </p>
              {errors.message && <p className="text-sm text-red-500">{errors.message}</p>}
            </div>
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
              {request ? 'Update' : 'Create'}
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
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [playerToDelete, setPlayerToDelete] = useState(null);
    const showNotification = useNotification();
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [playerRequests, setPlayerRequests] = useState([]);
    const [showRequests, setShowRequests] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    // Add these new state variables
    const [selectedPlayerForView, setSelectedPlayerForView] = useState(null);
    const [selectedRequestForView, setSelectedRequestForView] = useState(null);
  
    const handleAdd = async (playerData) => {
      try {
        const response = await playersService.createPlayer(playerData);
        setPlayers(prev => [...prev, response.data]);
        showNotification('Player added successfully');
      } catch (error) {
        console.error('Error adding player:', error);
        showNotification('Failed to add player', 'error');
      }
    };
  
    const handleUpdate = async (id, playerData) => {
      try {
        const response = await playersService.updatePlayer(id, playerData);
        setPlayers(prev => prev.map(p => p.id_player === id ? response.data : p));
        showNotification('Player updated successfully');
      } catch (error) {
        console.error('Error updating player:', error);
        showNotification('Failed to update player', 'error');
      }
    };
  
    const handleDelete = async (id) => {
      try {
        await playersService.deletePlayer(id);
        setPlayers(prev => prev.filter(p => p.id_player !== id));
        showNotification('Player deleted successfully');
      } catch (error) {
        console.error('Error deleting player:', error);
        showNotification('Failed to delete player', 'error');
      }
    };
  
    const filteredPlayers = players.filter(player => {
      const matchesSearch = 
        (player.compte?.nom?.toLowerCase().includes(searchQuery.toLowerCase()) || 
         player.compte?.prenom?.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesSearch;
    });
  
    // Fetch player requests
    useEffect(() => {
      const fetchRequests = async () => {
        try {
          setLoading(true);
          const response = await playerRequestsService.getAllPlayerRequests();
          setPlayerRequests(response.data || []);
        } catch (error) {
          console.error('Error fetching player requests:', error);
          showNotification('Failed to load player requests', 'error');
        } finally {
          setLoading(false);
        }
      };
  
      fetchRequests();
    }, []);
  
    const handleAddRequest = async (requestData) => {
      try {
        // Ensure time format is correct
        const formattedData = {
          ...requestData,
          starting_time: requestData.starting_time.includes(':00') ? 
            requestData.starting_time : 
            requestData.starting_time + ':00'
        };
        
        const response = await playerRequestsService.createPlayerRequest(formattedData);
        setPlayerRequests(prev => [...prev, response.data]);
        showNotification('Player request added successfully');
        setShowRequestModal(false);
      } catch (error) {
        console.error('Error adding player request:', error);
        showNotification('Failed to add player request', 'error');
      }
    };
  
    const handleUpdateRequest = async (id, requestData) => {
      try {
        // Ensure time format is correct
        const formattedData = {
          ...requestData,
          starting_time: requestData.starting_time.includes(':00') ? 
            requestData.starting_time : 
            requestData.starting_time + ':00'
        };
        
        const response = await playerRequestsService.updatePlayerRequest(id, formattedData);
        setPlayerRequests(prev => prev.map(r => r.id_request === id ? response.data : r));
        showNotification('Player request updated successfully');
        setShowRequestModal(false);
        setSelectedRequest(null);
      } catch (error) {
        console.error('Error updating player request:', error);
        showNotification('Failed to update player request', 'error');
      }
    };
  
    const handleDeleteRequest = async (id) => {
      try {
        await playerRequestsService.deletePlayerRequest(id);
        setPlayerRequests(prev => prev.filter(r => r.id_request !== id)); // Changed from r.id to r.id_request
        showNotification('Player request deleted successfully');
        setIsDeleteModalOpen(false);
      } catch (error) {
        console.error('Error deleting player request:', error);
        showNotification('Failed to delete player request', 'error');
      }
    };
  
    const handleStatusUpdate = async (id, status) => {
      try {
        const response = await playerRequestsService.updateRequestStatus(id, status);
        setPlayerRequests(prev => prev.map(r => r.id_request === id ? response.data : r));
        showNotification(`Request ${status} successfully`);
      } catch (error) {
        console.error('Error updating request status:', error);
        showNotification(`Failed to update request status to ${status}`, 'error');
      }
    };
  
    return (
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-6"
      >
        {/* Search and Actions */}
        <div className="flex flex-col gap-4">
          {/* Search Bar */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search players..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07f468] backdrop-blur-xl"
              />
            </div>
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={async () => {
                try {
                  setLoading(true);
                  const [playersResponse, requestsResponse] = await Promise.all([
                    playersService.getAllPlayers({
                      include: 'compte,ratings',
                      sort_by: 'rating',
                      sort_order: 'desc'
                    }),
                    playerRequestsService.getAllPlayerRequests()
                  ]);
                  setPlayers(playersResponse.data || []);
                  setPlayerRequests(requestsResponse.data || []);
                  showNotification('Data refreshed successfully');
                } catch (error) {
                  console.error('Error refreshing data:', error);
                  showNotification('Failed to refresh data', 'error');
                } finally {
                  setLoading(false);
                }
              }}
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </motion.button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => setShowAddModal(true)}
              className="flex-1 sm:flex-none bg-[#07f468] text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-[#06d35a] transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Player</span>
            </motion.button>
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => setShowRequestModal(true)}
              className="flex-1 sm:flex-none bg-[#07f468] text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-[#06d35a] transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-5 h-5" />
              <span>New Request</span>
            </motion.button>
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => setShowRequests(!showRequests)}
              className={`flex-1 sm:flex-none px-6 py-3 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center gap-2 ${
                showRequests ? 'bg-[#07f468] text-gray-900' : 'bg-gray-700 text-white'
              }`}
            >
              <Eye className="w-5 h-5" />
              <span>{showRequests ? 'Hide Requests' : 'Show Requests'}</span>
            </motion.button>
          </div>
        </div>
  
        {/* Requests Table */}
        {showRequests && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-lg border border-gray-700/50 bg-gray-800/50 backdrop-blur-xl z-30 relative"
          >
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 border-4 border-[#07f468] border-t-transparent rounded-full"
                />
              </div>
            ) : playerRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-gray-400">
                <Calendar className="w-12 h-12 mb-2 text-gray-500" />
                <p className="text-lg font-medium">No requests found</p>
                <p className="text-sm">Player requests will appear here</p>
              </div>
            ) : (
              <div className="w-full divide-y divide-gray-700">
                <table className="w-full table-auto relative z-30">
                  <thead className="bg-gray-800/50 relative z-30">
                    <tr>
                      {/* Always visible columns */}
                      <th className="w-20 sm:w-auto px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Sender
                      </th>
                      <th className="w-20 sm:w-auto px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Receiver
                      </th>
                      {/* Hidden on mobile */}
                      <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Match Date
                      </th>
                      <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Starting Time
                      </th>
                      <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Message
                      </th>
                      <th className="w-14 sm:w-auto px-2 sm:px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800/30 divide-y divide-gray-700">
                    {playerRequests.map((request, index) => {
                      const sender = players.find(p => p.id_player === request.sender);
                      const receiver = players.find(p => p.id_player === request.receiver);
                      
                      return (
                        <motion.tr 
                          key={request.id_request}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="hover:bg-gray-700/50 transition-colors"
                        >
                          {/* Always visible columns */}
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10">
                                <div className="h-full w-full rounded-full bg-gray-700 flex items-center justify-center">
                                  <User className="h-3 w-3 sm:h-4 sm:w-4 md:h-6 md:w-6 text-gray-400" />
                                </div>
                              </div>
                              <div className="ml-1 sm:ml-2 md:ml-4">
                                <div className="text-xs sm:text-sm font-medium text-white truncate max-w-[60px] sm:max-w-xs">
                                  {sender ? `${sender.compte.nom}` : 'Unknown'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10">
                                <div className="h-full w-full rounded-full bg-gray-700 flex items-center justify-center">
                                  <User className="h-3 w-3 sm:h-4 sm:w-4 md:h-6 md:w-6 text-gray-400" />
                                </div>
                              </div>
                              <div className="ml-1 sm:ml-2 md:ml-4">
                                <div className="text-xs sm:text-sm font-medium text-white truncate max-w-[60px] sm:max-w-xs">
                                  {receiver ? `${receiver.compte.nom}` : 'Unknown'}
                                </div>
                              </div>
                            </div>
                          </td>
                          {/* Hidden on mobile */}
                          <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-white">{formatDate(request.match_date)}</div>
                          </td>
                          <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-white">{formatTime(request.starting_time)}</div>
                          </td>
                          <td className="hidden md:table-cell px-6 py-4">
                            <div className="text-sm text-white truncate max-w-[200px]">
                              {request.message || '-'}
                            </div>
                          </td>
                          <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-2">
                              <ActionMenu
                                items={[
                                  {
                                    label: 'View Details',
                                    icon: <Eye className="w-4 h-4" />,
                                    onClick: () => setSelectedRequestForView(request)
                                  },
                                  {
                                    label: 'Accept',
                                    icon: <Check className="w-4 h-4" />,
                                    onClick: () => handleStatusUpdate(request.id_request, 'accepted'),
                                    className: 'text-green-500 hover:text-green-400',
                                    disabled: request.status !== 'pending'
                                  },
                                  {
                                    label: 'Reject',
                                    icon: <X className="w-4 h-4" />,
                                    onClick: () => handleStatusUpdate(request.id_request, 'rejected'),
                                    className: 'text-red-500 hover:text-red-400',
                                    disabled: request.status !== 'pending'
                                  },
                                  {
                                    label: 'Edit',
                                    icon: <Edit className="w-4 h-4" />,
                                    onClick: () => {
                                      setSelectedRequest(request);
                                      setShowRequestModal(true);
                                    }
                                  },
                                  {
                                    label: 'Delete',
                                    icon: <Trash2 className="w-4 h-4" />,
                                    onClick: () => {
                                      setPlayerToDelete(request);
                                      setIsDeleteModalOpen(true);
                                    },
                                    className: 'text-red-500 hover:text-red-400'
                                  }
                                ]}
                              />
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}
  
        {/* Players Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredPlayers.length > 0 ? (
              filteredPlayers.map((player) => (
                <motion.div
                  key={player.id_player}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl overflow-hidden backdrop-blur-xl border border-gray-700/50"
                >
                  {/* Player Card Content */}
                  <div className="relative h-48">
                    <img
                      src={player.compte?.pfp ? `http://127.0.0.1:8000/${player.compte.pfp}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(player.compte?.nom + ' ' + player.compte?.prenom)}&background=random`}
                      alt={player.compte?.nom}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white truncate">
                        {player.compte?.nom} {player.compte?.prenom}
                      </h3>
                      <p className="text-gray-300 truncate">{player.position}</p>
                    </div>
                  </div>

                  <div className="p-4 space-y-4">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-gray-800/30 rounded-lg p-3">
                        <p className="text-gray-400 text-xs">Total Matches</p>
                        <p className="text-white font-medium">{player.total_matches || 0}</p>
                      </div>
                      <div className="bg-gray-800/30 rounded-lg p-3">
                        <p className="text-gray-400 text-xs">Rating</p>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-[#07f468]" />
                          <p className="text-white font-medium">{player.rating || 0}/5</p>
                        </div>
                      </div>
                      <div className="bg-gray-800/30 rounded-lg p-3">
                        <p className="text-gray-400 text-xs">Accepted</p>
                        <p className="text-white font-medium">{player.invites_accepted || 0}</p>
                      </div>
                      <div className="bg-gray-800/30 rounded-lg p-3">
                        <p className="text-gray-400 text-xs">Refused</p>
                        <p className="text-white font-medium">{player.invites_refused || 0}</p>
                      </div>
                    </div>

                    {/* Active Hours */}
                    <div className="bg-gray-800/30 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <p className="text-gray-400 text-xs">Active Hours</p>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-[#07f468]">{player.starting_time || 'N/A'}</span>
                          <span className="text-gray-400">-</span>
                          <span className="text-[#07f468]">{player.finishing_time || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => setSelectedPlayer(player)}
                        className="flex-1 bg-[#07f468] text-gray-900 py-2 rounded-lg font-medium hover:bg-[#06d35a] transition-colors flex items-center justify-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </motion.button>
                      <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => {
                          setPlayerToDelete(player);
                          setIsDeleteModalOpen(true);
                        }}
                        className="flex-1 bg-red-500 text-white py-2 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full flex flex-col items-center justify-center h-64 text-gray-400"
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
          onClose={() => {
            setIsDeleteModalOpen(false);
            setPlayerToDelete(null);
          }}
          onConfirm={() => {
            if (playerToDelete) {
              if (playerToDelete.id_request) {
                // It's a player request
                handleDeleteRequest(playerToDelete.id_request);
              } else {
                // It's a player
                handleDelete(playerToDelete.id_player);
              }
            }
            setIsDeleteModalOpen(false);
            setPlayerToDelete(null);
          }}
          itemName={playerToDelete ? 
            playerToDelete.id_request ? 
              `request from ${players.find(p => p.id_player === playerToDelete.sender)?.compte?.nom || 'Unknown'} to ${players.find(p => p.id_player === playerToDelete.receiver)?.compte?.nom || 'Unknown'}` 
              : `${playerToDelete.compte?.nom} ${playerToDelete.compte?.prenom}` 
            : "this item"}
        />
  
        {/* Player Modal */}
        <AnimatePresence>
          {(showAddModal || selectedPlayer) && (
            <PlayerModal
              player={selectedPlayer}
              teams={teams}
              players={players}
              onClose={() => {
                setShowAddModal(false);
                setSelectedPlayer(null);
              }}
              onSave={(playerData) => {
                if (selectedPlayer) {
                  handleUpdate(selectedPlayer.id_player, playerData);
                } else {
                  handleAdd(playerData);
                }
                setShowAddModal(false);
                setSelectedPlayer(null);
              }}
            />
          )}
        </AnimatePresence>
  
        {/* Player Request Modal */}
        <AnimatePresence>
          {(showRequestModal || selectedRequest) && (
            <PlayerRequestModal
              request={selectedRequest}
              players={players}
              onClose={() => {
                setShowRequestModal(false);
                setSelectedRequest(null);
              }}
              onSave={(requestData) => {
                if (selectedRequest) {
                  handleUpdateRequest(selectedRequest.id_request, requestData);
                } else {
                  handleAddRequest(requestData);
                }
              }}
            />
          )}
        </AnimatePresence>

        <ViewDetailsModal
          isOpen={!!selectedPlayerForView}
          onClose={() => setSelectedPlayerForView(null)}
          data={selectedPlayerForView}
          type="player"
        />

        <ViewDetailsModal
          isOpen={!!selectedRequestForView}
          onClose={() => setSelectedRequestForView(null)}
          data={selectedRequestForView}
          type="request"
        />
      </motion.div>
    );
  };
  const TeamsSection = ({ teams, setTeams }) => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [teamToDelete, setTeamToDelete] = useState(null);
    const [loading, setLoading] = useState(false);
    const showNotification = useNotification();
    const [selectedTeamForView, setSelectedTeamForView] = useState(null);
  
    const handleAdd = async (teamData) => {
      try {
        const response = await teamsService.createTeam(teamData);
        setTeams(prev => [...prev, response.data]);
        showNotification('Team added successfully');
      } catch (error) {
        console.error('Error adding team:', error);
        showNotification('Failed to add team', 'error');
      }
    };
  
    const handleUpdate = async (id, teamData) => {
      try {
        const response = await teamsService.updateTeam(id, teamData);
        setTeams(prev => prev.map(t => t.id_teams === id ? response.data : t));
        showNotification('Team updated successfully');
      } catch (error) {
        console.error('Error updating team:', error);
        showNotification('Failed to update team', 'error');
      }
    };
  
    const handleDelete = async (id) => {
      try {
        await teamsService.deleteTeam(id);
        setTeams(prev => prev.filter(t => t.id_teams !== id));
        showNotification('Team deleted successfully');
      } catch (error) {
        console.error('Error deleting team:', error);
        showNotification('Failed to delete team', 'error');
      }
    };
  
    const filteredTeams = teams.filter(team =>
      team.captain?.nom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.captain?.prenom?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
    return (
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-6"
      >
        {/* Search and Actions */}
        <div className="flex flex-col gap-4">
          {/* Search Bar */}
          <div className="flex gap-4">
            <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search teams by captain name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07f468] backdrop-blur-xl"
            />
          </div>
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={async () => {
              try {
                setLoading(true);
                const response = await teamsService.getAllTeams({
                  include: 'captain,ratings',
                  sort_by: 'rating',
                  sort_order: 'desc'
                });
                setTeams(response.data || []);
                showNotification('Teams refreshed successfully');
              } catch (error) {
                console.error('Error refreshing teams:', error);
                showNotification('Failed to refresh teams', 'error');
              } finally {
                setLoading(false);
              }
            }}
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center gap-2"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </motion.button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => setShowAddModal(true)}
              className="flex-1 sm:flex-none bg-[#07f468] text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-[#06d35a] transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Team</span>
          </motion.button>
          </div>
        </div>
  
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {loading ? (
              // Loading skeleton cards
              [...Array(8)].map((_, i) => (
                <motion.div
                  key={`skeleton-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-xl overflow-hidden backdrop-blur-xl border border-gray-700/30 h-[420px]"
                >
                  <div className="animate-pulse">
                    <div className="h-48 bg-gray-700/50"></div>
                    <div className="p-4 space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        {[...Array(4)].map((_, j) => (
                          <div key={j} className="bg-gray-700/40 rounded-lg p-3 h-16"></div>
                        ))}
                      </div>
                      <div className="bg-gray-700/40 rounded-lg p-3 h-12"></div>
                      <div className="flex gap-2">
                        <div className="flex-1 bg-gray-700/40 rounded-lg p-3 h-10"></div>
                        <div className="flex-1 bg-gray-700/40 rounded-lg p-3 h-10"></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : filteredTeams.length > 0 ? (
              filteredTeams.map((team) => (
                <motion.div
                  key={team.id_teams}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl overflow-hidden backdrop-blur-xl border border-gray-700/50"
                >
                  {/* Team Card Content */}
                  <div className="relative h-48">
                    <img
                      src={team.captain?.pfp ? `http://127.0.0.1:8000/${team.captain.pfp}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(team.captain?.nom + ' ' + team.captain?.prenom)}&background=random`}
                      alt={team.captain?.nom}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white truncate">
                        {team.captain?.nom} {team.captain?.prenom}'s Team
                      </h3>
                      <p className="text-gray-300 truncate">Captain</p>
                    </div>
                  </div>

                  <div className="p-4 space-y-4">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-gray-800/30 rounded-lg p-3">
                        <p className="text-gray-400 text-xs">Total Matches</p>
                        <p className="text-white font-medium">{team.total_matches || 0}</p>
                      </div>
                      <div className="bg-gray-800/30 rounded-lg p-3">
                        <p className="text-gray-400 text-xs">Rating</p>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-[#07f468]" />
                          <p className="text-white font-medium">{team.rating || 0}/5</p>
                        </div>
                      </div>
                      <div className="bg-gray-800/30 rounded-lg p-3">
                        <p className="text-gray-400 text-xs">Accepted</p>
                        <p className="text-white font-medium">{team.invites_accepted || 0}</p>
                      </div>
                      <div className="bg-gray-800/30 rounded-lg p-3">
                        <p className="text-gray-400 text-xs">Refused</p>
                        <p className="text-white font-medium">{team.invites_refused || 0}</p>
                      </div>
                    </div>

                    {/* Active Hours */}
                    <div className="bg-gray-800/30 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <p className="text-gray-400 text-xs">Active Hours</p>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-[#07f468]">{team.starting_time || 'N/A'}</span>
                          <span className="text-gray-400">-</span>
                          <span className="text-[#07f468]">{team.finishing_time || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => setSelectedTeam(team)}
                        className="flex-1 bg-[#07f468] text-gray-900 py-2 rounded-lg font-medium hover:bg-[#06d35a] transition-colors flex items-center justify-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </motion.button>
                      <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => {
                          setTeamToDelete(team);
                          setIsDeleteModalOpen(true);
                        }}
                        className="flex-1 bg-red-500 text-white py-2 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full flex flex-col items-center justify-center h-64 text-gray-400"
              >
                <User className="w-12 h-12 mb-4" />
                <p className="text-lg font-medium">No teams found</p>
                <p className="text-sm">Try adjusting your search criteria</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
  
        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={() => {
            handleDelete(teamToDelete?.id_teams);
            setIsDeleteModalOpen(false);
          }}
          itemName={teamToDelete ? `${teamToDelete.captain?.nom} ${teamToDelete.captain?.prenom}'s team` : "this team"}
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
                  handleUpdate(selectedTeam.id_teams, teamData);
                } else {
                  handleAdd(teamData);
                }
                setShowAddModal(false);
                setSelectedTeam(null);
              }}
            />
          )}
        </AnimatePresence>

        <ViewDetailsModal
          isOpen={!!selectedTeamForView}
          onClose={() => setSelectedTeamForView(null)}
          data={selectedTeamForView}
          type="team"
        />
      </motion.div>
    );
  };

const ActionMenu = ({ items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const [position, setPosition] = useState('right-0');
  
  // Check if menu is overflowing and adjust position
  const checkPosition = () => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const rightOverflow = rect.right > window.innerWidth;
      
      if (rightOverflow) {
        setPosition('right-auto left-0');
      } else {
        setPosition('right-0');
      }
    }
  };
  
  // Check position on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(checkPosition, 0);
    }
  }, [isOpen]);

  return (
    <div className="relative">
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 sm:p-2 bg-gray-700/50 text-gray-400 rounded-lg hover:text-white transition-colors"
      >
        <MoreVertical className="w-3 h-3 sm:w-4 sm:h-4" />
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`absolute ${position} mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-1 z-50`}
          >
            {items.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2 text-left text-white hover:bg-gray-700 flex items-center gap-2 ${item.className || ''}`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PlayerActions = ({ player, onEdit, onDelete, setSelectedRequestForView }) => {
  const showNotification = useNotification();

  const handleViewDetails = () => {
    if (setSelectedRequestForView) {
      // Only call if the function is provided
      setSelectedRequestForView(player);
    } else {
      // Fallback behavior when the function is not provided
      showNotification('View details functionality is not available', 'info');
    }
  };

  return (
    <div className="flex gap-2">
      <ActionMenu
        items={[
          {
            label: 'View Details',
            icon: <Eye className="w-4 h-4" />,
            onClick: handleViewDetails
          },
          {
            label: 'Edit',
            icon: <Edit className="w-4 h-4" />,
            onClick: onEdit,
            className: 'text-gray-400 hover:text-white'
          },
          {
            label: 'Delete',
            icon: <Trash2 className="w-4 h-4" />,
            onClick: onDelete,
            className: 'text-red-500 hover:text-red-400'
          }
        ]}
      />
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

const validatePlayerForm = (data) => {
  const errors = {};
  
  if (!data.id_compte) errors.id_compte = 'Account is required';
  if (!data.position) errors.position = 'Position is required';
  if (data.total_matches < 0) errors.total_matches = 'Total matches cannot be negative';
  if (data.rating < 0 || data.rating > 5) errors.rating = 'Rating must be between 0 and 5';
  if (!data.starting_time) errors.starting_time = 'Starting time is required';
  if (!data.finishing_time) errors.finishing_time = 'Finishing time is required';
  if (data.misses > data.total_invites) errors.misses = 'Misses cannot exceed total invites';
  
  return errors;
};

const validateTeamForm = (data) => {
  const errors = {};
  
  if (!data.capitain) errors.capitain = 'Captain is required';
  if (data.total_matches < 0) errors.total_matches = 'Total matches cannot be negative';
  if (data.rating < 0 || data.rating > 5) errors.rating = 'Rating must be between 0 and 5';
  if (!data.starting_time) errors.starting_time = 'Starting time is required';
  if (!data.finishing_time) errors.finishing_time = 'Finishing time is required';
  if (data.misses > data.total_invites) errors.misses = 'Misses cannot exceed total invites';
  
  return errors;
};

const validatePlayerRequestForm = (data) => {
  const errors = {};
  
  if (!data.sender) errors.sender = 'Sender is required';
  if (!data.receiver) errors.receiver = 'Receiver is required';
  if (data.sender === data.receiver) errors.receiver = 'Sender and receiver must be different';
  if (!data.match_date) errors.match_date = 'Match date is required';
  if (!data.starting_time) errors.starting_time = 'Starting time is required';
  
  const matchDate = new Date(data.match_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (matchDate <= today) {
    errors.match_date = 'Match date must be in the future';
  }
  
  return errors;
};

const ViewDetailsModal = ({ isOpen, onClose, data, type }) => {
  const showNotification = useNotification();
  
  const handleStatusUpdate = async (status) => {
    try {
      await playerRequestsService.updateRequestStatus(data.id_request, status);
      showNotification(`Request ${status} successfully`);
      onClose();
    } catch (error) {
      console.error('Error updating request status:', error);
      showNotification(`Failed to update request status to ${status}`, 'error');
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white">
            {type === 'player' && 'Player Details'}
            {type === 'team' && 'Team Details'}
            {type === 'request' && 'Request Details'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          {type === 'request' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <DetailItem label="Match Date" value={formatDate(data.match_date)} />
                <DetailItem label="Time" value={formatTime(data.starting_time)} />
              </div>
              <DetailItem 
                label="Message" 
                value={
                  <div className="max-h-20 overflow-y-auto">
                    {data.message || 'No message'}
                  </div>
                } 
              />
              <DetailItem 
                label="Status" 
                value={
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    data.status === 'accepted' ? 'bg-green-100 text-green-800' :
                    data.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    data.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                    data.status === 'expired' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {data.status || 'pending'}
                  </span>
                } 
              />
              
              {data.status === 'pending' && (
                <div className="flex gap-2 mt-4">
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => handleStatusUpdate('accepted')}
                    className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Accept
                  </motion.button>
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => handleStatusUpdate('rejected')}
                    className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Reject
                  </motion.button>
                </div>
              )}
            </>
          )}

          {type === 'player' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <DetailItem label="Position" value={data.position} />
                <DetailItem label="Rating" value={`${data.rating}/5`} />
                <DetailItem label="Total Matches" value={data.total_matches} />
                <DetailItem label="Status" value={data.status} />
                <DetailItem label="Invites Accepted" value={data.invites_accepted} />
                <DetailItem label="Invites Refused" value={data.invites_refused} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <DetailItem label="Starting Time" value={data.starting_time} />
                <DetailItem label="Finishing Time" value={data.finishing_time} />
              </div>
            </>
          )}

          {type === 'team' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <DetailItem label="Total Matches" value={data.total_matches} />
                <DetailItem label="Rating" value={`${data.rating}/5`} />
                <DetailItem label="Invites Accepted" value={data.invites_accepted} />
                <DetailItem label="Invites Refused" value={data.invites_refused} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <DetailItem label="Starting Time" value={data.starting_time} />
                <DetailItem label="Finishing Time" value={data.finishing_time} />
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const DetailItem = ({ label, value }) => (
  <div className="bg-gray-800/30 rounded-lg p-3">
    <p className="text-gray-400 text-sm">{label}</p>
    <p className="text-white font-medium">{value}</p>
  </div>
);

// Add these utility functions at the top level
const formatDate = (dateString) => {
  try {
    return format(parseISO(dateString), 'MMM dd, yyyy');
  } catch (error) {
    return dateString;
  }
};

const formatTime = (timeString) => {
  try {
    return format(parseISO(timeString), 'HH:mm');
  } catch (error) {
    return timeString;
  }
};
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Users, Calendar, DollarSign, Award, Shield, 
  Edit, Trash2, Plus, Search, Filter, Eye, Download, 
  Upload, BarChart2, User, X
} from 'lucide-react';
import { CSVLink } from 'react-csv';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import tournoiService from '../../lib/services/admin/tournoiService';
import matchesService from '../../lib/services/admin/matchesService';
import tournoiTeamsService from '../../lib/services/admin/tournoiTeamsService';
import { useNotification } from '../../contexts/NotificationContext';
import { NotificationProvider } from '../../contexts/NotificationContext';
import { STAGES } from '../../lib/constants/tournamentConstants';
import compteService from '../../lib/services/admin/compteServices';
import stagesService from '../../lib/services/admin/stagesService';

const COLORS = ['#07f468', '#00c4ff', '#ff0099', '#ffbb28'];

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const EnhancedTournamentManagement = () => {
  const [view, setView] = useState('tournaments'); // 'tournaments', 'teams', 'matches'
  const [showStats, setShowStats] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [tournaments, setTournaments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [stages, setStages] = useState([]);
  const showNotification = useNotification();

  useEffect(() => {
    fetchTournaments();
  }, []);

  useEffect(() => {
    if (selectedTournament) {
      fetchTeams();
      fetchMatches();
    }
  }, [selectedTournament]);

  useEffect(() => {
    const fetchStages = async () => {
      try {
        const response = await stagesService.getAllStages();
        setStages(response.data);
      } catch (error) {
        console.error('Error fetching stages:', error);
        showNotification('Failed to fetch stages', 'error');
      }
    };
    fetchStages();
  }, []);

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      const response = await tournoiService.getAllTournois();
      setTournaments(response.data);
    } catch (error) {
      console.error('Error fetching tournaments:', error);
      showNotification('Failed to fetch tournaments', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    if (!selectedTournament) return;
    try {
      const response = await tournoiTeamsService.getAllTeams({
        id_tournoi: selectedTournament.id_tournoi
      });
      setTeams(response.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
      showNotification('Failed to fetch teams', 'error');
    }
  };

  const fetchMatches = async () => {
    if (!selectedTournament) return;
    try {
      const response = await matchesService.getAllMatches({
        id_tournoi: selectedTournament.id_tournoi
      });
      setMatches(response.data);
    } catch (error) {
      console.error('Error fetching matches:', error);
      showNotification('Failed to fetch matches', 'error');
    }
  };

  // Stats calculations
  const tournamentStats = {
    byType: [
      { name: '5v5', value: tournaments.filter(t => t.type === '5v5').length },
      { name: '6v6', value: tournaments.filter(t => t.type === '6v6').length },
      { name: '7v7', value: tournaments.filter(t => t.type === '7v7').length },
      
    ],
    byStatus: [
      { name: 'Upcoming', value: tournaments.filter(t => new Date(t.date_debut) > new Date()).length },
      { name: 'Ongoing', value: tournaments.filter(t => {
        const now = new Date();
        return new Date(t.date_debut) <= now && new Date(t.date_fin) >= now;
      }).length },
      { name: 'Completed', value: tournaments.filter(t => new Date(t.date_fin) < new Date()).length },
    ]
  };

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
      className="min-h-screen rounded-2xl md:rounded-3xl bg-gray-900 text-white p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-6"
    >
      {/* Header Section with responsive classes */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 md:gap-4 bg-gradient-to-r from-gray-800/80 to-gray-900/80 p-3 sm:p-4 md:p-6 rounded-xl shadow-lg backdrop-blur-xl border border-gray-700/50">
        <motion.h1 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="text-xl sm:text-2xl md:text-3xl font-bold bg-[#07f468] bg-clip-text text-transparent flex items-center gap-2 md:gap-3"
        >
          <Trophy className="text-[#07f468] w-6 h-6 sm:w-8 sm:h-8" />
          Tournament Management
        </motion.h1>

        {/* Action Buttons with responsive sizing */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Stats Button */}
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

          {/* View Selection Buttons */}
          <div className="flex items-center gap-2">
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => setView('tournaments')}
              className={`p-2 sm:px-4 sm:py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                view === 'tournaments' ? 'bg-[#07f468] text-gray-900' : 'bg-gray-700 text-white'
              }`}
            >
              <Trophy className="w-5 h-5" />
              <span className="hidden sm:inline">Tournaments</span>
            </motion.button>

            {selectedTournament && (
              <>
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

                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => setView('matches')}
                  className={`p-2 sm:px-4 sm:py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    view === 'matches' ? 'bg-[#07f468] text-gray-900' : 'bg-gray-700 text-white'
                  }`}
                >
                  <Calendar className="w-5 h-5" />
                  <span className="hidden sm:inline">Matches</span>
                </motion.button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      {showStats && (
        <StatsSection 
          tournamentStats={tournamentStats}
          selectedTournament={selectedTournament}
          teams={teams}
          matches={matches}
        />
      )}

      {/* Main Content */}
      <motion.div 
        variants={staggerContainer}
        initial="initial"
        animate="animate" 
        className="space-y-8"
      >
        {view === 'tournaments' && (
          <TournamentSection 
            tournaments={tournaments}
            setTournaments={setTournaments}
            onSelectTournament={setSelectedTournament}
            selectedTournament={selectedTournament}
          />
        )}

        {view === 'teams' && selectedTournament && (
          <TeamSection 
            teams={teams}
            setTeams={setTeams}
            tournamentId={selectedTournament.id_tournoi}
          />
        )}

        {view === 'matches' && selectedTournament && (
          <MatchSection 
            matches={matches}
            setMatches={setMatches}
            tournamentId={selectedTournament.id_tournoi}
            teams={teams}
            tournaments={tournaments}
          />
        )}
      </motion.div>
    </motion.div>
  );
};

// Header component (unchanged)
const Header = () => (
  <header className="text-center">
    <motion.h1 
      className="text-4xl md:text-5xl font-bold mb-4"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      Tournament Management
    </motion.h1>
    <motion.p 
      className="text-lg md:text-xl text-gray-400"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >      
    </motion.p>
  </header>
);

// Utility components (unchanged)
const SectionTitle = ({ icon: Icon, title }) => (
  <div className="flex items-center mb-6">
    <div className="bg-green-500 p-3 rounded-full mr-4">
      <Icon className="w-6 h-6 text-gray-900" />
    </div>
    <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
  </div>
);

const ActionButton = ({ icon: Icon, label, onClick, primary = false }) => (
  <button
    onClick={onClick}
    className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
      primary
        ? "bg-green-500 text-gray-900 hover:bg-green-600"
        : "bg-gray-700 text-white hover:bg-gray-600"
    }`}
  >
    <Icon className="w-4 h-4 mr-2" />
    {label}
  </button>
);

// Modal component with improved UI/UX
const Modal = ({ isOpen, onClose, title, children }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="bg-gray-800/90 backdrop-blur-md rounded-2xl w-full max-w-2xl overflow-hidden shadow-xl border border-gray-700/50"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-700/50">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-[#07f468] to-[#00c4ff] bg-clip-text text-transparent">
              {title}
            </h3>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>

          {/* Modal Content */}
          <div className="p-6 max-h-[calc(100vh-12rem)] overflow-y-auto custom-scrollbar">
            {children}
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// Enhanced form input components
const FormInput = ({ label, id, type = "text", ...props }) => (
  <div className="space-y-2">
    <label htmlFor={id} className="block text-sm font-medium text-gray-300">
      {label}
    </label>
    <motion.input
      whileFocus={{ scale: 1.01 }}
      type={type}
      id={id}
      {...props}
      className="w-full px-4 py-2.5 bg-gray-700/50 border border-gray-600 focus:border-[#07f468] rounded-xl 
                 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#07f468]/20 
                 transition-all duration-200 focus:outline-none"
    />
  </div>
);

const FormTextArea = ({ label, id, ...props }) => (
  <div className="space-y-2">
    <label htmlFor={id} className="block text-sm font-medium text-gray-300">
      {label}
    </label>
    <motion.textarea
      whileFocus={{ scale: 1.01 }}
      id={id}
      {...props}
      className="w-full px-4 py-2.5 bg-gray-700/50 border border-gray-600 focus:border-[#07f468] rounded-xl 
                 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#07f468]/20 
                 transition-all duration-200 focus:outline-none min-h-[100px] resize-y"
    />
  </div>
);

const FormSelect = ({ label, id, options, ...props }) => (
  <div className="space-y-2">
    <label htmlFor={id} className="block text-sm font-medium text-gray-300">
      {label}
    </label>
    <motion.select
      whileFocus={{ scale: 1.01 }}
      id={id}
      {...props}
      className="w-full px-4 py-2.5 bg-gray-700/50 border border-gray-600 focus:border-[#07f468] rounded-xl 
                 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#07f468]/20 
                 transition-all duration-200 focus:outline-none appearance-none"
    >
      <option value="">Select an option</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </motion.select>
  </div>
);

// Enhanced form submit button
const FormSubmitButton = ({ children, loading }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    type="submit"
    disabled={loading}
    className={`w-full px-6 py-3 rounded-xl font-medium text-gray-900 
                bg-gradient-to-r from-[#07f468] to-[#00c4ff] 
                hover:opacity-90 transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2`}
  >
    {loading && (
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full"
      />
    )}
    {children}
  </motion.button>
);

// Add StatsSection component
const StatsSection = ({ tournamentStats, selectedTournament, teams, matches }) => {
  const tournamentTeams = teams.filter(team => team.id_tournoi === selectedTournament?.id_tournoi);
  const tournamentMatches = matches.filter(match => match.id_tournoi === selectedTournament?.id_tournoi);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6"
    >
      {/* Tournament Overview */}
      <div className="bg-gray-800/50 backdrop-blur-sm p-4 md:p-6 rounded-2xl border border-gray-700/50">
        <h3 className="text-lg md:text-xl font-bold mb-4 bg-gradient-to-r from-[#07f468] to-[#00c4ff] bg-clip-text text-transparent">
          Tournament Overview
        </h3>
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          <div className="bg-gray-700/50 p-3 md:p-4 rounded-xl">
            <p className="text-xs md:text-sm text-gray-400">Total Tournaments</p>
            <p className="text-lg md:text-2xl font-bold">{tournamentStats.byType.reduce((acc, curr) => acc + curr.value, 0)}</p>
          </div>
          <div className="bg-gray-700/50 p-3 md:p-4 rounded-xl">
            <p className="text-xs md:text-sm text-gray-400">Active Tournaments</p>
            <p className="text-lg md:text-2xl font-bold">{tournamentStats.byStatus.find(s => s.name === 'Ongoing')?.value || 0}</p>
          </div>
          <div className="bg-gray-700/50 p-3 md:p-4 rounded-xl">
            <p className="text-xs md:text-sm text-gray-400">Total Teams</p>
            <p className="text-lg md:text-2xl font-bold">{teams.length}</p>
          </div>
          <div className="bg-gray-700/50 p-3 md:p-4 rounded-xl">
            <p className="text-xs md:text-sm text-gray-400">Total Matches</p>
            <p className="text-lg md:text-2xl font-bold">{matches.length}</p>
          </div>
        </div>
      </div>

      {/* Selected Tournament Stats */}
      {selectedTournament && (
        <div className="bg-gray-800/50 backdrop-blur-sm p-4 md:p-6 rounded-2xl border border-gray-700/50">
          <h3 className="text-lg md:text-xl font-bold mb-4 bg-gradient-to-r from-[#07f468] to-[#00c4ff] bg-clip-text text-transparent">
            {selectedTournament.name}
          </h3>
          <div className="space-y-3 md:space-y-4">
            <div className="grid grid-cols-3 gap-2 md:gap-4 bg-gray-700/50 p-3 md:p-4 rounded-xl">
              <div>
                <p className="text-xs md:text-sm text-gray-400">Type</p>
                <p className="text-sm md:text-base font-medium">{selectedTournament.type}</p>
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-400">Entry Fee</p>
                <p className="text-sm md:text-base font-medium">${selectedTournament.frais_entree}</p>
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-400">Prize Pool</p>
                <p className="text-sm md:text-base font-medium">${selectedTournament.award}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="bg-gray-700/50 p-3 md:p-4 rounded-xl">
                <p className="text-xs md:text-sm text-gray-400">Registered Teams</p>
                <p className="text-lg md:text-2xl font-bold">{tournamentTeams.length}</p>
              </div>
              <div className="bg-gray-700/50 p-3 md:p-4 rounded-xl">
                <p className="text-xs md:text-sm text-gray-400">Matches Played</p>
                <p className="text-lg md:text-2xl font-bold">
                  {tournamentMatches.filter(m => m.score_team1 !== null && m.score_team2 !== null).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Add TournamentSection component
const TournamentSection = ({ tournaments, setTournaments, onSelectTournament, selectedTournament }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTournamentLocal, setSelectedTournamentLocal] = useState(null);
  const showNotification = useNotification();

  const handleAdd = async (formData) => {
    try {
      setLoading(true);
      const response = await tournoiService.createTournoi(formData);
      setTournaments(prev => [...prev, response.data]);
      showNotification('Tournament created successfully');
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error creating tournament:', error);
      showNotification('Failed to create tournament', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id, formData) => {
    try {
      setLoading(true);
      const response = await tournoiService.updateTournoi(id, formData);
      setTournaments(prev => prev.map(t => 
        t.id_tournoi === id ? response.data : t
      ));
      showNotification('Tournament updated successfully');
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating tournament:', error);
      showNotification('Failed to update tournament', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await tournoiService.deleteTournoi(id);
      setTournaments(prev => prev.filter(t => t.id_tournoi !== id));
      showNotification('Tournament deleted successfully');
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting tournament:', error);
      showNotification('Failed to delete tournament', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTournament = (tournament) => {
    setSelectedTournamentLocal(tournament);
    onSelectTournament(tournament);
  };

  const filteredTournaments = tournaments.filter(tournament =>
    tournament.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tournament.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section>
      <SectionTitle icon={Trophy} title="Tournaments" />
      <div className="bg-gray-700 rounded-2xl p-4 md:p-6 shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center bg-gray-800 rounded-xl px-4 py-2 w-full md:w-auto">
            <Search className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tournaments..."
              className="bg-transparent text-white placeholder-gray-400 focus:outline-none w-full"
            />
          </div>
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center w-full md:w-auto px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 bg-green-500 text-gray-900 hover:bg-green-600"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Tournament
          </motion.button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTournaments.map((tournament) => (
            <TournamentCard
              key={tournament.id_tournoi}
              tournament={tournament}
              isSelected={selectedTournament?.id_tournoi === tournament.id_tournoi}
              onSelect={() => handleSelectTournament(tournament)}
              onView={() => {
                setSelectedTournamentLocal(tournament);
                setIsViewModalOpen(true);
              }}
              onEdit={() => {
                setSelectedTournamentLocal(tournament);
                setIsEditModalOpen(true);
              }}
              onDelete={() => {
                setSelectedTournamentLocal(tournament);
                setIsDeleteModalOpen(true);
              }}
            />
          ))}
        </div>
      </div>

      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="View Tournament">
        {selectedTournamentLocal && <TournamentView tournament={selectedTournamentLocal} />}
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Tournament">
        {selectedTournamentLocal && (
          <TournamentForm
            tournament={selectedTournamentLocal}
            onSubmit={(formData) => handleUpdate(selectedTournamentLocal.id_tournoi, formData)}
          />
        )}
      </Modal>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Tournament">
        <TournamentForm onSubmit={handleAdd} />
      </Modal>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => handleDelete(selectedTournamentLocal?.id_tournoi)}
        itemName="tournament"
      />
    </section>
  );
};

const TournamentCard = ({ tournament, isSelected, onSelect, onView, onEdit, onDelete }) => (
  <motion.div
    className={`bg-gray-800 rounded-xl p-4 md:p-6 hover:shadow-lg transition-all duration-300 border-2 ${
      isSelected ? 'border-[#07f468]' : 'border-transparent'
    }`}
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-xl font-semibold">{tournament.name}</h3>
      <button
        onClick={onSelect}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
          isSelected 
            ? 'bg-[#07f468] text-gray-900' 
            : 'bg-gray-700 text-white hover:bg-gray-600'
        }`}
      >
        {isSelected ? 'Selected' : 'Select'}
      </button>
    </div>
    <p className="text-gray-400 text-sm mb-4">{tournament.description}</p>
    <div className="flex items-center mb-2">
      <Calendar className="w-4 h-4 mr-2 text-green-500" />
      <span className="text-sm">{`${tournament.date_debut} - ${tournament.date_fin}`}</span>
    </div>
    <div className="flex items-center mb-2">
      <Users className="w-4 h-4 mr-2 text-green-500" />
      <span className="text-sm">{`Capacity: ${tournament.capacite}`}</span>
    </div>
    <div className="flex items-center mb-4">
      <Award className="w-4 h-4 mr-2 text-green-500" />
      <span className="text-sm">{`Award: $${tournament.award}`}</span>
    </div>
    <div className="flex justify-between">
      <ActionButton icon={Eye} label="View" onClick={onView} />
      <ActionButton icon={Edit} label="Edit" onClick={onEdit} />
      <ActionButton icon={Trash2} label="Delete" onClick={onDelete} />
    </div>
  </motion.div>
);

const TournamentView = ({ tournament }) => (
  <div className="space-y-4">
    <div>
      <h4 className="text-lg font-semibold">Name</h4>
      <p>{tournament.name}</p>
    </div>
    <div>
      <h4 className="text-lg font-semibold">Description</h4>
      <p>{tournament.description}</p>
    </div>
    <div>
      <h4 className="text-lg font-semibold">Capacity</h4>
      <p>{tournament.capacite}</p>
    </div>
    <div>
      <h4 className="text-lg font-semibold">Type</h4>
      <p>{tournament.type}</p>
    </div>
    <div>
      <h4 className="text-lg font-semibold">Dates</h4>
      <p>{`${tournament.date_debut} - ${tournament.date_fin}`}</p>
    </div>
    <div>
      <h4 className="text-lg font-semibold">Entry Fee</h4>
      <p>${tournament.frais_entree}</p>
    </div>
    <div>
      <h4 className="text-lg font-semibold">Award</h4>
      <p>${tournament.award}</p>
    </div>
  </div>
);

// Add custom scrollbar styles
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(7, 244, 104, 0.5);
    border-radius: 4px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(7, 244, 104, 0.7);
  }
`;

// Add style tag to document head
const style = document.createElement('style');
style.textContent = scrollbarStyles;
document.head.appendChild(style);

// Update TournamentForm with new components
const TournamentForm = ({ tournament, onSubmit, loading }) => {
  const [formData, setFormData] = useState(tournament || {
    name: "",
    description: "",
    capacite: "",
    type: "",
    date_debut: "",
    date_fin: "",
    frais_entree: "",
    award: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const typeOptions = [
    { value: "5v5", label: "5v5" },
    { value: "6v6", label: "6v6" },
    { value: "7v7", label: "7v7" },
    { value: "11v11", label: "11v11" }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormInput
        label="Tournament Name"
        id="name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Enter tournament name"
        required
      />

      <FormTextArea
        label="Description"
        id="description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Enter tournament description"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Capacity"
          id="capacite"
          name="capacite"
          type="number"
          value={formData.capacite}
          onChange={handleChange}
          placeholder="Enter team capacity"
          required
        />

        <FormSelect
          label="Tournament Type"
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          options={typeOptions}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Start Date"
          id="date_debut"
          name="date_debut"
          type="date"
          value={formData.date_debut}
          onChange={handleChange}
          required
        />

        <FormInput
          label="End Date"
          id="date_fin"
          name="date_fin"
          type="date"
          value={formData.date_fin}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Entry Fee"
          id="frais_entree"
          name="frais_entree"
          type="number"
          value={formData.frais_entree}
          onChange={handleChange}
          placeholder="Enter entry fee"
          required
        />

        <FormInput
          label="Award Prize"
          id="award"
          name="award"
          type="number"
          value={formData.award}
          onChange={handleChange}
          placeholder="Enter award prize"
          required
        />
      </div>

      <FormSubmitButton loading={loading}>
        {tournament ? 'Update Tournament' : 'Create Tournament'}
      </FormSubmitButton>
    </form>
  );
};

// Team Section
const TeamSection = ({ teams, setTeams, tournamentId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [comptes, setComptes] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const showNotification = useNotification();

  useEffect(() => {
    const fetchComptes = async () => {
      try {
        const response = await compteService.getAllComptes();
        setComptes(response.data);
      } catch (error) {
        console.error('Error fetching comptes:', error);
        showNotification('Failed to fetch users', 'error');
      }
    };
    fetchComptes();
  }, []);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await tournoiService.getAllTournois();
        setTournaments(response.data);
      } catch (error) {
        console.error('Error fetching tournaments:', error);
        showNotification('Failed to fetch tournaments', 'error');
      }
    };
    fetchTournaments();
  }, []);

  const handleAdd = async (formData) => {
    try {
      setLoading(true);
      const response = await tournoiTeamsService.createTeam({
        ...formData,
        id_tournoi: tournamentId
      });
      setTeams(prev => [...prev, response.data]);
      showNotification('Team created successfully');
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error creating team:', error);
      showNotification('Failed to create team', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id, formData) => {
    try {
      setLoading(true);
      const response = await tournoiTeamsService.updateTeam(id, formData);
      setTeams(prev => prev.map(t => 
        t.id_teams === id ? response.data : t
      ));
      showNotification('Team updated successfully');
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating team:', error);
      showNotification('Failed to update team', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await tournoiTeamsService.deleteTeam(id);
      setTeams(prev => prev.filter(t => t.id_teams !== id));
      showNotification('Team deleted successfully');
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting team:', error);
      showNotification('Failed to delete team', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredTeams = teams.filter(team =>
    team.team_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.descrption?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && !teams.length) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-[#07f468] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <section>
      <SectionTitle icon={Users} title="Teams" />
      <div className="bg-gray-700 rounded-2xl p-4 md:p-6 shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center bg-gray-800 rounded-xl px-4 py-2 w-full md:w-auto">
            <Search className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search teams..."
              className="bg-transparent text-white placeholder-gray-400 focus:outline-none w-full"
            />
          </div>
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center w-full md:w-auto px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 bg-green-500 text-gray-900 hover:bg-green-600"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Team
          </motion.button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTeams.map((team) => (
            <TeamCard 
              key={team.id_teams} 
              team={team} 
              comptes={comptes}
              onView={() => {
                setSelectedTeam(team);
                setIsViewModalOpen(true);
              }}
              onEdit={() => {
                setSelectedTeam(team);
                setIsEditModalOpen(true);
              }}
              onDelete={() => {
                setSelectedTeam(team);
                setIsDeleteModalOpen(true);
              }}
            />
          ))}
        </div>
      </div>
      
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="View Team">
        {selectedTeam && <TeamView team={selectedTeam} comptes={comptes} />}
      </Modal>
      
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Team">
        {selectedTeam && (
          <TeamForm 
            team={selectedTeam} 
            tournaments={tournaments}
            comptes={comptes}
            onSubmit={(formData) => handleUpdate(selectedTeam.id_teams, formData)} 
            loading={loading}
          />
        )}
      </Modal>
      
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Team">
        <TeamForm 
          tournaments={tournaments}
          comptes={comptes}
          onSubmit={handleAdd} 
          loading={loading}
        />
      </Modal>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => handleDelete(selectedTeam?.id_teams)}
        itemName="team"
      />
    </section>
  );
};

const TeamCard = ({ team, comptes = [], onView, onEdit, onDelete }) => {
  const captain = comptes.find(c => c.id_compte === parseInt(team.capitain));
  const captainName = captain ? `${captain.nom} ${captain.prenom}` : 'Unknown Captain';

  return (
    <motion.div
      className="bg-gray-800 rounded-xl p-4 md:p-6 hover:shadow-lg transition-all duration-300"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      <h3 className="text-xl font-semibold mb-2">{team.team_name}</h3>
      <p className="text-gray-400 text-sm mb-4">{team.descrption}</p>
      <div className="flex items-center mb-4">
        <Users className="w-4 h-4 mr-2 text-green-500" />
        <span className="text-sm">{`Captain: ${captainName}`}</span>
      </div>
      <div className="flex justify-between">
        <ActionButton icon={Eye} label="View" onClick={onView} />
        <ActionButton icon={Edit} label="Edit" onClick={onEdit} />
        <ActionButton icon={Trash2} label="Delete" onClick={onDelete} />
      </div>
    </motion.div>
  );
};

const TeamView = ({ team, comptes = [] }) => {
  const captain = comptes.find(c => c.id_compte === parseInt(team.capitain));
  const captainName = captain ? `${captain.nom} ${captain.prenom}` : 'Unknown Captain';

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-lg font-semibold">Team Name</h4>
        <p>{team.team_name}</p>
      </div>
      <div>
        <h4 className="text-lg font-semibold">Description</h4>
        <p>{team.descrption}</p>
      </div>
      <div>
        <h4 className="text-lg font-semibold">Captain</h4>
        <p>{captainName}</p>
      </div>
    </div>
  );
};

const TeamForm = ({ team, onSubmit, tournaments = [], comptes = [], loading }) => {
  const [formData, setFormData] = useState(team || {
    team_name: "",
    descrption: "",
    capitain: "",
    id_tournoi: team?.id_tournoi || ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const captain = comptes.find(c => c.id_compte === parseInt(formData.capitain));
  const captainName = captain ? `${captain.nom} ${captain.prenom}` : 'Unknown Captain';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormInput
        label="Team Name"
        id="team_name"
        name="team_name"
        value={formData.team_name}
        onChange={handleChange}
        placeholder="Enter team name"
        required
      />

      <FormTextArea
        label="Description"
        id="descrption"
        name="descrption"
        value={formData.descrption}
        onChange={handleChange}
        placeholder="Enter team description"
      />

      <FormSelect
        label="Captain"
        id="capitain"
        name="capitain"
        value={formData.capitain}
        onChange={handleChange}
        options={comptes.map(compte => ({
          value: compte.id_compte,
          label: `${compte.nom} ${compte.prenom}`
        }))}
        required
      />

      <FormSelect
        label="Tournament"
        id="id_tournoi"
        name="id_tournoi"
        value={formData.id_tournoi}
        onChange={handleChange}
        options={tournaments.map(t => ({
          value: t.id_tournoi,
          label: t.name
        }))}
        required
      />

      <FormSubmitButton loading={loading}>
        {team ? 'Update Team' : 'Create Team'}
      </FormSubmitButton>
    </form>
  );
};

// Match Section
const MatchSection = ({ matches, setMatches, tournamentId, teams, tournaments }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState('');
  const [loading, setLoading] = useState(false);
  const [stages, setStages] = useState([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const showNotification = useNotification();

  useEffect(() => {
    const fetchStages = async () => {
      try {
        const response = await stagesService.getAllStages();
        setStages(response.data);
      } catch (error) {
        console.error('Error fetching stages:', error);
        showNotification('Failed to fetch stages', 'error');
      }
    };
    fetchStages();
  }, []);

  const handleAdd = async (formData) => {
    try {
      setLoading(true);
      const response = await matchesService.createMatch({
        ...formData,
        id_tournoi: tournamentId
      });
      setMatches([...matches, response.data]);
      setIsAddModalOpen(false);
      showNotification('Match created successfully', 'success');
    } catch (error) {
      console.error('Error creating match:', error);
      showNotification('Failed to create match', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id, formData) => {
    try {
      setLoading(true);
      const response = await matchesService.updateMatch(id, formData);
      setMatches(matches.map(match => 
        match.id_match === id ? response.data : match
      ));
      setIsEditModalOpen(false);
      showNotification('Match updated successfully', 'success');
    } catch (error) {
      console.error('Error updating match:', error);
      showNotification('Failed to update match', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await matchesService.deleteMatch(id);
      setMatches(matches.filter(match => match.id_match !== id));
      setIsDeleteModalOpen(false);
      showNotification('Match deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting match:', error);
      showNotification('Failed to delete match', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredMatches = matches.filter(match => {
    const team1 = teams.find(t => t.id_teams === match.team1_id);
    const team2 = teams.find(t => t.id_teams === match.team2_id);
    
    const matchString = `${team1?.team_name || ''} ${team2?.team_name || ''} ${match.match_date}`.toLowerCase();
    const searchFilter = matchString.includes(searchQuery.toLowerCase());
    const stageFilter = selectedStage ? match.stage.toString() === selectedStage.toString() : true;
    
    return searchFilter && stageFilter;
  });

  if (loading && !matches.length) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-[#07f468] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <section>
      <SectionTitle icon={Calendar} title="Matches" />
      <div className="bg-gray-700 rounded-2xl p-4 md:p-6 shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center bg-gray-800 rounded-xl px-4 py-2 w-full md:w-auto">
            <Search className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search matches..."
              className="bg-transparent text-white placeholder-gray-400 focus:outline-none w-full"
            />
          </div>
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <select 
              className="bg-gray-800 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#07f468]/20 border border-gray-700 w-full"
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
            >
              <option value="">All Stages</option>
              {stages.map((stage) => (
                <option key={stage.id_stage} value={stage.id_stage}>
                  {stage.stage_name}
                </option>
              ))}
            </select>
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center justify-center w-full md:w-auto px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 bg-green-500 text-gray-900 hover:bg-green-600"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Match
            </motion.button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMatches.map((match) => (
            <MatchCard 
              key={match.id_match} 
              match={match} 
              stages={stages}
              teams={teams}
              onView={() => {
                setSelectedMatch(match);
                setIsViewModalOpen(true);
              }}
              onEdit={() => {
                setSelectedMatch(match);
                setIsEditModalOpen(true);
              }}
            />
          ))}
        </div>
      </div>
      
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="View Match">
        {selectedMatch && <MatchView match={selectedMatch} stages={stages} teams={teams} />}
      </Modal>
      
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Match">
        {selectedMatch && (
          <MatchForm 
            match={selectedMatch} 
            stages={stages} 
            teams={teams} 
            tournaments={tournaments}
            onSubmit={(formData) => handleUpdate(selectedMatch.id_match, formData)} 
            loading={loading}
          />
        )}
      </Modal>
      
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Match">
        <MatchForm 
          stages={stages} 
          teams={teams} 
          tournaments={tournaments}
          onSubmit={handleAdd} 
          loading={loading}
        />
      </Modal>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => handleDelete(selectedMatch?.id_match)}
        itemName="match"
      />
    </section>
  );
};

const MatchCard = ({ match, stages, teams, onView, onEdit }) => {
  const stage = stages.find((s) => s.id_stage === match.stage);
  const team1 = teams.find((t) => t.id_teams === match.team1_id);
  const team2 = teams.find((t) => t.id_teams === match.team2_id);

  return (
    <motion.div
      className="bg-gray-800 rounded-xl p-4 md:p-6 hover:shadow-lg transition-all duration-300"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-400">{match.match_date}</span>
        <span className="text-sm font-medium bg-green-500 text-gray-900 px-2 py-1 rounded-full">
          {stage ? stage.stage_name : 'Unknown Stage'}
        </span>
      </div>
      <div className="flex justify-between items-center mb-4">
        {/* Team 1 */}
        <div className="flex-1 text-center min-w-0 max-w-[120px] md:max-w-[150px] lg:max-w-[200px]">
          <div className="w-8 h-8 md:w-12 md:h-12 bg-gray-700 rounded-full mb-2 mx-auto"></div>
          <span className="text-xs md:text-sm whitespace-nowrap overflow-hidden overflow-ellipsis block px-2">
            {team1 ? team1.team_name : `Team ${match.team1_id}`}
          </span>
        </div>

        {/* Score */}
        <div className="flex-none mx-4 md:mx-6 text-center">
          <span className="text-xl md:text-2xl font-bold whitespace-nowrap">
            {match.score_team1} - {match.score_team2}
          </span>
        </div>

        {/* Team 2 */}
        <div className="flex-1 text-center min-w-0 max-w-[120px] md:max-w-[150px] lg:max-w-[200px]">
          <div className="w-8 h-8 md:w-12 md:h-12 bg-gray-700 rounded-full mb-2 mx-auto"></div>
          <span className="text-xs md:text-sm whitespace-nowrap overflow-hidden overflow-ellipsis block px-2">
            {team2 ? team2.team_name : `Team ${match.team2_id}`}
          </span>
        </div>
      </div>
      <div className="flex justify-between">
        <ActionButton icon={Eye} label="View" onClick={onView} />
        <ActionButton icon={Edit} label="Edit" onClick={onEdit} />
      </div>
    </motion.div>
  );
};

const MatchView = ({ match, stages, teams }) => {
  const stage = stages.find((s) => s.id_stage === match.stage);
  const team1 = teams.find((t) => t.id_teams === match.team1_id);
  const team2 = teams.find((t) => t.id_teams === match.team2_id);

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-lg font-semibold">Date</h4>
        <p>{match.match_date}</p>
      </div>
      <div>
        <h4 className="text-lg font-semibold">Stage</h4>
        <p>{stage ? stage.stage_name : 'Unknown Stage'}</p>
      </div>
      <div>
        <h4 className="text-lg font-semibold">Teams</h4>
        <p>
          {team1 ? team1.team_name : `Team ${match.team1_id}`} vs {team2 ? team2.team_name : `Team ${match.team2_id}`}
        </p>
      </div>
      <div>
        <h4 className="text-lg font-semibold">Score</h4>
        <p>{match.score_team1} - {match.score_team2}</p>
      </div>
    </div>
  );
};

const MatchForm = ({ match, stages, teams, onSubmit, loading }) => {
  const [formData, setFormData] = useState(match || {
    team1_id: "",
    team2_id: "",
    score_team1: "",
    score_team2: "",
    stage: "",
    match_date: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormSelect
        label="Team 1"
        id="team1_id"
        name="team1_id"
        value={formData.team1_id}
        onChange={handleChange}
        options={teams.map(team => ({
          value: team.id_teams,
          label: team.team_name
        }))}
        required
      />

      <FormSelect
        label="Team 2"
        id="team2_id"
        name="team2_id"
        value={formData.team2_id}
        onChange={handleChange}
        options={teams.map(team => ({
          value: team.id_teams,
          label: team.team_name
        }))}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Score Team 1"
          id="score_team1"
          name="score_team1"
          type="number"
          value={formData.score_team1}
          onChange={handleChange}
          placeholder="Enter score for Team 1"
          required
        />

        <FormInput
          label="Score Team 2"
          id="score_team2"
          name="score_team2"
          type="number"
          value={formData.score_team2}
          onChange={handleChange}
          placeholder="Enter score for Team 2"
          required
        />
      </div>

      <FormSelect
        label="Stage"
        id="stage"
        name="stage"
        value={formData.stage}
        onChange={handleChange}
        options={stages.map(stage => ({
          value: stage.id_stage,
          label: stage.stage_name
        }))}
        required
      />

      <FormInput
        label="Match Date"
        id="match_date"
        name="match_date"
        type="datetime-local"
        value={formData.match_date}
        onChange={handleChange}
        required
      />

      <FormSubmitButton loading={loading}>
        {match ? 'Update Match' : 'Create Match'}
      </FormSubmitButton>
    </form>
  );
};

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, itemName }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="bg-gray-800/90 backdrop-blur-md rounded-2xl w-full max-w-2xl overflow-hidden shadow-xl border border-gray-700/50"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-700/50">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-[#07f468] to-[#00c4ff] bg-clip-text text-transparent">
              Confirm Deletion
            </h3>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>

          {/* Modal Content */}
          <div className="p-6 max-h-[calc(100vh-12rem)] overflow-y-auto custom-scrollbar">
            <p>Are you sure you want to delete this {itemName}?</p>
            <div className="mt-6 flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onConfirm}
                className="bg-[#07f468] text-gray-900 px-4 py-2 rounded-full font-medium"
              >
                Delete
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// Create a wrapper component
const TournoiWrapper = () => {
  return (
    <NotificationProvider>
      <EnhancedTournamentManagement />
    </NotificationProvider>
  );
};

// Change the default export to the wrapper
export default TournoiWrapper;
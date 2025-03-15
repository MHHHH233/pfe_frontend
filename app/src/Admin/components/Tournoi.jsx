import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Users, Calendar, DollarSign, Award, ChevronDown, Edit, Trash2, Plus, Search, Filter, Eye, ArrowRight, ArrowLeft, X } from 'lucide-react';

// Mock data (same as before)
const tournaments = [
  {
    id_tournoi: 1,
    name: "Summer Cup 2024",
    description: "Annual summer football tournament",
    capacite: 16,
    type: "Knockout",
    date_debut: "2024-06-01",
    date_fin: "2024-06-15",
    frais_entree: 100,
    award: 5000
  },
  // Add more tournament data as needed
];

const teams = [
    {
        id_teams: 1,
        id_tournoi: 1,
        team_name: "Thunder  ",
        description: "Local champions",
        capitain: "John Doe"
      },{
        id_teams: 1,
        id_tournoi: 1,
        team_name: "Thunder  ",
        description: "Local champions",
        capitain: "John Doe"
      },{
        id_teams: 1,
        id_tournoi: 1,
        team_name: "Thunder  ",
        description: "Local champions",
        capitain: "John Doe"
      }
  // Add more team data as needed
];

const matches = [
    {
        id_match: 1,
        id_tournoi: 1,
        team1_id: 1,
        team2_id: 2,
        match_date: "2024-06-01",
        score_team1: 2,
        score_team2: 1,
        stage: 1
      },  {
        id_match: 1,
        id_tournoi: 1,
        team1_id: 1,
        team2_id: 2,
        match_date: "2024-06-01",
        score_team1: 2,
        score_team2: 1,
        stage: 1
      },  {
        id_match: 1,
        id_tournoi: 1,
        team1_id: 1,
        team2_id: 2,
        match_date: "2024-06-01",
        score_team1: 2,
        score_team2: 1,
        stage: 1
      },
  // Add more match data as needed
];

const stages = [
  { id_stage: 1, stage_name: "Group Stage" },
  { id_stage: 2, stage_name: "Round of 16" },
  { id_stage: 3, stage_name: "Quarterfinals" },
  { id_stage: 4, stage_name: "Semifinals" },
  { id_stage: 5, stage_name: "Final" }
];

const EnhancedTournamentManagement = () => {
  return (
    <div className="min-h-screen bg-gray-800 rounded-3xl text-white p-4 md:p-8">
      <Header />
      <div className="mt-12 space-y-16">
        <TournamentSection tournaments={tournaments} />
        <TeamSection teams={teams} tournaments={tournaments} />
        <MatchSection matches={matches} stages={stages} teams={teams} tournaments={tournaments} />
      </div>
    </div>
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

// Modal component
const Modal = ({ isOpen, onClose, title, children }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 50 }}
          className="bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold">{title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>
          {children}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// Tournament Section
const TournamentSection = ({ tournaments }) => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState(null);

  return (
    <section>
      <SectionTitle icon={Trophy} title="Tournaments" />
      <div className="bg-gray-700 rounded-2xl p-4 md:p-6 shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="flex items-center bg-gray-800 rounded-full px-4 py-2 w-full md:w-auto mb-4 md:mb-0">
            <Search className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search tournaments..."
              className="bg-transparent text-white placeholder-gray-400 focus:outline-none w-full"
            />
          </div>
          <ActionButton icon={Plus} label="Add Tournament" primary onClick={() => setIsAddModalOpen(true)} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tournaments.map((tournament) => (
            <TournamentCard 
              key={tournament.id_tournoi} 
              tournament={tournament} 
              onView={() => {
                setSelectedTournament(tournament);
                setIsViewModalOpen(true);
              }}
              onEdit={() => {
                setSelectedTournament(tournament);
                setIsEditModalOpen(true);
              }}
            />
          ))}
        </div>
      </div>
      
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="View Tournament">
        {selectedTournament && <TournamentView tournament={selectedTournament} />}
      </Modal>
      
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Tournament">
        {selectedTournament && <TournamentForm tournament={selectedTournament} onSubmit={() => setIsEditModalOpen(false)} />}
      </Modal>
      
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Tournament">
        <TournamentForm onSubmit={() => setIsAddModalOpen(false)} />
      </Modal>
    </section>
  );
};

const TournamentCard = ({ tournament, onView, onEdit }) => (
  <motion.div
    className="bg-gray-800 rounded-xl p-4 md:p-6 hover:shadow-lg transition-all duration-300"
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.98 }}
  >
    <h3 className="text-xl font-semibold mb-2">{tournament.name}</h3>
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

const TournamentForm = ({ tournament, onSubmit }) => {
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
    // Here you would typically send the data to your backend
    console.log(formData);
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-400">Name</label>
        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white" />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-400">Description</label>
        <textarea id="description" name="description" value={formData.description} onChange={handleChange} className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"></textarea>
      </div>
      <div>
        <label htmlFor="capacite" className="block text-sm font-medium text-gray-400">Capacity</label>
        <input type="number" id="capacite" name="capacite" value={formData.capacite} onChange={handleChange} className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white" />
      </div>
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-400">Type</label>
        <input type="text" id="type" name="type" value={formData.type} onChange={handleChange} className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white" />
      </div>
      <div>
        <label htmlFor="date_debut" className="block text-sm font-medium text-gray-400">Start Date</label>
        <input type="date" id="date_debut" name="date_debut" value={formData.date_debut} onChange={handleChange} className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white" />
      </div>
      <div>
        <label htmlFor="date_fin" className="block text-sm font-medium text-gray-400">End Date</label>
        <input type="date" id="date_fin" name="date_fin" value={formData.date_fin} onChange={handleChange} className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white" />
      </div>
      <div>
        <label htmlFor="frais_entree" className="block text-sm font-medium text-gray-400">Entry Fee</label>
        <input type="number" id="frais_entree" name="frais_entree" value={formData.frais_entree} onChange={handleChange} className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white" />
      </div>
      <div>
        <label htmlFor="award" className="block text-sm font-medium text-gray-400">Award</label>
        <input type="number" id="award" name="award" value={formData.award} onChange={handleChange} className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white" />
      </div>
      <div className="flex justify-end">
        <button type="submit" className="bg-green-500 text-gray-900 px-4 py-2 rounded-full font-medium hover:bg-green-600 transition-colors duration-300">
          {tournament ? 'Update Tournament' : 'Create Tournament'}
        </button>
      </div>
    </form>
  );
};

// Team Section
const TeamSection = ({ teams, tournaments }) => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);

  return (
    <section>
      <SectionTitle icon={Users} title="Teams" />
      <div className="bg-gray-700 rounded-2xl p-4 md:p-6 shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="flex items-center bg-gray-800 rounded-full px-4 py-2 w-full md:w-auto mb-4 md:mb-0">
            <Search className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search teams..."
              className="bg-transparent text-white placeholder-gray-400 focus:outline-none w-full"
            />
          </div>
          <ActionButton icon={Plus} label="Add Team" primary onClick={() => setIsAddModalOpen(true)} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team) => (
            <TeamCard 
              key={team.id_teams} 
              team={team} 
              onView={() => {
                setSelectedTeam(team);
                setIsViewModalOpen(true);
              }}
              onEdit={() => {
                setSelectedTeam(team);
                setIsEditModalOpen(true);
              }}
            />
          ))}
        </div>
      </div>
      
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="View Team">
        {selectedTeam && <TeamView team={selectedTeam} />}
      </Modal>
      
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Team">
        {selectedTeam && <TeamForm team={selectedTeam} tournaments={tournaments} onSubmit={() => setIsEditModalOpen(false)} />}
      </Modal>
      
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Team">
        <TeamForm tournaments={tournaments} onSubmit={() => setIsAddModalOpen(false)} />
      </Modal>
    </section>
  );
};

const TeamCard = ({ team, onView, onEdit }) => (
  <motion.div
    className="bg-gray-800 rounded-xl p-4 md:p-6 hover:shadow-lg transition-all duration-300"
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.98 }}
  >
    <h3 className="text-xl font-semibold mb-2">{team.team_name}</h3>
    <p className="text-gray-400 text-sm mb-4">{team.description}</p>
    <div className="flex items-center mb-4">
      <Users className="w-4 h-4 mr-2 text-green-500" />
      <span className="text-sm">{`Captain: ${team.capitain}`}</span>
    </div>
    <div className="flex justify-between">
      <ActionButton icon={Eye} label="View" onClick={onView} />
      <ActionButton icon={Edit} label="Edit" onClick={onEdit} />
    </div>
  </motion.div>
);

const TeamView = ({ team }) => (
  <div className="space-y-4">
    <div>
      <h4 className="text-lg font-semibold">Team Name</h4>
      <p>{team.team_name}</p>
    </div>
    <div>
      <h4 className="text-lg font-semibold">Description</h4>
      <p>{team.description}</p>
    </div>
    <div>
      <h4 className="text-lg font-semibold">Captain</h4>
      <p>{team.capitain}</p>
    </div>
  </div>
);

const TeamForm = ({ team, tournaments, onSubmit }) => {
  const [formData, setFormData] = useState(team || {
    team_name: "",
    description: "",
    capitain: "",
    id_tournoi: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log(formData);
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="team_name" className="block text-sm font-medium text-gray-400">Team Name</label>
        <input type="text" id="team_name" name="team_name" value={formData.team_name} onChange={handleChange} className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white" />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-400">Description</label>
        <textarea id="description" name="description" value={formData.description} onChange={handleChange} className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"></textarea>
      </div>
      <div>
        <label htmlFor="capitain" className="block text-sm font-medium text-gray-400">Captain</label>
        <input type="text" id="capitain" name="capitain" value={formData.capitain} onChange={handleChange} className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white" />
      </div>
      <div>
        <label htmlFor="id_tournoi" className="block text-sm font-medium text-gray-400">Tournament</label>
        <select id="id_tournoi" name="id_tournoi" value={formData.id_tournoi} onChange={handleChange} className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white">
          <option value="">Select a tournament</option>
          {tournaments.map((tournament) => (
            <option key={tournament.id_tournoi} value={tournament.id_tournoi}>
              {tournament.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-end">
        <button type="submit" className="bg-green-500 text-gray-900 px-4 py-2 rounded-full font-medium hover:bg-green-600 transition-colors duration-300">
          {team ? 'Update Team' : 'Create Team'}
        </button>
      </div>
    </form>
  );
};

// Match Section
const MatchSection = ({ matches, stages, teams, tournaments }) => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);

  return (
    <section>
      <SectionTitle icon={Trophy} title="Matches" />
      <div className="bg-gray-700 rounded-2xl p-4 md:p-6 shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="flex items-center bg-gray-800 rounded-full px-4 py-2 w-full md:w-auto mb-4 md:mb-0">
            <Search className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search matches..."
              className="bg-transparent text-white placeholder-gray-400 focus:outline-none w-full"
            />
          </div>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <select className="bg-gray-800 text-white rounded-full px-4 py-2 focus:outline-none">
              <option value="">All Stages</option>
              {stages.map((stage) => (
                <option key={stage.id_stage} value={stage.id_stage}>
                  {stage.stage_name}
                </option>
              ))}
            </select>
            <ActionButton icon={Plus} label="Add Match" primary onClick={() => setIsAddModalOpen(true)} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {matches.map((match) => (
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
        {selectedMatch && <MatchForm match={selectedMatch} stages={stages} teams={teams} tournaments={tournaments} onSubmit={() => setIsEditModalOpen(false)} />}
      </Modal>
      
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Match">
        <MatchForm stages={stages} teams={teams} tournaments={tournaments} onSubmit={() => setIsAddModalOpen(false)} />
      </Modal>
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
        <p>{team1 ? team1.team_name : `Team ${match.team1_id}`} vs {team2 ? team2.team_name : `Team ${match.team2_id}`}</p>
      </div>
      <div>
        <h4 className="text-lg font-semibold">Score</h4>
        <p>{match.score_team1} - {match.score_team2}</p>
      </div>
    </div>
  );
};

const MatchForm = ({ match, stages, teams, tournaments, onSubmit }) => {
  const [formData, setFormData] = useState(match || {
    id_tournoi: "",
    team1_id: "",
    team2_id: "",
    match_date: "",
    score_team1: "",
    score_team2: "",
    stage: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log(formData);
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="id_tournoi" className="block text-sm font-medium text-gray-400">Tournament</label>
        <select id="id_tournoi" name="id_tournoi" value={formData.id_tournoi} onChange={handleChange} className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white">
          <option value="">Select a tournament</option>
          {tournaments.map((tournament) => (
            <option key={tournament.id_tournoi} value={tournament.id_tournoi}>
              {tournament.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="team1_id" className="block text-sm font-medium text-gray-400">Team 1</label>
        <select id="team1_id" name="team1_id" value={formData.team1_id} onChange={handleChange} className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white">
          <option value="">Select a team</option>
          {teams.map((team) => (
            <option key={team.id_teams} value={team.id_teams}>
              {team.team_name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="team2_id" className="block text-sm font-medium text-gray-400">Team 2</label>
        <select id="team2_id" name="team2_id" value={formData.team2_id} onChange={handleChange} className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white">
          <option value="">Select a team</option>
          {teams.map((team) => (
            <option key={team.id_teams} value={team.id_teams}>
              {team.team_name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="match_date" className="block text-sm font-medium text-gray-400">Match Date</label>
        <input type="date" id="match_date" name="match_date" value={formData.match_date} onChange={handleChange} className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white" />
      </div>
      <div>
        <label htmlFor="score_team1" className="block text-sm font-medium text-gray-400">Score Team 1</label>
        <input type="number" id="score_team1" name="score_team1" value={formData.score_team1} onChange={handleChange} className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white" />
      </div>
      <div>
        <label htmlFor="score_team2" className="block text-sm font-medium text-gray-400">Score Team 2</label>
        <input type="number" id="score_team2" name="score_team2" value={formData.score_team2} onChange={handleChange} className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white" />
      </div>
      <div>
        <label htmlFor="stage" className="block text-sm font-medium text-gray-400">Stage</label>
        <select id="stage" name="stage" value={formData.stage} onChange={handleChange} className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white">
          <option value="">Select a stage</option>
          {stages.map((stage) => (
            <option key={stage.id_stage} value={stage.id_stage}>
              {stage.stage_name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-end">
        <button type="submit" className="bg-green-500 text-gray-900 px-4 py-2 rounded-full font-medium hover:bg-green-600 transition-colors duration-300">
          {match ? 'Update Match' : 'Create Match'}
        </button>
      </div>
    </form>
  );
};

export default EnhancedTournamentManagement;
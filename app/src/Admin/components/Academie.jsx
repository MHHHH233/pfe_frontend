"use client"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { School, Users, Calendar, DollarSign, Book, MoreVertical, Edit, Trash2, Plus, Search, Filter, Eye, X, Instagram, Clock, User, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

// Mock data
const academies = [
  {
    id_academie: 1,
    nom: "Football Tech Academy",
    description: "Learn cutting-edge football techniques with professional coaches",
    date_creation: "2023-01-15",
    plan_base: 99,
    plan_premium: 199
  },
  {
    id_academie: 2,
    nom: "Elite Soccer School",
    description: "Premier football training for aspiring athletes",
    date_creation: "2023-03-20",
    plan_base: 149,
    plan_premium: 299
  },
  {
    id_academie: 3,
    nom: "Youth Football Academy",
    description: "Specialized training programs for young talents",
    date_creation: "2023-06-10",
    plan_base: 79,
    plan_premium: 159
  },
  {
    id_academie: 4,
    nom: "Pro Football Institute",
    description: "Advanced training for professional development",
    date_creation: "2023-09-05",
    plan_base: 199,
    plan_premium: 399
  }
];

const activities = [
  {
    id_activites: 1,
    id_academie: 1,
    title: "Advanced Dribbling Techniques",
    description: "Master the art of ball control and dribbling",
    date_debut: "2024-03-01",
    date_fin: "2024-05-31"
  },
  {
    id_activites: 2,
    id_academie: 1,
    title: "Tactical Training",
    description: "Learn advanced tactical plays and strategies",
    date_debut: "2024-04-01",
    date_fin: "2024-06-30"
  },
  {
    id_activites: 3,
    id_academie: 2,
    title: "Speed and Agility",
    description: "Enhance your speed and agility on the field",
    date_debut: "2024-03-15",
    date_fin: "2024-05-15"
  },
  {
    id_activites: 4,
    id_academie: 2,
    title: "Shooting Masterclass",
    description: "Perfect your shooting technique",
    date_debut: "2024-04-15",
    date_fin: "2024-07-15"
  },
  {
    id_activites: 5,
    id_academie: 3,
    title: "Youth Development Program",
    description: "Comprehensive training for young players",
    date_debut: "2024-03-10",
    date_fin: "2024-09-10"
  }
];

const coaches = [
  {
    id_coach: 1,
    id_academie: 1,
    nom: "John Doe",
    pfp: "https://randomuser.me/api/portraits/men/6.jpg",
    description: "Former professional player with 10 years of coaching experience",
    instagram: "@johndoecoach"
  },
  {
    id_coach: 2,
    id_academie: 1,
    nom: "Sarah Smith",
    pfp: "https://randomuser.me/api/portraits/women/1.jpg",
    description: "UEFA licensed coach specializing in youth development",
    instagram: "@sarahsmith_coach"
  },
  {
    id_coach: 3,
    id_academie: 2,
    nom: "Mike Johnson",
    pfp: "https://randomuser.me/api/portraits/men/2.jpg",
    description: "Former national team player and experienced trainer",
    instagram: "@mikejohnson_football"
  },
  {
    id_coach: 4,
    id_academie: 2,
    nom: "Emma Wilson",
    pfp: "https://randomuser.me/api/portraits/women/2.jpg",
    description: "Specialist in tactical training and team development",
    instagram: "@emmawilson_coach"
  },
  {
    id_coach: 5,
    id_academie: 3,
    nom: "David Brown",
    pfp: "https://randomuser.me/api/portraits/men/3.jpg",
    description: "Youth development expert with international experience",
    instagram: "@davidbrown_coach"
  }
];

const programmes = [
  {
    id_programme: 1,
    id_academie: 1,
    jour: "Monday",
    horaire: "18:00 - 20:00",
    programme: "Tactical Training Session"
  },
  {
    id_programme: 2,
    id_academie: 1,
    jour: "Wednesday",
    horaire: "17:00 - 19:00",
    programme: "Technical Skills Development"
  },
  {
    id_programme: 3,
    id_academie: 2,
    jour: "Tuesday",
    horaire: "16:00 - 18:00",
    programme: "Speed and Agility Training"
  },
  {
    id_programme: 4,
    id_academie: 2,
    jour: "Thursday",
    horaire: "18:30 - 20:30",
    programme: "Match Practice Session"
  },
  {
    id_programme: 5,
    id_academie: 3,
    jour: "Friday",
    horaire: "17:30 - 19:30",
    programme: "Youth Development Training"
  },
  {
    id_programme: 6,
    id_academie: 3,
    jour: "Saturday",
    horaire: "10:00 - 12:00",
    programme: "Weekend Intensive Training"
  }
];

const members = [
  {
    id_member: 1,
    id_compte: 101,
    id_activites: 1,
    nom: "Alex Thompson",
    age: 16,
    niveau: "Advanced"
  },
  {
    id_member: 2,
    id_compte: 102,
    id_activites: 1,
    nom: "Maria Garcia",
    age: 15,
    niveau: "Intermediate"
  },
  {
    id_member: 3,
    id_compte: 103,
    id_activites: 2,
    nom: "James Wilson",
    age: 17,
    niveau: "Advanced"
  },
  {
    id_member: 4,
    id_compte: 104,
    id_activites: 3,
    nom: "Sophie Chen",
    age: 14,
    niveau: "Beginner"
  },
  {
    id_member: 5,
    id_compte: 105,
    id_activites: 4,
    nom: "Lucas Silva",
    age: 16,
    niveau: "Intermediate"
  }
];

// Add these animation variants at the top after imports
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

// Reusable Components
const ViewContainer = ({ children }) => (
  <div className="space-y-4 md:space-y-6 bg-gray-800/50 rounded-xl p-4 md:p-6 border border-gray-700/30">
    {children}
  </div>
);

const ViewField = ({ label, value }) => (
  <div className="space-y-2">
    <h4 className="text-lg font-semibold bg-[#07f468] bg-clip-text text-transparent">{label}</h4>
    <div className="text-gray-300">{value}</div>
  </div>
);

const FormContainer = ({ children, onSubmit }) => (
  <form onSubmit={onSubmit} className="space-y-4 md:space-y-6">
    {children}
  </form>
);

const FormField = ({ label, children }) => (
  <div className="space-y-2">
    <label className="block text-gray-300 mb-2 font-medium">{label}</label>
    {children}
  </div>
);

const FormInput = ({ name, label, value, onChange, type = "text", error }) => (
  <FormField label={label}>
    <input
      type={type}
      name={name}
      value={value || ""}
      onChange={onChange}
      className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#07f468]/30 focus:border-transparent transition-all placeholder:text-gray-500"
    />
    {error && <p className="mt-1 text-red-500 text-sm">{error}</p>}
  </FormField>
);

const FormTextarea = ({ name, label, value, onChange, error }) => (
  <FormField label={label}>
    <textarea
      name={name}
      value={value || ""}
      onChange={onChange}
      rows={4}
      className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#07f468]/30 focus:border-transparent transition-all placeholder:text-gray-500"
    />
    {error && <p className="mt-1 text-red-500 text-sm">{error}</p>}
  </FormField>
);

const FormSelect = ({ name, label, value, onChange, options, error }) => (
  <FormField label={label}>
    <select
      name={name}
      value={value || ""}
      onChange={onChange}
      className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#07f468]/30 focus:border-transparent transition-all"
    >
      <option value="">Select an option</option>
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && <p className="mt-1 text-red-500 text-sm">{error}</p>}
  </FormField>
);

const SubmitButton = ({ isUpdate }) => (
  <motion.button
    variants={buttonVariants}
    whileHover="hover"
    whileTap="tap"
    type="submit"
    className="bg-[#07f468] text-gray-900 px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
  >
    {isUpdate ? 'Update' : 'Create'}
  </motion.button>
);

// Add Notification Components
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
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-[90vw] md:max-w-md">
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
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <p className="font-medium text-sm md:text-base">{message}</p>
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

// Update FootballAcademieManagement component
const FootballAcademieManagement = () => {
  // Use mock data directly with state
  const [academiesList, setAcademiesList] = useState(academies);
  const [activitiesList, setActivitiesList] = useState(activities);
  const [coachesList, setCoachesList] = useState(coaches);
  const [programmesList, setProgrammesList] = useState(programmes);
  const [membersList, setMembersList] = useState(members);
  const [loading, setLoading] = useState(true);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
  return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#07f468]"></div>
    </div>
    );
  }

  return (
    <NotificationProvider>
      <motion.div 
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="min-h-screen bg-gradient-to-br rounded-3xl bg-gray-900 text-white p-3 md:p-6 space-y-6 md:space-y-8"
      >
        <Header />
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          animate="animate" 
          className="space-y-6 md:space-y-8"
        >
          <AcademieSection academies={academiesList} setAcademies={setAcademiesList} />
          <ActivitySection activities={activitiesList} setActivities={setActivitiesList} academies={academiesList} />
          <CoachSection coaches={coachesList} setCoaches={setCoachesList} academies={academiesList} />
          <ProgrammeSection programmes={programmesList} setProgrammes={setProgrammesList} academies={academiesList} />
          <MemberSection members={membersList} setMembers={setMembersList} activities={activitiesList} />
        </motion.div>
      </motion.div>
    </NotificationProvider>
  );
};

// Update the Header component
const Header = () => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-gray-800/80 to-gray-900/80 p-4 md:p-6 rounded-xl shadow-lg backdrop-blur-xl border border-gray-700/50 transform hover:scale-[1.01] transition-all duration-300">
    <motion.h1 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="text-2xl md:text-4xl font-bold bg-[#07f468] bg-clip-text text-transparent flex items-center gap-3"
    >
      <School className="text-[#07f468] w-8 h-8 md:w-10 md:h-10 filter drop-shadow-lg" />
      <span className="filter drop-shadow-lg  bg-[#07f468]  bg-clip-text text-transparent">Academie Management</span>
    </motion.h1>
  </div>
);

// Update the SectionTitle component
const SectionTitle = ({ icon: Icon, title }) => (
  <div className="flex items-center mb-4 md:mb-6">
    <div className="bg-[#07f468] p-2 md:p-3 rounded-xl mr-3 md:mr-4 shadow-lg">
      <Icon className="w-5 h-5 md:w-6 md:h-6 text-gray-900" />
    </div>
    <h2 className="text-2xl md:text-3xl font-bold bg-[#07f468] bg-clip-text text-transparent">{title}</h2>
  </div>
);

// Update the ActionButton component
const ActionButton = ({ icon: Icon, label, onClick, variant = 'default' }) => {
  const baseClasses = "p-2 rounded-lg transition-all duration-300 flex items-center gap-2";
  const variants = {
    default: "hover:bg-gray-700/50 text-gray-400 hover:text-white",
    primary: "bg-[#07f468] text-gray-900 hover:shadow-lg",
    danger: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg"
  };

  return (
    <motion.button
      variants={buttonVariants}
      whileHover="hover"
      whileTap="tap"
    onClick={onClick}
      className={`${baseClasses} ${variants[variant]}`}
    title={label}
  >
    <Icon className="w-5 h-5" />
    </motion.button>
);
};

// Update the Modal component
const Modal = ({ isOpen, onClose, title, children }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 md:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-700/50 m-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <h3 className="text-xl md:text-2xl font-bold bg-[#07f468] bg-clip-text text-transparent">{title}</h3>
            <motion.button 
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={onClose} 
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </motion.button>
          </div>
          <div className="space-y-4 md:space-y-6">
          {children}
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// Update the AcademieListItem component
const AcademieListItem = ({ academie, onView, onEdit, onDelete }) => (
  <motion.li
    variants={cardVariants}
    className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-4 md:p-6 shadow-lg backdrop-blur-xl border border-gray-700/50 hover:border-[#07f468]/30 transition-all duration-300 group"
  >
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
      <div className="w-full lg:w-auto">
        <h3 className="text-lg md:text-xl font-semibold group-hover:text-[#07f468] transition-colors duration-300">{academie.nom}</h3>
        <p className="text-gray-400 text-sm md:text-base">{academie.description}</p>
        <div className="flex flex-wrap items-center gap-4 mt-2">
          <div className="flex items-center gap-2 text-gray-400 text-sm md:text-base">
            <Calendar className="w-4 h-4 text-[#07f468]" />
            <span>{academie.date_creation}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-sm md:text-base">
            <DollarSign className="w-4 h-4 text-[#07f468]" />
            <span>Base: ${academie.plan_base}</span>
          </div>
        </div>
      </div>
      <div className="flex gap-2 w-full lg:w-auto justify-end">
        <ActionButton icon={Eye} label="View" onClick={onView} />
        <ActionButton icon={Edit} label="Edit" onClick={onEdit} variant="primary" />
        <ActionButton icon={Trash2} label="Delete" onClick={onDelete} variant="danger" />
      </div>
    </div>
  </motion.li>
);

// Update the search bar in AcademieSection
<div className="flex-grow relative backdrop-blur-xl bg-gray-800/30 rounded-xl shadow-lg border border-gray-700/50 hover:border-[#07f468]/30 transition-all duration-300 group">
  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-[#07f468] transition-colors duration-300" />
  <input
    type="text"
    placeholder="Search academies..."
    className="w-full bg-transparent text-white pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#07f468]/30 transition-all text-lg placeholder:text-gray-500"
  />
</div>

// Update form inputs styling
const inputClasses = "w-full bg-gray-700/50 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#07f468]/30 focus:border-transparent transition-all placeholder:text-gray-500";
const labelClasses = "block text-gray-300 mb-2 font-medium";

// Academie Section
const AcademieSection = ({ academies, setAcademies }) => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedAcademie, setSelectedAcademie] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const showNotification = useNotification();

  const filteredAcademies = academies.filter(academie => 
    academie.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
    academie.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = (formData) => {
    const newAcademie = {
      ...formData,
      id_academie: Math.max(...academies.map(a => a.id_academie)) + 1
    };
    setAcademies(prev => [...prev, newAcademie]);
    showNotification('Academy added successfully');
    setIsAddModalOpen(false);
  };

  const handleUpdate = (id, formData) => {
    setAcademies(prev => prev.map(a => 
      a.id_academie === id ? { ...formData, id_academie: id } : a
    ));
    showNotification('Academy updated successfully');
    setIsEditModalOpen(false);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this academy?')) return;
    setAcademies(prev => prev.filter(a => a.id_academie !== id));
    showNotification('Academy deleted successfully');
  };

  return (
    <section>
      <SectionTitle icon={School} title="Academies" />
      <div className="bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 space-y-4 sm:space-y-0">
          <div className="flex-grow relative backdrop-blur-xl bg-gray-800/30 rounded-xl shadow-lg border border-gray-700/50 hover:border-[#07f468]/30 transition-all duration-300 group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-[#07f468] transition-colors duration-300" />
            <input
              type="text"
              placeholder="Search academies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-white pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#07f468]/30 transition-all text-lg placeholder:text-gray-500"
            />
          </div>
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#07f468] text-gray-900 px-4 py-2 rounded-full font-medium hover:bg-[#06d35a] transition-colors duration-300 w-full sm:w-auto"
          >
            <Plus className="w-5 h-5 inline mr-2" />
            Add Academy
          </motion.button>
        </div>
        <motion.ul 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-4"
        >
          {filteredAcademies.map((academie) => (
            <AcademieListItem 
              key={academie.id_academie} 
              academie={academie} 
              onView={() => {
                setSelectedAcademie(academie);
                setIsViewModalOpen(true);
              }}
              onEdit={() => {
                setSelectedAcademie(academie);
                setIsEditModalOpen(true);
              }}
              onDelete={() => handleDelete(academie.id_academie)}
            />
          ))}
        </motion.ul>
      </div>
      
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="View Academy">
        {selectedAcademie && <AcademieView academie={selectedAcademie} />}
      </Modal>
      
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Academy">
        {selectedAcademie && (
          <AcademieForm 
            academie={selectedAcademie} 
            onSubmit={(formData) => handleUpdate(selectedAcademie.id_academie, formData)} 
          />
        )}
      </Modal>
      
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Academy">
        <AcademieForm onSubmit={handleAdd} />
      </Modal>
    </section>
  );
};

const AcademieView = ({ academie }) => (
  <ViewContainer>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ViewField label="Name" value={academie.nom} />
      <ViewField label="Description" value={academie.description} />
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <ViewField 
            label="Creation Date" 
            value={
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#07f468]" />
                <span>{academie.date_creation}</span>
      </div>
            } 
          />
      </div>
        <div className="flex-1">
          <ViewField 
            label="Base Plan" 
            value={
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#07f468]" />
                <span>${academie.plan_base}</span>
    </div>
            } 
          />
    </div>
    </div>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <ViewField 
            label="Premium Plan" 
            value={
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#07f468]" />
                <span>${academie.plan_premium}</span>
    </div>
            } 
          />
    </div>
    </div>
  </div>
  </ViewContainer>
);

const AcademieForm = ({ academie, onSubmit }) => {
  const [formData, setFormData] = useState(academie || {
    nom: "",
    description: "",
    date_creation: "",
    plan_base: "",
    plan_premium: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormInput
        name="nom"
        label="Name"
        value={formData.nom}
        onChange={handleChange}
      />
      <FormTextarea
        name="description"
        label="Description"
        value={formData.description}
        onChange={handleChange}
      />
      <FormInput
        name="date_creation"
        label="Creation Date"
        type="date"
        value={formData.date_creation}
        onChange={handleChange}
      />
      <FormInput
        name="plan_base"
        label="Base Plan Price"
        type="number"
        value={formData.plan_base}
        onChange={handleChange}
      />
      <FormInput
        name="plan_premium"
        label="Premium Plan Price"
        type="number"
        value={formData.plan_premium}
        onChange={handleChange}
      />
      <div className="flex justify-end">
        <SubmitButton isUpdate={!!academie} />
      </div>
    </form>
  );
};

// Activity Section
const ActivitySection = ({ activities, setActivities, academies }) => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const showNotification = useNotification();

  const handleAdd = (formData) => {
    const newActivity = {
      ...formData,
      id_activites: Math.max(...activities.map(a => a.id_activites)) + 1
    };
    setActivities(prev => [...prev, newActivity]);
    showNotification('Activity added successfully');
    setIsAddModalOpen(false);
  };

  const handleUpdate = (id, formData) => {
    setActivities(prev => prev.map(a => 
      a.id_activites === id ? { ...formData, id_activites: id } : a
    ));
    showNotification('Activity updated successfully');
    setIsEditModalOpen(false);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) return;
    setActivities(prev => prev.filter(a => a.id_activites !== id));
    showNotification('Activity deleted successfully');
  };

  return (
    <section>
      <SectionTitle icon={Book} title="Activities" />
      <div className="bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 space-y-4 sm:space-y-0">
          <div className="flex-grow relative backdrop-blur-xl bg-gray-800/30 rounded-xl shadow-lg border border-gray-700/50 hover:border-[#07f468]/30 transition-all duration-300 group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-[#07f468] transition-colors duration-300" />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-white pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#07f468]/30 transition-all text-lg placeholder:text-gray-500"
            />
          </div>
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#07f468] text-gray-900 px-4 py-2 rounded-full font-medium hover:bg-[#06d35a] transition-colors duration-300 w-full sm:w-auto"
          >
            <Plus className="w-5 h-5 inline mr-2" />
            Add Activity
          </motion.button>
        </div>
        <motion.ul 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-4"
        >
          {activities.map((activity) => (
            <ActivityListItem 
              key={activity.id_activites} 
              activity={activity} 
              onView={() => {
                setSelectedActivity(activity);
                setIsViewModalOpen(true);
              }}
              onEdit={() => {
                setSelectedActivity(activity);
                setIsEditModalOpen(true);
              }}
              onDelete={() => handleDelete(activity.id_activites)}
            />
          ))}
        </motion.ul>
      </div>
      
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="View Activity">
        {selectedActivity && <ActivityView activity={selectedActivity} />}
      </Modal>
      
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Activity">
        {selectedActivity && (
          <ActivityForm 
            activity={selectedActivity}
            academies={academies}
            onSubmit={(formData) => handleUpdate(selectedActivity.id_activites, formData)}
          />
        )}
      </Modal>
      
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Activity">
        <ActivityForm 
          academies={academies}
          onSubmit={handleAdd}
        />
      </Modal>
    </section>
  );
};

const ActivityListItem = ({ activity, onView, onEdit, onDelete }) => (
  <motion.li
    variants={cardVariants}
    className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 shadow-lg backdrop-blur-xl border border-gray-700/50 hover:border-[#07f468]/30 transition-all duration-300 group"
  >
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
      <div>
        <h3 className="text-xl font-semibold group-hover:text-[#07f468] transition-colors duration-300">{activity.title}</h3>
        <p className="text-gray-400">{activity.description}</p>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-2 text-gray-400">
            <Calendar className="w-4 h-4 text-[#07f468]" />
            <span>{activity.date_debut} - {activity.date_fin}</span>
      </div>
        </div>
      </div>
      <div className="flex gap-2">
        <ActionButton icon={Eye} label="View" onClick={onView} />
        <ActionButton icon={Edit} label="Edit" onClick={onEdit} variant="primary" />
        <ActionButton icon={Trash2} label="Delete" onClick={onDelete} variant="danger" />
      </div>
    </div>
  </motion.li>
);

const ActivityView = ({ activity }) => (
  <ViewContainer>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ViewField label="Title" value={activity.title} />
      <ViewField label="Description" value={activity.description} />
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <ViewField 
            label="Start Date" 
            value={
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#07f468]" />
                <span>{activity.date_debut}</span>
    </div>
            } 
          />
    </div>
        <div className="flex-1">
          <ViewField 
            label="End Date" 
            value={
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#07f468]" />
                <span>{activity.date_fin}</span>
    </div>
            } 
          />
    </div>
  </div>
    </div>
  </ViewContainer>
);

const ActivityForm = ({ activity, academies, onSubmit }) => {
  const [formData, setFormData] = useState(activity || {
    id_academie: "",
    title: "",
    description: "",
    date_debut: "",
    date_fin: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormSelect
        name="id_academie"
        label="Academy"
        value={formData.id_academie}
        onChange={handleChange}
        options={academies.map(a => ({ value: a.id_academie, label: a.nom }))}
      />
      <FormInput
        name="title"
        label="Title"
        value={formData.title}
        onChange={handleChange}
      />
      <FormTextarea
        name="description"
        label="Description"
        value={formData.description}
        onChange={handleChange}
      />
      <FormInput
        name="date_debut"
        label="Start Date"
        type="date"
        value={formData.date_debut}
        onChange={handleChange}
      />
      <FormInput
        name="date_fin"
        label="End Date"
        type="date"
        value={formData.date_fin}
        onChange={handleChange}
      />
      <div className="flex justify-end">
        <SubmitButton isUpdate={!!activity} />
      </div>
    </form>
  );
};

// Coach Section
const CoachSection = ({ coaches, setCoaches, academies }) => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const showNotification = useNotification();

  const handleAdd = (formData) => {
    const newCoach = {
      ...formData,
      id_coach: Math.max(...coaches.map(c => c.id_coach)) + 1
    };
    setCoaches(prev => [...prev, newCoach]);
    showNotification('Coach added successfully');
    setIsAddModalOpen(false);
  };

  const handleUpdate = (id, formData) => {
    setCoaches(prev => prev.map(c => 
      c.id_coach === id ? { ...formData, id_coach: id } : c
    ));
    showNotification('Coach updated successfully');
    setIsEditModalOpen(false);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this coach?')) return;
    setCoaches(prev => prev.filter(c => c.id_coach !== id));
    showNotification('Coach deleted successfully');
  };

  return (
    <section>
      <SectionTitle icon={Users} title="Coaches" />
      <div className="bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 space-y-4 sm:space-y-0">
          <div className="flex-grow relative backdrop-blur-xl bg-gray-800/30 rounded-xl shadow-lg border border-gray-700/50 hover:border-[#07f468]/30 transition-all duration-300 group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-[#07f468] transition-colors duration-300" />
            <input
              type="text"
              placeholder="Search coaches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-white pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#07f468]/30 transition-all text-lg placeholder:text-gray-500"
            />
          </div>
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#07f468] text-gray-900 px-4 py-2 rounded-full font-medium hover:bg-[#06d35a] transition-colors duration-300 w-full sm:w-auto"
          >
            <Plus className="w-5 h-5 inline mr-2" />
            Add Coach
          </motion.button>
        </div>
        <ul className="space-y-4">
          {coaches.filter(coach => 
            coach.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
            coach.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            coach.instagram.toLowerCase().includes(searchQuery.toLowerCase())
          ).map((coach) => (
            <CoachListItem 
              key={coach.id_coach} 
              coach={coach}
              onView={() => {
                setSelectedCoach(coach);
                setIsViewModalOpen(true);
              }}
              onEdit={() => {
                setSelectedCoach(coach);
                setIsEditModalOpen(true);
              }}
              onDelete={() => handleDelete(coach.id_coach)}
            />
          ))}
        </ul>
      </div>
      
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="View Coach">
        {selectedCoach && <CoachView coach={selectedCoach} />}
      </Modal>
      
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Coach">
        {selectedCoach && (
          <CoachForm 
            coach={selectedCoach}
            academies={academies}
            onSubmit={(formData) => handleUpdate(selectedCoach.id_coach, formData)}
          />
        )}
      </Modal>
      
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Coach">
        <CoachForm 
          academies={academies}
          onSubmit={handleAdd}
        />
      </Modal>
    </section>
  );
};

const CoachListItem = ({ coach, onView, onEdit, onDelete }) => (
  <motion.li
    variants={cardVariants}
    className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-4 md:p-6 shadow-lg backdrop-blur-xl border border-gray-700/50 hover:border-[#07f468]/30 transition-all duration-300 group"
  >
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
      <div className="flex items-center gap-4">
        <div className="relative">
          <img 
            src={coach.pfp || "/placeholder.svg"} 
            alt={coach.nom} 
            className="w-26 h-26 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-[#07f468]/30 group-hover:border-[#07f468] transition-all duration-300" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div>
          <h3 className="text-lg md:text-xl font-semibold group-hover:text-[#07f468] transition-colors duration-300">{coach.nom}</h3>
          <p className="text-gray-400 text-sm md:text-base">{coach.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <Instagram className="w-5 h-5 text-[#07f468]" />
            <span className="text-gray-400 text-sm md:text-base">{coach.instagram}</span>
          </div>
        </div>
      </div>
      <div className="flex gap-2 w-full lg:w-auto justify-end">
        <ActionButton icon={Eye} label="View" onClick={onView} />
        <ActionButton icon={Edit} label="Edit" onClick={onEdit} variant="primary" />
        <ActionButton icon={Trash2} label="Delete" onClick={onDelete} variant="danger" />
      </div>
    </div>
  </motion.li>
);

const CoachView = ({ coach }) => (
  <ViewContainer>
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="relative">
          <img 
            src={coach.pfp || "/placeholder.svg"} 
            alt={coach.nom} 
            className="w-32 h-32 sm:w-40 sm:h-40 rounded-xl object-cover border-2 border-[#07f468]/30" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-xl" />
        </div>
        <div className="flex-1">
          <ViewField label="Name" value={coach.nom} />
          <ViewField label="Description" value={coach.description} />
        </div>
      </div>
      <ViewField 
        label="Instagram" 
        value={
          <div className="flex items-center gap-2">
            <Instagram className="w-5 h-5 text-[#07f468]" />
            <a 
              href={`https://instagram.com/${coach.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#07f468] hover:underline"
            >
              {coach.instagram}
            </a>
          </div>
        } 
      />
    </div>
  </ViewContainer>
);

const CoachForm = ({ coach, academies, onSubmit }) => {
  const [formData, setFormData] = useState(coach || {
    id_academie: "",
    nom: "",
    pfp: "",
    description: "",
    instagram: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormSelect
        name="id_academie"
        label="Academy"
        value={formData.id_academie}
        onChange={handleChange}
        options={academies.map(a => ({ value: a.id_academie, label: a.nom }))}
      />
      <FormInput
        name="nom"
        label="Name"
        value={formData.nom}
        onChange={handleChange}
      />
      <FormInput
        name="pfp"
        label="Profile Picture URL"
        value={formData.pfp}
        onChange={handleChange}
      />
      <FormTextarea
        name="description"
        label="Description"
        value={formData.description}
        onChange={handleChange}
      />
      <FormInput
        name="instagram"
        label="Instagram"
        value={formData.instagram}
        onChange={handleChange}
      />
      <div className="flex justify-end">
        <SubmitButton isUpdate={!!coach} />
      </div>
    </form>
  );
};

// Programme Section
const ProgrammeSection = ({ programmes, setProgrammes, academies }) => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProgramme, setSelectedProgramme] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const showNotification = useNotification();

  const handleAdd = (formData) => {
    const newProgramme = {
      ...formData,
      id_programme: Math.max(...programmes.map(p => p.id_programme)) + 1
    };
    setProgrammes(prev => [...prev, newProgramme]);
    showNotification('Programme added successfully');
    setIsAddModalOpen(false);
  };

  const handleUpdate = (id, formData) => {
    setProgrammes(prev => prev.map(p => 
      p.id_programme === id ? { ...formData, id_programme: id } : p
    ));
    showNotification('Programme updated successfully');
    setIsEditModalOpen(false);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this programme?')) return;
    setProgrammes(prev => prev.filter(p => p.id_programme !== id));
    showNotification('Programme deleted successfully');
  };

  return (
    <section>
      <SectionTitle icon={Calendar} title="Programmes" />
      <div className="bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 space-y-4 sm:space-y-0">
          <div className="flex-grow relative backdrop-blur-xl bg-gray-800/30 rounded-xl shadow-lg border border-gray-700/50 hover:border-[#07f468]/30 transition-all duration-300 group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-[#07f468] transition-colors duration-300" />
            <input
              type="text"
              placeholder="Search programmes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-white pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#07f468]/30 transition-all text-lg placeholder:text-gray-500"
            />
          </div>
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#07f468] text-gray-900 px-4 py-2 rounded-full font-medium hover:bg-[#06d35a] transition-colors duration-300 w-full sm:w-auto"
          >
            <Plus className="w-5 h-5 inline mr-2" />
            Add Programme
          </motion.button>
        </div>
        <ul className="space-y-4">
          {programmes.filter(programme => 
            programme.programme.toLowerCase().includes(searchQuery.toLowerCase()) ||
            programme.jour.toLowerCase().includes(searchQuery.toLowerCase()) ||
            programme.horaire.toLowerCase().includes(searchQuery.toLowerCase())
          ).map((programme) => (
            <ProgrammeListItem 
              key={programme.id_programme} 
              programme={programme}
              onView={() => {
                setSelectedProgramme(programme);
                setIsViewModalOpen(true);
              }}
              onEdit={() => {
                setSelectedProgramme(programme);
                setIsEditModalOpen(true);
              }}
              onDelete={() => handleDelete(programme.id_programme)}
            />
          ))}
        </ul>
      </div>
      
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="View Programme">
        {selectedProgramme && <ProgrammeView programme={selectedProgramme} />}
      </Modal>
      
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Programme">
        {selectedProgramme && (
          <ProgrammeForm 
            programme={selectedProgramme}
            academies={academies}
            onSubmit={(formData) => handleUpdate(selectedProgramme.id_programme, formData)}
          />
        )}
      </Modal>
      
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Programme">
        <ProgrammeForm 
          academies={academies}
          onSubmit={handleAdd}
        />
      </Modal>
    </section>
  );
};

const ProgrammeListItem = ({ programme, onView, onEdit, onDelete }) => (
  <motion.li
    variants={cardVariants}
    className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 shadow-lg backdrop-blur-xl border border-gray-700/50 hover:border-[#07f468]/30 transition-all duration-300 group"
  >
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
      <div>
        <h3 className="text-xl font-semibold group-hover:text-[#07f468] transition-colors duration-300">{programme.programme}</h3>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-2 text-gray-400">
            <Calendar className="w-4 h-4 text-[#07f468]" />
            <span>{programme.jour}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Clock className="w-4 h-4 text-[#07f468]" />
            <span>{programme.horaire}</span>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <ActionButton icon={Eye} label="View" onClick={onView} />
        <ActionButton icon={Edit} label="Edit" onClick={onEdit} variant="primary" />
        <ActionButton icon={Trash2} label="Delete" onClick={onDelete} variant="danger" />
      </div>
    </div>
  </motion.li>
);

const ProgrammeView = ({ programme }) => (
  <ViewContainer>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ViewField label="Programme" value={programme.programme} />
      <ViewField 
        label="Schedule" 
        value={
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#07f468]" />
              <span>{programme.jour}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#07f468]" />
              <span>{programme.horaire}</span>
            </div>
          </div>
        } 
      />
    </div>
  </ViewContainer>
);

const ProgrammeForm = ({ programme, academies, onSubmit }) => {
  const [formData, setFormData] = useState(programme || {
    id_academie: "",
    jour: "",
    horaire: "",
    programme: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormSelect
        name="id_academie"
        label="Academy"
        value={formData.id_academie}
        onChange={handleChange}
        options={academies.map(a => ({ value: a.id_academie, label: a.nom }))}
      />
      <FormInput
        name="jour"
        label="Day"
        value={formData.jour}
        onChange={handleChange}
      />
      <FormInput
        name="horaire"
        label="Time"
        value={formData.horaire}
        onChange={handleChange}
      />
      <FormTextarea
        name="programme"
        label="Programme"
        value={formData.programme}
        onChange={handleChange}
      />
      <div className="flex justify-end">
        <SubmitButton isUpdate={!!programme} />
      </div>
    </form>
  );
};

// Member Section
const MemberSection = ({ members, setMembers, activities }) => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const showNotification = useNotification();

  const handleAdd = (formData) => {
    const newMember = {
      ...formData,
      id_member: Math.max(...members.map(m => m.id_member)) + 1,
      id_activites: parseInt(formData.id_activites),
      id_compte: parseInt(formData.id_compte),
      age: parseInt(formData.age)
    };
    setMembers(prev => [...prev, newMember]);
    showNotification('Member added successfully');
    setIsAddModalOpen(false);
  };

  const handleUpdate = (id, formData) => {
    setMembers(prev => prev.map(m => 
      m.id_member === id ? {
        ...formData,
        id_member: id,
        id_activites: parseInt(formData.id_activites),
        id_compte: parseInt(formData.id_compte),
        age: parseInt(formData.age)
      } : m
    ));
    showNotification('Member updated successfully');
    setIsEditModalOpen(false);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this member?')) return;
    setMembers(prev => prev.filter(m => m.id_member !== id));
    showNotification('Member deleted successfully');
  };

  return (
    <section>
      <SectionTitle icon={Users} title="Members" />
      <div className="bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 space-y-4 sm:space-y-0">
          <div className="flex-grow relative backdrop-blur-xl bg-gray-800/30 rounded-xl shadow-lg border border-gray-700/50 hover:border-[#07f468]/30 transition-all duration-300 group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-[#07f468] transition-colors duration-300" />
            <input
              type="text"
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-white pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#07f468]/30 transition-all text-lg placeholder:text-gray-500"
            />
          </div>
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#07f468] text-gray-900 px-4 py-2 rounded-full font-medium hover:bg-[#06d35a] transition-colors duration-300 w-full sm:w-auto"
          >
            <Plus className="w-5 h-5 inline mr-2" />
            Add Member
          </motion.button>
        </div>
        <motion.ul 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-4"
        >
          {members.filter(member => 
            member.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.niveau.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.id_compte.toString().includes(searchQuery.toLowerCase()) ||
            activities.find(a => a.id_activites === member.id_activites)?.title.toLowerCase().includes(searchQuery.toLowerCase())
          ).map((member) => (
            <MemberListItem 
              key={member.id_member} 
              member={member}
              activity={activities.find(a => a.id_activites === member.id_activites)}
              onView={() => {
                setSelectedMember(member);
                setIsViewModalOpen(true);
              }}
              onEdit={() => {
                setSelectedMember(member);
                setIsEditModalOpen(true);
              }}
              onDelete={() => handleDelete(member.id_member)}
            />
          ))}
        </motion.ul>
      </div>
      
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="View Member">
        {selectedMember && (
          <MemberView 
            member={selectedMember} 
            activity={activities.find(a => a.id_activites === selectedMember.id_activites)} 
          />
        )}
      </Modal>
      
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Member">
        {selectedMember && (
          <MemberForm 
            member={selectedMember}
            activities={activities}
            onSubmit={(formData) => handleUpdate(selectedMember.id_member, formData)}
          />
        )}
      </Modal>
      
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Member">
        <MemberForm 
          activities={activities}
          onSubmit={handleAdd}
        />
      </Modal>
    </section>
  );
};

const MemberListItem = ({ member, activity, onView, onEdit, onDelete }) => {
  return (
    <motion.li
      variants={cardVariants}
      className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-4 md:p-6 shadow-lg backdrop-blur-xl border border-gray-700/50 hover:border-[#07f468]/30 transition-all duration-300 group"
    >
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div>
          <div className="flex items-center gap-3">
            <div className="bg-[#07f468] p-2 md:p-3 rounded-xl">
              <User className="w-6 h-6 md:w-7 md:h-7 text-gray-900" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold group-hover:text-[#07f468] transition-colors duration-300">{member.nom}</h3>
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-3">
            <div className="flex items-center gap-2 text-gray-400 text-sm md:text-base">
              <User className="w-5 h-5 text-[#07f468]" />
              <span>ID: {member.id_compte}</span>
            </div>
            {activity && (
              <div className="flex items-center gap-2 text-gray-400 text-sm md:text-base">
                <Book className="w-5 h-5 text-[#07f468]" />
                <span>{activity.title}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2 w-full lg:w-auto justify-end">
          <ActionButton icon={Eye} label="View" onClick={onView} />
          <ActionButton icon={Edit} label="Edit" onClick={onEdit} variant="primary" />
          <ActionButton icon={Trash2} label="Delete" onClick={onDelete} variant="danger" />
        </div>
      </div>
    </motion.li>
  );
};

const MemberView = ({ member, activity }) => {
  return (
    <ViewContainer>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ViewField 
          label="Member Information" 
          value={
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#07f468]" />
              <span>ID: {member.id_compte}</span>
            </div>
          } 
        />
        <ViewField 
          label="Activity" 
          value={
            activity ? (
              <div className="flex items-center gap-2">
                <Book className="w-4 h-4 text-[#07f468]" />
                <span>{activity.title}</span>
              </div>
            ) : (
              <span className="text-gray-400">No activity assigned</span>
            )
          } 
        />
      </div>
    </ViewContainer>
  );
};

const MemberForm = ({ member, activities, onSubmit }) => {
  const [formData, setFormData] = useState(member || {
    id_compte: "",
    id_activites: "",
    nom: "",
    age: "",
    niveau: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormInput
        name="id_compte"
        label="Account ID"
        value={formData.id_compte}
        onChange={handleChange}
      />
      <FormSelect
        name="id_activites"
        label="Activity"
        value={formData.id_activites}
        onChange={handleChange}
        options={activities.map(a => ({ value: a.id_activites, label: a.title }))}
      />
      <FormInput
        name="nom"
        label="Name"
        value={formData.nom}
        onChange={handleChange}
      />
      <FormInput
        name="age"
        label="Age"
        type="number"
        value={formData.age}
        onChange={handleChange}
      />
      <FormSelect
        name="niveau"
        label="Level"
        value={formData.niveau}
        onChange={handleChange}
        options={[
          { value: "Beginner", label: "Beginner" },
          { value: "Intermediate", label: "Intermediate" },
          { value: "Advanced", label: "Advanced" }
        ]}
      />
      <div className="flex justify-end">
        <SubmitButton isUpdate={!!member} />
      </div>
    </form>
  );
};

export default FootballAcademieManagement;

"use client"

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { School, Users, Calendar, DollarSign, Book, MoreVertical, Edit, Trash2, Plus, Search, Filter, Eye, X, Instagram, Clock, User, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';
import academieService from '../../lib/services/admin/academieServices';
import academieActivitesService from '../../lib/services/admin/academieActivitesService';
import academieCoachesService from '../../lib/services/admin/academieCoachesService';
import academieProgrammesService from '../../lib/services/admin/academieProgrammesService';
import activitesMembersService from '../../lib/services/admin/activitesMembersService';
import compteService from '../../lib/services/admin/compteServices';

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
  return (
    <NotificationProvider>
      <FootballAcademieContent />
    </NotificationProvider>
  );
};

// Move the main content to a new component
const FootballAcademieContent = () => {
  const [academies, setAcademies] = useState([]);
  const [activities, setActivities] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [members, setMembers] = useState([]);
  const [activeTab, setActiveTab] = useState('academies');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const showNotification = useNotification();

  // Fetch academies on initial load
  useEffect(() => {
    fetchAcademies();
  }, []);

  // Fetch other data when tab changes
  useEffect(() => {
    if (activeTab === 'activities' && activities.length === 0) {
      fetchActivities();
    } else if (activeTab === 'coaches' && coaches.length === 0) {
      fetchCoaches();
    } else if (activeTab === 'programmes' && programmes.length === 0) {
      fetchProgrammes();
    } else if (activeTab === 'members' && members.length === 0) {
      fetchMembers();
    }
  }, [activeTab]);

  const fetchAcademies = async () => {
    setLoading(true);
    try {
      const response = await academieService.getAllAcademies();
      setAcademies(response.data || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching academies:', error);
      setError('Failed to fetch academies');
      showNotification('Failed to fetch academies', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const response = await academieActivitesService.getAllActivites();
      setActivities(response.data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
      showNotification('Failed to fetch activities', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCoaches = async () => {
    setLoading(true);
    try {
      const response = await academieCoachesService.getAllCoaches();
      setCoaches(response.data || []);
    } catch (error) {
      console.error('Error fetching coaches:', error);
      showNotification('Failed to fetch coaches', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchProgrammes = async () => {
    setLoading(true);
    try {
      const response = await academieProgrammesService.getAllProgrammes();
      setProgrammes(response.data || []);
    } catch (error) {
      console.error('Error fetching programmes:', error);
      showNotification('Failed to fetch programmes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    setLoading(true);
    try {
      // Fetch activities first if they haven't been fetched yet
      if (activities.length === 0) {
        await fetchActivities();
      }
      const response = await activitesMembersService.getAllMembers();
      setMembers(response.data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
      showNotification('Failed to fetch members', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#07f468]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-red-500 mb-2">Error</h2>
        <p className="text-gray-400 mb-4">{error}</p>
        <button
          onClick={fetchAcademies}
          className="bg-[#07f468] text-gray-900 px-6 py-2 rounded-full font-medium hover:bg-[#06d35a] transition-colors duration-300"
        >
          Try Again
        </button>
      </div>
    );
  }

  const tabs = [
    { id: 'academies', label: 'Academies', icon: School },
    { id: 'activities', label: 'Activities', icon: Book },
    { id: 'coaches', label: 'Coaches', icon: Users },
    { id: 'programmes', label: 'Programmes', icon: Calendar },
    { id: 'members', label: 'Members', icon: User }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Football Academy Management</h1>
          <nav className="flex flex-wrap gap-2">
            {tabs.map(tab => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors duration-300 ${
                  activeTab === tab.id
                    ? 'bg-[#07f468] text-gray-900'
                    : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </motion.button>
            ))}
          </nav>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'academies' && (
              <AcademieSection 
                academies={academies} 
                setAcademies={setAcademies} 
              />
            )}
            {activeTab === 'activities' && (
              <ActivitySection 
                activities={activities} 
                setActivities={setActivities}
                academies={academies}
              />
            )}
            {activeTab === 'coaches' && (
              <CoachSection 
                coaches={coaches} 
                setCoaches={setCoaches}
                academies={academies}
              />
            )}
            {activeTab === 'programmes' && (
              <ProgrammeSection 
                programmes={programmes} 
                setProgrammes={setProgrammes}
                academies={academies}
              />
            )}
            {activeTab === 'members' && (
              <MemberSection 
                members={members} 
                setMembers={setMembers}
                activities={activities}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
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
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-4 flex-1 overflow-y-auto scrollbar-hide">
          {children}
        </div>
      </div>
    </div>
  );
};

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const showNotification = useNotification();

  // Fetch academies on component mount
  useEffect(() => {
    fetchAcademies();
  }, []);

  const fetchAcademies = async () => {
    try {
      setLoading(true);
      const data = await academieService.getAllAcademies();
      setAcademies(data);
    } catch (error) {
      setError('Failed to fetch academies');
      showNotification('Failed to fetch academies', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (formData) => {
    try {
      setLoading(true);
      const response = await academieService.createAcademie(formData);
      setAcademies(prev => [...prev, response.data]);
      showNotification('Academy added successfully');
      setIsAddModalOpen(false);
    } catch (error) {
      showNotification('Failed to add academy', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id, formData) => {
    try {
      setLoading(true);
      const response = await academieService.updateAcademie(id, formData);
      setAcademies(prev => prev.map(a => 
        a.id_academie === id ? response.data : a
      ));
      showNotification('Academy updated successfully');
      setIsEditModalOpen(false);
    } catch (error) {
      showNotification('Failed to update academy', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this academy?')) return;
    
    try {
      setLoading(true);
      await academieService.deleteAcademie(id);
      setAcademies(prev => prev.filter(a => a.id_academie !== id));
      showNotification('Academy deleted successfully');
    } catch (error) {
      showNotification('Failed to delete academy', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !academies.length) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#07f468]"></div>
      </div>
    );
  }

  if (error && !academies.length) {
    return (
      <div className="text-red-500 text-center p-8">
        {error}
      </div>
    );
  }

  const filteredAcademies = academies.filter(academie => 
    academie.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
    academie.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    date_creation: new Date().toISOString().split('T')[0],
    plan_base: "",
    plan_premium: ""
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nom) newErrors.nom = 'Name is required';
    if (!formData.date_creation) newErrors.date_creation = 'Creation date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormInput
        name="nom"
        label="Name"
        value={formData.nom}
        onChange={handleChange}
        error={errors.nom}
      />
      <FormTextarea
        name="description"
        label="Description"
        value={formData.description}
        onChange={handleChange}
        error={errors.description}
      />
      <FormInput
        name="date_creation"
        label="Creation Date"
        type="date"
        value={formData.date_creation}
        onChange={handleChange}
        error={errors.date_creation}
      />
      <FormInput
        name="plan_base"
        label="Base Plan Price"
        type="number"
        value={formData.plan_base}
        onChange={handleChange}
        error={errors.plan_base}
      />
      <FormInput
        name="plan_premium"
        label="Premium Plan Price"
        type="number"
        value={formData.plan_premium}
        onChange={handleChange}
        error={errors.plan_premium}
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const showNotification = useNotification();

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const data = await academieActivitesService.getAllActivites();
      setActivities(data.data); // Assuming the response has a data property
    } catch (error) {
      setError('Failed to fetch activities');
      showNotification('Failed to fetch activities', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (formData) => {
    try {
      setLoading(true);
      const response = await academieActivitesService.createActivite(formData);
      setActivities(prev => [...prev, response.data]);
      showNotification('Activity added successfully');
      setIsAddModalOpen(false);
    } catch (error) {
      showNotification('Failed to add activity', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id, formData) => {
    try {
      setLoading(true);
      const response = await academieActivitesService.updateActivite(id, formData);
      setActivities(prev => prev.map(a => 
        a.id_activites === id ? response.data : a
      ));
      showNotification('Activity updated successfully');
      setIsEditModalOpen(false);
    } catch (error) {
      showNotification('Failed to update activity', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) return;
    
    try {
      setLoading(true);
      await academieActivitesService.deleteActivite(id);
      setActivities(prev => prev.filter(a => a.id_activites !== id));
      showNotification('Activity deleted successfully');
    } catch (error) {
      showNotification('Failed to delete activity', 'error');
    } finally {
      setLoading(false);
    }
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const showNotification = useNotification();

  useEffect(() => {
    fetchCoaches();
  }, []);

  const fetchCoaches = async () => {
    try {
      setLoading(true);
      const data = await academieCoachesService.getAllCoaches();
      setCoaches(data.data);
    } catch (error) {
      setError('Failed to fetch coaches');
      showNotification('Failed to fetch coaches', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (formData) => {
    try {
      setLoading(true);
      const response = await academieCoachesService.createCoach(formData);
      setCoaches(prev => [...prev, response.data]);
      showNotification('Coach added successfully');
      setIsAddModalOpen(false);
    } catch (error) {
      showNotification('Failed to add coach', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id, formData) => {
    try {
      setLoading(true);
      const response = await academieCoachesService.updateCoach(id, formData);
      setCoaches(prev => prev.map(c => 
        c.id_coach === id ? response.data : c
      ));
      showNotification('Coach updated successfully');
      setIsEditModalOpen(false);
    } catch (error) {
      showNotification('Failed to update coach', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coach?')) return;
    
    try {
      setLoading(true);
      await academieCoachesService.deleteCoach(id);
      setCoaches(prev => prev.filter(c => c.id_coach !== id));
      showNotification('Coach deleted successfully');
    } catch (error) {
      showNotification('Failed to delete coach', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !coaches.length) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#07f468]"></div>
      </div>
    );
  }

  if (error && !coaches.length) {
    return (
      <div className="text-red-500 text-center p-8">
        {error}
      </div>
    );
  }

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
            src={`${coach.pfp}` || "/placeholder.svg"} 
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
    description: "",
    instagram: "",
    pfp: null,
    pfpPreview: null
  });
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  // Initialize preview if coach exists
  useEffect(() => {
    if (coach?.pfp) {
      setFormData(prev => ({
        ...prev,
        pfpPreview: `${coach.pfp}`
      }));
    }
  }, [coach]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.id_academie) newErrors.id_academie = 'Academy is required';
    if (!formData.nom) newErrors.nom = 'Name is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.instagram) newErrors.instagram = 'Instagram is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        pfp: file,
        pfpPreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleImageRemove = () => {
    if (formData.pfpPreview) {
      URL.revokeObjectURL(formData.pfpPreview);
    }
    setFormData(prev => ({
      ...prev,
      pfp: null,
      pfpPreview: null
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const formDataToSend = new FormData();
        formDataToSend.append('id_academie', formData.id_academie);
        formDataToSend.append('nom', formData.nom);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('instagram', formData.instagram);
        
        // Only append pfp if it's a new file
        if (formData.pfp instanceof File) {
          formDataToSend.append('pfp', formData.pfp);
        }

        onSubmit(formDataToSend);
      } catch (error) {
        console.error('Error preparing form data:', error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="block text-gray-300 font-medium">Profile Picture</label>
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-700">
            {formData.pfpPreview ? (
              <img 
                src={formData.pfpPreview} 
                alt="Preview" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  handleImageRemove();
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-12 h-12 text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/jpg"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            Choose Photo
          </button>
            {formData.pfpPreview && (
              <button
                type="button"
                onClick={handleImageRemove}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Remove
              </button>
            )}
          </div>
        </div>
        {errors.pfp && (
          <p className="text-red-500 text-sm">{errors.pfp}</p>
        )}
      </div>

      <FormSelect
        name="id_academie"
        label="Academy"
        value={formData.id_academie}
        onChange={handleChange}
        options={academies.map(a => ({ value: a.id_academie, label: a.nom }))}
        error={errors.id_academie}
      />

      <FormInput
        name="nom"
        label="Name"
        value={formData.nom}
        onChange={handleChange}
        error={errors.nom}
      />

      <FormTextarea
        name="description"
        label="Description"
        value={formData.description}
        onChange={handleChange}
        error={errors.description}
      />

      <FormInput
        name="instagram"
        label="Instagram"
        value={formData.instagram}
        onChange={handleChange}
        error={errors.instagram}
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const showNotification = useNotification();

  useEffect(() => {
    fetchProgrammes();
  }, []);

  const fetchProgrammes = async () => {
    try {
      setLoading(true);
      const data = await academieProgrammesService.getAllProgrammes();
      setProgrammes(data.data);
    } catch (error) {
      setError('Failed to fetch programmes');
      showNotification('Failed to fetch programmes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (formData) => {
    try {
      setLoading(true);
      const response = await academieProgrammesService.createProgramme(formData);
      setProgrammes(prev => [...prev, response.data]);
      showNotification('Programme added successfully');
      setIsAddModalOpen(false);
    } catch (error) {
      showNotification('Failed to add programme', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id, formData) => {
    try {
      setLoading(true);
      const response = await academieProgrammesService.updateProgramme(id, formData);
      setProgrammes(prev => prev.map(p => 
        p.id_programme === id ? response.data : p
      ));
      showNotification('Programme updated successfully');
      setIsEditModalOpen(false);
    } catch (error) {
      showNotification('Failed to update programme', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this programme?')) return;
    
    try {
      setLoading(true);
      await academieProgrammesService.deleteProgramme(id);
      setProgrammes(prev => prev.filter(p => p.id_programme !== id));
      showNotification('Programme deleted successfully');
    } catch (error) {
      showNotification('Failed to delete programme', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !programmes.length) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#07f468]"></div>
      </div>
    );
  }

  if (error && !programmes.length) {
    return (
      <div className="text-red-500 text-center p-8">
        {error}
      </div>
    );
  }

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
        <motion.ul 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-4"
        >
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
        </motion.ul>
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
  const [errors, setErrors] = useState({});

  const daysOfWeek = [
    "Monday", "Tuesday", "Wednesday", "Thursday",
    "Friday", "Saturday", "Sunday"
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.id_academie) newErrors.id_academie = 'Academy is required';
    if (!formData.jour) newErrors.jour = 'Day is required';
    if (!formData.horaire) newErrors.horaire = 'Time is required';
    if (!formData.programme) newErrors.programme = 'Programme is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormSelect
        name="id_academie"
        label="Academy"
        value={formData.id_academie}
        onChange={handleChange}
        options={academies.map(a => ({ value: a.id_academie, label: a.nom }))}
        error={errors.id_academie}
      />

      <div className="space-y-2">
        <label className="block text-gray-300 font-medium">Day</label>
        <div className="flex flex-wrap gap-2">
          {daysOfWeek.map(day => (
            <button
              key={day}
              type="button"
              onClick={() => handleChange({ target: { name: 'jour', value: day } })}
              className={`px-4 py-2 rounded-lg transition-colors ${
                formData.jour === day 
                  ? 'bg-[#07f468] text-gray-900' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
        {errors.jour && <p className="text-red-500 text-sm">{errors.jour}</p>}
      </div>

      <FormInput
        name="horaire"
        label="Time"
        type="time"
        value={formData.horaire}
        onChange={handleChange}
        error={errors.horaire}
      />

      <FormTextarea
        name="programme"
        label="Programme"
        value={formData.programme}
        onChange={handleChange}
        error={errors.programme}
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const showNotification = useNotification();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);

  // Filter members safely
  const filteredMembers = members.filter(member => {
    const memberName = member.nom || '';  // Use empty string as fallback
    const activityTitle = activities.find(a => a.id_activites === member.id_activites)?.title || '';
    return memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           activityTitle.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleAdd = async (formData) => {
    try {
      setLoading(true);
      const response = await activitesMembersService.createMember(formData);
      setMembers(prev => [...prev, response.data]);
      showNotification('Member added successfully');
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding member:', error);
      showNotification('Failed to add member', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id, formData) => {
    try {
      setLoading(true);
      const response = await activitesMembersService.updateMember(id, formData);
      setMembers(prev => prev.map(m => 
        m.id_member === id ? response.data : m
      ));
      showNotification('Member updated successfully');
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating member:', error);
      showNotification('Failed to update member', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (member) => {
    setMemberToDelete(member);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!memberToDelete?.id_member) return; // Add null check
    
    try {
      setLoading(true);
      await activitesMembersService.deleteMember(memberToDelete.id_member);
      setMembers(prev => prev.filter(m => m.id_member !== memberToDelete.id_member));
      showNotification('Member deleted successfully');
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting member:', error);
      showNotification('Failed to delete member', 'error');
    } finally {
      setLoading(false);
      setMemberToDelete(null);
    }
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
          {filteredMembers.map((member) => (
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
              onDelete={() => handleDeleteClick(member)} // Pass the entire member object
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
      
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName="member"
      />
    </section>
  );
};

const MemberListItem = ({ member, activity, onView, onEdit, onDelete }) => {
  // Fetch the corresponding compte data
  const [compte, setCompte] = useState(null);
  const [loadingCompte, setLoadingCompte] = useState(true);

  useEffect(() => {
    const fetchCompte = async () => {
      try {
        const response = await compteService.getCompte(member.id_compte);
        setCompte(response.data);
      } catch (error) {
        console.error('Error fetching compte:', error);
      } finally {
        setLoadingCompte(false);
      }
    };

    fetchCompte();
  }, [member.id_compte]);

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
            <h3 className="text-lg md:text-xl font-semibold group-hover:text-[#07f468] transition-colors duration-300">
              {loadingCompte ? 'Loading...' : (compte ? `${compte.nom} ${compte.prenom}` : 'Unknown Member')}
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-3">
            <div className="flex items-center gap-2 text-gray-400 text-sm md:text-base">
              <User className="w-5 h-5 text-[#07f468]" />
              <span>ID: {member.id_compte}</span>
            </div>
            {activity && (
              <div className="flex items-center gap-2 text-gray-400 text-sm md:text-base">
                <Book className="w-5 h-5 text-[#07f468]" />
                <span>Activity: {activity.title}</span>
              </div>
            )}
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
};

const MemberView = ({ member, activity }) => {
  const [compte, setCompte] = useState(null);
  const [loadingCompte, setLoadingCompte] = useState(true);

  useEffect(() => {
    const fetchCompte = async () => {
      try {
        const response = await compteService.getCompteById(member.id_compte);
        setCompte(response.data);
      } catch (error) {
        console.error('Error fetching compte:', error);
      } finally {
        setLoadingCompte(false);
      }
    };

    fetchCompte();
  }, [member.id_compte]);

  return (
    <ViewContainer>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ViewField 
          label="Member Information" 
          value={
            loadingCompte ? 'Loading...' : (
              compte ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#07f468]" />
                    <span>Name: {compte.nom} {compte.prenom}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#07f468]" />
                    <span>Email: {compte.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#07f468]" />
                    <span>Phone: {compte.telephone}</span>
                  </div>
                </div>
              ) : 'Unknown Member'
            )
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
  const [comptes, setComptes] = useState([]);
  const [formData, setFormData] = useState(member || {
    id_compte: "",
    id_activites: "",
    date_joined: new Date().toISOString().split('T')[0]
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchComptes = async () => {
      try {
        const response = await compteService.getAllComptes();
        setComptes(response.data);
      } catch (error) {
        console.error('Failed to fetch comptes:', error);
      }
    };
    fetchComptes();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.id_compte) newErrors.id_compte = 'Member is required';
    if (!formData.id_activites) newErrors.id_activites = 'Activity is required';
    if (!formData.date_joined) newErrors.date_joined = 'Join date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormSelect
        name="id_compte"
        label="Member"
        value={formData.id_compte}
        onChange={handleChange}
        options={comptes.map(compte => ({
          value: compte.id_compte,
          label: `${compte.nom} ${compte.prenom}`
        }))}
        error={errors.id_compte}
      />

      <FormSelect
        name="id_activites"
        label="Activity"
        value={formData.id_activites}
        onChange={handleChange}
        options={activities.map(a => ({ value: a.id_activites, label: a.title }))}
        error={errors.id_activites}
      />

      <FormInput
        name="date_joined"
        label="Join Date"
        type="date"
        value={formData.date_joined}
        onChange={handleChange}
        error={errors.date_joined}
        min={new Date().toISOString().split('T')[0]}
      />

      <div className="flex justify-end">
        <SubmitButton isUpdate={!!member} />
      </div>
    </form>
  );
};

// Add a confirmation modal component for delete operations
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, itemName }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Delete">
      <div className="space-y-4">
        <p className="text-gray-300">
          Are you sure you want to delete this {itemName}? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default FootballAcademieManagement;

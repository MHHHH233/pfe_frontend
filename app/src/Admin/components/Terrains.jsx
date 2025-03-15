import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CSVLink } from 'react-csv';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#07f468', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const FAKE_TERRAINS = [
  {
    id: 1,
    name: "Stadium Alpha",
    capacity: "5v5",
    type: "indoor",
    image: "https://via.placeholder.com/300",
    usage: 75
  },
  {
    id: 2,
    name: "Field Bravo",
    capacity: "6v6",
    type: "outdoor",
    image: "https://via.placeholder.com/300",
    usage: 60
  },
  {
    id: 3,
    name: "Arena Charlie",
    capacity: "7v7",
    type: "indoor",
    image: "https://via.placeholder.com/300",
    usage: 85
  },
  {
    id: 4,
    name: "Pitch Delta",
    capacity: "5v5",
    type: "outdoor",
    image: "https://via.placeholder.com/300",
    usage: 45
  },
  {
    id: 5,
    name: "Ground Echo",
    capacity: "6v6",
    type: "indoor",
    image: "https://via.placeholder.com/300",
    usage: 90
  }
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const buttonVariants = {
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95 }
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

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

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const shimmer = {
  animate: {
    background: ['hsl(0, 0%, 15%)', 'hsl(0, 0%, 25%)', 'hsl(0, 0%, 15%)'],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const Terrains = () => {
  const [terrains, setTerrains] = useState(FAKE_TERRAINS);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTerrain, setSelectedTerrain] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    type: 'indoor',
    image: 'https://via.placeholder.com/300',
    usage: 0
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [terrainToDelete, setTerrainToDelete] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Analytics Data
  const pieData = [
    { name: 'Indoor', value: terrains.filter(t => t.type === 'indoor').length },
    { name: 'Outdoor', value: terrains.filter(t => t.type === 'outdoor').length }
  ];

  const usageData = terrains.map(terrain => ({
    name: terrain.name,
    usage: terrain.usage
  }));

  const handleFileImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedTerrains = JSON.parse(e.target.result);
          setTerrains(importedTerrains);
          toast.success('Terrains imported successfully');
        } catch (error) {
          toast.error('Failed to import terrains');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleImageUpload = (e, setFormData, formData) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTerrain = (e) => {
    e.preventDefault();
    try {
      if (!formData.name || !formData.capacity) {
        toast.error('Please fill in all required fields');
        return;
      }
      
      const newTerrain = {
        id: terrains.length + 1,
        ...formData,
        usage: formData.usage || 0
      };
      
      setTerrains([...terrains, newTerrain]);
      toast.success('Terrain added successfully');
      setShowAddModal(false);
      setFormData({
        name: '',
        capacity: '',
        type: 'indoor',
        image: 'https://via.placeholder.com/300',
        usage: 0
      });
    } catch (error) {
      toast.error('Failed to add terrain');
    }
  };

  const handleUpdateTerrain = (e) => {
    e.preventDefault();
    try {
      if (!formData.name || !formData.capacity) {
        toast.error('Please fill in all required fields');
        return;
      }

      setTerrains(
        terrains.map((t) =>
          t.id === selectedTerrain.id ? { 
        ...t,
            ...formData,
            usage: formData.usage || t.usage || 0
          } : t
        )
      );
      toast.success('Terrain updated successfully');
      setShowEditModal(false);
      setSelectedTerrain(null);
      setFormData({
        name: '',
        capacity: '',
        type: 'indoor',
        image: 'https://via.placeholder.com/300',
        usage: 0
      });
    } catch (error) {
      toast.error('Failed to update terrain');
    }
  };

  const handleDeleteTerrain = (id) => {
    try {
      setTerrains(terrains.filter((t) => t.id !== id));
      toast.success('Terrain deleted successfully');
      setShowDeleteModal(false);
      setTerrainToDelete(null);
    } catch (error) {
      toast.error('Failed to delete terrain');
    }
  };

  return (
    <motion.div 
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="p-6 space-y-6 min-h-screen rounded-3xl bg-gray-900 "
    >
      <ToastContainer 
        position="bottom-right" 
        theme="dark" 
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="text-sm"
      />

      {/* Enhanced Header with 3D effect */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-gray-800/80 to-gray-900/80 p-4 md:p-6 rounded-xl shadow-lg backdrop-blur-xl border border-gray-700/50">
        <motion.h2 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="text-2xl md:text-4xl font-bold bg-[#07f468] bg-clip-text text-transparent flex items-center gap-3"
        >
          <Icon icon="mdi:terrain" width="40" className="text-[#07f468] filter drop-shadow-lg" />
          <span className="filter drop-shadow-lg bg-[#07f468] bg-clip-text text-transparent">Terrains Management</span>
        </motion.h2>
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="flex flex-wrap gap-2 md:gap-4"
        >
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
          >
            <Icon icon="mdi:chart-bar" />
            Analytics
          </motion.button>
          <CSVLink 
            data={terrains} 
            filename="terrains.csv"
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
          >
            <Icon icon="mdi:download" />
            Export
          </CSVLink>
          <label className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-xl transition-shadow">
            <Icon icon="mdi:upload" />
            Import
            <input
              type="file"
              accept=".json"
              onChange={handleFileImport}
              className="hidden"
            />
          </label>
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
          >
            <Icon icon={viewMode === 'grid' ? 'mdi:view-list' : 'mdi:grid'} />
            {viewMode === 'grid' ? 'List View' : 'Grid View'}
          </motion.button>
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-[#07f468] text-gray-900 font-semibold rounded-lg flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
          >
            <Icon icon="mdi:plus" />
            Add Terrain
          </motion.button>
        </motion.div>
      </div>

      {/* Enhanced Search with floating effect */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex gap-4"
      >
        <div className="flex-grow relative backdrop-blur-xl bg-gray-800/30 rounded-xl shadow-lg border border-gray-700/50 hover:border-[#07f468]/30 transition-all duration-300 group">
          <Icon 
            icon="mdi:search" 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-[#07f468] transition-colors duration-300"
            width="24"
          />
            <input
              type="text"
              placeholder="Search terrains..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-white pl-12 pr-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#07f468]/30 transition-all text-lg placeholder:text-gray-500"
            />
        </div>
      </motion.div>

      {/* Enhanced Analytics Section with 3D cards */}
      <AnimatePresence>
        {showAnalytics && (
          <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
            <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-lg shadow-lg">
              <h4 className="text-white mb-4 font-semibold">Terrain Types Distribution</h4>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-lg shadow-lg">
              <h4 className="text-white mb-4 font-semibold">Terrain Usage</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={usageData}>
                  <XAxis dataKey="name" stroke="#fff" />
                  <YAxis stroke="#fff" />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                  <Bar dataKey="usage" fill="#07f468">
                    {usageData.map((entry, index) => (
                      <Cell key={index} fill={`url(#colorGradient${index})`} />
                    ))}
                  </Bar>
                  <defs>
                    {usageData.map((entry, index) => (
                      <linearGradient key={index} id={`colorGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#07f468" stopOpacity={0.8}/>
                        <stop offset="100%" stopColor="#00c4ff" stopOpacity={0.8}/>
                      </linearGradient>
                    ))}
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Terrains Grid/List with better cards */}
      <motion.div 
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className={viewMode === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6' 
          : 'flex flex-col gap-4'
        }
      >
        {terrains.filter(
          terrain =>
            terrain.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            terrain.type.toLowerCase().includes(searchQuery.toLowerCase())
        ).map((terrain, index) => (
          <motion.div
            key={terrain.id}
            variants={cardVariants}
            className={`group bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 backdrop-blur-xl border border-gray-700/50 hover:border-[#07f468]/30 ${
              viewMode === 'list' ? 'flex flex-col sm:flex-row' : ''
            }`}
          >
            <div 
              className={`relative overflow-hidden ${
                viewMode === 'list' 
                  ? 'w-full sm:w-48 h-48' 
                  : 'w-full h-48 md:h-56'
              }`}
              onClick={() => {
                setSelectedImage(terrain.image);
                setShowImageModal(true);
              }}
            >
              <img
                src={terrain.image}
                alt={terrain.name}
                className={`${
                  viewMode === 'list' ? 'w-48 h-48' : 'w-full h-56'
                } object-cover transition-transform duration-700 group-hover:scale-110`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 1 }}
                  className="bg-white/10 p-3 rounded-full backdrop-blur-sm"
                >
                  <Icon icon="mdi:eye" className="text-white text-3xl" />
                </motion.div>
              </div>
            </div>
            <div className="p-4 md:p-6 flex-grow">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4">{terrain.name}</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="bg-gray-700/50 p-2 rounded-lg">
                    <Icon icon={terrain.type === 'indoor' ? 'mdi:home' : 'mdi:tree'} className="text-[#07f468] w-5 h-5" />
                  </div>
                  <span className="text-lg">{terrain.type}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="bg-gray-700/50 p-2 rounded-lg">
                    <Icon icon="mdi:account-group" className="text-[#07f468] w-5 h-5" />
                  </div>
                  <span className="text-lg">{terrain.capacity}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-gray-300">
                    <span>Usage</span>
                    <span className="font-semibold text-[#07f468]">{terrain.usage}%</span>
                  </div>
                  <div className="bg-gray-700/30 h-2 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${terrain.usage}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-[#07f468] to-[#00c4ff]"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => {
                    setSelectedTerrain(terrain);
                    setFormData(terrain);
                    setShowEditModal(true);
                  }}
                  className="flex-1 bg-[#07f468] text-gray-900 px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <Icon icon="mdi:pencil" />
                  Edit
                </motion.button>
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => {
                    setTerrainToDelete(terrain);
                    setShowDeleteModal(true);
                  }}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <Icon icon="mdi:delete" />
                  Delete
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Enhanced Modals with better transitions and styling */}
      <AnimatePresence>
        {(showAddModal || showEditModal) && (
          <motion.div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 md:p-6 rounded-lg w-full max-w-md mx-4 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Icon icon={showEditModal ? 'mdi:pencil' : 'mdi:plus'} className="text-[#07f468]" />
                {showEditModal ? 'Edit Terrain' : 'Add New Terrain'}
              </h2>
              <form onSubmit={showEditModal ? handleUpdateTerrain : handleAddTerrain} className="space-y-4 md:space-y-6">
                <div>
                  <label className="block text-white mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Capacity</label>
                  <select
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
                    required
                  >
                    <option value="">Select Capacity</option>
                    <option value="5v5">5v5</option>
                    <option value="6v6">6v6</option>
                    <option value="7v7">7v7</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
                  >
                    <option value="indoor">Indoor</option>
                    <option value="outdoor">Outdoor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white mb-2">Image</label>
                  <div className="flex gap-4 items-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, setFormData, formData)}
                      className="hidden"
                      id="imageInput"
                    />
                    <label
                      htmlFor="imageInput"
                      className="bg-gray-700 text-white px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2 hover:bg-gray-600 transition-colors"
                    >
                      <Icon icon="mdi:upload" />
                      Choose Image
                    </label>
                    {formData.image && (
                      <div className="relative w-16 h-16">
                        <img
                          src={formData.image}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, image: 'https://via.placeholder.com/300' })}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <Icon icon="mdi:close" className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-white mb-2">Usage (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.usage}
                    onChange={(e) => setFormData({ ...formData, usage: parseInt(e.target.value) || 0 })}
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
                  />
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 mt-6">
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setShowEditModal(false);
                      setSelectedTerrain(null);
                      setFormData({
                        name: '',
                        capacity: '',
                        type: 'indoor',
                        image: 'https://via.placeholder.com/300',
                        usage: 0
                      });
                    }}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    <Icon icon="mdi:close" />
                    Cancel
                  </motion.button>
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    type="submit"
                    className="bg-[#07f468] text-gray-900 px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    <Icon icon={showEditModal ? 'mdi:check' : 'mdi:plus'} />
                    {showEditModal ? 'Update' : 'Add'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Enhanced Delete Modal */}
        {showDeleteModal && (
          <motion.div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-lg w-full max-w-md shadow-2xl">
              <div className="flex items-start gap-4">
                <div className="bg-red-500/10 p-3 rounded-full">
                  <Icon icon="mdi:alert" className="text-red-500 w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Confirm Deletion</h2>
                  <p className="text-gray-300 mb-6">
                    Are you sure you want to delete "{terrainToDelete?.name}"? This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setTerrainToDelete(null);
                  }}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg flex items-center gap-2 hover:bg-gray-600 transition-colors"
                >
                  <Icon icon="mdi:close" />
                  Cancel
                </motion.button>
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => handleDeleteTerrain(terrainToDelete.id)}
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <Icon icon="mdi:delete" />
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Image Preview Modal */}
        {showImageModal && selectedImage && (
          <motion.div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div className="relative max-w-4xl w-full mx-4">
              <img
                src={selectedImage}
                alt="Terrain Preview"
                className="w-full h-auto rounded-lg shadow-2xl"
              />
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => {
                  setShowImageModal(false);
                  setSelectedImage(null);
                }}
                className="absolute -top-4 -right-4 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-colors"
              >
                <Icon icon="mdi:close" className="w-6 h-6" />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Terrains;
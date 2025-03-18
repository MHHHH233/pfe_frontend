import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CSVLink } from 'react-csv';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import terrainService from '../../lib/services/admin/terrainServices';

const COLORS = ['#07f468', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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
  const [terrains, setTerrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    prix: '',
    image: null,
    imagePreview: null
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

  const priceData = terrains.map(terrain => ({
    name: terrain.name,
    prix: terrain.prix
  }));

  // Fetch terrains
  useEffect(() => {
    fetchTerrains();
  }, []);

  const fetchTerrains = async () => {
    try {
      setLoading(true);
      const response = await terrainService.getAllTerrains();
      setTerrains(response.data);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch terrains:', error);
      setError('Failed to load terrains');
      toast.error('Failed to load terrains');
    } finally {
      setLoading(false);
    }
  };

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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        image: file,
        imagePreview: imageUrl
      }));
    }
  };

  const handleImageRemove = () => {
    setFormData({ ...formData, image: null, imagePreview: null });
  };

  // Handle Add Terrain
  const handleAddTerrain = async (e) => {
    e.preventDefault();
    try {
      if (!formData.name || !formData.capacity || !formData.prix) {
        toast.error('Please fill in all required fields');
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('nom_terrain', formData.name);
      formDataToSend.append('capacite', formData.capacity);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('prix', formData.prix);
      if (formData.image instanceof File) {
        formDataToSend.append('image', formData.image);
      }

      const response = await terrainService.createTerrain(formDataToSend);
      await fetchTerrains(); // Refresh the list
      toast.success('Terrain added successfully');
      setShowAddModal(false);
      setFormData({
        name: '',
        capacity: '',
        type: 'indoor',
        prix: '',
        image: null,
        imagePreview: null
      });
    } catch (error) {
      console.error('Failed to add terrain:', error);
      toast.error(error.response?.data?.message || 'Failed to add terrain');
    }
  };

  // Handle Update Terrain
  const handleUpdateTerrain = async (e) => {
    e.preventDefault();
    try {
      if (!formData.name || !formData.capacity || !formData.prix) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Always use FormData for consistency
      const formDataToSend = new FormData();
      formDataToSend.append('nom_terrain', formData.name);
      formDataToSend.append('capacite', formData.capacity);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('prix', formData.prix);

      // Only append image if it's a new File object
      if (formData.image instanceof File) {
        formDataToSend.append('image', formData.image);
      }

      await terrainService.updateTerrain(selectedTerrain.id_terrain, formDataToSend);
      await fetchTerrains(); // Refresh the list
      toast.success('Terrain updated successfully');
      setShowEditModal(false);
      setSelectedTerrain(null);
      setFormData({
        name: '',
        capacity: '',
        type: 'indoor',
        prix: '',
        image: null,
        imagePreview: null
      });
    } catch (error) {
      console.error('Failed to update terrain:', error);
      toast.error(error.response?.data?.error || 'Failed to update terrain');
    }
  };

  const handleEdit = (terrain) => {
    setSelectedTerrain(terrain);
    setFormData({
      name: terrain.nom_terrain,
      capacity: terrain.capacite,
      type: terrain.type,
      prix: terrain.prix,
      image: terrain.image_path,
      imagePreview: terrain.image_path ? `http://127.0.0.1:8000/${terrain.image_path}` : null
    });
    setShowEditModal(true);
  };

  // Handle Delete Terrain
  const handleDeleteTerrain = async (id) => {
    try {
      await terrainService.deleteTerrain(id);
      await fetchTerrains(); // Refresh the list
      toast.success('Terrain deleted successfully');
      setShowDeleteModal(false);
      setTerrainToDelete(null);
    } catch (error) {
      console.error('Failed to delete terrain:', error);
      toast.error('Failed to delete terrain');
    }
  };

  const resetFormData = () => {
    if (formData.imagePreview) {
      URL.revokeObjectURL(formData.imagePreview);
    }
    setFormData({
      name: '',
      capacity: '',
      type: 'indoor',
      prix: '',
      image: null,
      imagePreview: null
    });
  };

  // Clean up preview URLs when component unmounts
  useEffect(() => {
    return () => {
      if (formData.imagePreview) {
        URL.revokeObjectURL(formData.imagePreview);
      }
    };
  }, []);

  // Clean up preview URL when modal closes
  useEffect(() => {
    if (!showAddModal && !showEditModal) {
      resetFormData();
    }
  }, [showAddModal, showEditModal]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#07f468]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={fetchTerrains}
          className="px-4 py-2 bg-[#07f468] text-black rounded-lg hover:bg-[#06d35a]"
        >
          Retry
        </button>
      </div>
    );
  }

  const renderAnalytics = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
      <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-lg shadow-lg">
        <h4 className="text-white mb-4 font-semibold">Terrain Types Distribution</h4>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#07f468"
              dataKey="value"
              label
            >
              {pieData.map((entry, index) => (
                <Cell 
                  key={index} 
                  fill={index === 0 ? '#07f468' : '#06d35a'} 
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: 'none',
                borderRadius: '8px'
              }} 
            />
            <Legend 
              wrapperStyle={{
                paddingTop: '20px'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-lg shadow-lg">
        <h4 className="text-white mb-4 font-semibold">Price Distribution</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={priceData}>
            <XAxis 
              dataKey="name" 
              stroke="#fff" 
              tick={{ fill: '#fff' }}
            />
            <YAxis 
              stroke="#fff" 
              tick={{ fill: '#fff' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: 'none',
                borderRadius: '8px'
              }} 
            />
            <Bar 
              dataKey="prix" 
              name="Price (DH)" 
              fill="#07f468"
            >
              {priceData.map((entry, index) => (
                <Cell 
                  key={index} 
                  fill={`url(#priceGradient)`} 
                />
              ))}
            </Bar>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#07f468" stopOpacity={0.8}/>
                <stop offset="100%" stopColor="#06d35a" stopOpacity={0.8}/>
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

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
            className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
          >
            <Icon icon={showAnalytics ? "mdi:chart-off" : "mdi:chart-bar"} />
            {showAnalytics ? "Hide Analytics" : "Show Analytics"}
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
        {showAnalytics && renderAnalytics()}
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
            (terrain?.nom_terrain || '')
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            (terrain?.type || '')
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
        ).map((terrain, index) => (
          <motion.div
            key={terrain.id_terrain}
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
                src={terrain.image ? `http://127.0.0.1:8000/${terrain.image}` : ''}
                alt={terrain.nom_terrain}
                className={`${
                  viewMode === 'list' ? 'w-48 h-48' : 'w-full h-56'
                } object-cover transition-transform duration-700 group-hover:scale-110`}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
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
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
                {terrain.nom_terrain}
              </h3>
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
                  <span className="text-lg">{terrain.capacite}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-gray-300">
                    <span>Price</span>
                    <span className="font-semibold text-[#07f468]">{terrain.prix} DH</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => handleEdit(terrain)}
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
            <motion.div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 md:p-6 rounded-lg w-full max-w-md shadow-2xl">
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
                  <label className="block text-white mb-2">prix</label>
                  <input
                    type="number"
                    value={formData.prix}
                    onChange={(e) => setFormData({ ...formData, prix: parseInt(e.target.value) || 0 })}
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Image</label>
                  <div className="flex gap-4 items-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
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
                    {(formData.imagePreview || formData.image) && (
                      <div className="relative w-16 h-16">
                        <img
                          src={formData.imagePreview || (formData.image ? `http://127.0.0.1:8000/${formData.image}` : '')}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleImageRemove}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <Icon icon="mdi:close" className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
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
                        prix: '',
                        image: null,
                        imagePreview: null
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
                    Are you sure you want to delete "{terrainToDelete?.nom_terrain}"? This action cannot be undone.
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
                  onClick={() => handleDeleteTerrain(terrainToDelete.id_terrain)}
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
                src={selectedImage ? `http://127.0.0.1:8000/${selectedImage}` : ''}
                alt="Terrain Preview"
                className="w-full h-auto rounded-lg shadow-2xl"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
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
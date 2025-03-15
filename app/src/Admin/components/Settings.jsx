import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Edit, Trash2, Plus, Save, X, CheckCircle, AlertCircle } from 'lucide-react';

// Animation variants
const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const buttonVariants = {
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95 },
};

// Mock data for settings
const MOCK_SETTINGS = [
  { id: 1, category: 'General', key: 'theme', value: 'dark', description: 'Application theme' },
  { id: 2, category: 'General', key: 'language', value: 'en', description: 'Default language' },
  { id: 3, category: 'Notifications', key: 'email_notifications', value: 'enabled', description: 'Enable email notifications' },
];

const SettingsManagement = () => {
  const [settings, setSettings] = useState(MOCK_SETTINGS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [settingToDelete, setSettingToDelete] = useState(null);

  // Handle adding a new setting
  const handleAdd = (settingData) => {
    const newSetting = {
      ...settingData,
      id: Date.now(),
    };
    setSettings((prev) => [...prev, newSetting]);
    setShowAddModal(false);
  };

  // Handle updating a setting
  const handleUpdate = (settingData) => {
    setSettings((prev) =>
      prev.map((s) => (s.id === settingData.id ? settingData : s))
    );
    setSelectedSetting(null);
  };

  // Handle deleting a setting
  const handleDelete = (settingId) => {
    setSettings((prev) => prev.filter((s) => s.id !== settingId));
    setIsDeleteModalOpen(false);
  };

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6 space-y-8"
    >
      {/* Header */}
      <div className="flex justify-between items-center bg-gradient-to-r from-gray-800/80 to-gray-900/80 p-6 rounded-xl shadow-lg backdrop-blur-xl border border-gray-700/50">
        <motion.h1
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="text-4xl font-bold bg-gradient-to-r from-[#07f468] via-[#00c4ff] to-[#07f468] bg-clip-text text-transparent flex items-center gap-3"
        >
          <Settings className="text-[#07f468] w-10 h-10" />
          Settings Management
        </motion.h1>
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={() => setShowAddModal(true)}
          className="bg-[#07f468] text-gray-900 px-6 py-2 rounded-lg font-bold hover:bg-[#06d35a] transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Setting
        </motion.button>
      </div>

      {/* Settings List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {settings.map((setting) => (
            <motion.div
              key={setting.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 backdrop-blur-xl border border-gray-700/50"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">{setting.key}</h3>
                  <p className="text-gray-400">{setting.description}</p>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => setSelectedSetting(setting)}
                    className="p-2 bg-gray-700/50 text-gray-400 rounded-lg hover:text-white transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => {
                      setSettingToDelete(setting);
                      setIsDeleteModalOpen(true);
                    }}
                    className="p-2 bg-gray-700/50 text-gray-400 rounded-lg hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-gray-400 text-sm">Value</p>
                <p className="text-white font-medium">{setting.value}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add/Edit Setting Modal */}
      <AnimatePresence>
        {(showAddModal || selectedSetting) && (
          <SettingModal
            setting={selectedSetting}
            onClose={() => {
              setShowAddModal(false);
              setSelectedSetting(null);
            }}
            onSave={(settingData) => {
              if (selectedSetting) {
                handleUpdate(settingData);
              } else {
                handleAdd(settingData);
              }
              setShowAddModal(false);
              setSelectedSetting(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          handleDelete(settingToDelete?.id);
          setIsDeleteModalOpen(false);
        }}
        itemName={settingToDelete ? `the setting "${settingToDelete.key}"` : 'this setting'}
      />
    </motion.div>
  );
};

// Setting Modal Component
const SettingModal = ({ setting, onClose, onSave }) => {
  const [formData, setFormData] = useState(
    setting || { category: '', key: '', value: '', description: '' }
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
        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto border border-gray-700/50"
      >
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <Settings className="w-8 h-8 text-[#07f468]" />
          {setting ? 'Edit Setting' : 'Add New Setting'}
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(formData);
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-gray-400 mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07f468] backdrop-blur-xl"
              required
            >
              <option value="">Select Category</option>
              <option value="General">General</option>
              <option value="Notifications">Notifications</option>
              <option value="Security">Security</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-400 mb-2">Key</label>
            <input
              type="text"
              value={formData.key}
              onChange={(e) => setFormData({ ...formData, key: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07f468] backdrop-blur-xl"
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">Value</label>
            <input
              type="text"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07f468] backdrop-blur-xl"
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#07f468] backdrop-blur-xl"
              rows="3"
              required
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
              {setting ? 'Update' : 'Create'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// Delete Confirmation Modal
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
          Are you sure you want to delete {itemName}? This action cannot be undone.
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

export default SettingsManagement;
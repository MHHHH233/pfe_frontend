import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Loader, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';

const TeamForm = ({ onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    team_name: '',
    description: '',
    logo: null,
    logo_preview: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        logo: file,
        logo_preview: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.team_name.trim()) {
      toast.error("Team name is required");
      return;
    }
    
    // Create FormData object for API submission
    const apiFormData = new FormData();
    apiFormData.append('team_name', formData.team_name);
    apiFormData.append('description', formData.description);
    if (formData.logo) {
      apiFormData.append('logo', formData.logo);
    }
    
    onSubmit(apiFormData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        className="bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] rounded-lg overflow-hidden shadow-2xl max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Users className="w-6 h-6 text-[#07f468] mr-2" />
              <h2 className="text-xl font-bold">Create Your Team</h2>
            </div>
            <button
              className="text-gray-400 hover:text-white"
              onClick={onClose}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="team_name" className="block text-sm font-medium text-gray-300 mb-1">
                Team Name*
              </label>
              <input
                type="text"
                id="team_name"
                name="team_name"
                value={formData.team_name}
                onChange={handleChange}
                className="w-full p-3 bg-[#333] text-white rounded-lg border border-[#444] focus:outline-none focus:ring-2 focus:ring-[#07f468] focus:border-transparent"
                placeholder="Enter your team name"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                Team Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full p-3 bg-[#333] text-white rounded-lg border border-[#444] focus:outline-none focus:ring-2 focus:ring-[#07f468] focus:border-transparent"
                placeholder="Tell us about your team"
              ></textarea>
            </div>

            <div className="mb-6">
              <label htmlFor="logo" className="block text-sm font-medium text-gray-300 mb-1">
                Team Logo
              </label>
              <div className="flex items-center">
                {formData.logo_preview && (
                  <div className="mr-4">
                    <img 
                      src={formData.logo_preview} 
                      alt="Team logo preview" 
                      className="w-16 h-16 object-cover rounded-full border-2 border-[#07f468]" 
                    />
                  </div>
                )}
                <div className="flex-1">
                  <input
                    type="file"
                    id="logo"
                    name="logo"
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <label 
                    htmlFor="logo" 
                    className="cursor-pointer block w-full p-3 bg-[#333] text-gray-300 rounded-lg border border-dashed border-[#444] hover:border-[#07f468] transition-colors text-center"
                  >
                    {formData.logo ? 'Change Logo' : 'Upload Logo (Optional)'}
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-[#333] hover:bg-[#444] text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 bg-gradient-to-r from-[#07f468] to-[#06d35a] text-[#1a1a1a] font-medium rounded-lg hover:from-[#06d35a] hover:to-[#07f468] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loader className="w-4 h-4 animate-spin mr-2" />
                    Creating...
                  </div>
                ) : (
                  'Create Team'
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TeamForm; 
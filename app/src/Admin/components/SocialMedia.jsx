import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Check, X, Edit, Save } from 'lucide-react';
import socialMediaService from '../../lib/services/admin/socialMediaService';

const SocialMediaManagement = () => {
  const [socialMedia, setSocialMedia] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState({
    instagram: '',
    facebook: '',
    x: '',
    whatsapp: '',
    email: '',
    localisation: '',
    telephone: '',
    address: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch social media data
  useEffect(() => {
    const fetchSocialMedia = async () => {
      try {
        setLoading(true);
        const response = await socialMediaService.getSocialMedia();
        
        if (response.status === 'success') {
          setSocialMedia(response.data);
          setFormValues(response.data);
        } else {
          setError('Failed to fetch social media data');
        }
      } catch (err) {
        setError('An error occurred while fetching social media data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSocialMedia();
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await socialMediaService.updateSocialMedia(formValues);
      
      if (response.status === 'success') {
        setSocialMedia(response.data);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        setIsEditing(false);
      } else {
        setError('Failed to update social media data');
      }
    } catch (err) {
      setError('An error occurred while updating social media data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !socialMedia) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-[#07f468] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#07f468]">Social Media Management</h2>
        {!isEditing ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditing(true)}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center"
          >
            <Edit size={18} className="mr-2" />
            Edit Information
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setIsEditing(false);
              setFormValues(socialMedia); // Reset form values
            }}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center"
          >
            <X size={18} className="mr-2" />
            Cancel
          </motion.button>
        )}
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-red-900/20 border border-red-500 p-4 rounded-lg text-red-300"
        >
          {error}
        </motion.div>
      )}

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-green-900/20 border border-green-500 p-4 rounded-lg text-green-300 flex items-center"
          >
            <Check size={18} className="mr-2" />
            Social media information updated successfully
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-gray-800 rounded-xl shadow-lg p-6">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-[#07f468]">Social Media</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Facebook</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Facebook size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="facebook"
                        value={formValues.facebook || ''}
                        onChange={handleChange}
                        placeholder="Facebook URL"
                        className="w-full p-3 pl-10 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#07f468] focus:outline-none"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Instagram</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Instagram size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="instagram"
                        value={formValues.instagram || ''}
                        onChange={handleChange}
                        placeholder="Instagram URL"
                        className="w-full p-3 pl-10 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#07f468] focus:outline-none"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Twitter (X)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Twitter size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="x"
                        value={formValues.x || ''}
                        onChange={handleChange}
                        placeholder="Twitter/X URL"
                        className="w-full p-3 pl-10 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#07f468] focus:outline-none"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">WhatsApp</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="whatsapp"
                        value={formValues.whatsapp || ''}
                        onChange={handleChange}
                        placeholder="WhatsApp Number"
                        className="w-full p-3 pl-10 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#07f468] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4 text-[#07f468]">Contact Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formValues.email || ''}
                        onChange={handleChange}
                        placeholder="Email Address"
                        className="w-full p-3 pl-10 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#07f468] focus:outline-none"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="telephone"
                        value={formValues.telephone || ''}
                        onChange={handleChange}
                        placeholder="Phone Number"
                        className="w-full p-3 pl-10 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#07f468] focus:outline-none"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin size={18} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="localisation"
                        value={formValues.localisation || ''}
                        onChange={handleChange}
                        placeholder="Location"
                        className="w-full p-3 pl-10 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#07f468] focus:outline-none"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Address</label>
                    <textarea
                      name="address"
                      value={formValues.address || ''}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Full Address"
                      className="w-full p-3 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#07f468] focus:outline-none"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="bg-[#07f468] hover:bg-[#06d35a] text-gray-900 px-6 py-3 rounded-lg flex items-center font-medium"
                disabled={loading}
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full mr-2"
                  />
                ) : (
                  <Save size={18} className="mr-2" />
                )}
                Save Changes
              </motion.button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-[#07f468]">Social Media</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-900/30 p-2 rounded-lg">
                    <Facebook size={24} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Facebook</p>
                    <p className="text-white truncate max-w-xs">{socialMedia?.facebook || 'Not set'}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="bg-pink-900/30 p-2 rounded-lg">
                    <Instagram size={24} className="text-pink-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Instagram</p>
                    <p className="text-white truncate max-w-xs">{socialMedia?.instagram || 'Not set'}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="bg-gray-700 p-2 rounded-lg">
                    <Twitter size={24} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Twitter (X)</p>
                    <p className="text-white truncate max-w-xs">{socialMedia?.x || 'Not set'}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="bg-green-900/30 p-2 rounded-lg">
                    <Phone size={24} className="text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">WhatsApp</p>
                    <p className="text-white truncate max-w-xs">{socialMedia?.whatsapp || 'Not set'}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4 text-[#07f468]">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-900/30 p-2 rounded-lg">
                    <Mail size={24} className="text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Email</p>
                    <p className="text-white truncate max-w-xs">{socialMedia?.email || 'Not set'}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="bg-yellow-900/30 p-2 rounded-lg">
                    <Phone size={24} className="text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Phone Number</p>
                    <p className="text-white truncate max-w-xs">{socialMedia?.telephone || 'Not set'}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="bg-red-900/30 p-2 rounded-lg">
                    <MapPin size={24} className="text-red-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Location</p>
                    <p className="text-white truncate max-w-xs">{socialMedia?.localisation || 'Not set'}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-indigo-900/30 p-2 rounded-lg">
                    <MapPin size={24} className="text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Address</p>
                    <p className="text-white">{socialMedia?.address || 'Not set'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialMediaManagement; 
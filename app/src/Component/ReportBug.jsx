import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bug, CheckCircle, AlertCircle, Send, X, LogIn } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import reportedBugsService from '../lib/services/user/reportedBugsService';

const ReportBug = () => {
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  
  const userId = sessionStorage.getItem("userId") || null;
  
  useEffect(() => {
    // Check if user is logged in
    setIsLoggedIn(userId !== null);
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      setError("You must be logged in to report a bug");
      return;
    }
    
    if (!description.trim()) {
      setError("Please provide a description of the bug");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const formData = {
        id_compte: userId ? parseInt(userId) : null,
        description: description.trim()
      };
      
      // Make API call to report bug
      const response = await reportedBugsService.createBugReport(formData);
      
      if (response.success || response.data) {
        setShowSuccess(true);
        setDescription('');
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      } else {
        if (response.error && response.error.id_compte) {
          setError("You must be logged in to report a bug");
        } else {
          setError(response.message || "Failed to submit bug report");
        }
      }
    } catch (error) {
      console.error("Error submitting bug report:", error);
      if (error.response && error.response.data && error.response.data.error && error.response.data.error.id_compte) {
        setError("You must be logged in to report a bug");
      } else {
        setError(error.message || "An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] pt-10 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block p-3 bg-red-500/10 rounded-full mb-4"
          >
            <Bug size={40} className="text-red-400" />
          </motion.div>
          
          <motion.h1 
            className="text-4xl font-bold text-white mb-4"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Report a Bug
          </motion.h1>
          
          <motion.p 
            className="text-gray-400 max-w-2xl mx-auto text-lg"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Found an issue with our platform? Let us know so we can fix it and improve your experience.
          </motion.p>
        </div>
        
        <motion.div 
          className="bg-gray-900 rounded-xl shadow-xl border border-gray-800 overflow-hidden"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="p-6 sm:p-10">
            <AnimatePresence>
              {showSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-green-900/20 border border-green-500/30 rounded-lg p-6 text-center"
                >
                  <CheckCircle size={60} className="mx-auto text-green-500 mb-4" />
                  <h3 className="text-2xl font-semibold text-white mb-2">Bug Report Submitted!</h3>
                  <p className="text-gray-300 mb-6">
                    Thank you for helping us improve our platform. We'll look into this issue as soon as possible.
                  </p>
                  <div className="flex justify-center gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setShowSuccess(false);
                        setDescription('');
                      }}
                      className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Report Another Bug
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/')}
                      className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                    >
                      Return Home
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <>
                  {!isLoggedIn ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6 text-center"
                    >
                      <LogIn size={60} className="mx-auto text-blue-500 mb-4" />
                      <h3 className="text-2xl font-semibold text-white mb-2">Login Required</h3>
                      <p className="text-gray-300 mb-6">
                        You need to be logged in to report bugs. Please sign in to continue.
                      </p>
                      <div className="flex justify-center gap-4">
                        <Link to="/sign-in">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                          >
                            Sign In
                          </motion.button>
                        </Link>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => navigate('/')}
                          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                        >
                          Return Home
                        </motion.button>
                      </div>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      {error && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg flex items-start"
                        >
                          <AlertCircle size={20} className="text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-red-400">{error}</p>
                          </div>
                          <button 
                            type="button" 
                            onClick={() => setError(null)}
                            className="text-gray-400 hover:text-white"
                          >
                            <X size={16} />
                          </button>
                        </motion.div>
                      )}
                      
                      <div className="mb-8">
                        <label htmlFor="description" className="block text-white font-medium mb-2">
                          Bug Description
                        </label>
                        <textarea
                          id="description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          rows={6}
                          placeholder="Please describe the issue in detail. What happened? What did you expect to happen? Include any steps to reproduce the bug."
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
                          required
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          type="submit"
                          disabled={isSubmitting}
                          className={`px-8 py-3 rounded-lg flex items-center font-medium transition-all ${
                            isSubmitting 
                              ? 'bg-gray-600 cursor-not-allowed' 
                              : 'bg-green-600 hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/20'
                          }`}
                        >
                          {isSubmitting ? (
                            <>
                              <span className="mr-2">Submitting</span>
                              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                            </>
                          ) : (
                            <>
                              Submit Report
                              <Send size={18} className="ml-2" />
                            </>
                          )}
                        </motion.button>
                      </div>
                    </form>
                  )}
                </>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
        
        <motion.div 
          className="mt-12 bg-gray-900 rounded-xl border border-gray-800 p-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold text-white mb-4">Common Issues</h2>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span>If you're having trouble with reservations, make sure you've selected a valid date and time.</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span>Login issues can often be resolved by clearing your browser cache or using the "forgot password" option.</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              <span>Payment processing issues might require you to check with your bank or try a different payment method.</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default ReportBug;
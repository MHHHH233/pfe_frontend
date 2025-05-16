import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  User,
  Settings,
  LogOut,
  UserCircle,
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import { authService } from '../../lib/services/authoServices';

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      // Clear session storage and redirect regardless of response
      sessionStorage.clear();
      window.location.href = '/'; // Redirect to signin page
    } catch (error) { 
      console.error('Logout error:', error);
      // Still clear and redirect even if there's an error
      sessionStorage.clear();
      window.location.href = '/sign-in';
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="text-white focus:outline-none"
      >
        <User size={24} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700 z-50"
          >
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-[#07f468] font-bold">
                  <UserCircle size={28} />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">Admin User</p>
                  <p className="text-xs text-gray-400">admin@terrainfc.com</p>
                </div>
              </div>
            </div>

            <div className="py-2">
              <Link 
                to="/profile" 
                className="flex items-center px-4 py-3 text-sm text-white hover:bg-gray-700 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <User size={16} className="mr-3 text-gray-400" />
                Your Profile
                <ChevronRight size={16} className="ml-auto text-gray-500" />
              </Link>
              
              <Link 
                to="/settings" 
                className="flex items-center px-4 py-3 text-sm text-white hover:bg-gray-700 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Settings size={16} className="mr-3 text-gray-400" />
                Settings
                <ChevronRight size={16} className="ml-auto text-gray-500" />
              </Link>
              
              <Link 
                to="/help" 
                className="flex items-center px-4 py-3 text-sm text-white hover:bg-gray-700 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <HelpCircle size={16} className="mr-3 text-gray-400" />
                Help Center
                <ChevronRight size={16} className="ml-auto text-gray-500" />
              </Link>
            </div>
            
            <div className="py-2 border-t border-gray-700">
              <button 
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 text-sm text-white hover:bg-gray-700 transition-colors text-left"
              >
                <LogOut size={16} className="mr-3 text-gray-400" />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserMenu; 
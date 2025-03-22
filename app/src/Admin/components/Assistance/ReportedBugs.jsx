import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bug, 
  Trash2, 
  Edit, 
  Plus, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  X,
  Check,
  MoreVertical,
  AlertCircle,
  Eye
} from 'lucide-react';
import reportedBugsService from '../../../lib/services/admin/reportedBugsService';
import compteService from '../../../lib/services/admin/compteServices';

// Status constants
const STATUS_PENDING = 'pending';
const STATUS_IN_PROGRESS = 'in_progress';
const STATUS_RESOLVED = 'resolved';
const STATUS_REJECTED = 'rejected';

const useClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};

const ReportedBugs = () => {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedBug, setSelectedBug] = useState(null);
  const [formData, setFormData] = useState({
    id_compte: '',
    description: '',
    status: STATUS_PENDING
  });
  const [activeMenu, setActiveMenu] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bugToDelete, setBugToDelete] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: 'success' });
  const [userDetails, setUserDetails] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const menuRef = useRef(null);

  const fetchUserDetails = async (userId) => {
    try {
      const response = await compteService.getCompte(userId);
      setUserDetails(prev => ({ ...prev, [userId]: response.data }));
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const fetchAllUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await compteService.getAllComptes();
      if (response.success && Array.isArray(response.data)) {
        setAllUsers(response.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchBugs = async () => {
    try {
      setLoading(true);
      const response = await reportedBugsService.getAllReportedBugs({
        paginationSize: 10,
        page: currentPage,
        search: searchQuery,
        sort_by: 'id_bug',
        sort_order: 'desc',
        status: statusFilter !== 'all' ? statusFilter : undefined
      });
      
      if (response && Array.isArray(response.data)) {
        setBugs(response.data);
        if (response.meta) {
          setTotalPages(Math.ceil(response.meta.total / 10));
        }
        
        // Fetch user details for each bug
        const userIds = [...new Set(response.data.map(bug => bug.id_compte))];
        userIds.forEach(fetchUserDetails);
        
        setError(null);
      } else {
        console.error('Invalid response format:', response);
        setError('Invalid response format from server');
      }
    } catch (err) {
      console.error('Error fetching bugs:', err);
      setError('Failed to load reported bugs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBugs();
    fetchAllUsers();
  }, [currentPage, searchQuery, statusFilter]);

  useClickOutside(menuRef, () => {
    if (activeMenu) setActiveMenu(null);
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedBug) {
        await reportedBugsService.updateReportedBug(selectedBug.id_bug, formData);
        showSuccessNotification('Bug report updated successfully');
      } else {
        await reportedBugsService.createReportedBug(formData);
        showSuccessNotification('Bug report created successfully');
      }
      setShowForm(false);
      setSelectedBug(null);
      setFormData({ id_compte: '', description: '', status: STATUS_PENDING });
      fetchBugs();
    } catch (err) {
      showErrorNotification(selectedBug ? 'Failed to update bug report' : 'Failed to create bug report');
    }
  };

  const handleViewBug = (bug) => {
    setSelectedBug(bug);
    setShowViewModal(true);
  };

  const handleEdit = (bug) => {
    setSelectedBug(bug);
    setFormData({
      id_compte: bug.id_compte,
      description: bug.description,
      status: bug.status || STATUS_PENDING
    });
    setShowForm(true);
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await reportedBugsService.updateStatus(id, status);
      showSuccessNotification(`Bug report status updated to ${status}`);
      fetchBugs();
    } catch (error) {
      console.error('Error updating bug status:', error);
      showErrorNotification('Failed to update bug status');
    }
  };

  const handleDeleteBug = async (id) => {
    try {
      await reportedBugsService.deleteReportedBug(id);
      showSuccessNotification('Bug report deleted successfully');
      fetchBugs();
    } catch (error) {
      console.error('Error deleting bug:', error);
      showErrorNotification('Failed to delete bug report');
    }
  };

  const showSuccessNotification = (message) => {
    setNotification({ message, type: 'success' });
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const showErrorNotification = (message) => {
    setNotification({ message, type: 'error' });
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case STATUS_RESOLVED:
        return 'text-green-400';
      case STATUS_IN_PROGRESS:
        return 'text-yellow-400';
      case STATUS_REJECTED:
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getUserFullName = (userId) => {
    const user = userDetails[userId];
    if (!user) return `User #${userId}`;
    return `${user.nom} ${user.prenom}`.trim();
  };

  const filteredBugs = bugs.filter(bug =>
    bug.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#07f468] mb-2">Bug Reports</h2>
          <p className="text-gray-400 text-sm">Manage reported bugs and issues</p>
        </div>
        <button
          onClick={() => {
            setSelectedBug(null);
            setFormData({ id_compte: '', description: '', status: STATUS_PENDING });
            setShowForm(true);
          }}
          className="px-4 py-2 bg-[#07f468] text-gray-900 rounded-lg hover:bg-[#06d45a] transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          New Bug Report
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search bug reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#07f468] focus:border-transparent"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#07f468] focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value={STATUS_PENDING}>Pending</option>
          <option value={STATUS_IN_PROGRESS}>In Progress</option>
          <option value={STATUS_RESOLVED}>Resolved</option>
          <option value={STATUS_REJECTED}>Rejected</option>
        </select>
      </div>

      {/* Bug Reports List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#07f468]"></div>
        </div>
      ) : error ? (
        <div className="bg-red-900/20 border border-red-500 p-4 rounded-lg text-center">
          <p className="text-red-400 mb-2">{error}</p>
          <button 
            onClick={fetchBugs}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      ) : filteredBugs.length === 0 ? (
        <div className="text-center py-12 bg-gray-800 rounded-lg">
          <Bug className="mx-auto h-12 w-12 text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No bug reports found</h3>
          <p className="text-gray-400">No bug reports match your search criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBugs.map((bug) => (
            <motion.div
              key={bug.id_bug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700 h-full flex flex-col"
            >
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className={getStatusColor(bug.status)} size={20} />
                    <h3 className="text-lg font-semibold text-white truncate">Bug Report #{bug.id_bug}</h3>
                  </div>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusColor(bug.status)} bg-gray-900 mb-2`}>
                    {bug.status || STATUS_PENDING}
                  </span>
                  <p className="text-gray-400 line-clamp-3">{bug.description}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className="text-sm text-gray-500 truncate">
                    Reported by: {getUserFullName(bug.id_compte)}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm text-gray-500">
                      {new Date(bug.created_at).toLocaleDateString()}
                    </p>
                    <div className="relative" ref={menuRef}>
                      <button
                        onClick={() => setActiveMenu(activeMenu === bug.id_bug ? null : bug.id_bug)}
                        className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                      >
                        <MoreVertical size={20} className="text-gray-400" />
                      </button>
                      
                      <AnimatePresence>
                        {activeMenu === bug.id_bug && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-xl border border-gray-700 z-10"
                          >
                            <div className="py-1">
                              <button
                                onClick={() => handleViewBug(bug)}
                                className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-gray-800"
                              >
                                <Eye size={16} className="mr-2" />
                                View Details
                              </button>
                              <button
                                onClick={() => handleEdit(bug)}
                                className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-gray-800"
                              >
                                <Edit size={16} className="mr-2" />
                                Edit Report
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(bug.id_bug, STATUS_RESOLVED)}
                                className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-gray-800"
                              >
                                <Check size={16} className="mr-2" />
                                Mark as Resolved
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(bug.id_bug, STATUS_IN_PROGRESS)}
                                className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-gray-800"
                              >
                                <AlertCircle size={16} className="mr-2" />
                                Mark as In Progress
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(bug.id_bug, STATUS_REJECTED)}
                                className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-gray-800"
                              >
                                <X size={16} className="mr-2" />
                                Reject Report
                              </button>
                              <button
                                onClick={() => {
                                  setBugToDelete(bug.id_bug);
                                  setShowConfirmation(true);
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-800"
                              >
                                <Trash2 size={16} className="mr-2" />
                                Delete Report
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-700 text-white rounded-lg disabled:opacity-50"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="text-gray-400">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-700 text-white rounded-lg disabled:opacity-50"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="bg-gray-800 p-6 rounded-lg w-full max-w-md m-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">
                  {selectedBug ? 'Edit Bug Report' : 'New Bug Report'}
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    User
                  </label>
                  <select
                    value={formData.id_compte}
                    onChange={(e) => setFormData({ ...formData, id_compte: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#07f468] focus:border-transparent transition-all"
                    required
                  >
                    <option value="">Select a user</option>
                    {allUsers.map(user => (
                      <option key={user.id_compte} value={user.id_compte}>
                        {user.nom} {user.prenom} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#07f468] focus:border-transparent transition-all h-32 resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#07f468] focus:border-transparent transition-all"
                  >
                    <option value={STATUS_PENDING}>Pending</option>
                    <option value={STATUS_IN_PROGRESS}>In Progress</option>
                    <option value={STATUS_RESOLVED}>Resolved</option>
                    <option value={STATUS_REJECTED}>Rejected</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#07f468] text-gray-900 rounded-lg hover:bg-[#06d45a] transition-colors flex items-center gap-2"
                  >
                    <Check size={20} />
                    {selectedBug ? 'Update Report' : 'Create Report'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Modal */}
      <AnimatePresence>
        {showViewModal && selectedBug && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-gray-800 p-6 rounded-lg w-full max-w-2xl m-4"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Bug Report Details
                  </h3>
                  <p className="text-gray-400">
                    Report #{selectedBug.id_bug}
                  </p>
                </div>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-1">Status</h4>
                  <div className="flex items-center gap-2">
                    <AlertCircle className={getStatusColor(selectedBug.status)} size={20} />
                    <span className={`${getStatusColor(selectedBug.status)} font-medium`}>
                      {selectedBug.status || STATUS_PENDING}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-1">Reporter</h4>
                  <p className="text-white">
                    {getUserFullName(selectedBug.id_compte)}
                  </p>
                  <p className="text-sm text-gray-400">
                    {userDetails[selectedBug.id_compte]?.email || 'No email available'}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-1">Description</h4>
                  <p className="text-white">{selectedBug.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Created At</h4>
                    <p className="text-white">
                      {new Date(selectedBug.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Last Updated</h4>
                    <p className="text-white">
                      {new Date(selectedBug.updated_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-white mb-4">Confirm Deletion</h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete this bug report? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleDeleteBug(bugToDelete);
                    setShowConfirmation(false);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification Toast */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 flex items-center ${
              notification.type === 'success' 
                ? 'bg-green-900 text-green-100' 
                : 'bg-red-900 text-red-100'
            }`}
          >
            {notification.type === 'success' ? (
              <Check className="mr-2" size={20} />
            ) : (
              <X className="mr-2" size={20} />
            )}
            <span>{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReportedBugs; 
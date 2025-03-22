import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star,
  Trash2, 
  Edit, 
  Plus, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  X,
  Check,
  MoreVertical,
  Eye
} from 'lucide-react';
import reviewsService from '../../../lib/services/admin/reviewsService';
import compteService from '../../../lib/services/admin/compteServices';

// Status constants
const STATUS_PENDING = 'pending';
const STATUS_APPROVED = 'approved';
const STATUS_REJECTED = 'rejected';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [formData, setFormData] = useState({
    id_compte: '',
    name: '',
    description: '',
    status: STATUS_PENDING
  });
  const [activeMenu, setActiveMenu] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: 'success' });
  const [userDetails, setUserDetails] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

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

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const getUserFullName = (userId) => {
    const user = userDetails[userId];
    if (!user) return `User #${userId}`;
    return `${user.nom} ${user.prenom}`.trim();
  };

  const fetchUserDetails = async (userId) => {
    try {
      const response = await compteService.getCompte(userId);
      setUserDetails(prev => ({ ...prev, [userId]: response.data }));
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewsService.getAllReviews({
        paginationSize: 10,
        page: currentPage,
        search: searchQuery,
        sort_by: 'id_review',
        sort_order: 'desc',
        status: statusFilter !== 'all' ? statusFilter : undefined
      });
      
      if (response && Array.isArray(response.data)) {
        setReviews(response.data);
        if (response.meta) {
          setTotalPages(Math.ceil(response.meta.total / 10));
        }
        
        // Fetch user details for each review
        const userIds = [...new Set(response.data.map(review => review.id_compte))];
        userIds.forEach(fetchUserDetails);
        
        setError(null);
      } else {
        console.error('Invalid response format:', response);
        setError('Invalid response format from server');
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to load reviews. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [currentPage, searchQuery, statusFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedReview) {
        await reviewsService.updateReview(selectedReview.id, formData);
        showSuccessNotification('Review updated successfully');
      } else {
        await reviewsService.createReview(formData);
        showSuccessNotification('Review created successfully');
      }
      setShowForm(false);
      setSelectedReview(null);
      setFormData({ id_compte: '', name: '', description: '', status: STATUS_PENDING });
      fetchReviews();
    } catch (err) {
      showErrorNotification(selectedReview ? 'Failed to update review' : 'Failed to create review');
    }
  };

  const handleViewReview = (review) => {
    setSelectedReview(review);
    setShowViewModal(true);
  };

  const handleEdit = (review) => {
    setSelectedReview(review);
    setFormData({
      id_compte: review.id_compte,
      name: review.name,
      description: review.description,
      status: review.status || STATUS_PENDING
    });
    setShowForm(true);
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await reviewsService.updateStatus(id, status);
      showSuccessNotification(`Review status updated to ${status}`);
      fetchReviews();
    } catch (error) {
      console.error('Error updating review status:', error);
      showErrorNotification('Failed to update review status');
    }
  };

  const handleDeleteReview = async (id) => {
    try {
      await reviewsService.deleteReview(id);
      showSuccessNotification('Review deleted successfully');
      fetchReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
      showErrorNotification('Failed to delete review');
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
      case STATUS_APPROVED:
        return 'text-green-400';
      case STATUS_REJECTED:
        return 'text-red-400';
      default:
        return 'text-yellow-400';
    }
  };

  const filteredReviews = reviews.filter(review =>
    review.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#07f468] mb-2">Reviews</h2>
          <p className="text-gray-400 text-sm">Manage user reviews and feedback</p>
        </div>
        <button
          onClick={() => {
            setSelectedReview(null);
            setFormData({ id_compte: '', name: '', description: '', status: STATUS_PENDING });
            setShowForm(true);
          }}
          className="px-4 py-2 bg-[#07f468] text-gray-900 rounded-lg hover:bg-[#06d45a] transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          New Review
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search reviews..."
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
          <option value={STATUS_APPROVED}>Approved</option>
          <option value={STATUS_REJECTED}>Rejected</option>
        </select>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#07f468]"></div>
        </div>
      ) : error ? (
        <div className="bg-red-900/20 border border-red-500 p-4 rounded-lg text-center">
          <p className="text-red-400 mb-2">{error}</p>
          <button 
            onClick={fetchReviews}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="text-center py-12 bg-gray-800 rounded-lg">
          <Star className="mx-auto h-12 w-12 text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No reviews found</h3>
          <p className="text-gray-400">No reviews match your search criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredReviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700 h-full flex flex-col"
            >
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className={getStatusColor(review.status)} size={20} />
                    <h3 className="text-lg font-semibold text-white truncate">{review.name}</h3>
                  </div>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusColor(review.status)} bg-gray-900 mb-2`}>
                    {review.status || STATUS_PENDING}
                  </span>
                  <p className="text-gray-400 line-clamp-3">{review.description}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className="text-sm text-gray-500 truncate">
                    By: {getUserFullName(review.id_compte)}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm text-gray-500">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                    <div className="relative">
                      <button
                        onClick={() => setActiveMenu(activeMenu === review.id ? null : review.id)}
                        className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                      >
                        <MoreVertical size={20} className="text-gray-400" />
                      </button>
                      
                      <AnimatePresence>
                        {activeMenu === review.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-xl border border-gray-700 z-10"
                          >
                            <div className="py-1">
                              <button
                                onClick={() => handleViewReview(review)}
                                className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-gray-800"
                              >
                                <Eye size={16} className="mr-2" />
                                View Details
                              </button>
                              <button
                                onClick={() => handleEdit(review)}
                                className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-gray-800"
                              >
                                <Edit size={16} className="mr-2" />
                                Edit Review
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(review.id, STATUS_APPROVED)}
                                className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-gray-800"
                              >
                                <Check size={16} className="mr-2" />
                                Approve
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(review.id, STATUS_REJECTED)}
                                className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-gray-800"
                              >
                                <X size={16} className="mr-2" />
                                Reject
                              </button>
                              <button
                                onClick={() => {
                                  setReviewToDelete(review.id);
                                  setShowConfirmation(true);
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-800"
                              >
                                <Trash2 size={16} className="mr-2" />
                                Delete Review
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
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-gray-800 p-6 rounded-lg w-full max-w-md m-4"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">
                  {selectedReview ? 'Edit Review' : 'New Review'}
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-white"
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
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#07f468]"
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
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#07f468]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#07f468] h-32"
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
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#07f468]"
                  >
                    <option value={STATUS_PENDING}>Pending</option>
                    <option value={STATUS_APPROVED}>Approved</option>
                    <option value={STATUS_REJECTED}>Rejected</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#07f468] text-gray-900 rounded-lg hover:bg-[#06d45a] flex items-center"
                  >
                    <Check size={20} className="mr-2" />
                    {selectedReview ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Modal */}
      <AnimatePresence>
        {showViewModal && selectedReview && (
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
                    Review Details
                  </h3>
                  <p className="text-gray-400">
                    Review #{selectedReview.id}
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
                    <Star className={getStatusColor(selectedReview.status)} size={20} />
                    <span className={`${getStatusColor(selectedReview.status)} font-medium`}>
                      {selectedReview.status || STATUS_PENDING}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-1">Reviewer</h4>
                  <p className="text-white">
                    {getUserFullName(selectedReview.id_compte)}
                  </p>
                  <p className="text-sm text-gray-400">
                    {userDetails[selectedReview.id_compte]?.email || 'No email available'}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-1">Title</h4>
                  <p className="text-white">{selectedReview.name}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-1">Description</h4>
                  <p className="text-white">{selectedReview.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Created At</h4>
                    <p className="text-white">
                      {new Date(selectedReview.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-1">Last Updated</h4>
                    <p className="text-white">
                      {new Date(selectedReview.updated_at).toLocaleString()}
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
                Are you sure you want to delete this review? This action cannot be undone.
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
                    handleDeleteReview(reviewToDelete);
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

export default Reviews; 
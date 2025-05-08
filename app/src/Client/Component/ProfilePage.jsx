"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Calendar, 
  Clock, 
  MapPin, 
  Edit2, 
  Award, 
  Activity, 
  Save, 
  X, 
  Phone, 
  Mail, 
  Upload,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import profileService from '../../lib/services/user/profileService';
import reservationService from '../../lib/services/user/reservationServices';
import academieMemberService from '../../lib/services/user/academieMemberService';

const ProfilePage = () => {
  // State for user data, reservations, and activities
  const [userData, setUserData] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('info');
  const [editMode, setEditMode] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordFormData, setPasswordFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    date_naissance: '',
    age: ''
  });

  // Add this new state for academy memberships
  const [memberships, setMemberships] = useState([]);
  const [membershipsLoading, setMembershipsLoading] = useState(false);
  const [membershipsError, setMembershipsError] = useState(null);
  const [membershipActionStatus, setMembershipActionStatus] = useState(null);

  // Add this state for password visibility
  const [passwordVisibility, setPasswordVisibility] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [upcomingReservations, setUpcomingReservations] = useState([]);
  const [historyReservations, setHistoryReservations] = useState([]);
  const [reservationLoading, setReservationLoading] = useState(false);
  const [reservationError, setReservationError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch user data from API or use session storage as fallback
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Try to get data from API
        const response = await profileService.getProfile();
        if (response && response.data) {
          const user = response.data;
          setUserData(user);
          setFormData({
            nom: user.nom || '',
            prenom: user.prenom || '',
            email: user.email || '',
            telephone: user.telephone || '',
            date_naissance: user.date_naissance || '',
            age: user.age || ''
          });
          
          // Set reservations from API response
          if (user.reservations && user.reservations.length > 0) {
            setReservations(user.reservations);
          }
          
          // Use reviews as activities for now
          if (user.reviews && user.reviews.length > 0) {
            const convertedActivities = user.reviews.map(review => ({
              id: review.id_review,
              title: review.name,
              description: review.description,
              date: new Date(review.created_at).toLocaleDateString(),
              time: new Date(review.created_at).toLocaleTimeString(),
              status: review.status,
              academy: "General"
            }));
            setActivities(convertedActivities);
          } else {
            // Fallback mock activities
            setActivities([
              {
                id: 1,
                title: "Junior Football Training",
                description: "Weekly training session for juniors",
                date: "Every Wednesday",
                time: "16:00 - 17:30",
                academy: "Youth Academy"
              },
              {
                id: 2,
                title: "Advanced Techniques Workshop",
                description: "Learn professional techniques",
                date: "July 20, 2024",
                time: "10:00 - 12:00",
                academy: "Pro Skills Academy"
              }
            ]);
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError("Failed to load user data. Using local data instead.");
        
        // Fallback to session storage if API fails
        const nom = sessionStorage.getItem('nom');
        const prenom = sessionStorage.getItem('prenom');
        const email = sessionStorage.getItem('email');
        const userId = sessionStorage.getItem('userId');
        const telephone = sessionStorage.getItem('telephone');
        const pfp = sessionStorage.getItem('pfp');
        const dateInscription = sessionStorage.getItem('date_inscription');

        // Set user data from session storage
        if (email) {
          const user = {
            nom,
            prenom,
            email,
            userId,
            telephone,
            pfp,
            dateInscription
          };
          
          setUserData(user);
          setFormData({
            nom: nom || '',
            prenom: prenom || '',
            email: email || '',
            telephone: telephone || '',
            date_naissance: '',
            age: ''
          });
        }

        // Mock reservations data as fallback
        setReservations([
          {
            id: 1,
            terrain: "Stadium Alpha",
            date: "2024-07-15",
            time: "14:00",
            heure: "14:00:00",
            duration: "1h30",
            etat: "reserver"
          },
          {
            id: 2,
            terrain: "Field Bravo",
            date: "2024-07-18",
            time: "18:30",
            heure: "18:30:00",
            duration: "1h",
            etat: "en attente"
          },
          {
            id: 3,
            terrain: "Arena Charlie",
            date: "2024-07-22",
            time: "10:00",
            heure: "10:00:00",
            duration: "2h",
            etat: "reserver"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Fetch activity history
  useEffect(() => {
    const fetchActivityHistory = async () => {
      if (!userData) return;
      
      try {
        const response = await profileService.getActivityHistory();
        console.log('Activity history:', response);
        
        if (response && response.success && response.data) {
          // Update reservations from activity history
          if (response.data.reservations && response.data.reservations.length > 0) {
            setReservations(response.data.reservations);
          }
          
          // Update activities from reviews
          if (response.data.reviews && response.data.reviews.length > 0) {
            const convertedActivities = response.data.reviews.map(review => ({
              id: review.id_review,
              title: review.name,
              description: review.description,
              date: new Date(review.created_at).toLocaleDateString(),
              time: new Date(review.created_at).toLocaleTimeString(),
              status: review.status,
              academy: "Review"
            }));
            setActivities(convertedActivities);
          }
        }
      } catch (error) {
        console.error('Error fetching activity history:', error);
      }
    };
    
    fetchActivityHistory();
  }, [userData]);

  // Fetch upcoming and history reservations
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setReservationLoading(true);
        setReservationError(null);

        // Fetch upcoming reservations
        const upcomingResponse = await reservationService.getUpcomingReservations();
        if (upcomingResponse && upcomingResponse.status === 'success' && upcomingResponse.data) {
          setUpcomingReservations(upcomingResponse.data);
        }

        // Prepare history parameters - ensure we're getting past or cancelled reservations
        const historyParams = {
          page: currentPage,
          per_page: 10,
          past: true // Add parameter to specifically request past reservations
        };
        
        if (filterStatus !== 'all') historyParams.etat = filterStatus;
        if (searchQuery) historyParams.search = searchQuery;

        // Fetch history reservations with pagination
        const historyResponse = await reservationService.getReservationHistory(historyParams);
        
        if (historyResponse && historyResponse.status === 'success' && historyResponse.data) {
          // Handle Laravel pagination response format
          setHistoryReservations(historyResponse.data.data || historyResponse.data);
          setTotalPages(historyResponse.data.last_page || 1);
        }
      } catch (error) {
        console.error('Error fetching reservations:', error);
        setReservationError('Failed to load reservations: ' + (error.response?.data?.message || error.message));
      } finally {
        setReservationLoading(false);
      }
    };

    fetchReservations();
  }, [currentPage, filterStatus, searchQuery]);

  // Add this new useEffect for fetching user's academy memberships
  useEffect(() => {
    const fetchMemberships = async () => {
      if (!userData) return;
      
      try {
        setMembershipsLoading(true);
        setMembershipsError(null);
        
        const response = await academieMemberService.getMyMemberships();
        if (response && response.success && response.data) {
          setMemberships(response.data);
        }
      } catch (error) {
        console.error('Error fetching academy memberships:', error);
        setMembershipsError('Failed to load memberships: ' + (error.response?.data?.message || error.message));
      } finally {
        setMembershipsLoading(false);
      }
    };
    
    fetchMemberships();
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSaveProfile = async (e) => {
    // If an event is passed, prevent the default form submission
    if (e) e.preventDefault();
    
    console.log("Save profile clicked - starting update process");
    
    try {
      setLoading(true);
      
      // Make a copy of formData and ensure values are properly formatted
      const apiData = { ...formData };
      
      // Convert age to number if it's a string
      if (apiData.age && typeof apiData.age === 'string') {
        apiData.age = parseInt(apiData.age, 10);
      }
      
      console.log('Sending update data:', apiData);
      
      // Call API to update profile
      const response = await profileService.updateProfile(apiData);
      
      console.log('Update response:', response);
      
      // Handle different response structures
      if (response && (response.data || response.success)) {
        // Get the user data from the response
        const updatedUser = response.data || response;
        
        console.log('Profile updated successfully:', updatedUser);
        
        // Update local state
        setUserData(updatedUser);
        
        // Update session storage
        sessionStorage.setItem('nom', formData.nom);
        sessionStorage.setItem('prenom', formData.prenom);
        sessionStorage.setItem('email', formData.email);
        sessionStorage.setItem('telephone', formData.telephone);
        
        // Show success message
        setError(null);
        
        // Exit edit mode
        setEditMode(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
      
      // Exit edit mode even if there's an error
      setEditMode(false);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordFormData({
      ...passwordFormData,
      [name]: value
    });
  };

  const handleSubmitPasswordChange = async (e) => {
    e.preventDefault();
    
    // Reset messages
    setPasswordError(null);
    setPasswordSuccess(null);
    
    // Validate passwords match
    if (passwordFormData.new_password !== passwordFormData.confirm_password) {
      setPasswordError("New passwords don't match");
      return;
    }
    
    // Validate password length
    if (passwordFormData.new_password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }
    
    try {
      setLoading(true);
      const response = await profileService.changePassword({
        current_password: passwordFormData.current_password,
        new_password: passwordFormData.new_password,
        new_password_confirmation: passwordFormData.confirm_password
      });
      
      console.log('Password change response:', response);
      
      if (response && response.success) {
        setPasswordSuccess("Password changed successfully");
        setPasswordFormData({
          current_password: '',
          new_password: '',
          confirm_password: ''
        });
        
        // Close password form after success
        setTimeout(() => {
          setShowPasswordForm(false);
          setPasswordSuccess(null);
        }, 3000);
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordError(error.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  // Add this function to toggle password visibility
  const togglePasswordVisibility = (field) => {
    setPasswordVisibility({
      ...passwordVisibility,
      [field]: !passwordVisibility[field]
    });
  };

  // Handle reservation cancellation
  const handleCancelReservation = async (id) => {
    try {
      setReservationLoading(true);
      const response = await reservationService.cancelReservation(id);
      
      // Handle both success formats (for deleteReservation and cancelReservation)
      if (response && (response.status === 'success' || response.message === 'Reservation deleted successfully')) {
        // Update UI immediately
        setUpcomingReservations(prev => prev.filter(res => res.id_reservation !== id));
        
        // Find the cancelled reservation to update history list
        const cancelledReservation = upcomingReservations.find(res => res.id_reservation === id);
        if (cancelledReservation) {
          setHistoryReservations(prev => [
            { ...cancelledReservation, etat: 'annuler' },
            ...prev
          ]);
        }
        
        // Show success message
        setReservationError(null);
        
        // Fetch fresh data after cancel to ensure UI is up-to-date
        refreshReservations();
      }
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      setReservationError('Failed to cancel reservation: ' + (error.response?.data?.message || error.message));
    } finally {
      setReservationLoading(false);
    }
  };

  // Add a refresh function to reload all reservation data
  const refreshReservations = async () => {
    try {
      // Fetch fresh upcoming reservations
      const upcomingResponse = await reservationService.getUpcomingReservations();
      if (upcomingResponse && upcomingResponse.status === 'success' && upcomingResponse.data) {
        setUpcomingReservations(upcomingResponse.data);
      }
      
      // Prepare history parameters for fresh data
      const historyParams = {
        page: currentPage,
        per_page: 10,
        past: true
      };
      
      if (filterStatus !== 'all') historyParams.etat = filterStatus;
      if (searchQuery) historyParams.search = searchQuery;
      
      // Fetch fresh history reservations
      const historyResponse = await reservationService.getReservationHistory(historyParams);
      if (historyResponse && historyResponse.status === 'success' && historyResponse.data) {
        setHistoryReservations(historyResponse.data.data || historyResponse.data);
        setTotalPages(historyResponse.data.last_page || 1);
      }
    } catch (error) {
      console.error('Error refreshing reservations:', error);
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Handle filter change
  const handleFilterChange = (status) => {
    setFilterStatus(status);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when search changes
  };

  // Add function to handle cancellation of academy membership
  const handleCancelMembership = async (academieId) => {
    try {
      setMembershipsLoading(true);
      setMembershipActionStatus(null);
      
      const response = await academieMemberService.cancelSubscription(academieId);
      
      if (response && response.success) {
        // Remove the cancelled membership from the list
        const updatedMemberships = memberships.filter(membership => 
          membership.id_academie !== academieId
        );
        
        setMemberships(updatedMemberships);
        
        // Update session storage with new memberships list
        sessionStorage.setItem('academie_memberships', JSON.stringify(updatedMemberships));
        
        // If no memberships left, update has_academie_membership flag
        if (updatedMemberships.length === 0) {
          sessionStorage.setItem('has_academie_membership', 'false');
          // Also remove the academy_member_id if it exists
          sessionStorage.removeItem('academy_member_id');
        }
        
        setMembershipActionStatus({
          type: 'success',
          text: 'Abonnement annulé avec succès'
        });
      }
    } catch (error) {
      console.error('Error cancelling membership:', error);
      setMembershipActionStatus({
        type: 'error',
        text: 'Échec de l\'annulation: ' + (error.response?.data?.message || error.message)
      });
    } finally {
      setMembershipsLoading(false);
    }
  };

  // Add function to handle updating subscription plan
  const handleUpdatePlan = async (academieId, newPlan) => {
    try {
      setMembershipsLoading(true);
      setMembershipActionStatus(null);
      
      const response = await academieMemberService.updatePlan(academieId, {
        subscription_plan: newPlan
      });
      
      if (response && response.success) {
        // Update the membership in the list
        const updatedMemberships = memberships.map(membership => 
          membership.id_academie === academieId 
            ? { ...membership, subscription_plan: newPlan }
            : membership
        );
        
        setMemberships(updatedMemberships);
        
        // Update session storage with new memberships list
        sessionStorage.setItem('academie_memberships', JSON.stringify(updatedMemberships));
        
        // If this is the first membership, ensure has_academie_membership is true
        if (!sessionStorage.getItem('has_academie_membership')) {
          sessionStorage.setItem('has_academie_membership', 'true');
        }
        
        // If we have member ID in the response, update that too
        if (response.data?.id_member) {
          sessionStorage.setItem('academy_member_id', response.data.id_member);
        }
        
        setMembershipActionStatus({
          type: 'success',
          text: 'Plan d\'abonnement mis à jour avec succès'
        });
      }
    } catch (error) {
      console.error('Error updating membership plan:', error);
      setMembershipActionStatus({
        type: 'error',
        text: 'Échec de la mise à jour: ' + (error.response?.data?.message || error.message)
      });
    } finally {
      setMembershipsLoading(false);
    }
  };

  const profileVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-6 md:pt-10 pb-20 md:pb-24 px-3 md:px-4">
      <div className="container mx-auto">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 md:p-4 mb-4 md:mb-6 flex items-start">
            <AlertCircle className="text-red-500 mt-0.5 mr-3 flex-shrink-0" />
            <p className="text-red-400 text-sm md:text-base">{error}</p>
          </div>
        )}
        
        <motion.div
          initial="hidden"
          animate="visible"
          variants={profileVariants}
          className="max-w-6xl mx-auto"
        >
          {/* Profile Header - Complete mobile restructure */}
          <div className="relative mb-32 md:mb-8">
            {/* Background Banner */}
            <div className="relative h-28 md:h-48 rounded-xl bg-gradient-to-r from-green-400/20 to-green-600/20 overflow-hidden">
              <div className="absolute inset-0 bg-pattern opacity-10"></div>
            </div>
            
            {/* Content Container with proper spacing */}
            <div className="px-4 md:px-0">
              {/* Profile Picture Container */}
              <div className="relative -mt-14 md:-mt-16 md:absolute md:bottom-0 md:left-8 md:translate-y-1/2 flex justify-center md:block z-20">
                <div className="relative">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-gray-900 overflow-hidden bg-gradient-to-r from-green-400 to-green-600 shadow-xl">
                    {userData?.pfp ? (
                      <img 
                        src={`http://127.0.0.1:8000/${userData.pfp}`} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const fallbackIcon = e.target.parentElement.querySelector('.fallback-icon');
                          if (fallbackIcon) {
                            fallbackIcon.style.display = 'flex';
                          }
                        }}
                      />
                    ) : null}
                    <div className={`w-full h-full flex items-center justify-center fallback-icon ${userData?.pfp ? 'hidden' : ''}`}>
                      <User className="w-10 h-10 md:w-16 md:h-16 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* User Info and Edit Button Container - Adjusted spacing */}
              <div className="mt-4 md:mt-0 md:ml-44 flex flex-col items-center md:items-start space-y-3 md:space-y-2 relative z-10">
                {/* User Info */}
                <div className="text-center md:text-left">
                  <h1 className="text-lg md:text-3xl font-bold text-white">
                    {userData?.prenom} {userData?.nom}
                  </h1>
                  <p className="text-gray-400 text-xs md:text-base mt-0.5 md:mt-1">
                    Member since {new Date(userData?.created_at || Date.now()).toLocaleDateString()}
                  </p>
                </div>
                
                {/* Edit Button */}
                <div className="w-full md:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      console.log("Edit button clicked");
                      setEditMode(!editMode);
                    }}
                    className={`w-full md:w-auto flex items-center justify-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-full shadow-lg transition-all text-sm md:text-base ${
                      editMode 
                        ? "bg-gray-700 text-white hover:bg-gray-600" 
                        : "bg-green-500 text-white hover:bg-green-600"
                    }`}
                  >
                    {editMode ? (
                      <>
                        <X className="w-4 h-4 md:w-5 md:h-5" />
                        Cancel
                      </>
                    ) : (
                      <>
                        <Edit2 className="w-4 h-4 md:w-5 md:h-5" />
                        Edit Profile
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tabs Navigation - Improved for mobile */}
          <div className="mb-5 md:mb-8 border-b border-gray-800 overflow-x-auto overflow-y-hidden pb-1 -mx-3 px-3 md:mx-0 md:px-0">
            <nav className="flex space-x-2 md:space-x-8 min-w-max md:min-w-0 w-full md:w-auto">
              <button
                type="button"
                onClick={() => setActiveTab('info')}
                className={`py-2 md:py-4 px-4 md:px-0 font-medium text-sm md:text-lg border-b-2 transition-colors flex-1 md:flex-auto text-center whitespace-nowrap ${
                  activeTab === 'info'
                    ? "border-green-500 text-green-500"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                Profile
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('reservations')}
                className={`py-2 md:py-4 px-4 md:px-0 font-medium text-sm md:text-lg border-b-2 transition-colors flex-1 md:flex-auto text-center whitespace-nowrap ${
                  activeTab === 'reservations'
                    ? "border-green-500 text-green-500"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                Reservations
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('activities')}
                className={`py-2 md:py-4 px-4 md:px-0 font-medium text-sm md:text-lg border-b-2 transition-colors flex-1 md:flex-auto text-center whitespace-nowrap ${
                  activeTab === 'activities'
                    ? "border-green-500 text-green-500"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                Activities
              </button>
            </nav>
          </div>
          
          {/* Tab Content */}
          <div className="space-y-6 relative z-10">
            {/* Profile Information Tab */}
            {activeTab === 'info' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-lg relative z-10"
              >
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-6">Personal Information</h2>
                
                {editMode ? (
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSaveProfile(e);
                    }} 
                    className="space-y-6 relative z-10"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1 md:mb-2">First Name</label>
                        <input
                          type="text"
                          name="prenom"
                          value={formData.prenom}
                          onChange={handleInputChange}
                          className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 md:px-4 md:py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1 md:mb-2">Last Name</label>
                        <input
                          type="text"
                          name="nom"
                          value={formData.nom}
                          onChange={handleInputChange}
                          className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 md:px-4 md:py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1 md:mb-2">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 md:px-4 md:py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1 md:mb-2">Phone Number</label>
                        <input
                          type="tel"
                          name="telephone"
                          value={formData.telephone}
                          onChange={handleInputChange}
                          className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 md:px-4 md:py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1 md:mb-2">Age</label>
                        <input
                          type="number"
                          name="age"
                          value={formData.age}
                          onChange={handleInputChange}
                          className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 md:px-4 md:py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-center md:justify-end mt-6 md:mt-8 relative z-20">
                      <button
                        type="submit"
                        className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-colors"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-5 h-5" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div className="space-y-5 md:space-y-6">
                      <div>
                        <h3 className="text-gray-400 text-sm">First Name</h3>
                        <p className="text-white text-lg mt-1">{userData?.prenom || 'Not set'}</p>
                      </div>
                      <div>
                        <h3 className="text-gray-400 text-sm">Last Name</h3>
                        <p className="text-white text-lg mt-1">{userData?.nom || 'Not set'}</p>
                      </div>
                      <div>
                        <h3 className="text-gray-400 text-sm">Age</h3>
                        <p className="text-white text-lg mt-1">{userData?.age || 'Not set'}</p>
                      </div>
                    </div>
                    <div className="space-y-5 md:space-y-6 mt-5 md:mt-0">
                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="text-gray-400 text-sm">Email</h3>
                          <p className="text-white text-lg mt-1 break-all">{userData?.email || 'Not set'}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="text-gray-400 text-sm">Phone Number</h3>
                          <p className="text-white text-lg mt-1">{userData?.telephone || 'Not set'}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Password change section */}
                    <div className="mt-6 md:mt-8 col-span-1 md:col-span-2">
                      <div className="border-t border-gray-700 pt-5 md:pt-6">
                        <h3 className="text-lg font-medium text-white mb-3 md:mb-4">Security Settings</h3>
                        
                        {!showPasswordForm ? (
                          <button
                            type="button"
                            onClick={() => setShowPasswordForm(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                          >
                            Change Password
                          </button>
                        ) : (
                          <form onSubmit={handleSubmitPasswordChange} className="space-y-3 md:space-y-4 bg-gray-800/50 p-3 md:p-4 rounded-lg">
                            {passwordError && (
                              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2 md:p-3 text-red-400 text-sm">
                                {passwordError}
                              </div>
                            )}
                            
                            {passwordSuccess && (
                              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2 md:p-3 text-green-400 text-sm">
                                {passwordSuccess}
                              </div>
                            )}
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-400 mb-1 md:mb-2">Current Password</label>
                              <div className="relative">
                                <input
                                  type={passwordVisibility.current ? "text" : "password"}
                                  name="current_password"
                                  value={passwordFormData.current_password}
                                  onChange={handlePasswordChange}
                                  className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 md:px-4 md:py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500"
                                  required
                                />
                                <button
                                  type="button"
                                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-white"
                                  onClick={() => togglePasswordVisibility('current')}
                                >
                                  {passwordVisibility.current ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                    </svg>
                                  ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                    </svg>
                                  )}
                                </button>
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-400 mb-1 md:mb-2">New Password</label>
                              <div className="relative">
                                <input
                                  type={passwordVisibility.new ? "text" : "password"}
                                  name="new_password"
                                  value={passwordFormData.new_password}
                                  onChange={handlePasswordChange}
                                  className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 md:px-4 md:py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500"
                                  required
                                  minLength={8}
                                />
                                <button
                                  type="button"
                                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-white"
                                  onClick={() => togglePasswordVisibility('new')}
                                >
                                  {passwordVisibility.new ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                    </svg>
                                  ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                    </svg>
                                  )}
                                </button>
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-400 mb-1 md:mb-2">Confirm New Password</label>
                              <div className="relative">
                                <input
                                  type={passwordVisibility.confirm ? "text" : "password"}
                                  name="confirm_password"
                                  value={passwordFormData.confirm_password}
                                  onChange={handlePasswordChange}
                                  className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 md:px-4 md:py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500"
                                  required
                                  minLength={8}
                                />
                                <button
                                  type="button"
                                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-white"
                                  onClick={() => togglePasswordVisibility('confirm')}
                                >
                                  {passwordVisibility.confirm ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                    </svg>
                                  ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                    </svg>
                                  )}
                                </button>
                              </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setShowPasswordForm(false);
                                  setPasswordError(null);
                                  setPasswordSuccess(null);
                                }}
                                className="w-full sm:w-auto px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="w-full sm:w-auto px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                                disabled={loading}
                              >
                                {loading ? (
                                  <>
                                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                                    Saving...
                                  </>
                                ) : "Update Password"}
                              </button>
                            </div>
                          </form>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
            
            {/* Reservations Tab */}
            {activeTab === 'reservations' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                  <h2 className="text-xl md:text-2xl font-semibold text-white">My Reservations</h2>
                  <Link
                    to="/reservation"
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full text-sm hover:bg-green-600 transition-colors"
                  >
                    Book New Reservation
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                {reservationError && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 md:p-4 mb-4 md:mb-6 flex items-start">
                    <AlertCircle className="text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                    <p className="text-red-400 text-sm md:text-base">{reservationError}</p>
                  </div>
                )}

                {/* Upcoming Reservations */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-white mb-4">Upcoming Reservations</h3>
                  {reservationLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
                    </div>
                  ) : upcomingReservations.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingReservations.map((reservation) => (
                        <ReservationCard 
                          key={reservation.id_reservation} 
                          reservation={reservation}
                          onCancel={() => handleCancelReservation(reservation.id_reservation)}
                          isUpcoming={true}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 text-center">
                      <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                      <h3 className="text-xl font-medium text-white mb-2">No Upcoming Reservations</h3>
                      <p className="text-gray-400 mb-6">You don't have any upcoming reservations.</p>
                      <Link
                        to="/reservation"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                      >
                        Book a Reservation
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  )}
                </div>

                {/* History Reservations */}
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <h3 className="text-lg font-medium text-white">Reservation History</h3>
                    
                    {/* Search and Filter Controls */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                      <div className="relative flex-1 sm:flex-none">
                        <input
                          type="text"
                          placeholder="Search reservations..."
                          value={searchQuery}
                          onChange={(e) => handleSearch(e.target.value)}
                          className="w-full sm:w-64 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <select
                        value={filterStatus}
                        onChange={(e) => handleFilterChange(e.target.value)}
                        className="bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="all">All Status</option>
                        <option value="reserver">Confirmed</option>
                        <option value="en attente">Pending</option>
                        <option value="annuler">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {reservationLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
                    </div>
                  ) : historyReservations.length > 0 ? (
                    <>
                      <div className="space-y-4">
                        {historyReservations.map((reservation) => (
                          <ReservationCard 
                            key={reservation.id_reservation} 
                            reservation={reservation}
                            isUpcoming={false}
                          />
                        ))}
                      </div>

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="flex justify-center mt-6 gap-2">
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 rounded-lg bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                          >
                            Previous
                          </button>
                          <span className="px-3 py-1 text-white">
                            Page {currentPage} of {totalPages}
                          </span>
                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 rounded-lg bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                          >
                            Next
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 text-center">
                      <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                      <h3 className="text-xl font-medium text-white mb-2">No Reservation History</h3>
                      <p className="text-gray-400">No reservations found matching your criteria.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
            
            {/* Activities Tab */}
            {activeTab === 'activities' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                  <h2 className="text-xl md:text-2xl font-semibold text-white">My Activities</h2>
                  <Link
                    to="/academie"
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full text-sm hover:bg-green-600 transition-colors"
                  >
                    Explore Academies
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
                
                {/* Academy Memberships Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-white mb-4">Academy Memberships</h3>
                  
                  {membershipActionStatus && (
                    <div className={`p-3 mb-4 rounded-lg ${
                      membershipActionStatus.type === 'success'
                        ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                        : 'bg-red-500/10 border border-red-500/20 text-red-400'
                    }`}>
                      {membershipActionStatus.text}
                    </div>
                  )}
                  
                  {membershipsLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
                    </div>
                  ) : membershipsError ? (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
                      <p className="text-red-400">{membershipsError}</p>
                    </div>
                  ) : memberships.length > 0 ? (
                    <div className="space-y-4">
                      {memberships.map((membership) => (
                        <MembershipCard 
                          key={membership.id_academie} 
                          membership={membership}
                          onCancel={() => handleCancelMembership(membership.id_academie)}
                          onUpdatePlan={(newPlan) => handleUpdatePlan(membership.id_academie, newPlan)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 text-center">
                      <Award className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                      <h3 className="text-xl font-medium text-white mb-2">No Academy Memberships</h3>
                      <p className="text-gray-400 mb-6">You haven't subscribed to any academy plans yet.</p>
                      <Link
                        to="/academie#tarifs"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                      >
                        View Academy Plans
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  )}
                </div>
                
                {/* Activities List */}
                <h3 className="text-lg font-medium text-white mb-4">Registered Activities</h3>
                
                {activities.length > 0 ? (
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      <ActivityCard key={activity.id} activity={activity} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 text-center">
                    <Activity className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                    <h3 className="text-xl font-medium text-white mb-2">No Activities</h3>
                    <p className="text-gray-400 mb-6">You haven't joined any academy activities yet.</p>
                    <Link
                      to="/events"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                    >
                      Browse Events
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const ReservationCard = ({ reservation, onCancel, isUpcoming }) => {
  // Format reservation status for display
  const getStatusText = (status) => {
    switch(status) {
      case 'reserver': return 'Confirmed';
      case 'en attente': return 'Pending';
      case 'annuler': return 'Cancelled';
      default: return status;
    }
  };
  
  // Get status color classes
  const getStatusClasses = (status) => {
    switch(status) {
      case 'reserver': return 'bg-green-500/20 text-green-500';
      case 'en attente': return 'bg-yellow-500/20 text-yellow-500';
      case 'annuler': return 'bg-red-500/20 text-red-500';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 md:p-5 shadow-lg border border-gray-700/50 hover:border-green-500/30 transition-all"
    >
      <div className="flex flex-col md:flex-row justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
            <MapPin className="w-4 h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0" />
            <h3 className="text-lg md:text-xl font-medium text-white break-words">
              {reservation.terrain?.nom_terrain || `Terrain #${reservation.id_terrain}`}
            </h3>
          </div>
          
          <div className="flex flex-wrap items-center text-gray-400 gap-3 md:gap-6 mt-2 md:mt-3">
            <div className="flex items-center gap-1 md:gap-2">
              <Calendar className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
              <span className="text-sm md:text-base">{new Date(reservation.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              <Clock className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
              <span className="text-sm md:text-base">
                {reservation.heure 
                  ? reservation.heure.substring(0, 5) 
                  : "N/A"}
              </span>
            </div>
            {reservation.num_res && (
              <div className="flex items-center">
                <span className="text-xs text-gray-400 mt-1 md:mt-0">#{reservation.num_res}</span>
              </div>
            )}
            {reservation.Name && (
              <div className="flex items-center">
                <span className="text-xs text-gray-400 mt-1 md:mt-0">
                  {reservation.Name}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-3 md:mt-0 flex items-center justify-start md:justify-center">
          <span className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium ${getStatusClasses(reservation.etat)}`}>
            {getStatusText(reservation.etat)}
          </span>
        </div>
      </div>
      
      {/* Only show cancel button for upcoming non-cancelled reservations */}
      {onCancel && reservation.etat !== 'annuler' && (
        <div className="mt-3 md:mt-0 flex justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Cancel
          </button>
        </div>
      )}
    </motion.div>
  );
};

const ActivityCard = ({ activity }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 md:p-5 shadow-lg border border-gray-700/50 hover:border-green-500/30 transition-all"
    >
      <div className="flex flex-col md:flex-row justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
            <Award className="w-4 h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0" />
            <h3 className="text-lg md:text-xl font-medium text-white break-words">{activity.title}</h3>
          </div>
          
          <p className="text-gray-400 text-sm md:text-base mt-1">{activity.description}</p>
          
          <div className="flex flex-wrap items-center text-gray-400 gap-3 md:gap-6 mt-2 md:mt-3">
            <div className="flex items-center gap-1 md:gap-2">
              <Calendar className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
              <span className="text-sm md:text-base">{activity.date}</span>
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              <Clock className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
              <span className="text-sm md:text-base">{activity.time}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-3 md:mt-0">
          <div className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium ${
            activity.status === 'approved' 
              ? 'bg-green-500/20 text-green-500'
              : 'bg-gray-500/20 text-gray-300'
          }`}>
            {activity.academy}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const MembershipCard = ({ membership, onCancel, onUpdatePlan }) => {
  const [showUpdateOptions, setShowUpdateOptions] = useState(false);
  
  const getPlanName = (plan) => {
    switch(plan) {
      case 'base': return 'Plan de Base';
      case 'premium': return 'Plan Premium';
      default: return plan;
    }
  };
  
  const getPlanColorClass = (plan) => {
    switch(plan) {
      case 'base': return 'bg-blue-500/20 text-blue-400';
      case 'premium': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 md:p-5 shadow-lg border border-gray-700/50 hover:border-green-500/30 transition-all"
    >
      <div className="flex flex-col md:flex-row justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
            <Award className="w-4 h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0" />
            <h3 className="text-lg md:text-xl font-medium text-white break-words">
              {membership.academie?.nom || 'Academy Membership'}
            </h3>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 md:gap-6 mt-2 md:mt-3">
            <div className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium ${getPlanColorClass(membership.subscription_plan)}`}>
              {getPlanName(membership.subscription_plan)}
            </div>
            
            <div className="flex items-center gap-1 md:gap-2 text-gray-400">
              <Calendar className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
              <span className="text-sm md:text-base">
                Joined: {new Date(membership.date_joined).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
        {showUpdateOptions ? (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                onUpdatePlan(membership.subscription_plan === 'base' ? 'premium' : 'base');
                setShowUpdateOptions(false);
              }}
              className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-all"
            >
              Switch to {membership.subscription_plan === 'base' ? 'Premium' : 'Basic'}
            </button>
            <button
              type="button"
              onClick={() => setShowUpdateOptions(false)}
              className="px-3 py-1.5 bg-gray-700 text-white rounded-lg text-sm hover:bg-gray-600 transition-all"
            >
              Cancel
            </button>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setShowUpdateOptions(true)}
              className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-all flex items-center justify-center gap-1"
            >
              <Edit2 className="w-3 h-3" />
              Change Plan
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition-all"
            >
              Cancel Subscription
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default ProfilePage; 
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  AlertCircle,
  Check,
  Users,
  Trophy,
  UserPlus,
  Star,
  Shield,
  MessageCircle,
  Settings,
  Plus,
  Trash2,
  ExternalLink,
  UserCheck,
  UserX,
  ChevronLeft,
  Eye,
  EyeOff,
  Info,
  Circle,
  Lock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import profileService from '../../lib/services/user/profileService';
import reservationService from '../../lib/services/user/reservationServices';
import academieMemberService from '../../lib/services/user/academieMemberService';
import playersService from '../../lib/services/user/playersService';
import teamsService from '../../lib/services/user/teamsService';
import playerTeamsService from '../../lib/services/user/playerTeamsService';
import playerRequestsService from '../../lib/services/user/playerRequestsService';
import debounce from 'lodash/debounce';
import { toast } from 'react-toastify';
import activitiesMembersService from '../../lib/services/user/activitiesMembersService';

const ProfilePage = () => {
  // State declarations
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

  // New state for Players tab
  const [playerInfo, setPlayerInfo] = useState(null);
  const [playerLoading, setPlayerLoading] = useState(false);
  const [playerError, setPlayerError] = useState(null);
  
  // New state for Teams tab
  const [teamInfo, setTeamInfo] = useState(null);
  const [teamLoading, setTeamLoading] = useState(false);
  const [teamError, setTeamError] = useState(null);
  
  // New state for Player Requests tab
  const [playerRequests, setPlayerRequests] = useState({
    sent: [],
    received: []
  });
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requestsError, setRequestsError] = useState(null);
  const [activeRequestsTab, setActiveRequestsTab] = useState('received');
  // State for new request form
  const [showNewRequestForm, setShowNewRequestForm] = useState(false);
  const [newRequestData, setNewRequestData] = useState({
    receiver_id: '',
    match_date: '',
    starting_time: '',
    message: ''
  });
  const [requestFormError, setRequestFormError] = useState(null);
  const [requestFormSuccess, setRequestFormSuccess] = useState(null);

  // State for player form
  const [showPlayerForm, setShowPlayerForm] = useState(false);
  const [playerFormData, setPlayerFormData] = useState({
    position: '',
    starting_time: '',
    finishing_time: '',
    misses: 0,
    invites_accepted: 0,
    invites_refused: 0,
    total_invites: 0
  });
  const [playerFormError, setPlayerFormError] = useState(null);
  const [playerFormSuccess, setPlayerFormSuccess] = useState(null);

  // State for team form
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [teamFormData, setTeamFormData] = useState({
    selected_member: '', // This will be used as capitain in the API call
    starting_time: '',
    finishing_time: ''
  });
  const [teamFormError, setTeamFormError] = useState(null);
  const [teamFormSuccess, setTeamFormSuccess] = useState(null);
  
  // State for player search in team invitations
  const [playerSearchQuery, setPlayerSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // State for joining teams
  const [showJoinTeamSection, setShowJoinTeamSection] = useState(false);
  const [joinTeamData, setJoinTeamData] = useState({ team_id: '' });
  const [joinTeamError, setJoinTeamError] = useState(null);
  const [joinTeamSuccess, setJoinTeamSuccess] = useState(null);

  // Add state for deletion confirmation modal
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Add state for team invitations and join requests
  const [pendingInvitations, setPendingInvitations] = useState([]);
  const [pendingJoinRequests, setPendingJoinRequests] = useState([]);
  const [invitationsLoading, setInvitationsLoading] = useState(false);
  const [invitationsPage, setInvitationsPage] = useState(1);
  const [invitationsTotalPages, setInvitationsTotalPages] = useState(1);

  // Add state for team invitation form
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [invitePlayerData, setInvitePlayerData] = useState({ player_id: '' });
  const [inviteError, setInviteError] = useState(null);
  const [inviteSuccess, setInviteSuccess] = useState(null);

  // Add these new state variables after the existing player request states (around line 120)
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [playersLoading, setPlayersLoading] = useState(false);
  const [requestsPage, setRequestsPage] = useState(1);
  const [requestsTotalPages, setRequestsTotalPages] = useState(1);
  const [requestsFilter, setRequestsFilter] = useState('all');
  const [requestsSearchQuery, setRequestsSearchQuery] = useState('');
  const [requestsPerPage, setRequestsPerPage] = useState(10);

  // Add function to handle profile picture upload
  const [profilePicture, setProfilePicture] = useState(null);
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const fileInputRef = useRef(null);
  
  // Add state for delete account confirmation modal
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [deleteAccountLoading, setDeleteAccountLoading] = useState(false);
  // Add state for password in delete account modal
  const [deleteAccountPassword, setDeleteAccountPassword] = useState('');
  const [deleteAccountError, setDeleteAccountError] = useState(null);

  // Add this state near your other state declarations
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [planChangeAcademieId, setPlanChangeAcademieId] = useState(null);

  // Academy activities state
  const [academyActivities, setAcademyActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [activitiesError, setActivitiesError] = useState(null);
  const [activitiesPage, setActivitiesPage] = useState(1);
  const [activitiesTotalPages, setActivitiesTotalPages] = useState(1);

  // Add new state for age error
  const [ageError, setAgeError] = useState('');

  // Add new state for password validation
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    number: false,
    special: false,
    match: false
  });

  const handleProfilePictureChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
    }
  };
  
  const handleProfilePictureUpload = async () => {
    if (!profilePicture) {
      toast.warning('Please select an image first');
      return;
    }
    
    try {
      setUploadingPicture(true);
      const response = await profileService.uploadProfilePicture(profilePicture);
      toast.success('Profile picture updated successfully');
      // Refresh user data or update profile picture URL
    } catch (error) {
      toast.error('Failed to upload profile picture: ' + (error.response?.data?.message || error.message));
    } finally {
      setUploadingPicture(false);
    }
  };

  // Define fetch functions at the top
  const fetchTeamInfo = async () => {
    try {
      setTeamLoading(true);
      setTeamError(null);
      
      // Get player_id from playerInfo or session storage
      const playerId = playerInfo?.id_player || sessionStorage.getItem('player_id');
      
      if (!playerId) {
        setTeamError("No player_id available, can't fetch team info");
        setTeamLoading(false);
        return;
      }
      
      // Use getMyTeam with player_id
      const response = await teamsService.getMyTeam({
        player_id: playerId,
        include: 'captain,members,ratings'
      });
      
      // Check if the player doesn't belong to any team
      if (response && response.success === false && response.message === "Player does not belong to any team") {
        // Clear team data from session storage
        sessionStorage.removeItem('has_teams');
        sessionStorage.removeItem('id_teams');
        sessionStorage.removeItem('teams');
        sessionStorage.removeItem('is_captain');
        
        // Set null teamInfo and a friendly message
        setTeamInfo(null);
        setTeamError(null); // Don't show as error since it's an expected state
        
        setTeamLoading(false);
        return;
      }
      
      if (response && response.success && response.data && response.data.team) {
        const { team, is_captain, members_count } = response.data;
        
        // Store data in session storage
        sessionStorage.setItem('has_teams', 'true');
        sessionStorage.setItem('id_teams', team.id_teams.toString());
        sessionStorage.setItem('teams', JSON.stringify([team]));
        sessionStorage.setItem('is_captain', is_captain.toString());
        
        // Add additional fields to team object
        const enrichedTeam = {
          ...team,
          is_captain,
          members_count,
          // Ensure members have the is_captain flag
          members: team.members?.map(member => ({
            ...member,
            is_captain: member.id_player === team.capitain
          })) || []
        };
        
        // Set team info
        setTeamInfo(enrichedTeam);
      } else {
        setTeamInfo(null);
        sessionStorage.removeItem('has_teams');
        sessionStorage.removeItem('id_teams');
        sessionStorage.removeItem('teams');
        sessionStorage.removeItem('is_captain');
        
        // Set error message if there's one in the response
        if (response && response.message && response.message !== "Player does not belong to any team") {
          setTeamError(response.message);
        }
      }
    } catch (error) {
      console.error('Error fetching team info:', error);
      
      // Check for specific error about player not belonging to any team
      if (error.response?.data?.message === "Player does not belong to any team") {
        // Don't show as error, just clear team data
        setTeamInfo(null);
        setTeamError(null);
      } else {
        setTeamError('Failed to load team information: ' + (error.response?.data?.message || error.message));
      }
      
      // Clear team data from session storage on error
      sessionStorage.removeItem('has_teams');
      sessionStorage.removeItem('id_teams');
      sessionStorage.removeItem('teams');
      sessionStorage.removeItem('is_captain');
      setTeamInfo(null);
    } finally {
      setTeamLoading(false);
    }
  };

  const fetchReservations = async () => {
    try {
      setReservationLoading(true);
      setReservationError(null);

      // Fetch upcoming reservations
      const upcomingResponse = await reservationService.getUpcomingReservations();
      if (upcomingResponse && upcomingResponse.status === 'success' && upcomingResponse.data) {
        setUpcomingReservations(upcomingResponse.data);
      } else {
        setUpcomingReservations([]);
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
      
      if (historyResponse && historyResponse.status === 'success') {
        // Handle different possible response formats
        if (historyResponse.data && Array.isArray(historyResponse.data)) {
          // Direct array format
          setHistoryReservations(historyResponse.data);
          setTotalPages(1); // No pagination info in this format
        } else if (historyResponse.data && historyResponse.data.data) {
          // Laravel pagination format
          setHistoryReservations(historyResponse.data.data);
          setTotalPages(historyResponse.data.last_page || 1);
        } else if (historyResponse.data && typeof historyResponse.data === 'object') {
          // Handle other potential response formats
          const dataArray = Object.values(historyResponse.data);
          if (Array.isArray(dataArray[0])) {
            setHistoryReservations(dataArray[0]);
          } else {
            setHistoryReservations(dataArray);
          }
          setTotalPages(1);
        } else {
          // Fall back to empty array if we can't extract data
          setHistoryReservations([]);
          setTotalPages(1);
        }
      } else {
        setHistoryReservations([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error fetching reservations:', error);
      toast.error('Error fetching reservations: ' + (error.message || 'Unknown error'));
      setReservationError('Failed to load reservations');
      setUpcomingReservations([]);
      setHistoryReservations([]);
    } finally {
      setReservationLoading(false);
    }
  };

  const fetchMemberships = async () => {
    try {
      setMembershipsLoading(true);
      setMembershipsError(null);
      
      const response = await academieMemberService.getMyMemberships();
      
      if (response && response.status === 'success' && response.data) {
        setMemberships(response.data);
        
        // Store membership data in session storage
        if (response.data.length > 0) {
          sessionStorage.setItem('academie_memberships', JSON.stringify(response.data));
          sessionStorage.setItem('has_academie_membership', 'true');
          
          // Store first membership id_member for activities API
          const firstMembership = response.data[0];
          if (firstMembership.id_member) {
            sessionStorage.setItem("academy_member_id", firstMembership.id_member);
          }
        } else {
          // No memberships, clear session storage
          sessionStorage.removeItem('academie_memberships');
          sessionStorage.removeItem('academy_member_id');
          sessionStorage.setItem('has_academie_membership', 'false');
          setMemberships([]);
        }
      } else {
        setMemberships([]);
        sessionStorage.removeItem('academie_memberships');
        sessionStorage.removeItem('academy_member_id');
        sessionStorage.setItem('has_academie_membership', 'false');
      }
    } catch (error) {
      toast.error('Error fetching academy memberships: ' + (error.message || 'Unknown error'));
      setMembershipsError('Failed to load memberships');
      setMemberships([]);
      sessionStorage.removeItem('academie_memberships');
      sessionStorage.removeItem('academy_member_id');
      sessionStorage.setItem('has_academie_membership', 'false');
    } finally {
      setMembershipsLoading(false);
    }
  };

  // Fetch user data from API or use session storage as fallback
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Try to get data from API
        const response = await profileService.getProfile();
        if (response && response.data) {
          const user = response.data;
          
          // Get profile picture URL
          let profilePicture = user.pfp;
          if (profilePicture && !profilePicture.startsWith('http')) {
            // Add base URL if it's a relative path
            profilePicture = `${profilePicture}`;
          }
          
          setUserData({
            ...user,
            pfp: profilePicture
          });
          
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
            const convertedActivities = user.reviews.map((review, index) => ({
              id: `${review.id_review || index}-${Date.now()}`,
              title: review.name,
              description: review.description,
              date: new Date(review.created_at).toLocaleDateString(),
              time: new Date(review.created_at).toLocaleTimeString(),
              status: review.status,
              academy: "General"
            }));
            setActivities(convertedActivities);
          }

          // Store player data in session storage if available for other components to use
          if (user.player) {
            sessionStorage.setItem('has_player', 'true');
            sessionStorage.setItem('player_id', user.player.id_player);
            sessionStorage.setItem('player_position', user.player.position);
            sessionStorage.setItem('player_rating', user.player.rating);
          }
        }
      } catch (error) {
        toast.error('Error fetching profile: ' + error.message);
        
        // Fallback to session storage if API fails
        const userDetails = JSON.parse(sessionStorage.getItem('userdetails') || '{}');
        
        // Get profile picture from session storage
        let profilePicture = userDetails.pfp || sessionStorage.getItem('pfp');
        if (!profilePicture || profilePicture === 'null') {
          // Generate avatar if no profile picture is available
          const name = `${userDetails.prenom || ''}+${userDetails.nom || ''}`;
          profilePicture = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=07F468&color=121212&size=128`;
        }
        
        // Set user data from session storage
        if (userDetails.email) {
          const user = {
            ...userDetails,
            userId: userDetails.id_compte || sessionStorage.getItem('userId'),
            pfp: profilePicture
          };
          
          setUserData(user);
          setFormData({
            nom: userDetails.nom || '',
            prenom: userDetails.prenom || '',
            email: userDetails.email || '',
            telephone: userDetails.telephone || '',
            date_naissance: userDetails.date_naissance || '',
            age: userDetails.age || ''
          });
        }
      } finally {
        // Always set loading to false when done
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Function to handle infinite loading issues
  const resetLoadingStates = () => {
    setLoading(false);
    setPlayerLoading(false);
    setTeamLoading(false);
    setReservationLoading(false);
    setMembershipsLoading(false);
    setRequestsLoading(false);
    setIsSearching(false);
    setUploadingPicture(false);
  };

  // Add a safety catch-all to reset loading states after 10 seconds
  useEffect(() => {
    // Reset all loading states when component mounts
    resetLoadingStates();
    
    // Set a timeout to reset all loading states after 10 seconds
    const loadingTimeout = setTimeout(() => {
      resetLoadingStates();
    }, 10000);

    // Clear the timeout when component unmounts
    return () => {
      clearTimeout(loadingTimeout);
      // Also reset loading states when unmounting
      resetLoadingStates();
    };
  }, []);

  // Fetch activity history
  useEffect(() => {
    const fetchActivityHistory = async () => {
      try {
        const response = await profileService.getActivityHistory();
        setActivities(response.data || []);
      } catch (error) {
        toast.error('Error fetching activity history: ' + error.message);
      }
    };
    
    fetchActivityHistory();
  }, []);

  // Fetch academy activities
  useEffect(() => {
    const fetchAcademyActivities = async () => {
      // Get the member ID from session storage
      const academyMemberId = sessionStorage.getItem("academy_member_id");
      
      if (!academyMemberId) {
        // If no member ID found in session storage, return
        console.log("No academy member ID found in session storage");
        return;
      }
      
      try {
        setActivitiesLoading(true);
        setActivitiesError(null);
        
        const params = {
          include: 'activite',
          paginationSize: 10,
          sort_by: 'date_joined',
          sort_order: 'desc',
        };
        
        const response = await activitiesMembersService.getActivitesIn(academyMemberId, params);
        
        if (response && response.message === "Member activities retrieved successfully") {
          // Format the activities data based on the actual API response
          const formattedActivities = response.data.map(item => {
            const activity = item.activite || {};
            return {
              id: item.id_activity_member,
              title: activity.title || 'Academy Activity',
              description: activity.description || '',
              date: `${new Date(activity.date_debut).toLocaleDateString()} - ${new Date(activity.date_fin).toLocaleDateString()}`,
              time: '',
              status: new Date() < new Date(activity.date_fin) ? 'upcoming' : 'completed',
              academy: `Activity #${activity.id_activites}`,
              dateJoined: new Date(item.date_joined).toLocaleDateString()
            };
          });
          
          setAcademyActivities(formattedActivities);
          
          // Set pagination details if available
          if (response.meta) {
            setActivitiesPage(response.meta.current_page || 1);
            setActivitiesTotalPages(response.meta.last_page || 1);
          } else {
            // If no pagination info, assume everything is on one page
            setActivitiesPage(1);
            setActivitiesTotalPages(1);
          }
        } else {
          setAcademyActivities([]);
        }
      } catch (error) {
        console.error('Error fetching academy activities:', error);
        setActivitiesError('Failed to load academy activities. Please try again later.');
      } finally {
        setActivitiesLoading(false);
      }
    };
    
    fetchAcademyActivities();
  }, [activitiesPage]); // Refetch when page changes

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
        toast.error('Error fetching reservations: ' + error.message);
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
      try {
        setMembershipsLoading(true);
        setMembershipsError(null);
        
        const response = await academieMemberService.getMyMemberships();
        if (response && response.success && response.data) {
          // Update state with memberships
          setMemberships(response.data);
          
          // Update session storage
          if (response.data.length > 0) {
            sessionStorage.setItem('academie_memberships', JSON.stringify(response.data));
            sessionStorage.setItem('academy_member_id', response.data[0].id_member);
            sessionStorage.setItem('has_academie_membership', 'true');
          } else {
            // No memberships, clear session storage
            sessionStorage.removeItem('academie_memberships');
            sessionStorage.removeItem('academy_member_id');
            sessionStorage.setItem('has_academie_membership', 'false');
          }
        }
      } catch (error) {
        toast.error('Error fetching academy memberships: ' + error.message);
        setMembershipsError('Failed to load memberships: ' + (error.response?.data?.message || error.message));
      } finally {
        setMembershipsLoading(false);
      }
    };
    
    fetchMemberships();
  }, []);

  // Fetch player data when the user has a player account
  useEffect(() => {
    const fetchPlayerInfo = async () => {
      try {
        setPlayerLoading(true);
        
        // First check if the player data is already in userData
        if (userData && userData.player) {
          // Create a copy of player data without requests for cleaner state
          const playerData = { ...userData.player };
          delete playerData.sent_requests;
          delete playerData.received_requests;
          
          setPlayerInfo(playerData);
          
          // Update session storage with latest data
          sessionStorage.setItem('has_player', 'true');
          sessionStorage.setItem('isPlayer', 'true');
          sessionStorage.setItem('player_id', playerData.id_player || playerData.id);
          sessionStorage.setItem('player_position', playerData.position);
          sessionStorage.setItem('player_rating', playerData.rating || '0');
          
          setPlayerLoading(false);
          return;
        }
        
        // Check if user already has a player ID in session storage
        const playerId = sessionStorage.getItem('player_id');
        
        if (!playerId) {
          // If no player ID in session, check if we have a flag indicating they're a player
          const hasPlayer = sessionStorage.getItem('has_player') === 'true' || 
                           sessionStorage.getItem('isPlayer') === 'true';
          
          if (!hasPlayer) {
            // User doesn't have a player profile
            setPlayerLoading(false);
            return;
          }
          
          // Try to get the user's player profile by user ID
          const userId = userData?.userId || sessionStorage.getItem('userId');
          if (userId) {
            // Get all players and filter by user ID
            const allPlayersResponse = await playersService.getAllPlayers();
            if (allPlayersResponse && allPlayersResponse.data) {
              // Find the player with matching user ID
              const userPlayer = allPlayersResponse.data.find(
                player => player.id_compte === parseInt(userId, 10)
              );
              
              if (userPlayer) {
                // Remove requests data if present
                const playerData = { ...userPlayer };
                delete playerData.sent_requests;
                delete playerData.received_requests;
                
                setPlayerInfo(playerData);
                
                // Update session storage with found player data
                sessionStorage.setItem('has_player', 'true');
                sessionStorage.setItem('isPlayer', 'true');
                sessionStorage.setItem('player_id', playerData.id_player || playerData.id);
                sessionStorage.setItem('player_position', playerData.position);
                sessionStorage.setItem('player_rating', playerData.rating || '0');
                
                setPlayerLoading(false);
                return;
              }
            }
          }
          
          // If we still don't have a player ID, we can't fetch the player
          setPlayerLoading(false);
          return;
        }
        
        // If we have a player ID, fetch the player data
        try {
          const response = await playersService.getPlayer(playerId);
          
          // Handle different response formats
          let playerData = null;
          
          if (response.data?.data?.player) {
            // Format where player is nested in data.data.player
            playerData = response.data.data.player;
          } else if (response.data?.player) {
            // Format where player is nested in data.player
            playerData = response.data.player;
          } else if (response.data?.data) {
            // Format where player is in data.data
            playerData = response.data.data;
          } else {
            // Direct format
            playerData = response.data;
          }
          
          if (playerData) {
            // Remove requests data if present to keep the state clean
            const cleanPlayerData = { ...playerData };
            delete cleanPlayerData.sent_requests;
            delete cleanPlayerData.received_requests;
            
            // Ensure we have the correct ID field
            cleanPlayerData.id_player = cleanPlayerData.id_player || cleanPlayerData.id;
            
            setPlayerInfo(cleanPlayerData);
            
            // Update session storage with latest data
            sessionStorage.setItem('has_player', 'true');
            sessionStorage.setItem('isPlayer', 'true');
            sessionStorage.setItem('player_id', cleanPlayerData.id_player);
            sessionStorage.setItem('player_position', cleanPlayerData.position);
            sessionStorage.setItem('player_rating', cleanPlayerData.rating || '0');
          }
        } catch (error) {
          // Handle "Player not found" error
          if (error.response && error.response.data && error.response.data.message === "Player not found") {
            console.log("Player not found, clearing player data");
            // Clear player info and session storage since player doesn't exist
            setPlayerInfo(null);
            sessionStorage.removeItem('has_player');
            sessionStorage.removeItem('isPlayer');
            sessionStorage.removeItem('player_id');
            sessionStorage.removeItem('player_position');
            sessionStorage.removeItem('player_rating');
          } else {
            throw error; // Re-throw other errors to be caught by the outer catch block
          }
        }
      } catch (error) {
        console.error('Error fetching player info:', error);
        setPlayerError('Failed to load player information');
        
        // If API call fails with 404, clear any potentially invalid player data
        if (error.response && error.response.status === 404) {
          sessionStorage.removeItem('has_player');
          sessionStorage.removeItem('isPlayer');
          sessionStorage.removeItem('player_id');
          sessionStorage.removeItem('player_position');
          sessionStorage.removeItem('player_rating');
        }
      } finally {
        setPlayerLoading(false);
      }
    };
    
    fetchPlayerInfo();
  }, [userData]);

  // Fetch team data when the user has a team or is a team member
  useEffect(() => {
    const fetchTeamInfo = async () => {
      try {
        setTeamLoading(true);
        setTeamError(null);
        
        // Get player_id from playerInfo or session storage
        const playerId = playerInfo?.id_player || sessionStorage.getItem('player_id');
        
        if (!playerId) {
          console.log("No player_id available, can't fetch team info");
          setTeamLoading(false);
          return;
        }
        
        // Use getMyTeam with player_id
        const response = await teamsService.getMyTeam({
          player_id: playerId,
          include: 'captain,members,ratings'
        });
        
        // Check if the player doesn't belong to any team
        if (response && response.success === false && response.message === "Player does not belong to any team") {
          // This is an expected case, not an error
          setTeamInfo(null);
          sessionStorage.removeItem('has_teams');
          sessionStorage.removeItem('id_teams');
          sessionStorage.removeItem('teams');
          sessionStorage.removeItem('is_captain');
          setTeamLoading(false);
          return;
        }
        
        if (response && response.success && response.data && response.data.team) {
          const { team, is_captain, members_count } = response.data;
          
          // Store data in session storage
          sessionStorage.setItem('has_teams', 'true');
          sessionStorage.setItem('id_teams', team.id_teams.toString());
          sessionStorage.setItem('teams', JSON.stringify([team]));
          sessionStorage.setItem('is_captain', is_captain.toString());
          
          // Add additional fields to team object
          const enrichedTeam = {
            ...team,
            is_captain,
            members_count,
            // Ensure members have the is_captain flag
            members: team.members?.map(member => ({
              ...member,
              is_captain: member.id_player === team.capitain
            })) || []
          };
          
          // Set team info
          setTeamInfo(enrichedTeam);
        } else {
          setTeamInfo(null);
          sessionStorage.removeItem('has_teams');
          sessionStorage.removeItem('id_teams');
          sessionStorage.removeItem('teams');
          sessionStorage.removeItem('is_captain');
        }
      } catch (error) {
        console.error('Error fetching team info:', error);
        // Check for specific error about player not belonging to any team
        if (error.response?.data?.message === "Player does not belong to any team") {
          // Don't show as error, just clear team data
          setTeamInfo(null);
          setTeamError(null);
        } else {
          setTeamError('Failed to load team information: ' + (error.response?.data?.message || error.message));
        }
        
        // Clear team data from session storage on error
        sessionStorage.removeItem('has_teams');
        sessionStorage.removeItem('id_teams');
        sessionStorage.removeItem('teams');
        sessionStorage.removeItem('is_captain');
      } finally {
        setTeamLoading(false);
      }
    };
    
    fetchTeamInfo();
  }, [userData, playerInfo]);

  // Add this new effect to fetch team invitations and join requests
  useEffect(() => {
    const fetchPendingInvitations = async () => {
      if (!playerInfo) return;
      
      try {
        setInvitationsLoading(true);
        const response = await playerTeamsService.getPendingInvitations({ page: invitationsPage });
        
        if (response && response.data) {
          setPendingInvitations(response.data);
          
          // Handle pagination if available in the response
          if (response.meta) {
            setInvitationsTotalPages(response.meta.last_page || 1);
          }
        }
      } catch (error) {
        console.error('Error fetching pending invitations:', error);
      } finally {
        setInvitationsLoading(false);
      }
    };
    
    const fetchPendingJoinRequests = async () => {
      if (!teamInfo) return;
      
      // Only fetch if the current user is the captain
      if (!teamInfo.is_captain) return;
      
      try {
        setInvitationsLoading(true);
        const response = await playerTeamsService.getPendingJoinRequests();
        
        if (response && response.data) {
          setPendingJoinRequests(response.data);
        }
      } catch (error) {
        console.error('Error fetching pending join requests:', error);
      } finally {
        setInvitationsLoading(false);
      }
    };
    
    fetchPendingInvitations();
    fetchPendingJoinRequests();
  }, [playerInfo, teamInfo, invitationsPage]);

  // Fetch player requests when the player info is loaded
  useEffect(() => {
    const fetchPlayerRequests = async () => {
      if (!playerInfo) return;
      
      try {
        setRequestsLoading(true);
        setRequestsError(null);
        
        // Prepare request parameters with pagination and filtering
        const params = {
          paginationSize: requestsPerPage,
          page: requestsPage
        };
        
        // Add status filter if not 'all'
        if (requestsFilter !== 'all') {
          params.status = requestsFilter;
        }
        
        // Add search query if present
        if (requestsSearchQuery.trim()) {
          params.search = requestsSearchQuery.trim();
        }
        
        // Use the getPlayerRequests method with parameters
        const response = await playerRequestsService.getPlayerRequests(params);
        
        if (response && response.data) {
          // Split into sent and received
          const playerId = playerInfo.id_player || playerInfo.id;
          const sent = response.data.filter(req => req.sender.toString() === playerId.toString());
          const received = response.data.filter(req => req.receiver.toString() === playerId.toString());
          
          setPlayerRequests({
            sent,
            received
          });
          
          // Set pagination info
          if (response.meta) {
            setRequestsTotalPages(response.meta.last_page || 1);
          }
        }
        
        // Also fetch available players for the dropdown
        fetchAvailablePlayers();
        
      } catch (error) {
        console.error('Error fetching player requests:', error);
        setRequestsError('Failed to load player requests: ' + (error.response?.data?.message || error.message));
      } finally {
        setRequestsLoading(false);
      }
    };
    
    fetchPlayerRequests();
  }, [playerInfo, requestsPage, requestsFilter, requestsSearchQuery, requestsPerPage]);

  // Update the invitation handling functions
  const handleAcceptInvitation = async (id) => {
    try {
      setInvitationsLoading(true);
      
      console.log(`Accepting invitation ${id}`);
      const response = await playerTeamsService.acceptInvitation(id);
      
      if (response && (response.success || response.status === 'success')) {
        toast.success('Invitation accepted successfully');
        
        // Remove from pending invitations
        setPendingInvitations(prev => prev.filter(inv => inv.id !== id));
        
        // Refresh team data
        if (response.data && response.data.team_id) {
          // Update session storage with team data
          sessionStorage.setItem('has_teams', 'true');
          sessionStorage.setItem('id_teams', response.data.team_id.toString());
          
          try {
            // Update teams array in session storage
            let teamsArray = [];
            const existingTeams = sessionStorage.getItem('teams');
            
            if (existingTeams) {
              teamsArray = JSON.parse(existingTeams);
              if (!Array.isArray(teamsArray)) teamsArray = [teamsArray];
            }
            
            // Add the new team if not already in the array
            const teamExists = teamsArray.some(team => team.id_teams === response.data.team_id || team.id === response.data.team_id);
            if (!teamExists) {
              teamsArray.push(response.data);
            }
            
            sessionStorage.setItem('teams', JSON.stringify(teamsArray));
          } catch (e) {
            console.error('Error updating teams in session storage:', e);
          }
          
          // Refresh team info
          await fetchTeamInfo();
        }
      } else {
        toast.error(response?.message || 'Failed to accept invitation');
      }
    } catch (error) {
      console.error('Error accepting invitation:', error);
      toast.error('Error accepting invitation: ' + (error.response?.data?.message || error.message));
    } finally {
      setInvitationsLoading(false);
    }
  };

  const handleRefuseInvitation = async (id) => {
    try {
      setInvitationsLoading(true);
      
      console.log(`Refusing invitation ${id}`);
      const response = await playerTeamsService.refuseInvitation(id);
      
      if (response && (response.success || response.status === 'success')) {
        toast.success('Invitation refused successfully');
        
        // Remove from pending invitations
        setPendingInvitations(prev => prev.filter(inv => inv.id !== id));
      } else {
        toast.error(response?.message || 'Failed to refuse invitation');
      }
    } catch (error) {
      console.error('Error refusing invitation:', error);
      toast.error('Error refusing invitation: ' + (error.response?.data?.message || error.message));
    } finally {
      setInvitationsLoading(false);
    }
  };

  const handleProcessJoinRequest = async (id, status) => {
    try {
      setInvitationsLoading(true);
      
      console.log(`Processing join request ${id} with status ${status}`);
      const response = await playerTeamsService.processJoinRequest(id, { status });
      
      if (response && (response.success || response.status === 'success')) {
        toast.success(`Join request ${status} successfully`);
        
        // Remove from pending join requests
        setPendingJoinRequests(prev => prev.filter(req => req.id !== id));
        
        // Refresh team members if accepted and we have team info
        if (status === 'accepted' && teamInfo) {
          try {
            const membersResponse = await playerTeamsService.getTeamMembers(teamInfo.id_teams);
            
            if (membersResponse && membersResponse.data) {
              const members = membersResponse.data;
              
              // Mark the captain in the members list
              const membersWithCaptainFlag = members.map(member => ({
                ...member,
                is_captain: member.id_player === teamInfo.captain_id || member.id_player === teamInfo.capitain
              }));
              
              // Update team info with members
              setTeamInfo(prevTeamInfo => ({
                ...prevTeamInfo,
                members: membersWithCaptainFlag,
                member_count: members.length
              }));
            }
          } catch (e) {
            console.error('Error refreshing team members:', e);
          }
        }
      } else {
        toast.error(response?.message || `Failed to ${status} join request`);
      }
    } catch (error) {
      console.error('Error processing join request:', error);
      toast.error('Error processing join request: ' + (error.response?.data?.message || error.message));
    } finally {
      setInvitationsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'age') {
      const age = parseInt(value);
      if (isNaN(age)) {
        setAgeError('Please enter a valid number');
      } else if (age < 16) {
        setAgeError('Age must be at least 16 years');
      } else if (age > 70) {
        setAgeError('Age must not exceed 70 years');
      } else {
        setAgeError('');
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validate password requirements
    if (name === 'new_password') {
      setPasswordValidation(prev => ({
        ...prev,
        length: value.length >= 8,
        number: /\d/.test(value),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(value),
        match: value === passwordFormData.confirm_password
      }));
    }

    // Check if passwords match
    if (name === 'confirm_password') {
      setPasswordValidation(prev => ({
        ...prev,
        match: value === passwordFormData.new_password
      }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility({ ...passwordVisibility, [field]: !passwordVisibility[field] });
  };

  const handleSubmitPasswordChange = async (e) => {
    e.preventDefault();
    
    // Reset previous messages
    setPasswordError(null);
    setPasswordSuccess(null);
    
    // Validate passwords
    if (passwordFormData.new_password !== passwordFormData.confirm_password) {
      setPasswordError("New passwords don't match");
      return;
    }

    // Validate password requirements
    if (!passwordValidation.length || !passwordValidation.number || !passwordValidation.special) {
      setPasswordError("Password doesn't meet the requirements");
      return;
    }
    
    try {
      // Call API to change password
      const response = await profileService.changePassword({
        current_password: passwordFormData.current_password,
        new_password: passwordFormData.new_password,
        new_password_confirmation: passwordFormData.confirm_password
      });
      
      if (response && (response.success || response.status === 'success')) {
        // Show success message
        setPasswordSuccess('Password changed successfully');
        
        // Reset form
        setPasswordFormData({
          current_password: '',
          new_password: '',
          confirm_password: ''
        });
        
        // Close form after delay
        setTimeout(() => {
          setShowPasswordForm(false);
          setPasswordSuccess(null);
        }, 3000);
      }
    } catch (error) {
      console.error('Error changing password:', error);
      const errorMessage = error.response?.data?.message || error.message;
      setPasswordError(
        errorMessage === 'Invalid current password' 
          ? 'Current password is incorrect. If you logged in with Google, check your email (including spam/junk folder) for your temporary password.'
          : `Failed to change password: ${errorMessage}`
      );
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    
    // Validate age before submitting
    const age = parseInt(formData.age);
    if (isNaN(age) || age < 16 || age > 70) {
      setAgeError('Please enter a valid age between 16 and 70');
      return;
    }
    
    try {
      const response = await profileService.updateProfile(formData);
      
      if (response && (response.success || response.status === 'success')) {
        // Update user data in state and session storage
        const updatedUser = {
          ...userData,
          ...formData
        };
        setUserData(updatedUser);
        
        // Update session storage with the new user details
        const currentUserDetails = JSON.parse(sessionStorage.getItem('userdetails') || '{}');
        const updatedUserDetails = {
          ...currentUserDetails,
          ...formData
        };
        sessionStorage.setItem('userdetails', JSON.stringify(updatedUserDetails));
        
        // Also update individual session items if they exist
        if (formData.email) sessionStorage.setItem('email', formData.email);
        if (formData.nom) sessionStorage.setItem('name', `${formData.prenom} ${formData.nom}`);
        
        // Show success message and exit edit mode
        toast.success('Profile updated successfully');
        setEditMode(false);
      }
    } catch (error) {
      toast.error('Failed to update profile: ' + (error.response?.data?.message || error.message));
    }
  };

  const handlePlayerInputChange = (e) => {
    const { name, value } = e.target;
    setPlayerFormData({ ...playerFormData, [name]: value });
  };

  const handleTeamInputChange = (e) => {
    const { name, value } = e.target;
    setTeamFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear any previous errors
    setTeamFormError(null);
  };

  const handleJoinTeamInputChange = (e) => {
    const { name, value } = e.target;
    setJoinTeamData({ ...joinTeamData, [name]: value });
  };

  const handleJoinTeam = async (e) => {
    e.preventDefault();
    
    try {
      const response = await teamsService.joinTeam(joinTeamData.team_id);
      
      if (response && response.success) {
        toast.success('Successfully joined team');
        setShowJoinTeamSection(false);
        setJoinTeamData({ team_id: '' });
        
        // Update teams in session storage
        try {
          const teams = JSON.parse(sessionStorage.getItem('teams') || '[]');
          teams.push(response.data);
          sessionStorage.setItem('teams', JSON.stringify(teams));
        } catch (e) {
          toast.warning('Error updating teams in storage');
        }
        
        await fetchTeamInfo();
      }
    } catch (error) {
      toast.error('Error joining team: ' + error.message);
    }
  };

  const handleSubmitPlayerForm = async (e) => {
    e.preventDefault();
    
    // Reset messages
    setPlayerFormError(null);
    setPlayerFormSuccess(null);
    
    // Validate form data
    if (!playerFormData.position) {
      setPlayerFormError('Please select a position');
      return;
    }
    
    try {
      setPlayerLoading(true);
      
      // Prepare data for API
      const apiData = {
        ...playerFormData,
        id_compte: userData?.userId || sessionStorage.getItem('userId')
      };
      
      // Ensure times are in HH:MM:SS format as required by the backend
      if (apiData.starting_time) {
        // Split the time into parts, handling both HH:MM and HH:MM:SS formats
        const timeParts = apiData.starting_time.split(':');
        const hours = timeParts[0] ? timeParts[0].padStart(2, '0') : '00';
        const minutes = timeParts[1] ? timeParts[1].padStart(2, '0') : '00';
        const seconds = timeParts[2] ? timeParts[2].padStart(2, '0') : '00';
        
        // Reconstruct in the required format
        apiData.starting_time = `${hours}:${minutes}:${seconds}`;
      }
      
      if (apiData.finishing_time) {
        // Split the time into parts, handling both HH:MM and HH:MM:SS formats
        const timeParts = apiData.finishing_time.split(':');
        const hours = timeParts[0] ? timeParts[0].padStart(2, '0') : '00';
        const minutes = timeParts[1] ? timeParts[1].padStart(2, '0') : '00';
        const seconds = timeParts[2] ? timeParts[2].padStart(2, '0') : '00';
        
        // Reconstruct in the required format
        apiData.finishing_time = `${hours}:${minutes}:${seconds}`;
      }
      
      let response;
      if (playerInfo) {
        // Update existing player - use the correct ID field (id or id_player)
        const playerId = playerInfo.id_player || playerInfo.id;
        response = await playersService.updatePlayer(playerId, apiData);
      } else {
        // Create new player
        response = await playersService.createPlayer(apiData);
      }
      
      // Handle both response formats
      const responseData = response.data?.data || response.data;
      
      if (response.success || responseData) {
        // Get the player data
        const player = responseData || response.data;
        
        // Update player info
        setPlayerInfo(player);
        
        // Update session storage
        sessionStorage.setItem('has_player', 'true');
        sessionStorage.setItem('isPlayer', 'true');
        sessionStorage.setItem('player_id', player.id_player || player.id);
        sessionStorage.setItem('player_position', player.position);
        sessionStorage.setItem('player_rating', player.rating || '0');
        
        // Show success message
        setPlayerFormSuccess(playerInfo ? 'Player profile updated successfully' : 'Player profile created successfully');
        
        // Close form after success
        setTimeout(() => {
          setShowPlayerForm(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Error saving player profile:', error);
      setPlayerFormError('Failed to save player profile: ' + (error.response?.data?.message || error.message));
    } finally {
      setPlayerLoading(false);
    }
  };

  const handleSubmitTeamForm = async (e) => {
    e.preventDefault();
    
    if (!teamInfo || !teamInfo.is_captain) {
      setTeamFormError('You must be the team captain to make changes');
      return;
    }
    
    try {
      setTeamLoading(true);
      
      const formatTime = (timeString) => {
        if (!timeString) return null;
        
        // Split the time into parts, handling both HH:MM and HH:MM:SS formats
        const timeParts = timeString.split(':');
        const hours = timeParts[0] ? timeParts[0].padStart(2, '0') : '00';
        const minutes = timeParts[1] ? timeParts[1].padStart(2, '0') : '00';
        const seconds = timeParts[2] ? timeParts[2].padStart(2, '0') : '00';
        
        // Reconstruct in the required format
        return `${hours}:${minutes}:${seconds}`;
      };
      
      const teamFormValues = {
        capitain: parseInt(teamFormData.selected_member, 10), // Using id_compte for captain
        starting_time: formatTime(teamFormData.starting_time),
        finishing_time: formatTime(teamFormData.finishing_time),
        // Keep existing stats
        misses: teamInfo.misses || 0,
        invites_accepted: teamInfo.invites_accepted || 0,
        invites_refused: teamInfo.invites_refused || 0,
        total_invites: teamInfo.total_invites || 0
      };
      
      // Validate times before sending
      if (!teamFormValues.starting_time || !teamFormValues.finishing_time) {
        setTeamFormError('Please set both starting and finishing times');
        setTeamLoading(false);
        return;
      }
      
      const response = await teamsService.updateTeam(teamInfo.id_teams, teamFormValues);
      
      if (response && (response.success || response.status === 'success')) {
        setTeamFormSuccess('Team updated successfully');
        
        // Update the team info in state
        setTeamInfo(prev => ({
          ...prev,
          starting_time: teamFormValues.starting_time,
          finishing_time: teamFormValues.finishing_time,
          capitain: teamFormValues.capitain,
          members: prev.members?.map(member => ({
            ...member,
            is_captain: member.id_compte === teamFormValues.capitain
          }))
        }));
        
        // Close form after success
        setTimeout(() => {
          setShowTeamForm(false);
          setTeamFormSuccess(null);
        }, 2000);
      }
    } catch (error) {
      console.error('Error updating team:', error);
      const errorMessage = error.response?.data?.error 
        ? Object.values(error.response.data.error).flat().join(', ')
        : error.message;
      setTeamFormError('Failed to update team: ' + errorMessage);
    } finally {
      setTeamLoading(false);
    }
  };

  // Modified handleDeletePlayer to show confirmation modal instead of window.confirm
  const handleDeletePlayer = () => {
    if (!playerInfo) return;
    
    // Get the player ID (handle both id and id_player fields)
    const playerId = playerInfo.id_player || playerInfo.id;
    
    if (!playerId) {
      setPlayerFormError('Cannot delete player: No player ID found');
      return;
    }
    
    // Show deletion confirmation modal
    setDeleteTarget({
      type: 'player',
      id: playerId,
      name: `${userData?.prenom || ''} ${userData?.nom || ''}'s Player Profile`
    });
    setShowDeleteConfirmation(true);
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

  const handleSearchPlayers = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    try {
      setIsSearching(true);
      setSearchError(null);
      
      // Call API to search for players
      const response = await playersService.getAllPlayers({ search: query });
      
      if (response && response.data) {
        setSearchResults(response.data);
      }
    } catch (error) {
      console.error('Error searching players:', error);
      setSearchError('Failed to search players: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsSearching(false);
    }
  };
  
  // Debounce search to avoid too many API calls
  const debouncedSearch = useCallback(
    debounce((query) => {
      handleSearchPlayers(query);
    }, 500),
    []
  );
  
  const handlePlayerSearchChange = (e) => {
    const query = e.target.value;
    setPlayerSearchQuery(query);
    debouncedSearch(query);
  };

  // Handle confirmation of deletion after modal is shown
  const confirmDelete = async () => {
    try {
      if (!deleteTarget) return;
      
      if (deleteTarget.type === 'player' && deleteTarget.id) {
        setPlayerLoading(true);
        
        // Call API to delete player
        const response = await playersService.deletePlayer(deleteTarget.id);
        
        if (response && (response.success || response.status === 'success')) {
          // Clear player info and session storage
          setPlayerInfo(null);
          sessionStorage.removeItem('has_player');
          sessionStorage.removeItem('isPlayer');
          sessionStorage.removeItem('player_id');
          sessionStorage.removeItem('player_position');
          sessionStorage.removeItem('player_rating');
          
          // Show success message
          toast.success(response.message || 'Player profile deleted successfully');
        }
      } else if (deleteTarget.type === 'team' && deleteTarget.id) {
        setTeamLoading(true);
        
        // Call API to delete team
        const response = await teamsService.deleteTeam(deleteTarget.id);
        
        if (response && (response.success || response.status === 'success' || response.message)) {
          // Clear team info and session storage
          setTeamInfo(null);
          sessionStorage.removeItem('has_teams');
          sessionStorage.removeItem('id_teams');
          sessionStorage.removeItem('teams');
          sessionStorage.removeItem('is_captain');
          
          // Show success message from API response
          toast.success(response.message || 'Team deleted successfully');
          
          // Close the modal immediately
          setShowDeleteConfirmation(false);
          setDeleteTarget(null);
          setTeamLoading(false);
          
          // Redirect to client home page after a short delay
          setTimeout(() => {
            window.location.href = '/Client';
          }, 1500);
          
          return; // Exit early to prevent the modal from closing again
        }
      }
    } catch (error) {
      console.error('Error deleting resource:', error);
      if (deleteTarget.type === 'player') {
        setPlayerFormError('Failed to delete player: ' + (error.response?.data?.message || error.message));
        toast.error('Failed to delete player: ' + (error.response?.data?.message || error.message));
      } else if (deleteTarget.type === 'team') {
        setTeamFormError('Failed to delete team: ' + (error.response?.data?.message || error.message));
        toast.error('Failed to delete team: ' + (error.response?.data?.message || error.message));
      }
    } finally {
      // Close the confirmation modal and reset state
      // Only reaches here if we didn't return early for team deletion success
      setShowDeleteConfirmation(false);
      setDeleteTarget(null);
      setPlayerLoading(false);
      setTeamLoading(false);
    }
  };

  // Add missing function to handle cancelling a reservation
  const handleCancelReservation = async (reservationId) => {
    try {
      // First check if the endpoint exists in the service
      const cancelEndpoint = reservationService.cancelReservation ? 
        'cancelReservation' : 'deleteReservation';
      
      console.log(`Cancelling reservation ${reservationId} using ${cancelEndpoint}`);
      
      // Immediately update the UI by removing the cancelled reservation
      setUpcomingReservations(prev => 
        prev.filter(res => res.id_reservation !== reservationId)
      );
      
      // Show pending status to user
      toast.info('Cancelling reservation...');
      
      const response = await reservationService[cancelEndpoint](reservationId);
      
      if (response && (response.success || response.status === 'success' || response.message)) {
        // Success! 
        toast.success(response.message || 'Reservation cancelled successfully');
      } else {
        toast.error(response?.message || 'Failed to cancel reservation');
        
        // If failed, refresh to restore accurate data
        await fetchReservations();
      }
    } catch (cancelError) {
      console.error('Error cancelling reservation:', cancelError);
      toast.error('Error cancelling reservation: ' + (cancelError.response?.data?.message || cancelError.message));
      
      // On error, refresh to restore accurate data
      await fetchReservations();
    } finally {
      // Always refresh reservations after a delay to ensure data is updated
      setTimeout(() => {
        fetchReservations();
      }, 500);
    }
  };

  // Add functions for handling search and filtering
  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    setCurrentPage(1); // Reset to first page when changing filter
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Handle changing page for academy activities
  const handleActivitiesPageChange = (page) => {
    setActivitiesPage(page);
  };

  const handleInvitationsPageChange = (page) => {
    setInvitationsPage(page);
  };

  // Add functions for academy memberships
  const handleCancelMembership = async (academieId) => {
    try {
      // Try both cancelMembership and cancelSubscription functions
      const cancelFunction = academieMemberService.cancelMembership || academieMemberService.cancelSubscription;
      
      if (!cancelFunction) {
        throw new Error('Cancel membership function not available');
      }
      
      const response = await cancelFunction(academieId);
      
      if (response && (response.success || response.status === 'success')) {
        toast.success('Membership cancelled successfully');
        
        // Update memberships in state
        setMemberships(prevMemberships => 
          prevMemberships.filter(membership => membership.id_academie !== academieId)
        );
        
        // Update session storage - first remove from array
        const storedMemberships = JSON.parse(sessionStorage.getItem('academie_memberships') || '[]');
        const updatedMemberships = storedMemberships.filter(
          membership => membership.id_academie !== academieId
        );
        
        if (updatedMemberships.length > 0) {
          sessionStorage.setItem('academie_memberships', JSON.stringify(updatedMemberships));
          sessionStorage.setItem('academy_member_id', updatedMemberships[0].id_member);
          sessionStorage.setItem('has_academie_membership', 'true');
        } else {
          // No more memberships
          sessionStorage.removeItem('academie_memberships');
          sessionStorage.removeItem('academy_member_id');
          sessionStorage.setItem('has_academie_membership', 'false');
        }
        
        // Refresh memberships
        await fetchMemberships();
      } else {
        toast.error('Failed to cancel membership');
      }
    } catch (error) {
      console.error('Error cancelling membership:', error);
      toast.error('Error cancelling membership: ' + (error.response?.data?.message || error.message));
    }
  };

  // Update the handleUpdatePlan function to show the modal instead of immediately updating
  const handleUpdatePlan = async (academieId, currentPlan) => {
    setPlanChangeAcademieId(academieId);
    setSelectedPlan(currentPlan || 'base');
    setShowPlanModal(true);
  };

  // Add this new function to handle the actual plan update
  const confirmPlanUpdate = async () => {
    try {
      // Format the data correctly for the API
      // Backend requires subscription_plan to be either 'base' or 'premium'
      let planValue = (selectedPlan || '').toString().toLowerCase();
      
      // Validate the plan value
      if (planValue !== 'base' && planValue !== 'premium') {
        // If invalid, default to 'base'
        planValue = 'base';
        console.warn(`Invalid plan value '${selectedPlan}' converted to 'base'`);
      }
      
      const planData = {
        subscription_plan: planValue
      };
      
      console.log('Updating plan with data:', planData);
      
      const response = await academieMemberService.updatePlan(planChangeAcademieId, planData);
      
      if (response && (response.success || response.status === 'success')) {
        toast.success(response.message || 'Plan updated successfully');
        
        // Close the modal
        setShowPlanModal(false);
        
        // Update memberships in state and session storage
        await fetchMemberships();
      } else {
        const errorMsg = response?.errors?.subscription_plan?.[0] || 
                        response?.message || 
                        'Failed to update membership plan';
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error('Error updating plan:', error);
      
      // Extract detailed error message if available
      const errorData = error.response?.data;
      const errorMsg = errorData?.errors?.subscription_plan?.[0] || 
                      errorData?.message || 
                      error.message || 
                      'Error updating membership plan';
      
      toast.error(errorMsg);
    }
  };

  // Add function to handle team deletion
  const handleDeleteTeam = () => {
    if (!teamInfo || !teamInfo.is_captain) return;
    
    // Get the team ID
    const teamId = teamInfo.id_teams;
    
    if (!teamId) {
      setTeamFormError('Cannot delete team: No team ID found');
      return;
    }
    
    // Show deletion confirmation modal
    setDeleteTarget({
      type: 'team',
      id: teamId,
      name: teamInfo.name || teamInfo.team_name || `Team #${teamId}`
    });
    setShowDeleteConfirmation(true);
  };

  // Add function to handle removing a member from a team
  const handleRemoveMember = async (playerId) => {
    try {
      if (!teamInfo?.id_teams) {
        toast.error('Team ID is missing');
        return;
      }

      const response = await teamsService.removeTeamMember(teamInfo.id_teams, playerId, {
        captain_id: teamInfo.is_captain
      });
      
      if (response && response.success) {
        toast.success('Member removed successfully');
        await fetchTeamInfo();
      }
    } catch (error) {
      toast.error('Error removing team member: ' + error.message);
    }
  };

  // Add function to handle team member invitation
  const handleInviteMember = async (e) => {
    e.preventDefault();
    
    try {
      if (!teamInfo?.id_teams) {
        toast.error('Team ID is missing');
        return;
      }
      
      if (!invitePlayerData.player_id) {
        toast.error('Please select a player');
        return;
      }

      const teamId = teamInfo.id_teams;
      const playerId = invitePlayerData.player_id;
      
      setInvitationsLoading(true);
      setInviteError(null);
      
      console.log(`Inviting player ${playerId} to team ${teamId}`);
      toast.info('Inviting player to team...');
      
      // Skip the problematic service methods entirely and use a direct API call
      // Import the API client directly
      const apiClient = await import('../../lib/userapi').then(module => module.default);
      
      // Try the most likely endpoint paths
      let response;
      try {
        // First attempt - team invite endpoint
        response = await apiClient.post(`/api/user/v1/teams/${teamId}/members`, {
          player_id: playerId
        });
      } catch (firstError) {
        console.log("First invite attempt failed, trying alternative endpoint", firstError);
        try {
          // Second attempt - direct team member add
          response = await apiClient.post(`/api/user/v1/player-teams/${teamId}/invite`, {
            player_id: playerId
          });
        } catch (secondError) {
          console.log("Second invite attempt failed, trying alternative endpoint", secondError);
          // Third attempt - player-teams endpoint
          response = await apiClient.post(`/api/user/v1/player-teams`, {
            team_id: teamId,
            player_id: playerId
          });
        }
      }
      
      // Extract data from axios response
      const responseData = response.data;
      
      if (responseData && (responseData.success || responseData.status === 'success' || responseData.message)) {
        const successMessage = responseData.message || 'Player invited successfully';
        toast.success(successMessage);
        setInviteSuccess(successMessage);
        
        // Reset form data
        setInvitePlayerData({ player_id: '' });
        
        // Close the form after delay
        setTimeout(() => {
          setShowInviteForm(false);
          setInviteSuccess(null);
        }, 1500);
        
        // Refresh team data
        await fetchTeamInfo();
      } else {
        setInviteError(responseData?.message || 'Failed to invite player');
      }
    } catch (inviteError) {
      console.error('Error inviting player:', inviteError);
      const errorMessage = inviteError.response?.data?.message || inviteError.message || 'Failed to invite player'; 
      setInviteError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setInvitationsLoading(false);
    }
  };

  // Add function to handle changes in the invite form
  const handleInviteInputChange = (e) => {
    const { name, value } = e.target;
    setInvitePlayerData({ ...invitePlayerData, [name]: value });
  };

  // Add function to handle changes in request form
  const handleRequestInputChange = (e) => {
    const { name, value } = e.target;
    
    // For time input, make sure we format correctly
    if (name === 'starting_time' && value) {
      // Ensure it has seconds if not provided
      const formattedTime = value.includes(':') && value.split(':').length === 2
        ? `${value}:00`
        : value;
      
      setNewRequestData({ ...newRequestData, [name]: formattedTime });
    } else {
      setNewRequestData({ ...newRequestData, [name]: value });
    }
  };

  // Add function to handle submitting a new request
  const handleSubmitNewRequest = async (e) => {
    e.preventDefault();
    
    try {
      setRequestsLoading(true);
      setRequestFormError(null);
      
      // Validate form
      if (!newRequestData.receiver_id) {
        setRequestFormError("Please select a player");
        setRequestsLoading(false);
        return;
      }
      
      if (!newRequestData.match_date) {
        setRequestFormError("Please select a match date");
        setRequestsLoading(false);
        return;
      }
      
      if (!newRequestData.starting_time) {
        setRequestFormError("Please set a starting time");
        setRequestsLoading(false);
        return;
      }
      
      // Format the data for the API
      const formattedData = {
        receiver_id: newRequestData.receiver_id,
        match_date: newRequestData.match_date,
        starting_time: newRequestData.starting_time,
        message: newRequestData.message || "Would you like to play a match?"
      };
      
      console.log("Sending request data:", formattedData);
      
      // Use createPlayerRequest if createRequest is not available
      const createFunc = playerRequestsService.createRequest || playerRequestsService.createPlayerRequest;
      
      if (!createFunc) {
        throw new Error("Request creation function not available");
      }
      
      const response = await createFunc(formattedData);
      
      if (response && (response.success || response.status === 'success' || response.message)) {
        // Success! Show message with green toast
        const successMessage = response.message || 'Request sent successfully';
        toast.success(successMessage);
        setRequestFormSuccess(successMessage);
        
        // Reset form
        setNewRequestData({
          receiver_id: '',
          match_date: '',
          starting_time: '',
          message: ''
        });
        
        // Close form automatically after a delay
        setTimeout(() => {
          setShowNewRequestForm(false);
          setRequestFormSuccess(null);
        }, 1500);
        
        // Refresh requests data
        await refreshPlayerRequests();
      } else {
        // Handle non-error but unsuccessful response
        setRequestFormError(response?.message || 'Failed to send request');
      }
    } catch (error) {
      console.error('Error sending request:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to send request';
      setRequestFormError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setRequestsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    // Show the delete account confirmation modal instead of using window.confirm
    setDeleteAccountPassword(''); // Reset password field
    setDeleteAccountError(null); // Reset any previous errors
    setShowDeleteAccountModal(true);
  };
  
  const confirmDeleteAccount = async () => {
    // Validate that password is provided
    if (!deleteAccountPassword.trim()) {
      setDeleteAccountError('Password is required to delete your account');
      return;
    }
    
    try {
      setDeleteAccountLoading(true);
      
      // Get user ID from session storage
      const userId = userData?.userId || sessionStorage.getItem('userId');
      
      if (!userId) {
        toast.error('User ID not found. Please log in again.');
        setDeleteAccountLoading(false);
        setShowDeleteAccountModal(false);
        return;
      }
      
      // Call API to delete account with password
      const response = await profileService.deleteAccount(userId, {
        password: deleteAccountPassword
      });
      
      if (response && (response.success || response.status === 'success')) {
        // Clear ALL session storage items
        const keysToRemove = [
          'token', 'userId', 'email', 'type', 'name', 'userdetails', 'pfp',
          'has_academie_membership', 'academie_memberships', 'academy_member_id',
          'has_teams', 'id_teams', 'teams', 'is_captain',
          'has_player', 'isPlayer', 'player_id', 'player_position', 'player_rating'
        ];
        
        keysToRemove.forEach(key => sessionStorage.removeItem(key));
        
        // Also try sessionStorage.clear() to be thorough
        try {
          sessionStorage.clear();
        } catch (e) {
          console.error('Error clearing session storage:', e);
        }
        
        // Show success message before redirect
        toast.success('Account deleted successfully');
        
        // Close modal
        setShowDeleteAccountModal(false);
        
        // Redirect to login page after a short delay
        setTimeout(() => {
          window.location.href = '/sign-in';
        }, 1500);
      } else {
        // If the response isn't successful, make sure to reset loading state
        toast.error(response?.message || 'Failed to delete account: Unexpected response from server');
        setDeleteAccountLoading(false);
        setDeleteAccountError(response?.message || 'Failed to delete account');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      setDeleteAccountError(error.response?.data?.message || error.response?.data?.error?.password?.[0] || 'Failed to delete account');
      setDeleteAccountLoading(false);
    }
  };
  
  const cancelDeleteAccount = () => {
    setShowDeleteAccountModal(false);
    setDeleteAccountPassword('');
    setDeleteAccountError(null);
  };

  // Add function to refresh player requests data
  const refreshPlayerRequests = async () => {
    if (!playerInfo) return;
    
    try {
      setRequestsLoading(true);
      setRequestsError(null);
      
      // Prepare request parameters with pagination and filtering
      const params = {
        paginationSize: requestsPerPage,
        page: requestsPage
      };
      
      // Add status filter if not 'all'
      if (requestsFilter !== 'all') {
        params.status = requestsFilter;
      }
      
      // Add search query if present
      if (requestsSearchQuery.trim()) {
        params.search = requestsSearchQuery.trim();
      }
      
      console.log("Fetching player requests with params:", params);
      
      // Use the getPlayerRequests method with parameters
      const response = await playerRequestsService.getPlayerRequests(params);
      
      if (response && response.data) {
        // Parse IDs to ensure correct type comparison
        const playerId = playerInfo.id_player?.toString() || playerInfo.id?.toString();
        
        // Handle different response formats
        let requestsData = Array.isArray(response.data) ? response.data : [];
        
        // If we have pagination data nested within data
        if (!Array.isArray(response.data) && response.data.data && Array.isArray(response.data.data)) {
          requestsData = response.data.data;
        }
        
        // Split into sent and received
        const sent = requestsData.filter(req => 
          req.sender?.toString() === playerId || req.id_sender?.toString() === playerId
        );
        
        const received = requestsData.filter(req => 
          req.receiver?.toString() === playerId || req.id_receiver?.toString() === playerId
        );
        
        setPlayerRequests({
          sent,
          received
        });
        
        // Set pagination info from various response formats
        if (response.meta) {
          setRequestsTotalPages(response.meta.last_page || 1);
        } else if (response.data && response.data.last_page) {
          setRequestsTotalPages(response.data.last_page);
        } else {
          setRequestsTotalPages(1);
        }
      } else {
        // Reset player requests if no valid response
        setPlayerRequests({
          sent: [],
          received: []
        });
        setRequestsTotalPages(1);
      }
    } catch (error) {
      console.error('Error refreshing player requests:', error);
      setRequestsError('Failed to refresh player requests: ' + (error.response?.data?.message || error.message));
    } finally {
      setRequestsLoading(false);
    }
  };

  // Add functions for handling player requests
  const handleAcceptRequest = async (requestId) => {
    try {
      const response = await playerRequestsService.acceptRequest(requestId);
      
      if (response && response.success) {
        toast.success('Request accepted successfully');
        refreshPlayerRequests();
      }
    } catch (error) {
      toast.error('Error accepting request: ' + error.message);
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      const response = await playerRequestsService.rejectRequest(requestId);
      
      if (response && response.success) {
        toast.success('Request rejected successfully');
        refreshPlayerRequests();
      }
    } catch (error) {
      toast.error('Error rejecting request: ' + error.message);
    }
  };

  const handleCancelRequest = async (requestId) => {
    try {
      setRequestsLoading(true);
      
      console.log(`Cancelling request ${requestId}`);
      const response = await playerRequestsService.cancelRequest(requestId);
      
      if (response && (response.success || response.status === 'success' || response.message)) {
        // Show success message
        toast.success(response.message || 'Request cancelled successfully');
        
        // Update player requests state immediately to provide feedback
        setPlayerRequests(prev => ({
          sent: prev.sent.map(req => 
            req.id === requestId || req.id_request === requestId
              ? { ...req, status: 'cancelled' }
              : req
          ),
          received: prev.received.map(req => 
            req.id === requestId || req.id_request === requestId
              ? { ...req, status: 'cancelled' }
              : req
          )
        }));
        
        // Then refresh all requests data
        setTimeout(() => {
          refreshPlayerRequests();
        }, 500);
      } else {
        toast.error(response?.message || 'Failed to cancel request');
      }
    } catch (error) {
      console.error('Error cancelling request:', error);
      toast.error('Error cancelling request: ' + (error.response?.data?.message || error.message));
    } finally {
      setRequestsLoading(false);
    }
  };

  // Update the team form data when editing
  const handleEditTeam = () => {
    if (!teamInfo || !teamInfo.is_captain) return;
    
    // Set form data from team info
    setTeamFormData({
      selected_member: teamInfo.capitain?.toString() || '', // capitain is already id_compte
      starting_time: extractTimeFromDateTime(teamInfo.starting_time),
      finishing_time: extractTimeFromDateTime(teamInfo.finishing_time)
    });
    
    setShowTeamForm(true);
  };

  // Add helper function to extract time from datetime string
  const extractTimeFromDateTime = (dateTimeString) => {
    if (!dateTimeString) return '';
    // Handle both "HH:mm:ss" and full datetime formats
    const timeMatch = dateTimeString.match(/\d{2}:\d{2}(:\d{2})?$/);
    if (timeMatch) {
      return timeMatch[0].substring(0, 5); // Return just HH:mm
    }
    return '';
  };

  // Add helper function to format member name
  const formatMemberName = (member) => {
    return `${member.prenom} ${member.nom} - ${member.position}`;
  };

  // Add fetchAvailablePlayers function inside the component
  const fetchAvailablePlayers = async () => {
    if (!playerInfo) return;
    
    try {
      setPlayersLoading(true);
      
      // Call API to get all players except the current user
      const response = await playersService.getAllPlayers();
      
      if (response && response.data) {
        // Filter out the current player
        const currentPlayerId = playerInfo.id_player || playerInfo.id;
        const filteredPlayers = response.data.filter(player => 
          player.id_player !== currentPlayerId && player.id !== currentPlayerId
        );
        
        setAvailablePlayers(filteredPlayers);
      }
    } catch (error) {
      console.error('Error fetching available players:', error);
    } finally {
      setPlayersLoading(false);
    }
  };

  // Add request pagination functions
  const handleRequestsPageChange = (page) => {
    if (page < 1 || page > requestsTotalPages) return;
    setRequestsPage(page);
  };

  const handleRequestsFilterChange = (status) => {
    setRequestsFilter(status);
    setRequestsPage(1); // Reset to first page when changing filter
  };

  const handleRequestsSearch = (query) => {
    setRequestsSearchQuery(query);
    setRequestsPage(1); // Reset to first page when searching
  };

  const RequestsTab = ({ playerInfo }) => {
    const [sentRequests, setSentRequests] = useState([]);
    const [receivedRequests, setReceivedRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
      if (playerInfo) {
        // Get requests from player info
        setSentRequests(playerInfo.sent_requests || []);
        setReceivedRequests(playerInfo.received_requests || []);
      }
    }, [playerInfo]);

    const handleDeleteRequest = async (requestId) => {
      try {
        setLoading(true);
        await playerRequestsService.deletePlayerRequest(requestId);
        // Remove the deleted request from the list
        setSentRequests(prev => prev.filter(req => req.id !== requestId));
        setReceivedRequests(prev => prev.filter(req => req.id !== requestId));
      } catch (error) {
        setError('Failed to delete request: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString();
    };

    const formatTime = (timeString) => {
      if (!timeString) return 'N/A';
      return new Date(timeString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getStatusColor = (status) => {
      switch (status?.toLowerCase()) {
        case 'accepted': return 'text-green-500';
        case 'rejected': return 'text-red-500';
        case 'pending': return 'text-yellow-500';
        case 'expired': return 'text-gray-500';
        default: return 'text-gray-700';
      }
    };

    return (
      <div className="space-y-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold mb-4">Sent Requests</h3>
          <div className="space-y-4">
            {sentRequests && sentRequests.length > 0 ? (
              sentRequests.map(request => (
                <div key={request.id_request} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium bg-gray-700/50 px-2 py-1 rounded">
                          {request.request_type === 'match' ? 'Match Request' : 'Team Request'}
                        </span>
                        <span className={`text-sm font-medium px-2 py-1 rounded ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300">Match Date: {formatDate(request.match_date)}</p>
                      <p className="text-sm text-gray-300">Starting Time: {formatTime(request.starting_time)}</p>
                      <p className="text-sm text-gray-300 mt-2">{request.message}</p>
                      <p className="text-xs text-gray-500 mt-2">Expires: {formatDate(request.expires_at)}</p>
                    </div>
                    {request.status === 'pending' && (
                      <button
                        onClick={() => handleDeleteRequest(request.id)}
                        disabled={loading}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 text-center border border-gray-700/50">
                <p className="text-gray-400">No sent requests</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Received Requests</h3>
          <div className="space-y-4">
            {receivedRequests && receivedRequests.length > 0 ? (
              receivedRequests.map(request => (
                <div key={request.id_request} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium bg-gray-700/50 px-2 py-1 rounded">
                          {request.request_type === 'match' ? 'Match Request' : 'Team Request'}
                        </span>
                        <span className={`text-sm font-medium px-2 py-1 rounded ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300">Match Date: {formatDate(request.match_date)}</p>
                      <p className="text-sm text-gray-300">Starting Time: {formatTime(request.starting_time)}</p>
                      <p className="text-sm text-gray-300 mt-2">{request.message}</p>
                      <p className="text-xs text-gray-500 mt-2">Expires: {formatDate(request.expires_at)}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 text-center border border-gray-700/50">
                <p className="text-gray-400">No received requests</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121212] to-[#1e1e1e] text-white font-sans pb-12">
      {/* Hero section with user profile banner */}
      <div className="h-64 sm:h-80 bg-gradient-to-r from-[#1a1a1a] to-[#252525] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://wallpapercave.com/wp/wp3046717.jpg')] bg-center bg-cover opacity-50"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent"></div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteAccountModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] rounded-xl border border-red-500/20 shadow-xl max-w-md w-full p-6 text-white animate-fade-in">
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-red-500/20 mb-4">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Delete Account</h3>
              <p className="text-gray-300">
                Are you sure you want to permanently delete your account? This action cannot be undone and all your data will be lost.
              </p>
            </div>
            
            {deleteAccountError && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4 text-red-400 text-sm">
                {deleteAccountError}
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-2">Enter your password to confirm</label>
              <input
                type="password"
                value={deleteAccountPassword}
                onChange={(e) => setDeleteAccountPassword(e.target.value)}
                className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 border border-gray-700"
                placeholder="Your current password"
                required
              />
            </div>
            
            <div className="border-t border-gray-700 pt-4 mt-2">
              <div className="flex flex-col sm:flex-row-reverse gap-3">
                <button
                  onClick={confirmDeleteAccount}
                  disabled={deleteAccountLoading}
                  className="px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors flex items-center justify-center"
                >
                  {deleteAccountLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    <>Delete Account</>
                  )}
                </button>
                <button
                  onClick={cancelDeleteAccount}
                  disabled={deleteAccountLoading}
                  className="px-4 py-2.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && deleteTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1E1E1E] rounded-xl border border-white/10 p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Confirm Deletion</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete {deleteTarget.name}? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteConfirmation(false);
                  setDeleteTarget(null);
                }}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#07F468]"></div>
        </div>
      ) : error ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
          <div className="bg-red-500/20 border border-red-500/40 text-white p-6 rounded-xl mb-8 text-center shadow-lg">
            <AlertCircle className="w-12 h-12 mx-auto mb-2 text-red-400" />
            <p className="text-xl font-medium">{error}</p>
            <p className="text-base mt-2">We've loaded some basic information from your session.</p>
          </div>
        </div>
      ) : userData ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
          {/* Fixed background for profile section */}
          <div className="fixed inset-0 bg-gradient-to-b from-black to-transparent opacity-50 pointer-events-none z-0"></div>
          
          <div className="bg-gradient-to-br from-[#1a1a1a]/95 to-[#141414]/95 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden border border-white/5 relative z-10">
            {/* User info with avatar, name, etc. */}
            <div className="p-5 sm:p-7 md:p-10 relative">
              {/* Background subtle gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-30"></div>
              
              <div className="flex flex-col items-center md:flex-row md:items-center gap-6 md:gap-8 relative z-10">
                {/* Profile picture */}
                <div className="flex-shrink-0">
                  <div className="rounded-full overflow-hidden border-4 border-[#141414] shadow-lg w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40">
                    <img
                      src={userData.pfp || `https://ui-avatars.com/api/?name=${encodeURIComponent((userData.nom || '') + "+" + (userData.prenom || ''))}&background=1a1a1a&color=ffffff&size=256`}
                      alt={userData.nom ? `${userData.prenom} ${userData.nom}` : 'Profile Avatar'}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  
                  {/* Hidden file input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleProfilePictureChange}
                    className="hidden"
                    accept="image/*"
                  />
                </div>
                
                {/* User info */}
                <div className="flex-grow text-center md:text-left">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold animate-fadeIn text-white">
                    {userData.nom} {userData.prenom}
                  </h1>
                  <p className="text-gray-400 mt-2 md:mt-3">
                    Member since {new Date(userData.created_at || userData.dateInscription || Date.now()).toLocaleDateString()}
                  </p>
                  
                  {/* Role badges */}
                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                    <span className="bg-gray-800 text-gray-300 text-xs font-medium px-3 py-1.5 rounded-full border border-gray-700">
                      {userData.role || 'Member'}
                    </span>
                    {userData.player && (
                      <span className="bg-gray-800 text-gray-300 text-xs font-medium px-3 py-1.5 rounded-full border border-gray-700 flex items-center">
                        <User className="w-3.5 h-3.5 mr-1.5" />
                        Player
                      </span>
                    )}
                    {sessionStorage.getItem('has_teams') === 'true' && (
                      <span className="bg-gray-800 text-gray-300 text-xs font-medium px-3 py-1.5 rounded-full border border-gray-700 flex items-center">
                        <Users className="w-3.5 h-3.5 mr-1.5" />
                        Team Captain
                      </span>
                    )}
                  </div>
                  
                  {/* Action button */}
                  <div className="mt-4 md:mt-6">
                    <Link 
                      to="/reservation" 
                      className="bg-gray-800 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-700 inline-flex items-center justify-center transition-all duration-300 w-full md:w-auto shadow-lg group border border-gray-700"
                    >
                      <Calendar className="w-5 h-5 mr-2 transform group-hover:scale-110 transition-transform" />
                      Book a Field
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Tab Navigation with improved styling */}
            <div className="border-t border-white/10 overflow-x-auto scrollbar-hide bg-black/20">
              <nav className="flex whitespace-nowrap min-w-full">
                <button
                  onClick={() => {
                    setActiveTab('info');
                    // Clear error states
                    setTeamError(null);
                    setPlayerError(null);
                    setReservationError(null);
                    setMembershipsError(null);
                    setRequestsError(null);
                  }}
                  className={`py-3 px-4 md:px-6 font-medium transition-all duration-300 relative ${
                    activeTab === 'info'
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    <span>Info</span>
                  </div>
                  {activeTab === 'info' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white animate-fadeIn"></div>
                  )}
                </button>
                <button
                  onClick={() => {
                    setActiveTab('reservations');
                    // Clear error states
                    setTeamError(null);
                    setPlayerError(null);
                    setReservationError(null);
                    setMembershipsError(null);
                    setRequestsError(null);
                  }}
                  className={`py-3 px-4 md:px-6 font-medium transition-all duration-300 relative ${
                    activeTab === 'reservations'
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Bookings</span>
                  </div>
                  {activeTab === 'reservations' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white animate-fadeIn"></div>
                  )}
                </button>
                <button
                  onClick={() => {
                    setActiveTab('academies');
                    // Clear error states
                    setTeamError(null);
                    setPlayerError(null);
                    setReservationError(null);
                    setMembershipsError(null);
                    setRequestsError(null);
                  }}
                  className={`py-3 px-4 md:px-6 font-medium transition-all duration-300 relative ${
                    activeTab === 'academies'
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center">
                    <Award className="w-4 h-4 mr-2" />
                    <span>Academies</span>
                  </div>
                  {activeTab === 'academies' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white animate-fadeIn"></div>
                  )}
                </button>
                <button
                  onClick={() => {
                    setActiveTab('player');
                    // Clear error states
                    setTeamError(null);
                    setPlayerError(null);
                    setReservationError(null);
                    setMembershipsError(null);
                    setRequestsError(null);
                  }}
                  className={`py-3 px-4 md:px-6 font-medium transition-all duration-300 relative ${
                    activeTab === 'player'
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center">
                    <UserPlus className="w-4 h-4 mr-2" />
                    <span>Player</span>
                  </div>
                  {activeTab === 'player' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white animate-fadeIn"></div>
                  )}
                </button>
                <button
                  onClick={() => {
                    setActiveTab('team');
                    // Clear error states
                    setTeamError(null);
                    setPlayerError(null);
                    setReservationError(null);
                    setMembershipsError(null);
                    setRequestsError(null);
                    // Refresh team data when switching to team tab
                    if (playerInfo?.id_player) {
                      fetchTeamInfo();
                    }
                  }}
                  className={`py-3 px-4 md:px-6 font-medium transition-all duration-300 relative ${
                    activeTab === 'team'
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    <span>Team</span>
                  </div>
                  {activeTab === 'team' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white animate-fadeIn"></div>
                  )}
                </button>
                <button
                  onClick={() => {
                    setActiveTab('requests');
                    // Clear error states
                    setTeamError(null);
                    setPlayerError(null);
                    setReservationError(null);
                    setMembershipsError(null);
                    setRequestsError(null);
                  }}
                  className={`py-3 px-4 md:px-6 font-medium transition-all duration-300 relative ${
                    activeTab === 'requests'
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    <span>Requests</span>
                  </div>
                  {activeTab === 'requests' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white animate-fadeIn"></div>
                  )}
                </button>
              </nav>
            </div>
            
            {/* Tab Content */}
            <div className="space-y-8 relative z-10">
              {/* Profile Information Tab */}
              {activeTab === 'info' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-lg relative z-10"
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">First Name</label>
                          <input
                            type="text"
                            name="prenom"
                            value={formData.prenom}
                            onChange={handleInputChange}
                            className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">Last Name</label>
                          <input
                            type="text"
                            name="nom"
                            value={formData.nom}
                            onChange={handleInputChange}
                            className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            readOnly
                            className="w-full bg-gray-700/50 text-gray-300 rounded-lg px-4 py-3 focus:outline-none cursor-not-allowed"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">Phone Number</label>
                          <input
                            type="tel"
                            name="telephone"
                            value={formData.telephone}
                            onChange={handleInputChange}
                            className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">Age</label>
                          <input
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleInputChange}
                            min="16"
                            max="70"
                            className={`w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 transition-all duration-300 ${
                              ageError ? 'border-red-500 focus:ring-red-500' : 'focus:ring-gray-400'
                            }`}
                            required
                          />
                          {ageError && (
                            <p className="mt-2 text-sm text-red-400 animate-fadeIn">
                              {ageError}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex justify-center md:justify-end mt-8 relative z-20">
                        <button
                          type="submit"
                          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(7,244,104,0.3)]"
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
                      
                      {/* Edit profile button */}
                      <div className="mt-6 md:mt-8 col-span-1 md:col-span-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => setEditMode(true)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit Profile
                        </button>
                      </div>
                      
                      {/* Password change section */}
                      <div className="mt-6 md:mt-8 col-span-1 md:col-span-2">
                        <div className="border-t border-gray-700 pt-5 md:pt-6">
                          <h3 className="text-lg font-medium text-white mb-3 md:mb-4">Security Settings</h3>
                          
                          {/* Google Auth Warning - Moved to top of security settings */}
                          
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-blue-400 text-sm mb-4">
                              <div className="flex items-start gap-3">
                                <Info className="w-5 h-5 mt-0.5 flex-shrink-0 animate-pulse" />
                                <p>
                                  If you created your account with Google authentication, please check your email inbox (including spam/junk folders) to find your current password. You'll need this to set up a new password.
                                </p>
                              </div>
                            </div>
                          
                          
                          {!showPasswordForm ? (
                            <div className="flex flex-wrap gap-3">
                              <button
                                type="button"
                                onClick={() => setShowPasswordForm(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                              >
                                <Lock className="w-4 h-4" />
                                Change Password
                              </button>
                              
                              <button
                                type="button"
                                onClick={handleDeleteAccount}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete Account
                              </button>
                            </div>
                          ) : (
                            <form onSubmit={handleSubmitPasswordChange} className="space-y-4 bg-gray-800/50 p-4 md:p-6 rounded-lg">
                              {passwordError && (
                                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
                                  {passwordError}
                                </div>
                              )}
                              
                              {passwordSuccess && (
                                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-green-400 text-sm">
                                  {passwordSuccess}
                                </div>
                              )}
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Current Password</label>
                                <div className="relative">
                                  <input
                                    type={passwordVisibility.current ? "text" : "password"}
                                    name="current_password"
                                    value={passwordFormData.current_password}
                                    onChange={handlePasswordChange}
                                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                    required
                                  />
                                  <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                                    onClick={() => togglePasswordVisibility('current')}
                                  >
                                    {passwordVisibility.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                  </button>
                                </div>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">New Password</label>
                                <div className="relative">
                                  <input
                                    type={passwordVisibility.new ? "text" : "password"}
                                    name="new_password"
                                    value={passwordFormData.new_password}
                                    onChange={handlePasswordChange}
                                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                    required
                                  />
                                  <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                                    onClick={() => togglePasswordVisibility('new')}
                                  >
                                    {passwordVisibility.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                  </button>
                                </div>
                                {/* Password requirements */}
                                <div className="mt-2 space-y-1">
                                  <p className={`text-sm flex items-center gap-1 ${passwordValidation.length ? 'text-green-400' : 'text-gray-400'}`}>
                                    {passwordValidation.length ? <Check className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                                    At least 8 characters
                                  </p>
                                  <p className={`text-sm flex items-center gap-1 ${passwordValidation.number ? 'text-green-400' : 'text-gray-400'}`}>
                                    {passwordValidation.number ? <Check className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                                    Contains a number
                                  </p>
                                  <p className={`text-sm flex items-center gap-1 ${passwordValidation.special ? 'text-green-400' : 'text-gray-400'}`}>
                                    {passwordValidation.special ? <Check className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                                    Contains a special character
                                  </p>
                                </div>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Confirm New Password</label>
                                <div className="relative">
                                  <input
                                    type={passwordVisibility.confirm ? "text" : "password"}
                                    name="confirm_password"
                                    value={passwordFormData.confirm_password}
                                    onChange={handlePasswordChange}
                                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                    required
                                  />
                                  <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                                    onClick={() => togglePasswordVisibility('confirm')}
                                  >
                                    {passwordVisibility.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                  </button>
                                </div>
                                {!passwordValidation.match && passwordFormData.confirm_password && (
                                  <p className="mt-2 text-sm text-red-400">
                                    Passwords do not match
                                  </p>
                                )}
                              </div>

                              <div className="flex justify-end gap-3 mt-6">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setShowPasswordForm(false);
                                    setPasswordError(null);
                                    setPasswordSuccess(null);
                                    setPasswordFormData({
                                      current_password: '',
                                      new_password: '',
                                      confirm_password: ''
                                    });
                                  }}
                                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
                                  disabled={!passwordValidation.length || !passwordValidation.number || !passwordValidation.special || !passwordValidation.match}
                                >
                                  <Save className="w-4 h-4" />
                                  Save Password
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
              
              {/* Academies Tab */}
              {activeTab === 'academies' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <h2 className="text-xl md:text-2xl font-semibold text-white">My Academies</h2>
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
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-white mb-4">My Academy Activities</h3>
                    <p className="text-gray-400 mb-4">Activities that you are currently enrolled in</p>
                    
                    {activitiesLoading ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
                      </div>
                    ) : activitiesError ? (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
                        <p className="text-red-400">{activitiesError}</p>
                      </div>
                    ) : academyActivities.length > 0 ? (
                      <div>
                        <div className="space-y-4">
                          {academyActivities.map((activity) => (
                            <ActivityCard key={activity.id} activity={activity} />
                          ))}
                        </div>
                        
                        {/* Pagination */}
                        {activitiesTotalPages > 1 && (
                          <div className="flex justify-center mt-6">
                            <div className="flex items-center space-x-1">
                              {/* Previous Page Button */}
                              <button
                                onClick={() => handleActivitiesPageChange(Math.max(1, activitiesPage - 1))}
                                disabled={activitiesPage === 1}
                                className={`px-3 py-1.5 rounded-md ${
                                  activitiesPage === 1
                                    ? 'bg-gray-700/30 text-gray-500 cursor-not-allowed'
                                    : 'bg-gray-700 text-white hover:bg-gray-600'
                                }`}
                              >
                                <ChevronLeft className="w-5 h-5" />
                              </button>
                              
                              {/* Page Numbers */}
                              {Array.from({ length: Math.min(5, activitiesTotalPages) }, (_, i) => {
                                // Handle cases with more than 5 pages
                                let pageNum;
                                if (activitiesTotalPages <= 5) {
                                  pageNum = i + 1;
                                } else if (activitiesPage <= 3) {
                                  pageNum = i + 1;
                                } else if (activitiesPage >= activitiesTotalPages - 2) {
                                  pageNum = activitiesTotalPages - 4 + i;
                                } else {
                                  pageNum = activitiesPage - 2 + i;
                                }
                                
                                return (
                                  <button
                                    key={pageNum}
                                    onClick={() => handleActivitiesPageChange(pageNum)}
                                    className={`px-3 py-1.5 rounded-md ${
                                      pageNum === activitiesPage
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-700 text-white hover:bg-gray-600'
                                    }`}
                                  >
                                    {pageNum}
                                  </button>
                                );
                              })}
                              
                              {/* Next Page Button */}
                              <button
                                onClick={() => handleActivitiesPageChange(Math.min(activitiesTotalPages, activitiesPage + 1))}
                                disabled={activitiesPage === activitiesTotalPages}
                                className={`px-3 py-1.5 rounded-md ${
                                  activitiesPage === activitiesTotalPages
                                    ? 'bg-gray-700/30 text-gray-500 cursor-not-allowed'
                                    : 'bg-gray-700 text-white hover:bg-gray-600'
                                }`}
                              >
                                <ChevronRight className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        )}
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
                  </div>
                </motion.div>
              )}
              
              {/* Player Tab */}
              {activeTab === 'player' && (
                <div className="p-6 sm:p-8">
                  <h2 className="text-2xl font-bold mb-6 flex items-center">
                    <UserPlus className="w-6 h-6 mr-2 text-[#07F468]" />
                    Player Profile
                  </h2>
                  
                  {playerFormSuccess && !showPlayerForm && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 md:p-4 mb-4 text-green-400 text-sm">
                      {playerFormSuccess}
                    </div>
                  )}
                  
                  {playerLoading ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#07F468]"></div>
                    </div>
                  ) : playerError ? (
                    <div className="bg-red-500/20 border border-red-500/40 text-white p-6 rounded-xl mb-8 text-center">
                      <AlertCircle className="w-12 h-12 mx-auto mb-2 text-red-400" />
                      <p className="text-xl font-medium">{playerError}</p>
                    </div>
                  ) : showPlayerForm ? (
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50">
                      <h3 className="text-lg font-medium text-white mb-4">
                        {playerInfo ? 'Edit Player Profile' : 'Create Player Profile'}
                      </h3>
                      
                      {playerFormError && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4 text-red-400 text-sm">
                          {playerFormError}
                        </div>
                      )}
                      
                      {playerFormSuccess && (
                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-4 text-green-400 text-sm">
                          {playerFormSuccess}
                        </div>
                      )}
                      
                      <form onSubmit={handleSubmitPlayerForm} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">Position</label>
                          <select
                            name="position"
                            value={playerFormData.position}
                            onChange={handlePlayerInputChange}
                            className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                          >
                            <option value="">Select a position</option>
                            <option value="Forward">Forward</option>
                            <option value="Midfielder">Midfielder</option>
                            <option value="Defender">Defender</option>
                            <option value="Goalkeeper">Goalkeeper</option>
                          </select>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Starting Time</label>
                            <input
                              type="time"
                              name="starting_time"
                              value={playerFormData.starting_time}
                              onChange={handlePlayerInputChange}
                              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Finishing Time</label>
                            <input
                              type="time"
                              name="finishing_time"
                              value={playerFormData.finishing_time}
                              onChange={handlePlayerInputChange}
                              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                        </div>
                        
                        {/* Hidden fields for statistics that are managed by the system */}
                        <input type="hidden" name="misses" value={playerFormData.misses} />
                        <input type="hidden" name="invites_accepted" value={playerFormData.invites_accepted} />
                        <input type="hidden" name="invites_refused" value={playerFormData.invites_refused} />
                        <input type="hidden" name="total_invites" value={playerFormData.total_invites} />
                        
                        <div className="flex justify-end space-x-3 pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setShowPlayerForm(false);
                              setPlayerFormError(null);
                              setPlayerFormSuccess(null);
                            }}
                            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center gap-2"
                            disabled={playerLoading}
                          >
                            {playerLoading ? (
                              <>
                                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save className="w-4 h-4" />
                                Save
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : playerInfo ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Player Info Card */}
                      <div className="bg-[#1E1E1E] rounded-xl border border-white/5 p-6 shadow-lg">
                        <div className="flex items-center mb-6">
                          <div className="relative mr-4">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#07F468] to-[#19be59] blur-sm opacity-70"></div>
                            <div className="w-20 h-20 rounded-full relative border-2 border-[#1a1a1a] flex items-center justify-center bg-gray-800">
                              <User className="w-10 h-10 text-[#07F468]" />
                            </div>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold">{playerInfo?.position || 'Unknown Position'}</h3>
                            <div className="flex items-center mt-1">
                              <span className="bg-yellow-500/10 text-yellow-400 text-xs font-medium px-2.5 py-1 rounded-full border border-yellow-500/30 flex items-center">
                                <Star className="w-3 h-3 mr-1" />
                                Rating: {playerInfo?.rating || '0'}/5
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div className="bg-gray-800/50 p-4 rounded-lg">
                            <p className="text-gray-400 text-sm">Total Matches</p>
                            <p className="text-xl font-semibold text-white">{playerInfo?.total_matches || '0'}</p>
                          </div>
                          <div className="bg-gray-800/50 p-4 rounded-lg">
                            <p className="text-gray-400 text-sm">Player ID</p>
                            <p className="text-xl font-semibold text-white">{playerInfo?.id_player || 'N/A'}</p>
                          </div>
                        </div>
                        
                        <div className="bg-gray-800/50 p-4 rounded-lg mt-4">
                          <p className="text-gray-400 text-sm">Available Time</p>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1">
                            <div className="flex items-center text-white">
                              <Clock className="w-4 h-4 text-[#07F468] mr-1" />
                              <span>From: {extractTimeFromDateTime(playerInfo?.starting_time) || 'Not Set'}</span>
                            </div>
                            <div className="flex items-center text-white">
                              <Clock className="w-4 h-4 text-[#07F468] mr-1" />
                              <span>To: {extractTimeFromDateTime(playerInfo?.finishing_time) || 'Not Set'}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between mt-6">
                          <button
                            onClick={() => {
                              setPlayerFormData({
                                position: playerInfo.position || '',
                                starting_time: playerInfo.starting_time?.substring(0, 5) || '',
                                finishing_time: playerInfo.finishing_time?.substring(0, 5) || '',
                                misses: playerInfo.misses || 0,
                                invites_accepted: playerInfo.invites_accepted || 0,
                                invites_refused: playerInfo.invites_refused || 0,
                                total_invites: playerInfo.total_invites || 0
                              });
                              setShowPlayerForm(true);
                            }}
                            className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            Edit
                          </button>
                          
                          <button
                            onClick={handleDeletePlayer}
                            className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </button>
                        </div>
                      </div>
                      
                      {/* Stats Card */}
                      <div className="bg-[#1E1E1E] rounded-xl border border-white/5 p-6 shadow-lg">
                        <h3 className="text-lg font-bold mb-4">Player Statistics</h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Total Matches</span>
                            <span className="text-white font-medium">{playerInfo?.total_matches || '0'}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Misses</span>
                            <span className="text-white font-medium">{playerInfo?.misses || '0'}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Total Invites</span>
                            <span className="text-white font-medium">{playerInfo?.total_invites || '0'}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Invites Accepted</span>
                            <span className="text-white font-medium">{playerInfo?.invites_accepted || '0'}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Invites Refused</span>
                            <span className="text-white font-medium">{playerInfo?.invites_refused || '0'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 text-center">
                      <UserPlus className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                      <h3 className="text-xl font-medium text-white mb-2">No Player Profile</h3>
                      <p className="text-gray-400 mb-6">You haven't created a player profile yet.</p>
                      <button
                        onClick={() => setShowPlayerForm(true)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                      >
                        <UserPlus className="w-4 h-4" />
                        Create Player Profile
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              {/* Team Management Tab */}
              {activeTab === 'team' && (
                <div className="p-6 sm:p-8">
                  <h2 className="text-2xl font-bold mb-6 flex items-center">
                    <Shield className="w-6 h-6 mr-2 text-[#07F468]" />
                    Team Management
                  </h2>
                  
                  {teamFormSuccess && !showTeamForm && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 md:p-4 mb-4 text-green-400 text-sm">
                      {teamFormSuccess}
                    </div>
                  )}
                  
                  {teamLoading ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#07F468]"></div>
                    </div>
                  ) : teamError ? (
                    <div className="bg-red-500/20 border border-red-500/40 text-white p-6 rounded-xl mb-8 text-center">
                      <AlertCircle className="w-12 h-12 mx-auto mb-2 text-red-400" />
                      <p className="text-xl font-medium">{teamError}</p>
                    </div>
                  ) : showTeamForm ? (
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50">
                      <h3 className="text-lg font-medium text-white mb-4">
                        Edit Team
                      </h3>
                      
                      {teamFormError && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4 text-red-400 text-sm">
                          {teamFormError}
                        </div>
                      )}
                      
                      {teamFormSuccess && (
                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-4 text-green-400 text-sm">
                          {teamFormSuccess}
                        </div>
                      )}
                      
                      {/* Display Team Info */}
                      <div className="bg-gray-900/50 rounded-lg p-4 mb-6">
                        <h4 className="text-sm font-medium text-gray-400 mb-3">Team Information</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Team Name:</span>
                            <span className="text-white">{teamInfo.team_name || 'Not Set'}</span>
                        </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Total Matches:</span>
                            <span className="text-white">{teamInfo.total_matches || 0}</span>
                        </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Rating:</span>
                            <span className="text-white">{teamInfo.rating || 0}/5</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Members:</span>
                            <span className="text-white">{teamInfo.members_count || 0}</span>
                          </div>
                          </div>
                        </div>
                        
                      <form onSubmit={handleSubmitTeamForm} className="space-y-4">
                        {/* Member selection dropdown */}
                          <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">Select Team Captain</label>
                            <select
                            name="selected_member"
                            value={teamFormData.selected_member}
                              onChange={handleTeamInputChange}
                              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                              <option value="">Select a new captain</option>
                            {teamInfo.members?.map((member) => (
                                <option 
                                key={member.id_compte} 
                                value={member.id_compte}
                                disabled={member.id_compte === parseInt(teamInfo.capitain, 10)}
                                >
                                {formatMemberName(member)}
                                {member.id_compte === parseInt(teamInfo.capitain, 10) ? ' (Current Captain)' : ''}
                                </option>
                              ))}
                            </select>
                            <p className="text-xs text-gray-500 mt-1">Select a team member to transfer captaincy</p>
                          </div>
                        
                        {/* Time availability fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Starting Time</label>
                                <input
                              type="time"
                              name="starting_time"
                              value={teamFormData.starting_time}
                                  onChange={handleTeamInputChange}
                                  className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                              </div>
                          
                              <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Finishing Time</label>
                                <input
                              type="time"
                              name="finishing_time"
                              value={teamFormData.finishing_time}
                                  onChange={handleTeamInputChange}
                                  className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                              </div>
                              </div>
                        
                        <div className="flex justify-end mt-6">
                          <button
                            type="button"
                            onClick={() => setShowTeamForm(false)}
                            className="px-4 py-2 text-gray-400 hover:text-white transition-colors mr-3"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                            disabled={teamLoading}
                          >
                            {teamLoading ? (
                              <>
                                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                                Saving...
                              </>
                            ) : (
                              <>Save Changes</>
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : teamInfo ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Team Info Card */}
                      <div className="bg-[#1E1E1E] rounded-xl border border-white/5 p-6 shadow-lg">
                        <div className="flex items-center mb-6">
                          <div className="relative mr-4">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#07F468] to-[#19be59] blur-sm opacity-70"></div>
                            <img 
                              src={teamInfo.logo || "https://ui-avatars.com/api/?name=Team&background=07F468&color=121212&size=128"}
                              alt="Team" 
                              className="w-20 h-20 rounded-full relative border-2 border-[#1a1a1a] object-cover" 
                            />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold">{teamInfo.team_name || `Team #${teamInfo.id_teams}`}</h3>
                            <div className="flex items-center mt-1">
                              {teamInfo.captain && (
                                <span className="bg-purple-500/10 text-purple-400 text-xs font-medium px-2.5 py-1 rounded-full border border-purple-500/30 flex items-center">
                                  <Users className="w-3 h-3 mr-1" />
                                  Captain: {teamInfo.captain.prenom} {teamInfo.captain.nom}
                                </span>
                              )}
                              {teamInfo.rating > 0 && (
                                <div className="flex items-center ml-2 bg-yellow-500/10 px-2 py-1 rounded-full text-yellow-400 text-xs">
                                  <Star className="w-3 h-3 mr-1" />
                                  <span>{teamInfo.rating}/5</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {teamInfo.description && (
                          <div className="bg-gray-800/50 p-4 rounded-lg mt-4">
                            <p className="text-gray-400 text-sm">Description</p>
                            <p className="text-white mt-1">{teamInfo.description}</p>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div className="bg-gray-800/50 p-4 rounded-lg">
                            <p className="text-gray-400 text-sm">Members</p>
                            <p className="text-xl font-semibold text-white">{teamInfo.members_count || teamInfo.members?.length || 0}</p>
                          </div>
                          <div className="bg-gray-800/50 p-4 rounded-lg">
                            <p className="text-gray-400 text-sm">Matches</p>
                            <p className="text-xl font-semibold text-white">{teamInfo.total_matches || 0}</p>
                          </div>
                        </div>
                        
                        {/* Time availability */}
                        <div className="bg-gray-800/50 p-4 rounded-lg mt-4">
                          <p className="text-gray-400 text-sm">Team Availability</p>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1">
                            <div className="flex items-center text-white">
                              <Clock className="w-4 h-4 text-[#07F468] mr-1" />
                              <span>From: {extractTimeFromDateTime(teamInfo.starting_time) || 'Not Set'}</span>
                            </div>
                            <div className="flex items-center text-white">
                              <Clock className="w-4 h-4 text-[#07F468] mr-1" />
                              <span>To: {extractTimeFromDateTime(teamInfo.finishing_time) || 'Not Set'}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between mt-6">
                          {teamInfo.is_captain && (
                            <>
                          <button
                            onClick={handleEditTeam}
                            className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            Edit
                          </button>
                          
                          <button
                            onClick={handleDeleteTeam}
                            className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </button>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {/* Team Stats/Members Card */}
                      <div className="bg-[#1E1E1E] rounded-xl border border-white/5 p-6 shadow-lg">
                        <h3 className="text-lg font-bold mb-4">Team Members</h3>
                        
                        {teamInfo.members && teamInfo.members.length > 0 ? (
                          <div className="space-y-3">
                            {teamInfo.members.map((member) => (
                              <div key={member.id_compte} className="flex items-center p-2 rounded-lg bg-gray-800/50">
                                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                                  <User className="w-4 h-4 text-gray-400" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-white">
                                    {formatMemberName(member)}
                                  </p>
                                  <div className="flex items-center">
                                    <p className="text-xs text-gray-400">
                                      Matches: {member.total_matches || 0} • Rating: {member.rating || 0}/5
                                    </p>
                                    {member.id_compte === parseInt(teamInfo.capitain, 10) && (
                                      <span className="ml-2 bg-yellow-500/10 text-yellow-400 text-xs px-2 py-0.5 rounded-full">
                                        Captain
                                      </span>
                                    )}
                                  </div>
                                </div>
                                {/* Only show remove button if current user is captain and the member is not the captain */}
                                {teamInfo.is_captain && member.id_compte !== parseInt(teamInfo.capitain, 10) && (
                                  <button 
                                    className="text-red-400 hover:text-red-500"
                                    onClick={() => handleRemoveMember(member.id_player)}
                                    disabled={teamLoading}
                                  >
                                    <UserX className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                            <p className="text-gray-400">No team members yet</p>
                          </div>
                        )}
                        
                        {/* Team stats */}
                        <h3 className="text-lg font-bold mt-6 mb-4">Team Statistics</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-800/50 p-3 rounded-lg">
                            <p className="text-gray-400 text-sm">Total Matches</p>
                            <p className="text-lg font-semibold text-white">{teamInfo.total_matches || 0}</p>
                          </div>
                          <div className="bg-gray-800/50 p-3 rounded-lg">
                            <p className="text-gray-400 text-sm">Rating</p>
                            <p className="text-lg font-semibold text-white">{teamInfo.rating || 0}/5</p>
                          </div>
                          <div className="bg-gray-800/50 p-3 rounded-lg">
                            <p className="text-gray-400 text-sm">Invites Accepted</p>
                            <p className="text-lg font-semibold text-white">{teamInfo.invites_accepted || 0}</p>
                          </div>
                          <div className="bg-gray-800/50 p-3 rounded-lg">
                            <p className="text-gray-400 text-sm">Invites Refused</p>
                            <p className="text-lg font-semibold text-white">{teamInfo.invites_refused || 0}</p>
                          </div>
                        </div>
                        
                        {/* Only show invite button if user is captain */}
                        {teamInfo.is_captain && (
                        <div className="mt-6">
                          <button 
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                            onClick={() => setShowInviteForm(!showInviteForm)}
                          >
                            <UserPlus className="w-4 h-4" />
                            {showInviteForm ? 'Cancel' : 'Invite Player'}
                          </button>
                          
                          {showInviteForm && (
                            <div className="mt-4 bg-gray-800/50 rounded-lg p-4">
                              {inviteError && (
                                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4 text-red-400 text-sm">
                                  {inviteError}
                                </div>
                              )}
                              
                              {inviteSuccess && (
                                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-4 text-green-400 text-sm">
                                  {inviteSuccess}
                                </div>
                              )}
                              
                              {searchError && (
                                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4 text-red-400 text-sm">
                                  {searchError}
                                </div>
                              )}
                              
                              <form onSubmit={handleInviteMember} className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-400 mb-2">Search Players</label>
                                  <input
                                    type="text"
                                    value={playerSearchQuery}
                                    onChange={handlePlayerSearchChange}
                                    className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Search by name or position"
                                  />
                                </div>
                                
                                {/* Search results */}
                                {isSearching ? (
                                  <div className="flex justify-center py-4">
                                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-green-500"></div>
                                  </div>
                                ) : searchResults.length > 0 ? (
                                  <div className="bg-gray-800/30 rounded-lg max-h-60 overflow-y-auto">
                                    <div className="p-2 space-y-2">
                                      {searchResults.map((player) => (
                                        <div 
                                          key={player.id}
                                          className="flex items-center justify-between p-2 rounded-lg bg-gray-700/50 hover:bg-gray-700 cursor-pointer transition-colors"
                                          onClick={() => setInvitePlayerData({ player_id: player.id })}
                                        >
                                          <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center mr-3">
                                              <User className="w-4 h-4 text-gray-400" />
                                            </div>
                                            <div>
                                              <p className="text-white text-sm">{player.compte?.full_name || `Player #${player.id}`}</p>
                                              <p className="text-xs text-gray-400">{player.position || 'Unknown'} • Rating: {player.rating || '0'}/5</p>
                                            </div>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                                              Select
                                            </span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ) : playerSearchQuery.trim() !== '' && (
                                  <div className="text-center py-4 text-gray-400">
                                    No players found matching "{playerSearchQuery}"
                                  </div>
                                )}
                                
                                {invitePlayerData.player_id && (
                                  <div className="mt-4 p-3 rounded-lg bg-gray-800/50 border border-green-500/20">
                                    <p className="text-sm text-green-400">
                                      <Check className="w-4 h-4 inline-block mr-2" />
                                      Player selected. Ready to send invitation.
                                    </p>
                                  </div>
                                )}
                                
                                <div className="flex justify-end mt-4">
                                  <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center gap-2"
                                    disabled={teamLoading || !invitePlayerData.player_id}
                                  >
                                    {teamLoading ? (
                                      <>
                                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                                        Sending...
                                      </>
                                    ) : (
                                      <>
                                        <UserPlus className="w-4 h-4" />
                                        Send Invite
                                      </>
                                    )}
                                  </button>
                                </div>
                              </form>
                            </div>
                          )}
                        </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 text-center">
                      <Shield className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                      <h3 className="text-xl font-medium text-white mb-2">No Team</h3>
                      <p className="text-gray-400 mb-6">You are not a member of any team yet.</p>
                      
                      <Link
                        to="/players"
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                      >
                        <Users className="w-4 h-4" />
                        Find Teams & Players
                      </Link>
                    </div>
                  )}
                  
                  {/* Team Invitations Section */}
                  {pendingInvitations.length > 0 && (
                    <div className="mt-6 bg-[#1E1E1E] rounded-xl border border-white/5 p-6 shadow-lg">
                      <h3 className="text-lg font-bold mb-4">Pending Team Invitations</h3>
                      
                      {invitationsLoading ? (
                        <div className="flex justify-center items-center py-6">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {pendingInvitations.length > 0 ? (
                            pendingInvitations.map((invitation) => (
                              <div key={invitation.id} className="p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="text-white">
                                      <span className="font-medium">{invitation.team?.name || `Team #${invitation.team_id}`}</span>
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                      Invited you to join their team
                                    </p>
                                    {invitation.team?.captain && (
                                      <p className="text-xs text-gray-400 mt-1">
                                        Captain: {invitation.team.captain.nom} {invitation.team.captain.prenom}
                                      </p>
                                    )}
                                    <p className="text-xs text-gray-400 mt-1">
                                      Sent: {new Date(invitation.created_at).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleAcceptInvitation(invitation.id)}
                                      className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm flex items-center gap-1.5 hover:bg-green-600 transition-colors"
                                    >
                                      <UserCheck className="w-3.5 h-3.5" />
                                      Accept
                                    </button>
                                    <button
                                      onClick={() => handleRefuseInvitation(invitation.id)}
                                      className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm flex items-center gap-1.5 hover:bg-red-600 transition-colors"
                                    >
                                      <UserX className="w-3.5 h-3.5" />
                                      Refuse
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-400 text-center py-2">No pending invitations</p>
                          )}
                        </div>
                      )}
                      
                      {/* Pagination controls for invitations */}
                      {invitationsTotalPages > 1 && (
                        <div className="flex justify-center mt-4">
                          <div className="flex space-x-1">
                            {Array.from({ length: invitationsTotalPages }, (_, i) => i + 1).map((page) => (
                              <button
                                key={page}
                                onClick={() => handleInvitationsPageChange(page)}
                                className={`px-3 py-1 rounded ${
                                  invitationsPage === page
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                              >
                                {page}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Team Join Requests Section - Only shown if user is captain */}
                  {teamInfo && teamInfo.is_captain && pendingJoinRequests.length > 0 && (
                    <div className="mt-6 bg-[#1E1E1E] rounded-xl border border-white/5 p-6 shadow-lg">
                      <h3 className="text-lg font-bold mb-4">Pending Join Requests</h3>
                      
                      {invitationsLoading ? (
                        <div className="flex justify-center items-center py-6">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {pendingJoinRequests.map((request) => (
                            <div key={request.id} className="p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="text-white">
                                    <span className="font-medium">{request.player?.compte?.full_name || `Player #${request.id_player}`}</span>
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    Wants to join your team
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleProcessJoinRequest(request.id, 'accepted')}
                                    className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm flex items-center gap-1.5 hover:bg-green-600 transition-colors"
                                  >
                                    <UserCheck className="w-3.5 h-3.5" />
                                    Accept
                                  </button>
                                  <button
                                    onClick={() => handleProcessJoinRequest(request.id, 'refused')}
                                    className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm flex items-center gap-1.5 hover:bg-red-600 transition-colors"
                                  >
                                    <UserX className="w-3.5 h-3.5" />
                                    Refuse
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              {/* Player Requests Tab */}
              {activeTab === 'requests' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-6 sm:p-8"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <h2 className="text-2xl font-bold flex items-center">
                      <MessageCircle className="w-6 h-6 mr-2 text-[#07F468]" />
                      Match Requests
                    </h2>
                    
                    <button
                      onClick={() => setShowNewRequestForm(!showNewRequestForm)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full text-sm hover:bg-green-600 transition-colors"
                    >
                      {showNewRequestForm ? (
                        <>
                          <X className="w-4 h-4" />
                          Cancel
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          New Request
                        </>
                      )}
                    </button>
                  </div>
                  
                  {requestsError && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 md:p-4 mb-4 flex items-start">
                      <AlertCircle className="text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                      <p className="text-red-400 text-sm md:text-base">{requestsError}</p>
                    </div>
                  )}
                  
                  {showNewRequestForm ? (
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50">
                      <h3 className="text-lg font-medium text-white mb-4">
                        {newRequestData.receiver_id ? 'Edit Request' : 'Create New Request'}
                      </h3>
                      
                      {requestFormError && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4 text-red-400 text-sm">
                          {requestFormError}
                        </div>
                      )}
                      
                      {requestFormSuccess && (
                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-4 text-green-400 text-sm">
                          {requestFormSuccess}
                        </div>
                      )}
                      
                      <form onSubmit={handleSubmitNewRequest} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">Select Player</label>
                          <select
                            name="receiver_id"
                            value={newRequestData.receiver_id}
                            onChange={handleRequestInputChange}
                            className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                          >
                            <option value="">Select a player</option>
                            {playersLoading ? (
                              <option disabled>Loading players...</option>
                            ) : availablePlayers.length > 0 ? (
                              availablePlayers.map(player => (
                                <option key={player.id_player || player.id} value={player.id_player || player.id}>
                                  {player.compte?.prenom || ''} {player.compte?.nom || ''} - {player.position || 'Unknown'} (Rating: {player.rating || '0'}/5)
                                </option>
                              ))
                            ) : (
                              <option disabled>No players available</option>
                            )}
                          </select>
                          <p className="text-xs text-gray-500 mt-1">Select the player you want to send a request to</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">Match Date</label>
                          <input
                            type="date"
                            name="match_date"
                            value={newRequestData.match_date}
                            onChange={handleRequestInputChange}
                            className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="YYYY-MM-DD"
                            required
                          />
                          <p className="text-xs text-gray-500 mt-1">Enter the date of the match</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">Starting Time</label>
                          <input
                            type="time"
                            name="starting_time"
                            value={newRequestData.starting_time}
                            onChange={handleRequestInputChange}
                            className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                          />
                          <p className="text-xs text-gray-500 mt-1">Enter the starting time of the match</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                          <textarea
                            name="message"
                            value={newRequestData.message}
                            onChange={handleRequestInputChange}
                            className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[80px]"
                            placeholder="Enter your message to the player..."
                            required
                          ></textarea>
                          <p className="text-xs text-gray-500 mt-1">Enter the message you want to send to the player</p>
                        </div>
                        
                        <div className="flex justify-end space-x-3 pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setShowNewRequestForm(false);
                              setRequestFormError(null);
                              setRequestFormSuccess(null);
                            }}
                            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center gap-2"
                            disabled={requestsLoading}
                          >
                            {requestsLoading ? (
                              <>
                                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                                Sending...
                              </>
                            ) : (
                              <>
                                <Save className="w-4 h-4" />
                                Send Request
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50">
                      <h3 className="text-lg font-medium text-white mb-4">Received Requests</h3>
                      
                      {/* Search and Filter Controls */}
                      <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="Search requests..."
                            value={requestsSearchQuery}
                            onChange={(e) => handleRequestsSearch(e.target.value)}
                            className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                        <div className="md:w-48">
                          <select
                            value={requestsFilter}
                            onChange={(e) => handleRequestsFilterChange(e.target.value)}
                            className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                          >
                            <option value="all">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="expired">Expired</option>
                          </select>
                        </div>
                      </div>
                      
                      {requestsLoading ? (
                        <div className="flex justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
                        </div>
                      ) : requestsError ? (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4 text-red-400 text-sm">
                          {requestsError}
                        </div>
                      ) : (
                        <>
                          {playerRequests.received.length > 0 ? (
                            <div className="space-y-4">
                              {playerRequests.received.map((request) => (
                                <RequestCard 
                                  key={request.id}
                                  request={request}
                                  type="received"
                                  onAccept={() => handleAcceptRequest(request.id)}
                                  onReject={() => handleRejectRequest(request.id)}
                                  onCancel={() => handleCancelRequest(request.id)}
                                />
                              ))}
                            </div>
                          ) : (
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 text-center">
                              <MessageCircle className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                              <h3 className="text-xl font-medium text-white mb-2">No Received Requests</h3>
                              <p className="text-gray-400 mb-6">You haven't received any match requests yet.</p>
                            </div>
                          )}
                          
                          <h3 className="text-lg font-medium text-white mb-4 mt-8">Sent Requests</h3>
                          
                          {playerRequests.sent.length > 0 ? (
                            <div className="space-y-4">
                              {playerRequests.sent.map((request) => (
                                <RequestCard 
                                  key={request.id}
                                  request={request}
                                  type="sent"
                                  onAccept={() => handleAcceptRequest(request.id)}
                                  onReject={() => handleRejectRequest(request.id)}
                                  onCancel={() => handleCancelRequest(request.id)}
                                />
                              ))}
                            </div>
                          ) : (
                            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 text-center">
                              <MessageCircle className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                              <h3 className="text-xl font-medium text-white mb-2">No Sent Requests</h3>
                              <p className="text-gray-400 mb-6">You haven't sent any match requests yet.</p>
                            </div>
                          )}
                        </>
                      )}
                      
                      {/* Pagination Controls */}
                      {requestsTotalPages > 1 && (
                        <div className="flex justify-center mt-6 gap-2">
                          <button
                            onClick={() => handleRequestsPageChange(requestsPage - 1)}
                            disabled={requestsPage === 1}
                            className="px-3 py-1 rounded-lg bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                          >
                            Previous
                          </button>
                          <span className="px-3 py-1 text-white">
                            Page {requestsPage} of {requestsTotalPages}
                          </span>
                          <button
                            onClick={() => handleRequestsPageChange(requestsPage + 1)}
                            disabled={requestsPage === requestsTotalPages}
                            className="px-3 py-1 rounded-lg bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                          >
                            Next
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#07F468]"></div>
        </div>
      )}
      {/* Plan Change Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-neutral-900 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4 text-white">Change Subscription Plan</h3>
            <p className="mb-4 text-gray-300">Please select your new subscription plan:</p>
            
            <div className="flex flex-col space-y-3 mb-6">
              <label className="flex items-center space-x-3 cursor-pointer p-3 border rounded-md border-gray-700 hover:border-blue-500 transition-colors">
                <input
                  type="radio"
                  name="plan"
                  value="base"
                  checked={selectedPlan === 'base'}
                  onChange={() => setSelectedPlan('base')}
                  className="form-radio text-blue-500 h-5 w-5"
                />
                <div>
                  <div className="text-white font-medium">Base Plan</div>
                  <div className="text-gray-400 text-sm">Standard features and access</div>
                </div>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer p-3 border rounded-md border-gray-700 hover:border-blue-500 transition-colors">
                <input
                  type="radio"
                  name="plan"
                  value="premium"
                  checked={selectedPlan === 'premium'}
                  onChange={() => setSelectedPlan('premium')}
                  className="form-radio text-blue-500 h-5 w-5"
                />
                <div>
                  <div className="text-white font-medium">Premium Plan</div>
                  <div className="text-gray-400 text-sm">Advanced features and priority access</div>
                </div>
              </label>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowPlanModal(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmPlanUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors"
              >
                Update Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const RequestCard = ({ request, type, onAccept, onReject, onCancel }) => {
  // Format date from ISO string
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format time from ISO string
  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    const time = new Date(timeString);
    return time.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status display classes
  const getStatusClasses = (status) => {
    switch(status) {
      case 'accepted':
        return 'bg-green-500/20 text-green-500';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'rejected':
        return 'bg-red-500/20 text-red-500';
      case 'cancelled':
        return 'bg-gray-500/20 text-gray-400';
      case 'expired':
        return 'bg-gray-500/20 text-gray-400';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  // Get status display text
  const getStatusText = (status) => {
    switch(status) {
      case 'accepted':
        return 'Accepted';
      case 'pending':
        return 'Pending';
      case 'rejected':
        return 'Rejected';
      case 'cancelled':
        return 'Cancelled';
      case 'expired':
        return 'Expired';
      default:
        return status;
    }
  };
  
  // Get player details based on type
  const getPlayerDetails = () => {
    if (type === 'received') {
      return request.sender_details;
    } else {
      return request.receiver_details;
    }
  };
  
  const playerDetails = getPlayerDetails();
  const playerName = playerDetails ? 
    (playerDetails.compte ? `${playerDetails.compte.prenom} ${playerDetails.compte.nom}` : `Player #${type === 'received' ? request.sender : request.receiver}`) : 
    `Player #${type === 'received' ? request.sender : request.receiver}`;
  
  const playerPosition = playerDetails ? playerDetails.position || 'Unknown position' : 'Unknown position';

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 md:p-5 shadow-lg border border-gray-700/50 hover:border-green-500/30 transition-all">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-white mb-2">
            {type === 'received' ? 'Request from' : 'Request to'} {playerName}
          </h3>
          
          <div className="space-y-2 mb-3">
            <div className="text-gray-300">
              {playerDetails && (
                <div className="bg-gray-700/50 px-3 py-2 rounded-lg mb-2">
                  <p className="text-sm text-gray-300">{playerPosition}</p>
                  {playerDetails.rating && (
                    <div className="flex items-center mt-1">
                      <Star className="w-3 h-3 text-yellow-400 mr-1" />
                      <span className="text-xs text-gray-400">Rating: {playerDetails.rating}/5</span>
                    </div>
                  )}
                </div>
              )}
              <p className="italic text-sm mb-2">"{request.message}"</p>
              <div className="flex flex-wrap items-center text-gray-400 gap-x-4 gap-y-2">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1.5" />
                  <span>{formatDate(request.match_date)}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1.5" />
                  <span>{formatTime(request.starting_time)}</span>
                </div>
                {request.expires_at && (
                  <div className="flex items-center text-gray-500 text-xs">
                    <span>Expires: {formatDate(request.expires_at)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-start md:items-end justify-between">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClasses(request.status)}`}>
            {getStatusText(request.status)}
          </span>
          
          <div className="mt-3 flex flex-wrap gap-2">
            {type === 'received' && request.status === 'pending' && (
              <>
                <button
                  onClick={() => onAccept(request.id)}
                  className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm flex items-center gap-1.5 hover:bg-green-600 transition-colors"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  Accept
                </button>
                <button
                  onClick={() => onReject(request.id)}
                  className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm flex items-center gap-1.5 hover:bg-red-600 transition-colors"
                >
                  <UserX className="w-3.5 h-3.5" />
                  Reject
                </button>
              </>
            )}
            
            {type === 'sent' && request.status === 'pending' && (
              <button
                onClick={() => onCancel(request.id)}
                className="px-3 py-1.5 bg-gray-600 text-white rounded-lg text-sm flex items-center gap-1.5 hover:bg-gray-700 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Add the missing components
const ReservationCard = ({ reservation, onCancel, isUpcoming }) => {
  // Format date from string (YYYY-MM-DD)
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status display classes
  const getStatusClasses = (status) => {
    switch(status?.toLowerCase()) {
      case 'reserver':
        return 'bg-green-500/20 text-green-500';
      case 'en attente':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'annuler':
        return 'bg-red-500/20 text-red-500';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  // Get status display text
  const getStatusText = (status) => {
    switch(status?.toLowerCase()) {
      case 'reserver':
        return 'Confirmed';
      case 'en attente':
        return 'Pending';
      case 'annuler':
        return 'Cancelled';
      default:
        return status || 'Unknown';
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 md:p-5 shadow-lg border border-gray-700/50 hover:border-green-500/30 transition-all">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-white mb-2">
            {reservation.terrain || 'Field Reservation'}
          </h3>
          
          <div className="space-y-2 mb-3">
            <div className="flex flex-wrap items-center text-gray-400 gap-x-4 gap-y-2">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1.5" />
                <span>{formatDate(reservation.date)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1.5" />
                <span>{reservation.heure?.substring(0, 5) || reservation.time || 'N/A'}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1.5" />
                <span>{reservation.location || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-start md:items-end justify-between">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClasses(reservation.etat)}`}>
            {getStatusText(reservation.etat)}
          </span>
          
          {isUpcoming && reservation.etat?.toLowerCase() !== 'annuler' && (
            <button
              onClick={() => onCancel(reservation.id_reservation)}
              className="mt-3 px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-sm flex items-center gap-1.5 hover:bg-red-500/30 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Cancel
            </button>
          )}
          
          {!isUpcoming && (
            <Link
              to={`/reservation/${reservation.id_reservation}`}
              className="mt-3 px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg text-sm flex items-center gap-1.5 hover:bg-blue-500/30 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Details
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

const MembershipCard = ({ membership, onCancel, onUpdatePlan }) => {
  // Format date from string (YYYY-MM-DD)
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 md:p-5 shadow-lg border border-gray-700/50 hover:border-green-500/30 transition-all">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
              <Award className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-lg font-medium text-white">
              {membership.name || membership.academie_name || 'Academy Membership'}
            </h3>
          </div>
          
          <div className="space-y-2 mb-3">
            <div className="flex flex-wrap items-center text-gray-400 gap-x-4 gap-y-2">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1.5" />
                <span>Joined: {formatDate(membership.join_date || membership.created_at)}</span>
              </div>
              {membership.expiry_date && (
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1.5" />
                  <span>Expires: {formatDate(membership.expiry_date)}</span>
                </div>
              )}
              {(membership.plan || membership.subscription_plan) && (
                <div className="bg-purple-500/10 text-purple-400 text-xs font-medium px-2.5 py-1 rounded-full border border-purple-500/30">
                  {membership.plan || membership.subscription_plan}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-start md:items-end justify-between">
          {membership.status && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              membership.status === 'active' 
                ? 'bg-green-500/20 text-green-500' 
                : 'bg-gray-500/20 text-gray-300'
            }`}>
              {membership.status}
            </span>
          )}
          
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={() => onCancel(membership.id_academie)}
              className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-sm flex items-center gap-1.5 hover:bg-red-500/30 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Cancel Membership
            </button>
            
            {(membership.plan || membership.subscription_plan) && (
              <button
                onClick={() => onUpdatePlan(membership.id_academie, membership.plan || membership.subscription_plan)}
                className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg text-sm flex items-center gap-1.5 hover:bg-blue-500/30 transition-colors"
              >
                <Settings className="w-3.5 h-3.5" />
                Change Plan
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ActivityCard = ({ activity }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 md:p-5 shadow-lg border border-gray-700/50 hover:border-green-500/30 transition-all">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-white mb-2">
            {activity.title}
          </h3>
          
          {activity.description && (
            <p className="text-gray-300 text-sm mb-3">{activity.description}</p>
          )}
          
          <div className="flex flex-wrap items-center text-gray-400 gap-x-4 gap-y-2">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1.5" />
              <span>{activity.date}</span>
            </div>
            {activity.time && (
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1.5" />
                <span>{activity.time}</span>
              </div>
            )}
            {activity.academy && (
              <div className="flex items-center">
                <Award className="w-4 h-4 mr-1.5" />
                <span>{activity.academy}</span>
              </div>
            )}
            {activity.dateJoined && (
              <div className="flex items-center">
                <UserPlus className="w-4 h-4 mr-1.5" />
                <span>Joined: {activity.dateJoined}</span>
              </div>
            )}
          </div>
        </div>
        
        {activity.status && (
          <div className="flex-shrink-0">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              activity.status === 'completed' 
                ? 'bg-green-500/20 text-green-500'
                : activity.status === 'upcoming'
                ? 'bg-yellow-500/20 text-yellow-500'
                : 'bg-gray-500/20 text-gray-300'
            }`}>
              {activity.status}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// Add function to handle account deletion


// Add the CSS for animations before the export statement
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  .animate-fadeIn {
    animation: fadeIn 1s ease-in-out;
  }
  
  @keyframes pulse {
    0% { opacity: 0.6; }
    50% { opacity: 0.8; }
    100% { opacity: 0.6; }
  }
  
  .animate-pulse {
    animation: pulse 2s infinite ease-in-out;
  }
  
  @media (max-width: 768px) {
    .fixed-profile-bg {
      position: fixed;
      z-index: 1;
    }
  }
`;
document.head.appendChild(style);

export default ProfilePage;

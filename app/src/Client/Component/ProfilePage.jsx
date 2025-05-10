"use client";

import React, { useState, useEffect, useCallback } from 'react';
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
  UserX
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
    name: '',
    description: '',
    logo: null,
    captain_id: '',
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

  // Add state for team invitation form
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [invitePlayerData, setInvitePlayerData] = useState({ player_id: '' });
  const [inviteError, setInviteError] = useState(null);
  const [inviteSuccess, setInviteSuccess] = useState(null);

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

          // Store player data in session storage if available for other components to use
          if (user.player) {
            sessionStorage.setItem('has_player', 'true');
            sessionStorage.setItem('player_id', user.player.id_player);
            sessionStorage.setItem('player_position', user.player.position);
            sessionStorage.setItem('player_rating', user.player.rating);
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

  // Fetch player data when the user has a player account
  useEffect(() => {
    const fetchPlayerInfo = async () => {
      if (!userData) return;
      
      try {
        setPlayerLoading(true);
        
        // First check if the player data is already in userData
        if (userData.player) {
          setPlayerInfo(userData.player);
          
          // Update session storage with latest data
          sessionStorage.setItem('has_player', 'true');
          sessionStorage.setItem('isPlayer', 'true');
          sessionStorage.setItem('player_id', userData.player.id_player || userData.player.id);
          sessionStorage.setItem('player_position', userData.player.position);
          sessionStorage.setItem('player_rating', userData.player.rating || '0');
          
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
                setPlayerInfo(userPlayer);
                
                // Update session storage with found player data
                sessionStorage.setItem('has_player', 'true');
                sessionStorage.setItem('isPlayer', 'true');
                sessionStorage.setItem('player_id', userPlayer.id_player || userPlayer.id);
                sessionStorage.setItem('player_position', userPlayer.position);
                sessionStorage.setItem('player_rating', userPlayer.rating || '0');
                
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
          const playerData = response.data?.data || response.data;
          
          if (playerData) {
            // Ensure we have the correct ID field
            const player = {
              ...playerData,
              id_player: playerData.id_player || playerData.id
            };
            
            setPlayerInfo(player);
            
            // Update session storage with latest data
            sessionStorage.setItem('has_player', 'true');
            sessionStorage.setItem('isPlayer', 'true');
            sessionStorage.setItem('player_id', player.id_player);
            sessionStorage.setItem('player_position', player.position);
            sessionStorage.setItem('player_rating', player.rating || '0');
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
      if (!userData) return;
      
      try {
        setTeamLoading(true);
        
        // First check if the team data is already in userData
        if (userData.team) {
          setTeamInfo(userData.team);
          
          // Update session storage with latest data
          sessionStorage.setItem('has_teams', 'true');
          sessionStorage.setItem('id_teams', userData.team.id_teams);
          
          setTeamLoading(false);
          return;
        }
        
        // Check if user already has a team ID in session storage
        const teamId = sessionStorage.getItem('id_teams');
        const hasTeams = sessionStorage.getItem('has_teams') === 'true';
        
        // If we have stored teams data in session storage, try to use that first
        const storedTeamsData = sessionStorage.getItem('teams');
        if (storedTeamsData) {
          try {
            const teams = JSON.parse(storedTeamsData);
            if (teams && teams.length > 0) {
              // Use the first team as the active team
              setTeamInfo(teams[0]);
              setTeamLoading(false);
              return;
            }
          } catch (e) {
            console.error('Error parsing stored teams data:', e);
          }
        }
        
        if (!teamId && !hasTeams) {
          // If no team ID in session and no has_teams flag, check if the user is a player
          const playerId = sessionStorage.getItem('player_id');
          if (!playerId) {
            // If not a player, they can't have a team
            setTeamLoading(false);
            return;
          }
          
          // Try to get all the player's teams
          try {
            const response = await playerTeamsService.getAllPlayerTeams();
            if (response && response.data && response.data.length > 0) {
              // Found teams for this player
              const teams = response.data;
              
              // Store teams data in session storage
              sessionStorage.setItem('teams', JSON.stringify(teams));
              sessionStorage.setItem('has_teams', 'true');
              sessionStorage.setItem('id_teams', teams[0].id_teams);
              
              // Set the first team as the active team
              setTeamInfo(teams[0]);
              setTeamLoading(false);
              return;
            } else {
              // No teams found for this player
              setTeamLoading(false);
              return;
            }
          } catch (error) {
            // Handle API error
            console.error('Error fetching player teams:', error);
            if (error.response && error.response.status !== 404) {
              throw error; // Re-throw non-404 errors
            }
            // For 404 errors, just continue as if no teams were found
            setTeamLoading(false);
            return;
          }
        }
        
        // If we have a team ID, fetch the team data
        if (teamId) {
          try {
            const response = await playerTeamsService.getPlayerTeam(teamId);
            
            // Handle different response formats
            const teamData = response.data?.data || response.data;
            
            if (teamData) {
              // Set the team info
              setTeamInfo(teamData);
              
              // Fetch team members if they're not included
              if (!teamData.members) {
                try {
                  const membersResponse = await playerTeamsService.getTeamMembers(teamId);
                  if (membersResponse && membersResponse.data) {
                    const members = membersResponse.data;
                    
                    // Mark the captain in the members list
                    const membersWithCaptainFlag = members.map(member => ({
                      ...member,
                      is_captain: member.id_player === teamData.captain_id
                    }));
                    
                    // Update team info with members
                    setTeamInfo(prevTeamInfo => ({
                      ...prevTeamInfo,
                      members: membersWithCaptainFlag,
                      member_count: members.length
                    }));
                  }
                } catch (membersError) {
                  console.error('Error fetching team members:', membersError);
                }
              } else {
                // If members are included, still mark the captain
                const membersWithCaptainFlag = teamData.members.map(member => ({
                  ...member,
                  is_captain: member.id_player === teamData.captain_id
                }));
                
                // Update team info with captain flags
                setTeamInfo({
                  ...teamData,
                  members: membersWithCaptainFlag
                });
              }
            }
          } catch (error) {
            // Handle "Team not found" error
            if (error.response && error.response.status === 404) {
              console.log("Team not found, clearing team data");
              // Clear team info and session storage since team doesn't exist
              setTeamInfo(null);
              sessionStorage.removeItem('has_teams');
              sessionStorage.removeItem('id_teams');
              sessionStorage.removeItem('teams');
            } else {
              throw error; // Re-throw other errors
            }
          }
        }
      } catch (error) {
        console.error('Error fetching team info:', error);
        setTeamError('Failed to load team information');
      } finally {
        setTeamLoading(false);
      }
    };
    
    fetchTeamInfo();
  }, [userData]);

  // Add this new effect to fetch team invitations and join requests
  useEffect(() => {
    const fetchPendingInvitations = async () => {
      if (!playerInfo) return;
      
      try {
        setInvitationsLoading(true);
        const response = await playerTeamsService.getPendingInvitations();
        
        if (response && response.data) {
          setPendingInvitations(response.data);
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
      const playerId = playerInfo?.id_player || playerInfo?.id;
      if (teamInfo.captain_id !== playerId) return;
      
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
  }, [playerInfo, teamInfo]);

  // Add new handlers for accepting and refusing invitations
  const handleAcceptInvitation = async (id) => {
    try {
      setInvitationsLoading(true);
      const response = await playerTeamsService.acceptInvitation(id);
      
      if (response && (response.success || response.status === 'success')) {
        // Remove from pending invitations
        setPendingInvitations(prev => prev.filter(inv => inv.id !== id));
        
        // Refresh team data
        if (response.data && response.data.id_teams) {
          const teamResponse = await playerTeamsService.getPlayerTeam(response.data.id_teams);
          if (teamResponse && teamResponse.data) {
            setTeamInfo(teamResponse.data);
            
            // Update session storage
            sessionStorage.setItem('has_teams', 'true');
            sessionStorage.setItem('id_teams', teamResponse.data.id_teams);
            
            // If we have teams array in session storage, update it
            try {
              const storedTeamsData = sessionStorage.getItem('teams');
              if (storedTeamsData) {
                const teams = JSON.parse(storedTeamsData);
                teams.push(teamResponse.data);
                sessionStorage.setItem('teams', JSON.stringify(teams));
              } else {
                sessionStorage.setItem('teams', JSON.stringify([teamResponse.data]));
              }
            } catch (e) {
              console.error('Error updating teams in session storage:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error accepting invitation:', error);
    } finally {
      setInvitationsLoading(false);
    }
  };

  const handleRefuseInvitation = async (id) => {
    try {
      setInvitationsLoading(true);
      const response = await playerTeamsService.refuseInvitation(id);
      
      if (response && (response.success || response.status === 'success')) {
        // Remove from pending invitations
        setPendingInvitations(prev => prev.filter(inv => inv.id !== id));
      }
    } catch (error) {
      console.error('Error refusing invitation:', error);
    } finally {
      setInvitationsLoading(false);
    }
  };

  // Add handler for processing join requests
  const handleProcessJoinRequest = async (id, status) => {
    try {
      setInvitationsLoading(true);
      const response = await playerTeamsService.processJoinRequest(id, { status });
      
      if (response && (response.success || response.status === 'success')) {
        // Remove from pending join requests
        setPendingJoinRequests(prev => prev.filter(req => req.id !== id));
        
        // Refresh team members if accepted
        if (status === 'accepted' && teamInfo) {
          const membersResponse = await playerTeamsService.getTeamMembers(teamInfo.id_teams);
          if (membersResponse && membersResponse.data) {
            const members = membersResponse.data;
            
            // Mark the captain in the members list
            const membersWithCaptainFlag = members.map(member => ({
              ...member,
              is_captain: member.id_player === teamInfo.captain_id
            }));
            
            // Update team info with members
            setTeamInfo(prevTeamInfo => ({
              ...prevTeamInfo,
              members: membersWithCaptainFlag,
              member_count: members.length
            }));
          }
        }
      }
    } catch (error) {
      console.error('Error processing join request:', error);
    } finally {
      setInvitationsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordFormData({ ...passwordFormData, [name]: value });
  };

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility({ ...passwordVisibility, [field]: !passwordVisibility[field] });
  };

  const handleSubmitPasswordChange = (e) => {
    e.preventDefault();
    // Implement password change logic
    setPasswordError(null);
    setPasswordSuccess('Password changed successfully');
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    // Implement profile save logic
  };

  const handlePlayerInputChange = (e) => {
    const { name, value } = e.target;
    setPlayerFormData({ ...playerFormData, [name]: value });
  };

  const handleTeamInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'logo' && e.target.files && e.target.files[0]) {
      setTeamFormData({ ...teamFormData, [name]: e.target.files[0] });
    } else {
      setTeamFormData({ ...teamFormData, [name]: value });
    }
  };

  const handleJoinTeamInputChange = (e) => {
    const { name, value } = e.target;
    setJoinTeamData({ ...joinTeamData, [name]: value });
  };

  const handleJoinTeam = async (e) => {
    e.preventDefault();
    
    // Reset messages
    setJoinTeamError(null);
    setJoinTeamSuccess(null);
    
    // Validate form data
    if (!joinTeamData.team_id) {
      setJoinTeamError('Please enter a team ID');
      return;
    }
    
    try {
      setTeamLoading(true);
      
      // Call API to join team
      const response = await playerTeamsService.joinTeam(joinTeamData.team_id);
      
      if (response && (response.success || response.status === 'success' || response.data)) {
        // Get the team data
        const team = response.data?.data || response.data;
        
        // Update team info
        setTeamInfo(team);
        
        // Update session storage
        sessionStorage.setItem('has_teams', 'true');
        sessionStorage.setItem('id_teams', team.id_teams);
        
        // If we have teams array in session storage, update it
        try {
          const storedTeamsData = sessionStorage.getItem('teams');
          if (storedTeamsData) {
            const teams = JSON.parse(storedTeamsData);
            // Add new team to array
            teams.push(team);
            sessionStorage.setItem('teams', JSON.stringify(teams));
          } else {
            // Create new teams array
            sessionStorage.setItem('teams', JSON.stringify([team]));
          }
        } catch (e) {
          console.error('Error updating teams in session storage:', e);
        }
        
        // Show success message
        setJoinTeamSuccess('Successfully joined team');
        
        // Close form after success
        setTimeout(() => {
          setShowJoinTeamSection(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Error joining team:', error);
      setJoinTeamError('Failed to join team: ' + (error.response?.data?.message || error.message));
    } finally {
      setTeamLoading(false);
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
      
      // Format times to include seconds if they don't have them
      if (apiData.starting_time && !apiData.starting_time.includes(':')) {
        apiData.starting_time = `${apiData.starting_time}:00`;
      }
      
      if (apiData.finishing_time && !apiData.finishing_time.includes(':')) {
        apiData.finishing_time = `${apiData.finishing_time}:00`;
      }
      
      // Ensure times are in HH:MM:SS format
      if (apiData.starting_time && apiData.starting_time.split(':').length === 2) {
        apiData.starting_time = `${apiData.starting_time}:00`;
      }
      
      if (apiData.finishing_time && apiData.finishing_time.split(':').length === 2) {
        apiData.finishing_time = `${apiData.finishing_time}:00`;
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
    
    // Reset messages
    setTeamFormError(null);
    setTeamFormSuccess(null);
    
    // Validate form data
    if (!teamFormData.name) {
      setTeamFormError('Please enter a team name');
      return;
    }
    
    try {
      setTeamLoading(true);
      
      // Prepare data for API
      const formData = new FormData();
      formData.append('name', teamFormData.name);
      
      if (teamFormData.description) {
        formData.append('description', teamFormData.description);
      }
      
      if (teamFormData.logo) {
        formData.append('logo', teamFormData.logo);
      }
      
      // Add captain ID if available
      if (teamFormData.captain_id) {
        formData.append('captain_id', teamFormData.captain_id);
      } else {
        // Use current player ID as default captain if creating a new team
        const playerId = playerInfo?.id_player || sessionStorage.getItem('player_id');
        if (playerId && !teamInfo) {
          formData.append('captain_id', playerId);
        }
      }
      
      // Add time fields if available
      if (teamFormData.starting_time) {
        formData.append('starting_time', teamFormData.starting_time);
      }
      
      if (teamFormData.finishing_time) {
        formData.append('finishing_time', teamFormData.finishing_time);
      }
      
      let response;
      if (teamInfo) {
        // Update existing team
        const teamId = teamInfo.id_teams;
        response = await playerTeamsService.updatePlayerTeam(teamId, formData);
      } else {
        // Create new team
        response = await playerTeamsService.createPlayerTeam(formData);
      }
      
      // Handle response
      const responseData = response.data?.data || response.data;
      
      if (response.success || responseData) {
        // Get the team data
        const team = responseData || response.data;
        
        // Update team info
        setTeamInfo(team);
        
        // Update session storage
        sessionStorage.setItem('has_teams', 'true');
        sessionStorage.setItem('id_teams', team.id_teams);
        
        // If we have teams array in session storage, update it
        try {
          const storedTeamsData = sessionStorage.getItem('teams');
          if (storedTeamsData) {
            const teams = JSON.parse(storedTeamsData);
            if (teamInfo) {
              // Update existing team in array
              const updatedTeams = teams.map(t => 
                t.id_teams === team.id_teams ? team : t
              );
              sessionStorage.setItem('teams', JSON.stringify(updatedTeams));
            } else {
              // Add new team to array
              teams.push(team);
              sessionStorage.setItem('teams', JSON.stringify(teams));
            }
          } else {
            // Create new teams array
            sessionStorage.setItem('teams', JSON.stringify([team]));
          }
        } catch (e) {
          console.error('Error updating teams in session storage:', e);
        }
        
        // Show success message
        setTeamFormSuccess(teamInfo ? 'Team updated successfully' : 'Team created successfully');
        
        // Close form after success
        setTimeout(() => {
          setShowTeamForm(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Error saving team:', error);
      setTeamFormError('Failed to save team: ' + (error.response?.data?.message || error.message));
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
          setPlayerFormSuccess('Player profile deleted successfully');
        }
      } else if (deleteTarget.type === 'team' && deleteTarget.id) {
        setTeamLoading(true);
        
        // Call API to delete team
        const response = await playerTeamsService.deletePlayerTeam(deleteTarget.id);
        
        if (response && (response.success || response.status === 'success')) {
          // Clear team info and session storage
          setTeamInfo(null);
          sessionStorage.removeItem('has_teams');
          sessionStorage.removeItem('id_teams');
          sessionStorage.removeItem('teams');
          
          // Show success message
          setTeamFormSuccess('Team deleted successfully');
        }
      }
    } catch (error) {
      console.error('Error deleting resource:', error);
      if (deleteTarget.type === 'player') {
        setPlayerFormError('Failed to delete player: ' + (error.response?.data?.message || error.message));
      } else if (deleteTarget.type === 'team') {
        setTeamFormError('Failed to delete team: ' + (error.response?.data?.message || error.message));
      }
    } finally {
      // Close the confirmation modal and reset state
      setShowDeleteConfirmation(false);
      setDeleteTarget(null);
      setPlayerLoading(false);
      setTeamLoading(false);
    }
  };

  // Add missing function to handle cancelling a reservation
  const handleCancelReservation = async (reservationId) => {
    try {
      setReservationLoading(true);
      const response = await reservationService.cancelReservation(reservationId);
      
      if (response && (response.success || response.status === 'success')) {
        // Remove from upcoming reservations
        setUpcomingReservations(prev => prev.filter(r => r.id_reservation !== reservationId));
        
        // Optionally show a success message
        // This could be a toast or a state-based message
        console.log('Reservation cancelled successfully');
      }
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      setReservationError('Failed to cancel reservation: ' + (error.response?.data?.message || error.message));
    } finally {
      setReservationLoading(false);
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

  // Add functions for academy memberships
  const handleCancelMembership = async (academieId) => {
    try {
      const response = await academieMemberService.cancelMembership(academieId);
      
      if (response && (response.success || response.status === 'success')) {
        // Remove from memberships
        setMemberships(prev => prev.filter(m => m.id_academie !== academieId));
        
        // Show success message
        setMembershipActionStatus({
          type: 'success',
          text: 'Academy membership cancelled successfully'
        });
        
        // Clear message after a delay
        setTimeout(() => {
          setMembershipActionStatus(null);
        }, 3000);
      }
    } catch (error) {
      console.error('Error cancelling membership:', error);
      setMembershipActionStatus({
        type: 'error',
        text: 'Failed to cancel membership: ' + (error.response?.data?.message || error.message)
      });
    }
  };

  const handleUpdatePlan = async (academieId, newPlan) => {
    try {
      const response = await academieMemberService.updateMembershipPlan(academieId, { plan: newPlan });
      
      if (response && (response.success || response.status === 'success')) {
        // Update the plan in the memberships array
        setMemberships(prev => prev.map(m => 
          m.id_academie === academieId ? { ...m, plan: newPlan } : m
        ));
        
        // Show success message
        setMembershipActionStatus({
          type: 'success',
          text: 'Membership plan updated successfully'
        });
        
        // Clear message after a delay
        setTimeout(() => {
          setMembershipActionStatus(null);
        }, 3000);
      }
    } catch (error) {
      console.error('Error updating membership plan:', error);
      setMembershipActionStatus({
        type: 'error',
        text: 'Failed to update plan: ' + (error.response?.data?.message || error.message)
      });
    }
  };

  // Add function to handle team deletion
  const handleDeleteTeam = () => {
    if (!teamInfo) return;
    
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
      name: teamInfo.name || `Team #${teamId}`
    });
    setShowDeleteConfirmation(true);
  };

  // Add function to handle removing a member from a team
  const handleRemoveMember = async (playerId) => {
    if (!teamInfo || !playerId) return;
    
    try {
      setTeamLoading(true);
      const response = await playerTeamsService.removeTeamMember(teamInfo.id_teams, playerId);
      
      if (response && (response.success || response.status === 'success')) {
        // Remove member from the team members list
        setTeamInfo(prev => ({
          ...prev,
          members: prev.members.filter(member => member.id_player !== playerId),
          member_count: prev.member_count - 1
        }));
      }
    } catch (error) {
      console.error('Error removing team member:', error);
      setTeamFormError('Failed to remove team member: ' + (error.response?.data?.message || error.message));
    } finally {
      setTeamLoading(false);
    }
  };

  // Add function to handle team member invitation
  const handleInviteMember = async (e) => {
    e.preventDefault();
    
    // Reset messages
    setInviteError(null);
    setInviteSuccess(null);
    
    // Validate form data
    if (!invitePlayerData.player_id) {
      setInviteError('Please select a player from the search results');
      return;
    }
    
    // If team doesn't exist, we need to create one first
    if (!teamInfo) {
      try {
        setTeamLoading(true);
        setInviteError(null);
        
        // Get player info
        const playerId = playerInfo?.id_player || playerInfo?.id;
        if (!playerId) {
          setInviteError('You need to create a player profile before creating a team');
          return;
        }
        
        // Create default team data
        const formData = new FormData();
        formData.append('name', `${userData?.prenom || 'My'}'s Team`);
        formData.append('description', 'Team created automatically');
        formData.append('captain_id', playerId);
        
        console.log('Creating new team before invitation');
        
        // Create the team first
        const teamResponse = await playerTeamsService.createPlayerTeam(formData);
        
        if (!teamResponse || (!teamResponse.success && !teamResponse.data)) {
          setInviteError('Failed to create team before inviting player');
          return;
        }
        
        // Get the newly created team
        const newTeam = teamResponse.data?.data || teamResponse.data;
        
        // Update teamInfo
        setTeamInfo(newTeam);
        
        // Update session storage
        sessionStorage.setItem('has_teams', 'true');
        sessionStorage.setItem('id_teams', newTeam.id_teams);
        
        // Invite the player to the new team
        console.log('Inviting player to newly created team', newTeam.id_teams);
        const inviteResponse = await playerTeamsService.addPlayerToTeam({
          player_id: invitePlayerData.player_id,
          team_id: newTeam.id_teams
        });
        
        if (inviteResponse && (inviteResponse.success || inviteResponse.status === 'success')) {
          // Show success message
          setInviteSuccess('Team created and invitation sent successfully');
          
          // Reset form
          setInvitePlayerData({ player_id: '' });
          setPlayerSearchQuery('');
          setSearchResults([]);
          
          // Close form after success
          setTimeout(() => {
            setShowInviteForm(false);
          }, 2000);
        }
      } catch (error) {
        console.error('Error creating team and inviting player:', error);
        setInviteError('Failed to create team and invite player: ' + (error.response?.data?.message || error.message));
      } finally {
        setTeamLoading(false);
      }
      return;
    }
    
    // If we have a team, proceed with invitation
    try {
      setTeamLoading(true);
      
      // Get the team ID
      const teamId = teamInfo.id_teams || teamInfo.id;
      
      if (!teamId) {
        setInviteError('Team ID is missing. Please refresh the page or create a team first.');
        console.error('Team ID is missing from teamInfo:', teamInfo);
        return;
      }
      
      console.log('Inviting player', invitePlayerData.player_id, 'to existing team', teamId);
      
      // Call API to invite player with the correct parameter names
      const response = await playerTeamsService.addPlayerToTeam({
        player_id: invitePlayerData.player_id,
        team_id: teamId
      });
      
      if (response && (response.success || response.status === 'success')) {
        // Show success message
        setInviteSuccess('Invitation sent successfully');
        
        // Reset form
        setInvitePlayerData({ player_id: '' });
        setPlayerSearchQuery('');
        setSearchResults([]);
        
        // Close form after success
        setTimeout(() => {
          setShowInviteForm(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Error inviting player:', error);
      setInviteError('Failed to send invitation: ' + (error.response?.data?.message || error.message));
    } finally {
      setTeamLoading(false);
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
    setNewRequestData({ ...newRequestData, [name]: value });
  };

  // Add function to handle submitting a new request
  const handleSubmitNewRequest = async (e) => {
    e.preventDefault();
    
    // Reset messages
    setRequestFormError(null);
    setRequestFormSuccess(null);
    
    // Validate form data
    if (!newRequestData.receiver_id) {
      setRequestFormError('Please enter a receiver ID');
      return;
    }
    
    if (!newRequestData.match_date) {
      setRequestFormError('Please select a match date');
      return;
    }
    
    if (!newRequestData.starting_time) {
      setRequestFormError('Please select a starting time');
      return;
    }
    
    if (!newRequestData.message) {
      setRequestFormError('Please enter a message');
      return;
    }
    
    try {
      setRequestsLoading(true);
      
      // Call API to create new request
      const response = await playerRequestsService.createPlayerRequest(newRequestData);
      
      if (response && (response.success || response.status === 'success')) {
        // Show success message
        setRequestFormSuccess('Request sent successfully');
        
        // Add to sent requests
        if (response.data) {
          setPlayerRequests(prev => ({
            ...prev,
            sent: [...prev.sent, response.data]
          }));
        }
        
        // Reset form
        setNewRequestData({
          receiver_id: '',
          match_date: '',
          starting_time: '',
          message: ''
        });
        
        // Close form after success
        setTimeout(() => {
          setShowNewRequestForm(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Error sending request:', error);
      setRequestFormError('Failed to send request: ' + (error.response?.data?.message || error.message));
    } finally {
      setRequestsLoading(false);
    }
  };

  // Add functions for handling player requests
  const handleAcceptRequest = async (requestId) => {
    try {
      setRequestsLoading(true);
      const response = await playerRequestsService.acceptPlayerRequest(requestId);
      
      if (response && (response.success || response.status === 'success')) {
        // Update request status in state
        setPlayerRequests(prev => ({
          received: prev.received.map(req => 
            req.id === requestId ? { ...req, status: 'accepted' } : req
          ),
          sent: prev.sent.map(req => 
            req.id === requestId ? { ...req, status: 'accepted' } : req
          )
        }));
      }
    } catch (error) {
      console.error('Error accepting request:', error);
      setRequestsError('Failed to accept request: ' + (error.response?.data?.message || error.message));
    } finally {
      setRequestsLoading(false);
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      setRequestsLoading(true);
      const response = await playerRequestsService.rejectPlayerRequest(requestId);
      
      if (response && (response.success || response.status === 'success')) {
        // Update request status in state
        setPlayerRequests(prev => ({
          received: prev.received.map(req => 
            req.id === requestId ? { ...req, status: 'rejected' } : req
          ),
          sent: prev.sent.map(req => 
            req.id === requestId ? { ...req, status: 'rejected' } : req
          )
        }));
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      setRequestsError('Failed to reject request: ' + (error.response?.data?.message || error.message));
    } finally {
      setRequestsLoading(false);
    }
  };

  const handleCancelRequest = async (requestId) => {
    try {
      setRequestsLoading(true);
      const response = await playerRequestsService.cancelPlayerRequest(requestId);
      
      if (response && (response.success || response.status === 'success')) {
        // Update request status in state
        setPlayerRequests(prev => ({
          received: prev.received.map(req => 
            req.id === requestId ? { ...req, status: 'cancelled' } : req
          ),
          sent: prev.sent.map(req => 
            req.id === requestId ? { ...req, status: 'cancelled' } : req
          )
        }));
      }
    } catch (error) {
      console.error('Error cancelling request:', error);
      setRequestsError('Failed to cancel request: ' + (error.response?.data?.message || error.message));
    } finally {
      setRequestsLoading(false);
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
    <div className="min-h-screen bg-gradient-to-br from-[#121212] to-[#1e1e1e] text-white font-sans pb-12">
      {/* Hero section with user profile banner */}
      <div className="h-64 sm:h-80 bg-gradient-to-r from-[#1a1a1a] to-[#252525] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://wallpapercave.com/wp/wp3046717.jpg')] bg-center bg-cover opacity-50"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent"></div>
      </div>

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
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#141414] rounded-xl shadow-2xl overflow-hidden border border-white/5">
            {/* User info with avatar, name, etc. */}
            <div className="p-6 sm:p-8 flex flex-col md:flex-row md:items-end gap-6">
              <div className="flex-shrink-0 -mt-20">
                <div className="relative inline-block">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#07F468] to-[#19be59] rounded-full blur opacity-70"></div>
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#141414]">
                    <img
                      src={userData.pfp || "https://ui-avatars.com/api/?name=" + (userData.nom || '') + "+" + (userData.prenom || '') + "&background=07F468&color=121212&size=128"}
                      alt={userData.nom || 'Profile Avatar'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex-grow">
                <h1 className="text-3xl font-bold">{userData.nom} {userData.prenom}</h1>
                <p className="text-gray-400 mt-1">Member since {new Date(userData.created_at || userData.dateInscription || Date.now()).toLocaleDateString()}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="bg-[#07F468]/10 text-[#07F468] text-xs font-medium px-2.5 py-1 rounded-full border border-[#07F468]/30">
                    {userData.role || 'Member'}
                  </span>
                  {userData.player && (
                    <span className="bg-blue-500/10 text-blue-400 text-xs font-medium px-2.5 py-1 rounded-full border border-blue-500/30 flex items-center">
                      <User className="w-3 h-3 mr-1" />
                      Player
                    </span>
                  )}
                  {sessionStorage.getItem('has_teams') === 'true' && (
                    <span className="bg-purple-500/10 text-purple-400 text-xs font-medium px-2.5 py-1 rounded-full border border-purple-500/30 flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      Team Captain
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex-shrink-0 mt-4 md:mt-0">
                <Link to="/reservation" className="bg-[#07F468] text-black font-bold py-2 px-4 rounded-lg hover:bg-[#06C357] inline-flex items-center transition duration-300">
                  <Calendar className="w-4 h-4 mr-2" />
                  Book a Field
                </Link>
              </div>
            </div>
            
            {/* Tab Navigation */}
            <div className="border-b border-white/10">
              <nav className="flex overflow-x-auto whitespace-nowrap hide-scrollbar">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`py-3 px-6 font-medium transition-colors ${
                    activeTab === 'info'
                      ? 'text-[#07F468] border-b-2 border-[#07F468]'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <User className="w-4 h-4 inline-block mr-2" />
                  Profile Info
                </button>
                <button
                  onClick={() => setActiveTab('reservations')}
                  className={`py-3 px-6 font-medium transition-colors ${
                    activeTab === 'reservations'
                      ? 'text-[#07F468] border-b-2 border-[#07F468]'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Calendar className="w-4 h-4 inline-block mr-2" />
                  Reservations
                </button>
                <button
                  onClick={() => setActiveTab('academies')}
                  className={`py-3 px-6 font-medium transition-colors ${
                    activeTab === 'academies'
                      ? 'text-[#07F468] border-b-2 border-[#07F468]'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Award className="w-4 h-4 inline-block mr-2" />
                  Academies
                </button>
                <button
                  onClick={() => setActiveTab('player')}
                  className={`py-3 px-6 font-medium transition-colors ${
                    activeTab === 'player'
                      ? 'text-[#07F468] border-b-2 border-[#07F468]'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <UserPlus className="w-4 h-4 inline-block mr-2" />
                  Player
                </button>
                <button
                  onClick={() => setActiveTab('team')}
                  className={`py-3 px-6 font-medium transition-colors ${
                    activeTab === 'team'
                      ? 'text-[#07F468] border-b-2 border-[#07F468]'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Shield className="w-4 h-4 inline-block mr-2" />
                  Team
                </button>
                <button
                  onClick={() => setActiveTab('requests')}
                  className={`py-3 px-6 font-medium transition-colors ${
                    activeTab === 'requests'
                      ? 'text-[#07F468] border-b-2 border-[#07F468]'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <MessageCircle className="w-4 h-4 inline-block mr-2" />
                  Requests
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
                  <h3 className="text-lg font-medium text-white mb-4">Academy Activities</h3>
                  
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
                              <span>From: {playerInfo?.starting_time?.substring(0, 5) || 'Not Set'}</span>
                            </div>
                            <div className="flex items-center text-white">
                              <Clock className="w-4 h-4 text-[#07F468] mr-1" />
                              <span>To: {playerInfo?.finishing_time?.substring(0, 5) || 'Not Set'}</span>
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
                        {teamInfo ? 'Edit Team' : 'Create Team'}
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
                      
                      <form onSubmit={handleSubmitTeamForm} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">Team Name</label>
                          <input
                            type="text"
                            name="name"
                            value={teamFormData.name}
                            onChange={handleTeamInputChange}
                            className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                          <textarea
                            name="description"
                            value={teamFormData.description}
                            onChange={handleTeamInputChange}
                            className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[80px]"
                            placeholder="Describe your team..."
                          ></textarea>
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
                        
                        {/* Captain selection dropdown - only show for existing teams */}
                        {teamInfo && teamInfo.members && teamInfo.members.length > 0 && (
                          <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Team Captain</label>
                            <select
                              name="captain_id"
                              value={teamFormData.captain_id}
                              onChange={handleTeamInputChange}
                              className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                              <option value="">Select a new captain</option>
                              {teamInfo.members.map((member) => (
                                <option 
                                  key={member.id_player} 
                                  value={member.id_player}
                                >
                                  {member.name || `Player #${member.id_player}`} ({member.position || 'Unknown'})
                                  {member.is_captain ? ' (Current Captain)' : ''}
                                </option>
                              ))}
                            </select>
                            <p className="text-xs text-gray-500 mt-1">Select a team member to transfer captaincy</p>
                          </div>
                        )}
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">Team Logo</label>
                          <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center hover:border-green-500 transition-colors">
                            <input
                              type="file"
                              name="logo"
                              onChange={handleTeamInputChange}
                              className="hidden"
                              id="team-logo-input"
                              accept="image/*"
                            />
                            <label htmlFor="team-logo-input" className="cursor-pointer">
                              <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                              <p className="text-sm text-gray-400">
                                {teamFormData.logo ? teamFormData.logo.name : 'Click to upload a logo'}
                              </p>
                            </label>
                          </div>
                        </div>
                        
                        <div className="flex justify-end space-x-3 pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setShowTeamForm(false);
                              setTeamFormError(null);
                              setTeamFormSuccess(null);
                            }}
                            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center gap-2"
                            disabled={teamLoading}
                          >
                            {teamLoading ? (
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
                            <h3 className="text-xl font-bold">{teamInfo.name || `Team #${teamInfo.id_teams}`}</h3>
                            <div className="flex items-center mt-1">
                              <span className="bg-purple-500/10 text-purple-400 text-xs font-medium px-2.5 py-1 rounded-full border border-purple-500/30 flex items-center">
                                <Users className="w-3 h-3 mr-1" />
                                Team Captain
                              </span>
                              {teamInfo.rank && (
                                <div className="flex items-center ml-2 bg-white/10 px-2 py-1 rounded-full">
                                  <Trophy className="w-3 h-3 mr-1 text-yellow-400" />
                                  <span className="text-xs">{teamInfo.rank}</span>
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
                            <p className="text-xl font-semibold text-white">{teamInfo.member_count || '1'}</p>
                          </div>
                          <div className="bg-gray-800/50 p-4 rounded-lg">
                            <p className="text-gray-400 text-sm">Matches</p>
                            <p className="text-xl font-semibold text-white">{teamInfo.match_count || '0'}</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-between mt-6">
                          <button
                            onClick={() => {
                              setTeamFormData({
                                name: teamInfo.name || '',
                                description: teamInfo.description || '',
                                logo: null
                              });
                              setShowTeamForm(true);
                            }}
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
                        </div>
                      </div>
                      
                      {/* Team Stats/Members Card */}
                      <div className="bg-[#1E1E1E] rounded-xl border border-white/5 p-6 shadow-lg">
                        <h3 className="text-lg font-bold mb-4">Team Members</h3>
                        
                        {teamInfo.members && teamInfo.members.length > 0 ? (
                          <div className="space-y-3">
                            {teamInfo.members.map((member, index) => (
                              <div key={index} className="flex items-center p-2 rounded-lg bg-gray-800/50">
                                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                                  <User className="w-4 h-4 text-gray-400" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-white">{member.name || `Player #${member.id_player}`}</p>
                                  <div className="flex items-center">
                                    <p className="text-xs text-gray-400">{member.position || 'Unknown'}</p>
                                    {member.is_captain && (
                                      <span className="ml-2 bg-yellow-500/10 text-yellow-400 text-xs px-2 py-0.5 rounded-full">
                                        Captain
                                      </span>
                                    )}
                                  </div>
                                </div>
                                {!member.is_captain && member.id_player !== (playerInfo?.id_player) && (
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
                          {pendingInvitations.map((invitation) => (
                            <div key={invitation.id} className="p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="text-white">
                                    <span className="font-medium">{invitation.team?.name || `Team #${invitation.id_teams}`}</span>
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    Invited you to join their team
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
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Team Join Requests Section - Only shown if user is captain */}
                  {playerInfo && teamInfo && playerInfo.id === teamInfo.captain_id && pendingJoinRequests.length > 0 && (
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
                          <label className="block text-sm font-medium text-gray-400 mb-2">Receiver ID</label>
                          <input
                            type="text"
                            name="receiver_id"
                            value={newRequestData.receiver_id}
                            onChange={handleRequestInputChange}
                            className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Enter receiver ID"
                            required
                          />
                          <p className="text-xs text-gray-500 mt-1">Enter the ID of the player you want to send a request to</p>
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
    </div>
  );
};

const RequestCard = ({ request, type, onAccept, onReject, onCancel }) => {
  // Format date from ISO string
  const formatDate = (dateString) => {
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
      default:
        return status;
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 md:p-5 shadow-lg border border-gray-700/50 hover:border-green-500/30 transition-all">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-white mb-2">
            Match Request {type === 'received' ? 'from' : 'to'} Player #{request.type === 'received' ? request.sender : request.receiver}
          </h3>
          
          <div className="space-y-2 mb-3">
            <div className="text-gray-300">
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
                  onClick={onAccept}
                  className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm flex items-center gap-1.5 hover:bg-green-600 transition-colors"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  Accept
                </button>
                <button
                  onClick={onReject}
                  className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm flex items-center gap-1.5 hover:bg-red-600 transition-colors"
                >
                  <UserX className="w-3.5 h-3.5" />
                  Reject
                </button>
              </>
            )}
            
            {type === 'sent' && request.status === 'pending' && (
              <button
                onClick={onCancel}
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
              {membership.plan && (
                <div className="bg-purple-500/10 text-purple-400 text-xs font-medium px-2.5 py-1 rounded-full border border-purple-500/30">
                  {membership.plan}
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
            
            {membership.plan && (
              <button
                onClick={() => onUpdatePlan(membership.id_academie)}
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

export default ProfilePage;

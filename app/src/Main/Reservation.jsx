import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Buttons from "../Component/Reservations/buttons";
import Tableau from "../Component/Reservations/table";
import background from "../img/background1.png";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, LogIn } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import terrainService from "../lib/services/user/terrainServices";
import adminReservationService from "../lib/services/admin/reservationServices";

// Create a cache for terrain data to prevent repeated API calls
const terrainCache = new Map();

export default function Reservations() {
  const [selectedTerrain, setSelectedTerrain] = useState(null);
  const [loading, setLoading] = useState(false);
  const userId = sessionStorage.getItem("userId");
  const userName = sessionStorage.getItem("nom") || sessionStorage.getItem("name");
  const isLoggedIn = !!userId;
  const isAdmin = sessionStorage.getItem("type") === "admin";
  const navigate = useNavigate();
  const location = useLocation();
  
  // New states for admin dashboard
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [usersExceedingLimits, setUsersExceedingLimits] = useState([]);
  const [expiredReservations, setExpiredReservations] = useState([]);
  const [loadingStats, setLoadingStats] = useState(false);
  const [reservationStats, setReservationStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    expired: 0
  });
  
  // Use a ref to track API call status
  const apiCallInProgressRef = useRef(false);
  const initialLoadCompletedRef = useRef(false);
  
  // Get terrain from location state if available
  useEffect(() => {
    // Skip if we've already loaded a terrain or if an API call is in progress
    if (initialLoadCompletedRef.current || apiCallInProgressRef.current) {
      return;
    }
    
    const loadTerrain = async () => {
      // Set API call status
      apiCallInProgressRef.current = true;
      
      // Check for terrain in location state first
      const terrainFromState = location.state?.selectedTerrainId;
      const terrainNameFromState = location.state?.selectedTerrainName;
      
      // Try session storage as fallback
      const storedTerrainId = sessionStorage.getItem("selectedTerrainId");
      
      if (terrainFromState || storedTerrainId) {
        setLoading(true);
        try {
          // Get terrain ID
          const id = terrainFromState || storedTerrainId;
          
          // Check cache first
          if (terrainCache.has(id)) {
            console.log("Using cached terrain data for ID:", id);
            setSelectedTerrain(terrainCache.get(id));
          } else {
            // Only make API call if not in cache
            console.log("Fetching terrain data for ID:", id);
            const response = await terrainService.getTerrain(id);
            
            if (response.data) {
              // Store in cache
              terrainCache.set(id, response.data);
              setSelectedTerrain(response.data);
            } else {
              // Fallback to basic info
              const fallbackData = {
                id_terrain: id,
                nom_terrain: terrainNameFromState || sessionStorage.getItem("selectedTerrainName") || `Terrain ${id}`
              };
              terrainCache.set(id, fallbackData);
              setSelectedTerrain(fallbackData);
            }
          }
          
          // If we got the terrain from location state, store in session for persistence
          if (terrainFromState && !storedTerrainId) {
            try {
              sessionStorage.setItem("selectedTerrainId", terrainFromState);
              sessionStorage.setItem("selectedTerrainName", terrainNameFromState);
            } catch (error) {
              console.warn("Could not access sessionStorage", error);
            }
          }
        } catch (error) {
          console.error("Error loading terrain details:", error);
          // Fallback to basic info
          const fallbackData = {
            id_terrain: terrainFromState || storedTerrainId,
            nom_terrain: terrainNameFromState || sessionStorage.getItem("selectedTerrainName") || `Terrain ${terrainFromState || storedTerrainId}`
          };
          terrainCache.set(terrainFromState || storedTerrainId, fallbackData);
          setSelectedTerrain(fallbackData);
        } finally {
          setLoading(false);
          initialLoadCompletedRef.current = true;
          apiCallInProgressRef.current = false;
        }
      } else {
        initialLoadCompletedRef.current = true;
        apiCallInProgressRef.current = false;
      }
    };
    
    loadTerrain();
  }, [location]);

  const handleTerrainChange = (terrain) => {
    console.log("Terrain selected:", terrain);
    
    // Only update if it's a different terrain to avoid re-rendering
    if (!selectedTerrain || selectedTerrain.id_terrain !== terrain.id_terrain) {
      // Store in cache to prevent future API calls
      terrainCache.set(terrain.id_terrain, terrain);
      setSelectedTerrain(terrain);
      
      // Also update session storage if available
      try {
        sessionStorage.setItem("selectedTerrainId", terrain.id_terrain);
        sessionStorage.setItem("selectedTerrainName", terrain.nom_terrain);
      } catch (error) {
        console.warn("Could not access sessionStorage", error);
      }
    }
  };

  // Redirect to login
  const handleLoginRedirect = () => {
    sessionStorage.setItem("redirectAfterLogin", "/reservation");
    navigate("/login");
  };

  // Add function to fetch admin dashboard data
  const fetchAdminDashboardData = async () => {
    if (!isAdmin) return;
    
    setLoadingStats(true);
    try {
      // Get all reservations
      const reservationsResponse = await adminReservationService.getAllReservations({
        per_page: 1000 // Get a large number to analyze
      });
      
      if (reservationsResponse.status === "success" && Array.isArray(reservationsResponse.data)) {
        const allReservations = reservationsResponse.data;
        
        // Process reservations to find expired ones
        const now = new Date();
        const expiredPendingReservations = allReservations.filter(res => {
          if (res.etat !== "en attente") return false;
          
          const createdAt = new Date(res.created_at);
          const diffMinutes = Math.floor((now - createdAt) / (1000 * 60));
          return diffMinutes >= 60; // Expired after 60 minutes
        });
        
        setExpiredReservations(expiredPendingReservations);
        
        // Calculate stats
        const stats = {
          total: allReservations.length,
          pending: allReservations.filter(res => res.etat === "en attente").length,
          confirmed: allReservations.filter(res => res.etat === "confirmed").length,
          expired: expiredPendingReservations.length
        };
        
        setReservationStats(stats);
        
        // Find users exceeding daily limits
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const reservationsByUser = {};
        
        allReservations.forEach(res => {
          if (res.date === today && (res.etat === "confirmed" || res.etat === "en attente")) {
            const clientId = res.client?.id_client || res.id_client;
            if (!clientId) return;
            
            if (!reservationsByUser[clientId]) {
              reservationsByUser[clientId] = {
                count: 0,
                name: res.client?.nom || res.Name || `Client ${clientId}`,
                id: clientId,
                reservations: []
              };
            }
            
            reservationsByUser[clientId].count++;
            reservationsByUser[clientId].reservations.push(res);
          }
        });
        
        // Filter users with more than 2 reservations
        const usersOverLimit = Object.values(reservationsByUser)
          .filter(user => user.count > 2)
          .sort((a, b) => b.count - a.count);
        
        setUsersExceedingLimits(usersOverLimit);
      }
    } catch (error) {
      console.error("Error fetching admin dashboard data:", error);
    } finally {
      setLoadingStats(false);
    }
  };
  
  // Fetch admin dashboard data when component mounts
  useEffect(() => {
    if (isAdmin) {
      fetchAdminDashboardData();
      
      // Set up interval to refresh data every 5 minutes
      const intervalId = setInterval(fetchAdminDashboardData, 300000);
      
      return () => clearInterval(intervalId);
    }
  }, [isAdmin]);
  
  // Add function to handle expired reservation cleanup
  const handleCleanupExpiredReservations = async () => {
    if (!isAdmin || expiredReservations.length === 0) return;
    
    setLoadingStats(true);
    try {
      // Update status of all expired reservations
      const promises = expiredReservations.map(res => 
        adminReservationService.invalidateReservation(res.id_reservation, { 
          etat: "expired"
        })
      );
      
      await Promise.all(promises);
      
      // Refresh data
      fetchAdminDashboardData();
      
      // Refresh the reservation table
      const event = new CustomEvent('reservationSuccess');
      document.dispatchEvent(event);
    } catch (error) {
      console.error("Error cleaning up expired reservations:", error);
    } finally {
      setLoadingStats(false);
    }
  };
  
  // Add function to handle user limit exception
  const handleAddUserException = async (userId) => {
    if (!isAdmin) return;
    
    // This would typically call an API to add an exception for this user
    // For now, we'll just log it
    console.log("Adding reservation limit exception for user:", userId);
    
    // In a real implementation, you would call something like:
    // await adminService.addUserReservationException(userId);
    
    // Then refresh the data
    fetchAdminDashboardData();
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-cover bg-center py-6 px-2 sm:py-12 sm:px-4"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-white mb-6 sm:mb-12 relative">
          Book Your Terrain
          <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-green-400"></span>
        </h1>
        
        {/* Admin Dashboard Section */}
        {isAdmin && (
          <div className="mb-8">
            <div className="bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg mb-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Admin Dashboard</h2>
                <button 
                  onClick={() => setShowAdminDashboard(!showAdminDashboard)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm"
                >
                  {showAdminDashboard ? "Hide Dashboard" : "Show Dashboard"}
                </button>
              </div>
              
              {/* Reservation Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                <div className="bg-gray-700/60 p-3 rounded-lg">
                  <p className="text-xs text-gray-400">Total Reservations</p>
                  <p className="text-2xl font-bold text-white">{reservationStats.total}</p>
                </div>
                <div className="bg-yellow-500/20 p-3 rounded-lg">
                  <p className="text-xs text-yellow-400">Pending</p>
                  <p className="text-2xl font-bold text-white">{reservationStats.pending}</p>
                </div>
                <div className="bg-blue-500/20 p-3 rounded-lg">
                  <p className="text-xs text-blue-400">Confirmed</p>
                  <p className="text-2xl font-bold text-white">{reservationStats.confirmed}</p>
                </div>
                <div className="bg-red-500/20 p-3 rounded-lg">
                  <p className="text-xs text-red-400">Expired</p>
                  <p className="text-2xl font-bold text-white">{reservationStats.expired}</p>
                </div>
              </div>
            </div>
            
            {showAdminDashboard && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                {/* Users Exceeding Daily Limits */}
                <div className="bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-3">Users Exceeding Daily Limits</h3>
                  
                  {loadingStats ? (
                    <div className="flex justify-center p-4">
                      <div className="animate-spin h-8 w-8 border-2 border-green-500 border-t-transparent rounded-full"></div>
                    </div>
                  ) : usersExceedingLimits.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-700/50 text-left">
                            <th className="p-2 rounded-tl-lg">User</th>
                            <th className="p-2">Reservations</th>
                            <th className="p-2 rounded-tr-lg">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {usersExceedingLimits.map((user, index) => (
                            <tr key={user.id} className={index % 2 === 0 ? "bg-gray-700/20" : "bg-gray-700/30"}>
                              <td className="p-2">{user.name}</td>
                              <td className="p-2">{user.count}</td>
                              <td className="p-2">
                                <button
                                  onClick={() => handleAddUserException(user.id)}
                                  className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded"
                                >
                                  Add Exception
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center p-4">No users exceeding daily limits</p>
                  )}
                </div>
                
                {/* Expired Reservations */}
                <div className="bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-white">Expired Reservations</h3>
                    
                    {expiredReservations.length > 0 && (
                      <button
                        onClick={handleCleanupExpiredReservations}
                        disabled={loadingStats}
                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg flex items-center gap-1"
                      >
                        {loadingStats ? (
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        ) : (
                          <>Clean Up ({expiredReservations.length})</>
                        )}
                      </button>
                    )}
                  </div>
                  
                  {loadingStats ? (
                    <div className="flex justify-center p-4">
                      <div className="animate-spin h-8 w-8 border-2 border-green-500 border-t-transparent rounded-full"></div>
                    </div>
                  ) : expiredReservations.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-700/50 text-left">
                            <th className="p-2 rounded-tl-lg">Client</th>
                            <th className="p-2">Date</th>
                            <th className="p-2">Time</th>
                            <th className="p-2">Terrain</th>
                            <th className="p-2 rounded-tr-lg">Created At</th>
                          </tr>
                        </thead>
                        <tbody>
                          {expiredReservations.slice(0, 5).map((res, index) => (
                            <tr key={res.id_reservation} className={index % 2 === 0 ? "bg-gray-700/20" : "bg-gray-700/30"}>
                              <td className="p-2">{res.client?.nom || res.Name || "Guest"}</td>
                              <td className="p-2">{res.date}</td>
                              <td className="p-2">{res.heure}</td>
                              <td className="p-2">{res.terrain?.nom_terrain || `Terrain ${res.id_terrain}`}</td>
                              <td className="p-2">{new Date(res.created_at).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      
                      {expiredReservations.length > 5 && (
                        <p className="text-gray-400 text-right text-xs mt-2">
                          Showing 5 of {expiredReservations.length} expired reservations
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center p-4">No expired reservations</p>
                  )}
                </div>
                
                {/* Reservation Limits Management */}
                <div className="bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-3">Reservation Limits Management</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-700/30 p-3 rounded-lg">
                      <h4 className="font-medium text-white mb-2">Current Settings</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Max daily reservations per user:</span>
                          <span className="text-white font-medium">2</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Reservation expiration time:</span>
                          <span className="text-white font-medium">60 minutes</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Admin override:</span>
                          <span className="text-green-400 font-medium">Enabled</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-700/30 p-3 rounded-lg">
                      <h4 className="font-medium text-white mb-2">Quick Actions</h4>
                      <div className="space-y-2">
                        <button className="w-full p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm">
                          Manage User Exceptions
                        </button>
                        <button className="w-full p-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm">
                          Configure Reservation Settings
                        </button>
                        <button 
                          onClick={fetchAdminDashboardData}
                          className="w-full p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm flex items-center justify-center gap-2"
                        >
                          {loadingStats ? (
                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                          ) : "Refresh Dashboard Data"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
        
        {/* Welcome message for all users */}
        <div className="bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg mb-8 text-white">
          <h2 className="text-xl font-semibold mb-2">
            {isLoggedIn ? `Welcome, ${userName}!` : "Welcome to our Reservation System"}
          </h2>
          <p className="text-gray-300">Select a terrain and time slot to make your reservation.</p>
        </div>

        {/* Show notification if terrain was pre-selected */}
        {selectedTerrain && !loading && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-500/20 backdrop-blur-sm border border-green-500/30 p-4 rounded-lg mb-8"
          >
            <p className="text-green-400 flex items-center">
              <MapPin size={18} className="mr-2" />
              <span className="font-medium">
                You've selected <strong>{selectedTerrain.nom_terrain}</strong>. You can choose a different terrain below.
              </span>
            </p>
          </motion.div>
        )}
        
        {/* Terrain selection buttons */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Select a Terrain</h2>
          <Buttons onChange={handleTerrainChange} selectedTerrainId={selectedTerrain?.id_terrain} />
        </div>
        
        {/* Reservation table */}
        <div className="bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Available Time Slots</h2>
          <Tableau terrain={selectedTerrain} />
        </div>
        
        {/* Instructions */}
        <div className="mt-8 bg-gray-800/80 backdrop-blur-sm p-4 rounded-lg text-white">
          <h3 className="text-lg font-semibold mb-2">How to Book</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-center">
              <MapPin size={18} className="mr-2 text-green-400" />
              Select your preferred terrain from the options above
            </li>
            <li className="flex items-center">
              <Calendar size={18} className="mr-2 text-green-400" />
              Choose an available date and time slot from the calendar
            </li>
            <li className="flex items-center">
              <Clock size={18} className="mr-2 text-green-400" />
              Confirm your booking details and submit
            </li>
          </ul>
        </div>
      </div>
    </motion.section>
  );
}

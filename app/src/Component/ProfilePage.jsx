// src/App.js
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Edit, Save, Trash, User, X, Check } from "lucide-react";
import playerRequestsService from "../lib/services/user/playerRequestsService";

export const ProfilePage = () => {
  
  const [user, setUser] = useState({
    nom: "John",
    prenom: "Doe",
    age: 30,
    email: "john.doe@example.com",
    password: "password123",
    telephone: "123-456-7890",
  });

  // Add sample player data with requests for testing
  const [playerInfo, setPlayerInfo] = useState({
    id_player: 4,
    position: "Defender",
    rating: 4,
    sent_requests: [
      {
        id_request: 1,
        sender: 4,
        receiver: 6,
        match_date: "2025-05-11T00:00:00.000000Z",
        starting_time: "2025-05-10T14:00:00.000000Z",
        message: "Would you like to play a match?",
        created_at: "2025-05-10T14:37:24.000000Z",
        updated_at: "2025-05-10T20:32:01.000000Z",
        team_id: null,
        request_type: "match",
        status: "accepted",
        expires_at: "2025-05-11T14:37:24.000000Z"
      }
    ],
    received_requests: []
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // Add state for active tab

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log("Profile updated:", user);
  };

  // Delete account
  const handleDelete = () => {
    // Here you would typically send a request to delete the account
    setUser({
      nom: "",
      prenom: "",
      age: "",
      email: "",
      password: "",
      telephone: "",
    });
    console.log("Account deleted");
  };

  // Function to add a test request
  const addTestRequest = async () => {
    try {
      const newRequest = {
        // No need to provide sender ID, it will be retrieved from session storage
        receiver_id: 5, // Some other player ID
        match_date: new Date().toISOString().split('T')[0],
        starting_time: "15:00:00",
        message: "Test request - would you like to play?",
        request_type: "match"
      };
      
      console.log("Creating test request:", newRequest);
      
      // Create the request
      const response = await playerRequestsService.createPlayerRequest(newRequest);
      console.log("Request created:", response);
      
      // Add the new request to the sent requests
      if (response && response.data) {
        setPlayerInfo(prev => ({
          ...prev,
          sent_requests: [...prev.sent_requests, response.data]
        }));
      }
    } catch (error) {
      console.error("Error creating test request:", error);
      alert("Error creating request: " + error.message);
    }
  };

  // Function to display the current player info for debugging
  const showDebugInfo = () => {
    console.log("Current player info:", playerInfo);
    alert(JSON.stringify(playerInfo, null, 2));
  };

  // Function to fetch player requests
  const fetchPlayerRequests = async () => {
    try {
      // First, check if we have the data in playerInfo already
      if (playerInfo && (playerInfo.sent_requests?.length > 0 || playerInfo.received_requests?.length > 0)) {
        console.log("Using existing player requests data:", playerInfo);
        return; // We already have the data
      }
      
      // Get player ID from session storage
      const playerId = sessionStorage.getItem('player_id');
      
      if (!playerId) {
        console.error("No player ID found in session storage");
        // If no player ID in session storage, use the hardcoded data
        console.log("Using hardcoded player data");
        return;
      }
      
      console.log("Fetching player requests for player ID:", playerId);
      
      // Call the API to get player requests
      const response = await playerRequestsService.getPlayerRequests();
      console.log("Player requests fetched:", response);
      
      // Update player info with fetched requests
      if (response && response.data) {
        setPlayerInfo(prev => ({
          ...prev,
          sent_requests: response.data.sent_requests || [],
          received_requests: response.data.received_requests || []
        }));
      }
    } catch (error) {
      console.error("Error fetching player requests:", error);
      // If there's an error, we'll just use the hardcoded data
      console.log("Using hardcoded player data due to error");
    }
  };
  
  // Call fetchPlayerRequests when the component mounts
  useEffect(() => {
    fetchPlayerRequests();
  }, []);

  // Add this function at the beginning of the component to force set the sample data
  useEffect(() => {
    // Force set the sample data to ensure we have requests to display
    console.log("Setting sample player data with requests");
    setPlayerInfo({
      id_player: 4,
      position: "Defender",
      rating: 4,
      sent_requests: [
        {
          id_request: 1,
          sender: 4,
          receiver: 6,
          match_date: "2025-05-11T00:00:00.000000Z",
          starting_time: "2025-05-10T14:00:00.000000Z",
          message: "Would you like to play a match?",
          created_at: "2025-05-10T14:37:24.000000Z",
          updated_at: "2025-05-10T20:32:01.000000Z",
          team_id: null,
          request_type: "match",
          status: "accepted",
          expires_at: "2025-05-11T14:37:24.000000Z"
        }
      ],
      received_requests: []
    });
    
    // Set the active tab to requests to show them immediately
    setActiveTab('requests');
  }, []);

  const RequestsTab = ({ playerInfo }) => {
    const [sentRequests, setSentRequests] = useState([]);
    const [receivedRequests, setReceivedRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Directly log the playerInfo prop
    console.log("RequestsTab received playerInfo:", playerInfo);

    useEffect(() => {
      if (playerInfo) {
        console.log("Player info received in RequestsTab:", playerInfo);
        
        // Get requests from player info
        if (playerInfo.sent_requests) {
          console.log("Setting sent requests:", playerInfo.sent_requests);
          setSentRequests([...playerInfo.sent_requests]); // Create a new array to ensure state update
        } else {
          console.log("No sent_requests in playerInfo");
        }
        
        if (playerInfo.received_requests) {
          console.log("Setting received requests:", playerInfo.received_requests);
          setReceivedRequests([...playerInfo.received_requests]); // Create a new array to ensure state update
        } else {
          console.log("No received_requests in playerInfo");
        }
      } else {
        console.log("No playerInfo provided to RequestsTab");
      }
    }, [playerInfo]);

    // Log state updates
    useEffect(() => {
      console.log("sentRequests state updated:", sentRequests);
    }, [sentRequests]);

    useEffect(() => {
      console.log("receivedRequests state updated:", receivedRequests);
    }, [receivedRequests]);

    const handleDeleteRequest = async (requestId) => {
      try {
        setLoading(true);
        await playerRequestsService.deletePlayerRequest(requestId);
        // Remove the deleted request from the list
        setSentRequests(prev => prev.filter(req => req.id_request !== requestId));
        setReceivedRequests(prev => prev.filter(req => req.id_request !== requestId));
      } catch (error) {
        setError('Failed to delete request: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    const handleAcceptRequest = async (requestId) => {
      try {
        setLoading(true);
        await playerRequestsService.updateRequestStatus(requestId, 'accepted');
        // Update the request status in the list
        setReceivedRequests(prev => prev.map(req => 
          req.id_request === requestId ? { ...req, status: 'accepted' } : req
        ));
      } catch (error) {
        setError('Failed to accept request: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    const handleRejectRequest = async (requestId) => {
      try {
        setLoading(true);
        await playerRequestsService.updateRequestStatus(requestId, 'rejected');
        // Update the request status in the list
        setReceivedRequests(prev => prev.map(req => 
          req.id_request === requestId ? { ...req, status: 'rejected' } : req
        ));
      } catch (error) {
        setError('Failed to reject request: ' + error.message);
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

    // Debug function to display raw request data
    const displayRawData = () => {
      console.log("Raw sent requests:", sentRequests);
      console.log("Raw received requests:", receivedRequests);
      alert(`Sent requests: ${JSON.stringify(sentRequests)}\n\nReceived requests: ${JSON.stringify(receivedRequests)}`);
    };
    
    // Function to manually add a request to the state
    const addManualRequest = () => {
      const newRequest = {
        id_request: Date.now(), // Use timestamp as a unique ID
        sender: 4,
        receiver: 6,
        match_date: new Date().toISOString(),
        starting_time: new Date().toISOString(),
        message: "Manual test request added at " + new Date().toLocaleTimeString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        team_id: null,
        request_type: "match",
        status: "pending",
        expires_at: new Date(Date.now() + 24*60*60*1000).toISOString()
      };
      
      console.log("Adding manual request:", newRequest);
      setSentRequests(prev => [...prev, newRequest]);
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

        {/* Debug button */}
        <div className="flex justify-end gap-2">
          <button
            onClick={addManualRequest}
            className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm"
          >
            Add Manual Request
          </button>
          <button
            onClick={displayRawData}
            className="bg-purple-500 text-white px-3 py-1 rounded-lg text-sm"
          >
            Show Raw Data
          </button>
        </div>
        
        {/* Simple direct display */}
        <div className="bg-red-500/20 p-4 rounded-lg mb-4 border border-red-500/40">
          <h3 className="text-white font-bold mb-2">SIMPLE DIRECT DISPLAY:</h3>
          <p className="text-white">Sent Requests Count: {sentRequests?.length || 0}</p>
          {sentRequests && sentRequests.length > 0 && (
            <>
              <p className="text-white mt-2">First Request:</p>
              <ul className="list-disc pl-5 text-white">
                <li>ID: {sentRequests[0].id_request}</li>
                <li>Status: {sentRequests[0].status}</li>
                <li>Message: {sentRequests[0].message}</li>
              </ul>
            </>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Sent Requests ({sentRequests.length})</h3>
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
                      <p className="text-sm text-gray-300">Request ID: {request.id_request}</p>
                      <p className="text-sm text-gray-300">Match Date: {formatDate(request.match_date)}</p>
                      <p className="text-sm text-gray-300">Starting Time: {formatTime(request.starting_time)}</p>
                      <p className="text-sm text-gray-300 mt-2">{request.message}</p>
                      <p className="text-xs text-gray-500 mt-2">Expires: {formatDate(request.expires_at)}</p>
                    </div>
                    {request.status === 'pending' && (
                      <button
                        onClick={() => handleDeleteRequest(request.id_request)}
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
          <h3 className="text-lg font-semibold mb-4">Received Requests ({receivedRequests.length})</h3>
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
                      <p className="text-sm text-gray-300">Request ID: {request.id_request}</p>
                      <p className="text-sm text-gray-300">Match Date: {formatDate(request.match_date)}</p>
                      <p className="text-sm text-gray-300">Starting Time: {formatTime(request.starting_time)}</p>
                      <p className="text-sm text-gray-300 mt-2">{request.message}</p>
                      <p className="text-xs text-gray-500 mt-2">Expires: {formatDate(request.expires_at)}</p>
                    </div>
                    {request.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAcceptRequest(request.id_request)}
                          disabled={loading}
                          className="text-green-400 hover:text-green-300 transition-colors"
                        >
                          <Check className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleRejectRequest(request.id_request)}
                          disabled={loading}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    )}
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-gray text-light-gray">
      <motion.div
        className="bg-medium-gray p-8 rounded-lg shadow-lg w-full max-w-4xl"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header with tabs */}
        <div className="flex flex-col mb-6">
          <h1 className="text-2xl font-bold text-bright-green mb-4">My Profile</h1>
          <div className="flex border-b border-gray-700">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`py-2 px-4 ${activeTab === 'profile' ? 'text-bright-green border-b-2 border-bright-green' : 'text-gray-400'}`}
            >
              Profile
            </button>
            <button 
              onClick={() => setActiveTab('requests')}
              className={`py-2 px-4 ${activeTab === 'requests' ? 'text-bright-green border-b-2 border-bright-green' : 'text-gray-400'}`}
            >
              Requests
            </button>
          </div>
        </div>

        {activeTab === 'profile' && (
          <>
            {/* Profile Fields */}
            <div className="space-y-4">
              {/* Nom */}
              <div className="flex items-center space-x-4">
                <User size={24} className="text-custom-green" />
                <div className="flex-1">
                  <label className="block text-sm text-light-gray">Nom</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="nom"
                      value={user.nom}
                      onChange={handleChange}
                      className="w-full bg-dark-gray text-light-gray rounded p-2"
                    />
                  ) : (
                    <p className="text-light-gray">{user.nom}</p>
                  )}
                </div>
              </div>

              {/* Prenom */}
              <div className="flex items-center space-x-4">
                <User size={24} className="text-custom-green" />
                <div className="flex-1">
                  <label className="block text-sm text-light-gray">Prenom</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="prenom"
                      value={user.prenom}
                      onChange={handleChange}
                      className="w-full bg-dark-gray text-light-gray rounded p-2"
                    />
                  ) : (
                    <p className="text-light-gray">{user.prenom}</p>
                  )}
                </div>
              </div>

              {/* Age */}
              <div className="flex items-center space-x-4">
                <User size={24} className="text-custom-green" />
                <div className="flex-1">
                  <label className="block text-sm text-light-gray">Age</label>
                  {isEditing ? (
                    <input
                      type="number"
                      name="age"
                      value={user.age}
                      onChange={handleChange}
                      className="w-full bg-dark-gray text-light-gray rounded p-2"
                    />
                  ) : (
                    <p className="text-light-gray">{user.age}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center space-x-4">
                <User size={24} className="text-custom-green" />
                <div className="flex-1">
                  <label className="block text-sm text-light-gray">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={user.email}
                      onChange={handleChange}
                      className="w-full bg-dark-gray text-light-gray rounded p-2"
                    />
                  ) : (
                    <p className="text-light-gray">{user.email}</p>
                  )}
                </div>
              </div>

              {/* Telephone */}
              <div className="flex items-center space-x-4">
                <User size={24} className="text-custom-green" />
                <div className="flex-1">
                  <label className="block text-sm text-light-gray">Telephone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="telephone"
                      value={user.telephone}
                      onChange={handleChange}
                      className="w-full bg-dark-gray text-light-gray rounded p-2"
                    />
                  ) : (
                    <p className="text-light-gray">{user.telephone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-between">
              {isEditing ? (
                <button
                  onClick={handleSave}
                  className="flex items-center justify-center space-x-2 bg-bright-green text-black rounded-lg p-2 hover:bg-green-600 transition-colors"
                >
                  <Save size={18} />
                  <span>Save Changes</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center justify-center space-x-2 bg-bright-green text-black rounded-lg p-2 hover:bg-green-600 transition-colors"
                >
                  <Edit size={18} />
                  <span>Edit Profile</span>
                </button>
              )}

              <button
                onClick={handleDelete}
                className="flex items-center justify-center space-x-2 bg-red-500 text-white rounded-lg p-2 hover:bg-red-600 transition-colors"
              >
                <Trash size={18} />
                <span>Delete Account</span>
              </button>
            </div>
          </>
        )}

        {activeTab === 'requests' && (
          <div>
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-bright-green">Player Requests</h2>
              <div className="flex gap-2">
                <button 
                  onClick={showDebugInfo}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Debug Info
                </button>
                <button 
                  onClick={addTestRequest}
                  className="bg-bright-green text-black px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  Add Test Request
                </button>
              </div>
            </div>
            
            {/* Debug information */}
            <div className="mb-4 p-4 bg-gray-800 rounded-lg">
              <h3 className="text-white font-medium mb-2">Debug Information:</h3>
              <p className="text-gray-300">Player ID: {playerInfo?.id_player || 'Not set'}</p>
              <p className="text-gray-300">Sent Requests: {playerInfo?.sent_requests?.length || 0}</p>
              <p className="text-gray-300">Received Requests: {playerInfo?.received_requests?.length || 0}</p>
              {playerInfo?.sent_requests?.length > 0 && (
                <div className="mt-2">
                  <p className="text-gray-300">First sent request ID: {playerInfo.sent_requests[0].id_request}</p>
                  <p className="text-gray-300">First sent request status: {playerInfo.sent_requests[0].status}</p>
                </div>
              )}
            </div>
            
            {/* Direct display of requests for debugging */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 text-white">Direct Display of Requests:</h3>
              
              <div className="bg-gray-800/50 p-4 rounded-lg mb-4">
                <h4 className="text-white font-medium mb-2">Sent Requests (Raw Data):</h4>
                {playerInfo?.sent_requests?.length > 0 ? (
                  <pre className="bg-gray-900 p-3 rounded text-xs text-gray-300 overflow-x-auto">
                    {JSON.stringify(playerInfo.sent_requests, null, 2)}
                  </pre>
                ) : (
                  <p className="text-gray-400">No sent requests data</p>
                )}
              </div>
              
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h4 className="text-white font-medium mb-2">Received Requests (Raw Data):</h4>
                {playerInfo?.received_requests?.length > 0 ? (
                  <pre className="bg-gray-900 p-3 rounded text-xs text-gray-300 overflow-x-auto">
                    {JSON.stringify(playerInfo.received_requests, null, 2)}
                  </pre>
                ) : (
                  <p className="text-gray-400">No received requests data</p>
                )}
              </div>
            </div>
            
            <RequestsTab playerInfo={playerInfo} />
          </div>
        )}
      </motion.div>
    </div>
  );
};


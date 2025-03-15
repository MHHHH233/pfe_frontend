import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, Filter, X, Calendar, Clock, UserPlus, Users, Trophy, ChevronDown, Play, Pause } from 'lucide-react';
import NavBar from '../Component/NavBar';


const players = [
  { id: 1, name: 'John Doe', position: 'Forward', rating: 4.8, image: 'https://discuss.cakewalk.com/uploads/monthly_2024_03/imported-photo-22646.thumb.jpeg.34bfea5fe763a56356574f4c413f0f17.jpeg' },
  { id: 2, name: 'Jane Smith', position: 'Midfielder', rating: 4.7, image: 'https://discuss.cakewalk.com/uploads/monthly_2024_03/imported-photo-22646.thumb.jpeg.34bfea5fe763a56356574f4c413f0f17.jpeg' },
  { id: 3, name: 'Mike Johnson', position: 'Defender', rating: 4.9, image: 'https://discuss.cakewalk.com/uploads/monthly_2024_03/imported-photo-22646.thumb.jpeg.34bfea5fe763a56356574f4c413f0f17.jpeg' },
  { id: 4, name: 'Sarah Williams', position: 'Goalkeeper', rating: 4.6, image: 'https://discuss.cakewalk.com/uploads/monthly_2024_03/imported-photo-22646.thumb.jpeg.34bfea5fe763a56356574f4c413f0f17.jpeg' },
  { id: 5, name: 'David Brown', position: 'Forward', rating: 4.5, image: 'https://discuss.cakewalk.com/uploads/monthly_2024_03/imported-photo-22646.thumb.jpeg.34bfea5fe763a56356574f4c413f0f17.jpeg' },
];

const teams = [
  { id: 1, name: 'Thunderbolts FC', rating: 4.9, image: 'https://discuss.cakewalk.com/uploads/monthly_2024_03/imported-photo-22646.thumb.jpeg.34bfea5fe763a56356574f4c413f0f17.jpeg' },
  { id: 2, name: 'Royal Eagles', rating: 4.8, image: 'https://discuss.cakewalk.com/uploads/monthly_2024_03/imported-photo-22646.thumb.jpeg.34bfea5fe763a56356574f4c413f0f17.jpeg' },
  { id: 3, name: 'Crimson Warriors', rating: 4.7, image: 'https://discuss.cakewalk.com/uploads/monthly_2024_03/imported-photo-22646.thumb.jpeg.34bfea5fe763a56356574f4c413f0f17.jpeg' },
  { id: 4, name: 'Emerald United', rating: 4.6, image: 'https://discuss.cakewalk.com/uploads/monthly_2024_03/imported-photo-22646.thumb.jpeg.34bfea5fe763a56356574f4c413f0f17.jpeg' },
  { id: 5, name: 'Silver Wolves', rating: 4.5, image: 'https://discuss.cakewalk.com/uploads/monthly_2024_03/imported-photo-22646.thumb.jpeg.34bfea5fe763a56356574f4c413f0f17.jpeg' },
];

const FindPlayerTeam = () => {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPosition, setFilterPosition] = useState('');
  const [activeTab, setActiveTab] = useState('players');


  const filteredPlayers = players.filter(
    (player) =>
      player.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (filterPosition === '' || player.position.toLowerCase() === filterPosition.toLowerCase())
  );

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );



  return (

    <div className="min-h-screen bg-[#1a1a1a] text-white font-sans">      
      {/* Hero Section with Video Background */}
      <section className="h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#07f468] to-[#1a1a1a] opacity-50"></div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center z-10 px-4"
        >
          <h1 className="text-6xl font-bold mb-6 leading-tight">Find Your Perfect Match</h1>
          <p className="text-xl mb-12 max-w-2xl mx-auto">Discover top players and teams to elevate your game. Join the community and take your soccer experience to the next level.</p>
          <div className="relative w-full max-w-3xl mx-auto">
            <input
              type="text"
              placeholder="Search players or teams..."
              className="w-full py-4 px-6 rounded-full bg-white bg-opacity-10 backdrop-blur-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#07f468] text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-300 w-6 h-6" />
          </div>
        </motion.div>
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <ChevronDown className="w-8 h-8 text-white" />
        </motion.div>
                     
      </section>

      {/* Top Ratings Section */}
      <section className="py-24 bg-[#222]">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">Top Rated</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-[#333] rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-semibold mb-6 flex items-center">
                <Users className="w-6 h-6 mr-2 text-[#07f468]" />
                Top Players
              </h3>
              <ul className="space-y-4">
                {players.slice(0, 5).map((player) => (
                  <li key={player.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img src={player.image} alt={player.name} className="w-10 h-10 rounded-full mr-3 object-cover" />
                      <span className="font-medium">{player.name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">{player.rating}</span>
                      <Star className="w-5 h-5 text-[#07f468]" fill="#07f468" />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[#333] rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-semibold mb-6 flex items-center">
                <Trophy className="w-6 h-6 mr-2 text-[#07f468]" />
                Top Teams
              </h3>
              <ul className="space-y-4">
                {teams.slice(0, 5).map((team) => (
                  <li key={team.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img src={team.image} alt={team.name} className="w-10 h-10 rounded-full mr-3 object-cover" />
                      <span className="font-medium">{team.name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">{team.rating}</span>
                      <Star className="w-5 h-5 text-[#07f468]" fill="#07f468" />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Players and Teams Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <h1 className='text-4xl font-bold mb-12 text-center'>Players / Teams</h1>
          <div className="flex justify-center mb-12">
            <div className="inline-flex rounded-full bg-[#333] p-1">
              <button
                className={`px-6 py-2 rounded-full ${
                  activeTab === 'players' ? 'bg-[#07f468] text-black' : 'text-white'
                } transition-colors duration-200`}
                onClick={() => setActiveTab('players')}
              >
                Players
              </button>
              <button
                className={`px-6 py-2 rounded-full ${
                  activeTab === 'teams' ? 'bg-[#07f468] text-black' : 'text-white'
                } transition-colors duration-200`}
                onClick={() => setActiveTab('teams')}
              >
                Teams
              </button>
            </div>
          </div>

          <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              className="w-full md:w-full py-3 px-4 rounded-full bg-white bg-opacity-10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#07f468]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {activeTab === 'players' && (
              <select
                className="w-full md:w-auto py-3 px-4 rounded-lg bg-white bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-[#07f468]"
                value={filterPosition}
                onChange={(e) => setFilterPosition(e.target.value)}
              >
                <option className='bg-dark-gray' value="">All Positions</option>
                <option className='bg-dark-gray' value="Forward">Forward</option>
                <option className='bg-dark-gray' value="Midfielder">Midfielder</option>
                <option className='bg-dark-gray' value="Defender">Defender</option>
                <option className='bg-dark-gray' value="Goalkeeper">Goalkeeper</option>
              </select>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeTab === 'players'
              ? filteredPlayers.map((player) => (
                  <motion.div
                    key={player.id}
                    className="bg-[#333] rounded-xl p-6 flex flex-col items-center cursor-pointer hover:bg-[#444] transition-colors"
                    onClick={() => setSelectedPlayer(player)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <img
                      src={player.image}
                      alt={player.name}
                      className="w-24 h-24 rounded-full mb-4 object-cover"
                    />
                    <h3 className="text-xl font-semibold mb-1">{player.name}</h3>
                    <p className="text-gray-300 mb-2">{player.position}</p>
                    <div className="flex items-center">
                      <span className="mr-2">{player.rating}</span>
                      <Star className="w-5 h-5 text-[#07f468]" fill="#07f468" />
                    </div>
                  </motion.div>
                ))
              : filteredTeams.map((team) => (
                  <motion.div
                    key={team.id}
                    className="bg-[#333] rounded-xl p-6 flex flex-col items-center cursor-pointer hover:bg-[#444] transition-colors"
                    onClick={() => setSelectedTeam(team)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <img
                      src={team.image}
                      alt={team.name}
                      className="w-24 h-24 rounded-full mb-4 object-cover"
                    />
                    <h3 className="text-xl font-semibold mb-2">{team.name}</h3>
                    <div className="flex items-center">
                      <span className="mr-2">{team.rating}</span>
                      <Star className="w-5 h-5 text-[#07f468]" fill="#07f468" />
                    </div>
                  </motion.div>
                ))}
          </div>
        </div>
      </section>

      {/* Add Yourself/Team Section */}
      <section className="py-24 bg-[#222]">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">Join the Community</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              className="bg-[#333] rounded-xl p-8 cursor-pointer shadow-lg"
              whileHover={{ scale: 1.05 }}              
            >
              <h3 className="text-2xl font-semibold mb-4 flex items-center">
                <UserPlus className="w-6 h-6 mr-2 text-[#07f468]" />
                Add Yourself as a Player
              </h3>
              <p className="mb-6 text-gray-300">Showcase your skills and connect with teams looking for talent.</p>
              <button className="bg-[#07f468] text-[#1a1a1a] border-none rounded-full justify-center w-full h-11 text-sm font-bold uppercase tracking-wide cursor-pointer transition-all duration-300 ease-in-out shadow-[0_4px_6px_rgba(7,_244,_104,_0.1)] hover:bg-[#06d35a] hover:translate-y-[-2px] hover:shadow-[0_6px_12px_rgba(7,_244,_104,_0.2)] active:translate-y-0 active:shadow-[0_2px_4px_rgba(7,_244,_104,_0.1)] sm:py-2 sm:px-5 sm:text-base">
                Create Player Profile
              </button>
            </motion.div>
            <motion.div
              className="bg-[#333] rounded-xl p-8 cursor-pointer shadow-lg"
              whileHover={{ scale: 1.05 }}              
            >
              <h3 className="text-2xl font-semibold mb-4 flex items-center">
                <Users className="w-6 h-6 mr-2 text-[#07f468]" />
                Register Your Team
              </h3>
              <p className="mb-6 text-gray-300">List your team and find the perfect players to complete your roster.</p>
              <button className="bg-[#07f468] text-[#1a1a1a] border-none rounded-full justify-center w-full h-11 text-sm font-bold uppercase tracking-wide 
              cursor-pointer transition-all duration-300 ease-in-out shadow-[0_4px_6px_rgba(7,_244,_104,_0.1)] hover:bg-[#06d35a] 
              hover:translate-y-[-2px] hover:shadow-[0_6px_12px_rgba(7,_244,_104,_0.2)] 
              active:translate-y-0 active:shadow-[0_2px_4px_rgba(7,_244,_104,_0.1)] sm:py-2 sm:px-5 sm:text-base">
                Register Team
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Player Profile Modal */}
      <AnimatePresence>
        {selectedPlayer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedPlayer(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-[#1a1a1a] rounded-xl p-8 max-w-2xl w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center">
                  <img
                    src={selectedPlayer.image}
                    alt={selectedPlayer.name}
                    className="w-24 h-24 rounded-full mr-6 object-cover"
                  />
                  <div>
                    <h2 className="text-3xl font-bold">{selectedPlayer.name}</h2>
                    <p className="text-xl text-gray-300">{selectedPlayer.position}</p>
                  </div>
                </div>
                <button
                  className="text-gray-400 hover:text-white"
                  onClick={() => setSelectedPlayer(null)}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Player Info</h3>
                <p className="mb-2">Rating: {selectedPlayer.rating}</p>
                <p className="mb-2">Matches Played: 150</p>
                <p className="mb-2">Goals Scored: 75</p>
                <p>Assists: 50</p>
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Player History</h3>
                <ul className="list-disc list-inside text-gray-300">
                  <li>2020-2022: Thunderbolts FC</li>
                  <li>2018-2020: Royal Eagles</li>
                  <li>2016-2018: Crimson Warriors</li>
                </ul>
              </div>
              <div className="flex justify-end">
                <button
                  className="bg-[#07f468] text-[#1a1a1a] border-none rounded-full justify-center w-56 h-11 text-sm font-bold uppercase tracking-wide 
              cursor-pointer transition-all duration-300 ease-in-out shadow-[0_4px_6px_rgba(7,_244,_104,_0.1)] hover:bg-[#06d35a] 
              hover:translate-y-[-2px] hover:shadow-[0_6px_12px_rgba(7,_244,_104,_0.2)] 
              active:translate-y-0 active:shadow-[0_2px_4px_rgba(7,_244,_104,_0.1)] sm:py-2 sm:px-5 sm:text-base"
                  onClick={() => setShowInviteForm(true)}
                >
                  Invite to Play
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invite Form Modal */}
      <AnimatePresence>
        {showInviteForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={() => setShowInviteForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-[#1a1a1a] rounded-xl p-8 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-4">Invite {selectedPlayer.name} to Play</h2>
              <form>
                <div className="mb-4">
                  <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">
                    Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="date"
                      className="w-full py-2 px-4 rounded-lg bg-white bg-opacity-10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#07f468]"
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300" />
                  </div>
                </div>
                <div className="mb-6">
                  <label htmlFor="time" className="block text-sm font-medium text-gray-300 mb-1">
                    Time
                  </label>
                  <div className="relative">
                    <input
                      type="time"
                      id="time"
                      className="w-full py-2 px-4 rounded-lg bg-white bg-opacity-10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#07f468]"
                    />
                    <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-[#07f468] text-black font-semibold py-2 px-4 rounded-lg hover:bg-[#06d35a] transition-colors"
                  >
                    Send Invite
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Team Profile Modal */}
      <AnimatePresence>
        {selectedTeam && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedTeam(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-[#1a1a1a] rounded-xl p-8 max-w-2xl w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center">
                  <img
                    src={selectedTeam.image}
                    alt={selectedTeam.name}
                    className="w-24 h-24 rounded-full mr-6 object-cover"
                  />
                  <div>
                    <h2 className="text-3xl font-bold">{selectedTeam.name}</h2>
                    <p className="text-xl text-gray-300">Rating: {selectedTeam.rating}</p>
                  </div>
                </div>
                <button
                  className="text-gray-400 hover:text-white"
                  onClick={() => setSelectedTeam(null)}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Team Info</h3>
                <p className="mb-2">Founded: 2015</p>
                <p className="mb-2">Home Stadium: Emerald Arena</p>
                <p>League: Premier Soccer League</p>
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Tournament History</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Trophy className="w-5 h-5 mr-2 text-[#07f468]" />
                    <span>2022 Premier Soccer League Champions</span>
                  </li>
                  <li className="flex items-center">
                    <Trophy className="w-5 h-5 mr-2 text-[#07f468]" />
                    <span>2021 Regional Cup Winners</span>
                  </li>
                  <li className="flex items-center">
                    <Trophy className="w-5 h-5 mr-2 text-[#07f468]" />
                    <span>2020 National Tournament Runners-up</span>
                  </li>
                </ul>
              </div>
              <div className="flex justify-end">
                <button
                  className="bg-[#07f468] text-[#1a1a1a] border-none rounded-full justify-center w-56 h-11 text-sm font-bold uppercase tracking-wide 
              cursor-pointer transition-all duration-300 ease-in-out shadow-[0_4px_6px_rgba(7,_244,_104,_0.1)] hover:bg-[#06d35a] 
              hover:translate-y-[-2px] hover:shadow-[0_6px_12px_rgba(7,_244,_104,_0.2)] 
              active:translate-y-0 active:shadow-[0_2px_4px_rgba(7,_244,_104,_0.1)] sm:py-2 sm:px-5 sm:text-base"
                  onClick={() => setShowInviteForm(true)}
                >
                  Contact Team
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FindPlayerTeam;


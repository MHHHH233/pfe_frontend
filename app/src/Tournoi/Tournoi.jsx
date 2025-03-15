'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import footbal from "../img/football-1350720_1920.webp"
import tournament1 from "../img/tournament1.webp"
import tournament2 from "../img/tournament2.webp"
import tournament3 from "../img/tournament3.webp"
import tournament4 from "../img/tournament4.webp"
import tournament5 from "../img/tournament5.webp"
import tournament6 from "../img/tournament6.webp"
import tournament7 from "../img/tournament7.webp"
import { Search, Star, Filter, X, Calendar, Clock, Trophy, ChevronDown, Users, MapPin, DollarSign, Award, ClubIcon as Soccer, LocateIcon, LocateFixed, Locate, SearchCheckIcon, UserRoundSearch } from 'lucide-react'

const tournaments = [
  { id: 1, name: 'Summer Soccer Championship', date: '2023-07-15', location: 'Central Stadium', teams: 16, prize: '10,000 DH', entryFee: '500 DH', image: tournament1 },
  { id: 2, name: 'Fall Futsal League', date: '2023-09-01', location: 'Indoor Arena', teams: 12, prize: '5,000 DH', entryFee: '300 DH', image: tournament2 },
  { id: 3, name: 'Winter Cup', date: '2023-12-10', location: 'Snow Field', teams: 8, prize: '7,500 DH', entryFee: '400 DH', image: tournament5 },
  { id: 4, name: 'Spring Kickoff Tournament', date: '2024-03-20', location: 'City Park', teams: 24, prize: '15,000 DH', entryFee: '600 DH', image: tournament7 },
  { id: 5, name: 'Youth Soccer Festival', date: '2023-08-05', location: 'Community Fields', teams: 32, prize: 'Trophies', entryFee: '200 DH', image: tournament6 },
]

const matchResults = [
  { id: 1, tournament: 'Spring Classic', teamA: 'Team Alpha', teamB: 'Team Beta', score: '3-2', date: '2023-05-15' },
  { id: 2, tournament: 'Summer Cup', teamA: 'Team Gamma', teamB: 'Team Delta', score: '2-1', date: '2023-06-22' },
  { id: 3, tournament: 'Fall Championship', teamA: 'Team Epsilon', teamB: 'Team Zeta', score: '4-3', date: '2023-09-10' },
]

const pastWinners = [
  { year: 2022, tournament: 'Annual Championship', winner: 'Team Omega', prize: '$20,000' },
  { year: 2021, tournament: 'National Cup', winner: 'Team Sigma', prize: '$15,000' },
  { year: 2020, tournament: 'Regional Trophy', winner: 'Team Phi', prize: '$10,000' },
]

function TournamentCard({ tournament, onClick }) {
  return (
    <motion.div
      className="bg-[#333] rounded-lg p-4 flex flex-col cursor-pointer hover:bg-[#444] transition-colors"
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <img
        src={tournament.image}
        alt={tournament.name}
        className="w-full h-32 object-cover rounded-md mb-3"
      />
      <h3 className="text-lg font-semibold mb-2">{tournament.name}</h3>
      <div className="flex items-center mb-1 text-sm">
        <Calendar className="w-4 h-4 mr-1 text-[#07f468]" />
        <span className="text-gray-300">{tournament.date}</span>
      </div>
      <div className="flex items-center mb-1 text-sm">
        <MapPin className="w-4 h-4 mr-1 text-[#07f468]" />
        <span className="text-gray-300">{tournament.location}</span>
      </div>
      <div className="flex items-center mb-1 text-sm">
        <Users className="w-4 h-4 mr-1 text-[#07f468]" />
        <span className="text-gray-300">{tournament.teams} teams</span>
      </div>
      <div className="flex items-center mb-1 text-sm">
        <Trophy className="w-4 h-4 mr-1 text-[#07f468]" />
        <span className="text-gray-300">Prize: {tournament.prize}</span>
      </div>
      <div className="flex items-center mt-auto text-sm">
        <DollarSign className="w-4 h-4 mr-1 text-[#07f468]" />
        <span className="text-gray-300">Entry: {tournament.entryFee}</span>
      </div>
    </motion.div>
  )
}

function TournamentModal({ tournament, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        className="bg-[#1a1a1a] rounded-lg p-6 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold">{tournament.name}</h2>
            <p className="text-lg text-gray-300">Tournament Details</p>
          </div>
          <button
            className="text-gray-400 hover:text-white"
            onClick={onClose}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <img
          src={tournament.image}
          alt={tournament.name}
          className="w-full h-48 object-cover rounded-md mb-4"
        />
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-[#07f468]" />
            <span className="text-sm">{tournament.date}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-[#07f468]" />
            <span className="text-sm">9:00 AM - 6:00 PM</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-[#07f468]" />
            <span className="text-sm">{tournament.location}</span>
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2 text-[#07f468]" />
            <span className="text-sm">{tournament.teams} teams</span>
          </div>
          <div className="flex items-center">
            <Trophy className="w-4 h-4 mr-2 text-[#07f468]" />
            <span className="text-sm">Prize: {tournament.prize}</span>
          </div>
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 mr-2 text-[#07f468]" />
            <span className="text-sm">Entry: {tournament.entryFee}</span>
          </div>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <p className="text-sm text-gray-300">
            Join us for an exciting soccer tournament featuring {tournament.teams} teams competing for glory and amazing prizes. 
            Don't miss this opportunity to showcase your skills and enjoy a day of thrilling matches!
          </p>
        </div>
        <div className="flex justify-end">
          <button
            className="bg-[#07f468] text-[#1a1a1a] border-none rounded-full px-6 py-2 text-sm font-bold uppercase tracking-wide 
            cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#06d35a] 
            hover:translate-y-[-2px] hover:shadow-[0_6px_12px_rgba(7,_244,_104,_0.2)] 
            active:translate-y-0 active:shadow-[0_2px_4px_rgba(7,_244,_104,_0.1)]"
          >
            Register Team
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

function MatchResultCard({ result }) {
  return (
    <motion.div
      className="bg-[#333] rounded-lg p-4"
      whileHover={{ scale: 1.02 }}
    >
      <h3 className="text-lg font-semibold mb-2">{result.tournament}</h3>
      <div className="flex justify-between items-center mb-2 text-sm">
        <span>{result.teamA}</span>
        <span className="text-[#07f468] font-bold">{result.score}</span>
        <span>{result.teamB}</span>
      </div>
      <div className="text-xs text-gray-400">{result.date}</div>
    </motion.div>
  )
}

function StatsCard({ icon: Icon, title, value }) {
  return (
    <div className="bg-[#333] rounded-lg p-4 flex items-center">
      <Icon className="w-8 h-8 mr-3 text-[#07f468]" />
      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  )
}

export default function TournamentPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTournament, setSelectedTournament] = useState(null)

  const filteredTournaments = tournaments.filter((tournament) =>
    tournament.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white font-sans">
      {/* Hero Section */}
      <section className="relative h-[calc(100vh-170px)] pt-20 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src={footbal}
            alt="Football field"
          />
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>
        <div className="relative z-10 text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
          >
            Discover Soccer Tournaments
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl mb-8 max-w-2xl mx-auto"
          >
            Find and join exciting soccer tournaments in your area. Compete with the best and win amazing prizes!
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative w-full max-w-md mx-auto"
          >
            <input
              type="text"
              placeholder="Search tournaments..."
              className="w-full py-3 px-4 rounded-full bg-white bg-opacity-10 backdrop-blur-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#07f468] text-sm md:text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-300 w-5 h-5" />
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-[#222]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatsCard icon={Soccer} title="Active Tournaments" value="15" />
            <StatsCard icon={Users} title="Registered Teams" value="128" />
            <StatsCard icon={Trophy} title="Total Prize Money" value="$50,000" />
            <StatsCard icon={Award} title="Champions Crowned" value="24" />
          </div>
        </div>
      </section>

      {/* Tournaments Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Upcoming Tournaments</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTournaments.map((tournament) => (
              <TournamentCard
                key={tournament.id}
                tournament={tournament}
                onClick={() => setSelectedTournament(tournament)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Match Results Section */}
      <section className="py-12 bg-[#222]">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Recent Match Results</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {matchResults.map((result) => (
              <MatchResultCard key={result.id} result={result} />
            ))}
          </div>
        </div>
      </section>

      {/* Past Winners Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Past Winners</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="bg-[#333]">
                  <th className="py-2 px-3 text-left text-sm">Year</th>
                  <th className="py-2 px-3 text-left text-sm">Tournament</th>
                  <th className="py-2 px-3 text-left text-sm">Winner</th>
                  <th className="py-2 px-3 text-left text-sm">Prize</th>
                </tr>
              </thead>
              <tbody>
                {pastWinners.map((winner, index) => (
                  <motion.tr
                    key={index}
                    className="border-b border-[#444] hover:bg-[#2a2a2a]"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <td className="py-2 px-3 text-sm">{winner.year}</td>
                    <td className="py-2 px-3 text-sm">{winner.tournament}</td>
                    <td className="py-2 px-3 text-sm">{winner.winner}</td>
                    <td className="py-2 px-3 text-sm">{winner.prize}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Create Tournament Section */}
      <section className="py-12 bg-[#222]">
  <div className="container mx-auto px-4">
    <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Organize Your Own Tournament</h2>
    <div className="flex flex-col md:flex-row gap-6 justify-center">
      {/* Reserve a Field Card */}
      <motion.div
        className="bg-[#333] rounded-lg p-6 cursor-pointer shadow-lg w-full md:max-w-md"
        whileHover={{ scale: 1.02 }}
      >
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-[#07f468]" />
          Reserver un terrain
        </h3>
        <p className="mb-6 text-sm text-gray-300">
          Set up your own soccer tournament, manage teams, and create unforgettable sporting events.
        </p>
        <button
          className="bg-[#07f468] text-[#1a1a1a] border-none rounded-full px-6 py-2 text-sm font-bold uppercase tracking-wide 
          cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#06d35a] 
          hover:translate-y-[-2px] hover:shadow-[0_6px_12px_rgba(7,_244,_104,_0.2)] 
          active:translate-y-0 active:shadow-[0_2px_4px_rgba(7,_244,_104,_0.1)] w-full"
        >
          Reserve Maintenant
        </button>
      </motion.div>

      {/* Find Players/Teams Card */}
      <motion.div
        className="bg-[#333] rounded-lg p-6 cursor-pointer shadow-lg w-full md:max-w-md"
        whileHover={{ scale: 1.02 }}
      >
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <UserRoundSearch className="w-5 h-5 mr-2 text-[#07f468]" />
          Trouver des Joueurs / Equipes
        </h3>
        <p className="mb-6 text-sm text-gray-300">
          Set up your own soccer tournament, manage teams, and create unforgettable sporting events.
        </p>
        <button
          className="bg-[#07f468] text-[#1a1a1a] border-none rounded-full px-6 py-2 text-sm font-bold uppercase tracking-wide 
          cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#06d35a] 
          hover:translate-y-[-2px] hover:shadow-[0_6px_12px_rgba(7,_244,_104,_0.2)] 
          active:translate-y-0 active:shadow-[0_2px_4px_rgba(7,_244,_104,_0.1)] w-full"
        >
          Chercher Maintenant
        </button>
      </motion.div>
    </div>
  </div>
</section>

      {/* Tournament Modal */}
      <AnimatePresence>
        {selectedTournament && (
          <TournamentModal
            tournament={selectedTournament}
            onClose={() => setSelectedTournament(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}


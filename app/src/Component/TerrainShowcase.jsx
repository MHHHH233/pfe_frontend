import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import terrainService from "../lib/services/user/terrainServices";
import { MapPin, Users, ArrowRight, Search, Filter } from "lucide-react";
import { getTerrainImageUrl, handleTerrainImageError, preloadDefaultTerrainImage } from "../utils/imageHelpers";

export default function TerrainShowcase() {
  const [terrains, setTerrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const navigate = useNavigate();

  // Preload default image on component mount
  useEffect(() => {
    preloadDefaultTerrainImage();
  }, []);

  useEffect(() => {
    const fetchTerrains = async () => {
      try {
        setLoading(true);
        const response = await terrainService.getAllTerrains();
        if (response.data) {
          // Show only up to 6 terrains
          setTerrains(response.data.slice(0, 6));
        } else {
          setError("No terrains found");
        }
      } catch (error) {
        console.error("Error fetching terrains:", error);
        setError("Failed to load terrains");
      } finally {
        setLoading(false);
      }
    };

    fetchTerrains();
  }, []);

  // Filter terrains based on search query and filter type
  const filteredTerrains = terrains.filter(terrain => {
    const nameMatch = terrain.nom_terrain.toLowerCase().includes(searchQuery.toLowerCase());
    const typeMatch = filterType ? terrain.type.toLowerCase() === filterType.toLowerCase() : true;
    return nameMatch && typeMatch;
  });

  const handleReservation = (terrain) => {
    // Store terrain data in sessionStorage for reservation page
    try {
      sessionStorage.setItem("selectedTerrainId", terrain.id_terrain);
      sessionStorage.setItem("selectedTerrainName", terrain.nom_terrain);
      sessionStorage.setItem("selectedTerrainPrice", terrain.prix || "100");
    } catch (error) {
      console.warn("Could not access sessionStorage in TerrainShowcase", error);
    }

    // Use React Router state as a backup method
    navigate("/reservation", { 
      state: { 
        selectedTerrainId: terrain.id_terrain,
        selectedTerrainName: terrain.nom_terrain,
        selectedTerrainPrice: terrain.prix
      }
    });
  };

  const goToAllTerrains = () => {
    navigate("/all-terrains");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-[#07f468] border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-medium text-[#07f468]">Loading</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-500 mb-4">{error}</p>
      </div>
    );
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-[#121212] to-[#1e1e1e] text-white font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-white">
              Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#07f468] to-[#9EF01A]">Terrains</span>
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-[#07f468] to-[#9EF01A] mt-2 rounded-full"></div>
          </motion.div>
          
          <motion.button
            onClick={goToAllTerrains}
            className="flex items-center gap-2 text-[#07f468] hover:text-[#07f468]/80 transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>View All</span>
            <ArrowRight size={16} />
          </motion.button>
        </div>

        {/* Search and Filter */}
        <div className="bg-gradient-to-r from-[#222] to-[#1A1A1A] rounded-xl p-6 mb-8 shadow-xl border border-white/5">
          <div className="flex flex-col md:flex-row items-stretch gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="text-gray-400 w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Search terrain by name..."
                className="w-full py-3 pl-12 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#07f468] focus:border-transparent transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="relative md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="text-gray-400 w-5 h-5" />
              </div>
              <select
                className="w-full py-3 pl-12 pr-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#07f468] focus:border-transparent appearance-none"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1rem' }}
              >
                <option className='bg-[#222]' value="">All Types</option>
                <option className='bg-[#222]' value="indoor">Indoor</option>
                <option className='bg-[#222]' value="outdoor">Outdoor</option>
              </select>
            </div>
          </div>
        </div>

        {filteredTerrains.length === 0 ? (
          <div className="text-center py-16 bg-white/5 rounded-xl border border-white/10">
            <Search className="w-12 h-12 mx-auto mb-4 text-gray-500" />
            <p className="text-xl font-medium text-white mb-2">No terrains found</p>
            <p className="text-base text-gray-400 mb-6 max-w-md mx-auto">We couldn't find any terrains matching your search criteria. Try adjusting your filters or check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTerrains.map((terrain, index) => (
              <motion.div
                key={terrain.id_terrain}
                className="bg-gradient-to-br from-[#222] to-[#1a1a1a] rounded-xl overflow-hidden shadow-lg border border-white/5 group hover:border-[#07f468]/30"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <div className="h-48 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent z-10"></div>
                  <img
                    src={getTerrainImageUrl(terrain.image_path)}
                    alt={terrain.nom_terrain}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={handleTerrainImageError}
                  />
                  <div className="absolute bottom-4 left-4 z-20">
                    <span className="bg-[#07f468] text-black text-sm font-bold px-3 py-1 rounded-full capitalize">
                      {terrain.type} field
                    </span>
                  </div>
                </div>
                
                <div className="p-5">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-bold text-white truncate">{terrain.nom_terrain}</h3>
                    <div className="flex items-center bg-[#07f468]/10 px-2 py-1 rounded-full">
                      <span className="font-medium text-[#07f468]">{terrain.prix} MAD/h</span>
                    </div>
                  </div>
                  
                  <div className="text-gray-400 text-sm space-y-1 mb-4">
                    <p className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-[#07f468]" />
                      <span className="capitalize">{terrain.type} field</span>
                    </p>
                    <p className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-[#07f468]" />
                      <span>Capacity: {terrain.capacite}</span>
                    </p>
                  </div>
                  
                  <motion.button
                    onClick={() => handleReservation(terrain)}
                    className="w-full py-2.5 rounded-lg bg-[#07f468] text-black text-sm font-medium hover:bg-[#07f468]/80 transition-all duration-300 flex items-center justify-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Reserve Now
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        {terrains.length > 6 && (
          <div className="mt-12 text-center">
            <motion.button
              onClick={goToAllTerrains}
              className="px-6 py-3 bg-gradient-to-r from-[#07f468] to-[#9EF01A] text-black font-medium rounded-lg inline-flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>View All Terrains</span>
              <ArrowRight size={20} />
            </motion.button>
          </div>
        )}
      </div>
    </section>
  );
} 
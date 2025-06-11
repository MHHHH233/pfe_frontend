import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import terrainService from "../lib/services/user/terrainServices";
import { MapPin, Users, ChevronLeft, ChevronRight, Filter, SortAsc, SortDesc, Search, ArrowLeft, X } from "lucide-react";
import { getTerrainImageUrl, handleTerrainImageError, preloadDefaultTerrainImage } from "../utils/imageHelpers";

export default function AllTerrains() {
  const [terrains, setTerrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("nom_terrain");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterType, setFilterType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  
  // Preload default image on component mount
  useEffect(() => {
    preloadDefaultTerrainImage();
  }, []);

  const fetchTerrains = async (page = 1, sort = sortBy, order = sortOrder, type = filterType) => {
    try {
      setLoading(true);
      const params = {
        page,
        sort_by: sort,
        sort_order: order,
        ...(type && { type })
      };
      
      const response = await terrainService.getAllTerrains(params);
      
      if (response.data) {
        setTerrains(response.data);
        setPagination({
          currentPage: response.meta?.current_page || 1,
          lastPage: response.meta?.last_page || 1,
          total: response.meta?.total || 0,
          links: response.meta?.links || []
        });
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

  useEffect(() => {
    fetchTerrains(currentPage, sortBy, sortOrder, filterType);
  }, [currentPage, sortBy, sortOrder, filterType]);
  
  // Filter terrains based on search query
  const filteredTerrains = terrains.filter(terrain => 
    terrain.nom_terrain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination?.lastPage) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
    setCurrentPage(1);
  };

  const handleReservation = (terrain) => {
    try {
      // Store all terrain data in sessionStorage
      const terrainId = terrain.id_terrain;
      const terrainName = terrain.nom_terrain;
      const terrainPrice = terrain.prix || "100";
      
      // Store in sessionStorage first
      sessionStorage.setItem("selectedTerrainId", terrainId);
      sessionStorage.setItem("selectedTerrainName", terrainName);
      sessionStorage.setItem("selectedTerrainPrice", terrainPrice);
      
      // Navigate with state as backup
      navigate("/reservation", { 
        state: { 
          selectedTerrainId: terrainId,
          selectedTerrainName: terrainName,
          selectedTerrainPrice: terrainPrice
        }
      });
    } catch (error) {
      console.error("Error in reservation process:", error);
      // Fallback direct navigation
      navigate("/reservation");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  // Generate pagination buttons
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 5;
    
    // If there's only one page, don't show pagination
    if (!pagination || pagination.lastPage <= 1) return [];
    
    // Always show first page
    buttons.push(
      <button
        key="first"
        onClick={() => handlePageChange(1)}
        className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'bg-[#07f468] text-black font-bold' : 'bg-white/10 hover:bg-white/20'}`}
      >
        1
      </button>
    );
    
    // Calculate range of visible page buttons
    let startPage = Math.max(2, currentPage - Math.floor(maxVisibleButtons / 2));
    let endPage = Math.min(pagination.lastPage - 1, startPage + maxVisibleButtons - 3);
    
    if (endPage - startPage < maxVisibleButtons - 3) {
      startPage = Math.max(2, endPage - (maxVisibleButtons - 3) + 1);
    }
    
    // Add ellipsis after first page if needed
    if (startPage > 2) {
      buttons.push(
        <span key="ellipsis1" className="px-2">
          ...
        </span>
      );
    }
    
    // Add page buttons
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded-md ${currentPage === i ? 'bg-[#07f468] text-black font-bold' : 'bg-white/10 hover:bg-white/20'}`}
        >
          {i}
        </button>
      );
    }
    
    // Add ellipsis before last page if needed
    if (endPage < pagination.lastPage - 1) {
      buttons.push(
        <span key="ellipsis2" className="px-2">
          ...
        </span>
      );
    }
    
    // Always show last page if there is more than one page
    if (pagination.lastPage > 1) {
      buttons.push(
        <button
          key="last"
          onClick={() => handlePageChange(pagination.lastPage)}
          className={`px-3 py-1 rounded-md ${currentPage === pagination.lastPage ? 'bg-[#07f468] text-black font-bold' : 'bg-white/10 hover:bg-white/20'}`}
        >
          {pagination.lastPage}
        </button>
      );
    }
    
    return buttons;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121212] to-[#1e1e1e] text-white font-sans py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            to="/" 
            className="flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-3 inline-block relative">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#07f468] to-[#9EF01A]">All Terrains</span>
            <div className="absolute -bottom-2 left-0 w-24 h-1 bg-gradient-to-r from-[#07f468] to-[#9EF01A] rounded-full"></div>
          </h1>
          <p className="text-gray-400 mt-4 max-w-2xl">
            Browse our selection of football terrains and find the perfect spot for your next match.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-gradient-to-r from-[#222] to-[#1A1A1A] rounded-xl p-6 mb-8 shadow-xl border border-white/5">
          <div className="flex flex-col md:flex-row items-stretch gap-4 mb-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="text-gray-400 w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Search terrains by name..."
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
                value={filterType}
                onChange={handleFilterChange}
                className="w-full py-3 pl-12 pr-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#07f468] focus:border-transparent appearance-none"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1rem' }}
              >
                <option className='bg-[#222]' value="">All Types</option>
                <option className='bg-[#222]' value="indoor">Indoor</option>
                <option className='bg-[#222]' value="outdoor">Outdoor</option>
              </select>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleSortChange("prix")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                sortBy === "prix" ? "bg-[#07f468] text-black font-medium" : "bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
            >
              <span>Price</span>
              {sortBy === "prix" && (
                sortOrder === "asc" ? <SortAsc size={16} /> : <SortDesc size={16} />
              )}
            </button>
            
            <button
              onClick={() => handleSortChange("nom_terrain")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                sortBy === "nom_terrain" ? "bg-[#07f468] text-black font-medium" : "bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
            >
              <span>Name</span>
              {sortBy === "nom_terrain" && (
                sortOrder === "asc" ? <SortAsc size={16} /> : <SortDesc size={16} />
              )}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-[#07f468] border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-medium text-[#07f468]">Loading</span>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-500/20 border border-red-500 text-white p-6 rounded-xl mb-8 text-center shadow-lg backdrop-blur-md">
            <X className="w-8 h-8 mx-auto mb-4 text-red-400" />
            <p className="text-lg font-medium">{error}</p>
            <p className="text-sm text-gray-300 mt-2">Please refresh the page or try again later.</p>
            <button 
              onClick={() => fetchTerrains(currentPage)}
              className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Results Count */}
        {!loading && !error && filteredTerrains.length > 0 && pagination && (
          <p className="text-gray-400 mb-6">
            Showing {filteredTerrains.length} of {pagination.total} terrains
          </p>
        )}

        {/* Empty State */}
        {!loading && filteredTerrains.length === 0 && !error && (
          <div className="text-center py-16 bg-white/5 rounded-xl border border-white/10">
            <Search className="w-12 h-12 mx-auto mb-4 text-gray-500" />
            <p className="text-xl font-medium text-white mb-2">No terrains found</p>
            <p className="text-base text-gray-400 mb-6 max-w-md mx-auto">
              We couldn't find any terrains matching your search criteria.
            </p>
            <button
              onClick={() => {
                setFilterType("");
                setSortBy("nom_terrain");
                setSortOrder("asc");
                setSearchQuery("");
                setCurrentPage(1);
              }}
              className="px-6 py-2 bg-[#07f468] hover:bg-[#07f468]/80 text-black font-medium rounded-lg transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Terrains Grid */}
        {!loading && !error && filteredTerrains.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8"
          >
            {filteredTerrains.map((terrain, index) => (
              <motion.div
                key={terrain.id_terrain}
                variants={itemVariants}
                className="bg-gradient-to-br from-[#222] to-[#1a1a1a] rounded-xl overflow-hidden shadow-lg border border-white/5 group hover:border-[#07f468]/30"
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <div className="h-48 relative overflow-hidden">
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
          </motion.div>
        )}

        {/* Pagination */}
        {pagination && pagination.lastPage > 1 && !loading && filteredTerrains.length > 0 && (
          <div className="flex justify-center items-center space-x-2 mt-10">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg ${currentPage === 1 ? 'text-gray-500 cursor-not-allowed' : 'bg-white/10 hover:bg-white/20'}`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex space-x-1">
              {renderPaginationButtons()}
            </div>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.lastPage}
              className={`p-2 rounded-lg ${currentPage === pagination.lastPage ? 'text-gray-500 cursor-not-allowed' : 'bg-white/10 hover:bg-white/20'}`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
        
        {/* Pagination info */}
        {pagination && filteredTerrains.length > 0 && !loading && (
          <div className="text-center text-gray-400 text-sm mt-4">
            Page {currentPage} of {pagination.lastPage}
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import adminTerrainService from "../../lib/services/admin/terrainServices";
import userTerrainService from "../../lib/services/user/terrainServices";

export default function Buttons({ onChange }) {
  const [selectedTerrain, setSelectedTerrain] = useState(null);
  const [terrains, setTerrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTerrains = async () => {
      try {
        setLoading(true);
        // Check if user is admin - ensure consistent check
        const isAdmin = sessionStorage.getItem("type") === "admin";
        console.log("User role in Buttons:", isAdmin ? "admin" : "user");
        
        const service = isAdmin 
          ? adminTerrainService 
          : userTerrainService;
        
        const response = await service.getAllTerrains();
        console.log("Terrain API response:", response);
        
        if (response.data) {
          setTerrains(response.data);
          console.log("Terrains loaded:", response.data);
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

  const handleButtonClick = (terrain) => {
    setSelectedTerrain(terrain.id_terrain);
    console.log("Selected terrain in Buttons:", terrain);
    
    // Store in sessionStorage for persistence
    sessionStorage.setItem("selectedTerrainId", terrain.id_terrain);
    sessionStorage.setItem("selectedTerrainName", terrain.nom_terrain);
    
    if (onChange) onChange(terrain);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="w-12 h-12 rounded-full border-4 border-green-400 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/50 p-6 rounded-xl text-center">
        <p className="text-red-400 mb-4 font-medium">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="mt-8 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:flex lg:flex-wrap lg:justify-center gap-4">
        {terrains.map((terrain) => (
          <motion.button
            key={terrain.id_terrain}
            onClick={() => handleButtonClick(terrain)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              relative w-full lg:w-auto px-6 py-3 rounded-xl font-medium
              transition-all duration-300 ease-out
              ${selectedTerrain === terrain.id_terrain
                ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25"
                : "bg-gray-800/80 hover:bg-gray-700/90 text-gray-100 backdrop-blur-sm"
              }
              group flex items-center justify-center gap-2
              focus:outline-none focus:ring-2 focus:ring-green-500/50
            `}
          >
            <span className="relative">
              {terrain.nom_terrain}
              {selectedTerrain === terrain.id_terrain && (
                <motion.span
                  layoutId="underline"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white"
                  initial={false}
                />
              )}
            </span>
          </motion.button>
        ))}
      </div>     
    </div>
  );
}


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
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500 p-4 rounded-lg text-center">
        <p className="text-red-400 mb-2">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="mt-5 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
        {terrains.map((terrain) => (
          <motion.button
            key={terrain.id_terrain}
            onClick={() => handleButtonClick(terrain)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base rounded-lg text-white font-semibold transition-all duration-300 ease-in-out ${
              selectedTerrain === terrain.id_terrain
                ? "bg-green-500 shadow-md hover:bg-green-600"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {terrain.nom_terrain}
          </motion.button>
        ))}
      </div>     
    </div>
  );
}


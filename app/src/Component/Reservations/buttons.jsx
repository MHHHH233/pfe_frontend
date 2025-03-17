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
        const service = sessionStorage.getItem("type") === "admin" 
          ? adminTerrainService 
          : userTerrainService;
        
        const response = await service.getAllTerrains();
        if (response.data) {
          const formattedTerrains = response.data.map(terrain => ({
            id: terrain.id_terrain,
            name: terrain.nom_terrain
          }));
          setTerrains(formattedTerrains);
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
    setSelectedTerrain(terrain);
    if (onChange) onChange(terrain);
  };

  if (loading) {
    return <div className="text-center text-gray-400">Loading terrains...</div>;
  }

  if (error) {
    return <div className="text-center text-red-400">{error}</div>;
  }

  return (
    <div className="mt-5 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
        {terrains.map((terrain) => (
          <motion.button
            key={terrain.id}
            onClick={() => handleButtonClick(terrain.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base rounded-lg text-white font-semibold transition-all duration-300 ease-in-out ${
              selectedTerrain === terrain.id
                ? "bg-green-500 shadow-md hover:bg-green-600"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {terrain.name}
          </motion.button>
        ))}
      </div>     
    </div>
  );
}


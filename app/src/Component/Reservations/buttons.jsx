import { useState } from "react";

export default function Buttons({ onChange }) {
  const [selectedTerrain, setSelectedTerrain] = useState(null);

  const terrains = [
    {"name":"terrain1","id":"1"},
    {"name":"terrain2","id":"2"},
    {"name":"terrain3","id":"3"},
    {"name":"terrain4","id":"4"},
    {"name":"terrain5","id":"5"},
  ];

  const handleButtonClick = (terrain) => {
    setSelectedTerrain(terrain);
    if (onChange) onChange(terrain);
  };

  return (
    <div className="mt-5 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
        {terrains.map((terrain, index) => (
          <button
            key={index}
            onClick={() => handleButtonClick(terrain.id)}
            className={`px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base rounded-lg text-white font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg ${
              selectedTerrain === terrain.id
                ? "bg-green-500 shadow-md hover:bg-green-600"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {terrain.name}
          </button>
        ))}
      </div>     
    </div>
  );
}


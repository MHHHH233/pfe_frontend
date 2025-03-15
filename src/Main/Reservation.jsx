import React, { useState } from "react";
import styled from "styled-components";
import FormResev from "../Component/Reservations/form";
import Buttons from "../Component/Reservations/buttons";
import Tableau from "../Component/Reservations/table";
import background from "../img/background1.png";
import { motion } from "framer-motion";

export default function Reservations() {
  const [idTerrain, setIdTerrain] = useState(null);

  const handleChange = (terrain) => {
    setIdTerrain(terrain);
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
          Reservations
          <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-green-400"></span>
        </h1>
        <Buttons onChange={handleChange} />
        <div className="mt-6 sm:mt-12 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
          <Tableau Terrain={idTerrain} />
          <FormResev Terrain={idTerrain} />
        </div>
      </div>
    </motion.section>
  );
}

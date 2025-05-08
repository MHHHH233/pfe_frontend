"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import academieService from "../../lib/services/user/academieServices"

const infoVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
}

export function AcademyInfo() {
  const [academie, setAcademie] = useState({
    nom: "Chargement...",
    description: "Chargement des informations de l'académie..."
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAcademieInfo = async () => {
      try {
        const response = await academieService.getAllAcademies();
        if (response.data && response.data.length > 0) {
          setAcademie(response.data[0]); // Use the first academy in the list
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to load academy information');
        setLoading(false);
        console.error('Error fetching academy info:', err);
      }
    };

    fetchAcademieInfo();
  }, []);

  if (error) {
    return (
      <section className="mb-20">
        <p className="text-red-500 text-center">{error}</p>
      </section>
    );
  }

  return (
    <motion.section
      id="about"
      variants={infoVariants}
      initial="hidden"
      animate="visible"
      className="mb-20"
    >
      <h2 className="text-3xl font-bold text-center mb-8">Notre Académie</h2>
      <motion.div 
        className="bg-[#333333] rounded-lg p-8 shadow-xl"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <h3 className="text-2xl font-semibold mb-4">{academie.nom}</h3>
        <p className="text-gray-300 text-lg leading-relaxed">
          {academie.description}
        </p>
        {!loading && academie.date_creation && (
          <p className="text-gray-400 mt-4">
            Fondée le: {new Date(academie.date_creation).toLocaleDateString()}
          </p>
        )}
      </motion.div>
    </motion.section>
  )
}
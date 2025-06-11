"use client"

import { motion } from "framer-motion"
import background from '../../img/fc24-hero-lg-motion-pitch-3x2-lg-md.webm'
import { useEffect, useState } from "react"
import academieProgrammesService from "../../lib/services/user/academieProgrammesService"
import { useNavigate } from "react-router-dom";
export default function ProgrammeEntrainement() {
  const [programmes, setProgrammes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProgrammes = async () => {
      try {
        const response = await academieProgrammesService.getAllProgrammes({
          sort_by: 'jour',
          sort_order: 'asc'
        });
        setProgrammes(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load programmes');
        setLoading(false);
      }
    };

    fetchProgrammes();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: ({ index }) => (index % 2 === 0 ? -20 : 20) },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div id="programmes" className="relative w-full overflow-hidden bg-[#1a1a1a]">
      {/* Video Background */}
      <div className="absolute inset-0 w-screen h-full z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-screen h-full object-cover opacity-20"
        >
          <source src={background} type="video/webm" />
        </video>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full mx-auto max-w-4xl px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Programme d'Entraînement
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Découvrez notre programme hebdomadaire conçu pour améliorer vos
            compétences, renforcer l'esprit d'équipe, et maximiser votre potentiel.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative"
        >
          {/* Timeline Line */}
          <div className="absolute left-1/2 top-0 h-full w-0.5 bg-green-500 transform -translate-x-1/2" />

          {/* Schedule Items */}
          {programmes.map((item, index) => (
            <motion.div
              key={item.id}
              custom={{ index }}
              variants={itemVariants}
              className="relative mb-16 last:mb-0"
            >
              {/* Timeline Dot */}
              <div className="absolute left-1/2 top-0 -translate-x-1/2 transform">
                <div className="h-4 w-4 rounded-full bg-green-500 ring-4 ring-[#1a1a1a]" />
              </div>

              {/* Content */}
              <div
                className={`flex ${
                  index % 2 === 0 ? "justify-end pr-12" : "justify-start pl-12"
                } ${index % 2 === 0 ? "" : "ml-[50%]"} w-1/2`}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`w-full space-y-2 ${index % 2 === 0 ? "text-right" : "text-left"}`}
                >
                  <h3 className="text-xl font-semibold text-white">{item.jour}</h3>
                  <p className="text-gray-400 text-sm">Horaires : {item.horaire}</p>
                  <p className="text-gray-500 text-sm">{item.programme}</p>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-500 text-sm italic">
            Note : Les horaires peuvent être ajustés en fonction des événements ou des
            conditions météorologiques.
          </p>

          <motion.button
            onClick={() => navigate('/contactus')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8 px-6 py-3 bg-green-500 text-black rounded-full font-medium hover:bg-green-400 transition-colors"
          >
            Contactez-nous pour plus d'informations
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}


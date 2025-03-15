"use client"

import { motion } from "framer-motion"
import background from '../../img/fc24-hero-lg-motion-pitch-3x2-lg-md.webm'

export default function ProgrammeEntrainement() {
  const schedule = [
    {
      day: "Lundi",
      time: "16h00 - 18h00",
      activities: "Activités : Techniques individuelles, passes, contrôle de balle."
    },
    {
      day: "Mercredi",
      time: "16h00 - 18h00",
      activities: "Activités : Stratégies d'équipe, tactiques, ateliers."
    },
    {
      day: "Vendredi",
      time: "16h00 - 18h00",
      activities: "Activités : Matchs d'entraînement, simulations de jeu."
    },
    {
      day: "Samedi",
      time: "10h00 - 12h00",
      activities: "Activités : Entraînement intensif, fitness, et cardio."
    }
  ]

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

  return (
    <div className="relative w-full overflow-hidden bg-[#1a1a1a]">
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
          {schedule.map((item, index) => (
            <motion.div
              key={item.day}
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
                  <h3 className="text-xl font-semibold text-white">{item.day}</h3>
                  <p className="text-gray-400 text-sm">Horaires : {item.time}</p>
                  <p className="text-gray-500 text-sm">{item.activities}</p>
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


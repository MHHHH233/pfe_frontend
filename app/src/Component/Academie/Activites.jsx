"use client"

import { motion } from "framer-motion"
import img1 from "../../img/img3.PNG"
import img2 from "../../img/img2.PNG"
import img3 from "../../img/img1.PNG"
// import img4 from "../../img/"
// import img5 from "../../img/"

export default function ActivitesAcademie() {
    const activities = [
        {
          id: 1,
          title: "Match de Football",
          date: "Date : 24 Décembre 2024",
          description: "Description : Un match amical entre deux équipes locales.",
          image: img1,
          isFeatured: true
        },
        {
          id: 2,
          title: "Tournoi de Football",
          date: "Date : 31 Décembre 2024",
          description: "Description : Tournoi régional avec plusieurs équipes participantes.",
          image: img2,
          isFeatured: false
        },
        {
          id: 3,
          title: "Séance d'Entraînement",
          date: "Date : 15 Janvier 2025",
          description: "Description : Entraînement ouvert aux jeunes joueurs.",
          image: img3,
          isFeatured: false
        }
      ];
      
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] p-6">   

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-white mb-8 text-center"
        >
          Activités de l'Académie
        </motion.h1>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Featured Activity */}
          {activities.filter(activity => activity.isFeatured).map(activity => (
            <motion.div
              key={activity.id}
              variants={itemVariants}
              className="relative overflow-hidden rounded-2xl bg-black/40 backdrop-blur-sm"
            >
              <div className="flex flex-col md:flex-row gap-6 p-6">
                <div className="w-full md:w-1/2">
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    src={activity.image}
                    alt={activity.title}
                    className="w-full h-[300px] object-cover rounded-xl"
                  />
                </div>
                <div className="w-full md:w-1/2 space-y-4">
                  <h2 className="text-2xl font-semibold text-white">{activity.title}</h2>
                  <p className="text-gray-400">{activity.date}</p>
                  <p className="text-gray-400">{activity.description}</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full md:w-auto px-8 py-3 bg-green-500 text-black rounded-full font-medium hover:bg-green-400 transition-colors"
                  >
                    Participer
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Regular Activities Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {activities.filter(activity => !activity.isFeatured).map(activity => (
              <motion.div
                key={activity.id}
                variants={itemVariants}
                className="relative overflow-hidden rounded-2xl bg-black/40 backdrop-blur-sm"
              >
                <div className="p-6 space-y-4">
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    src={activity.image}
                    alt={activity.title}
                    className="w-full h-[200px] object-cover rounded-xl"
                  />
                  <h2 className="text-xl font-semibold text-white">{activity.title}</h2>
                  <p className="text-gray-400">{activity.date}</p>
                  <p className="text-gray-400">{activity.description}</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full px-8 py-3 bg-green-500 text-black rounded-full font-medium hover:bg-green-400 transition-colors"
                  >
                    Participer
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}


"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import academieActivitesService from "../../lib/services/user/academieActivitesService"
import img1 from "../../img/img3.PNG"
import img2 from "../../img/img2.PNG"
import img3 from "../../img/img1.PNG"
// import img4 from "../../img/"
// import img5 from "../../img/"

export default function ActivitesAcademie() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fallbackImages = [img1, img2, img3];

  const getImageForActivity = (activity, index) => {
    if (activity.image_url) return activity.image_url;
    return fallbackImages[index % fallbackImages.length];
  };

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await academieActivitesService.getAllActivites({
          sort_by: 'date_debut',
          sort_order: 'desc'
        });
        setActivities(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load activities');
        setLoading(false);
      }
    };

    fetchActivities();
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
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

  // Get the featured activity (first one)
  const featuredActivity = activities[0];
  const regularActivities = activities.slice(1);

  return (
    <div id="activités" className="min-h-screen bg-[#1a1a1a] p-6">   
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
          {featuredActivity && (
            <motion.div
              variants={itemVariants}
              className="relative overflow-hidden rounded-2xl bg-black/40 backdrop-blur-sm"
            >
              <div className="flex flex-col md:flex-row gap-6 p-6">
                <div className="w-full md:w-1/2">
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    src={getImageForActivity(featuredActivity, 0)}
                    alt={featuredActivity.title}
                    className="w-full h-[300px] object-cover rounded-xl"
                  />
                </div>
                <div className="w-full md:w-1/2 space-y-4">
                  <h2 className="text-2xl font-semibold text-white">{featuredActivity.title}</h2>
                  <p className="text-gray-400">Date : {new Date(featuredActivity.date_debut).toLocaleDateString()}</p>
                  <p className="text-gray-400">{featuredActivity.description}</p>
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
          )}

          {/* Regular Activities Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {regularActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                variants={itemVariants}
                className="relative overflow-hidden rounded-2xl bg-black/40 backdrop-blur-sm"
              >
                <div className="p-6 space-y-4">
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    src={getImageForActivity(activity, index + 1)}
                    alt={activity.title}
                    className="w-full h-[200px] object-cover rounded-xl"
                  />
                  <h2 className="text-xl font-semibold text-white">{activity.title}</h2>
                  <p className="text-gray-400">Date : {new Date(activity.date_debut).toLocaleDateString()}</p>
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


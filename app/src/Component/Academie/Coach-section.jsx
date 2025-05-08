"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { CoachCard } from "./Coach-card"
import academieCoachesService from "../../lib/services/user/academieCoachesService"

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

export function CoachesSection() {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const response = await academieCoachesService.getAllCoaches();
        // Transform the data to match our component's needs
        const transformedCoaches = response.data.map(coach => ({
          name: coach.nom,
          description: coach.description,
          image_url: coach.image_url,
          social: {
            whatsapp: coach.whatsapp || "#",
            instagram: coach.instagram || "#",
            facebook: coach.facebook || "#"
          }
        }));
        setCoaches(transformedCoaches);
        setLoading(false);
      } catch (err) {
        setError('Failed to load coaches');
        setLoading(false);
      }
    };

    fetchCoaches();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <motion.section
      id="coachs"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      className="mb-20"
    >
      <h2 className="text-3xl font-bold text-center mb-12 text-white">
        Nos Coachs Experts
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {coaches.map((coach, index) => (
          <CoachCard key={index} {...coach} />
        ))}
      </div>
    </motion.section>
  )
}


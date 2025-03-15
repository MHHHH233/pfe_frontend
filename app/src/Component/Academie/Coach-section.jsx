"use client"

import { motion } from "framer-motion"
import { CoachCard } from "./Coach-card"

const coaches = [
  {
    name: "Anas Jbara",
    description: "Spécialisée dans la condition physique et l'entraînement en endurance pour une meilleure performance.",
    social: {
      whatsapp: "#",
      instagram: "#",
      facebook: "#"
    }
  },
  {
    name: "Anas Jbara",
    description: "Spécialisée dans la condition physique et l'entraînement en endurance pour une meilleure performance.",
    social: {
      whatsapp: "#",
      instagram: "#",
      facebook: "#"
    }
  },
  {
    name: "Anas Imlawi",
    description: "Expert dans les techniques de gestion de but, assurant que les joueurs sont bien préparés pour les situations de jeu avec des séances régulières et une prise de décision.",
    social: {
      whatsapp: "#",
      instagram: "#",
      facebook: "#"
    }
  }
]

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
  return (
    <motion.section
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      className="mb-20"
    >
      <h2 className="text-3xl font-bold text-center mb-12">
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


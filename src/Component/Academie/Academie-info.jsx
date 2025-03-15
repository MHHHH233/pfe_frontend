"use client"

import { motion } from "framer-motion"

const infoVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
}

export function AcademyInfo() {
  return (
    <motion.section
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
        <h3 className="text-2xl font-semibold mb-4">Nom academie</h3>
        <p className="text-gray-300 text-lg leading-relaxed">
          Description détaillée de l&apos;académie. Mettez en avant vos points forts, 
          votre approche unique de l&apos;entraînement, et les avantages que les joueurs 
          peuvent tirer en rejoignant votre académie.
        </p>
      </motion.div>
    </motion.section>
  )
}
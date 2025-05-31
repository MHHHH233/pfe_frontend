"use client"

import { motion } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import academieService from "../../lib/services/user/academieServices"
import { FaTrophy, FaUsers, FaFutbol, FaGraduationCap } from "react-icons/fa"

const infoVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { 
      type: "spring", 
      stiffness: 100, 
      damping: 12
    }
  }
}

const statItemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 100,
      duration: 0.8
    }
  }
}

const highlightVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1,
    y: 0,
    transition: { 
      type: "spring", 
      stiffness: 100,
      delay: 0.6 
    }
  }
}

export function AcademyInfo() {
  const [academie, setAcademie] = useState({
    nom: "Chargement...",
    description: "Chargement des informations de l'académie..."
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);

  const stats = [
    {
      id: 1,
      label: "Jeunes Talents",
      value: 120,
      icon: <FaUsers className="text-3xl text-green-400" />,
      suffix: "+"
    },
    {
      id: 2,
      label: "Expérience",
      value: 5,
      icon: <FaTrophy className="text-3xl text-green-400" />,
      suffix: " ans"
    },
    {
      id: 3,
      label: "Coachs Experts",
      value: 8,
      icon: <FaGraduationCap className="text-3xl text-green-400" />,
      suffix: ""
    },
    {
      id: 4,
      label: "Matchs Organisés",
      value: 50,
      icon: <FaFutbol className="text-3xl text-green-400" />,
      suffix: "+"
    }
  ];

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

    // Intersection observer for animation triggers
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  if (error) {
    return (
      <section id="about" className="mb-20 px-4">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-red-400 text-center">
          <p>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <motion.section
      id="about"
      ref={sectionRef}
      variants={infoVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="py-20 px-4 mb-4 relative overflow-hidden"
    >
      {/* Background Effects */}
      <motion.div 
        className="absolute -bottom-40 -right-40 w-80 h-80 bg-green-500/5 rounded-full blur-3xl z-0"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.4, 0.3]
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity,
          repeatType: "reverse" 
        }}
      />
      
      <motion.div 
        className="absolute -top-20 -left-20 w-60 h-60 bg-green-500/5 rounded-full blur-3xl z-0"
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.3, 0.2]
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1 
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div 
          className="text-center mb-16"
          variants={itemVariants}
        >
          <motion.h2 
            className="text-4xl font-bold relative inline-block"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Notre Académie
            <motion.span 
              className="absolute left-0 right-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent"
              initial={{ width: 0, left: "50%" }}
              whileInView={{ width: "100%", left: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            />
          </motion.h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Info Card */}
          <motion.div 
            className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] rounded-2xl p-8 shadow-xl border border-gray-800 hover:border-green-500/30 transition-colors"
            variants={itemVariants}
            whileHover={{ 
              y: -5,
              boxShadow: "0 25px 50px -12px rgba(7, 244, 104, 0.15)"
            }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.h3 
              className="text-3xl font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-green-400"
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              viewport={{ once: true }}
            >
              {academie.nom}
            </motion.h3>
            
            <motion.div 
              className="relative overflow-hidden rounded-lg mb-6 bg-black/20 p-6"
              variants={highlightVariants}
            >
              <div className="absolute top-0 left-0 w-2 h-full bg-green-500" />
              <p className="text-lg italic text-gray-300">
                "Notre mission est de former les champions de demain dans un environnement professionnel et bienveillant."
              </p>
            </motion.div>
            
            <motion.p 
              className="text-gray-300 text-lg leading-relaxed mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              {academie.description}
            </motion.p>
            
            {!loading && academie.date_creation && (
              <motion.div 
                className="flex items-center text-gray-400 mt-6 pt-4 border-t border-gray-700/50"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
              >
                <span className="mr-2">Fondée le:</span>
                <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-sm">
                  {new Date(academie.date_creation).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </motion.div>
            )}
          </motion.div>

          {/* Stats Grid */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-2 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.id}
                variants={statItemVariants}
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 15px 30px -10px rgba(7, 244, 104, 0.2)",
                  backgroundColor: "rgba(60, 60, 60, 0.4)"
                }}
                className="bg-[#333]/30 backdrop-blur-sm rounded-2xl p-6 flex flex-col items-center justify-center text-center border border-gray-700/50 hover:border-green-500/30 transition-all"
              >
                <div className="mb-3">
                  {stat.icon}
                </div>
                <motion.div 
                  className="text-4xl font-bold text-white mb-1"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ 
                    opacity: 1, 
                    scale: 1,
                    transition: { 
                      delay: 0.3 + index * 0.1,
                      type: "spring",
                      stiffness: 100
                    }
                  }}
                  viewport={{ once: true }}
                >
                  {stat.value}{stat.suffix}
                </motion.div>
                <div className="text-gray-400 text-sm font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        {/* Call to action */}
        <motion.div 
          className="mt-16 text-center"
          variants={itemVariants}
        >
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0px 10px 20px rgba(7, 244, 104, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-400 text-black rounded-full font-medium text-lg shadow-md hover:shadow-xl transition-shadow group relative overflow-hidden"
          >
            <motion.span 
              initial={{ x: "-100%" }}
              whileHover={{ x: "0%" }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 bg-black/10 z-0"
            />
            <span className="relative z-10 flex items-center justify-center gap-2">
              Rejoindre notre académie
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
}
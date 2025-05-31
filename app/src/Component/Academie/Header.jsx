"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

const headerVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.8, 
      ease: [0.6, 0.05, 0.01, 0.99],
      when: "beforeChildren",
      staggerChildren: 0.2
    }
  }
}

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.5,
      ease: "easeOut"
    }
  }
}

const glowVariants = {
  initial: {
    opacity: 0.5,
    scale: 0.8
  },
  animate: {
    opacity: [0.5, 0.7, 0.5],
    scale: [0.8, 1, 0.8],
    transition: {
      duration: 3,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "reverse"
    }
  }
}

const letterContainerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03
    }
  }
}

const letterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100
    }
  }
}

export function Header() {
  const [scrollY, setScrollY] = useState(0);
  const title = "Bienvenue à l'Académie Terrana FC";
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      className="relative text-center py-20 mt-16 mb-16 overflow-hidden"
    >
      {/* Background Effects */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-green-500 filter blur-[100px] opacity-10"
        variants={glowVariants}
        initial="initial"
        animate="animate"
      />
      
      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4">
        {/* Animated Title with Letter Animation */}
        <motion.div
          className="overflow-hidden mb-8"
          variants={letterContainerVariants}
          initial="hidden"
          animate="visible"
        >
          <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-green-300 to-white">
            {title.split('').map((letter, index) => (
              <motion.span
                key={index}
                variants={letterVariants}
                className="inline-block"
                style={{
                  textShadow: "0 0 10px rgba(7, 244, 104, 0.3)"
                }}
              >
                {letter === ' ' ? '\u00A0' : letter}
              </motion.span>
            ))}
          </h1>
        </motion.div>
        
        {/* Subtitle with animation */}
        <motion.div
          variants={childVariants}
          className="overflow-hidden relative"
        >
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 font-light max-w-2xl mx-auto leading-relaxed"
            style={{ 
              transform: `translateY(${scrollY * 0.1}px)`,
              opacity: 1 - scrollY * 0.002
            }}
          >
            Développez vos compétences en football avec des entraînements personnalisés 
            et rejoignez une communauté passionnée.
          </motion.p>
        </motion.div>
        
        {/* Call to Action Buttons */}
        <motion.div 
          className="mt-10 flex flex-wrap justify-center gap-4"
          variants={childVariants}
        >
          <motion.a
            href="#about"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 10px 20px rgba(7, 244, 104, 0.2)"
            }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-400 rounded-full text-black font-semibold shadow-md shadow-green-500/20"
          >
            Découvrir
          </motion.a>
          
          <motion.a
            href="#tarifs"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)"
            }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-transparent border-2 border-white rounded-full text-white font-semibold hover:bg-white/10 transition-colors"
          >
            Nos tarifs
          </motion.a>
        </motion.div>
        
        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 mt-16"
          initial={{ opacity: 0, y: -10 }}
          animate={{ 
            opacity: [0, 1, 0], 
            y: [0, 10, 0] 
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop"
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 13L12 18L17 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 7L12 12L17 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      </div>
    </motion.header>
  )
}


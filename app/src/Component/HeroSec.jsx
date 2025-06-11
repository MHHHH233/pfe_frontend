import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import videoBackground from '../img/fc24-hero-lg-motion-pitch-3x2-lg-md.webm';
import imageBackground from '../img/hero.png';

const HeroSection = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <div className="relative h-screen w-full flex flex-col justify-center items-center text-center overflow-hidden">
      {/* Overlay with improved gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/70 z-10"></div>
      
      {/* Enhanced top border with animation */}
      <motion.div 
        className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#07F468] to-transparent z-20 opacity-80"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      ></motion.div>
      
      {/* Video background (mobile) with subtle zoom effect */}
      <motion.video 
        autoPlay 
        loop 
        muted 
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 block md:hidden"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, ease: "easeInOut" }}
      >
        <source src={videoBackground} type="video/webm" />
        Your browser does not support the video tag.
      </motion.video>
      
      {/* Image background (desktop) with subtle zoom effect */}
      <motion.img 
        src={imageBackground} 
        alt="Football field" 
        className="absolute inset-0 w-full h-full object-cover z-0 hidden md:block"
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, ease: "easeInOut" }}
      />
      
      {/* Content with staggered animation */}
      <motion.div 
        className="relative z-20 max-w-[1000px] px-6 md:px-10 py-8 md:py-12 bg-black/30 backdrop-blur-sm rounded-xl border border-white/10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6 md:mb-8 leading-tight font-bold">
            <span className="block text-white drop-shadow-lg">Bienvenue chez</span>
            <motion.span 
              className="block text-transparent bg-clip-text bg-gradient-to-r from-[#07F468] to-[#34d399] text-[1.3em] font-extrabold tracking-wider mt-2"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              Terrana FC
            </motion.span>
          </h1>
        </motion.div>
        
        <motion.p 
          className="text-base md:text-lg lg:text-xl mb-10 text-white/90 max-w-[700px] mx-auto leading-relaxed drop-shadow-md"
          variants={itemVariants}
        >
          Découvrez tout un univers de football passionnant et compétitif où le plaisir du jeu rencontre l'excellence sportive
        </motion.p>
        
        <motion.div variants={itemVariants}>
          <Link 
            to="/about"
            className="inline-block bg-[#07F468] text-[#1a1a1a] font-semibold uppercase tracking-wider py-3 px-8 md:py-4 md:px-10 rounded-full shadow-lg shadow-[#07F468]/30 hover:bg-[#06d35a] hover:shadow-[#07F468]/40 hover:-translate-y-1 active:translate-y-0 active:shadow-[#07F468]/30 transition-all duration-300 overflow-hidden relative"
          >
            <span className="relative z-10">À propos de nous</span>
            <span className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/40 to-white/0 rotate-45 -translate-x-full -translate-y-full opacity-0 hover:opacity-100 hover:translate-x-full hover:translate-y-full transition-all duration-500"></span>
          </Link>
        </motion.div>
      </motion.div>
      
      {/* Improved scroll indicator with better animation */}
      <motion.div 
        className="absolute bottom-8 left-0 right-0 flex flex-col items-center justify-center text-white text-opacity-80 hover:text-opacity-100 transition-opacity duration-300 z-20 w-full text-center cursor-pointer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => window.scrollTo({
          top: window.innerHeight,
          behavior: 'smooth'
        })}
      >
        <span className="mb-2 uppercase tracking-wider text-xs font-medium">Scroll Down</span>
        <motion.div 
          className="w-6 h-10 flex justify-center"
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <ChevronDown className="text-[#07F468]" size={24} />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroSection;

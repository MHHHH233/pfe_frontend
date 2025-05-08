import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home, RefreshCcw, XCircle } from 'lucide-react';
import gsap from 'gsap';
import { Bounce } from 'gsap/all';

const ErrorPage = () => {
  const errorTextRef = useRef(null);
  const particlesRef = useRef(null);

  // Custom animation for error icon
  const iconAnimation = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { 
      opacity: 1, 
      scale: 1,
      rotate: [0, 10, -10, 10, -10, 0],
      transition: {
        duration: 1.5,
        rotate: {
          duration: 2,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
          repeatDelay: 1
        }
      }
    }
  };

  // Background particles
  const ParticleBackground = () => {
    useEffect(() => {
      if (!particlesRef.current || typeof gsap === 'undefined') return;
      
      const container = particlesRef.current;
      const particles = [];
      
      const colors = ["#FF5252", "#FFD740", "#FF6E40"];
      
      // Create particles
      for (let i = 0; i < 30; i++) {
        const particle = document.createElement("div");
        particle.style.position = "absolute";
        particle.style.width = `${Math.random() * 10 + 5}px`;
        particle.style.height = particle.style.width;
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.borderRadius = "50%";
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.opacity = "0";
        
        container.appendChild(particle);
        particles.push(particle);
        
        // Animate each particle
        gsap.to(particle, {
          opacity: Math.random() * 0.5 + 0.1,
          duration: Math.random() * 2 + 1,
          delay: Math.random() * 3,
          repeat: -1,
          yoyo: true
        });
        
        gsap.to(particle, {
          x: Math.random() * 200 - 100,
          y: Math.random() * 200 - 100,
          duration: Math.random() * 20 + 10,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      }
      
      return () => {
        particles.forEach(particle => {
          if (typeof gsap !== 'undefined') {
            gsap.killTweensOf(particle);
          }
          if (container && container.contains(particle)) {
            container.removeChild(particle);
          }
        });
      };
    }, []);
    
    return <div ref={particlesRef} className="absolute inset-0 overflow-hidden z-0" />;
  };
  
  // Animation for error text
  useEffect(() => {
    if (!errorTextRef.current || typeof gsap === 'undefined' || typeof Bounce === 'undefined') return;
    
    gsap.fromTo(
      errorTextRef.current,
      { scale: 0.5, opacity: 0 },
      { 
        scale: 1,
        opacity: 1,
        duration: 1.5,
        ease: Bounce.easeOut
      }
    );
    
    return () => {
      if (typeof gsap !== 'undefined') {
        gsap.killTweensOf(errorTextRef.current);
      }
    };
  }, []);
  
  return (
    <div className="bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] text-white min-h-screen flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Background particles */}
      <ParticleBackground />
      
      {/* Glowing effect */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
      
      {/* Content */}
      <div className="max-w-4xl w-full text-center z-10 relative">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={iconAnimation}
          className="mb-8 flex justify-center"
        >
          <XCircle size={120} className="text-red-500" />
        </motion.div>
        
        <div ref={errorTextRef} className="transform-gpu">
          <motion.h1 
            className="text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-red-500 via-red-600 to-red-700 mb-6 drop-shadow-lg"
            animate={{ 
              textShadow: ["0 0 5px rgba(239, 68, 68, 0.7)", "0 0 20px rgba(239, 68, 68, 0.7)", "0 0 5px rgba(239, 68, 68, 0.7)"]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              repeatType: "mirror" 
            }}
          >
            404
          </motion.h1>
        </div>
        
        <motion.h2 
          className="text-4xl sm:text-5xl font-semibold mb-8 text-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Page Non Trouvée
        </motion.h2>
        
        <motion.p 
          className="text-lg sm:text-xl text-gray-400 mb-10 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          La page que vous cherchez n'existe pas ou a été déplacée.
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <Link to="/" className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-800 text-white py-3 px-6 rounded-full font-medium hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300">
            <Home size={20} />
            Retour à l'accueil
          </Link>
          
          <button 
            onClick={() => window.history.back()} 
            className="flex items-center justify-center gap-2 bg-gray-800 text-white py-3 px-6 rounded-full font-medium hover:bg-gray-700 transition-all duration-300"
          >
            <ArrowLeft size={20} />
            Page précédente
          </button>
          
          <button 
            onClick={() => window.location.reload()} 
            className="flex items-center justify-center gap-2 bg-gray-800 text-white py-3 px-6 rounded-full font-medium hover:bg-gray-700 transition-all duration-300"
          >
            <RefreshCcw size={20} />
            Rafraîchir la page
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default ErrorPage; 
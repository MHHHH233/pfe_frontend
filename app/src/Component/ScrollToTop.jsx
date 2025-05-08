import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Handle scroll event
  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down 300px
      const scrolled = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Calculate scroll progress percentage
      const progress = Math.min(
        100,
        Math.round((scrolled / (documentHeight - windowHeight)) * 100)
      );
      
      setScrollProgress(progress);
      setIsVisible(scrolled > 300);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // Calculate the circumference of the circle
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-8 right-8 z-50"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            className="relative shadow-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            {/* Add subtle glow effect for higher scroll percentages */}
            {scrollProgress > 60 && (
              <div 
                className="absolute inset-0 rounded-full blur-md opacity-20"
                style={{ 
                  background: `radial-gradient(circle, #07F468 0%, transparent 70%)`,
                  transform: 'scale(1.2)'
                }}
              ></div>
            )}
            
            {/* Circular progress indicator */}
            <svg
              className="w-14 h-14 -rotate-90"
              viewBox="0 0 100 100"
            >
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#07F468" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
                <filter id="buttonShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#000" floodOpacity="0.3" />
                </filter>
              </defs>
              
              {/* Outer dark circle background */}
              <circle
                className="fill-[#0a0a0a]"
                cx="50"
                cy="50"
                r="45"
                filter="url(#buttonShadow)"
              />
              
              {/* Inner background */}
              <circle
                className="fill-[#1a1a1a]"
                cx="50"
                cy="50"
                r="42"
              />
              
              {/* Green gradient top border to match footer */}
              <path
                d="M50,8 a42,42 0 0,1 39,27"
                stroke="url(#progressGradient)"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                opacity="0.7"
              />
              
              {/* Track for progress indicator */}
              <circle
                className="stroke-gray-800 fill-none"
                cx="50"
                cy="50"
                r={radius}
                strokeWidth="4"
              />
              
              {/* Progress indicator */}
              <circle
                stroke="url(#progressGradient)"
                className="fill-none"
                cx="50"
                cy="50"
                r={radius}
                strokeWidth="4"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (circumference * scrollProgress) / 100}
                strokeLinecap="round"
              />
            </svg>
            
            {/* Button inside the progress circle */}
            <button
              onClick={scrollToTop}
              aria-label="Scroll to top"
              className="absolute inset-0 flex items-center justify-center rounded-full hover:bg-gray-800/40 transition-colors duration-300 text-white group"
            >
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 1.5, 
                  ease: "easeInOut" 
                }}
                className="flex items-center justify-center w-10 h-10 rounded-full group-hover:bg-[#07F468]/10 transition-all duration-300"
              >
                <ChevronUp className="w-5 h-5 text-[#07F468] group-hover:scale-110 transition-transform" />
              </motion.div>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop; 
import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Show button and track scroll progress
  const toggleVisibility = () => {
    const scrolled = window.pageYOffset;
    const winHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    
    // Calculate scroll percentage
    const scrollPercentage = Math.min(
      100, 
      Math.round((scrolled / (docHeight - winHeight)) * 100)
    );
    
    setScrollProgress(scrollPercentage);
    setIsVisible(scrolled > 300);
  };

  // Smooth scroll to top
  const scrollToTop = () => {
    // Create smooth scrolling animation
    const scrollStep = -window.scrollY / 15;
    const scrollInterval = setInterval(() => {
      if (window.scrollY !== 0) {
        window.scrollBy(0, scrollStep);
      } else {
        clearInterval(scrollInterval);
      }
    }, 15);
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="relative"
        >
          {/* Progress circle */}
          <svg className="w-12 h-12 -rotate-90">
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke="#e2e8f0"
              strokeWidth="4"
              fill="none"
            />
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke="url(#scrollGradient)"
              strokeWidth="4"
              fill="none"
              strokeDasharray={126}
              strokeDashoffset={126 - (126 * scrollProgress) / 100}
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="scrollGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Button */}
          <button
            onClick={scrollToTop}
            className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-green-600 to-emerald-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            aria-label="Scroll to top"
          >
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <FaArrowUp className="text-white" />
            </motion.div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop; 
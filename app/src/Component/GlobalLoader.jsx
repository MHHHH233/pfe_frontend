import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLoading } from '../contexts/LoadingContext';

const GlobalLoader = () => {
  const { isLoading, loadingMessage } = useLoading();

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80 backdrop-blur-sm"
        >
          <div className="relative flex flex-col items-center">
            {/* Football field background */}
            <div className="absolute w-40 h-40 bg-green-900 rounded-full opacity-20"></div>
            
            {/* Soccer ball loader */}
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
              }}
              className="relative z-10 w-20 h-20 mb-6"
            >
              <div className="w-full h-full rounded-full bg-white border-[6px] border-gray-800 shadow-xl">
                <div className="w-full h-full relative overflow-hidden">
                  {/* Soccer ball pattern */}
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i}
                      className="absolute w-6 h-6 bg-gray-800 rounded-sm"
                      style={{
                        top: `${Math.sin(i/5 * Math.PI * 2) * 30 + 50}%`,
                        left: `${Math.cos(i/5 * Math.PI * 2) * 30 + 50}%`,
                        transform: 'translate(-50%, -50%) rotate(45deg)'
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            </motion.div>
            
            {/* Loading text */}
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10"
            >
              <h3 className="text-white text-xl font-semibold mb-2">{loadingMessage}</h3>
              
              <div className="flex justify-center items-center space-x-2">
                {[0, 1, 2].map((dot) => (
                  <motion.div
                    key={dot}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: dot * 0.3,
                      ease: "easeInOut"
                    }}
                    className="w-2 h-2 rounded-full bg-green-500"
                  />
                ))}
              </div>
            </motion.div>
            
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full bg-green-500 filter blur-3xl opacity-20 animate-pulse"></div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GlobalLoader; 
import React from "react";
import { motion } from "framer-motion";
import Separateur from '../../img/curved.png'
import { Link } from "react-router-dom";
const LocationSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        duration: 0.7
      }
    }
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <section id="local" className="bg-[#1a1a1a] py-20 flex flex-col items-center relative overflow-hidden">
      {/* Background decorative elements */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.05 }}
        transition={{ duration: 1.5 }}
        className="absolute top-0 right-0 w-96 h-96 bg-green-500 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/2"
      />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.05 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="absolute bottom-0 left-0 w-96 h-96 bg-green-500 rounded-full filter blur-3xl translate-y-1/2 -translate-x-1/2"
      />

      {/* Title */}
      <motion.div
        variants={titleVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="text-center mb-14"
      >
        <h2 className="text-white text-4xl font-semibold text-center relative inline-block px-4">
          Notre Localisation
          <motion.span 
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="absolute left-0 bottom-[-10px] h-1 bg-gradient-to-r from-transparent via-[#07F468] to-transparent"
          ></motion.span>
        </h2>
      </motion.div>

      {/* Content Container */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl w-full px-4"
      >
        {/* Google Maps Iframe */}
        <motion.div
          variants={itemVariants}
          className="rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(7,244,104,0.15)] border border-gray-800"
          whileHover={{ 
            scale: 1.02, 
            boxShadow: "0px 25px 50px rgba(7, 244, 104, 0.25)" 
          }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3397.2586039210205!2d-8.0478300!3d31.6267691!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdafe94a941672ed%3A0xde67cdd2a606be45!2sUrbain%205!5e0!3m2!1sen!2sma!4v1734877839713!5m2!1sen!2sma"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Maps"
            className="block h-full"
          ></iframe>
        </motion.div>

        {/* Details Card */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-[#262626] to-[#1a1a1a] rounded-2xl p-8 flex flex-col justify-between text-white shadow-lg border border-gray-800/50 backdrop-blur-sm"
          whileHover={{ 
            scale: 1.02,
            boxShadow: "0px 25px 50px rgba(0, 0, 0, 0.3)",
            borderColor: "rgba(7, 244, 104, 0.3)"
          }}
        >
          <div>
            <motion.h3 
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-green-400"
            >
              Où nous trouver ?
            </motion.h3>
            
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              viewport={{ once: true }}
              className="text-gray-300 mb-8 text-lg leading-relaxed"
            >
              Venez nous rejoindre au cœur de la ville ! Notre centre est
              facilement accessible en transports en commun ou en voiture.
            </motion.p>
            
            <motion.ul 
              className="space-y-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {[
                "123 Rue Centrale, Marrakech, Maroc",
                "Horaires d'ouverture : Lundi - Samedi : 10h00 - 18h00",
                "Téléphone : +212 6 123 456 78"
              ].map((text, index) => (
                <motion.li 
                  key={index}
                  variants={listItemVariants}
                  transition={{ delay: 0.3 + index * 0.2 }}
                  className="flex items-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 400, 
                      delay: 0.4 + index * 0.2 
                    }}
                    viewport={{ once: true }}
                    className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-400 rounded-full mr-5 flex items-center justify-center shadow-lg shadow-green-500/20"
                  >
                    {index === 0 && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                    {index === 1 && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    {index === 2 && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    )}
                  </motion.div>
                  <span className="text-gray-200 text-lg">{text}</span>
                </motion.li>
              ))}
            </motion.ul>
          </div>
          
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0px 10px 20px rgba(7, 244, 104, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400 }}
            className="mt-10 px-8 py-4 bg-gradient-to-r from-green-500 to-green-400 text-black rounded-full font-semibold tracking-wide text-lg transform hover:text-white shadow-md shadow-green-500/20 group relative overflow-hidden"
          >
            <motion.span 
              initial={{ x: "-100%" }}
              whileHover={{ x: "0%" }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 bg-black/10 z-0"
            />
            <span className="relative z-10 flex items-center justify-center gap-2">
              <Link to="/contactus">
              Contactez-nous
              
              </Link>
            </span>
          </motion.button>
        </motion.div>
      </motion.div>
      
      {/* Bottom separator */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        viewport={{ once: true }}
        className="w-full mt-20"
      >
        <img src={Separateur} alt="Séparateur" className="w-full" />
      </motion.div>
    </section>
  );
};

export default LocationSection;

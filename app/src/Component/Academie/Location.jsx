import React from "react";
import { motion } from "framer-motion";
import Separateur from '../../img/curved.png'

const LocationSection = () => {
  return (
    <section id="local" className="bg-[#1a1a1a] py-16 flex flex-col items-center">
      {/* Title */}
      <h2 className="text-white text-4xl font-semibold mb-12 text-center relative">
        Notre Localisation
        <span className="absolute left-1/2 transform -translate-x-1/2 bottom-[-10px] w-16 h-1 bg-[#07F468]"></span>
      </h2>

      {/* Content Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl w-full px-4">
        {/* Google Maps Iframe */}
        <motion.div
          className="rounded-xl overflow-hidden shadow-lg"
          whileHover={{ scale: 1.02 }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3397.2586039210205!2d-8.047830000000001!3d31.6267691!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdafe94a941672ed%3A0xde67cdd2a606be45!2sUrbain%205!5e0!3m2!1sen!2sma!4v1734877839713!5m2!1sen!2sma"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Maps"
          ></iframe>
        </motion.div>

        {/* Details Card */}
        <motion.div
          className="bg-[#333333] rounded-xl p-6 flex flex-col justify-between text-white shadow-lg hover:shadow-2xl transition transform border border-gray-700"
          whileHover={{ scale: 1.02 }}
        >
          <div>
            <h3 className="text-2xl font-semibold mb-4">Où nous trouver ?</h3>
            <p className="text-gray-400 mb-6">
              Venez nous rejoindre au cœur de la ville ! Notre centre est
              facilement accessible en transports en commun ou en voiture.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center">
                <span className="w-4 h-4 bg-green-500 rounded-full mr-4"></span>
                123 Rue Centrale, Marrakech, Maroc
              </li>
              <li className="flex items-center">
                <span className="w-4 h-4 bg-green-500 rounded-full mr-4"></span>
                Horaires d'ouverture : Lundi - Samedi : 10h00 - 18h00
              </li>
              <li className="flex items-center">
                <span className="w-4 h-4 bg-green-500 rounded-full mr-4"></span>
                Téléphone : +212 6 123 456 78
              </li>
            </ul>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8 px-6 py-3 bg-green-500 text-white rounded-full font-medium hover:bg-green-400 transition-colors"
          >
            Contactez-nous
          </motion.button>
        </motion.div>
      </div>
    
    </section>
  );
};

export default LocationSection;

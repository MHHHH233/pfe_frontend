import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, ArrowRight, CheckCircle, Clock, MessageCircle, AlertCircle, Bug } from 'lucide-react';
import { useSocialMedia } from '../contexts/SocialMediaContext';
import { contactService } from '../lib/services/user/contactService';
import { useLoading } from '../contexts/LoadingContext';
import { Link } from 'react-router-dom';

// Safe implementation of InView that doesn't rely on external hook
// This avoids React version conflicts
const useSafeInView = (options = {}) => {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);
  
  useEffect(() => {
    if (!ref.current) return;
    
    // Simple IntersectionObserver implementation
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      setIsInView(entry.isIntersecting);
      
      // If triggerOnce is true, disconnect after becoming visible
      if (entry.isIntersecting && options.triggerOnce) {
        observer.disconnect();
      }
    }, {
      threshold: options.threshold || 0,
      root: options.root || null,
      rootMargin: options.rootMargin || '0px'
    });
    
    observer.observe(ref.current);
    
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options.threshold, options.triggerOnce, options.root, options.rootMargin]);
  
  return [ref, isInView];
};

const ContactUsFullscreen = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    submitting: false,
    error: null
  });
  
  const [activeFaq, setActiveFaq] = useState(null);
  const { socialMedia, isLoading: socialMediaLoading } = useSocialMedia();
  const { startLoading, stopLoading } = useLoading();

  // Animation controls
  const controls = useAnimation();
  const [heroRef, heroInView] = useSafeInView({ threshold: 0.3, triggerOnce: true });
  const [contactRef, contactInView] = useSafeInView({ threshold: 0.2, triggerOnce: true });
  const [formRef, formInView] = useSafeInView({ threshold: 0.2, triggerOnce: true });
  const [mapRef, mapInView] = useSafeInView({ threshold: 0.2, triggerOnce: true });
  const [faqRef, faqInView] = useSafeInView({ threshold: 0.2, triggerOnce: true });
  
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  // FAQ items
  const faqItems = [
    {
      question: "Quels sont vos horaires d'ouverture?",
      answer: "Nos terrains sont ouverts de 9h à 23h du lundi au vendredi, de 8h à minuit le samedi, et de 10h à 22h le dimanche."
    },
    {
      question: "Comment puis-je réserver un terrain?",
      answer: "Vous pouvez réserver un terrain en ligne via notre système de réservation, par téléphone, ou directement à l'accueil de notre complexe."
    },
    {
      question: "Proposez-vous des entraîneurs professionnels?",
      answer: "Oui, nous disposons d'une équipe d'entraîneurs professionnels disponibles pour des sessions privées ou en groupe. Contactez-nous pour plus d'informations."
    }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ submitted: false, submitting: true, error: null });
    
    try {
      startLoading('Envoi de votre message...');
      const response = await contactService.submitContact(formData);
      
      if (response.status === 'success') {
        setFormStatus({ submitted: true, submitting: false, error: null });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setFormStatus({ 
          submitted: false, 
          submitting: false, 
          error: response.message || 'Une erreur est survenue lors de l\'envoi du message.' 
        });
      }
    } catch (error) {
      setFormStatus({ 
        submitted: false, 
        submitting: false, 
        error: error.response?.data?.message || 'Une erreur est survenue lors de l\'envoi du message.' 
      });
    } finally {
      stopLoading();
    }
  };
  
  // Trigger animations when sections come into view
  useEffect(() => {
    if (heroInView) controls.start("visible");
    if (contactInView) controls.start("visible");
    if (formInView) controls.start("visible");
    if (mapInView) controls.start("visible");
    if (faqInView) controls.start("visible");
  }, [controls, heroInView, contactInView, formInView, mapInView, faqInView]);
  
  // Form field animations
  const inputVariants = {
    focused: { scale: 1.02, boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)" },
    blur: { scale: 1, boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)" }
  };
  
  return (
    <div className="bg-[#1a1a1a] text-white min-h-screen">
      {/* Hero Banner with Parallax Effect */}
      <div 
        ref={heroRef}
        className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden"
      >
        <motion.div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1508098682722-e99c643e7f76?q=80&w=2070&auto=format&fit=crop')", 
          }}
          initial={{ scale: 1.2, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 0.4 }}
          transition={{ duration: 1.5 }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-[#1a1a1a] z-1"></div>
        
        <motion.div 
          className="relative z-10 text-center px-6 max-w-4xl"
          initial="hidden"
          animate={heroInView ? "visible" : "hidden"}
          variants={fadeInUp}
        >
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-8"
          >
            <MessageCircle size={60} className="mx-auto text-green-400" />
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Contactez<span className="text-green-400">-nous</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-300 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            Nous sommes à votre écoute pour répondre à toutes vos questions
            et vous aider à organiser votre prochaine session de football
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-10"
          >
            <a
              href="#contact-form"
              className="inline-flex items-center bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold py-4 px-10 rounded-full transition-all duration-300 hover:shadow-xl hover:shadow-green-500/20 transform hover:-translate-y-1"
            >
              Nous écrire
              <ArrowRight className="ml-2" size={20} />
            </a>
          </motion.div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-16">
          {/* Contact Details */}
          <motion.div
            ref={contactRef}
            initial="hidden"
            animate={contactInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="relative"
          >
            <div className="absolute -top-16 -left-16 w-32 h-32 bg-green-500 opacity-10 rounded-full blur-3xl"></div>
            
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-10 text-green-400"
              variants={fadeInUp}
            >
              Comment Nous Joindre
            </motion.h2>

            <div className="space-y-8">
              <motion.div 
                className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg transition-all duration-500 hover:shadow-2xl transform hover:scale-102 group relative overflow-hidden"
                variants={fadeInUp}
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)"
                }}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                <h3 className="text-xl font-semibold mb-4 flex items-center text-green-400">
                  <Mail className="mr-4" size={28} />
                  E-mail
                </h3>
                <a
                  href={`mailto:${socialMedia?.email || "contact@terranafe.com"}`}
                  className="text-lg hover:text-green-300 transition-colors duration-300 flex items-center group"
                >
                  {socialMedia?.email || "contact@terranafe.com"}
                  <ArrowRight className="ml-2 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all duration-300" size={18} />
                </a>
              </motion.div>

              <motion.div 
                className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg transition-all duration-500 hover:shadow-2xl transform hover:scale-102 group relative overflow-hidden"
                variants={fadeInUp}
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)"
                }}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                <h3 className="text-xl font-semibold mb-4 flex items-center text-green-400">
                  <Phone className="mr-4" size={28} />
                  Téléphone
                </h3>
                <a
                  href={`tel:${socialMedia?.telephone || "+21261234567"}`}
                  className="text-lg hover:text-green-300 transition-colors duration-300 flex items-center group"
                >
                  {socialMedia?.telephone || "+212 6 12 34 56 78"}
                  <ArrowRight className="ml-2 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all duration-300" size={18} />
                </a>
              </motion.div>

              <motion.div 
                className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg transition-all duration-500 hover:shadow-2xl transform hover:scale-102 group relative overflow-hidden"
                variants={fadeInUp}
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)"
                }}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                <h3 className="text-xl font-semibold mb-4 flex items-center text-green-400">
                  <MapPin className="mr-4" size={28} />
                  Adresse
                </h3>
                <p className="text-lg text-gray-300">
                  {socialMedia?.address || "123 Avenue Mohammed V, Quartier Atlas, Fès, Maroc"}
                </p>
              </motion.div>
            </div>

            <motion.div 
              className="mt-12 bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-xl shadow-lg"
              variants={fadeInUp}
            >
              <h3 className="text-xl font-semibold mb-6 flex items-center text-green-400">
                <Clock className="mr-3" size={24} />
                Horaires d'ouverture
              </h3>
              <div className="space-y-3 text-gray-300">
                <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                  <span className="font-medium">Lundi - Vendredi:</span>
                  <span className="bg-gray-700 px-3 py-1 rounded-full text-sm">09:00 - 23:00</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                  <span className="font-medium">Samedi:</span>
                  <span className="bg-gray-700 px-3 py-1 rounded-full text-sm">08:00 - 00:00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Dimanche:</span>
                  <span className="bg-gray-700 px-3 py-1 rounded-full text-sm">10:00 - 22:00</span>
                </div>
              </div>
            </motion.div>
            
            {/* FAQ Section */}
            <motion.div
              ref={faqRef}
              className="mt-16"
              initial="hidden"
              animate={faqInView ? "visible" : "hidden"}
              variants={staggerContainer}
            >
              <motion.h3 
                className="text-xl font-semibold mb-6 text-green-400"
                variants={fadeInUp}
              >
                Questions Fréquentes
              </motion.h3>
              
              <div className="space-y-4">
                {faqItems.map((item, index) => (
                  <motion.div
                    key={index}
                    className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl overflow-hidden"
                    variants={fadeInUp}
                  >
                    <button
                      className="flex justify-between items-center w-full p-4 text-left"
                      onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                    >
                      <span className="font-medium">{item.question}</span>
                      <motion.div
                        animate={{ rotate: activeFaq === index ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ArrowRight className="text-green-400" size={18} />
                      </motion.div>
                    </button>
                    
                    <AnimatePresence>
                      {activeFaq === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 pt-0 text-gray-400 border-t border-gray-700">
                            {item.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Add Report Bug Link */}
            <motion.div 
              className="mt-6 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <p className="text-gray-300 mb-3">
                Vous avez trouvé un bug sur notre site?
              </p>
              <Link 
                to="/report-bug"
                className="inline-flex items-center bg-red-500/20 text-red-400 hover:bg-red-500/30 px-4 py-2 rounded-full transition-colors"
              >
                <Bug size={16} className="mr-2" />
                Signaler un bug
              </Link>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            id="contact-form"
            ref={formRef}
            initial="hidden"
            animate={formInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="relative"
          >
            <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-green-500 opacity-10 rounded-full blur-3xl"></div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-10 text-green-400">Envoyez-nous un Message</h2>
            
            {formStatus.submitted ? (
              <motion.div 
                className="bg-gradient-to-r from-gray-800 to-gray-900 p-8 rounded-xl shadow-lg text-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 260, 
                    damping: 20,
                    delay: 0.2 
                  }}
                >
                  <CheckCircle size={80} className="mx-auto mb-6 text-green-500" />
                </motion.div>
                <h3 className="text-2xl font-semibold mb-3">Message Envoyé!</h3>
                <p className="text-gray-300 mb-6">
                  Merci de nous avoir contacté. Nous vous répondrons dans les plus brefs délais.
                </p>
                <motion.button 
                  onClick={() => setFormStatus({ submitted: false, submitting: false, error: null })}
                  className="bg-gradient-to-r from-green-500 to-green-700 text-white py-3 px-6 rounded-full hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Envoyer un autre message
                </motion.button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {formStatus.error && (
                  <motion.div 
                    className="bg-red-900/30 border border-red-500 p-4 rounded-lg flex items-start mb-6"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AlertCircle className="text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-red-500 font-medium mb-1">Erreur</h4>
                      <p className="text-gray-300 text-sm">{formStatus.error}</p>
                    </div>
                  </motion.div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block mb-2 text-gray-300">Nom</label>
                    <motion.input 
                      variants={inputVariants}
                      whileFocus="focused"
                      initial="blur"
                      animate="blur"
                      type="text" 
                      id="name" 
                      name="name" 
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-all duration-300"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block mb-2 text-gray-300">Email</label>
                    <motion.input 
                      variants={inputVariants}
                      whileFocus="focused"
                      initial="blur"
                      animate="blur"
                      type="email" 
                      id="email" 
                      name="email" 
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-all duration-300"
                      placeholder="Votre email"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block mb-2 text-gray-300">Sujet</label>
                  <motion.input 
                    variants={inputVariants}
                    whileFocus="focused"
                    initial="blur"
                    animate="blur"
                    type="text" 
                    id="subject" 
                    name="subject" 
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-all duration-300"
                    placeholder="Sujet de votre message"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block mb-2 text-gray-300">Message</label>
                  <motion.textarea
                    variants={inputVariants}
                    whileFocus="focused"
                    initial="blur"
                    animate="blur"
                    id="message" 
                    name="message" 
                    rows="6" 
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-all duration-300"
                    placeholder="Votre message"
                  ></motion.textarea>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(34, 197, 94, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  type="submit"
                  disabled={formStatus.submitting}
                  className="relative overflow-hidden flex items-center justify-center bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 w-full md:w-auto"
                >
                  {formStatus.submitting ? (
                    <>
                      <span className="mr-2">Envoi en cours...</span>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    </>
                  ) : (
                    <>
                      <span className="relative z-10 flex items-center">
                        <span className="mr-2">Envoyer</span>
                        <Send size={20} />
                      </span>
                      <div className="absolute inset-0 h-full w-full transform scale-x-0 origin-left transition-transform duration-300 bg-green-600 group-hover:scale-x-100"></div>
                    </>
                  )}
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
      
      {/* Map Section */}
      <motion.div 
        ref={mapRef}
        className="w-full h-96 mt-16 relative overflow-hidden"
        initial={{ opacity: 0, y: 50 }}
        animate={mapInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8 }}
      >
        <iframe 
          src={socialMedia?.localisation || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d106376.72692390395!2d-4.997941442968747!3d34.03330999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd9f8b484d445777%3A0x10e6aaaeedd802ef!2zRsOocywgTWFyb2M!5e0!3m2!1sfr!2sma!4v1652360704295!5m2!1sfr!2sma"}
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen="" 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          title="Map Location"
          className="filter grayscale contrast-125 z-0"
        ></iframe>
        
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#1a1a1a] to-transparent z-10"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 text-center z-20">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={mapInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <a
              href={socialMedia?.localisation || "https://maps.google.com/?q=Fès,Maroc"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors duration-300"
            >
              <MapPin size={18} className="mr-2" />
              Obtenir l'itinéraire
            </a>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactUsFullscreen;


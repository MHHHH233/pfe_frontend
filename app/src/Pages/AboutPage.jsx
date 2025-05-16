import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Users, Award, Target, ChevronRight, Star } from 'lucide-react';

// Import libraries only after React is imported
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Simple IntersectionObserver implementation to replace react-intersection-observer
const useSafeInView = (options = {}) => {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);
  
  useEffect(() => {
    if (!ref.current) return;
    
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      setIsInView(entry.isIntersecting);
      
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

const AboutPage = () => {
  // State
  const [openFaq, setOpenFaq] = useState(null);
  const [animatedValues, setAnimatedValues] = useState({
    years: 0,
    clients: 0,
    matches: 0
  });

  // Refs
  const [heroRef, heroInView] = useSafeInView({ threshold: 0.3, triggerOnce: true });
  const storyRef = useRef(null);
  const counterRef = useRef(null);
  const timelineRef = useRef(null);

  // Register ScrollTrigger
  useEffect(() => {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }
    return () => {
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      }
    };
  }, []);

  // InView references - using our safe implementation
  const [valuesRef, valuesInView] = useSafeInView({ threshold: 0.2, triggerOnce: true });
  const [timelineRef1, timelineInView1] = useSafeInView({ threshold: 0.1, triggerOnce: true });
  const [timelineRef2, timelineInView2] = useSafeInView({ threshold: 0.1, triggerOnce: true });
  const [timelineRef3, timelineInView3] = useSafeInView({ threshold: 0.1, triggerOnce: true });

  // Animation variants
  const staggerAnimations = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };

  // GSAP animations
  useEffect(() => {
    if (typeof gsap === 'undefined') return;

    // Hero section animation
    const heroTl = gsap.timeline();
    heroTl.from(".hero-title", { opacity: 0, y: 50, duration: 1 })
          .from(".hero-subtitle", { opacity: 0, y: 30, duration: 0.8 }, "-=0.5");

    // Story section animation with ScrollTrigger
    if (storyRef.current && typeof ScrollTrigger !== 'undefined') {
      gsap.from(".story-image", {
        scrollTrigger: {
          trigger: storyRef.current,
          start: "top 80%",
          end: "top 30%",
          scrub: 1,
        },
        x: 100,
        opacity: 0,
        duration: 1
      });
      
      gsap.from(".story-text", {
        scrollTrigger: {
          trigger: storyRef.current,
          start: "top 80%",
          end: "top 30%",
          scrub: 1,
        },
        x: -100,
        opacity: 0,
        duration: 1
      });
    }
    
    // Timeline animation
    if (timelineRef.current && typeof ScrollTrigger !== 'undefined') {
      gsap.from(".timeline-item", {
        scrollTrigger: {
          trigger: timelineRef.current,
          start: "top 70%",
          end: "top 30%",
          scrub: 1,
        },
        opacity: 0,
        y: 50,
        stagger: 0.3,
        duration: 1
      });
    }
  }, []);

  // Animate counter values when in view
  useEffect(() => {
    if (valuesInView) {
      const duration = 2000; // ms
      const interval = 20; // ms
      const steps = duration / interval;
      let currentStep = 0;
      
      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        
        setAnimatedValues({
          years: Math.floor(progress * 4),
          clients: Math.floor(progress * 5000),
          matches: Math.floor(progress * 1200)
        });
        
        if (currentStep >= steps) {
          clearInterval(timer);
        }
      }, interval);
      
      return () => clearInterval(timer);
    }
  }, [valuesInView]);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqItems = [
    {
      question: "Comment réserver un terrain de football?",
      answer: "Pour réserver un terrain, connectez-vous à votre compte, sélectionnez la date et l'heure souhaitées dans notre section de réservation, puis suivez les étapes pour finaliser votre réservation. Vous pouvez également réserver par téléphone ou directement sur place, selon disponibilité."
    },
    {
      question: "Quels moyens de paiement acceptez-vous?",
      answer: "Nous acceptons les paiements par carte bancaire, virement bancaire et paiement mobile. Pour les réservations régulières, nous proposons également des formules d'abonnement avec prélèvement automatique. N'hésitez pas à contacter notre équipe pour plus d'informations."
    },
    {
      question: "Peut-on annuler une réservation?",
      answer: "Oui, vous pouvez annuler votre réservation jusqu'à 24 heures avant l'heure prévue pour un remboursement complet. Les annulations tardives peuvent être soumises à des frais. En cas de mauvais temps, nous proposons des solutions alternatives ou un report sans frais."
    },
    {
      question: "Proposez-vous des forfaits pour les équipes?",
      answer: "Oui, nous proposons des forfaits spéciaux pour les équipes régulières avec des tarifs préférentiels. Nous offrons également des services supplémentaires comme l'organisation de tournois, la captation vidéo de matches et des séances d'entraînement personnalisées. Contactez-nous pour discuter de vos besoins spécifiques."
    },
    {
      question: "Les vestiaires et douches sont-ils disponibles?",
      answer: "Oui, nos installations comprennent des vestiaires spacieux et des douches propres et bien entretenus pour tous les joueurs. Des casiers sécurisés sont également disponibles pour ranger vos effets personnels pendant votre partie. Serviettes et produits d'hygiène de base sont fournis gratuitement."
    }
  ];

  return (
    <div className="bg-[#1a1a1a] text-white min-h-screen">
      {/* Hero Section with Parallax */}
      <div 
        ref={heroRef} 
        className="py-20 text-center min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1560272564-c83b66b1ad12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-xl p-10 max-w-2xl">
          <h1 className="text-4xl font-bold mb-4">Notre Histoire</h1>
          <p className="max-w-2xl mx-auto">
            Page en cours de maintenance. Nous reviendrons bientôt avec notre histoire complète.
          </p>
        </div>
      </div>

      {/* Stats Counter Section */}
      <div ref={valuesRef} className="bg-green-600 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-10 text-center">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-8 transform hover:scale-105 transition-all duration-500 shadow-xl">
              <h3 className="text-5xl md:text-7xl font-bold mb-4">{animatedValues.years}+</h3>
              <p className="text-xl">Années d'expérience</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-8 transform hover:scale-105 transition-all duration-500 shadow-xl">
              <h3 className="text-5xl md:text-7xl font-bold mb-4">{animatedValues.clients}+</h3>
              <p className="text-xl">Clients satisfaits</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-8 transform hover:scale-105 transition-all duration-500 shadow-xl">
              <h3 className="text-5xl md:text-7xl font-bold mb-4">{animatedValues.matches}+</h3>
              <p className="text-xl">Matchs organisés</p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div ref={storyRef} className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="story-text">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-green-400">Notre Aventure</h2>
            <div className="space-y-6 text-lg text-gray-300">
              <p>
                Fondée en 2020 par des passionnés de football, notre complexe est né d'une vision simple mais ambitieuse : créer un espace où le football serait accessible à tous, dans des conditions professionnelles.
              </p>
              <p>
                Notre premier terrain a ouvert ses portes en plein cœur de Fès, offrant une alternative de qualité aux terrains traditionnels. Le succès a été immédiat, et notre communauté n'a cessé de grandir depuis.
              </p>
              <p>
                Aujourd'hui, nous sommes fiers d'offrir cinq terrains de dernière génération, des installations modernes et une gamme de services pour tous les amateurs de football, des débutants aux équipes professionnelles.
              </p>
            </div>
            <div className="mt-8 flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={24} className="text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <p className="mt-2 text-gray-300 italic">
              "Le meilleur complexe de football à Fès, sans aucun doute!" - Magazine SportMaroc 2023
            </p>
          </div>
          
          <div className="story-image relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 transform rotate-3 rounded-2xl"></div>
            <img 
              src="https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
              alt="Notre équipe" 
              className="relative z-10 rounded-2xl shadow-2xl transform -rotate-3 hover:rotate-0 transition-all duration-500"
            />
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div ref={timelineRef} className="bg-[#222] py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center text-green-400">Notre Parcours</h2>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-0 md:left-1/2 transform md:translate-x-[-50%] top-0 bottom-0 w-1 bg-green-500"></div>
            
            {/* Timeline items */}
            <div className="timeline-items space-y-24">
              <div ref={timelineRef1} className="timeline-item relative">
                <div className={`flex flex-col md:flex-row items-center ${timelineInView1 ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}>
                  <div className="md:w-1/2 md:pr-12 md:text-right mb-8 md:mb-0">
                    <h3 className="text-2xl font-bold text-green-400 mb-3">2020</h3>
                    <h4 className="text-xl font-semibold mb-3">Fondation</h4>
                    <p className="text-gray-300">Ouverture de notre premier terrain dans le quartier de l'Atlas, avec une vision claire d'offrir des installations de qualité professionnelle.</p>
                  </div>
                  <div className="timeline-marker absolute left-[-15px] md:left-1/2 md:transform md:translate-x-[-50%] w-8 h-8 rounded-full bg-green-500 border-4 border-[#222] z-10"></div>
                  <div className="md:w-1/2 md:pl-12 md:text-left">
                    <img 
                      src="https://images.unsplash.com/photo-1459865264687-595d652de67e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                      alt="Ouverture" 
                      className="rounded-xl shadow-lg"
                    />
                  </div>
                </div>
              </div>
              
              <div ref={timelineRef2} className="timeline-item relative">
                <div className={`flex flex-col md:flex-row-reverse items-center ${timelineInView2 ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}>
                  <div className="md:w-1/2 md:pl-12 md:text-left mb-8 md:mb-0">
                    <h3 className="text-2xl font-bold text-green-400 mb-3">2021</h3>
                    <h4 className="text-xl font-semibold mb-3">Expansion</h4>
                    <p className="text-gray-300">Ouverture de trois nouveaux terrains et lancement de notre académie junior pour former les talents de demain.</p>
                  </div>
                  <div className="timeline-marker absolute left-[-15px] md:left-1/2 md:transform md:translate-x-[-50%] w-8 h-8 rounded-full bg-green-500 border-4 border-[#222] z-10"></div>
                  <div className="md:w-1/2 md:pr-12 md:text-right">
                    <img 
                      src="https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                      alt="Expansion" 
                      className="rounded-xl shadow-lg"
                    />
                  </div>
                </div>
              </div>
              
              <div ref={timelineRef3} className="timeline-item relative">
                <div className={`flex flex-col md:flex-row items-center ${timelineInView3 ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}>
                  <div className="md:w-1/2 md:pr-12 md:text-right mb-8 md:mb-0">
                    <h3 className="text-2xl font-bold text-green-400 mb-3">2023</h3>
                    <h4 className="text-xl font-semibold mb-3">Innovation</h4>
                    <p className="text-gray-300">Lancement de notre application mobile et système de réservation en ligne, facilitant l'accès à nos installations à tout moment.</p>
                  </div>
                  <div className="timeline-marker absolute left-[-15px] md:left-1/2 md:transform md:translate-x-[-50%] w-8 h-8 rounded-full bg-green-500 border-4 border-[#222] z-10"></div>
                  <div className="md:w-1/2 md:pl-12">
                    <img 
                      src="https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80" 
                      alt="Innovation" 
                      className="rounded-xl shadow-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section with 3D Cards */}
      <div className="py-24 bg-gradient-to-b from-[#1a1a1a] to-[#222]">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center text-green-400">Nos Valeurs</h2>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { 
                title: "Communauté", 
                icon: <Users size={40} />, 
                description: "Nous créons un environnement inclusif où tous les joueurs se sentent les bienvenus, favorisant l'esprit d'équipe et le respect mutuel."
              },
              { 
                title: "Excellence", 
                icon: <Award size={40} />, 
                description: "Nous maintenons les plus hauts standards de qualité pour nos terrains et services, offrant une expérience de jeu professionnelle à tous."
              },
              { 
                title: "Innovation", 
                icon: <Target size={40} />, 
                description: "Nous nous efforçons constamment d'améliorer et d'innover dans tous les aspects de nos services pour rester à la pointe du secteur."
              }
            ].map((value, index) => (
              <motion.div 
                key={index}
                className="perspective-card group"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={index}
                variants={staggerAnimations}
              >
                <motion.div 
                  className="relative bg-gradient-to-r from-green-600 to-green-800 p-8 rounded-2xl text-center shadow-2xl h-full transform transition-all duration-500 group-hover:scale-105"
                  whileHover={{ 
                    rotateY: 15,
                    rotateX: 10,
                    boxShadow: "0 25px 50px -12px rgba(34, 197, 94, 0.4)"
                  }}
                >
                  <div className="absolute inset-0 bg-black opacity-50 rounded-2xl transition-opacity duration-500 group-hover:opacity-30"></div>
                  <div className="relative z-10">
                    <div className="bg-white bg-opacity-20 backdrop-blur-sm w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                      {value.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
                    <p className="text-gray-100">{value.description}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section with Advanced Animations */}
      <div className="max-w-4xl mx-auto px-6 py-24">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold mb-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
            Questions Fréquemment Posées
          </span>
        </motion.h2>
        
        <div className="space-y-6">
          {faqItems.map((item, index) => (
            <motion.div 
              key={index}
              className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <motion.button
                className="flex justify-between items-center w-full p-6 text-left"
                onClick={() => toggleFaq(index)}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                whileTap={{ backgroundColor: "rgba(255,255,255,0.1)" }}
              >
                <span className="text-xl font-medium">{item.question}</span>
                <motion.div
                  animate={{ rotate: openFaq === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown size={24} className="text-green-400" />
                </motion.div>
              </motion.button>
              
              <AnimatePresence>
                {openFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 text-gray-300 border-t border-gray-700">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Call to action */}
        <motion.div 
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-semibold mb-6">Vous avez d'autres questions?</h3>
          <motion.a
            href="/contactus"
            className="inline-block px-10 py-5 rounded-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold text-lg shadow-lg"
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(34, 197, 94, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            Contactez-nous
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage; 
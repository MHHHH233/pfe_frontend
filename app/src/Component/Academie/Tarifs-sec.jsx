import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Separateur from '../../img/curved.png'
import academieService from "../../lib/services/user/academieServices";
import academieMemberService from "../../lib/services/user/academieMemberService";
import { useNavigate } from "react-router-dom";
import PaymentModal from "./PaymentModal";
import AcademyPaymentModal from './AcademyPaymentModal';
import StripeWrapper from '../Payments/StripeWrapper';

export default function Tarifs() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [prices, setPrices] = useState({
    basic: { monthly: "100", annual: "1000" },
    premium: { monthly: "200", annual: "2000" }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [academieId, setAcademieId] = useState(null);
  const [subscribing, setSubscribing] = useState(false);
  const [subscriptionMessage, setSubscriptionMessage] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [hasMembership, setHasMembership] = useState(false);
  const [memberships, setMemberships] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user already has academy memberships
    const membershipStatus = sessionStorage.getItem("has_academie_membership");
    setHasMembership(membershipStatus === "true");
    
    // Get detailed membership data
    const membershipsStr = sessionStorage.getItem("academie_memberships");
    if (membershipsStr) {
      try {
        const parsedMemberships = JSON.parse(membershipsStr);
        if (parsedMemberships && parsedMemberships.length > 0) {
          setMemberships(parsedMemberships);
        }
      } catch (error) {
        console.error("Error parsing memberships:", error);
      }
    }
    
    const fetchPrices = async () => {
      try {
        const response = await academieService.getAllAcademies();
        if (response.data && response.data.length > 0) {
          const academie = response.data[0]; // Using the first academie's prices
          
          // Store the academie ID for subscription
          setAcademieId(academie.id_academie);
          
          // Calculate annual prices (monthly * 10 for 10% discount)
          const basicAnnual = academie.plan_base * 10;
          const premiumAnnual = academie.plan_premium * 10;
          
          setPrices({
            basic: {
              monthly: academie.plan_base.toString(),
              annual: basicAnnual.toString()
            },
            premium: {
              monthly: academie.plan_premium.toString(),
              annual: premiumAnnual.toString()
            }
          });
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to load prices');
        setLoading(false);
        console.error('Error fetching prices:', err);
      }
    };

    fetchPrices();
  }, []);

  // Check if user has a specific plan
  const hasSpecificPlan = (planType) => {
    return memberships.some(membership => 
      membership.subscription_plan === planType && membership.status === 'active'
    );
  };

  const handleCardClick = (card) => setSelectedCard(card);

  const handleSelectPlan = (plan) => {
    // Check if user is logged in first
    if (!sessionStorage.getItem("userId")) {
      navigate('/sign-in', { state: { returnTo: '/academie' } });
      return;
    }
    
    // Check if plan is already active - navigate to profile instead
    if (hasSpecificPlan(plan.type)) {
      navigate('/profile');
      return;
    }
    
    // Check if we've made an API call in the last 5 minutes
    const lastCallTime = parseInt(sessionStorage.getItem('last_stripe_api_call_time') || '0');
    const currentTime = Date.now();
    const fiveMinutesInMs = 5 * 60 * 1000;
    
    // If less than 5 minutes have passed, use cached data if available
    if (currentTime - lastCallTime < fiveMinutesInMs) {
      console.log('Using cached payment session to avoid excessive Stripe API calls');
      
      // Use existing client secret if available
      const cachedClientSecret = sessionStorage.getItem('stripe_client_secret');
      if (cachedClientSecret) {
        console.log('Using cached client secret');
      }
    } else {
      // Update the last call time
      sessionStorage.setItem('last_stripe_api_call_time', currentTime.toString());
    }
    
    // Normalize plan name to ensure valid subscription_plan value - use 'base' instead of 'basic'
    const planType = plan.name.toLowerCase() === 'basic' ? 'base' : 'premium';
    
    // Create a complete plan object with all required data
    // IMPORTANT: Ensure price is properly parsed as a number for Stripe
    const completeplan = {
      name: plan.name,
      price: parseFloat(plan.price), // Parse as float to ensure it's a number
      isAnnual: isAnnual,
      features: plan.features || [],
      id: plan.id || null,
      type: planType // Ensure valid type
    };
    
    setSelectedPlan(completeplan);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async (paymentIntent, subscriptionData) => {
    console.log('Academy subscription payment successful:', paymentIntent);
    
    try {
      setSubscribing(true);
      
      // Call the academy member service to create the subscription
      try {
        const response = await academieMemberService.subscribe({
          id_academie: academieId,
          subscription_plan: selectedPlan.type === 'basic' || selectedPlan.type === 'base' ? 'base' : 'premium',
          payment_method: 'online',
          payment_intent_id: paymentIntent.id,
          payment_status: paymentIntent.status,
          price: selectedPlan.price, // This is already a number from parseFloat above
          is_annual: selectedPlan.isAnnual,
          amount: paymentIntent.amount / 100, // Convert from cents back to actual amount
          currency: paymentIntent.currency || 'mad'
        });
        
        console.log('Academy subscription created:', response);
        
        // If we have a member ID from the response, store it
        if (response && response.id_member) {
          // Store the individual member ID
          sessionStorage.setItem('academy_member_id', response.id_member);
        }
      } catch (apiError) {
        console.error('Error calling academy subscription API:', apiError);
        
        // Continue with local storage method as fallback
        console.log('Using local storage fallback for subscription');
      }
      
      // Create a new membership entry with correct subscription plan value
      const newMembership = {
        id_member: paymentIntent.id, // Use payment intent ID as temporary member ID
        id_academie: academieId,
        subscription_plan: selectedPlan.type === 'basic' || selectedPlan.type === 'base' ? 'base' : 'premium',
        payment_method: 'online',
        payment_intent_id: paymentIntent.id,
        status: 'active',
        created_at: new Date().toISOString()
      };
      
      // Update or create memberships array
      const existingMembershipsStr = sessionStorage.getItem('academie_memberships');
      let existingMemberships = [];
      
      if (existingMembershipsStr) {
        try {
          existingMemberships = JSON.parse(existingMembershipsStr);
        } catch (e) {
          console.error("Error parsing existing memberships:", e);
        }
      }
      
      // Add or update the membership with corrected plan type
      const updatedMemberships = [...existingMemberships];
      const existingIndex = updatedMemberships.findIndex(m => 
        m.id_academie === academieId && m.subscription_plan === (selectedPlan.type === 'basic' || selectedPlan.type === 'base' ? 'base' : 'premium')
      );
      
      if (existingIndex >= 0) {
        updatedMemberships[existingIndex] = newMembership;
      } else {
        updatedMemberships.push(newMembership);
      }
      
      // Store updated memberships
      sessionStorage.setItem('academie_memberships', JSON.stringify(updatedMemberships));
      setMemberships(updatedMemberships);
      
      // Update has_academie_membership flag
      sessionStorage.setItem('has_academie_membership', 'true');
      setHasMembership(true);
      
      // Dispatch event for successful subscription
      const event = new CustomEvent('subscriptionSuccess', {
        detail: {
          plan: selectedPlan,
          paymentIntent,
          membership: newMembership
        }
      });
      document.dispatchEvent(event);
      
      setSubscriptionMessage({
        type: 'success',
        text: 'Abonnement réussi! Vous êtes maintenant membre de l\'académie.'
      });
      
      // Close payment modal after success message (handled by the modal itself)
      
      // Redirect to profile page after successful subscription
      setTimeout(() => {
        navigate('/profile');
      }, 3000);
    } catch (error) {
      console.error('Error processing subscription data:', error);
      setSubscriptionMessage({
        type: 'error',
        text: 'Une erreur est survenue lors du traitement de votre abonnement.'
      });
    } finally {
      setSubscribing(false);
    }
  };

  const handleSubscribe = async (planName) => {
    if (!isLoggedIn()) {
      navigate('/login', { state: { returnTo: '/academie' } });
      return;
    }
    
    // Find the plan details
    const planDetails = plans.find(p => p.name.toLowerCase() === planName.toLowerCase());
    if (!planDetails) {
      console.error('Plan not found:', planName);
      return;
    }
    
    // Normalize plan name to ensure valid subscription_plan value - use 'base' instead of 'basic'
    const planType = planDetails.name.toLowerCase() === 'basic' ? 'base' : 'premium';
    
    setSelectedPlan({
      name: planDetails.name,
      price: isAnnual ? (planDetails.annual_price || planDetails.price * 12 * 0.9) : planDetails.price,
      features: planDetails.features,
      type: planType,
      isAnnual: isAnnual
    });
    
    setShowPaymentModal(true);
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedPlan(null);
  };

  // Helper function to check if user is logged in
  const isLoggedIn = () => {
    return !!sessionStorage.getItem("userId");
  };

  const getPlanStatusText = (planType) => {
    if (hasSpecificPlan(planType)) {
      return "Abonnement actif";
    }
    return null;
  };

  // Define plans using the API prices
  const plans = [
    {
      id: 1,
      name: "Basic",
      price: isAnnual ? prices.basic.annual : prices.basic.monthly,
      features: [
        "Accès aux entraînements collectifs",
        "Accès aux équipements de base",
        "Ressources en ligne",
        "Support communautaire"
      ],
      type: "base"
    },
    {
      id: 2,
      name: "Premium",
      price: isAnnual ? prices.premium.annual : prices.premium.monthly,
      features: [
        "Tout dans Basic",
        "Entraînements personnalisés",
        "Accès aux équipements premium",
        "Analyse de performance",
        "Accès prioritaire aux événements"
      ],
      type: "premium"
    }
  ];

  // Card variants for Framer Motion
  const cardVariants = {
    initial: { 
      scale: 0.95, 
      opacity: 0,
      y: 20
    },
    animate: (i) => ({ 
      scale: 1, 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        delay: i * 0.2
      }
    }),
    hover: { 
      scale: 1.03,
      boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
      transition: { 
        type: "spring", 
        stiffness: 300 
      }
    },
    selected: {
      scale: 1.05,
      boxShadow: "0px 15px 25px rgba(0, 0, 0, 0.2)",
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (<>
    <div id="tarifs" className="min-h-screen bg-[#1a1a1a] py-16 px-4 relative overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-600/5 to-transparent pointer-events-none"></div>
      
      {/* Content */}
      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <motion.h1 
            className="text-white text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Tarifs
          </motion.h1>
          <motion.p 
            className="text-green-400 text-xl max-w-2xl mx-auto font-medium"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Des tarifs qui évoluent avec vous
          </motion.p>
          <motion.p 
            className="text-gray-400 mt-2 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Choisissez un forfait abordable doté des meilleures fonctionnalités
            pour engager votre public, fidéliser vos clients et stimuler les
            ventes.
          </motion.p>
          
          {hasMembership && (
            <motion.div 
              className="mt-6 p-3 bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg inline-block"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Vous êtes membre de l'académie
              </span>
            </motion.div>
          )}
          
          {/* Toggle between Mensuel and Annuel */}
          {!hasMembership && (
            <motion.div 
              className="flex items-center justify-center gap-2 mt-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="relative inline-flex bg-gray-800 rounded-full p-1 shadow-inner">
                <button
                  className={`relative px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    !isAnnual
                      ? "bg-green-500 text-black shadow-md"
                      : "text-gray-300"
                  }`}
                  onClick={() => setIsAnnual(false)}
                >
                  Mensuel
                </button>
                <button
                  className={`relative px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    isAnnual
                      ? "bg-green-500 text-black shadow-md"
                      : "text-gray-300"
                  }`}
                  onClick={() => setIsAnnual(true)}
                >
                  Annuel
                  <span className="absolute -top-2 -right-2 bg-green-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                    -10%
                  </span>
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Display subscription message if any */}
        {subscriptionMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-8 p-4 rounded-lg text-center max-w-xl mx-auto ${
              subscriptionMessage.type === 'success' 
                ? 'bg-green-500/10 border border-green-500/20 text-green-400' 
                : 'bg-red-500/10 border border-red-500/20 text-red-400'
            }`}
          >
            {subscriptionMessage.text}
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => {
            const isPlanActive = hasSpecificPlan(plan.type);
            
            return (
              <motion.div
                key={plan.id}
                custom={index}
                variants={cardVariants}
                initial="initial"
                animate={selectedCard === plan.id ? ["animate", "selected"] : "animate"}
                whileHover={!isPlanActive ? "hover" : {}}
                onClick={() => !isPlanActive && handleCardClick(plan.id)}
                className={`relative overflow-hidden rounded-2xl p-8 cursor-pointer transition-all ${
                  selectedCard === plan.id
                    ? "bg-gradient-to-br from-white to-gray-100"
                    : "bg-gradient-to-br from-gray-800 to-gray-900"
                } flex flex-col h-full border ${
                  selectedCard === plan.id 
                    ? "border-green-400" 
                    : "border-gray-700"
                }`}
              >
                {/* Glow effect */}
                <div className={`absolute inset-0 opacity-20 blur-xl ${
                  selectedCard === plan.id 
                    ? "bg-green-400" 
                    : ""
                }`}></div>
                
                {/* Plan badge */}
                <div className={`absolute top-0 right-0 w-20 h-20 overflow-hidden ${
                  plan.name === "Premium" ? "bg-green-600" : "bg-blue-600"
                }`} style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%)" }}>
                  <div className="absolute top-0 right-0 rotate-45 transform origin-bottom-left">
                    <span className={`block text-center text-xs font-bold py-1 px-4 text-white ${
                      plan.name === "Premium" ? "bg-green-500" : "bg-blue-500"
                    }`}>
                      {plan.name === "Premium" ? "PREMIUM" : "BASE"}
                    </span>
                  </div>
                </div>
                
                {isPlanActive && (
                  <div className="absolute top-3 left-3 py-1 px-3 bg-green-500/30 text-green-400 rounded-full text-xs font-medium">
                    Abonnement actif
                  </div>
                )}
                
                <div className="flex-1 relative z-10">
                  <div className={`text-lg font-medium ${
                    selectedCard === plan.id
                      ? "text-gray-700"
                      : plan.name === "Premium" ? "text-green-400" : "text-blue-400"
                  } mb-2`}>
                    Plan {plan.name}
                  </div>
                  
                  <div className={`${
                    selectedCard === plan.id
                      ? "text-black"
                      : "text-white"
                  } text-4xl font-bold mb-1`}>
                    {plan.price} <span className="text-sm font-normal">MAD</span>
                    <span className={`${
                      selectedCard === plan.id
                        ? "text-gray-500"
                        : "text-gray-400"
                    } text-base font-normal ml-1`}>
                      {isAnnual ? "/an" : "/mois"}
                    </span>
                  </div>
                  
                  {isAnnual && (
                    <div className={`text-sm ${
                      selectedCard === plan.id ? "text-gray-500" : "text-gray-400"
                    } mb-6`}>
                      {(parseInt(plan.price) / 12).toFixed(0)} MAD/mois
                    </div>
                  )}
                  
                  <ul className={`${
                    selectedCard === plan.id
                      ? "text-gray-700"
                      : "text-gray-300"
                  } text-sm space-y-3 mt-6`}>
                    {plan.features.map((feature, i) => (
                      <motion.li 
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * i + 0.5 }}
                        className="flex items-start gap-2"
                      >
                        <svg className={`w-5 h-5 ${
                          selectedCard === plan.id
                            ? "text-green-600"
                            : plan.name === "Premium" ? "text-green-400" : "text-blue-400"
                        } mt-0.5 flex-shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                </div>
                
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className={`w-full mt-8 font-medium py-3 rounded-xl shadow-lg transition-all relative overflow-hidden ${
                    selectedCard === plan.id
                      ? "bg-green-600 hover:bg-green-500 text-white"
                      : isPlanActive 
                        ? "bg-gray-700 text-white"
                        : plan.name === "Premium" 
                          ? "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white" 
                          : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white"
                  } disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center`}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card selection when clicking button
                    
                    // Check if user is logged in first
                    if (!sessionStorage.getItem("userId")) {
                      navigate('/sign-in', { state: { returnTo: '/academie' } });
                      return;
                    }
                    
                    if (isPlanActive || hasMembership) {
                      navigate('/profile'); // Navigate to profile if plan is active or user has any membership
                    } else {
                      handleSelectPlan(plan);
                    }
                  }}
                  disabled={subscribing}
                >
                  {/* Animated shine effect */}
                  <span className="absolute inset-0 overflow-hidden">
                    <motion.span 
                      className="absolute top-0 left-0 w-full h-full bg-white opacity-20"
                      initial={{ x: '-100%' }}
                      animate={{ x: '100%' }}
                      transition={{ repeat: Infinity, duration: 2, ease: "linear", repeatDelay: 1 }}
                      style={{ 
                        clipPath: "polygon(0 0, 20% 0, 60% 100%, 0% 100%)" 
                      }}
                    />
                  </span>
                  
                  {subscribing && selectedCard === plan.id ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Traitement...
                    </>
                  ) : isPlanActive ? (
                    "Voir mon profil"
                  ) : hasMembership ? (
                    "Voir mon profil"
                  ) : (
                    "Abonner Maintenant"
                  )}
                </motion.button>
              </motion.div>
            );
          })}
        </div>
        
        {/* Benefits section */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h3 className="text-white text-2xl font-semibold mb-8">Pourquoi rejoindre notre académie?</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: "🏆",
                title: "Coaching d'élite",
                description: "Apprenez auprès des meilleurs entraineurs professionnels"
              },
              {
                icon: "📊",
                title: "Suivi personnalisé",
                description: "Analysez vos performances et votre progression"
              },
              {
                icon: "👥",
                title: "Communauté",
                description: "Rejoignez une communauté de passionnés et de professionnels"
              }
            ].map((benefit, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 + (i * 0.1) }}
                className="bg-gray-800/50 border border-gray-700 rounded-xl p-6"
              >
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h4 className="text-white text-lg font-medium mb-2">{benefit.title}</h4>
                <p className="text-gray-400 text-sm">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>

    <div className="flex justify-center w-full">
      <img src={Separateur} alt="Seaparateur" className="w-full" />
    </div>

    {/* Stripe Payment Modal */}
    <StripeWrapper>
      <AcademyPaymentModal
        show={showPaymentModal}
        onClose={handleClosePaymentModal}
        onSuccess={handlePaymentSuccess}
        planData={selectedPlan}
        title="Complete Academy Subscription"
      />
    </StripeWrapper>
  </>
  );
}

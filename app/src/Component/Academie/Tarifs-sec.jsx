import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Separateur from '../../img/curved.png'
import academieService from "../../lib/services/user/academieServices";
import academieMemberService from "../../lib/services/user/academieMemberService";
import { useNavigate } from "react-router-dom";
import PaymentModal from "./PaymentModal";

export default function Tarifs() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedCard, setSelectedCard] = useState("plan premium");
  const [prices, setPrices] = useState({
    basic: { monthly: "200", annual: "2000" },
    premium: { monthly: "400", annual: "4000" }
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
          
          // Calculate annual prices (monthly * 10 for 10% discount, or any other logic)
          const basicAnnual = academie.plan_base * 10;
          const premiumAnnual = academie.plan_premium * 10;
          
          setPrices({
            basic: {
              monthly: academie.plan_base || "200",
              annual: basicAnnual || "2000"
            },
            premium: {
              monthly: academie.plan_premium || "400",
              annual: premiumAnnual || "4000"
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

  const handleSubscribe = async (plan) => {
    // If user already has a membership, navigate to profile
    if (hasMembership) {
      navigate('/profile');
      return;
    }
    
    // Clear any previous messages
    setSubscriptionMessage(null);
    
    if (!academieId) {
      setSubscriptionMessage({
        type: 'error',
        text: 'Académie introuvable. Veuillez réessayer.'
      });
      return;
    }
    
    // Check if user is logged in by looking for user ID in session storage
    const userId = sessionStorage.getItem('userId') || 
                   JSON.parse(sessionStorage.getItem('userdetails'))?.id_compte;
    
    if (!userId) {
      // Redirect to login if not logged in
      navigate('/sign-in', { state: { from: `/academie#tarifs` } });
      return;
    }
    
    // Set the selected plan for payment modal
    setSelectedPlan({
      name: plan === 'plan de base' ? 'Plan de Base' : 'Plan Premium',
      type: plan === 'plan de base' ? 'base' : 'premium',
      price: plan === 'plan de base' 
        ? (isAnnual ? prices.basic.annual : prices.basic.monthly)
        : (isAnnual ? prices.premium.annual : prices.premium.monthly)
    });
    
    // Show payment modal
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async () => {
    try {
      setSubscribing(true);
      
      // Make the actual subscription API call
      const response = await academieMemberService.subscribe({
        id_academie: academieId,
        subscription_plan: selectedPlan.type
      });
      
      if (response.success) {
        // Success! Store the id_member in session storage for future use
        if (response.data && response.data.id_member) {
          // Store the individual member ID
          sessionStorage.setItem('academy_member_id', response.data.id_member);
          
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
          
          // Add the new membership to the array
          const newMembership = {
            id_member: response.data.id_member,
            id_academie: academieId,
            subscription_plan: selectedPlan.type,
            status: 'active'
          };
          
          // Add or update the membership
          const updatedMemberships = [...existingMemberships];
          const existingIndex = updatedMemberships.findIndex(m => 
            m.id_academie === academieId && m.subscription_plan === selectedPlan.type
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
          
          console.log('Academy member data stored:', response.data);
        }
        
        setSubscriptionMessage({
          type: 'success',
          text: 'Abonnement réussi! Vous êtes maintenant membre de l\'académie.'
        });
        
        // Close payment modal
        setShowPaymentModal(false);
        
        // Redirect to profile page after successful subscription
        setTimeout(() => {
          navigate('/profile');
        }, 2000);
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setShowPaymentModal(false);
      
      let errorMsg = 'Échec de l\'abonnement. Veuillez réessayer.';
      
      // Handle specific error responses
      if (error.response) {
        if (error.response.data && error.response.data.message) {
          errorMsg = error.response.data.message;
        }
        
        // Handle duplicate subscription error
        if (error.response.status === 409) {
          errorMsg = 'Vous êtes déjà abonné à cette académie.';
          // Update membership status if the error is because they're already a member
          sessionStorage.setItem('has_academie_membership', 'true');
          setHasMembership(true);
        }
      }
      
      setSubscriptionMessage({
        type: 'error',
        text: errorMsg
      });
    } finally {
      setSubscribing(false);
    }
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedPlan(null);
  };

  const getPlanStatusText = (planType) => {
    if (hasSpecificPlan(planType)) {
      return "Abonnement actif";
    }
    return null;
  };

  const plans = [
    {
      name: "Plan de Base",
      type: "base",
      description:
        "Entraînement de base pour les enfants de 6 à 12 ans, idéal pour les débutants ou ceux qui veulent se perfectionner.",
      monthlyPrice: prices.basic.monthly,
      annualPrice: prices.basic.annual,
      features: [
        "Durée: 1 heure",
        "Entraînement en groupe",
        "Accès aux installations standard",
      ],
    },
    {
      name: "Plan Premium",
      type: "premium",
      description:
        "Entraînement individuel ou en petit groupe pour un suivi personnalisé avec un coach.",
      monthlyPrice: prices.premium.monthly,
      annualPrice: prices.premium.annual,
      features: [
        "Accès aux installations premium",
        "Suivi personnalisé et conseils de coach",
        "Sessions flexibles adaptées à vos horaires",
        "Accès aux ateliers et programmes spécialisés",
        "Analyse de performance régulière",
        "Priorité de réservation des équipements",
      ],
    },
  ];

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
      {/* Content */}
      <div className="max-w-4xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-white text-4xl font-bold mb-4">Tarifs</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Des tarifs qui évoluent avec vous
          </p>
          <p className="text-gray-400 mt-2">
            Choisissez un forfait abordable doté des meilleures fonctionnalités
            pour engager votre public, fidéliser vos clients et stimuler les
            ventes.
          </p>
          
          {hasMembership && (
            <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg inline-block">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Vous êtes membre de l'académie
              </span>
            </div>
          )}
          
          {/* Toggle between Mensuel and Annuel */}
          {!hasMembership && (
            <div className="flex items-center justify-center gap-4 mt-4">
              <button
                className={`px-3 py-1 rounded-full text-sm cursor-pointer transition-colors ${
                  !isAnnual
                    ? "bg-green-500 text-black"
                    : "text-gray-400 hover:text-white"
                }`}
                onClick={() => setIsAnnual(false)}
              >
                Mensuel
              </button>
              <button
                className={`px-3 py-1 rounded-full text-sm cursor-pointer transition-colors ${
                  isAnnual
                    ? "bg-green-500 text-black"
                    : "text-gray-400 hover:text-white"
                }`}
                onClick={() => setIsAnnual(true)}
              >
                Annuel
              </button>
            </div>
          )}
        </motion.div>

        {/* Display subscription message if any */}
        {subscriptionMessage && (
          <div className={`mb-6 p-4 rounded-lg text-center ${
            subscriptionMessage.type === 'success' 
              ? 'bg-green-500/10 border border-green-500/20 text-green-400' 
              : 'bg-red-500/10 border border-red-500/20 text-red-400'
          }`}>
            {subscriptionMessage.text}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {plans.map((plan, index) => {
            const planStatus = getPlanStatusText(plan.type);
            const isPlanActive = hasSpecificPlan(plan.type);
            
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                onClick={() => handleCardClick(plan.name.toLowerCase())}
                className={`group rounded-2xl p-8 relative overflow-hidden cursor-pointer transition-all duration-300 ease-in-out ${
                  selectedCard === plan.name.toLowerCase()
                    ? "bg-white hover:bg-white"
                    : "bg-[#333] hover:bg-[#444444]"
                } flex flex-col hover:scale-105 hover:translate-y-[-5px] hover:shadow-[0_8px_32px_rgba(7,244,104,0.1)]`}
              >
                {isPlanActive && (
                  <div className="absolute top-3 right-3 py-1 px-3 bg-green-500/30 text-green-400 rounded-full text-xs font-medium">
                    Abonnement actif
                  </div>
                )}
                
                <div className="flex-1">
                  <h3
                    className={`${
                      selectedCard === plan.name.toLowerCase()
                        ? "text-black"
                        : "text-white"
                    } text-xl font-semibold mb-4`}
                  >
                    {plan.name}
                  </h3>
                  <p
                    className={`${
                      selectedCard === plan.name.toLowerCase()
                        ? "text-gray-800"
                        : "text-gray-300"
                    } text-sm mb-6`}
                  >
                    {plan.description}
                  </p>
                  <div
                    className={`${
                      selectedCard === plan.name.toLowerCase()
                        ? "text-black"
                        : "text-white"
                    } text-3xl font-bold mb-6`}
                  >
                    {isAnnual ? plan.annualPrice : plan.monthlyPrice}
                    <span
                      className={`${
                        selectedCard === plan.name.toLowerCase()
                          ? "text-gray-500"
                          : "text-gray-400"
                      } text-base font-normal ml-1`}
                    >
                      {isAnnual ? "/an" : "/mois"}
                    </span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className={`${
                          selectedCard === plan.name.toLowerCase()
                            ? "text-gray-800"
                            : "text-gray-300"
                        } text-sm flex items-center`}
                      >
                        <svg
                          className="w-4 h-4 mr-2 text-green-500"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M5 13l4 4L19 7"></path>
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full ${
                    selectedCard === plan.name.toLowerCase()
                      ? "bg-green-600 text-white"
                      : "bg-green-500 text-black"
                  } font-medium py-3 rounded-lg hover:bg-green-400 transition-colors mt-auto disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center`}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card selection when clicking button
                    handleSubscribe(plan.name.toLowerCase());
                  }}
                  disabled={subscribing}
                >
                  {subscribing && selectedCard === plan.name.toLowerCase() ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Traitement...
                    </>
                  ) : isPlanActive ? (
                    "Plan actif"
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
      </div>
    </div>

    <div className="flex justify-center w-full">
      <img src={Separateur} alt="Seaparateur" className="w-full" />
    </div>

    {/* Payment Modal */}
    {showPaymentModal && selectedPlan && (
      <PaymentModal
        show={showPaymentModal}
        onClose={handleClosePaymentModal}
        planName={selectedPlan.name}
        price={selectedPlan.price}
        isAnnual={isAnnual}
        onSuccess={handlePaymentSuccess}
      />
    )}
  </>
  );
}

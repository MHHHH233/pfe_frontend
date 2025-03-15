import { useState } from "react";
import { motion } from "framer-motion";
import Separateur from '../../img/curved.png'

export default function Tarifs() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedCard, setSelectedCard] = useState("plan premium"); // Set default to "plan premium"

  const handleCardClick = (card) => setSelectedCard(card);

  const plans = [
    {
      name: "Plan de Base",
      description:
        "Entraînement de base pour les enfants de 6 à 12 ans, idéal pour les débutants ou ceux qui veulent se perfectionner.",
      monthlyPrice: "200 DH",
      annualPrice: "2000 DH",
      features: [
        "Durée: 1 heure",
        "Entraînement en groupe",
        "Accès aux installations standard",
      ],
    },
    {
      name: "Plan Premium",
      description:
        "Entraînement individuel ou en petit groupe pour un suivi personnalisé avec un coach.",
      monthlyPrice: "400 DH",
      annualPrice: "4000 DH",
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

  return (<>
    <div className="min-h-screen bg-[#1a1a1a] py-16 px-4 relative overflow-hidden">
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
          {/* Toggle between Mensuel and Annuel */}
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
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {plans.map((plan, index) => (
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
                } font-medium py-3 rounded-lg hover:bg-green-400 transition-colors mt-auto`}
              >
                Abonner Maintenant
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>

    <div className="flex justify-center w-full">
      <img src={Separateur} alt="Seaparateur" className="w-full" />
    </div>
  </>
  );
}

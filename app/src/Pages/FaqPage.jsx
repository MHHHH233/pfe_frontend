import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const FaqPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "Comment puis-je réserver un terrain de football?",
      answer: "Vous pouvez réserver un terrain directement sur notre site web en vous rendant dans la section Réservation. Sélectionnez le jour, l'heure et le type de terrain qui vous convient, puis suivez les instructions pour confirmer votre réservation. Vous pouvez également nous appeler au +212 612 345 678 pour effectuer une réservation par téléphone."
    },
    {
      question: "Quels sont vos horaires d'ouverture?",
      answer: "Nous sommes ouverts tous les jours de 9h à 23h, y compris les week-ends et jours fériés. Les dernières réservations sont acceptées jusqu'à 22h."
    },
    {
      question: "Quels moyens de paiement acceptez-vous?",
      answer: "Nous acceptons les paiements par carte bancaire (Visa, Mastercard), en espèces, ainsi que par virements bancaires pour les réservations à long terme ou les événements. Les paiements mobiles via services locaux sont également disponibles."
    },
    {
      question: "Puis-je annuler ma réservation?",
      answer: "Oui, vous pouvez annuler votre réservation jusqu'à 24 heures avant l'heure prévue pour un remboursement complet. Les annulations effectuées moins de 24 heures à l'avance sont soumises à des frais d'annulation de 50% du montant de la réservation. Veuillez nous contacter par téléphone ou par email pour toute annulation."
    },
    {
      question: "Y a-t-il des vestiaires et des douches disponibles?",
      answer: "Oui, nos installations comprennent des vestiaires modernes avec douches, casiers sécurisés et toilettes. Des serviettes peuvent être fournies moyennant un supplément. Tout est conçu pour vous offrir une expérience confortable avant et après votre activité sportive."
    },
    {
      question: "Proposez-vous des forfaits pour les équipes ou les groupes?",
      answer: "Absolument! Nous proposons des forfaits spéciaux pour les réservations régulières et les équipes. Ces forfaits incluent des réductions sur le prix des terrains et d'autres avantages comme l'accès prioritaire aux réservations. Contactez notre équipe commerciale pour obtenir une offre personnalisée."
    },
    {
      question: "Comment fonctionne votre académie de football?",
      answer: "Notre académie de football propose des programmes d'entraînement pour tous les âges et niveaux. Les séances sont dirigées par des entraîneurs qualifiés et se déroulent selon un calendrier hebdomadaire. Nous proposons des programmes pour enfants (5-12 ans), adolescents (13-18 ans) et adultes. Les inscriptions se font sur place ou via notre site web dans la section Académie."
    },
    {
      question: "Organisez-vous des tournois ou des événements?",
      answer: "Oui, nous organisons régulièrement des tournois amateurs et semi-professionnels. Nous proposons également des services d'organisation d'événements sur mesure pour les entreprises, anniversaires, ou toute autre occasion spéciale. Consultez notre calendrier d'événements ou contactez-nous pour plus d'informations."
    },
    {
      question: "Puis-je louer du matériel sur place?",
      answer: "Oui, nous proposons à la location des ballons, chasubles, et autre équipement de base. Des chaussures adaptées aux terrains synthétiques sont également disponibles en quantité limitée. Le matériel peut être réservé à l'avance ou emprunté directement sur place selon disponibilité."
    },
    {
      question: "Y a-t-il un parking disponible?",
      answer: "Oui, nous disposons d'un parking gratuit pouvant accueillir jusqu'à 60 véhicules. Le parking est surveillé pendant les heures d'ouverture pour garantir la sécurité de vos véhicules."
    }
  ];

  return (
    <div className="bg-[#1a1a1a] text-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.h1 
          className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-600 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Questions Fréquemment Posées
        </motion.h1>
        <motion.p 
          className="text-lg text-gray-300 max-w-2xl mx-auto text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Trouvez rapidement des réponses aux questions les plus courantes concernant nos services et installations.
        </motion.p>

        {/* FAQ Accordion */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
            >
              <button
                className="flex justify-between items-center w-full p-5 text-left transition-colors hover:bg-gray-700/30"
                onClick={() => toggleFaq(index)}
              >
                <span className="text-lg font-medium">{faq.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="text-green-400" size={20} />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 pt-0 text-gray-300 border-t border-gray-700/50">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact CTA */}
        <motion.div 
          className="mt-16 mb-8 text-center bg-gradient-to-r from-gray-800 to-gray-900 p-8 rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h2 className="text-2xl font-semibold mb-4">Vous ne trouvez pas votre réponse?</h2>
          <p className="text-gray-300 mb-6">
            Notre équipe est disponible pour répondre à toutes vos questions supplémentaires.
          </p>
          <a 
            href="/contactus" 
            className="inline-block bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-8 rounded-full transition-colors duration-300"
          >
            Contactez-nous
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default FaqPage; 
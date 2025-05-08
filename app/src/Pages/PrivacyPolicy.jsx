import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, User, Database, Server, CheckCircle } from 'lucide-react';

const PrivacyPolicy = () => {
  const sections = [
    {
      id: 'introduction',
      title: 'Introduction',
      icon: <Shield className="w-6 h-6 text-green-400" />,
      content: `
        <p>Dernière mise à jour: 1 juin 2024</p>
        <p>Chez Terrana FC, nous attachons une grande importance à la protection de vos données personnelles. Cette politique de confidentialité explique comment nous collectons, utilisons, partageons et protégeons vos informations lorsque vous utilisez notre site web et nos services.</p>
        <p>En utilisant nos services, vous acceptez les pratiques décrites dans cette politique. Nous vous encourageons à la lire attentivement pour comprendre nos pratiques concernant vos données personnelles.</p>
      `
    },
    {
      id: 'collection',
      title: 'Informations que nous collectons',
      icon: <Database className="w-6 h-6 text-green-400" />,
      content: `
        <p>Nous collectons différents types d'informations vous concernant, notamment :</p>
        <ul>
          <li><strong>Informations personnelles</strong> : nom, adresse e-mail, numéro de téléphone, adresse postale lorsque vous créez un compte ou effectuez une réservation.</li>
          <li><strong>Informations de paiement</strong> : détails de votre carte bancaire ou autres informations financières nécessaires pour traiter les paiements (ces informations sont traitées par nos prestataires de services de paiement sécurisés).</li>
          <li><strong>Informations d'utilisation</strong> : données sur la façon dont vous interagissez avec notre site web et nos services, y compris les pages visitées, la durée de votre visite et vos préférences.</li>
          <li><strong>Informations techniques</strong> : adresse IP, type de navigateur, appareil utilisé, système d'exploitation, et autres données techniques.</li>
        </ul>
      `
    },
    {
      id: 'usage',
      title: 'Comment nous utilisons vos informations',
      icon: <Server className="w-6 h-6 text-green-400" />,
      content: `
        <p>Nous utilisons vos informations personnelles pour :</p>
        <ul>
          <li>Gérer votre compte et vous fournir nos services</li>
          <li>Traiter et confirmer vos réservations</li>
          <li>Vous envoyer des informations importantes concernant nos services, des modifications de nos conditions ou politiques</li>
          <li>Vous envoyer des communications marketing si vous avez choisi de les recevoir</li>
          <li>Améliorer et personnaliser votre expérience sur notre site</li>
          <li>Analyser l'utilisation de notre site et de nos services pour améliorer nos offres</li>
          <li>Protéger nos droits légaux et prévenir la fraude</li>
        </ul>
      `
    },
    {
      id: 'sharing',
      title: 'Partage de vos informations',
      icon: <Eye className="w-6 h-6 text-green-400" />,
      content: `
        <p>Nous ne vendons pas vos données personnelles à des tiers. Nous pouvons partager vos informations dans les circonstances suivantes :</p>
        <ul>
          <li><strong>Prestataires de services</strong> : nous partageons vos informations avec des prestataires de services tiers qui nous aident à exploiter notre site et à vous fournir nos services (traitement des paiements, hébergement, analyse de données).</li>
          <li><strong>Partenaires commerciaux</strong> : avec votre consentement, nous pouvons partager vos informations avec des partenaires commerciaux sélectionnés pour vous proposer des offres susceptibles de vous intéresser.</li>
          <li><strong>Obligations légales</strong> : nous pouvons divulguer vos informations si la loi l'exige ou si nous croyons de bonne foi que cette divulgation est nécessaire pour protéger nos droits, votre sécurité ou celle d'autrui.</li>
        </ul>
      `
    },
    {
      id: 'security',
      title: 'Sécurité de vos informations',
      icon: <Lock className="w-6 h-6 text-green-400" />,
      content: `
        <p>Nous prenons la sécurité de vos données très au sérieux et mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos informations personnelles contre la perte, l'accès non autorisé, la divulgation, l'altération ou la destruction.</p>
        <p>Cependant, aucune méthode de transmission sur Internet ou de stockage électronique n'est totalement sécurisée. Bien que nous nous efforcions d'utiliser des moyens commercialement acceptables pour protéger vos données personnelles, nous ne pouvons garantir leur sécurité absolue.</p>
      `
    },
    {
      id: 'rights',
      title: 'Vos droits',
      icon: <User className="w-6 h-6 text-green-400" />,
      content: `
        <p>En fonction de votre lieu de résidence, vous pouvez avoir certains droits concernant vos données personnelles :</p>
        <ul>
          <li>Droit d'accès et de consultation de vos données</li>
          <li>Droit de rectification des données inexactes</li>
          <li>Droit à l'effacement de vos données (dans certaines circonstances)</li>
          <li>Droit de limiter le traitement de vos données</li>
          <li>Droit à la portabilité des données</li>
          <li>Droit d'opposition au traitement</li>
          <li>Droit de retirer votre consentement à tout moment</li>
        </ul>
        <p>Pour exercer ces droits, veuillez nous contacter à l'adresse e-mail indiquée à la fin de cette politique.</p>
      `
    },
    {
      id: 'cookies',
      title: 'Cookies et technologies similaires',
      icon: <CheckCircle className="w-6 h-6 text-green-400" />,
      content: `
        <p>Nous utilisons des cookies et des technologies similaires pour améliorer votre expérience sur notre site, analyser votre utilisation de notre site et personnaliser notre contenu et nos publicités.</p>
        <p>Vous pouvez configurer votre navigateur pour refuser tous les cookies ou pour indiquer quand un cookie est envoyé. Cependant, certaines fonctionnalités de notre site peuvent ne pas fonctionner correctement si vous désactivez les cookies.</p>
      `
    },
    {
      id: 'changes',
      title: 'Modifications de cette politique',
      icon: <Shield className="w-6 h-6 text-green-400" />,
      content: `
        <p>Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. La version la plus récente sera toujours publiée sur notre site web avec la date de la dernière mise à jour.</p>
        <p>Nous vous encourageons à consulter régulièrement cette page pour rester informé de nos pratiques en matière de protection des données.</p>
      `
    },
    {
      id: 'contact',
      title: 'Nous contacter',
      icon: <Server className="w-6 h-6 text-green-400" />,
      content: `
        <p>Si vous avez des questions concernant cette politique de confidentialité ou nos pratiques en matière de protection des données, veuillez nous contacter à :</p>
        <p>
          <strong>Email</strong> : privacy@terranafc.com<br/>
          <strong>Adresse</strong> : Avenue Mohammed V, Quartier Atlas, Fès, Maroc<br/>
          <strong>Téléphone</strong> : +212 612 345 678
        </p>
      `
    }
  ];

  return (
    <div className="bg-[#1a1a1a] text-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-600">
            Politique de Confidentialité
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Nous nous engageons à protéger votre vie privée et à garantir la sécurité de vos données personnelles.
          </p>
        </motion.div>

        {/* Table of Contents */}
        <motion.div
          className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold mb-4 text-green-400">Sommaire</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {sections.map((section, index) => (
              <li key={index}>
                <a 
                  href={`#${section.id}`} 
                  className="flex items-center space-x-2 text-gray-300 hover:text-green-400 transition-colors"
                >
                  <span>•</span>
                  <span>{section.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Content Sections */}
        <div className="space-y-12">
          {sections.map((section, index) => (
            <motion.section 
              key={section.id} 
              id={section.id}
              className="scroll-mt-24"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * (index + 3) }}
            >
              <div className="flex items-center mb-4 space-x-3">
                {section.icon}
                <h2 className="text-2xl font-semibold text-white">{section.title}</h2>
              </div>
              <div 
                className="prose prose-lg prose-invert max-w-none text-gray-300 pl-9"
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            </motion.section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 
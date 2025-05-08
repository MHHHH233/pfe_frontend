import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Scale, AlertCircle, PenTool, Bookmark, Shield, Award } from 'lucide-react';

const TermsOfService = () => {
  const sections = [
    {
      id: 'introduction',
      title: 'Introduction',
      icon: <FileText className="w-6 h-6 text-green-400" />,
      content: `
        <p>Dernière mise à jour: 1 juin 2024</p>
        <p>Bienvenue sur le site web de Terrana FC. Les présentes conditions générales d'utilisation régissent votre utilisation de notre site web et de nos services. En accédant à notre site ou en utilisant nos services, vous acceptez d'être lié par ces conditions. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre site ou nos services.</p>
        <p>Terrana FC peut modifier ces conditions à tout moment. Nous vous conseillons donc de les consulter régulièrement. Les modifications prendront effet immédiatement après leur publication sur le site.</p>
      `
    },
    {
      id: 'definitions',
      title: 'Définitions',
      icon: <Bookmark className="w-6 h-6 text-green-400" />,
      content: `
        <p>Dans les présentes conditions générales, les termes suivants auront les significations suivantes :</p>
        <ul>
          <li><strong>"Site"</strong> désigne le site web de Terrana FC accessible à l'adresse www.terranafc.com.</li>
          <li><strong>"Services"</strong> désigne tous les services proposés par Terrana FC, y compris la location de terrains de football, l'organisation d'événements sportifs, et l'académie de football.</li>
          <li><strong>"Utilisateur"</strong> désigne toute personne qui accède au Site et/ou utilise les Services.</li>
          <li><strong>"Compte"</strong> désigne l'espace personnel créé par l'Utilisateur sur le Site pour accéder aux Services.</li>
          <li><strong>"Réservation"</strong> désigne toute demande confirmée de location d'un terrain ou d'inscription à un événement.</li>
        </ul>
      `
    },
    {
      id: 'account',
      title: 'Création de compte et réservations',
      icon: <PenTool className="w-6 h-6 text-green-400" />,
      content: `
        <h3>Création de compte</h3>
        <p>Pour utiliser certains de nos Services, vous devrez créer un compte. Vous devez fournir des informations exactes, complètes et à jour. Vous êtes responsable de la confidentialité de votre mot de passe et de toutes les activités qui se produisent sous votre compte.</p>
        
        <h3>Réservations</h3>
        <p>Les réservations sont soumises à disponibilité et ne sont confirmées qu'après réception du paiement intégral ou d'un acompte, selon nos conditions particulières. Les tarifs sont ceux en vigueur au moment de la réservation.</p>
        
        <h3>Annulations et modifications</h3>
        <p>Toute annulation doit être effectuée au moins 24 heures avant l'heure prévue de la réservation pour bénéficier d'un remboursement complet. Les annulations tardives sont soumises à des frais d'annulation de 50% du montant de la réservation.</p>
        <p>Les modifications de réservation sont possibles sous réserve de disponibilité et doivent être demandées au moins 24 heures à l'avance.</p>
      `
    },
    {
      id: 'rules',
      title: 'Règles d\'utilisation',
      icon: <Scale className="w-6 h-6 text-green-400" />,
      content: `
        <p>En utilisant nos Services, vous acceptez de respecter les règles suivantes :</p>
        <ul>
          <li>Utiliser nos installations et équipements avec soin et de manière appropriée</li>
          <li>Respecter les horaires de réservation</li>
          <li>Respecter les autres utilisateurs et le personnel</li>
          <li>Ne pas introduire d'alcool, de drogues ou d'armes dans nos installations</li>
          <li>Porter des chaussures adaptées aux terrains (les crampons métalliques sont interdits)</li>
          <li>Ne pas utiliser les installations à des fins commerciales sans autorisation préalable</li>
          <li>Signaler immédiatement tout dommage ou problème constaté</li>
        </ul>
        <p>Terrana FC se réserve le droit de refuser l'accès ou d'expulser toute personne ne respectant pas ces règles, sans remboursement.</p>
      `
    },
    {
      id: 'intellectual-property',
      title: 'Propriété intellectuelle',
      icon: <Award className="w-6 h-6 text-green-400" />,
      content: `
        <p>Tous les contenus présents sur le Site (textes, images, logos, vidéos, etc.) sont protégés par des droits de propriété intellectuelle et appartiennent à Terrana FC ou à des tiers ayant autorisé Terrana FC à les utiliser.</p>
        <p>Toute reproduction, représentation, modification, publication, transmission, ou exploitation totale ou partielle du Site et/ou de son contenu, par quelque procédé que ce soit, sans l'autorisation préalable écrite de Terrana FC, est strictement interdite et constituerait une contrefaçon sanctionnée par le Code de la propriété intellectuelle.</p>
      `
    },
    {
      id: 'liability',
      title: 'Limitation de responsabilité',
      icon: <AlertCircle className="w-6 h-6 text-green-400" />,
      content: `
        <p>Terrana FC s'efforce d'assurer au mieux de ses possibilités l'exactitude et la mise à jour des informations diffusées sur le Site. Toutefois, Terrana FC ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition sur le Site.</p>
        <p>Terrana FC décline toute responsabilité :</p>
        <ul>
          <li>Pour toute interruption du Site</li>
          <li>Pour toute survenance de bogues</li>
          <li>Pour toute inexactitude ou omission portant sur des informations disponibles sur le Site</li>
          <li>Pour tous dommages résultant d'une intrusion frauduleuse d'un tiers ayant entraîné une modification des informations mises à la disposition sur le Site</li>
          <li>Pour tous dommages, directs ou indirects, quelles qu'en soient les causes, origines, natures ou conséquences, provoqués en raison de l'accès de quiconque au Site ou de l'impossibilité d'y accéder</li>
        </ul>
        <p>En utilisant nos installations, vous acceptez les risques inhérents à la pratique du sport. Terrana FC ne pourra être tenu responsable des blessures ou accidents survenus lors de l'utilisation de nos Services, sauf en cas de faute prouvée imputable à Terrana FC.</p>
      `
    },
    {
      id: 'privacy',
      title: 'Protection des données personnelles',
      icon: <Shield className="w-6 h-6 text-green-400" />,
      content: `
        <p>Terrana FC s'engage à respecter la confidentialité des données personnelles communiquées par les Utilisateurs du Site et à les traiter dans le respect de la législation en vigueur.</p>
        <p>Pour plus d'informations sur la façon dont nous collectons, utilisons et protégeons vos données personnelles, veuillez consulter notre <a href="/privacy" class="text-green-400 hover:underline">Politique de Confidentialité</a>.</p>
      `
    },
    {
      id: 'applicable-law',
      title: 'Loi applicable et juridiction compétente',
      icon: <Scale className="w-6 h-6 text-green-400" />,
      content: `
        <p>Les présentes conditions générales sont régies par la loi marocaine. En cas de litige, les tribunaux de Fès seront seuls compétents.</p>
        <p>Tout différend relatif à l'interprétation et à l'exécution des présentes conditions générales fera l'objet d'une tentative de résolution amiable. À défaut, le litige sera porté devant les tribunaux compétents.</p>
      `
    },
    {
      id: 'contact',
      title: 'Contact',
      icon: <FileText className="w-6 h-6 text-green-400" />,
      content: `
        <p>Pour toute question concernant ces conditions d'utilisation, vous pouvez nous contacter :</p>
        <p>
          <strong>Email</strong> : legal@terranafc.com<br/>
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
            Conditions Générales d'Utilisation
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Veuillez lire attentivement ces conditions d'utilisation avant d'utiliser nos services.
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

export default TermsOfService; 
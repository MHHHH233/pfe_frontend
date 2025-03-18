import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
    MessageSquare,
    Phone,
    MapPin,
    ChevronRight,
    Facebook,
    Instagram,
    Twitter
} from "lucide-react";
import LogoGreen from '../img/logoGreen.PNG';

export const Footer = () => {
    return (
        <footer className="py-8 md:py-16 px-4 sm:px-6 lg:px-8  text-white">
            <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                {/* Brand Section */}
                <div className="space-y-4 md:space-y-6">
                    <div className="transform hover:scale-105 transition-transform duration-300 flex justify-center sm:justify-start">
                        <img src={LogoGreen} alt="Logo" className="w-32 h-auto" />
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed text-center sm:text-left">
                        Votre destination premium pour le football 5v5 et 6v6. 
                        Découvrez l'excellence sportive avec nos installations 
                        de classe mondiale.
                    </p>
                    <div className="flex space-x-6 pt-4 justify-center sm:justify-start">
                        {[
                            { icon: Facebook, href: "https://facebook.com" },
                            { icon: Instagram, href: "https://instagram.com" },
                            { icon: Twitter, href: "https://twitter.com" }
                        ].map((social, index) => (
                            <a
                                key={index}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-300 hover:text-green-400 hover:scale-110 transform transition-all duration-300"
                            >
                                <social.icon size={24} />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Quick Links */}
                <div className="relative text-center sm:text-left">
                    <h3 className="text-lg font-semibold mb-4 md:mb-6 relative inline-block">
                        Liens Rapides
                        <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-green-500 transform origin-left transition-all duration-300"></span>
                    </h3>
                    <ul className="space-y-3">
                        {['Accueil', 'À propos', 'Contact', 'Tournois'].map((item, index) => (
                            <li key={index}>
                                <Link 
                                    to={item === 'Accueil' ? '/' : `/${item.toLowerCase()}`}
                                    className="text-gray-300 hover:text-green-400 transition-colors duration-300 hover:translate-x-2 inline-block transform"
                                >
                                    {item}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Services */}
                <div className="relative text-center sm:text-left">
                    <h3 className="text-lg font-semibold mb-4 md:mb-6 relative inline-block">
                        Nos Services
                        <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-green-500 transform origin-left transition-all duration-300"></span>
                    </h3>
                    <ul className="space-y-3">
                        <li><span className="text-gray-300">Location de Terrains</span></li>
                        <li><span className="text-gray-300">Académie de Football</span></li>
                        <li><span className="text-gray-300">Organisation de Tournois</span></li>
                        <li><span className="text-gray-300">Événements Sportifs</span></li>
                    </ul>
                </div>

                {/* Contact */}
                <div className="text-center sm:text-left">
                    <h3 className="text-lg font-semibold mb-4 md:mb-6 relative inline-block">
                        Contactez-nous
                        <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-green-500 transform origin-left transition-all duration-300"></span>
                    </h3>
                    <ul className="space-y-4 text-gray-300">
                        <li className="flex items-center gap-3 hover:text-green-400 transition-colors group cursor-pointer justify-center sm:justify-start">
                            <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <a href="mailto:contact@terranafc.com" className="hover:underline">
                                contact@terranafc.com
                            </a>
                        </li>
                        <li className="flex items-center gap-3 hover:text-green-400 transition-colors group cursor-pointer justify-center sm:justify-start">
                            <Phone className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <a href="tel:+212612345678" className="hover:underline">
                                +212 6 12 34 56 78
                            </a>
                        </li>
                        <li className="flex items-center gap-3 hover:text-green-400 transition-colors group cursor-pointer justify-center sm:justify-start">
                            <MapPin className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span>Marrakech, Maroc</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="border-t border-white/10 mt-8 md:mt-12 pt-6 md:pt-8">
                <div className="container mx-auto flex flex-col items-center gap-4 text-sm text-gray-300 md:flex-row md:justify-between">
                    <div className="text-center md:text-left">
                        © 2024 Terrana FC. Tous droits réservés.
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 text-center">
                        <a className="hover:text-green-400 transition-colors relative group" href="/privacy">
                            Politique de confidentialité
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-400 group-hover:w-full transition-all duration-300"></span>
                        </a>
                        <a className="hover:text-green-400 transition-colors relative group" href="/terms">
                            Conditions d'utilisation
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-400 group-hover:w-full transition-all duration-300"></span>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};



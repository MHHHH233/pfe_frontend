import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
    MessageSquare,
    Phone,
    MapPin,
    Send,
    Facebook,
    Instagram,
    Twitter,
    Linkedin,
    Youtube,
    Mail,
    Calendar,
    Users,
    Trophy,
    Bug
} from "lucide-react";
import terraLogo from '../img/terraLogo.png';
import { useSocialMedia } from "../contexts/SocialMediaContext";

export const Footer = () => {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);
    const { socialMedia, isLoading } = useSocialMedia();

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email) {
            // Here you would typically handle the newsletter subscription
            console.log(`Subscribing email: ${email}`);
            setSubscribed(true);
            setTimeout(() => setSubscribed(false), 3000);
            setEmail('');
        }
    };

    const currentYear = new Date().getFullYear();
    
    // Social media links - use API data if available, otherwise fallback to defaults
    const socialLinks = [
        { 
            icon: Facebook, 
            href: socialMedia?.facebook || "https://facebook.com", 
            color: "hover:text-blue-500" 
        },
        { 
            icon: Instagram, 
            href: socialMedia?.instagram || "https://instagram.com", 
            color: "hover:text-pink-500" 
        },
        { 
            icon: Twitter, 
            href: socialMedia?.x || "https://twitter.com", 
            color: "hover:text-blue-400" 
        },
        { 
            icon: Linkedin, 
            href: "https://linkedin.com", 
            color: "hover:text-blue-600" 
        },
        { 
            icon: Youtube, 
            href: "https://youtube.com", 
            color: "hover:text-red-600" 
        }
    ];

    return (
        <footer className="bg-gradient-to-b from-[#111] to-[#0a0a0a] py-12 md:py-20 px-4 sm:px-6 lg:px-8 text-white relative">
            {/* Background gradient overlay */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-600 via-green-400 to-green-600"></div>
            
            {/* Animated soccer ball in background */}
            <div className="absolute top-20 right-10 opacity-5 hidden lg:block">
                <motion.div 
                    className="w-40 h-40 border-[6px] border-white rounded-full"
                    animate={{ 
                        rotate: 360,
                        y: [0, -20, 0]
                    }}
                    transition={{ 
                        rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                        y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                    }}
                >
                    <div className="w-full h-full border-[3px] border-dashed border-white rounded-full"></div>
                </motion.div>
            </div>

            <div className="container mx-auto">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 md:gap-6">
                    {/* Brand Section - 3 columns on large screens */}
                    <div className="lg:col-span-3 space-y-5">
                        <div className="transform hover:scale-105 transition-all duration-300 flex justify-center sm:justify-start">
                            <img src={terraLogo} alt="Terrana FC Logo" className="w-32 h-auto" />
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed text-center sm:text-left">
                            Votre destination premium pour le football 5v5 et 6v6. 
                            Découvrez l'excellence sportive avec nos installations 
                            de classe mondiale.
                        </p>
                        <div className="flex space-x-4 pt-2 justify-center sm:justify-start">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`text-gray-300 ${social.color} hover:scale-110 transform transition-all duration-300`}
                                >
                                    <social.icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links - 2 columns on large screens */}
                    <div className="lg:col-span-2 relative text-center sm:text-left">
                        <h3 className="text-lg font-semibold mb-4 md:mb-6 relative inline-block">
                            Navigation
                            <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-green-500 transform origin-left transition-all duration-300"></span>
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/" className="text-gray-300 hover:text-green-400 transition-colors duration-300 hover:translate-x-2 inline-flex items-center transform">
                                    <span className="bg-green-500 h-1.5 w-1.5 rounded-full mr-2"></span>
                                    Accueil
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-gray-300 hover:text-green-400 transition-colors duration-300 hover:translate-x-2 inline-flex items-center transform">
                                    <span className="bg-green-500 h-1.5 w-1.5 rounded-full mr-2"></span>
                                    À propos
                                </Link>
                            </li>
                            <li>
                                <Link to="/reservation" className="text-gray-300 hover:text-green-400 transition-colors duration-300 hover:translate-x-2 inline-flex items-center transform">
                                    <span className="bg-green-500 h-1.5 w-1.5 rounded-full mr-2"></span>
                                    Réservation
                                </Link>
                            </li>
                            <li>
                                <Link to="/contactus" className="text-gray-300 hover:text-green-400 transition-colors duration-300 hover:translate-x-2 inline-flex items-center transform">
                                    <span className="bg-green-500 h-1.5 w-1.5 rounded-full mr-2"></span>
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link to="/report-bug" className="text-gray-300 hover:text-green-400 transition-colors duration-300 hover:translate-x-2 inline-flex items-center transform">
                                    <Bug className="w-4 h-4 mr-2 text-red-400" />
                                    Signaler un bug
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Services - 2 columns on large screens */}
                    <div className="lg:col-span-2 relative text-center sm:text-left">
                        <h3 className="text-lg font-semibold mb-4 md:mb-6 relative inline-block">
                            Nos Services
                            <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-green-500 transform origin-left transition-all duration-300"></span>
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/reservation" className="text-gray-300 hover:text-green-400 transition-colors duration-300 hover:translate-x-2 inline-flex items-center transform">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    Location de Terrains
                                </Link>
                            </li>
                            <li>
                                <Link to="/academie" className="text-gray-300 hover:text-green-400 transition-colors duration-300 hover:translate-x-2 inline-flex items-center transform">
                                    <Users className="w-4 h-4 mr-2" />
                                    Académie de Football
                                </Link>
                            </li>
                            <li>
                                <Link to="/tournoi" className="text-gray-300 hover:text-green-400 transition-colors duration-300 hover:translate-x-2 inline-flex items-center transform">
                                    <Trophy className="w-4 h-4 mr-2" />
                                    Organisation de Tournois
                                </Link>
                            </li>
                            <li>
                                <Link to="/events" className="text-gray-300 hover:text-green-400 transition-colors duration-300 hover:translate-x-2 inline-flex items-center transform">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    Événements Sportifs
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact - 2 columns on large screens */}
                    <div className="lg:col-span-2 text-center sm:text-left">
                        <h3 className="text-lg font-semibold mb-4 md:mb-6 relative inline-block">
                            Contactez-nous
                            <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-green-500 transform origin-left transition-all duration-300"></span>
                        </h3>
                        <ul className="space-y-4 text-gray-300">
                            <li className="flex items-center gap-3 hover:text-green-400 transition-colors group cursor-pointer justify-center sm:justify-start">
                                <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                <a href={`mailto:${socialMedia?.email || "contact@terranafc.com"}`} className="hover:underline">
                                    {socialMedia?.email || "contact@terranafc.com"}
                                </a>
                            </li>
                            <li className="flex items-center gap-3 hover:text-green-400 transition-colors group cursor-pointer justify-center sm:justify-start">
                                <Phone className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                <a href={`tel:${socialMedia?.telephone || "+212612345678"}`} className="hover:underline">
                                    {socialMedia?.telephone || "+212 6 12 34 56 78"}
                                </a>
                            </li>
                            <li className="flex items-center gap-3 hover:text-green-400 transition-colors group cursor-pointer justify-center sm:justify-start">
                                <MapPin className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                <a 
                                    href={socialMedia?.localisation || "https://maps.google.com"} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="hover:underline"
                                >
                                    {socialMedia?.address || "Fès, Maroc"}
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter Subscription - 3 columns on large screens */}
                    <div className="lg:col-span-3 text-center sm:text-left">
                        <h3 className="text-lg font-semibold mb-4 md:mb-6 relative inline-block">
                            Newsletter
                            <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-green-500 transform origin-left transition-all duration-300"></span>
                        </h3>
                        <p className="text-gray-300 text-sm mb-4">
                            Inscrivez-vous pour recevoir les dernières nouvelles, offres spéciales et mises à jour.
                        </p>
                        <form onSubmit={handleSubscribe} className="relative">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Votre adresse email"
                                className="w-full py-3 px-4 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-300 pr-12 transition-all duration-300"
                                required
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-500 hover:bg-green-600 p-2 rounded-md transition-colors duration-300"
                            >
                                <Send className="w-4 h-4 text-white" />
                            </button>
                        </form>
                        {subscribed && (
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-green-400 text-sm mt-2"
                            >
                                Merci pour votre inscription!
                            </motion.p>
                        )}
                    </div>
                </div>

                {/* Bottom Section with Copyright and Links */}
                <div className="border-t border-gray-800 mt-12 pt-8">
                    <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-center md:text-left text-gray-400 text-sm">
                            © {currentYear} <span className="text-green-400">Terrana FC</span>. Tous droits réservés.
                        </div>
                        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-400">
                            <Link to="/privacy" className="hover:text-green-400 transition-colors relative group">
                                Politique de confidentialité
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-400 group-hover:w-full transition-all duration-300"></span>
                            </Link>
                            <Link to="/terms" className="hover:text-green-400 transition-colors relative group">
                                Conditions d'utilisation
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-400 group-hover:w-full transition-all duration-300"></span>
                            </Link>
                            <Link to="/faq" className="hover:text-green-400 transition-colors relative group">
                                FAQ
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-400 group-hover:w-full transition-all duration-300"></span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};



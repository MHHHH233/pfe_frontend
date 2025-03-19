import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import UserIcon from "../Client/Component/Icone";
import { Menu, Bell, Calendar, LayoutDashboard, X, ChevronRight, User, MapPin, MoreVertical, LogOut } from 'lucide-react';
import { authService } from "../lib/services/authoServices";

export const NavBar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [navbarVisible, setNavbarVisible] = useState(true);
    const [scrollPosition, setScrollPosition] = useState(0);
    const menuRef = useRef(null);
    const burgerRef = useRef(null);
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showReservations, setShowReservations] = useState(false);
    const notificationsRef = useRef(null);
    const reservationsRef = useRef(null);

    const userType = sessionStorage.getItem("type");
    const isLoggedIn = sessionStorage.getItem("token");

    // Enhanced scroll handling with popup closing
    useEffect(() => {
        let lastScroll = 0;
        let timeout;

        const handleScroll = () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                const currentScroll = window.scrollY;
                setScrollPosition(currentScroll);
                
                if (currentScroll < lastScroll || currentScroll < 50) {
                    setNavbarVisible(true);
                } else if (currentScroll > 50 && currentScroll > lastScroll) {
                    setMenuOpen(false);
                    setNavbarVisible(false);
                    // Close popups on scroll
                    setShowNotifications(false);
                    setShowReservations(false);
                }
                lastScroll = currentScroll;
            }, 50);
        };

        const handleClickOutside = (e) => {
            if (menuOpen && menuRef.current && !menuRef.current.contains(e.target) && 
                !burgerRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
    
        window.addEventListener("scroll", handleScroll);
        document.addEventListener("mousedown", handleClickOutside);
    
        return () => {
            window.removeEventListener("scroll", handleScroll);
            document.removeEventListener("mousedown", handleClickOutside);
            clearTimeout(timeout);
        };
    }, [menuOpen]);

    // Enhanced click outside handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Close menu when clicking outside
            if (menuOpen && menuRef.current && !menuRef.current.contains(event.target) && 
                !burgerRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
            // Close popups when clicking outside
            if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
            if (reservationsRef.current && !reservationsRef.current.contains(event.target)) {
                setShowReservations(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [menuOpen]);

    const menuVariants = {
        hidden: { 
            opacity: 0,
            y: -20,
            scale: 0.95
        },
        visible: { 
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                duration: 0.3,
                staggerChildren: 0.1
            }
        },
        exit: { 
            opacity: 0,
            y: -20,
            scale: 0.95,
            transition: { duration: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { 
            opacity: 1, 
            x: 0,
            transition: { type: "spring", stiffness: 300, damping: 24 }
        }
    };

    // Add animation variants for the logo
    const logoVariants = {
        initial: { 
            opacity: 0, 
            x: -20 
        },
        animate: { 
            opacity: 1, 
            x: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        },
        hover: {
            scale: 1.05,
            transition: {
                duration: 0.2,
                ease: "easeInOut"
            }
        },
        tap: {
            scale: 0.95
        }
    };

    const letterVariants = {
        hover: {
            y: [-1, -3, -1],
            transition: {
                duration: 0.3,
                ease: "easeInOut",
                repeat: Infinity
            }
        }
    };

    // Function to handle navigation and scroll to top
    const handleNavigation = (path) => {
        navigate(path);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Add logout handler
    const handleLogout = async () => {
        try {
            await authService.logout();
            sessionStorage.clear();
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <>
            {/* Main Navbar */}
            <motion.div
                initial={false}
                animate={{
                    y: navbarVisible ? 0 : -100,
                    opacity: navbarVisible ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className={`fixed top-0 left-0 right-0 z-50 ${
                    scrollPosition > 50 
                        ? "bg-black/80 backdrop-blur-md shadow-lg" 
                        : "bg-transparent"
                }`}
            >
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-20">
                        {/* Animated Brand Name */}
                        <motion.div
                            onClick={() => handleNavigation('/')}
                            className="cursor-pointer"
                        >
                            <motion.div
                                variants={logoVariants}
                                initial="initial"
                                animate="animate"
                                whileHover="hover"
                                whileTap="tap"
                                className="flex items-center"
                            >
                                <motion.span 
                                    className="text-white text-2xl font-bold flex items-center space-x-1"
                                >
                                    {/* Animate each letter */}
                                    {"TERRAIN".split("").map((letter, index) => (
                                        <motion.span
                                            key={index}
                                            variants={letterVariants}
                                            className="inline-block"
                                            style={{ 
                                                textShadow: '0 0 10px rgba(255,255,255,0.3)'
                                            }}
                                        >
                                            {letter}
                                        </motion.span>
                                    ))}
                                    <motion.span 
                                        className="text-green-400 ml-1"
                                        variants={letterVariants}
                                    >
                                        {"FC".split("").map((letter, index) => (
                                            <motion.span
                                                key={index}
                                                variants={letterVariants}
                                                className="inline-block"
                                            >
                                                {letter}
                                            </motion.span>
                                        ))}
                                    </motion.span>
                                </motion.span>
                            </motion.div>
                        </motion.div>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center space-x-8">
                            <NavLink 
                                to={isLoggedIn ? '/Client' : '/'} 
                                onClick={() => handleNavigation(isLoggedIn ? '/Client' : '/')}
                            >
                                Accueil
                            </NavLink>
                            <NavLink 
                                to="/reservation"
                                onClick={() => handleNavigation('/reservation')}
                            >
                                Reservation
                            </NavLink>
                            <NavLink 
                                to="/academie"
                                onClick={() => handleNavigation('/academie')}
                            >
                                Academie
                            </NavLink>

                            {/* Conditional Icons based on user type */}
                            {isLoggedIn && (
                                <div className="flex items-center space-x-4">
                                    {/* Notifications */}
                                    <div className="relative" ref={notificationsRef}>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="text-white relative"
                                            onClick={() => {
                                                setShowNotifications(!showNotifications);
                                                setShowReservations(false);
                                            }}
                                        >
                                            <Bell size={24} />
                                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                                        </motion.button>
                                        <NotificationsPopup 
                                            isOpen={showNotifications} 
                                            onClose={() => setShowNotifications(false)} 
                                        />
                                    </div>

                                    {/* Reservations */}
                                    <div className="relative" ref={reservationsRef}>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="text-white"
                                            onClick={() => {
                                                setShowReservations(!showReservations);
                                                setShowNotifications(false);
                                            }}
                                        >
                                            <Calendar size={24} />
                                        </motion.button>
                                        <ReservationsPopup 
                                            isOpen={showReservations} 
                                            onClose={() => setShowReservations(false)} 
                                        />
                                    </div>

                                    {/* Admin Dashboard - only for admins */}
                                    {userType === "admin" && (
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="text-white"
                                            onClick={() => handleNavigation('/Admin')}
                                        >
                                            <LayoutDashboard size={24} />
                                        </motion.button>
                                    )}
                                </div>
                            )}

                            {isLoggedIn ? (
                                <UserIcon />
                            ) : (
                                <LoginButton 
                                    to="/sign-in"
                                    onClick={() => handleNavigation('/sign-in')}
                                >
                                    Se connecter
                                </LoginButton>
                            )}
                        </div>

                        {/* Mobile Menu Button - Only for Nav Links */}
                        <motion.button
                            ref={burgerRef}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="lg:hidden p-2 rounded-full hover:bg-white/10 transition-colors"
                        >
                            {menuOpen ? <X size={24} /> : <Menu size={24} />}
                        </motion.button>
                    </div>
                </div>

                {/* Mobile Menu - Only Navigation Links */}
                <AnimatePresence>
                    {menuOpen && (
                        <motion.div
                            ref={menuRef}
                            variants={menuVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="lg:hidden fixed inset-0 bg-black/95 z-40 pt-20"
                        >
                            <motion.div variants={menuVariants} className="container mx-auto px-4">
                                <div className="px-4 py-6 space-y-4">
                                    <MobileNavLink 
                                        to="/"
                                        variants={itemVariants}
                                        setMenuOpen={setMenuOpen}
                                        onClick={() => handleNavigation('/')}
                                    >
                                        Accueil
                                    </MobileNavLink>
                                    <MobileNavLink 
                                        to="/reservation"
                                        variants={itemVariants}
                                        setMenuOpen={setMenuOpen}
                                        onClick={() => handleNavigation('/reservation')}
                                    >
                                        Reservation
                                    </MobileNavLink>
                                    <MobileNavLink 
                                        to="/academie"
                                        variants={itemVariants}
                                        setMenuOpen={setMenuOpen}
                                        onClick={() => handleNavigation('/academie')}
                                    >
                                        Academie
                                    </MobileNavLink>

                                    {/* Add login/logout based on auth state */}
                                    {isLoggedIn ? (
                                        <motion.div variants={itemVariants}>
                                            <div
                                                className="block text-red-500 text-lg font-medium px-4 py-2 
                                                         rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer"
                                                onClick={() => {
                                                    setMenuOpen(false);
                                                    handleLogout();
                                                }}
                                            >
                                                Se déconnecter
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div variants={itemVariants}>
                                            <LoginButton 
                                                to="/sign-in"
                                                onClick={() => {
                                                    setMenuOpen(false);
                                                    handleNavigation('/sign-in');
                                                }}
                                                fullWidth
                                            >
                                                Se connecter
                                            </LoginButton>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Mobile Bottom Navigation Bar */}
            {isLoggedIn && (
                <>
                    {/* Backdrop for mobile popups */}
                    <AnimatePresence>
                        {(showNotifications || showReservations) && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="lg:hidden fixed inset-0 bg-black/50 z-40"
                                onClick={() => {
                                    setShowNotifications(false);
                                    setShowReservations(false);
                                }}
                            />
                        )}
                    </AnimatePresence>

                    {/* Bottom Navigation Bar */}
                    <motion.div 
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        className="lg:hidden fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md 
                                 border-t border-gray-800 z-50 px-6 py-3"
                    >
                        <div className="flex items-center justify-around">
                            {/* Notifications */}
                            <div className="relative" ref={notificationsRef}>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="text-white relative p-2"
                                    onClick={() => {
                                        setShowNotifications(!showNotifications);
                                        setShowReservations(false);
                                    }}
                                >
                                    <Bell size={24} />
                                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                                </motion.button>
                            </div>

                            {/* Reservations */}
                            <div className="relative" ref={reservationsRef}>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="text-white p-2"
                                    onClick={() => {
                                        setShowReservations(!showReservations);
                                        setShowNotifications(false);
                                    }}
                                >
                                    <Calendar size={24} />
                                </motion.button>
                            </div>

                            {/* Profile */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="text-white p-2"
                                onClick={() => handleNavigation('/Client')}
                            >
                                <User size={24} />
                            </motion.button>

                            {/* Admin Dashboard (if admin) */}
                            {userType === "admin" && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="text-white p-2"
                                    onClick={() => handleNavigation('/Admin')}
                                >
                                    <LayoutDashboard size={24} />
                                </motion.button>
                            )}

                            {/* Logout */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="text-red-500 p-2"
                                onClick={handleLogout}
                            >
                                <LogOut size={24} />
                            </motion.button>
                        </div>
                    </motion.div>
                </>
            )}

            {/* Popups */}
            <NotificationsPopup isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
            <ReservationsPopup isOpen={showReservations} onClose={() => setShowReservations(false)} />
        </>
    );
};

const NavLink = ({ to, children, onClick }) => (
    <div
        onClick={onClick}
        className="relative group cursor-pointer"
    >
        <span className="text-white text-lg font-medium transition-colors duration-200 group-hover:text-green-400">
            {children}
        </span>
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-400 transform origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
    </div>
);

const MobileNavLink = ({ to, children, variants, setMenuOpen, onClick }) => (
    <motion.div variants={variants}>
        <div
            className="block text-white text-lg font-medium px-4 py-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            onClick={() => {
                if (onClick) onClick();
                if (setMenuOpen) setMenuOpen(false);
            }}
        >
            {children}
        </div>
    </motion.div>
);

const LoginButton = ({ to, children, fullWidth, onClick }) => (
    <div
        onClick={onClick}
        className={`inline-flex items-center justify-center
            px-6 py-2.5 rounded-full
            bg-green-500 hover:bg-green-400
            text-black font-semibold
            transform transition-all duration-200
            hover:shadow-lg hover:scale-105
            active:scale-95 cursor-pointer
            ${fullWidth ? 'w-full' : ''}
        `}
    >
        {children}
    </div>
);

const NotificationsPopup = ({ isOpen, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="fixed lg:absolute bottom-16 lg:bottom-auto lg:top-full left-0 right-0 
                             lg:right-0 lg:left-auto lg:mt-2 lg:w-80 bg-gray-900 
                             lg:rounded-xl rounded-t-xl shadow-lg border-t lg:border 
                             border-gray-700 overflow-hidden z-50 max-h-[80vh] lg:max-h-[600px]"
                >
                    <NotificationsContent />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const ReservationsPopup = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(new Date());
    
    // Generate calendar days
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const currentDate = new Date();
    
    const reservations = [
        {
            id: 1,
            time: "11:35",
            endTime: "13:05",
            terrain: "Terrain A-205",
            title: "Football Match",
            coach: "Brooklyn Williamson"
        },
        {
            id: 2,
            time: "13:15",
            endTime: "14:45",
            terrain: "Terrain B-168",
            title: "Training Session",
            coach: "Julia Watson"
        },
        {
            id: 3,
            time: "15:10",
            endTime: "16:40",
            terrain: "Terrain F-403",
            title: "Practice Game",
            coach: "Jenny Alexander"
        }
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="fixed lg:absolute bottom-16 lg:bottom-auto lg:top-full left-0 right-0 
                             lg:right-0 lg:left-auto lg:mt-2 lg:w-96 bg-gray-900 
                             lg:rounded-xl rounded-t-xl shadow-lg border-t lg:border 
                             border-gray-700 overflow-hidden z-50 max-h-[80vh] lg:max-h-[600px]"
                >
                    {/* Header with Date */}
                    <div className="p-4 border-b border-gray-700">
                        <div className="flex items-baseline justify-between">
                            <div>
                                <span className="text-3xl font-bold text-white">
                                    {currentDate.getDate()}
                                </span>
                                <span className="ml-2 text-sm text-gray-400">
                                    {new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', year: 'numeric' }).format(currentDate)}
                                </span>
                            </div>
                            <span className="px-2 py-1 text-xs bg-green-500/20 text-green-500 rounded-full">
                                Today
                            </span>
                        </div>

                        {/* Calendar Strip */}
                        <div className="mt-4 flex justify-between">
                            {[...Array(7)].map((_, index) => {
                                const date = new Date();
                                date.setDate(currentDate.getDate() - 3 + index);
                                const isToday = date.getDate() === currentDate.getDate();
                                
                                return (
                                    <div 
                                        key={index}
                                        className={`flex flex-col items-center ${
                                            isToday ? 'text-green-500' : 'text-gray-400'
                                        }`}
                                    >
                                        <span className="text-xs">{days[date.getDay()]}</span>
                                        <span className={`mt-1 w-8 h-8 flex items-center justify-center rounded-full
                                            ${isToday ? 'bg-green-500 text-white' : 'hover:bg-gray-800'}`}>
                                            {date.getDate()}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Schedule List */}
                    <div className="divide-y divide-gray-700">
                        {reservations.map((res) => (
                            <motion.div
                                key={res.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-4 hover:bg-gray-800 transition-colors"
                            >
                                <div className="flex">
                                    {/* Time Column */}
                                    <div className="w-20 text-gray-400">
                                        <div className="text-sm">{res.time}</div>
                                        <div className="text-xs opacity-60">{res.endTime}</div>
                                    </div>
                                    
                                    {/* Details Column */}
                                    <div className="flex-1 ml-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h4 className="text-white font-medium">{res.title}</h4>
                                                <div className="flex items-center mt-1 space-x-2 text-sm text-gray-400">
                                                    <MapPin size={14} />
                                                    <span>{res.terrain}</span>
                                                </div>
                                                <div className="flex items-center mt-1 space-x-2 text-sm text-gray-400">
                                                    <User size={14} />
                                                    <span>{res.coach}</span>
                                                </div>
                                            </div>
                                            <button className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors">
                                                <MoreVertical size={16} className="text-gray-400" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-700">
                        <button
                            onClick={() => {
                                onClose();
                                navigate('/reservation');
                            }}
                            className="w-full flex items-center justify-center space-x-2 px-4 py-2 
                                     bg-green-500 hover:bg-green-600 text-white rounded-lg 
                                     transition-colors duration-200"
                        >
                            <span>Voir toutes les réservations</span>
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const IconContainer = ({ children, className }) => (
    <div className={`relative ${className}`}>
        {children}
    </div>
);

// Add these new components for the popup content
const NotificationsContent = () => {
    const notifications = [
        {
            id: 1,
            title: "Réservation confirmée",
            message: "Votre réservation pour le terrain A a été confirmée",
            time: "Il y a 5 minutes",
            isNew: true
        },
        {
            id: 2,
            title: "Nouveau message",
            message: "Vous avez reçu un nouveau message de l'administrateur",
            time: "Il y a 1 heure",
            isNew: true
        },
        {
            id: 3,
            title: "Rappel",
            message: "Votre réservation commence dans 1 heure",
            time: "Il y a 2 heures",
            isNew: false
        }
    ];

    return (
        <div className="max-h-[60vh] overflow-y-auto">
            {notifications.map((notif) => (
                <motion.div
                    key={notif.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`p-4 border-b border-gray-700 hover:bg-gray-800 cursor-pointer
                        ${notif.isNew ? 'bg-gray-800/50' : ''}`}
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="text-sm font-medium text-white">{notif.title}</h4>
                            <p className="text-sm text-gray-400 mt-1">{notif.message}</p>
                            <span className="text-xs text-gray-500 mt-2 block">{notif.time}</span>
                        </div>
                        {notif.isNew && (
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        )}
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

const ReservationsContent = ({ onClose }) => {
    const navigate = useNavigate();
    const reservations = [
        {
            id: 1,
            terrain: "Terrain A",
            date: "Aujourd'hui",
            time: "14:00 - 15:30",
            status: "confirmed"
        },
        {
            id: 2,
            terrain: "Terrain B",
            date: "Demain",
            time: "10:00 - 11:30",
            status: "pending"
        },
        {
            id: 3,
            terrain: "Terrain C",
            date: "23 Mars",
            time: "16:00 - 17:30",
            status: "confirmed"
        }
    ];

    return (
        <>
            <div className="max-h-[60vh] overflow-y-auto">
                {reservations.map((res) => (
                    <motion.div
                        key={res.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-4 border-b border-gray-700 hover:bg-gray-800 cursor-pointer"
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="text-sm font-medium text-white">{res.terrain}</h4>
                                <p className="text-xs text-gray-400 mt-1">{res.date} • {res.time}</p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs
                                ${res.status === 'confirmed' 
                                    ? 'bg-green-500/20 text-green-500' 
                                    : 'bg-yellow-500/20 text-yellow-500'
                                }`}>
                                {res.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>
            <div className="p-4 border-t border-gray-700">
                <button
                    onClick={() => {
                        onClose();
                        navigate('/reservation');
                    }}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 
                             bg-green-500 hover:bg-green-600 text-white rounded-lg 
                             transition-colors duration-200"
                >
                    <span>Voir toutes les réservations</span>
                    <ChevronRight size={16} />
                </button>
            </div>
        </>
    );
};

export default NavBar;
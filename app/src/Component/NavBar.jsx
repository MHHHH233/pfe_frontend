import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import UserIcon from "../Client/Component/Icone";
import { Menu, Bell, Calendar, LayoutDashboard, X, ChevronRight, User, MapPin, MoreVertical, LogOut } from 'lucide-react';
import { authService } from "../lib/services/authoServices";
import reservationService from '../lib/services/user/reservationServices';
import terraLogo from '../img/terraLogo.png'; // Import the new logo

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
                }
                lastScroll = currentScroll;
            }, 50);
        };

        window.addEventListener("scroll", handleScroll);
    
        return () => {
            window.removeEventListener("scroll", handleScroll);
            clearTimeout(timeout);
        };
    }, [menuOpen]);

    // Improved click outside handler for menu
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Close menu when clicking outside
            if (menuOpen && menuRef.current && !menuRef.current.contains(event.target) && 
                burgerRef.current && !burgerRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
            
            // Handle notifications popup
            if (showNotifications && notificationsRef.current && 
                !notificationsRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
            
            // Handle reservations popup
            if (showReservations && reservationsRef.current && 
                !reservationsRef.current.contains(event.target)) {
                setShowReservations(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [menuOpen, showNotifications, showReservations]);

    const menuVariants = {
        hidden: { 
            x: "-100%",
            opacity: 0,
        },
        visible: { 
            x: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30,
                staggerChildren: 0.07
            }
        },
        exit: { 
            x: "-100%",
            opacity: 0,
            transition: { 
                duration: 0.3,
                ease: "easeInOut" 
            }
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
            {/* Main Navbar - Fixed at the top */}
            <motion.div
                initial={false}
                animate={{
                    y: navbarVisible ? 0 : -100,
                    opacity: navbarVisible ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="fixed top-0 left-0 right-0 z-50"
            >
                <div className={`container max-w-3xl mx-auto my-4 px-4 py-2 rounded-xl pointer-events-auto ${
                    scrollPosition > 50 
                        ? "bg-black/80 backdrop-blur-md shadow-xl border border-gray-800" 
                        : "bg-black/60 backdrop-blur-sm border border-white/10"
                }`}>
                    <div className="flex items-center justify-between h-16">
                        {/* Logo - Improved alignment */}
                        <div className="flex items-center">
                            <motion.div
                                onClick={() => handleNavigation('/')}
                                className="cursor-pointer flex items-center"
                            >
                                <motion.div
                                    variants={logoVariants}
                                    initial="initial"
                                    animate="animate"
                                    whileHover="hover"
                                    whileTap="tap"
                                    className="flex items-center"
                                >
                                    <motion.img 
                                        src={terraLogo} 
                                        alt="Terrana FC Logo" 
                                        className="h-14 w-auto" 
                                    />
                                </motion.div>
                            </motion.div>
                            
                            {/* Vertical divider - only visible on large screens */}
                            <div className="hidden lg:block h-10 w-px bg-gray-400/30 mx-8"></div>
                            
                            {/* Desktop Navigation - Moved inside first div for better alignment */}
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
                            </div>
                        </div>

                        {/* User Actions - separate from navigation links */}
                        <div className="hidden lg:flex items-center space-x-6">
                            {/* Conditional Icons based on user type */}
                            {isLoggedIn && (
                                <div className="flex items-center space-x-4 mr-2">
                                    {/* Notifications */}
                                    <div className="relative" ref={notificationsRef}>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="text-white relative"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent event bubbling
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
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent event bubbling
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

                        {/* Mobile Menu Button - With improved visibility */}
                        <motion.button
                            ref={burgerRef}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setMenuOpen(!menuOpen)}
                            className={`lg:hidden p-3 rounded-full 
                                ${menuOpen 
                                ? "bg-white text-green-600 shadow-md" 
                                : "bg-green-500/20 hover:bg-green-500/30 text-white shadow-lg"} 
                                transition-colors duration-300`}
                        >
                            {menuOpen ? <X size={24} /> : <Menu size={24} />}
                        </motion.button>
                    </div>
                </div>

                {/* Mobile Menu - Slide in from left animation */}
                <AnimatePresence>
                    {menuOpen && (
                        <>
                            {/* Backdrop overlay */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                                onClick={() => setMenuOpen(false)}
                            />
                            
                            {/* Slide-in menu */}
                            <motion.div
                                ref={menuRef}
                                variants={menuVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="lg:hidden fixed inset-y-0 left-0 w-4/5 max-w-sm bg-gradient-to-br from-green-600 to-green-800 z-50 shadow-2xl overflow-y-auto"
                            >
                                <div className="px-8 py-6">
                                    {/* Logo in menu */}
                                    <div className="flex justify-center mb-8">
                                        <motion.img 
                                            src={terraLogo} 
                                            alt="Terrana FC Logo" 
                                            className="h-20 w-auto" 
                                        />
                                    </div>
                                    
                                    {/* Close button */}
                                    <div className="absolute top-6 right-6">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => setMenuOpen(false)}
                                            className="p-2 rounded-full bg-white/10 text-white"
                                        >
                                            <X size={20} />
                                        </motion.button>
                                    </div>
                                    
                                    {/* Menu items */}
                                    <div className="space-y-1 mt-4">
                                        <MobileNavLink 
                                            to={isLoggedIn ? '/Client' : '/'}
                                            variants={itemVariants}
                                            setMenuOpen={setMenuOpen}
                                            onClick={() => handleNavigation(isLoggedIn ? '/Client' : '/')}
                                            icon={<User size={20} />}
                                        >
                                            Accueil
                                        </MobileNavLink>
                                        <MobileNavLink 
                                            to="/reservation"
                                            variants={itemVariants}
                                            setMenuOpen={setMenuOpen}
                                            onClick={() => handleNavigation('/reservation')}
                                            icon={<Calendar size={20} />}
                                        >
                                            Reservation
                                        </MobileNavLink>
                                        <MobileNavLink 
                                            to="/academie"
                                            variants={itemVariants}
                                            setMenuOpen={setMenuOpen}
                                            onClick={() => handleNavigation('/academie')}
                                            icon={<MapPin size={20} />}
                                        >
                                            Academie
                                        </MobileNavLink>
                                        
                                        {isLoggedIn && (
                                            <>
                                                <MobileNavLink 
                                                    to="/profile"
                                                    variants={itemVariants}
                                                    setMenuOpen={setMenuOpen}
                                                    onClick={() => handleNavigation('/profile')}
                                                    icon={<User size={20} />}
                                                >
                                                    Profile
                                                </MobileNavLink>
                                                
                                                {userType === "admin" && (
                                                    <MobileNavLink 
                                                        to="/Admin"
                                                        variants={itemVariants}
                                                        setMenuOpen={setMenuOpen}
                                                        onClick={() => handleNavigation('/Admin')}
                                                        icon={<LayoutDashboard size={20} />}
                                                    >
                                                        Dashboard Admin
                                                    </MobileNavLink>
                                                )}
                                            </>
                                        )}

                                        {/* Divider */}
                                        <div className="my-4 border-t border-white/20"></div>
                                        
                                        {/* Add login/logout based on auth state */}
                                        {isLoggedIn ? (
                                            <motion.div variants={itemVariants}>
                                                <div
                                                    className="flex items-center space-x-4 text-white text-lg font-medium 
                                                           px-4 py-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 active:bg-red-500/40
                                                           transition-colors cursor-pointer"
                                                    onClick={() => {
                                                        setMenuOpen(false);
                                                        handleLogout();
                                                    }}
                                                >
                                                    <LogOut size={20} />
                                                    <span>Se déconnecter</span>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <motion.div variants={itemVariants} className="mt-4">
                                                <div
                                                    onClick={() => {
                                                        setMenuOpen(false);
                                                        handleNavigation('/sign-in');
                                                    }}
                                                    className="flex items-center justify-center space-x-2
                                                             px-6 py-3 rounded-lg
                                                             bg-white text-green-700 font-semibold
                                                             transform transition-all duration-200
                                                             hover:shadow-lg hover:scale-105
                                                             active:scale-95 cursor-pointer w-full"
                                                >
                                                    <span>Se connecter</span>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                    
                                    {/* Footer text with dynamic year */}
                                    <div className="mt-12 text-center text-white/60 text-sm">
                                        <p>© {new Date().getFullYear()} Terrana FC</p>
                                        <p className="mt-1">Tous droits réservés</p>
                                    </div>
                                </div>
                            </motion.div>
                        </>
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
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent event bubbling
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
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent event bubbling
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
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent event bubbling
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
                                onClick={() => handleNavigation('/profile')}
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

            {/* Add spacer to prevent content from being hidden under the fixed navbar */}
            <div className="h-28"></div>

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

const MobileNavLink = ({ to, children, variants, setMenuOpen, onClick, icon }) => (
    <motion.div variants={variants}>
        <div
            className="flex items-center space-x-4 text-white text-lg font-medium 
                     px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/30
                     transition-colors cursor-pointer"
            onClick={() => {
                if (onClick) onClick();
                if (setMenuOpen) setMenuOpen(false);
            }}
        >
            {icon && <span className="text-white">{icon}</span>}
            <span>{children}</span>
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
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const popupContentRef = useRef(null);

    // Fetch notifications when popup opens
    useEffect(() => {
        const fetchNotifications = async () => {
            if (!isOpen) return;
            
            try {
                setLoading(true);
                setError(null);
                
                // Generate system notifications based on upcoming reservations
                const upcomingRes = await reservationService.getUpcomingReservations();
                if (upcomingRes && upcomingRes.status === 'success' && upcomingRes.data) {
                    const resNotifications = generateNotificationsFromReservations(upcomingRes.data);
                    setNotifications(resNotifications);
                } else {
                    // Fallback to default notifications if API fails
                    setNotifications(getDefaultNotifications());
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
                setError('Failed to load notifications');
                // Use default notifications on error
                setNotifications(getDefaultNotifications());
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [isOpen]);

    // Generate notifications from reservations
    const generateNotificationsFromReservations = (reservations) => {
        const currentDate = new Date();
        const notifs = [];
        
        // Sort reservations by date/time (soonest first)
        const sortedReservations = [...reservations].sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.heure}`);
            const dateB = new Date(`${b.date}T${b.heure}`);
            return dateA - dateB;
        });
        
        // Process reservations to generate different types of notifications
        sortedReservations.forEach((res, index) => {
            const resDate = new Date(`${res.date}T${res.heure}`);
            const hoursUntil = Math.round((resDate - currentDate) / (1000 * 60 * 60));
            
            // Create different notification types based on timing and status
            if (hoursUntil <= 24 && hoursUntil > 0) {
                notifs.push({
                    id: `upcoming-${res.id_reservation}`,
                    title: "Upcoming Reservation",
                    message: `Your reservation at Terrain #${res.id_terrain} is coming up in ${hoursUntil} hour${hoursUntil !== 1 ? 's' : ''}.`,
                    time: "Just now",
                    isNew: true,
                    date: new Date()
                });
            }
            
            if (res.etat === 'en attente') {
                notifs.push({
                    id: `pending-${res.id_reservation}`,
                    title: "Pending Confirmation",
                    message: `Your reservation #${res.num_res} is pending confirmation. We'll notify you when it's confirmed.`,
                    time: "2 hours ago",
                    isNew: index < 2, // First 2 are new
                    date: new Date(Date.now() - 7200000)
                });
            } else if (res.etat === 'reserver') {
                notifs.push({
                    id: `confirmed-${res.id_reservation}`,
                    title: "Reservation Confirmed",
                    message: `Your reservation for Terrain #${res.id_terrain} on ${new Date(res.date).toLocaleDateString()} has been confirmed!`,
                    time: "1 day ago",
                    isNew: index === 0, // Only most recent is new
                    date: new Date(Date.now() - 86400000)
                });
            }
        });
        
        // Add a welcome notification if there aren't enough notifications
        if (notifs.length < 3) {
            notifs.push({
                id: "welcome",
                title: "Welcome to TerrainFC",
                message: "Thanks for using our platform. Book your first reservation now!",
                time: "3 days ago",
                isNew: false,
                date: new Date(Date.now() - 259200000)
            });
        }
        
        // Sort notifications by date (newest first)
        return notifs.sort((a, b) => b.date - a.date);
    };
    
    // Default notifications as fallback
    const getDefaultNotifications = () => [
        {
            id: 1,
            title: "Reservation Confirmed",
            message: "Your upcoming reservation has been confirmed",
            time: "Just now",
            isNew: true,
            date: new Date()
        },
        {
            id: 2,
            title: "Welcome to TerrainFC",
            message: "Thanks for joining! Explore our terrains to book your first reservation.",
            time: "1 hour ago",
            isNew: true,
            date: new Date(Date.now() - 3600000)
        },
        {
            id: 3,
            title: "New Features Available",
            message: "We've added new features to our platform. Check them out!",
            time: "2 days ago",
            isNew: false,
            date: new Date(Date.now() - 172800000)
        }
    ];

    // Handle click inside to prevent closing
    const handlePopupClick = (e) => {
        e.stopPropagation();
    };

    // Format time based on timestamp
    const formatTimeAgo = (date) => {
        if (!date) return '';
        
        const now = new Date();
        const diff = now - date;
        
        // Convert to appropriate time units
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
        if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
        if (days < 30) return `${days} day${days !== 1 ? 's' : ''} ago`;
        
        return date.toLocaleDateString();
    };

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
                    ref={popupContentRef}
                    onClick={handlePopupClick}
                >
                    {/* Header */}
                    <div className="p-4 border-b border-gray-700">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-white">Notifications</h3>
                            <span className="px-2 py-0.5 bg-green-500/20 text-green-500 rounded-full text-xs">
                                {notifications.filter(n => n.isNew).length} new
                            </span>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-3 bg-red-500/10 border-b border-red-500/20">
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Loading State */}
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
                        </div>
                    ) : (
                        /* Notifications List */
                        <div className="divide-y divide-gray-700 overflow-y-auto max-h-[60vh]">
                            {notifications.length > 0 ? (
                                notifications.map((notif) => (
                                    <motion.div
                                        key={notif.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className={`p-4 hover:bg-gray-800 cursor-pointer transition-all duration-200
                                            ${notif.isNew ? 'bg-gray-800/50' : ''}`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="text-sm font-medium text-white">{notif.title}</h4>
                                                <p className="text-sm text-gray-400 mt-1">{notif.message}</p>
                                                <span className="text-xs text-gray-500 mt-2 block">{notif.time}</span>
                                            </div>
                                            {notif.isNew && (
                                                <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></span>
                                            )}
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="p-8 text-center">
                                    <Bell className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                                    <h3 className="text-lg font-medium text-white mb-2">No Notifications</h3>
                                    <p className="text-gray-400">You're all caught up!</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-700">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onClose();
                            }}
                            className="w-full flex items-center justify-center space-x-2 px-4 py-2 
                                   bg-gray-700 hover:bg-gray-600 text-white rounded-lg 
                                   transition-colors duration-200"
                        >
                            <span>Mark All as Read</span>
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const ReservationsPopup = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [upcomingReservations, setUpcomingReservations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const popupContentRef = useRef(null);
    
    // Generate calendar days
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const currentDate = new Date();

    // Add event listener to prevent closing when clicking inside the popup
    useEffect(() => {
        // Skip if popup is not open
        if (!isOpen) return;
        
        const handleOutsideClick = (event) => {
            // Prevent closing when clicking inside the popup
            if (popupContentRef.current && !popupContentRef.current.contains(event.target)) {
                onClose();
            }
        };
        
        // Add the event listener to the document
        document.addEventListener('mousedown', handleOutsideClick);
        
        // Cleanup
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isOpen, onClose]);

    // Fetch upcoming reservations when popup opens
    useEffect(() => {
        const fetchReservations = async () => {
            if (!isOpen) return;
            
            try {
                setLoading(true);
                setError(null);
                
                // Get upcoming reservations
                const response = await reservationService.getUpcomingReservations();
                if (response && response.data) {
                    setUpcomingReservations(response.data);
                }
            } catch (error) {
                console.error('Error fetching reservations:', error);
                setError('Failed to load reservations');
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, [isOpen]);

    // Get reservations for a specific date
    const getReservationsForDate = (date) => {
        return upcomingReservations.filter(res => {
            const reservationDate = new Date(res.date);
            return reservationDate.toDateString() === date.toDateString();
        });
    };

    // Handle date selection - prevent event propagation
    const handleDateSelect = (date, e) => {
        if (e) e.stopPropagation();
        setSelectedDate(date);
    };

    // Handle click inside to prevent closing
    const handlePopupClick = (e) => {
        e.stopPropagation();
    };

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
                    ref={popupContentRef}
                    onClick={handlePopupClick}
                >
                    {/* Header with Date */}
                    <div className="p-4 border-b border-gray-700">
                        <div className="flex items-baseline justify-between">
                            <div>
                                <span className="text-3xl font-bold text-white">
                                    {selectedDate.getDate()}
                                </span>
                                <span className="ml-2 text-sm text-gray-400">
                                    {new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', year: 'numeric' }).format(selectedDate)}
                                </span>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                                selectedDate.toDateString() === currentDate.toDateString()
                                    ? 'bg-green-500/20 text-green-500'
                                    : 'bg-gray-500/20 text-gray-400'
                            }`}>
                                {selectedDate.toDateString() === currentDate.toDateString() ? 'Today' : 'Selected'}
                            </span>
                        </div>

                        {/* Calendar Strip - Improved UI */}
                        <div className="mt-4 flex justify-between">
                            {[...Array(7)].map((_, index) => {
                                const date = new Date(currentDate);
                                date.setDate(currentDate.getDate() - 3 + index);
                                const isSelected = date.toDateString() === selectedDate.toDateString();
                                const isToday = date.toDateString() === currentDate.toDateString();
                                const hasReservations = getReservationsForDate(date).length > 0;
                                
                                return (
                                    <div 
                                        key={index}
                                        onClick={(e) => handleDateSelect(date, e)}
                                        className={`flex flex-col items-center cursor-pointer transition-all duration-200 
                                            p-1 rounded-lg ${isSelected ? 'bg-gray-800' : 'hover:bg-gray-800/50'}`}
                                    >
                                        <span className={`text-xs ${isSelected ? 'text-green-500' : 'text-gray-400'}`}>
                                            {days[date.getDay()]}
                                        </span>
                                        <span className={`mt-1 w-8 h-8 flex items-center justify-center rounded-full relative
                                            ${isSelected ? 'bg-green-500 text-white' : 
                                              isToday ? 'bg-gray-700 text-white' : 
                                              'hover:bg-gray-700'}`}>
                                            {date.getDate()}
                                            {hasReservations && (
                                                <span className="absolute -bottom-1 w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                            )}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-4 bg-red-500/10 border-b border-red-500/20">
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Loading State */}
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
                        </div>
                    ) : (
                        /* Reservations List */
                        <div className="divide-y divide-gray-700 overflow-y-auto max-h-[50vh]">
                            {getReservationsForDate(selectedDate).length > 0 ? (
                                getReservationsForDate(selectedDate).map((res) => (
                                    <motion.div
                                        key={res.id_reservation}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="p-4 hover:bg-gray-800 transition-colors"
                                    >
                                        <div className="flex">
                                            {/* Time Column */}
                                            <div className="w-20 text-gray-400">
                                                <div className="text-sm">{res.heure?.substring(0, 5)}</div>
                                            </div>
                                            
                                            {/* Details Column */}
                                            <div className="flex-1 ml-4">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h4 className="text-white font-medium">
                                                            {res.name || res.Name || `Reservation #${res.num_res}`}
                                                        </h4>
                                                        <div className="flex items-center mt-1 space-x-2 text-sm text-gray-400">
                                                            <MapPin size={14} />
                                                            <span>Terrain #{res.id_terrain}</span>
                                                        </div>
                                                    </div>
                                                    <span className={`px-2 py-1 rounded-full text-xs
                                                        ${res.etat === 'reserver' 
                                                            ? 'bg-green-500/20 text-green-500' 
                                                            : res.etat === 'annuler'
                                                            ? 'bg-red-500/20 text-red-500'
                                                            : 'bg-yellow-500/20 text-yellow-500'
                                                        }`}>
                                                        {res.etat === 'reserver' ? 'Confirmed' : 
                                                         res.etat === 'annuler' ? 'Cancelled' : 'Pending'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="p-8 text-center">
                                    <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                                    <h3 className="text-lg font-medium text-white mb-2">No Reservations</h3>
                                    <p className="text-gray-400 mb-6">No reservations for this date.</p>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onClose();
                                            navigate('/reservation');
                                        }}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                                    >
                                        Book a Reservation
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-700">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onClose();
                                navigate('/profile');
                            }}
                            className="w-full flex items-center justify-center space-x-2 px-4 py-2 
                                     bg-green-500 hover:bg-green-600 text-white rounded-lg 
                                     transition-colors duration-200"
                        >
                            <span>View All Reservations</span>
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

export default NavBar;
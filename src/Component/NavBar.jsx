import { useState, useEffect, useRef } from "react";
import LogoLight from "../img/logoLight.png";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import UserIcon from "../Client/Component/Icone";

export const NavBar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [navbarVisible, setNavbarVisible] = useState(true);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [submenuOpen, setSubmenuOpen] = useState(false);
    const menuref = useRef(null);
    const burgeref = useRef(null);

    const isLoggedIn = sessionStorage.getItem("isLoggedIn")
    // console.log(isLoggedIn)

    const BurgerClicked = () => {
        setMenuOpen(!menuOpen);
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrollPosition(window.scrollY);
            if (window.scrollY > 200) {
                setNavbarVisible(false);
            } else {
                setNavbarVisible(true);
            }
        };
    
        const handleMouseMove = (e) => {
            if (submenuOpen || e.clientY < 100) {
                setNavbarVisible(true);
            } else if (window.scrollY > 200) {
                setNavbarVisible(false);
            }
        };
        
    
        window.addEventListener("scroll", handleScroll);
        window.addEventListener("mousemove", handleMouseMove);
    
        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [submenuOpen]);
    

    const LinkClicked = () => {
        setTimeout(() => setMenuOpen(false), 200);
    };

    const menuVariants = {
        hidden: { opacity: 0, x: "100%" },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: "100%" },
    };

    const submenuVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
    };

    return (
        <motion.div
            id="navbar"
            className={`fixed mb-32 top-0 left-0 w-full  z-50 transition-all duration-300 ${
                navbarVisible ? "opacity-100" : "opacity-0 pointer-events-none"
            } ${scrollPosition > 400 && navbarVisible ? "backdrop-blur-md shadow-lg" : ""}`}
        >
            <div className="container mx-auto">
                <div className="flex items-center justify-between py-4 px-4">
                    <Link to="/" className="flex-shrink-0">
                        <img
                            className="w-36 h-auto transition-transform duration-300 hover:scale-105"
                            src={LogoLight}
                            alt="Logo"
                        />
                    </Link>

                    <div className="hidden lg:flex space-x-8 items-center">
                        <NavLink to={isLoggedIn ? '/Client' : '/'}>Accueil</NavLink>
                        <NavLink to="/reservation">Reservation</NavLink>

                        {/* Academie with submenu */}
                        <div
                            className="relative flex justify-center"
                            onMouseEnter={() => setSubmenuOpen(true)}
                            onMouseLeave={() => setSubmenuOpen(false)}
                        >
                            <NavLink to="/academie">Academie</NavLink>                            
                        </div>

                        {
                                        isLoggedIn ? 
                                        <UserIcon/>
                                    :
                                    <LoginButton to="/sign-in" onClick={LinkClicked}>
                                        Se connecter
                                    </LoginButton>
                                    }
                    </div>

                    <div
                        ref={burgeref}
                        className="lg:hidden text-gray-50 text-2xl cursor-pointer hover:text-green-400 transition-colors duration-300"
                        onClick={BurgerClicked}
                    >
                        {menuOpen ? "✖" : "☰"}
                    </div>
                </div>

                <AnimatePresence>
                    {menuOpen && (
                        <motion.div
                            ref={menuref}
                            className="lg:hidden"
                            variants={menuVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{ duration: 0.5 }}
                        >
                            <ul className=" bg-opacity-35 backdrop-blur-md bg-medium-gray items-center rounded-3xl py-4 mt-2">
                                <MobileNavLink to={isLoggedIn ? '/Client' : '/'} onClick={LinkClicked}>
                                    Accueil
                                </MobileNavLink>
                                <MobileNavLink to="/reservation" onClick={LinkClicked}>
                                    Reservation
                                </MobileNavLink>
                                <MobileNavLink to="/academie" onClick={LinkClicked}>
                                    Academie
                                </MobileNavLink>
                                <MobileNavLink to="/contact" onClick={LinkClicked}>
                                    Contact
                                </MobileNavLink>
                                <li className="text-center py-4">
                                    {
                                        isLoggedIn ? 
                                        <div className="flex items-center justify-center">
                                            <UserIcon/>
                                        </div> 
                                    :
                                    <LoginButton to="/sign-in" onClick={LinkClicked}>
                                        Se connecter
                                    </LoginButton>
                                    }
                                </li>
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

const NavLink = ({ to, children }) => (
    <Link
        to={to}
        className="text-white text-lg font-semibold transition-colors duration-300 hover:text-green-400 relative group"
    >
        {children}
        <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-green-400 transition-all duration-300 group-hover:w-full"></span>
    </Link>
);

const MobileNavLink = ({ to, onClick, children }) => (
    <li className="text-center py-4">
        <Link
            to={to}
            className="text-white text-xl font-semibold transition-colors duration-300 hover:text-green-400"
            onClick={onClick}
        >
            {children}
        </Link>
    </li>
);

const LoginButton = ({ to, onClick, children }) => (
    <Link
        to={to}
        className="bg-green-500 text-gray-900 px-6 py-2 rounded-full text-lg font-bold transition-all duration-300 hover:bg-green-400 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        onClick={onClick}
    >
        {children}
    </Link>
);

const SubmenuLink = ({ to, children }) => (
    <li className="p-2">
        <Link to={to} className="block text-lime-50 font-medium hover:text-green-400 border-r-red-200 ">
            {children}
        </Link>
    </li>
);

export default NavBar;

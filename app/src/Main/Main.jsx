import { Route, Routes, useLocation } from "react-router-dom"
import { Footer } from "../Component/Fotter"
import { NavBar } from "../Component/NavBar"
import { LandingPage } from './LandingPage'
import Login from "./SignIn"
import SignInForm from "./SignUp"
import Reservations from './Reservation'
import ContactUsFullscreen from "../Component/Contactus"
import EnhancedClientDashboard from "../Client/ClientDashboard"
import AcademyPage from "./Academie"
import ProtectedRoute from "./ProtectedRoute" 
import PopupCard from "../Component/Reservations/Confirmation"
import FootballAdminDashboard from "../Admin/Admin"
import FindPlayerTeam from "../Players&Teams/Main"
import TournamentPage from "../Tournoi/Tournoi"
import AllEvents from "../Pages/AllEvents"
import ProfilePage from "../Client/Component/ProfilePage"
import AboutPage from "../Pages/AboutPage"
import ErrorPage from "../Pages/ErrorPage"
import FaqPage from "../Pages/FaqPage"
import PrivacyPolicy from "../Pages/PrivacyPolicy"
import TermsOfService from "../Pages/TermsOfService"
import ScrollToTop from "../Component/ScrollToTop"

export const Main = () => {
    // useEffect(( Loading ? <Loader/> : null), [Loading])
    const location = useLocation();
    const isAdminPage = location.pathname === "/Admin";
    
    return (
        <div className="flex flex-col min-h-screen">
            {!isAdminPage && <NavBar />}
            
            {/* Conditionally apply padding only when navbar is present */}
            <div className={`flex-grow ${!isAdminPage ? 'pt-20' : ''}`}>
                <PopupCard/>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/sign-in" element={<Login />} />
                    <Route path="/sign-up" element={<SignInForm />} />
                    <Route path="/contactus" element={<ContactUsFullscreen />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/players" element={<FindPlayerTeam />} />
                    <Route path="/tournoi" element={<TournamentPage/>} />
                    <Route path="/events" element={<AllEvents />} />
                    <Route path="/faq" element={<FaqPage />} />
                    <Route path="/terms" element={<TermsOfService />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    {/* Protected Routes */}
                    <Route 
                        path="/reservation" 
                        element={<Reservations />} 
                    />
                    <Route 
                        path="/Admin" 
                        element={
                            <ProtectedRoute>
                                <FootballAdminDashboard />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/Academie" 
                        element={<AcademyPage />} 
                    />
                    <Route 
                        path="/Client" 
                        element={
                            <ProtectedRoute>
                                <EnhancedClientDashboard />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/profile" 
                        element={
                            <ProtectedRoute>
                                <ProfilePage />
                            </ProtectedRoute>
                        } 
                    />
                    
                    {/* Error page - This will catch all unmatched routes */}
                    <Route path="*" element={<ErrorPage />} />
                </Routes>
            </div>

            {/* Only show footer on non-admin and non-client pages */}
            {!isAdminPage && location.pathname !== "/Client" && <Footer/>}
            
            {/* Add ScrollToTop component */}
            {!isAdminPage && <ScrollToTop />}
        </div>
    )
}

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
import AllTeams from "../Players&Teams/AllTeams"
import AllPlayers from "../Players&Teams/AllPlayers"
import TournamentPage from "../Tournoi/Tournoi"
import AllTournaments from "../Tournoi/AllTournaments"
import AllMatches from "../Tournoi/AllMatches"
import AllEvents from "../Pages/AllEvents"
import ProfilePage from "../Client/Component/ProfilePage"
import AboutPage from "../Pages/AboutPage"
import ErrorPage from "../Pages/ErrorPage"
import FaqPage from "../Pages/FaqPage"
import PrivacyPolicy from "../Pages/PrivacyPolicy"
import TermsOfService from "../Pages/TermsOfService"
import AllTerrains from "../Pages/AllTerrains"
import ScrollToTop from "../Component/ScrollToTop"
import GoogleCallback from "./GoogleCallback"
import ReportBug from "../Component/ReportBug"
import ChatBot from "./ChatBot"

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
                    <Route path="/auth/google/callback" element={<GoogleCallback />} />
                    <Route path="/contactus" element={<ContactUsFullscreen />} />
                    <Route path="/report-bug" element={<ReportBug />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/players" element={<FindPlayerTeam />} />
                    <Route path="/teams" element={<FindPlayerTeam />} /> {/* Alias route */}
                    <Route path="/all-teams" element={<AllTeams />} />
                    <Route path="/all-players" element={<AllPlayers />} />
                    <Route path="/tournoi" element={<TournamentPage/>} />
                    <Route path="/all-tournaments" element={<AllTournaments />} />
                    <Route path="/all-matches" element={<AllMatches />} />
                    <Route path="/events" element={<AllEvents />} />
                    <Route path="/faq" element={<FaqPage />} />
                    <Route path="/terms" element={<TermsOfService />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/all-terrains" element={<AllTerrains />} />
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
            
            {/* Add ScrollToTop component on the left side */}
            {!isAdminPage && <div className="fixed bottom-5 left-5 z-50"><ScrollToTop /></div>}
            
            {/* Add ChatBot component on the right side */}
            {!isAdminPage && <ChatBot />}
        </div>
    )
}

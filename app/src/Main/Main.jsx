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


export const Main = () => {
    // useEffect(( Loading ? <Loader/> : null), [Loading])
    const location = useLocation();
    return (
        <div>
            
            <div className="">
            {location.pathname !== "/Admin" &&<NavBar />}
            <PopupCard/>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/sign-in" element={<Login />} />
                    <Route path="/sign-up" element={<SignInForm />} />
                    <Route path="/contactus" element={<ContactUsFullscreen />} />
                    <Route path="/players" element={<FindPlayerTeam  />} />
                    <Route path="/tournoi" element={<TournamentPage/>} />
                    

                    
                    {/* Protected Routes */}
                    <Route 
                        path="/reservation" 
                        element={
                            
                                <Reservations />
                           
                        } 
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
                        element={
                            
                                <AcademyPage />
                            
                        } 
                    />
                    <Route 
                        path="/Client" 
                        element={
                            <ProtectedRoute>
                                <EnhancedClientDashboard />
                            </ProtectedRoute>
                        } 
                    />
                </Routes>
            {location.pathname !== "/Client" && location.pathname !== "/Admin" &&<Footer/>}
            </div>
        </div>
    )
}

import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "../Component/Loading";


const ProtectedRoute = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('http://localhost/PFR/3AFAK-PFE/backend/controleur/CheckSession.php', {
          method: 'GET',
          credentials: 'include', 
        });

        const data = await response.json();
        
        if (data.isLoggedIn) {
          setIsLoggedIn(true);
          setUserInfo(data);                    
          sessionStorage.setItem("isLoggedIn", data.isLoggedIn);
          sessionStorage.setItem("userId", data.user_id);
          sessionStorage.setItem("email", data.email);
          sessionStorage.setItem("nom", data.nom);
          sessionStorage.setItem("prenom", data.prenom);
          sessionStorage.setItem("type", data.type);
          sessionStorage.setItem("date_inscription",data.date_inscription);
          sessionStorage.setItem("telephone",data.telephone);

        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setIsLoggedIn(false);
      }
    };

    checkSession();
  }, []);

  if (isLoggedIn === null) return <Loader/>;

  return isLoggedIn ? children : <Navigate to="/sign-in" />;
};

export default ProtectedRoute;

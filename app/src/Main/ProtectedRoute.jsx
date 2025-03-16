import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "../Component/Loading";

const ProtectedRoute = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    const checkSession = () => {
      // Get the token from localStorage
      const token = sessionStorage.getItem('token');
      setIsLoggedIn(!!token); // Convert token to boolean
    };

    checkSession();
  }, []);

  if (isLoggedIn === null) return <Loader/>;

  return isLoggedIn ? children : <Navigate to="/sign-in" />;
};

export default ProtectedRoute;

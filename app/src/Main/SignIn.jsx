import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import background from "../img/background1.png";
import { Icon } from '@iconify/react';
import { authService } from "../lib/services/authoServices";
import GoogleLogin from "./GoogleLogin";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.from || "/profile";

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showVibration, setShowVibration] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const HandleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (showVibration) {
      const timer = setTimeout(() => {
        setShowVibration(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showVibration]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fieldErrors = validateFormData(formData);
    setErrors(fieldErrors);
  
    if (Object.keys(fieldErrors).length === 0) {
      try {
        const response = await authService.login(formData);
        
        if (response.status && response.data) {
          // Store token
          sessionStorage.setItem("token", response.data.user_token);
          
          // Store user info
          const userData = response.data.user;
          sessionStorage.setItem("userId", userData.id_compte);
          sessionStorage.setItem("email", userData.email);
          sessionStorage.setItem("type", userData.role);
          sessionStorage.setItem("name", userData.name);
          
          // Store today's reservation count
          sessionStorage.setItem("today_reservations_count", response.data.today_reservations_count || 0);
          // Store academy membership status
          sessionStorage.setItem("has_academie_membership", response.data.has_academie_membership);
          
          // Store academy memberships data if available
          if (response.data.academie_memberships && response.data.academie_memberships.length > 0) {
            // Store the full memberships array
            sessionStorage.setItem("academie_memberships", JSON.stringify(response.data.academie_memberships));
            
            // Store the first membership's ID for backward compatibility
            const firstMembership = response.data.academie_memberships[0];
            sessionStorage.setItem("academy_member_id", firstMembership.id_member);
          }
          
          // Store team information
          sessionStorage.setItem("has_teams", response.data.has_teams || false);
          
          if (response.data.has_teams && response.data.teams && response.data.teams.length > 0) {
            // Store the full teams array
            sessionStorage.setItem("teams", JSON.stringify(response.data.teams));
            
            // Store the first team's ID for easy access
            const firstTeam = response.data.teams[0];
            sessionStorage.setItem("id_teams", firstTeam.id_teams);
          }
          
          // Store userdetails as a JSON string
          sessionStorage.setItem("userdetails", JSON.stringify(userData));
          const pfp =  userData.pfp
          sessionStorage.setItem("pfp", pfp);

          // Navigate based on role or redirect path
          if (userData.role === "admin") {
            navigate("/profile");
          } else {
            navigate("/profile");
          }
        } else {
          // Handle error cases with vibration effect
          setShowVibration(true);
          
          // Set error message from response
          if (response.message) {
            setErrors({
              api: response.message
            });
          }
          
          // Set specific error for email field if available
          if (response.errors && response.errors.email) {
            setErrors(prev => ({
              ...prev,
              email: response.errors.email[0]
            }));
          }
          
          // Log the error response for debugging
          console.log("Authentication Error:", response);
        }
      } catch (error) {
        setShowVibration(true);
        console.log("Login Error:", error);
        
        // Check if error response has the expected structure
        if (error.response && error.response.data) {
          const errorData = error.response.data;
          
          setErrors({
            api: errorData.message || "An error occurred during login."
          });
          
          if (errorData.errors && errorData.errors.email) {
            setErrors(prev => ({
              ...prev,
              email: errorData.errors.email[0]
            }));
          }
        } else {
          setErrors({
            api: error.message || "An error occurred during login."
          });
        }
      }
    }
  };
  
  

const validateFormData = ({ email, password }) => {
  const errors = {};

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
      errors.email = "L'adresse email est obligatoire.";
  } else if (!emailRegex.test(email)) {
      errors.email = "Veuillez entrer une adresse email valide.";
  }

  if (!password) {
      errors.password = "Le mot de passe est obligatoire.";
  }

  return errors;
};


  return (
    <div className="relative min-h-screen bg-blend-overlay ">
      <img
        src={background}
        className="absolute inset-0 w-full h-full object-cover -z-10"
        alt="background"
      />

      <div className="relative flex flex-col items-center justify-center min-h-screen text-white ">
        <h1 className="lg:text-2xl text-xl font-bold mb-6 md:mt-10">
          Connectez-vous à votre compte
        </h1>

        <div className={`bg-dark-gray bg-opacity-35 p-10 rounded-lg w-11/12 max-w-md ${showVibration ? 'animate-vibrate' : ''}`}>
          <form onSubmit={handleSubmit}>
            <label className="block text-left text-sm font-medium mb-1">
              Adresse email
            </label>
            <input
              type="text"
              name="email"
              placeholder="a.@exemple.com"
              className={`w-full mb-4 p-3 focus:bg-gray-200 focus:scale-x-105 transition text-dark-gray rounded-lg outline-none border ${errors.email ? "border-red-500" : "border-gray-300"
                }`}
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <div className="mt-1 text-red-500 text-sm font-semibold bg-red-100 bg-opacity-20 p-2 rounded border border-red-500">
                {errors.email}
              </div>
            )}

            <label className="block text-left text-sm font-medium mb-1 mt-4">
              Mot de passe
            </label>
            <div className="relative  w-full">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="AzeR2309#?1"
                className={`w-full mb-4 p-3 focus:bg-gray-200 focus:scale-x-105 transition text-dark-gray rounded-lg outline-none border ${errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                value={formData.password}
                onChange={handleChange}
              />
              <button type="button" onClick={HandleShowPassword} className="absolute inset-y-0 right-3 bottom-4 flex items-center text-gray-600 focus:outline-none">
                <Icon icon={showPassword ? "mdi:eye-off" : "mdi:eye"} width="1.5em" height="1.5em" />
              </button>
            </div>

            {errors.password && (
              <div className="mt-1 text-red-500 text-sm font-semibold bg-red-100 bg-opacity-20 p-2 rounded border border-red-500">
                {errors.password}
              </div>
            )}

            {errors.api && (
              <div className="mt-1 mb-4 text-red-500 text-sm font-semibold bg-red-100 bg-opacity-20 p-2 rounded border border-red-500">
                {errors.api}
              </div>
            )}

            <div className="flex items-center justify-between mb-4 mt-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  className="mr-2"
                  checked={formData.rememberMe}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rememberMe: e.target.checked,
                    })
                  }
                />
                <span className="text-sm">Souviens-toi de moi</span>
              </div>
              <a
                href="#"
                className="text-sm text-bright-green hover:underline"
              >
                Mot de passe oublié ?
              </a>
            </div>

            <button
              type="submit"
              className="w-full p-3 active:bg-green-700 active:scale-95 bg-bright-green text-black font-semibold rounded-lg hover:bg-green-500 transition"
            >
              Se Connecter
            </button>
          </form>

          <div className="flex items-center justify-center my-6">
            <span className="block w-1/4 h-px bg-gray-500"></span>
            <span className="mx-4 text-sm font-medium text-gray-400">
              Ou
            </span>
            <span className="block w-1/4 h-px bg-gray-500"></span>
          </div>

          {/* Google Login Component */}
          <GoogleLogin />

          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Vous n'avez pas de compte ?
            </p>
            <Link
              to="/sign-up"
              className="text-bright-green text-sm hover:underline"
            >
              Créer un compte
            </Link>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes vibrate {
          0% { transform: translateX(0); }
          10% { transform: translateX(-5px); }
          20% { transform: translateX(5px); }
          30% { transform: translateX(-5px); }
          40% { transform: translateX(5px); }
          50% { transform: translateX(-5px); }
          60% { transform: translateX(5px); }
          70% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
          90% { transform: translateX(-5px); }
          100% { transform: translateX(0); }
        }
        
        .animate-vibrate {
          animation: vibrate 0.6s linear;
        }
      `}</style>
    </div>
  );
};

export default LoginForm;

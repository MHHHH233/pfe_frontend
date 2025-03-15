import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import background from "../img/background1.png";
import { Icon } from '@iconify/react';


const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const navigate = useNavigate()

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const HandleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fieldErrors = validateFormData(formData);
    setErrors(fieldErrors);
  
    if (Object.keys(fieldErrors).length === 0) {
      try {
        const response = await fetch('http://localhost/PFR/3AFAK-PFE/backend/Controleur/Login.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Important for session management
          body: JSON.stringify(formData),
        });
  
        const data = await response.json();
        
        if (!response.ok) {
          const apiErrors = {
            email: data.error.includes('Email') ? data.error : null,
            password: data.error.includes('password') ? data.error : null,
          };
          setErrors(apiErrors);
          throw new Error('Failed to login');
        }
  
        // Store user info in sessionStorage
        sessionStorage.setItem("userId", data.id_compte);
        sessionStorage.setItem("email", data.email);
        sessionStorage.setItem("nom", data.nom);
        sessionStorage.setItem("prenom", data.prenom);
        sessionStorage.setItem("type", data.type);
        navigate("/Client");
        if (data.type === "admin") {
          navigate("/Admin")
        }        
      } catch (error) {
        console.error("Error:", error);
        setErrors((prevErrors) => ({
          ...prevErrors,
          api: "An error occurred during login.",
        }));
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

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!password) {
      errors.password = "Le mot de passe est obligatoire.";
  } else if (!passwordRegex.test(password)) {
      errors.password = "Au moins 8 caractères, une lettre majuscule, une lettre minuscule, un chiffre.";
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

        <div className="bg-dark-gray bg-opacity-35 p-10 rounded-lg w-11/12 max-w-md">
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
              <div className="mt-1 text-red-500 text-sm">{errors.email}</div>
            )}

            <label className="block text-left text-sm font-medium mb-1">
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
              <div className="mt-1 text-red-500 text-sm">
                {errors.password}
              </div>
            )}

            <div className="flex items-center justify-between mb-4">
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
    </div>
  );
};

export default LoginForm;

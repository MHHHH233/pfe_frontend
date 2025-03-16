import { useState } from "react";
import background from "../img/background1.png";
import { motion } from "framer-motion";
import { Icon } from '@iconify/react'
import { Navigate, useNavigate } from "react-router-dom";
import { authService } from "../lib/services/authoServices";

const SignUpForm = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1);
  const [currentStep, setcurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    prenom: "",
    age: "",
    telephone: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNext = () => {
    const currentErrors = validateStep();
    if (Object.keys(currentErrors).length === 0) {
      setStep(step + 1);
      setcurrentStep(step + 1);
      setErrors({})
    } else {
      setErrors(currentErrors);
    }
  };

  const validateStep = () => {
    const stepErrors = {};

    if (step === 1) {

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email) {
        stepErrors.email = "Veuillez entrer une adresse email.";
      } else if (!emailRegex.test(formData.email)) {
        stepErrors.email = "Veuillez entrer une adresse email valide.";
      }
    }

    if (step === 2) {
      if (!formData.name) stepErrors.name = "name est obligatoire.";
      if (!formData.prenom) stepErrors.prenom = "Préname est obligatoire.";

      if (!formData.age || isNaN(formData.age)) {
        stepErrors.age = "Âge est invalide.";
      } else if (parseInt(formData.age) < 14 || parseInt(formData.age) > 120) {
        stepErrors.age = "Âge doit être compris entre 14 et 120.";
      }


      const phoneRegex = /^\d{10}$/;
      if (!formData.telephone) {
        stepErrors.telephone = "Le numéro de téléphone est obligatoire.";
      } else if (!phoneRegex.test(formData.telephone)) {
        stepErrors.telephone = "Le numéro de téléphone doit comporter 10 chiffres.";
      }
    }

    if (step === 3) {

      if (!formData.password) {
        stepErrors.password = "Mot de passe est obligatoire.";
      } else if (formData.password.length < 8) {
        stepErrors.password = "Le mot de passe doit contenir au moins 8 caractères.";
      }


      if (formData.password !== formData.password_confirmation) {
        stepErrors.password_confirmation = "Les mots de passe ne correspondent pas.";
      }
    }

    return stepErrors;
  };


  const handleSubmit = async () => {
    const currentErrors = validateStep();
    setErrors(currentErrors);

    if (Object.keys(currentErrors).length === 0) {
        try {
            const data = await authService.register(formData);

            if (data.status) {
                // Registration successful
                console.log("Registration successful:", data);
                navigate("/sign-in");
            } else {
                // Handle validation errors from the backend
                const apiErrors = {};
                if (data.errors) {
                    Object.keys(data.errors).forEach(key => {
                        apiErrors[key] = data.errors[key][0];
                    });
                }
                setErrors(apiErrors);
            }
        } catch (error) {
            console.error("Error:", error);            
            setErrors(prevErrors => ({ 
                ...prevErrors, 
                api: "An error occurred during signup." 
            }));
        }
    }
};
  
  const HandleNavigateSteps = (targetStep) => {
    if (targetStep <= currentStep) {
      setStep(targetStep)
    }
    return step;
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="relative min-h-screen bg-blend-overlay">
      <img
        src={background}
        className="absolute inset-0 w-full h-full object-cover -z-10"
        alt="background"
      />



      <div className="relative flex flex-col items-center justify-center min-h-screen text-white  ">
        <div className="flex justify-center items-center mt-28 lg:mt-24">
          <ul className="flex space-x-6">

            <li className="flex items-center space-x-2 ">
              <button onClick={() => HandleNavigateSteps(1)} className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${currentStep === 1 ? "bg-bright-green text-black" : "bg-green-800 text-black"
                }`} >
                1
              </button>
              <span className={`  block h-1 w-16 ${currentStep >= 2 ? "bg-bright-green" : "bg-gray-300"}`}></span>
            </li>


            <li className="flex items-center  ">
              <button onClick={() => { HandleNavigateSteps(2) }} className={`w-8 h-8 flex items-center justify-center rounded-full font-bold 
                ${currentStep === 2 ? "bg-bright-green text-black" : "bg-green-800 text-black"
                }`} >
                2
              </button>

            </li>


            <li className="flex items-center space-x-2  ">
              <span className={` block h-1 w-16 ${currentStep >= 3 ? "bg-bright-green" : "bg-gray-300"}`}></span>
              <button onClick={() => { HandleNavigateSteps(3) }} className={`w-8 h-8 flex items-center justify-center rounded-full font-bold
              ${currentStep === 3 ? "bg-bright-green text-black" : "bg-green-800 text-black"
                }`} >
                3
              </button>
            </li>
          </ul>
        </div>

        <div className="bg-dark-gray bg-opacity-35 p-10 rounded-lg w-11/12 max-w-md md:mt-10">
          {step === 1 && (
            <>
              <div className="flex justify-center gap-4 mb-8">

                <motion.div
                  key={step}
                  className={`w-10 h-10 flex items-center justify-center shadow-2xl shadow-lime-300 rounded-full text-lg font-semibold transition-all 
                      bg-bright-green text-white
                     
                   `}
                  initial={{ opacity: 0.9, y: 0 }}
                  animate={{ opacity: 1, y: [0, 10, -10] }}
                  transition={{ duration: 1.5, times: [0, 0.5, 1], repeat: Infinity }}
                >
                  {step}
                </motion.div>

              </div>
              <h1 className="text-2xl font-bold mb-6">Créer un compte</h1>
              <label className="block text-left text-sm font-medium mb-1">
                Adresse email
              </label>
              <input
                type="email"
                name="email"
                placeholder="a.@exemple.com"
                className={`w-full mb-4 p-3 text-dark-gray rounded-lg focus:bg-gray-200 focus:scale-x-105 transition  outline-none border ${errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <div className="lg:mb-2 text-red-500 text-sm">{errors.email}</div>
              )}
              <button

                type="button"
                onClick={handleNext}
                className="w-full p-3 mt-3 bg-bright-green text-black font-semibold rounded-lg  active:bg-green-700 active:scale-95 hover:bg-green-500 transition mb-4"
              >
                Suivant
              </button>
              <button
                type="button"
                className="w-full p-3 bg-white text-gray-800 font-semibold rounded-lg flex items-center justify-center hover:bg-gray-200 transition"
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  className="w-5 h-5 mr-2"
                />
                S'inscrire avec Google
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="flex justify-center gap-4 mb-8">

                <motion.div
                  key={step}
                  className={`w-10 h-10 flex items-center justify-center shadow-2xl shadow-lime-300 rounded-full text-lg font-semibold transition-all 
                      bg-bright-green text-white
                     
                   `}
                  initial={{ opacity: 0.9, y: 0 }}
                  animate={{ opacity: 1, y: [0, 10, -10] }}
                  transition={{ duration: 1.5, times: [0, 0.5, 1], repeat: Infinity }}
                >
                  {step}
                </motion.div>

              </div>
              <h1 className="text-2xl font-bold mb-6">Informations personnelles</h1>
              <label className="block text-left text-sm font-medium mb-1">
                name
              </label>
              <input

                type="text"
                name="name"
                placeholder="name"
                className={`w-full mb-4 p-3 text-dark-gray focus:bg-gray-200 focus:scale-x-105 transition rounded-lg outline-none border ${errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && (
                <div className="lg:mb-2 text-red-500 text-sm">{errors.name}</div>
              )}

              <label className="block text-left text-sm font-medium mb-1">
                Préname
              </label>
              <input
                type="text"
                name="prenom"
                placeholder="Préname"
                className={`w-full mb-4 p-3 text-dark-gray focus:bg-gray-200 focus:scale-x-105 transition rounded-lg outline-none border ${errors.prenom ? "border-red-500" : "border-gray-300"
                  }`}
                value={formData.prenom}
                onChange={handleChange}
              />
              {errors.prenom && (
                <span className="lg:mb-2 text-red-500 text-sm">{errors.prenom}</span>
              )}

              <label className="block text-left text-sm font-medium mb-1">
                Âge
              </label>
              <input
                type="text"
                name="age"
                placeholder="Âge"
                className={`w-full mb-4 p-3 text-dark-gray focus:bg-gray-200 focus:scale-x-105 transition rounded-lg outline-none border ${errors.age ? "border-red-500" : "border-gray-300"
                  }`}
                value={formData.age}
                onChange={handleChange}
              />
              {errors.age && (
                <div className="lg:mb-2 text-red-500 text-sm">{errors.age}</div>
              )}

              <label className="block text-left text-sm font-medium mb-1">
                Téléphone
              </label>
              <input
                type="text"
                name="telephone"
                placeholder="Téléphone "
                className="w-full mb-4 p-3 text-dark-gray focus:bg-gray-200 focus:scale-x-105 transition rounded-lg outline-none border-gray-300"
                value={formData.telephone}
                onChange={handleChange}
              />
              {errors.telephone && (
                <div className="lg:mb-2 text-red-500 text-sm">{errors.telephone}</div>
              )}
              <button
                type="button"
                onClick={handleNext}
                className="w-full p-3 mt-3 bg-bright-green text-black active:bg-green-700 active:scale-95 font-semibold rounded-lg hover:bg-green-500 transition"
              >
                Suivant
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <div className="flex justify-center gap-4 mb-8">

                <motion.div
                  key={step}
                  className={`w-10 h-10 flex items-center justify-center shadow-2xl shadow-lime-300 rounded-full text-lg font-semibold transition-all 
                         bg-bright-green text-white
                        
                      `}
                  initial={{ opacity: 0.9, y: 0 }}
                  animate={{ opacity: 1, y: [0, 10, -10] }}
                  transition={{ duration: 1.5, times: [0, 0.5, 1], repeat: Infinity }}
                >
                  {step}
                </motion.div>

              </div>
              <h1 className="text-2xl font-bold mb-6">Créer un mot de passe</h1>
              <label className="block text-left text-sm font-medium mb-1">
                Mot de passe
              </label>
              <div className="relative w-full ">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Mot de passe"
                  className={`w-full mb-4 p-3 pr-10 text-dark-gray focus:bg-gray-200 focus:scale-x-105 transition rounded-lg outline-none border ${errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-3 bottom-4   text-gray-600 focus:outline-none"
                >
                  <Icon icon={showPassword ? "mdi:eye-off" : "mdi:eye"} width="1.5em" height="1.5em" />
                </button>
              </div>

              {errors.password && (
                <div className="lg:mb-2 text-red-500 text-sm">{errors.password}</div>
              )}

              <label className="block text-left text-sm font-medium mb-1">
                Confirmez le mot de passe
              </label>
              <input
                type="password"
                name="password_confirmation"
                placeholder="Confirmez le mot de passe"
                className={`w-full mb-4 p-3 text-dark-gray focus:bg-gray-200 focus:scale-x-105 transition rounded-lg outline-none border ${errors.password_confirmation ? "border-red-500" : "border-gray-300"
                  }`}
                value={formData.password_confirmation}
                onChange={handleChange}
              />
              {errors.password_confirmation && (
                <div className="lg:mb-2 text-red-500 text-sm">
                  {errors.password_confirmation}
                </div>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                className="w-full p-3 mt-3 bg-bright-green active:bg-green-700 active:scale-95 text-black font-semibold rounded-lg hover:bg-green-500 transition"
              >
                Créer compte
              </button>

            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;

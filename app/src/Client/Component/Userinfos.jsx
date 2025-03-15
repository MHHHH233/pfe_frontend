"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function UserInfoCard({ isOpen, setIsOpen }) {
  const [userInfo, setUserInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const storedUserInfo = {
      isLoggedIn: sessionStorage.getItem("isLoggedIn"),
      userId: sessionStorage.getItem("userId"),
      email: sessionStorage.getItem("email"),
      nom: sessionStorage.getItem("nom"),
      prenom: sessionStorage.getItem("prenom"),
      type: sessionStorage.getItem("type"),
      date_inscription: sessionStorage.getItem("date_inscription"),
      telephone:sessionStorage.getItem("telephone"),

    };

    if (storedUserInfo.email) {
      setUserInfo(storedUserInfo);
    }
  }, []);

  const handleInputChange = (e) => {
    if (userInfo) {
      setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async () => {
    if (userInfo) {
      try {
        // Mock API call
        const response = await fetch("http://localhost/PFR/3AFAK-PFE/backend/Controleur/ControleurCLient.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userInfo),
        });

        if (response.ok) {
          const data = await response.json();
          sessionStorage.setItem("isLoggedIn", data.isLoggedIn);
          sessionStorage.setItem("userId", data.userId);
          sessionStorage.setItem("email", data.email);
          sessionStorage.setItem("nom", data.nom);
          sessionStorage.setItem("prenom", data.prenom);          
          sessionStorage.setItem("date_inscription", data.date_inscription);
          sessionStorage.setItem("telephone",data.date_inscription);

          setUserInfo(data);
          setIsEditing(false);
        } else {
          console.error("Failed to update user info");
        }
      } catch (error) {
        console.error("Error updating user info:", error);
      }
    }
  };

  if (!userInfo) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isOpen ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className={`fixed inset-0 flex items-center justify-center ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <motion.div
        className="bg-[#333] text-white p-8 rounded-lg shadow-2xl w-full max-w-md"
        layoutId="user-info-card"
      >
        <h2 className="text-2xl font-bold mb-4">User Information</h2>
        <div className="space-y-4">
          <div className="flex justify-center">
            <img
              src={userInfo.profilePicture || "/default-profile.png"}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
          </div>
          {[
            { label: "First Name", key: "nom" },
            { label: "Last Name", key: "prenom" },
            { label: "Email", key: "email" },            
            { label: "Telephone", key: "telephone" },            
          ].map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium mb-1">
                {field.label}
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name={field.key}
                  value={userInfo[field.key]}
                  onChange={handleInputChange}
                  className="w-full bg-[#1a1a1a] text-white px-3 py-2 rounded"
                />
              ) : (
                <p>{userInfo[field.key]}</p>
              )}
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium mb-1">
              Date of Registration
            </label>
            <p>{new Date(userInfo.date_inscription).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="mt-6 space-x-4">
          {isEditing ? (
            <motion.button
              onClick={handleSubmit}
              className="bg-[#07f468] text-[#1a1a1a] rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-wider shadow-lg transition-all duration-300 ease-in-out hover:bg-[#06d35a] hover:transform hover:-translate-y-0.5 hover:shadow-xl active:transform active:translate-y-0 active:shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Save Changes
            </motion.button>
          ) : (
            <motion.button
              onClick={() => setIsEditing(true)}
              className="bg-[#07f468] text-[#1a1a1a] rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-wider shadow-lg transition-all duration-300 ease-in-out hover:bg-[#06d35a] hover:transform hover:-translate-y-0.5 hover:shadow-xl active:transform active:translate-y-0 active:shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Edit Info
            </motion.button>
          )}
          <motion.button
            onClick={() => setIsOpen(false)}
            className="bg-[#1a1a1a] text-[#07f468] rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-wider shadow-lg transition-all duration-300 ease-in-out hover:bg-[#333] hover:transform hover:-translate-y-0.5 hover:shadow-xl active:transform active:translate-y-0 active:shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Close
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// src/App.js
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Edit, Save, Trash, User } from "lucide-react";

export const ProfilePage = () => {
  
  const [user, setUser] = useState({
    nom: "John",
    prenom: "Doe",
    age: 30,
    email: "john.doe@example.com",
    password: "password123",
    telephone: "123-456-7890",
  });

  
  const [isEditing, setIsEditing] = useState(false);

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  
  const handleSave = () => {
    setIsEditing(false);
    
    console.log("Profile updated:", user);
  };

  // Delete account
  const handleDelete = () => {
    // Here you would typically send a request to delete the account
    setUser({
      nom: "",
      prenom: "",
      age: "",
      email: "",
      password: "",
      telephone: "",
    });
    console.log("Account deleted");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-gray text-light-gray">
      <motion.div
        className="bg-medium-gray p-8 rounded-lg shadow-lg w-96"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-bright-green">My Profile</h1>
          {isEditing ? (
            <button
              onClick={handleSave}
              className="text-custom-green hover:text-bright-green transition-colors"
            >
              <Save size={24} />
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="text-custom-green hover:text-bright-green transition-colors"
            >
              <Edit size={24} />
            </button>
          )}
        </div>

        {/* Profile Fields */}
        <div className="space-y-4">
          {/* Nom */}
          <div className="flex items-center space-x-4">
            <User size={24} className="text-custom-green" />
            <div className="flex-1">
              <label className="block text-sm text-light-gray">Nom</label>
              {isEditing ? (
                <input
                  type="text"
                  name="nom"
                  value={user.nom}
                  onChange={handleChange}
                  className="w-full bg-dark-gray text-light-gray rounded p-2"
                />
              ) : (
                <p className="text-light-gray">{user.nom}</p>
              )}
            </div>
          </div>

          {/* Prenom */}
          <div className="flex items-center space-x-4">
            <User size={24} className="text-custom-green" />
            <div className="flex-1">
              <label className="block text-sm text-light-gray">Prenom</label>
              {isEditing ? (
                <input
                  type="text"
                  name="prenom"
                  value={user.prenom}
                  onChange={handleChange}
                  className="w-full bg-dark-gray text-light-gray rounded p-2"
                />
              ) : (
                <p className="text-light-gray">{user.prenom}</p>
              )}
            </div>
          </div>

          {/* Age */}
          <div className="flex items-center space-x-4">
            <User size={24} className="text-custom-green" />
            <div className="flex-1">
              <label className="block text-sm text-light-gray">Age</label>
              {isEditing ? (
                <input
                  type="number"
                  name="age"
                  value={user.age}
                  onChange={handleChange}
                  className="w-full bg-dark-gray text-light-gray rounded p-2"
                />
              ) : (
                <p className="text-light-gray">{user.age}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center space-x-4">
            <User size={24} className="text-custom-green" />
            <div className="flex-1">
              <label className="block text-sm text-light-gray">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  className="w-full bg-dark-gray text-light-gray rounded p-2"
                />
              ) : (
                <p className="text-light-gray">{user.email}</p>
              )}
            </div>
          </div>

          {/* Telephone */}
          <div className="flex items-center space-x-4">
            <User size={24} className="text-custom-green" />
            <div className="flex-1">
              <label className="block text-sm text-light-gray">Telephone</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="telephone"
                  value={user.telephone}
                  onChange={handleChange}
                  className="w-full bg-dark-gray text-light-gray rounded p-2"
                />
              ) : (
                <p className="text-light-gray">{user.telephone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Delete Account Button */}
        <div className="mt-6">
          <button
            onClick={handleDelete}
            className="w-full flex items-center justify-center space-x-2 bg-red-500 text-white rounded-lg p-2 hover:bg-red-600 transition-colors"
          >
            <Trash size={18} />
            <span>Delete Account</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};


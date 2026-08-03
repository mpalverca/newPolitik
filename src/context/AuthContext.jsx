// context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { subscribeToAuthChanges } from "../services/auth";
import { getUserProfile } from "../services/users";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Cargar perfil al autenticarse
        try {
          const userProfile = await getUserProfile(firebaseUser.uid);
          setProfile(userProfile);
        } catch (error) {
          console.error("Error cargando perfil:", error);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const setUserProfile = (profileData) => {
    setProfile(profileData);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, setUserProfile }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
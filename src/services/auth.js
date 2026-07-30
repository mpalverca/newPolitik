// services/auth.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "./firebase";

// Registro
export const registerUser = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Inicio de sesión
export const loginUser = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Cierre de sesión
export const logoutUser = () => {
  return signOut(auth);
};

// Observador de estado de autenticación (para usar en el contexto)
export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};
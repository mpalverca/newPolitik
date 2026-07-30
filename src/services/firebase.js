// services/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAYi3dzL_Un7yIpQ30CuRLqi13KXQOqLSc",
  authDomain: "newpolitik001.firebaseapp.com",
  projectId: "newpolitik001",
  storageBucket: "newpolitik001.firebasestorage.app",
  messagingSenderId: "663939708707",
  appId: "1:663939708707:web:2d875aa9a2911f31fa3e96",
  measurementId: "G-HZCFTPH9XW",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Servicios
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
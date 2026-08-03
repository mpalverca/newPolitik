// services/users.js
import { db } from "./firebase";
import { doc, setDoc,  getDocs, updateDoc, collection, query, where, getDoc  } from "firebase/firestore";

export const saveUserProfile = async (userId, profileData) => {
  const userRef = doc(db, "users", userId);
  await setDoc(userRef, profileData, { merge: true });
};

export const updateUserProfile = async (userId, data) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, data);
};

export const getUserProfile = async (userId) => {
  const userRef = doc(db, "users", userId); // DocumentReference
  const snap = await getDoc(userRef); // getDoc espera DocumentReference, bien
  if (snap.exists()) return snap.data();
  return null;
};

export const isUsernameTaken = async (username) => {
  const q = query(collection(db, "users"), where("username", "==", username));
  const snapshot = await getDocs(q);
  return !snapshot.empty;
};
// services/posts.js
import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

const POSTS_COLLECTION = "posts";

// Crear publicación
export const createPost = async (postData) => {
  console.log("crear")
  try {
    const docRef = await addDoc(collection(db, POSTS_COLLECTION), {
      ...postData,
      createdAt: new Date().toISOString(),
    });
     console.log(docRef.id)
    return docRef.id;
  } catch (error) {
    console.error("Error al crear publicación:", error);
    throw error;
  }
};

// Obtener todas las publicaciones (una sola vez)
export const getPosts = async () => {
  const q = query(collection(db, POSTS_COLLECTION), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Suscripción en tiempo real a publicaciones
export const subscribeToPosts = (callback) => {
  const q = query(collection(db, POSTS_COLLECTION), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const posts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(posts);
  });
};

// Eliminar publicación
export const deletePost = async (postId) => {
  await deleteDoc(doc(db, POSTS_COLLECTION, postId));
};

// Actualizar publicación
export const updatePost = async (postId, newData) => {
  await updateDoc(doc(db, POSTS_COLLECTION, postId), newData);
};
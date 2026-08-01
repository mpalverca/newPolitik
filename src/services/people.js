// services/people.js
import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  arrayUnion,
  arrayRemove,
  increment,
  writeBatch,
  limit,  // ✅ AÑADIR ESTA IMPORTACIÓN
} from "firebase/firestore";

const PEOPLE_COLLECTION = "people";

// ---------- Crear persona ----------
export const createPerson = async (personData) => {
  try {
    const docRef = await addDoc(collection(db, PEOPLE_COLLECTION), {
      ...personData,
      likes: 0,
      likedBy: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error al crear persona:", error);
    throw error;
  }
};

// ---------- Obtener todas las personas (una vez) ----------
export const getPeople = async () => {
  const q = query(collection(db, PEOPLE_COLLECTION), orderBy("createdAt", "desc"));

  const snapshot = await getDocs(q);
   
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// ---------- Suscripción en tiempo real ----------
export const subscribeToPeople = (callback) => {
  const q = query(collection(db, PEOPLE_COLLECTION), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    console.log("📡", snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    const people = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    callback(people);
  });
};

// ---------- Obtener persona por ID ----------
export const getPersonById = async (personId) => {
  const docRef = doc(db, PEOPLE_COLLECTION, personId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
};

// ---------- Actualizar persona (genérico) ----------
export const updatePerson = async (personId, newData) => {
  const docRef = doc(db, PEOPLE_COLLECTION, personId);
  await updateDoc(docRef, {
    ...newData,
    updatedAt: new Date().toISOString(),
  });
};

// ---------- Eliminar persona ----------
export const deletePerson = async (personId) => {
  await deleteDoc(doc(db, PEOPLE_COLLECTION, personId));
};

// ---------- Buscar personas por nombre ----------
export const searchPeople = async (searchTerm) => {
  try {
    // Normalizar el término de búsqueda (minúsculas)
    const searchLower = searchTerm.toLowerCase().trim();
    
    
    if (searchLower.length === 0) {
      // Si no hay término, devolver todas las personas (opcional)
      const all = await getPeople();
      return all;
    }

    // Usar un índice compuesto: orderBy("name") + where
    const q = query(
      collection(db, PEOPLE_COLLECTION),
      orderBy("name"),
    //  where("name", ">=", searchLower),
    //  where("name", "<=", searchLower + "\uf8ff")
    );

    
    const snapshot = await getDocs(q);
        
    const results = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    console.log(`🔍 Búsqueda: "${searchLower}" → ${results.length} resultados`);
    return results;
  } catch (error) {
    console.error("Error en searchPeople:", error);
    // Si falla por índice, mostrar mensaje amigable
    if (error.code === "failed-precondition") {
      console.warn("⚠️ Se necesita crear un índice en Firestore. Sigue el enlace de la consola.");
      // Fallback: búsqueda local (simulada) - solo si tienes pocos datos
      const allPeople = await getPeople();
      return allPeople.filter(p => 
        p.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    throw error;
  }
};

// ---------- Funciones específicas (cambiar avatar, portada, likes) ----------

// Cambiar foto de perfil (avatar)
export const updateAvatar = async (personId, avatarUrl) => {
  const docRef = doc(db, PEOPLE_COLLECTION, personId);
  await updateDoc(docRef, {
    avatar: avatarUrl,
    updatedAt: new Date().toISOString(),
  });
};

// Cambiar foto de portada (cover)
export const updateCover = async (personId, coverUrl) => {
  const docRef = doc(db, PEOPLE_COLLECTION, personId);
  await updateDoc(docRef, {
    cover: coverUrl,
    updatedAt: new Date().toISOString(),
  });
};

// Dar like a una persona (evita duplicados)
export const likePerson = async (personId, userId) => {
  const docRef = doc(db, PEOPLE_COLLECTION, personId);
  await updateDoc(docRef, {
    likes: increment(1),
    likedBy: arrayUnion(userId),
  });
};

// Quitar like
export const unlikePerson = async (personId, userId) => {
  const docRef = doc(db, PEOPLE_COLLECTION, personId);
  await updateDoc(docRef, {
    likes: increment(-1),
    likedBy: arrayRemove(userId),
  });
};

// Obtener personas más populares (por likes)
export const getPopularPeople = async (limitCount = 5) => {
  const q = query(
    collection(db, PEOPLE_COLLECTION),
    orderBy("likes", "desc"),
    orderBy("createdAt", "desc"),
    limit(limitCount)  // ✅ Ahora `limit` está definido
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// ---------- (OPCIONAL) Filtrar por tipo ----------
// Si necesitas filterPeopleByType, puedes implementarlo así:
export const filterPeopleByType = async (type) => {
  const q = query(
    collection(db, PEOPLE_COLLECTION),
    where("type", "==", type)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
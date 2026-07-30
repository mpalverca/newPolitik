import { signOut } from "firebase/auth";
import { auth } from '../firebase';

const handleLogout = async () => {
  try {
    await signOut(auth);
    console.log('Sesión cerrada');
  } catch (error) {
    console.error('Error al cerrar sesión', error);
  }
};
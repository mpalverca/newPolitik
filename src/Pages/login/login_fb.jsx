// src/components/FacebookLoginButton.jsx
import React from 'react';
import { signInWithPopup } from "firebase/auth";
//import { auth, facebookProvider } from '../firebase';
import { Button } from '@mui/material'; // O el botón que estés usando
import FacebookIcon from '@mui/icons-material/Facebook';

const FacebookLoginButton = () => {
  const handleFacebookLogin = async () => {
    try {
      // Abre la ventana emergente de Facebook
    //  const result = await signInWithPopup(auth, facebookProvider);

      // La información del usuario autenticado está en result.user
     // const user = result.user;
     const user= {
        displayName:"hello"
     }
      console.log('Usuario autenticado:', user);

      // Aquí puedes guardar la información en tu estado global o redirigir
      // Por ejemplo, con useNavigate de react-router-dom
      alert(`Bienvenido, ${user.displayName}!`);

    } catch (error) {
      // Manejo de errores
      console.error("Error al autenticar con Facebook:", error);
      
      if (error.code === 'auth/account-exists-with-different-credential') {
        alert('Ya existe una cuenta con el mismo email usando otro método de autenticación.');
      } else {
        alert('Hubo un problema al iniciar sesión. Intenta de nuevo.');
      }
    }
  };

  return (
    <Button
      variant="contained"
      startIcon={<FacebookIcon />}
      onClick={handleFacebookLogin}
      sx={{
        backgroundColor: '#3b5998',
        '&:hover': { backgroundColor: '#2d4373' },
        color: 'white'
      }}
    >
      Iniciar sesión con Facebook
    </Button>
  );
};

export default FacebookLoginButton;
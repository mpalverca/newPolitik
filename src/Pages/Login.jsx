// pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/auth";
import { getUserProfile } from "../services/users";
import { useAuth } from "../context/AuthContext"; // 👈 Importa el contexto
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
} from "@mui/material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
 // Si tienes una función en el contexto

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await loginUser(email, password);
      const user = userCredential.user;
      
      // Obtener perfil del usuario desde Firestore
      const profile = await getUserProfile(user.uid);
 
      
      navigate("/");
    } catch (err) {
      let message = err.message;
      if (err.code === 'auth/user-not-found') {
        message = "No existe una cuenta con este correo.";
      } else if (err.code === 'auth/wrong-password') {
        message = "Contraseña incorrecta.";
      } else if (err.code === 'auth/invalid-email') {
        message = "El formato del correo no es válido.";
      } else {
        message = err.message;
      }
      setError(message);
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Iniciar sesión
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Contraseña"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Entrar
          </Button>
          <Typography variant="body2" align="center">
            ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
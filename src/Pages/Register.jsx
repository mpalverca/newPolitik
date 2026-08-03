// pages/Register.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/auth";
import { isUsernameTaken, saveUserProfile, } from "../services/users";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  CircularProgress,
} from "@mui/material";
import { getProvincias, getCantones } from '@lobo.cyber.ec/ecuador-geo';
import { Place } from "@mui/icons-material";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");  
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [provincia, setProvincia] = useState("");
  const [canton, setCanton] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Listas de provincias y cantones
  const [provinciasList, setProvinciasList] = useState([]);
  const [cantonesList, setCantonesList] = useState([]);

  // Cargar provincias al montar
  useEffect(() => {
    const provinciasData = getProvincias();
    setProvinciasList(provinciasData);
  }, []);

  // Al cambiar provincia, cargar sus cantones
  useEffect(() => {
    if (provincia) {
      const provinciaObj = provinciasList.find(p => p.nombre === provincia);
      if (provinciaObj) {
        const cantonesData = getCantones(provinciaObj.codigo);
        setCantonesList(cantonesData);
      } else {
        setCantonesList([]);
      }
    } else {
      setCantonesList([]);
    }
    setCanton("");
  }, [provincia, provinciasList]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validaciones básicas
    if (password !== confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (!username.trim()) {
      setError("El nombre de usuario es obligatorio");
      return;
    }
    if (!email.trim()) {
      setError("El correo electrónico es obligatorio");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Verificar si el nombre de usuario ya existe en Firestore
      const usernameTaken = await isUsernameTaken(username.trim());
      if (usernameTaken) {
        setError("El nombre de usuario ya está en uso. Por favor, elige otro.");
        setLoading(false);
        return;
      }

      // 2️⃣ Registrar en Firebase Auth
      const userCredential = await registerUser(email, password);
      const user = userCredential.user;

      // 3️⃣ Obtener objetos completos de provincia y cantón
      const provinciaObj = provinciasList.find(p => p.nombre === provincia) || null;
      const cantonObj = cantonesList.find(c => c.nombre === canton) || null;

      // 4️⃣ Guardar perfil en Firestore
      await saveUserProfile(user.uid, {
        username: username.trim(),
        email,
        Place: {
          provincia: provinciaObj,
             canton: cantonObj,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // 5️⃣ Redirigir al home
      navigate("/");
    } catch (err) {
      // Manejo de errores de Firebase Auth
      console.error("Error al registrar usuario:", err);
      
      // Mapear códigos de error a mensajes amigables
      const errorMap = {
        "auth/email-already-in-use": "Este correo electrónico ya está registrado. ¿Quieres iniciar sesión?",
        "auth/invalid-email": "El correo electrónico no es válido.",
        "auth/weak-password": "La contraseña es demasiado débil. Usa al menos 6 caracteres.",
        "auth/operation-not-allowed": "El registro de correo/contraseña no está habilitado. Contacta al administrador.",
        "auth/network-request-failed": "Error de conexión. Verifica tu internet.",
      };
      
      const userMessage = errorMap[err.code] || err.message || "Ocurrió un error desconocido. Inténtalo de nuevo.";
      setError(userMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Registro
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            label="Nombre de usuario"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
           <TextField
            label="Telefono"
            type="number"
            fullWidth
            margin="normal"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            disabled={loading}
          />
          <TextField
            label="Contraseña"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            helperText="Mínimo 6 caracteres"
          />
          <TextField
            label="Confirmar contraseña"
            type="password"
            fullWidth
            margin="normal"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            disabled={loading}
          />

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item size={{xs: 6}}>
              <FormControl fullWidth disabled={loading}>
                <InputLabel>Provincia</InputLabel>
                <Select
                  value={provincia}
                  label="Provincia"
                  onChange={(e) => setProvincia(e.target.value)}
                >
                  <MenuItem value="">Seleccionar</MenuItem>
                  {provinciasList.map((p) => (
                    <MenuItem key={p.codigo} value={p.nombre}>
                      {p.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item size={{xs: 6}}>
              <FormControl fullWidth disabled={!provincia || loading}>
                <InputLabel>Cantón</InputLabel>
                <Select
                  value={canton}
                  label="Cantón"
                  onChange={(e) => setCanton(e.target.value)}
                >
                  <MenuItem value="">Seleccionar</MenuItem>
                  {cantonesList.map((c) => (
                    <MenuItem key={c.codigo} value={c.nombre}>
                      {c.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

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
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Registrarse"}
          </Button>
          <Typography variant="body2" align="center">
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
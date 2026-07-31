// features/people/AddPersonModal.jsx
import React, { useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  Alert,
  IconButton,
  Paper,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { Close, Person, LocationOn, Link, Email, CalendarToday } from "@mui/icons-material";
import { createPerson } from "../../services/people";
import { useAuth } from "../../context/AuthContext";

const AddPersonModal = ({ open, onClose, onPersonCreated }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    biography: "",
    type: "",
    location: "",
    occupation: "",
    birthDate: "",
    website: "",
    email: "",
    photoURL: "",
    coverImage: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("El nombre es obligatorio");
      return;
    }
    setLoading(true);
    try {
      const personId = await createPerson({
        ...formData,
        authorId: user?.uid,
        author: user?.displayName || user?.email || "Anónimo",
      });
      onPersonCreated(personId);
      onClose();
      setFormData({
        name: "",
        biography: "",
        type: "",
        location: "",
        occupation: "",
        birthDate: "",
        website: "",
        email: "",
        photoURL: "",
        coverImage: "",
      });
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Paper
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "95%", sm: 700 },
          maxHeight: "90vh",
          overflow: "auto",
          p: 3,
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            Añadir persona
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Nombre completo *"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Biografía"
              value={formData.biography}
              onChange={(e) => handleChange("biography", e.target.value)}
              multiline
              rows={3}
              fullWidth
              placeholder="Describe a esta persona..."
            />

            <TextField
              select
              label="Tipo"
              value={formData.type}
              onChange={(e) => handleChange("type", e.target.value)}
              fullWidth
            >
              <MenuItem value="político">Político</MenuItem>
              <MenuItem value="periodista">Periodista</MenuItem>
              <MenuItem value="activista">Activista</MenuItem>
              <MenuItem value="ciudadano">Ciudadano</MenuItem>
              <MenuItem value="otros">Otros</MenuItem>
            </TextField>

            <TextField
              label="Ubicación"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOn />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Ocupación"
              value={formData.occupation}
              onChange={(e) => handleChange("occupation", e.target.value)}
              fullWidth
            />

            <TextField
              label="Fecha de nacimiento"
              type="date"
              value={formData.birthDate}
              onChange={(e) => handleChange("birthDate", e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarToday />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Sitio web"
              value={formData.website}
              onChange={(e) => handleChange("website", e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Link />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="URL de foto de perfil"
              value={formData.photoURL}
              onChange={(e) => handleChange("photoURL", e.target.value)}
              fullWidth
              placeholder="https://ejemplo.com/foto.jpg"
            />

            <TextField
              label="URL de imagen de portada"
              value={formData.coverImage}
              onChange={(e) => handleChange("coverImage", e.target.value)}
              fullWidth
              placeholder="https://ejemplo.com/portada.jpg"
            />

            {error && <Alert severity="error">{error}</Alert>}

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              fullWidth
              sx={{ bgcolor: "#1877f2", "&:hover": { bgcolor: "#166fe5" } }}
            >
              {loading ? "Guardando..." : "Añadir persona"}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Modal>
  );
};

export default AddPersonModal;
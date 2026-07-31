// features/people/PersonModal.jsx
import React, { useState, useEffect } from "react";
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
  InputAdornment,
  Chip,
} from "@mui/material";
import { Close, Photo, Person, Category, Description } from "@mui/icons-material";
import { createPerson, updatePerson } from "../../services/people";

const PersonModal = ({ open, onClose, person = null, onSuccess }) => {
  const isEdit = !!person;
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    photoURL: "",
    category: "",
    interests: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (person) {
      setFormData({
        name: person.name || "",
        bio: person.bio || "",
        photoURL: person.photoURL || "",
        category: person.category || "",
        interests: person.interests || "",
      });
    } else {
      setFormData({
        name: "",
        bio: "",
        photoURL: "",
        category: "",
        interests: "",
      });
    }
  }, [person]);

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
    setError("");
    try {
      if (isEdit) {
        await updatePerson(person.id, formData);
      } else {
        await createPerson(formData);
      }
      onSuccess();
      onClose();
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
          width: { xs: "95%", sm: 500 },
          maxHeight: "90vh",
          overflow: "auto",
          p: 3,
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            {isEdit ? "Editar persona" : "Añadir persona"}
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Nombre completo"
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
              label="URL de foto de perfil"
              value={formData.photoURL}
              onChange={(e) => handleChange("photoURL", e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Photo />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Categoría (ej: Político, Activista, etc.)"
              value={formData.category}
              onChange={(e) => handleChange("category", e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Category />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Biografía"
              value={formData.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              multiline
              rows={3}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Description />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Intereses (separados por comas)"
              value={formData.interests}
              onChange={(e) => handleChange("interests", e.target.value)}
              fullWidth
              helperText="Ej: política, economía, educación"
            />

            {error && <Alert severity="error">{error}</Alert>}

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              fullWidth
              sx={{ bgcolor: "#1877f2", "&:hover": { bgcolor: "#166fe5" } }}
            >
              {loading ? "Guardando..." : isEdit ? "Actualizar" : "Crear"}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Modal>
  );
};

export default PersonModal;
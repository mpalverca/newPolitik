import React, { useState } from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  FormControlLabel,
  Checkbox,
  Typography,
  Paper,
  Box,
  Alert,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const NeedForm = () => {
  // 1. DECLARAR EL ESTADO CORRECTAMENTE
  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    image: "",
    location: "",
    scope: "",
    category: "",
    subcategory: "",
    urgency: "media",
    contact: "",
    termsAccepted: false,
    coordinates: null,
  });

  // 2. DECLARAR handleChange
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 3. FUNCIÓN PARA OBTENER UBICACIÓN
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            coordinates: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          }));

          // Opcional: Reverse geocoding para obtener dirección
          reverseGeocode(position.coords.latitude, position.coords.longitude);

          alert("¡Ubicación obtenida correctamente!");
        },
        (error) => {
          console.error("Error obteniendo ubicación:", error);
          alert(
            "No se pudo obtener tu ubicación. Por favor, ingrésala manualmente.",
          );
        },
      );
    } else {
      alert("Tu navegador no soporta geolocalización");
    }
  };

  // 4. FUNCIÓN DE REVERSE GEOCODING (opcional)
  const reverseGeocode = async (lat, lng) => {
    try {
      // Usando Nominatim (OpenStreetMap) - gratis sin API key
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      );
      const data = await response.json();

      if (data.display_name) {
        setFormData((prev) => ({
          ...prev,
          location: data.display_name,
        }));
      }
    } catch (error) {
      console.error("Error en reverse geocoding:", error);
    }
  };

  // 5. MANEJAR SUBMISIÓN
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones básicas
    if (!formData.termsAccepted) {
      alert("Debes aceptar los términos");
      return;
    }

    if (!formData.title || !formData.desc || !formData.location) {
      alert("Por favor completa todos los campos requeridos");
      return;
    }

    console.log("Datos a enviar:", formData);

    try {
      // Aquí iría la lógica para guardar en Firebase
      // const docRef = await addDoc(collection(db, 'needs'), formData);

      alert("¡Necesidad reportada exitosamente!");

      // Resetear formulario
      setFormData({
        title: "",
        desc: "",
        image: "",
        location: "",
        sector:"",
        scope: "",
        category: "",
        subcategory: "",
        urgency: "media",
        contact: "",
        termsAccepted: false,
        coordinates: null,
      });
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al reportar la necesidad");
    }
  };

  // 6. RENDERIZAR FORMULARIO
  return (
    <Paper elevation={3} sx={{ p: 2, maxWidth: 600, mx: "auto", my: 1 }}>
      <Alert severity="info" sx={{ mb: 1 }}>
        Todos los campos marcados con * son obligatorios
      </Alert>

      <form onSubmit={handleSubmit}>
        {/* Título */}
        <TextField
          fullWidth
          label="Título de la necesidad"
          name="title"
          variant="outlined"
          value={formData.title}
          onChange={handleChange}
          placeholder="Ej: Bache en Av. Principal"
          required
          sx={{ mb: 2 }}
        />

        {/* Descripción */}
        <TextField
          fullWidth
          label="Descripción detallada"
          name="desc"
          variant="outlined"
          value={formData.desc}
          onChange={handleChange}
          multiline
          rows={3}
          placeholder="Describe el problema detalladamente..."
          required
          sx={{ mb: 2 }}
        />

        {/* Imagen - versión simple por ahora */}
        <TextField
          fullWidth
          label="URL de la imagen"
          name="image"
          variant="outlined"
          value={formData.image}
          onChange={handleChange}
          placeholder="https://ejemplo.com/imagen.jpg"
          helperText="Por ahora usa una URL, luego implementaremos carga de archivos"
          sx={{ mb: 2 }}
        />

        {/* Ubicación */}
        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          <TextField
            fullWidth
            label="Ubicación (dirección)"
            name="location"
            variant="outlined"
            value={formData.location}
            onChange={handleChange}
            placeholder="Ej: Cdla. Los Esteros"
           
          />
           
          <Button
            variant="outlined"
            onClick={getCurrentLocation}
            startIcon={<LocationOnIcon />}
            sx={{ minWidth: "120px" }}
          >
            Mi ubicación
          </Button>
        </Box>
        <TextField
        sx={{ mb: 2 }}
            fullWidth
            label="(sector)"
            name="sector"
            variant="outlined"
            value={formData.sector}
            onChange={handleChange}
            placeholder="Ej: Cdla. Los Esteros"
            required
          />
        {/* Alcance geográfico */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Alcance de la necesidad *</InputLabel>
          <Select
            name="scope"
            value={formData.scope}
            label="Alcance de la necesidad *"
            onChange={handleChange}
            required
          >
            <MenuItem value="puntual">
              Puntual (una dirección específica)
            </MenuItem>
            <MenuItem value="local">
              Local (una cuadra o pequeño sector)
            </MenuItem>
            <MenuItem value="sectorial">
              Sectorial (varias calles/barrio)
            </MenuItem>
            <MenuItem value="cantonal">
              Cantonal (todo el cantón/ciudad)
            </MenuItem>
          </Select>
        </FormControl>

        {/* Categoría principal */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Categoría *</InputLabel>
          <Select
            name="category"
            value={formData.category}
            label="Categoría *"
            onChange={handleChange}
            required
          >
            <MenuItem value="vialidad">
              Vialidad (baches, calles, aceras)
            </MenuItem>
            <MenuItem value="conectividad">
              Conectividad (transporte, internet)
            </MenuItem>
            <MenuItem value="seguridad">
              Seguridad (alumbrado, vigilancia)
            </MenuItem>
            <MenuItem value="desarrollo">
              Desarrollo social (educación, salud)
            </MenuItem>
            <MenuItem value="saneamiento">
              Saneamiento (basura, limpieza)
            </MenuItem>
            <MenuItem value="alcantarillado">
              Alcantarillado (aguas servidas)
            </MenuItem>
            <MenuItem value="energia">
              Energía (electricidad, alumbrado)
            </MenuItem>
          </Select>
        </FormControl>

        {/* Subcategoría condicional */}
        {formData.category === "vialidad" && (
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Tipo específico</InputLabel>
            <Select
              name="subcategory"
              value={formData.subcategory}
              label="Tipo específico"
              onChange={handleChange}
            >
              <MenuItem value="bache">Bache/hueco</MenuItem>
              <MenuItem value="calle_deteriorada">Calle deteriorada</MenuItem>
              <MenuItem value="falta_aceras">Falta de aceras</MenuItem>
              <MenuItem value="senalizacion">Falta de señalización</MenuItem>
            </Select>
          </FormControl>
        )}

        {/* Nivel de urgencia */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Nivel de urgencia</InputLabel>
          <Select
            name="urgency"
            value={formData.urgency}
            label="Nivel de urgencia"
            onChange={handleChange}
          >
            <MenuItem value="baja">Baja (puede esperar)</MenuItem>
            <MenuItem value="media">Media (afecta calidad de vida)</MenuItem>
            <MenuItem value="alta">Alta (riesgo para la comunidad)</MenuItem>
            <MenuItem value="critica">Crítica (peligro inminente)</MenuItem>
          </Select>
        </FormControl>

        {/* Contacto opcional */}
        <TextField
          fullWidth
          label="Contacto (opcional)"
          name="contact"
          variant="outlined"
          value={formData.contact}
          onChange={handleChange}
          placeholder="Teléfono o email para seguimiento"
          sx={{ mb: 2 }}
        />

        {/* Términos */}
        <FormControlLabel
          control={
            <Checkbox
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleChange}
              required
            />
          }
          label="Confirmo que la información proporcionada es verídica"
          sx={{ mb: 2 }}
        />

        {/* Botón de envío */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          disabled={!formData.termsAccepted}
        >
          Reportar necesidad
        </Button>
      </form>
    </Paper>
  );
};

export default NeedForm;

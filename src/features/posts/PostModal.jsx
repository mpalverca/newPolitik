// features/posts/PostModal.jsx
import React, { useState, useRef, useEffect } from "react";
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
  Divider,
} from "@mui/material";
import { Close, Photo, LocationOn, Link as LinkIcon, Person, MyLocation } from "@mui/icons-material";
import { createPost } from "../../services/posts";
import { useAuth } from "../../context/AuthContext";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Solución para íconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Componente para manejar clics en el mapa
const LocationPicker = ({ setLat, setLng }) => {
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setLat(lat);
      setLng(lng);
    },
  });
  return null;
};

const PostModal = ({ open, onClose, initialPosition, onPostCreated }) => {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [lat, setLat] = useState(initialPosition?.lat || "");
  const [lng, setLng] = useState(initialPosition?.lng || "");
  const [link, setLink] = useState("");
  const [character, setCharacter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mapCenter, setMapCenter] = useState([40.4168, -3.7038]); // Madrid por defecto

  // Actualizar centro del mapa cuando se recibe una posición inicial
  useEffect(() => {
    if (initialPosition?.lat && initialPosition?.lng) {
      setLat(initialPosition.lat);
      setLng(initialPosition.lng);
      setMapCenter([initialPosition.lat, initialPosition.lng]);
    }
  }, [initialPosition]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError("El texto es obligatorio");
      return;
    }
    if (!lat || !lng) {
      setError("La ubicación es obligatoria (latitud y longitud)");
      return;
    }
    setLoading(true);
    try {
      await createPost({
        text: text.trim(),
        imageUrl: imageUrl.trim() || null,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        link: link.trim() || null,
        character: character.trim() || null,
        author: user?.displayName || user?.email || "Anónimo",
        userId: user?.uid,
      });
      
      onPostCreated();
      onClose();
      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setText("");
    setImageUrl("");
    setLat(initialPosition?.lat || "");
    setLng(initialPosition?.lng || "");
    setLink("");
    setCharacter("");
    setError("");
    if (initialPosition?.lat && initialPosition?.lng) {
      setMapCenter([initialPosition.lat, initialPosition.lng]);
    } else {
      setMapCenter([40.4168, -3.7038]);
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setLat(latitude);
          setLng(longitude);
          setMapCenter([latitude, longitude]);
        },
        (error) => {
          setError("No se pudo obtener tu ubicación: " + error.message);
        }
      );
    } else {
      setError("Geolocalización no soportada por tu navegador");
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
            Crear publicación
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="¿Qué estás pensando?"
              value={text}
              onChange={(e) => setText(e.target.value)}
              multiline
              rows={3}
              fullWidth
              required
              placeholder="Escribe algo..."
            />

            <TextField
              label="URL de imagen (opcional)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Photo />
                  </InputAdornment>
                ),
              }}
            />

            <Divider>Ubicación</Divider>

            {/* Mapa interactivo */}
            <Box sx={{ height: 250, width: "100%", borderRadius: 1, overflow: "hidden" }}>
              <MapContainer
                center={mapCenter}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
                key={mapCenter.join(",")} // Forzar refresco al cambiar centro
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                <LocationPicker setLat={setLat} setLng={setLng} />
                {lat && lng && (
                  <Marker position={[parseFloat(lat), parseFloat(lng)]} />
                )}
              </MapContainer>
            </Box>

            {/* <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <TextField
                label="Latitud"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                type="number"
                required
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
                label="Longitud"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                type="number"
                required
                fullWidth
              />
              <Button
                variant="outlined"
                onClick={handleUseCurrentLocation}
                startIcon={<MyLocation />}
                sx={{ whiteSpace: "nowrap" }}
              >
                Mi ubicación
              </Button>
            </Box> */}

            <TextField
              label="Enlace (opcional)"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              helperText="Agrega un enlace de publicación de red como YouTube, Facebook, X-Twitter..."
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LinkIcon />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Personaje (opcional)"
              value={character}
              onChange={(e) => setCharacter(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                ),
              }}
            />

            {error && <Alert severity="error">{error}</Alert>}

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              fullWidth
              sx={{ bgcolor: "#1877f2", "&:hover": { bgcolor: "#166fe5" } }}
            >
              {loading ? "Publicando..." : "Publicar"}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Modal>
  );
};

export default PostModal;
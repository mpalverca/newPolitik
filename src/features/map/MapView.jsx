// features/map/MapView.jsx
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { Box, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { subscribeToPosts } from "../../services/posts";
import PostModal from "../posts/PostModal";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const MapView = () => {
  const [posts, setPosts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToPosts((data) => {
      setPosts(data.filter((p) => p.lat && p.lng));
    });
    return unsubscribe;
  }, []);

  const MapClickHandler = () => {
    const map = useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setSelectedPosition({ lat, lng });
        setModalOpen(true);
      },
    });
    return null;
  };

  const handlePostCreated = () => {
    // El feed se actualiza automáticamente gracias a la suscripción
  };

  return (
    <Box sx={{ position: "relative", height: "100%", width: "100%" }}>
      <MapContainer
        center={[40.4168, -3.7038]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {posts.map((post) => (
          <Marker key={post.id} position={[post.lat, post.lng]}>
            <Popup>
              <strong>{post.text?.substring(0, 50)}...</strong>
              <p>{post.author}</p>
            </Popup>
          </Marker>
        ))}
        <MapClickHandler />
      </MapContainer>

      {/* Botón flotante para agregar desde la ubicación actual del usuario */}
      <Fab
        color="primary"
        sx={{ position: "absolute", bottom: 16, right: 16 }}
        onClick={() => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                setSelectedPosition({
                  lat: pos.coords.latitude,
                  lng: pos.coords.longitude,
                });
                setModalOpen(true);
              },
              () => {
                setSelectedPosition({ lat: 40.4168, lng: -3.7038 });
                setModalOpen(true);
              }
            );
          } else {
            setSelectedPosition({ lat: 40.4168, lng: -3.7038 });
            setModalOpen(true);
          }
        }}
      >
        <AddIcon />
      </Fab>

      <PostModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialPosition={selectedPosition}
        onPostCreated={handlePostCreated}
      />
    </Box>
  );
};

export default MapView;
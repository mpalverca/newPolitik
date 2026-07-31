// pages/PersonDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Paper,
  Avatar,
  Typography,
  Button,
  Tabs,
  Tab,
  Grid,
  IconButton,
  Skeleton,
  Alert,
  Chip,
  Divider,
  Card,
  CardContent,
} from "@mui/material";
import {
  Edit,
  PhotoCamera,
  Favorite,
  FavoriteBorder,
  PersonAdd,
  PersonRemove,
  LocationOn,
  CalendarToday,
  Link as LinkIcon,
  ArrowBack,
} from "@mui/icons-material";
import { subscribeToPerson, toggleLike, updateCoverPhoto, updateAvatar } from "../../services/people";
import { useAuth } from "../../context/AuthContext";
import Feed from "../features/feed/Feed";

// Componente para pestañas
const TabPanel = ({ children, value, index }) => {
  return (
    <Box role="tabpanel" hidden={value !== index} sx={{ py: 3 }}>
      {value === index && children}
    </Box>
  );
};

const PersonDetail = () => {
  const { personId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // Suscripción en tiempo real a la persona
  useEffect(() => {
    if (!personId) return;
    setLoading(true);
    const unsubscribe = subscribeToPerson(personId, (data) => {
      if (data) {
        setPerson(data);
        setIsLiked(data.likedBy?.includes(user?.uid) || false);
      } else {
        setError("Persona no encontrada");
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [personId, user?.uid]);

  const handleLike = async () => {
    if (!user) return;
    try {
      await toggleLike(personId, user.uid);
      // El estado se actualiza automáticamente por la suscripción
    } catch (err) {
      setError("Error al dar like");
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Skeleton variant="rectangular" height={300} width="100%" />
        <Skeleton variant="circular" width={120} height={120} sx={{ mt: -6, ml: 4 }} />
        <Skeleton variant="text" height={40} sx={{ mt: 2 }} />
        <Skeleton variant="text" height={20} width="60%" />
        <Skeleton variant="rectangular" height={50} sx={{ mt: 2 }} />
      </Container>
    );
  }

  if (error || !person) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error || "Persona no encontrada"}</Alert>
        <Button variant="contained" onClick={() => navigate("/people")} sx={{ mt: 2 }}>
          Volver a lista
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: "#f0f2f5", minHeight: "100vh", pb: 4 }}>
      <Container maxWidth="lg" sx={{ pt: 2 }}>
        {/* Botón volver */}
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/people")}
          sx={{ mb: 2 }}
        >
          Volver a personas
        </Button>

        <Paper elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
          {/* Portada */}
          <Box sx={{ position: "relative", height: 300, bgcolor: "#1877f2" }}>
            {person.coverPhoto ? (
              <Box
                component="img"
                src={person.coverPhoto}
                alt="Portada"
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "#1877f2",
                  color: "white",
                  fontSize: 48,
                }}
              >
                <PhotoCamera />
              </Box>
            )}
            {/* Botón cambiar portada (solo si es el propio perfil) */}
            {user?.uid === person.userId && (
              <IconButton
                sx={{ position: "absolute", bottom: 16, right: 16, bgcolor: "rgba(255,255,255,0.9)" }}
                onClick={() => {
                  // Implementar modal para cambiar portada
                  const url = prompt("URL de la nueva portada:");
                  if (url) updateCoverPhoto(personId, url);
                }}
              >
                <PhotoCamera />
              </IconButton>
            )}
          </Box>

          {/* Avatar y nombre */}
          <Box sx={{ px: 3, py: 2, display: "flex", alignItems: "flex-end", mt: -5 }}>
            <Box sx={{ position: "relative" }}>
              <Avatar
                src={person.avatar}
                sx={{ width: 120, height: 120, border: "4px solid white", boxShadow: 2 }}
              >
                {person.name?.charAt(0).toUpperCase()}
              </Avatar>
              {user?.uid === person.userId && (
                <IconButton
                  size="small"
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    bgcolor: "white",
                    boxShadow: 1,
                  }}
                  onClick={() => {
                    const url = prompt("URL del nuevo avatar:");
                    if (url) updateAvatar(personId, url);
                  }}
                >
                  <PhotoCamera fontSize="small" />
                </IconButton>
              )}
            </Box>
            <Box sx={{ ml: 3, flex: 1 }}>
              <Typography variant="h4" fontWeight="bold">
                {person.name}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {person.bio || "Sin biografía"}
              </Typography>
              <Box sx={{ display: "flex", gap: 2, mt: 1, flexWrap: "wrap" }}>
                {person.type && <Chip label={person.type} size="small" />}
                <Chip label={`${person.likes || 0} me gusta`} size="small" variant="outlined" />
                {person.location && (
                  <Chip icon={<LocationOn />} label={person.location} size="small" variant="outlined" />
                )}
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              {user?.uid !== person.userId && (
                <Button
                  variant={isLiked ? "contained" : "outlined"}
                  startIcon={isLiked ? <Favorite /> : <FavoriteBorder />}
                  onClick={handleLike}
                >
                  {isLiked ? "Me gusta" : "Dar like"}
                </Button>
              )}
              <Button variant="outlined" startIcon={<PersonAdd />}>
                Seguir
              </Button>
            </Box>
          </Box>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: "divider", px: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Biografía" />
              <Tab label="Publicaciones" />
              <Tab label="Eventos" />
              <Tab label="Fotos" />
            </Tabs>
          </Box>

          {/* Contenido de tabs */}
          <Box sx={{ px: 3 }}>
            {/* Biografía */}
            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Acerca de {person.name}
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                        {person.bio || "Esta persona no ha escrito una biografía."}
                      </Typography>
                      {user?.uid === person.userId && (
                        <Button
                          variant="outlined"
                          startIcon={<Edit />}
                          sx={{ mt: 2 }}
                          onClick={() => {
                            const newBio = prompt("Editar biografía:", person.bio);
                            if (newBio !== null) updatePersonField(personId, "bio", newBio);
                          }}
                        >
                          Editar biografía
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Información
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        {person.location && (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <LocationOn fontSize="small" color="action" />
                            <Typography variant="body2">{person.location}</Typography>
                          </Box>
                        )}
                        {person.birthDate && (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <CalendarToday fontSize="small" color="action" />
                            <Typography variant="body2">
                              {new Date(person.birthDate).toLocaleDateString()}
                            </Typography>
                          </Box>
                        )}
                        {person.website && (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <LinkIcon fontSize="small" color="action" />
                            <a href={person.website} target="_blank" rel="noopener noreferrer">
                              {person.website}
                            </a>
                          </Box>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Publicaciones */}
            <TabPanel value={tabValue} index={1}>
              <Feed personId={personId} />
            </TabPanel>

            {/* Eventos */}
            <TabPanel value={tabValue} index={2}>
              <Typography variant="body1" color="text.secondary">
                Próximamente: eventos relacionados con {person.name}.
              </Typography>
            </TabPanel>

            {/* Fotos */}
            <TabPanel value={tabValue} index={3}>
              <Typography variant="body1" color="text.secondary">
                Galería de fotos de {person.name}.
              </Typography>
            </TabPanel>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default PersonDetail;
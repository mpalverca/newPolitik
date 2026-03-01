// pages/PostEvent.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Chip,
  Button,
  Divider,
  CardMedia,
  CircularProgress,
  Alert,
  Avatar,
} from "@mui/material";
import {
  CalendarToday,
  LocationOn,
  Person,
  Group,
  Videocam,
  Image as ImageIcon,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import MediaEmbed from "../components/media/MediaEmbed";

// Simulación de datos (luego reemplazar con Firebase)
const eventosEjemplo = [
  {
    id: 1,
    titulo: "Campaña de salud",
    descripcion:
      "Espacio de diálogo ciudadano para definir prioridades de inversión municipal",
    fecha: "2024-06-15",
    hora: "18:00",
    mark: "https://scontent.floh2-1.fna.fbcdn.net/v/t39.30808-6/376014976_722190119920595_8341601210744437451_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=WEYBLbjymYEQ7kNvwGlKpKc&_nc_oc=AdnfrDsSGBBWzFEioSaizoivi4nsIrPBEEwS7sHWihgYEe5Fyh3TTfAfxWaoRdapPylGOFMrApFPb9FHF96UViPT&_nc_zt=23&_nc_ht=scontent.floh2-1.fna&_nc_gid=u7iYAzo5MLS9pJRxt9MGaw&_nc_ss=8&oh=00_AfsrsTCsHa_B3Ild5YM-ZwIlVbvdXf05l-LFkRWOFDLa5Q&oe=69AA6560",
    imagen:
      "https://i0.wp.com/cronica.com.ec/wp-content/uploads/2024/09/mass-partido-politico-con-directiva.png?resize=1024%2C610&ssl=1",
    ubicacion: {
      provincia: "Loja",
      canton: "Loja",
      sector: "Parque Central",
      direccion: "Plaza de la Independencia",
      lat: -3.9931,
      lng: -79.2042,
    },
    organizador: "MASS",
    tipo: "Cabildo Abierto",
    // Nuevos campos
    realizado: true,
    desc_real:
      "Se realizó con éxito, asistieron más de 500 personas y se recogieron 30 propuestas ciudadanas Pudimos constatar la precencia de mas de 100",
    aforo_aprox: 500,
    prueba:
      "https://www.tiktok.com/@lodelmomentoloja/video/7600894570464890119",
  },
  {
    id: 2,
    titulo: "Socialización: Ordenanza de Movilidad Sostenible",
    descripcion:
      "Presentación de la nueva ordenanza para ciclovías y peatonalización",
    fecha: "2024-06-20",
    hora: "10:00",
    mark: "https://i0.wp.com/cronica.com.ec/wp-content/uploads/2023/05/franco-quezada-alcalde-de-loja.png?resize=674%2C337&ssl=1",
    imagen:
      "https://scontent.floh2-1.fna.fbcdn.net/v/t39.30808-6/313949594_207148638377771_919429875249830525_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=DnoVzckWnvYQ7kNvwFdlVJb&_nc_oc=Adki-WmALuQHddkmHyUyl-nKRBVv3FHvUOfhOvlsYhd2WW23Z0hlmx1yzqRqyzljNz118dYapohJ27unjjdvY_4Z&_nc_zt=23&_nc_ht=scontent.floh2-1.fna&_nc_gid=Umfmc7c39fLbQ1_IWD1fJg&_nc_ss=8&oh=00_Afuo-OLzN5YIo7UP2EuUkAbnayZVFu1iUTk3tCdCP3yRDw&oe=69AA4EC1",
    ubicacion: {
      provincia: "Loja",
      canton: "Loja",
      sector: "Universidad Técnica Particular de Loja",
      direccion: "Campus UTPL, San Cayetano",
      lat: -3.9917,
      lng: -79.2049,
    },
    organizador: "SER (solidaridad, esperanza y respeto)",
    tipo: "Socialización",
    realizado: false,
    desc_real: "",
    aforo_aprox: 200,
    prueba: "",
  },
  {
    id: 3,
    titulo: "Foro: Desarrollo Productivo del Sur",
    descripcion:
      "Encuentro con gremios productivos y candidatos a la prefectura",
    fecha: "2024-06-25",
    hora: "09:00",
    mark: "https://scontent.floh2-1.fna.fbcdn.net/v/t39.30808-6/376014976_722190119920595_8341601210744437451_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=WEYBLbjymYEQ7kNvwGlKpKc&_nc_oc=AdnfrDsSGBBWzFEioSaizoivi4nsIrPBEEwS7sHWihgYEe5Fyh3TTfAfxWaoRdapPylGOFMrApFPb9FHF96UViPT&_nc_zt=23&_nc_ht=scontent.floh2-1.fna&_nc_gid=u7iYAzo5MLS9pJRxt9MGaw&_nc_ss=8&oh=00_AfsrsTCsHa_B3Ild5YM-ZwIlVbvdXf05l-LFkRWOFDLa5Q&oe=69AA6560",
    imagen:
      "https://www.facebook.com/photo/?fbid=122100294836374853&set=a.122100294878374853",
    ubicacion: {
      provincia: "Loja",
      canton: "Loja",
      sector: "Cámara de Comercio",
      direccion: "Av. Universitaria y Bernardo Valdivieso",
      lat: -3.9945,
      lng: -79.2038,
    },
    organizador: "MASS",
    tipo: "Foro",
    realizado: true,
    desc_real:
      "Participaron 150 empresarios y se firmaron 5 acuerdos de cooperación.",
    aforo_aprox: 150,
    prueba: "https://www.facebook.com/watch/?v=ejemplo",
  },
  {
    id: 4,
    titulo: "Foro: Desarrollo Productivo del Sur (segundo)",
    descripcion:
      "Encuentro con gremios productivos y candidatos a la prefectura",
    fecha: "2024-06-25",
    hora: "09:00",
    mark: "https://scontent.floh2-1.fna.fbcdn.net/v/t39.30808-6/641268598_1777434276981690_3251201677515563136_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=VMORymUKkr0Q7kNvwG5e8MF&_nc_oc=AdkdK7mPoJk6ONdXpUgyqLAL3JBrXPi7JMejhujOSyZn7syU6Mc6mlYKKIC-y83oYA7owz96gBE63xpWIo_Oxh0Z&_nc_zt=23&_nc_ht=scontent.floh2-1.fna&_nc_gid=0ciUOmFMPozjBboBw88l2A&_nc_ss=8&oh=00_AfvWJ8kPWx_7oC-nF-x-9VX6G-WKDHgogyJvHevcM38zuA&oe=69AA4927",
    imagen:
      "https://scontent.floh2-1.fna.fbcdn.net/v/t39.30808-6/641504037_1777437430314708_7761634618712188442_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=2a1932&_nc_ohc=nHOF4w4qtygQ7kNvwGtHCTW&_nc_oc=AdmpXIPb6ii7-pzPljkGcsfziaqKyMNKkIIiyZm9jtuVQWVqEiOdBWhmni_LZwMfBje_i6D5fQYf4occFIgOqpjm&_nc_zt=23&_nc_ht=scontent.floh2-1.fna&_nc_gid=8XTIHXVoSU9Z_rHnjS9miQ&_nc_ss=8&oh=00_AfsTSFFDDhiaiAUoYSzKeL12zsa4uHOeiPOU4V1KiBcVPg&oe=69AA7665",
    ubicacion: {
      provincia: "Loja",
      canton: "Loja",
      sector: "Cámara de Comercio",
      direccion: "Av. Universitaria y Bernardo Valdivieso",
      lat: -3.9945,
      lng: -79.2038,
    },
    organizador: "Patricio Valdivieso",
    tipo: "Foro",
    realizado: true,
    desc_real: "",
    aforo_aprox: 300,
    prueba: "",
  },
  {
    id: 5,
    titulo: "Entrega de Obra: Reconstrucción del Mercado Centro Comercial",
    descripcion: "Inauguración de la primera etapa de remodelación",
    fecha: "2026-06-10",
    hora: "11:30",
    mark: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Asamble%C3%ADsta_Jos%C3%A9_Bol%C3%ADvar_Castillo_en_su_intervenci%C3%B3n_en_la_sesi%C3%B3n_No.-_235_del_Pleno_de_la_Asamblea_Nacional_%288937060886%29.jpg/1280px-Asamble%C3%ADsta_Jos%C3%A9_Bol%C3%ADvar_Castillo_en_su_intervenci%C3%B3n_en_la_sesi%C3%B3n_No.-_235_del_Pleno_de_la_Asamblea_Nacional_%288937060886%29.jpg",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/a/aa/LOGO_ARE.jpg",
    ubicacion: {
      provincia: "Loja",
      canton: "Loja",
      sector: "Mercado Centro Comercial",
      direccion: "Calle 10 de Agosto y Sucre",
      lat: -3.9928,
      lng: -79.2025,
    },
    organizador: "ARE",
    tipo: "Socialización",
    realizado: false,
    desc_real: "",
    aforo_aprox: 1000,
    prueba: "",
  },
];

const PostEvent = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos (aquí iría la llamada a Firebase)
    const found = eventosEjemplo.find((e) => e.id === parseInt(eventId));
    // Simular retardo
    setTimeout(() => {
      setEvento(found || null);
      setLoading(false);
    }, 500);
  }, [eventId]);

  if (loading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!evento) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">Evento no encontrado</Alert>
        <Button
          variant="contained"
          onClick={() => navigate("/mapa")}
          sx={{ mt: 2 }}
        >
          Volver al mapa
        </Button>
      </Container>
    );
  }

  const fechaEvento = new Date(`${evento.fecha}T${evento.hora}`);
  const esPasado = new Date(evento.fecha) < new Date();

  // Función para obtener el embed URL según la plataforma

  return (
    <Paper elevation={3} sx={{ p: 3, m: 2 }}>
      <Grid container spacing={3}>
        {/* Columna izquierda: Imagen principal */}
        <Grid item size={{ xs: 12, md: 6 }}>
          <CardMedia
            component="img"
            image={
              evento.imagen ||
              evento.mark ||
              "https://via.placeholder.com/600x400?text=Sin+imagen"
            }
            alt={evento.titulo}
            sx={{
              width: "100%",
              height: "auto",
              maxHeight: 500,
              objectFit: "cover",
              borderRadius: 2,
            }}
          />
          {/* Si hay prueba (video/imagen) la mostramos debajo */}
          {/* Sección de prueba multimedia embebida */}
          {evento.prueba && <MediaEmbed url={evento.prueba} />}
        </Grid>
        {/* <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 1 }}>
        ← Volver
      </Button> */}
        {/* Columna derecha: Detalles */}
        <Grid item size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Typography variant="h4" component="h1">
              {evento.titulo}
            </Typography>
            <Chip
              label={evento.realizado ? "Realizado" : "Próximo"}
              color={evento.realizado ? "success" : "primary"}
              icon={evento.realizado ? <CheckCircle /> : <CalendarToday />}
            />
          </Box>

          <Typography variant="body1" color="text.secondary" paragraph>
            {evento.descripcion}
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* Detalles estructurados */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Fecha y hora */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <CalendarToday sx={{ mr: 1, color: "primary.main" }} />
              <Typography>
                {format(fechaEvento, "EEEE d 'de' MMMM 'de' yyyy, HH:mm", {
                  locale: es,
                })}
              </Typography>
            </Box>

            {/* Ubicación */}
            <Box sx={{ display: "flex", alignItems: "flex-start" }}>
              <LocationOn sx={{ mr: 1, color: "primary.main" }} />
              <Box>
                <Typography>
                  {evento.ubicacion.direccion}, {evento.ubicacion.sector},{" "}
                  {evento.ubicacion.canton}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {evento.ubicacion.provincia}
                </Typography>
              </Box>
            </Box>

            {/* Organizador */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Person sx={{ mr: 1, color: "primary.main" }} />
              <Typography>
                Organiza: <strong>{evento.organizador}</strong>
              </Typography>
            </Box>

            {/* Tipo de evento */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Chip label={evento.tipo} size="small" color="secondary" />
            </Box>

            {/* Aforo aproximado */}
            {evento.aforo_aprox && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Group sx={{ mr: 1, color: "primary.main" }} />
                <Typography>
                  Aforo aproximado:{" "}
                  <strong>{evento.aforo_aprox} personas</strong>
                </Typography>
              </Box>
            )}

            {/* Descripción real (si ya se realizó) */}
            {evento.realizado && evento.desc_real && (
              <Box sx={{ mt: 2, p: 2, bgcolor: "#f5f5f5", borderRadius: 2 }}>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  ¿Cómo fue el evento?
                </Typography>
                <Typography variant="body2">{evento.desc_real}</Typography>
              </Box>
            )}

            {/* Si no se ha realizado, mostrar mensaje */}
            {!evento.realizado && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Este evento aún no se ha realizado. ¡Asiste y comparte tu
                experiencia!
              </Alert>
            )}
          </Box>

          {/* Botones de acción */}
          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            {!evento.realizado && (
              <Button variant="contained" color="primary">
                Confirmar asistencia
              </Button>
            )}
            {/*   <Button variant="outlined" onClick={() => window.open(`https://www.google.com/maps?q=${evento.ubicacion.lat},${evento.ubicacion.lng}`, '_blank')}>
                Ver en Google Maps
              </Button> */}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default PostEvent;

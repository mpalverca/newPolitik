import { Box, Divider, Grid, Typography } from "@mui/material";
import { MapContainer, TileLayer } from "react-leaflet";
const position = [-3.996588, -79.201817];
const Home = () => {
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item size={{ xs: 12, sm: 3, md: 3 }}>
          <div>
            <Typography variant="h6" align="center">
              Bienvenido a Newpolitik
            </Typography>
            <Divider />
            <Typography variant="body2" align="justify" sx={{ mt: 1, px: 2 }}>
              <strong>New Polítik </strong>es una plataforma digital de
              participación ciudadana que transforma la voz en acción,
              conectando a comunidades, políticos a través de un mapa
              interactivo con evidencia multimedia, mientras visualiza
              propuestas de candidatos directamente vinculadas a esos problemas
              y da seguimiento a eventos públicos. Con una visión de convertirse
              en el puente digital que fortalece la democracia participativa,
              nuestra misión es empoderar a la ciudadanía mediante herramientas
              de transparencia, y validación colaborativa, creando comunidades
              más informadas y gobiernos más receptivos y responsables.
            </Typography>
          </div>
        </Grid>
        <Grid item size={{ xs: 12, sm: 9, md: 9 }}>
          <MapContainer
            center={position}
            zoom={10}
            style={{ height: "80vh", width: "100%" }}
          >
            <TileLayer
              url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
              attribution="&copy; OpenStreetMap contributors"
            />
          </MapContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;

import { Box, Divider, Grid, Typography, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MapMark from "./Map";
import { useState } from "react";

const position = [-3.996588, -79.201817];

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Box sx={{ height: "100vh", overflow: "hidden" }}>
      <Grid container spacing={0} sx={{ height: "100%", flexWrap: "nowrap" }}>
        {/* Barra lateral izquierda */}
        <Grid
          item
          sx={{
            width: sidebarOpen ? 300 : 0,
            transition: "width 0.3s ease",
            overflow: "hidden",
            height: "100%",
            bgcolor: "#f8f9fa",
            borderRight: sidebarOpen ? "1px solid #ddd" : "none",
          }}
        >
          <Box
            sx={{
              width: 270,
              height: "100%",
              overflow: "auto",
              p: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6">Newpolitik</Typography>
              <IconButton onClick={() => setSidebarOpen(false)} size="small">
                <ChevronLeftIcon />
              </IconButton>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2" align="justify">
              <strong>New Polítik </strong> es una plataforma digital de
              participación ciudadana que transforma la necesidad en acción,
              conectando a comunidades, políticos . Con una visión de
              convertirse en el puente digital que fortalece la democracia
              participativa, su misión es empoderar a la ciudadanía mediante
              herramientas de transparencia, creando comunidades más informadas
              y gobiernos más receptivos y responsables.
            </Typography>
          </Box>
        </Grid>

        {/* Área del mapa */}
        <Grid
          item
          sx={{
            flex: 1,
            //height: "100%",
            position: "relative",
          }}
        >
          {!sidebarOpen && (
            <IconButton
              onClick={() => setSidebarOpen(true)}
              sx={{
                position: "absolute",
                top: 16,
                left: 16,
                zIndex: 1200,
                bgcolor: "white",
                "&:hover": { bgcolor: "#f5f5f5" },
              }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Box sx={{ p: 2 }}>
            <MapMark position={position} zoom={15} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;

// pages/Home.jsx
import React, { useState } from "react";
import Feed from "../features/feed/Feed";
import MapView from "../features/map/MapView";
import PostModal from "../features/posts/PostModal";
import {


  Grid,
  Box,
  Container,

  useTheme,
  useMediaQuery,
  Tabs,
  Tab,





} from "@mui/material";
import {
  Home as HomeIcon,
  Map,
} from "@mui/icons-material";


const Home = () => {
 
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
 
  const [selectedTab, setSelectedTab] = useState(0);
  const [postModalOpen, setPostModalOpen] = useState(false);



  // Barra de navegación común (para escritorio y móvil)
  

  // Contenido principal
  if (isMobile) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
       
        <Tabs
          value={selectedTab}
          onChange={(e, newVal) => setSelectedTab(newVal)}
          centered
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab icon={<HomeIcon />} label="Feed" />
          <Tab icon={<Map />} label="Mapa" />
        </Tabs>
        <Box sx={{ flex: 1, overflow: "auto" }}>
          {selectedTab === 0 && <Feed />}
          {selectedTab === 1 && <MapView />}
        </Box>
        <PostModal
          open={postModalOpen}
          onClose={() => setPostModalOpen(false)}
          onPostCreated={() => setPostModalOpen(false)}
        />
      </Box>
    );
  }

  // Escritorio: dos columnas
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
    
      <Container maxWidth="xl" sx={{ flex: 1, py: 2 }}>
        <Grid container spacing={2} sx={{ height: "100%" }}>
          <Grid item size={{xs:12, md:4}} sx={{ height: "100%", overflow: "auto" }}>
            <Feed />
          </Grid>
          <Grid item size={{xs:12, md:8}} sx={{ height: "100%" }}>
            <MapView />
          </Grid>
        </Grid>
      </Container>
      <PostModal
        open={postModalOpen}
        onClose={() => setPostModalOpen(false)}
        onPostCreated={() => setPostModalOpen(false)}
      />
    </Box>
  );
};

export default Home;
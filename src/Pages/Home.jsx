// pages/Home.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../services/auth";
import Feed from "../features/feed/Feed";
import MapView from "../features/map/MapView";
import PostModal from "../features/posts/PostModal";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Grid,
  Box,
  Container,
  IconButton,
  useTheme,
  useMediaQuery,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Avatar,
  Menu,
  MenuItem,
  Badge,
} from "@mui/material";
import {
  Search,
  Home as HomeIcon,
  Map,
  Group,
  AddCircle,
  Person,
  Logout,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = async () => {
    await logoutUser();
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  // Barra de navegación común (para escritorio y móvil)
  const NavBar = () => (
    <AppBar position="static" color="default" elevation={1} sx={{ bgcolor: "white" }}>
      <Toolbar>
        {/* Logo */}
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", color: "#1877f2", mr: 2, display: "flex", alignItems: "center" }}
        >
          NewPolitik
        </Typography>

        {/* Buscador (solo en escritorio) */}
        {!isMobile && (
          <TextField
            placeholder="Buscar en NewPolitik"
            size="small"
            variant="outlined"
            sx={{ flexGrow: 1, maxWidth: 400, mr: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        )}

        {/* Navegación central: íconos */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mx: "auto" }}>
          <IconButton color={selectedTab === 0 ? "primary" : "default"} onClick={() => setSelectedTab(0)}>
            <HomeIcon />
          </IconButton>
          <IconButton color={selectedTab === 1 ? "primary" : "default"} onClick={() => setSelectedTab(1)}>
            <Map />
          </IconButton>
          <IconButton onClick={() => navigate("/parties")}>
            <Group />
          </IconButton>
          <IconButton color="primary" onClick={() => setPostModalOpen(true)}>
            <AddCircle />
          </IconButton>
        </Box>

        {/* Perfil y logout */}
        <Box sx={{ ml: "auto", display: "flex", alignItems: "center" }}>
          <IconButton onClick={handleProfileMenuOpen}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: "#1877f2" }}>
              {user?.email?.charAt(0).toUpperCase() || "U"}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem disabled>
              <Typography variant="body2">{user?.email}</Typography>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Logout fontSize="small" sx={{ mr: 1 }} /> Cerrar sesión
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );

  // Contenido principal
  if (isMobile) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <NavBar />
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
      <NavBar />
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
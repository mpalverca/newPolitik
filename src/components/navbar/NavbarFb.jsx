// components/navbar/NavbarFb.jsx
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  TextField,
  InputAdornment,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Tooltip,
  Divider,
  Button,
} from "@mui/material";
import {
  Search,
  Home as HomeIcon,
  Group,
  AddCircle,
  Person,
  Logout,
  Settings,
  Dashboard,
  History,
  Groups2,
} from "@mui/icons-material";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { logoutUser } from "../../services/auth";
import { getUserProfile } from "../../services/users";

// Definición de páginas (con iconos)
const pages = [
  { name: "Inicio", path: "/", icon: <HomeIcon /> },
  { name: "Personas", path: "/persons", icon: <Group /> },  
  { name: "Grupos", path: "/persons", icon: <Groups2 /> },
];

// Opciones del menú de usuario (solo para autenticados)
const userMenuOptions = [
  { name: "Perfil", path: "/perfil", icon: <Person /> },
  { name: "Configuración", path: "/configuracion", icon: <Settings /> },
  { name: "Panel de control", path: "/panel", icon: <Dashboard /> },
  { name: "Historial", path: "/historial", icon: <History /> },
];




const NavBar = ({ onAddPostClick }) => {
  const { user,profile } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [anchorEl, setAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Buscando:", searchTerm);
    navigate(`/buscar?q=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={1}
      sx={{
        bgcolor: "white",
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        {/* Logo */}
        <Typography
          variant="h6"
          noWrap
          component={NavLink}
          to="/"
          sx={{
            fontWeight: 700,
            color: "#1877f2",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            mr: 2,
          }}
        >
          NewPolitik
        </Typography>

        {/* Buscador (solo en escritorio y siempre visible) */}
        {!isMobile && (
          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{ flexGrow: 1, maxWidth: 500, mx: 2 }}
          >
            <TextField
              placeholder="Buscar en NewPolitik..."
              size="small"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
                sx: { borderRadius: 20, bgcolor: "#f0f2f5" },
              }}
            />
          </Box>
        )}

        {/* Navegación central: íconos (escritorio) - visible solo si hay usuario */}
        {!isMobile && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            {pages.map((page) => (
              <Tooltip title={page.name} key={page.name}>
                <IconButton
                  component={NavLink}
                  to={page.path}
                  sx={{
                    color: "#65676b",
                    "&.active": {
                      color: "#1877f2",
                      borderBottom: "3px solid #1877f2",
                      borderRadius: 0,
                    },
                    "&:hover": {
                      bgcolor: "#f0f2f5",
                    },
                  }}
                >
                  {page.icon}
                </IconButton>
              </Tooltip>
            ))}
          </Box>
        )}

        {/* Sección derecha: Agregar (si hay usuario) o Login (si no) */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {user ? (
            // Usuario autenticado: botón Agregar + Avatar
            <>
              <Tooltip title="Crear publicación">
                <IconButton
                  color="primary"
                  onClick={onAddPostClick}
                  sx={{
                    bgcolor: "#e7f3ff",
                    "&:hover": { bgcolor: "#d4e8ff" },
                  }}
                >
                  <AddCircle />
                </IconButton>
              </Tooltip>

              <IconButton onClick={handleProfileMenuOpen} size="small" sx={{ ml: 1 }}>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: "#1877f2",
                    fontSize: "0.9rem",
                  }}
                >
                  {user?.displayName?.charAt(0)?.toUpperCase() ||
                    user?.email?.charAt(0)?.toUpperCase() ||
                    "U"}
                </Avatar>
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                PaperProps={{
                  sx: {
                    mt: 1,
                    minWidth: 200,
                    borderRadius: 2,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  },
                }}
              >
                <MenuItem disabled sx={{ opacity: 1 }}>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {profile?.username || "Usuario"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {profile?.email}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {profile?.phone}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {profile?.phone}
                    </Typography>
                  </Box>
                </MenuItem>
                <Divider />
                {userMenuOptions.map((option) => (
                  <MenuItem
                    key={option.name}
                    onClick={() => {
                      handleProfileMenuClose();
                      navigate(option.path);
                    }}
                    sx={{ gap: 1 }}
                  >
                    {option.icon}
                    {option.name}
                  </MenuItem>
                ))}
                <Divider />
                <MenuItem onClick={handleLogout} sx={{ gap: 1, color: "error.main" }}>
                  <Logout fontSize="small" />
                  Cerrar sesión
                </MenuItem>
              </Menu>
            </>
          ) : (
            // Usuario no autenticado: botón de Login
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/login")}
              sx={{ borderRadius: 20, textTransform: "none" }}
            >
              Iniciar sesión
            </Button>
          )}
        </Box>
      </Toolbar>

      {/* Navegación móvil (solo si hay usuario) */}
      {isMobile && user && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            borderTop: "1px solid #e0e0e0",
            bgcolor: "white",
            py: 0.5,
          }}
        >
          {pages.map((page) => (
            <Tooltip title={page.name} key={page.name}>
              <IconButton
                component={NavLink}
                to={page.path}
                sx={{
                  color: "#65676b",
                  "&.active": {
                    color: "#1877f2",
                  },
                }}
              >
                {page.icon}
              </IconButton>
            </Tooltip>
          ))}
          <Tooltip title="Crear publicación">
            <IconButton color="primary" onClick={onAddPostClick}>
              <AddCircle />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </AppBar>
  );
};

export default NavBar;
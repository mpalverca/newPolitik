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
  Badge,
  useTheme,
  useMediaQuery,
  Tooltip,
  Divider,
} from "@mui/material";
import {
  Search,
  Home as HomeIcon,
  Map,
  Group,
  AddCircle,
  Person,
  Logout,
  Settings,
  Dashboard,
  History,
} from "@mui/icons-material";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { logoutUser } from "../../services/auth";

// Definición de páginas (con iconos)
const pages = [
  { name: "Inicio", path: "/", icon: <HomeIcon /> },
  { name: "personas", path: "/persons", icon: <Group /> },
];

// Opciones del menú de usuario
const userMenuOptions = [
  { name: "Perfil", path: "/perfil", icon: <Person /> },
  { name: "Configuración", path: "/configuracion", icon: <Settings /> },
  { name: "Panel de control", path: "/panel", icon: <Dashboard /> },
  { name: "Historial", path: "/historial", icon: <History /> },
];

const NavBar = ({ onAddPostClick }) => {
  const { user } = useAuth();
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
    // Aquí iría la lógica de búsqueda
    console.log("Buscando:", searchTerm);
    // Podrías redirigir a una página de resultados
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

        {/* Buscador (solo en escritorio) */}
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

        {/* Navegación central: íconos (escritorio) */}
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

        {/* Botón Agregar + Perfil */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Botón de agregar publicación */}
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

          {/* Avatar y menú de usuario */}
          <IconButton
            onClick={handleProfileMenuOpen}
            size="small"
            sx={{ ml: 1 }}
          >
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
                  {user?.displayName || "Usuario"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.email}
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
        </Box>
      </Toolbar>

      {/* Navegación móvil (pestañas inferiores o barra inferior) */}
      {isMobile && (
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
          {/* Botón Agregar en móvil (podría estar en barra inferior) */}
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
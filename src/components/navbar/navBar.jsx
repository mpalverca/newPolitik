import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  Tooltip,
  MenuItem,
  useMediaQuery,
  useTheme,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import logo1 from "../../assets/New_logo.jpg";

const pages = [
  { name: "inicio", path: "" },
  { name: "Biografias", path: "/analisis" },
  //{ name: "Información", path: "/info" },
];

const userSettings = [
  { name: "Perfil", path: "/perfil" },
  { name: "Cuenta", path: "/cuenta" },
  { name: "Panel", path: "/panel" },
  { name: "Cerrar Sesión", path: "/riesgosapp/logout" },
];

export default function ResponsiveNavBar() {
  const theme = useTheme();
  //const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [user, setUser] = useState(null);
  const navegate = useNavigate();
  // Verificar localStorage al cargar el componente
  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (userData) {
      setUser(JSON.parse(userData));
      //    console.log(JSON.parse(userData));
    }
    //    console.log(JSON.parse(userData));
  }, []);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    handleCloseUserMenu();
    // Redirigir a la página de inicio o login si es necesario
    window.location.href = "/riesgosapp/";
  };

  const handleLogin = () => {
    // Simular login - en una app real esto vendría de un formulario o API
    /* const fakeUser = {
      name: "Usuario Ejemplo",
      email: "usuario@ejemplo.com",
      role: "admin",
    }; */

    navegate("/riesgosapp/userauth");

    // localStorage.setItem('user', JSON.stringify(fakeUser));
    // setUser(fakeUser);
  };

  return (
    <AppBar
      position="static"
      style={{ background: "linear-gradient(45deg, #dfd8d6 20%, #080808 90%)" }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo - visible en todas las pantallas */}
          {/* <IconButton
            sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
            edge="start"
            color="inherit"
          >
            <img
              src={logo1}
              alt="Logo"
              style={{ width: "30px", height: "30px" }}
            />
          </IconButton> */}

          {/* Título - versión desktop */}
          <Typography
            variant="h4"
            noWrap
            component="a"
            
            href="/riesgosapp"
            sx={{
              mr: 1,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".1rem",
              color:"#080808",
              textDecoration: "none",
            }}
          >
            New Politik
          </Typography>

          {/* Menú hamburguesa - versión mobile */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => {
                if (page.name === "COE") {
                   if (!user || user.role !== "lider_mtt") {
                    return null;
                  }
                }
                return (
                  <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                    <NavLink
                      to={page.path}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <Typography textAlign="center">{page.name}</Typography>
                    </NavLink>
                  </MenuItem>
                );
              })}
            </Menu>
          </Box>
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              alignItems: "center",
            }}
          >
            <IconButton sx={{ mr: 1 }} color="inherit">
              <img
                src={logo1}
                alt="Logo"
                style={{ width: "30px", height: "30px" }}
              />
            </IconButton>
            <Typography
              variant="h5"
              noWrap
              component="a"
              href="/riesgosapp"
              sx={{
                mr: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".1rem",
                color: "inherit",
                textDecoration: "none",
                fontSize: "1rem",
              }}
            >
              New Politik
            </Typography>
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "center",
            }}
          >
            {pages.map((page) => (
              <Button
                key={page.name}
                component={NavLink}
                to={page.path}
                sx={{
                  my: 0.5,
                  color: "white",
                  display: "block",
                  mx: 1,
                  "&.active": {
                    borderBottom: "2px solid white",
                  },
                }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          {/* Menú de usuario */}
          <Box sx={{ flexGrow: 0 }}>
            {user ? (
              <>
                <Tooltip title="Abrir menú de usuario">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt={user.name}
                      src="/static/images/avatar/2.jpg"
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: "white",
                        color: "#030303",
                      }}
                    >
                      {user.name.charAt(0)}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem>
                    <Typography textAlign="center" sx={{ fontWeight: "bold" }}>
                      {user.name}
                    </Typography>
                  </MenuItem>
                  {userSettings.map((setting) => (
                    <MenuItem
                      key={setting.name}
                      onClick={
                        setting.name === "Cerrar Sesión"
                          ? handleLogout
                          : handleCloseUserMenu
                      }
                    >
                      <NavLink
                        to={setting.path}
                        style={{
                          textDecoration: "none",
                          color: "inherit",
                          width: "100%",
                        }}
                      >
                        <Typography textAlign="center">
                          {setting.name}
                        </Typography>
                      </NavLink>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            ) : (
              <Button
                // variant="contained"
                onClick={handleLogin}
                sx={{
                  backgroundColor: "white",
                  color: "#FF5733",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                }}
              >
                REGISTRO DE USUARIO
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

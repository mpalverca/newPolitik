// src/pages/LoginPage.jsx
import React from "react";
import FacebookLoginButton from "../../pages/login/login_fb";
import { Container } from "@mui/material";

const LoginPage = () => {
  return (
    <Container
      maxWidth="lg"
      sx={{ alignContent: "center", alignItems: "center" }}
    >
      <h2>Inicia sesión en New Polítik</h2>
      <FacebookLoginButton />
      {/* Otros métodos de login */}
    </Container>
  );
};

export default LoginPage;

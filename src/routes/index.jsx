import React, { useState, useEffect } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Home/index";
import ProtectedRoute from "./ProtectedRoute";
import NavBar from "../components/navbar/navBar";
// CAMBIO: El componente debe empezar con mayúscula
export default function AppRouter() {
  const [user, setUser] = useState(null);

  // CAMBIO: useEffect debe estar importado
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route
          path=""
          element={
            <ProtectedRoute>
              <Home />{" "}
            </ProtectedRoute>
          }
        />
        <Route path="/inicio" element={<Home />} />

        </Routes>
    </Router>
  );
}

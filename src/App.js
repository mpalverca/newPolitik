// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import NavBar from "./components/navbar/NavbarFb";
import Persons from "./pages/persons/Persons";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NavBar />
        <Routes>
          {/* Rutas públicas (no requieren autenticación) */}
          <Route path="/" element={<Home />} />
          <Route path="/inicio" element={<Home />} />
          <Route path="/persons" element={<Persons />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Ruta privada: perfil de usuario, panel de control, etc. */}
          <Route
            path="/perfil"
            element={
              <PrivateRoute>
                <div>Perfil de usuario (requiere login)</div>
              </PrivateRoute>
            }
          />
          
          {/* Ruta de detalle de persona (pública) */}
          <Route path="/people/:id" element={<Persons />} />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
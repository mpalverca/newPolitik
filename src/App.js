// App.jsx
import {
  HashRouter as Router,
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import NavBar from "./components/navbar/NavbarFb";
import Persons from "./pages/persons/Persons";

// Componente para rutas privadas
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
  
      <AuthProvider>
            <NavBar/>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/inicio" element={<Home />} />
          <Route path="*" element={<Navigate to="/" />} />
         <Route path= "/persons" element={<Persons/> }  />

        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

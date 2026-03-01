// src/components/ProtectedRoute.js
// src/components/ProtectedRoute.js
import { Navigate } from "react-router-dom";
//import { client } from "../utils/authkey";

export default function ProtectedRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  //client.auth.getUser();
  
  if (!user) {
    return <Navigate to="/inicio" replace />;
  }

  return children;
}
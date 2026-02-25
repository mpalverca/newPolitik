// components/maps/mapaView.jsx
import { MapContainer, TileLayer, LayersControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function MapMark({ position, zoom, renderPolygons, ...props }) {
  return (
    <MapContainer
      center={position}
      zoom={zoom}
      style={{ height: "80vh", width: "100%" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* CORRECCIÓN: Llama a renderPolygons si es una función */}
      {typeof renderPolygons === 'function' ? renderPolygons() : renderPolygons}
      
      {/* Otras capas */}
      {props.children}
    </MapContainer>
  );
}
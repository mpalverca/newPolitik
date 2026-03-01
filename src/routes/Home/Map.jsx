// components/maps/mapaView.jsx
import React, { useState, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  LayersControl,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Popover,
  Stack,
  Typography,
} from "@mui/material";
import { MarkerSimple } from "../../components/map/marker";
import {
  LocationOn as LocationOnIcon,
  Close as CloseIcon,
  ContentCopy as ContentCopyIcon,
} from "@mui/icons-material";
import { DialogCenter } from "../../components/dialogs/dialog";
import EventosPublicos from "../../Pages/homeMap/events";

export default function MapMark({ position, zoom, renderPolygons, ...props }) {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const [type, setType] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const layersConfig = [
    {
      key: "need",
      label: "Necesidad",
      accion: (coords) => handleClickOpen(coords, "necesidad"),
    },
    {
      key: "propsp",
      label: "Propuesta Política",
      accion: (coords) => handleClickOpen(coords, "propuesta"),
    },
  ];
  const handleClickOpen = (coords, type) => {
    setOpenDialog(true);
    setType(type);

    //setCoordinates(coordenate);
  };
  const MapClickHandler = ({ onMapClick }) => {
    useMapEvents({
      click: (e) => onMapClick(e.latlng),
    });
    return null;
  };
  // --- HANDLERS ---

  const handleMapClick = (latlng) => {
    const mapContainer = document.querySelector(".leaflet-container");
    const rect = mapContainer.getBoundingClientRect();

    setCoordinates({
      lat: latlng.lat.toFixed(6),
      lng: latlng.lng.toFixed(6),
      latlng: latlng,
    });

    setMenuAnchor({
      left: rect.left + window.scrollX + 20, // offset para no tapar el click
      top: rect.top + window.scrollY + 20,
    });
  };

  const handleLayerClick = (item) => {
    item.accion(coordinates.latlng);
    setMenuAnchor(null);
  };
  return (
    <Box>
      <MapContainer
        center={position}
        zoom={zoom}
        style={{ height: "85vh", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          /* url="/tiles/isometricos/{z}/{x}/{y}.png"
        tileSize={256}
        noWrap={true} */
        />
        <MapClickHandler onMapClick={handleMapClick} />
        {/* CORRECCIÓN: Llama a renderPolygons si es una función */}
        {coordinates && (
          <MarkerSimple
            iconMark={<LocationOnIcon color="primary" />}
            position={[coordinates.latlng.lat, coordinates.latlng.lng]}
          />
        )}
        {typeof renderPolygons === "function"
          ? renderPolygons()
          : renderPolygons}

        {/* Otras capas */}
        {props.children}
        <EventosPublicos />
      </MapContainer>
      <Popover
        open={Boolean(menuAnchor)}
        anchorReference="anchorPosition"
        anchorPosition={menuAnchor}
        onClose={() => setMenuAnchor(null)}
        PaperProps={{ sx: { width: 225, p: 2, borderRadius: 3 } }}
      >
        <Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Añadir nuevo punto
            </Typography>

            <IconButton size="small" onClick={() => setMenuAnchor(null)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          <Typography variant="subtitle2" align="justify">
            Añade una necesidad o propuesta política en esta ubicación
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <IconButton
              variant="outlined"
              size="small"
              onClick={() =>
                navigator.clipboard.writeText(
                  `${coordinates?.lat}, ${coordinates?.lng}`,
                )
              }
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
            <Typography
              variant="caption"
              display="block"
              color="text.secondary"
              alignContent="center"
            >
              Lat: {coordinates?.lat} | Lng: {coordinates?.lng}
            </Typography>
          </Box>
          <Divider sx={{ my: 1.5 }} />
          <Stack spacing={1}>
            {layersConfig.map((item) =>
              // CORRECCIÓN AQUÍ: usa ===
              item.key === "requerimientos" ? null : (
                <Button
                  color="success"
                  key={item.key}
                  variant="outlined"
                  startIcon={item.icon}
                  fullWidth
                  onClick={() => handleLayerClick(item)}
                  sx={{ justifyContent: "flex-start", textTransform: "none" }}
                >
                  Añadir {item.label}
                </Button>
              ),
            )}
          </Stack>

          {/*   <Button
            variant="outlined"
            fullWidth
            size="small"
            startIcon={<ContentCopyIcon fontSize="small" />}
            sx={{ mt: 2 }}
            onClick={() =>
              navigator.clipboard.writeText(
                `${coordinates?.lat}, ${coordinates?.lng}`,
              )
            }
          >
            Copiar Coordenadas
          </Button> */}
        </Box>
      </Popover>
      <DialogCenter
        title={type}
        open={openDialog}
        
        onClose={() => setOpenDialog(false)}
      />
    </Box>
  );
}

import { divIcon } from "leaflet";
import { useCallback } from "react";
import { renderToString } from "react-dom/server";
import { Marker } from "react-leaflet";

export const MarkerSimple=({iconMark,position})=>{

    const getEventIcon = useCallback((icon) => {
    const circleStyle = {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#adc4ad",
      borderRadius: "50%",
      width: "24px",
      height: "24px",
      boxShadow: "0 2px 8px rgba(233, 233, 233, 0.15)",
    };
    const html = renderToString(
      <div style={circleStyle}>
       {iconMark}
        {/* <DirectionsWalkIcon
          color={color === "Vigente" ? "#f9f9fa" : "#000000"}
          size={14}
        /> */}
      </div>,
    );return divIcon({
          html,
          className: "custom-leaflet-icon",
          iconSize: [30, 30],
          iconAnchor: [15, 30],
        });
      }, []);

    return  (
        <Marker
            
            position={position}
            icon={getEventIcon()}
          >
          </Marker>
    )
}
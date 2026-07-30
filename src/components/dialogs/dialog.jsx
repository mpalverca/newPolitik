import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import NeedForm from "../../pages/homeMap/need";
import PublicarPropuesta from "../../pages/homeMap/propuesta";
import EventosPublicos from "../../pages/homeMap/events";

export const DialogCenter = ({ title, open, onClose }) => {
 
  const handleClose = () => {
    onClose();
  };
  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle
        sx={{
          textAlign: "center",
          // fontSize: 15,
          fontFamily: "fantasy",
          fontWeight: 2,
        }}
      >
         {title === "necesidad" ? (
          "Reporta una necesidad ciudadana"
        ) : title === "propuesta" ? "Ingresa una Propuesta Política" : "Reporta un Evento"}
      </DialogTitle>
      <DialogContent>
        {title === "necesidad" ? (
          <NeedForm onclose={handleClose} />
        ) : title === "propuesta" ? <PublicarPropuesta/> : <EventosPublicos/>}
      </DialogContent>
      {/*   <DialogActions>
        <Button sx={{ mt: 2 }} variant="contained" color="primary">
          Guardar
        </Button>
      </DialogActions> */}
    </Dialog>
  );
};

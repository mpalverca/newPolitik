import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import NeedForm from "../../Pages/homeMap/need";
import PublicarPropuesta from "../../Pages/homeMap/propuesta";

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
        ) : "Ingresa una Propuesta Política"}
      </DialogTitle>
      <DialogContent>
        {title === "necesidad" ? (
          <NeedForm onclose={handleClose} />
        ) : <PublicarPropuesta/>}
      </DialogContent>
      {/*   <DialogActions>
        <Button sx={{ mt: 2 }} variant="contained" color="primary">
          Guardar
        </Button>
      </DialogActions> */}
    </Dialog>
  );
};

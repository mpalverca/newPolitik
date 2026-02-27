import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";

export const DialogCenter = ({
 title,
  open,
  onClose,
}) => {
     const handleClose = () => {
    onClose();
  };
  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>
        Ingrese {title}
      </DialogTitle>
      <DialogContent>
        <TextField fullWidth label={title} variant="outlined" />        
        <TextField sx={{py: 1}} fullWidth label={"aqui va la imagen"} variant="outlined" />        
        <TextField sx={{py: 1}} fullWidth label={"aqui va El lugar"} variant="outlined" />        
        <TextField sx={{py: 1}} fullWidth label={"aqui va El estado"} variant="outlined" />
        
      </DialogContent>
      <DialogActions>
          <Button sx={{mt: 2}} variant="contained" color="primary">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

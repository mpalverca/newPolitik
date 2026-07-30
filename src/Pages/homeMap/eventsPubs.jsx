import React, { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';

const initialEvento = {
  id: null,
  titulo: '',
  descripcion: '',
  fecha: '',
  hora: '',
  mark: '',
  imagen: '',
  ubicacion: {
    provincia: '',
    canton: '',
    sector: '',
    direccion: '',
    lat: '',
    lng: '',
  },
  organizador: '',
  tipo: '',
  realizado: false,
  desc_real: '',
  aforo_aprox: '',
  prueba: '',
};

const EventosPublicos = () => {
  const [open, setOpen] = useState(false);
  const [evento, setEvento] = useState(initialEvento);
  const [eventos, setEventos] = useState([]);

  const handleOpen = () => {
    setEvento(initialEvento);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFieldChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setEvento((prev) => ({ ...prev, [field]: value }));
  };

  const handleUbicacionChange = (field) => (event) => {
    const value = event.target.value;
    setEvento((prev) => ({
      ...prev,
      ubicacion: {
        ...prev.ubicacion,
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    const nuevoEvento = {
      ...evento,
      id: eventos.length + 1,
      aforo_aprox: Number(evento.aforo_aprox) || 0,
      ubicacion: {
        ...evento.ubicacion,
        lat: Number(evento.ubicacion.lat) || 0,
        lng: Number(evento.ubicacion.lng) || 0,
      },
    };

    setEventos((prev) => [...prev, nuevoEvento]);
    setOpen(false);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Agregar Evento Público
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Nuevo Evento Público</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Título"
                value={evento.titulo}
                onChange={handleFieldChange('titulo')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Organizador"
                value={evento.organizador}
                onChange={handleFieldChange('organizador')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Descripción"
                value={evento.descripcion}
                onChange={handleFieldChange('descripcion')}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="date"
                label="Fecha"
                InputLabelProps={{ shrink: true }}
                value={evento.fecha}
                onChange={handleFieldChange('fecha')}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="time"
                label="Hora"
                InputLabelProps={{ shrink: true }}
                value={evento.hora}
                onChange={handleFieldChange('hora')}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Tipo"
                value={evento.tipo}
                onChange={handleFieldChange('tipo')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Link de marca"
                value={evento.mark}
                onChange={handleFieldChange('mark')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Imagen"
                value={evento.imagen}
                onChange={handleFieldChange('imagen')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Provincia"
                value={evento.ubicacion.provincia}
                onChange={handleUbicacionChange('provincia')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Cantón"
                value={evento.ubicacion.canton}
                onChange={handleUbicacionChange('canton')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Sector"
                value={evento.ubicacion.sector}
                onChange={handleUbicacionChange('sector')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Dirección"
                value={evento.ubicacion.direccion}
                onChange={handleUbicacionChange('direccion')}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                label="Lat"
                type="number"
                value={evento.ubicacion.lat}
                onChange={handleUbicacionChange('lat')}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                label="Lng"
                type="number"
                value={evento.ubicacion.lng}
                onChange={handleUbicacionChange('lng')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Prueba"
                value={evento.prueba}
                onChange={handleFieldChange('prueba')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Aforo aproximado"
                value={evento.aforo_aprox}
                onChange={handleFieldChange('aforo_aprox')}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={evento.realizado}
                    onChange={handleFieldChange('realizado')}
                  />
                }
                label="Evento realizado"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                minRows={2}
                label="Descripción del resultado"
                value={evento.desc_real}
                onChange={handleFieldChange('desc_real')}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Eventos agregados</Typography>
        {eventos.length === 0 ? (
          <Typography color="textSecondary">No hay eventos agregados todavía.</Typography>
        ) : (
          <List>
            {eventos.map((item) => (
              <ListItem key={item.id} divider>
                <ListItemText
                  primary={`${item.titulo} (${item.fecha} ${item.hora})`}
                  secondary={item.organizador}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
};

export default EventosPublicos;

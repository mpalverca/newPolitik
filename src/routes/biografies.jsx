// pages/BuscarCandidatos.jsx
import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Avatar,
  Chip,
  Divider,
  Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import FlagIcon from '@mui/icons-material/Flag';

// Datos de ejemplo (10 candidatos)
const candidatosEjemplo = [
  {
    id: 1,
    nombre: "Franco Quezada",
    partido: "MASS",
    cargo: "Ex-Alcalde",
    desc: "Licencniado Educación fisica, ex-concejal, ex Alcalde",
    imagen:  "https://i0.wp.com/cronica.com.ec/wp-content/uploads/2023/05/franco-quezada-alcalde-de-loja.png?resize=674%2C337&ssl=1",
     provincia: "Loja",
    canton: "Loja"
  },
  {
    id: 2,
    nombre: "Patricio Valdivieso",
    partido: "SER",
    cargo: "",
    desc: "Empresario, ex-diputado",
    imagen: "https://scontent.floh2-1.fna.fbcdn.net/v/t39.30808-6/641268598_1777434276981690_3251201677515563136_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=VMORymUKkr0Q7kNvwG5e8MF&_nc_oc=AdkdK7mPoJk6ONdXpUgyqLAL3JBrXPi7JMejhujOSyZn7syU6Mc6mlYKKIC-y83oYA7owz96gBE63xpWIo_Oxh0Z&_nc_zt=23&_nc_ht=scontent.floh2-1.fna&_nc_gid=0ciUOmFMPozjBboBw88l2A&_nc_ss=8&oh=00_AfvWJ8kPWx_7oC-nF-x-9VX6G-WKDHgogyJvHevcM38zuA&oe=69AA4927",
    provincia: "Loja",
    canton: "Loja"
  },
  {
    id: 3,
    nombre: "María José Cueva",
    partido: "Revolución Ciudadana",
    cargo: "Asambleísta",
    desc: "Abogada, activista social",
    imagen: "https://scontent.floh2-1.fna.fbcdn.net/v/t39.30808-6/313949594_207148638377771_919429875249830525_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=DnoVzckWnvYQ7kNvwFdlVJb&_nc_oc=Adki-WmALuQHddkmHyUyl-nKRBVv3FHvUOfhOvlsYhd2WW23Z0hlmx1yzqRqyzljNz118dYapohJ27unjjdvY_4Z&_nc_zt=23&_nc_ht=scontent.floh2-1.fna&_nc_gid=Umfmc7c39fLbQ1_IWD1fJg&_nc_ss=8&oh=00_Afuo-OLzN5YIo7UP2EuUkAbnayZVFu1iUTk3tCdCP3yRDw&oe=69AA4EC1",
    provincia: "Loja",
    canton: "Catamayo"
  },
  {
    id: 4,
    nombre: "José Bolívar Castillo",
    partido: "ARE",
    cargo: "Ex-Alcalde",
    desc: "Historiador, escritor",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Asamble%C3%ADsta_Jos%C3%A9_Bol%C3%ADvar_Castillo_en_su_intervenci%C3%B3n_en_la_sesi%C3%B3n_No.-_235_del_Pleno_de_la_Asamblea_Nacional_%288937060886%29.jpg/1280px-Asamble%C3%ADsta_Jos%C3%A9_Bol%C3%ADvar_Castillo_en_su_intervenci%C3%B3n_en_la_sesi%C3%B3n_No.-_235_del_Pleno_de_la_Asamblea_Nacional_%288937060886%29.jpg",
    provincia: "Loja",
    canton: "Loja"
  },
  {
    id: 5,
    nombre: "Cecilia Vivanco",
    partido: "Pachakutik",
    cargo: "Concejal",
    desc: "Líder indígena",
    imagen: "https://i0.wp.com/cronica.com.ec/wp-content/uploads/2023/05/franco-quezada-alcalde-de-loja.png?resize=674%2C337&ssl=1",
    provincia: "Loja",
    canton: "Saraguro"
  },
  {
    id: 6,
    nombre: "Jorge Reyes",
    partido: "RETO",
    cargo: "",
    desc: "Medico, Ex Docente, Ex Alcalde",
    imagen: "https://scontent.floh2-1.fna.fbcdn.net/v/t39.30808-6/376014976_722190119920595_8341601210744437451_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=WEYBLbjymYEQ7kNvwGlKpKc&_nc_oc=AdnfrDsSGBBWzFEioSaizoivi4nsIrPBEEwS7sHWihgYEe5Fyh3TTfAfxWaoRdapPylGOFMrApFPb9FHF96UViPT&_nc_zt=23&_nc_ht=scontent.floh2-1.fna&_nc_gid=u7iYAzo5MLS9pJRxt9MGaw&_nc_ss=8&oh=00_AfsrsTCsHa_B3Ild5YM-ZwIlVbvdXf05l-LFkRWOFDLa5Q&oe=69AA6560",
    provincia: "Loja",
    canton: "Loja"
  },
  {
    id: 7,
    nombre: "Tania Moreno",
    partido: "MASS",
    cargo: "Concejal",
    desc: "Arquitecta",
    imagen: "https://i0.wp.com/cronica.com.ec/wp-content/uploads/2024/09/mass-partido-politico-con-directiva.png?resize=1024%2C610&ssl=1",
    provincia: "Loja",
    canton: "Cariamanga"
  },
  {
    id: 8,
    nombre: "Juan Pablo Quevedo",
    partido: "SER",
    cargo: "Diputado",
    desc: "Abogado",
    imagen: "https://scontent.floh2-1.fna.fbcdn.net/v/t39.30808-6/376014976_722190119920595_8341601210744437451_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=WEYBLbjymYEQ7kNvwGlKpKc&_nc_oc=AdnfrDsSGBBWzFEioSaizoivi4nsIrPBEEwS7sHWihgYEe5Fyh3TTfAfxWaoRdapPylGOFMrApFPb9FHF96UViPT&_nc_zt=23&_nc_ht=scontent.floh2-1.fna&_nc_gid=u7iYAzo5MLS9pJRxt9MGaw&_nc_ss=8&oh=00_AfsrsTCsHa_B3Ild5YM-ZwIlVbvdXf05l-LFkRWOFDLa5Q&oe=69AA6560",
    provincia: "Zamora Chinchipe",
    canton: "Zamora"
  },
  {
    id: 9,
    nombre: "Luz María Orellana",
    partido: "Revolución Ciudadana",
    cargo: "Asambleísta",
    desc: "Médica",
    imagen: "https://scontent.floh2-1.fna.fbcdn.net/v/t39.30808-6/313949594_207148638377771_919429875249830525_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=DnoVzckWnvYQ7kNvwFdlVJb&_nc_oc=Adki-WmALuQHddkmHyUyl-nKRBVv3FHvUOfhOvlsYhd2WW23Z0hlmx1yzqRqyzljNz118dYapohJ27unjjdvY_4Z&_nc_zt=23&_nc_ht=scontent.floh2-1.fna&_nc_gid=Umfmc7c39fLbQ1_IWD1fJg&_nc_ss=8&oh=00_Afuo-OLzN5YIo7UP2EuUkAbnayZVFu1iUTk3tCdCP3yRDw&oe=69AA4EC1",
    provincia: "Zamora Chinchipe",
    canton: "Yantzaza"
  },
  {
    id: 10,
    nombre: "Carlos Ortega",
    partido: "Pachakutik",
    cargo: "Prefecto",
    desc: "Ingeniero agrónomo",
    imagen: "https://i0.wp.com/cronica.com.ec/wp-content/uploads/2023/05/franco-quezada-alcalde-de-loja.png?resize=674%2C337&ssl=1",
    provincia: "El Oro",
    canton: "Machala"
  }
];

// Lista de provincias (simplificada)
const provincias = [
  "Loja",
  "Zamora Chinchipe",
  "El Oro"
];

// Cantones por provincia (simplificado)
const cantonesPorProvincia = {
  "Loja": ["Loja", "Catamayo", "Saraguro", "Cariamanga", "Macará"],
  "Zamora Chinchipe": ["Zamora", "Yantzaza", "Centinela del Cóndor"],
  "El Oro": ["Machala", "Pasaje", "Santa Rosa"]
};

const BuscarCandidatos = () => {
  const [provincia, setProvincia] = useState('');
  const [canton, setCanton] = useState('');
  const [candidatosFiltrados, setCandidatosFiltrados] = useState([]);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);

  const handleProvinciaChange = (event) => {
    const newProvincia = event.target.value;
    setProvincia(newProvincia);
    setCanton(''); // resetear cantón al cambiar provincia
    // Limpiar resultados
    setCandidatosFiltrados([]);
    setBusquedaRealizada(false);
  };

  const handleCantonChange = (event) => {
    setCanton(event.target.value);
    setCandidatosFiltrados([]);
    setBusquedaRealizada(false);
  };

  const handleBuscar = () => {
    if (!provincia || !canton) {
      alert('Selecciona provincia y cantón');
      return;
    }

    const filtrados = candidatosEjemplo.filter(c => 
      c.provincia === provincia && c.canton === canton
    );
    setCandidatosFiltrados(filtrados);
    setBusquedaRealizada(true);
  };

  const handleLimpiar = () => {
    setProvincia('');
    setCanton('');
    setCandidatosFiltrados([]);
    setBusquedaRealizada(false);
  };

  return (
    <Box  sx={{ mt: 1, mb: 1,p:2 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Buscar candidatos por ubicación
        </Typography>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item size={{xs:12, sm:5}}>
            <FormControl fullWidth>
              <InputLabel>Provincia</InputLabel>
              <Select
                value={provincia}
                label="Provincia"
                onChange={handleProvinciaChange}
              >
                <MenuItem value="">Seleccione provincia</MenuItem>
                {provincias.map(p => (
                  <MenuItem key={p} value={p}>{p}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item size={{xs:12, sm:5}}>
            <FormControl fullWidth disabled={!provincia}>
              <InputLabel>Cantón</InputLabel>
              <Select
                value={canton}
                label="Cantón"
                onChange={handleCantonChange}
              >
                <MenuItem value="">Seleccione cantón</MenuItem>
                {provincia && cantonesPorProvincia[provincia]?.map(c => (
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item size={{xs:12, sm:2}}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleBuscar}
              disabled={!provincia || !canton}
              startIcon={<SearchIcon />}
            >
              Buscar
            </Button>
          </Grid>
        </Grid>
        {busquedaRealizada && (
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1">
              {candidatosFiltrados.length} candidatos encontrados en {canton}, {provincia}
            </Typography>
            <Button size="small" onClick={handleLimpiar}>Limpiar búsqueda</Button>
          </Box>
        )}
      </Paper>

      {/* Resultados en cards */}
      {busquedaRealizada && (
        <>
          {candidatosFiltrados.length === 0 ? (
            <Alert severity="info">No hay candidatos registrados para esta ubicación.</Alert>
          ) : (
            <Grid container spacing={3}>
              {candidatosFiltrados.map(candidato => (
                <Grid item size={{xs:12, sm:6, md:4}} key={candidato.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={candidato.imagen}
                      alt={candidato.nombre}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h6" component="div">
                        {candidato.nombre}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Chip 
                          label={candidato.partido} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                        <Chip 
                          label={candidato.cargo} 
                          size="small" 
                          variant="outlined"
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {candidato.desc}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        <FlagIcon fontSize="small" color="action" />
                        <Typography variant="caption">
                          {candidato.canton}, {candidato.provincia}
                        </Typography>
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button size="small" variant="text">Ver propuestas</Button>
                      <Button size="small" variant="text">Seguir</Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}

      {/* Si no se ha buscado, mostrar mensaje inicial o lista completa? 
          Podemos mostrar algunos candidatos destacados o nada */}
      {!busquedaRealizada && (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            Selecciona una provincia y cantón para ver los candidatos.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default BuscarCandidatos;
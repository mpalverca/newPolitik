import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardMedia, Typography, Box, Chip } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useNavigate } from 'react-router-dom'; // Para navegaci

// Configurar íconos por defecto de Leaflet (fallback)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Función para crear un ícono personalizado a partir de una URL de imagen
const createCustomIcon = (imgUrl, isPast) => {
  // Si es pasado, aplicar filtro gris (opcional) o podrías usar otro ícono
  const iconHtml = L.divIcon({
    html: `<div style="position: relative; width: 40px; height: 40px; border-radius: 50%; overflow: hidden; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3); ${isPast ? 'filter: grayscale(100%); opacity: 0.7;' : ''}">
             <img src="${imgUrl}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.onerror=null; this.src='https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png';" />
           </div>`,
    className: 'custom-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
    tooltipAnchor: [0, -20]
  });
  return iconHtml;
};

const EventosPublicos = () => {
     const map = useMap();
  const [eventos, setEventos] = useState([]);
  const [eventosVisibles, setEventosVisibles] = useState([]);
  const navigate = useNavigate();
  console.log(eventosVisibles)
  useEffect(() => {
    if (!map || !eventos.length) return;

    const filtrarEventos = () => {
      const bounds = map.getBounds();
      const visibles = eventos.filter(evento => {
        const { lat, lng } = evento.ubicacion;
        return bounds.contains([lat, lng]);
      });
      setEventosVisibles(visibles);
    };

    // Filtrar inicialmente
    filtrarEventos();

    // Escuchar eventos de movimiento del mapa
    map.on('moveend zoomend', filtrarEventos);

    // Limpiar listeners al desmontar
    return () => {
      map.off('moveend zoomend', filtrarEventos);
    };
  }, [map, eventos]);

  useEffect(() => {
    // Tus eventos con las modificaciones
    const eventosEjemplo = [
      {
    id: 1,
    titulo: "Campaña de salud",
    descripcion:
      "Espacio de diálogo ciudadano para definir prioridades de inversión municipal",
    fecha: "2024-06-15",
    hora: "18:00",
    mark: "https://scontent.floh2-1.fna.fbcdn.net/v/t39.30808-6/376014976_722190119920595_8341601210744437451_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=WEYBLbjymYEQ7kNvwGlKpKc&_nc_oc=AdnfrDsSGBBWzFEioSaizoivi4nsIrPBEEwS7sHWihgYEe5Fyh3TTfAfxWaoRdapPylGOFMrApFPb9FHF96UViPT&_nc_zt=23&_nc_ht=scontent.floh2-1.fna&_nc_gid=u7iYAzo5MLS9pJRxt9MGaw&_nc_ss=8&oh=00_AfsrsTCsHa_B3Ild5YM-ZwIlVbvdXf05l-LFkRWOFDLa5Q&oe=69AA6560",
    imagen:
      "https://i0.wp.com/cronica.com.ec/wp-content/uploads/2024/09/mass-partido-politico-con-directiva.png?resize=1024%2C610&ssl=1",
    ubicacion: {
      provincia: "Loja",
      canton: "Loja",
      sector: "Parque Central",
      direccion: "Plaza de la Independencia",
      lat: -3.9931,
      lng: -79.2042,
    },
    organizador: "MASS",
    tipo: "Cabildo Abierto",
    // Nuevos campos
    realizado: true,
    desc_real:
      "Se realizó con éxito, asistieron más de 500 personas y se recogieron 30 propuestas ciudadanas.",
    aforo_aprox: 500,
    prueba: "https://www.tiktok.com/@lodelmomentoloja/video/7600894570464890119",
  },
  {
    id: 2,
    titulo: "Socialización: Ordenanza de Movilidad Sostenible",
    descripcion:
      "Presentación de la nueva ordenanza para ciclovías y peatonalización",
    fecha: "2024-06-20",
    hora: "10:00",
    mark: "https://i0.wp.com/cronica.com.ec/wp-content/uploads/2023/05/franco-quezada-alcalde-de-loja.png?resize=674%2C337&ssl=1",
    imagen:
      "https://scontent.floh2-1.fna.fbcdn.net/v/t39.30808-6/313949594_207148638377771_919429875249830525_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=DnoVzckWnvYQ7kNvwFdlVJb&_nc_oc=Adki-WmALuQHddkmHyUyl-nKRBVv3FHvUOfhOvlsYhd2WW23Z0hlmx1yzqRqyzljNz118dYapohJ27unjjdvY_4Z&_nc_zt=23&_nc_ht=scontent.floh2-1.fna&_nc_gid=Umfmc7c39fLbQ1_IWD1fJg&_nc_ss=8&oh=00_Afuo-OLzN5YIo7UP2EuUkAbnayZVFu1iUTk3tCdCP3yRDw&oe=69AA4EC1",
    ubicacion: {
      provincia: "Loja",
      canton: "Loja",
      sector: "Universidad Técnica Particular de Loja",
      direccion: "Campus UTPL, San Cayetano",
      lat: -3.9917,
      lng: -79.2049,
    },
    organizador: "SER (solidaridad, esperanza y respeto)",
    tipo: "Socialización",
    realizado: false,
    desc_real: "",
    aforo_aprox: 200,
    prueba: "",
  },
  {
    id: 3,
    titulo: "Foro: Desarrollo Productivo del Sur",
    descripcion:
      "Encuentro con gremios productivos y candidatos a la prefectura",
    fecha: "2026-06-25",
    hora: "09:00",
    mark: "https://scontent.floh2-1.fna.fbcdn.net/v/t39.30808-6/376014976_722190119920595_8341601210744437451_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=WEYBLbjymYEQ7kNvwGlKpKc&_nc_oc=AdnfrDsSGBBWzFEioSaizoivi4nsIrPBEEwS7sHWihgYEe5Fyh3TTfAfxWaoRdapPylGOFMrApFPb9FHF96UViPT&_nc_zt=23&_nc_ht=scontent.floh2-1.fna&_nc_gid=u7iYAzo5MLS9pJRxt9MGaw&_nc_ss=8&oh=00_AfsrsTCsHa_B3Ild5YM-ZwIlVbvdXf05l-LFkRWOFDLa5Q&oe=69AA6560",
    imagen:
      "https://www.facebook.com/photo/?fbid=122100294836374853&set=a.122100294878374853",
    ubicacion: {
      provincia: "Loja",
      canton: "Loja",
      sector: "Cámara de Comercio",
      direccion: "Av. Universitaria y Bernardo Valdivieso",
      lat: -3.9945,
      lng: -79.2038,
    },
    organizador: "MASS",
    tipo: "Foro",
    realizado: true,
    desc_real:
      "Participaron 150 empresarios y se firmaron 5 acuerdos de cooperación.",
    aforo_aprox: 150,
    prueba: "https://www.facebook.com/watch/?v=ejemplo",
  },
  {
    id: 4,
    titulo: "Foro: Desarrollo Productivo del Sur (segundo)",
    descripcion:
      "Encuentro con gremios productivos y candidatos a la prefectura",
    fecha: "2024-06-25",
    hora: "09:00",
    mark: "https://scontent.floh2-1.fna.fbcdn.net/v/t39.30808-6/641268598_1777434276981690_3251201677515563136_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=VMORymUKkr0Q7kNvwG5e8MF&_nc_oc=AdkdK7mPoJk6ONdXpUgyqLAL3JBrXPi7JMejhujOSyZn7syU6Mc6mlYKKIC-y83oYA7owz96gBE63xpWIo_Oxh0Z&_nc_zt=23&_nc_ht=scontent.floh2-1.fna&_nc_gid=0ciUOmFMPozjBboBw88l2A&_nc_ss=8&oh=00_AfvWJ8kPWx_7oC-nF-x-9VX6G-WKDHgogyJvHevcM38zuA&oe=69AA4927",
    imagen:
      "https://scontent.floh2-1.fna.fbcdn.net/v/t39.30808-6/641504037_1777437430314708_7761634618712188442_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=2a1932&_nc_ohc=nHOF4w4qtygQ7kNvwGtHCTW&_nc_oc=AdmpXIPb6ii7-pzPljkGcsfziaqKyMNKkIIiyZm9jtuVQWVqEiOdBWhmni_LZwMfBje_i6D5fQYf4occFIgOqpjm&_nc_zt=23&_nc_ht=scontent.floh2-1.fna&_nc_gid=8XTIHXVoSU9Z_rHnjS9miQ&_nc_ss=8&oh=00_AfsTSFFDDhiaiAUoYSzKeL12zsa4uHOeiPOU4V1KiBcVPg&oe=69AA7665",
    ubicacion: {
      provincia: "Loja",
      canton: "Loja",
      sector: "Cámara de Comercio",
      direccion: "Av. Universitaria y Bernardo Valdivieso",
      lat: -3.9945,
      lng: -79.2038,
    },
    organizador: "Patricio Valdivieso",
    tipo: "Foro",
    realizado: true,
    desc_real: "",
    aforo_aprox: 300,
    prueba: "",
  },
  {
    id: 5,
    titulo: "Entrega de Obra: Reconstrucción del Mercado Centro Comercial",
    descripcion: "Inauguración de la primera etapa de remodelación",
    fecha: "2026-06-10",
    hora: "11:30",
    mark: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Asamble%C3%ADsta_Jos%C3%A9_Bol%C3%ADvar_Castillo_en_su_intervenci%C3%B3n_en_la_sesi%C3%B3n_No.-_235_del_Pleno_de_la_Asamblea_Nacional_%288937060886%29.jpg/1280px-Asamble%C3%ADsta_Jos%C3%A9_Bol%C3%ADvar_Castillo_en_su_intervenci%C3%B3n_en_la_sesi%C3%B3n_No.-_235_del_Pleno_de_la_Asamblea_Nacional_%288937060886%29.jpg",
    imagen: "https://upload.wikimedia.org/wikipedia/commons/a/aa/LOGO_ARE.jpg",
    ubicacion: {
      provincia: "Loja",
      canton: "Loja",
      sector: "Mercado Centro Comercial",
      direccion: "Calle 10 de Agosto y Sucre",
      lat: -3.9928,
      lng: -79.2025,
    },
    organizador: "ARE",
    tipo: "Socialización",
    realizado: false,
    desc_real: "",
    aforo_aprox: 1000,
    prueba: "",
  },
  {
    id: 6,
    titulo: "Campaña de salud",
    descripcion:
      "Espacio de diálogo ciudadano para definir prioridades de inversión municipal",
    fecha: "2024-06-15",
    hora: "18:00",
    mark: "https://scontent.floh2-1.fna.fbcdn.net/v/t39.30808-6/376014976_722190119920595_8341601210744437451_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=WEYBLbjymYEQ7kNvwGlKpKc&_nc_oc=AdnfrDsSGBBWzFEioSaizoivi4nsIrPBEEwS7sHWihgYEe5Fyh3TTfAfxWaoRdapPylGOFMrApFPb9FHF96UViPT&_nc_zt=23&_nc_ht=scontent.floh2-1.fna&_nc_gid=u7iYAzo5MLS9pJRxt9MGaw&_nc_ss=8&oh=00_AfsrsTCsHa_B3Ild5YM-ZwIlVbvdXf05l-LFkRWOFDLa5Q&oe=69AA6560",
    imagen:
      "https://i0.wp.com/cronica.com.ec/wp-content/uploads/2024/09/mass-partido-politico-con-directiva.png?resize=1024%2C610&ssl=1",
    ubicacion: {
      provincia: "Loja",
      canton: "Loja",
      sector: "El cisne",
      direccion: "Plaza de la Independencia",
      lat: -3.850887, 
      lng: -79.426029,
    },
    organizador: "MASS",
    tipo: "Evento Solidario",
    // Nuevos campos
    realizado: true,
    desc_real:
      "Se realizó con éxito, asistieron más de 500 personas y se recogieron 30 propuestas ciudadanas.",
    aforo_aprox: 500,
    prueba: "https://www.tiktok.com/@lodelmomentoloja/video/7600894570464890119",
  },
    ];

    // Procesar eventos: agregar campo isPast
    const hoy = new Date();
    const eventosConEstado = eventosEjemplo.map(evento => {
      // Validar fecha
      let fechaEvento = null;
      if (evento.fecha && evento.fecha.length === 10) {
        fechaEvento = new Date(evento.fecha + 'T00:00:00');
      }
      const isPast = fechaEvento ? fechaEvento < hoy : true; // Si fecha inválida, considerar pasado
      return { ...evento, isPast };
    });

    setEventos(eventosConEstado);
  }, []);

  const formatearFecha = (fechaStr) => {
    if (!fechaStr || fechaStr.length !== 10) return 'Fecha no disponible';
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(fechaStr).toLocaleDateString('es-EC', opciones);
  };

  return (
    <Box
      center={[-3.9931, -79.2042]}
      zoom={14}
      style={{ height: '600px', width: '100%', borderRadius: '8px' }}
    >
      
      
      {eventosVisibles.map((evento) => (
        <Marker
          key={evento.id}
          position={[evento.ubicacion.lat, evento.ubicacion.lng]}
          icon={createCustomIcon(evento.mark, evento.isPast)}
          eventHandlers={{
            click:()=>{
                navigate(`/Event/${evento.id}`)
            }
          }}
        >
          <Tooltip 
            direction="top"
            offset={[0, -20]}
            opacity={1}
            permanent={false}
            className="evento-tooltip"
          >
            <Card sx={{ maxWidth: 280, p: 1 }}>
              {evento.imagen && (
                <CardMedia
                  component="img"
                  height="120"
                  image={evento.imagen}
                  alt={evento.titulo}
                  sx={{ borderRadius: 1, mb: 1 }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/280x120?text=Sin+imagen';
                  }}
                />
              )}
              
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                {evento.titulo}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                <CalendarTodayIcon fontSize="small" color="primary" />
                <Typography variant="body2">
                  {formatearFecha(evento.fecha)} - {evento.hora}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5, mb: 0.5 }}>
                <LocationOnIcon fontSize="small" color="action" />
                <Typography variant="body2">
                  {evento.ubicacion.sector}, {evento.ubicacion.canton}
                </Typography>
              </Box>
              
              <Box >
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {evento.descripcion.length > 80 
                  ? evento.descripcion.substring(0, 80) + '...' 
                  : evento.descripcion}
              </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Chip 
                  label={evento.tipo} 
                  size="small" 
                  color={evento.isPast ? 'default' : 'primary'} 
                  variant={evento.isPast ? 'outlined' : 'filled'}
                />
                {evento.isPast && (
                  <Chip label="Realizado" size="small" color="default" variant="outlined" />
                )}
              </Box>
              
              <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                Organiza: {evento.organizador}
              </Typography>
            </Card>
          </Tooltip>
        </Marker>
      ))}
    </Box>
  );
};

export default EventosPublicos;
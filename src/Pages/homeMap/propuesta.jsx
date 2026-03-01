import React, { useState, useEffect } from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  FormControlLabel,
  Checkbox,
  Typography,
  Paper,
  Box,
  Alert,
  Chip,
  Autocomplete,
  Slider,
  Switch,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
//import { collection, query, where, getDocs } from 'firebase/firestore';
//import { db } from '../firebase/config'; // Ajusta la ruta según tu configuración

const PublicarPropuesta = () => {
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    imagen: "",
    ubicacion: {
      direccion: "",
      sector: "",
      coordenadas: null,
      alcance: "local",
    },
    periodo:"",
    categoria: "",
    subcategoria: "",
    ambito: "local",
    fechaInicio: "",
    fechaFin: "",
    presupuesto: "",
    fuentePresupuesto: "",
    politicoID: "", // Se llenará automáticamente con el usuario logueado
    politicoNombre: "",
    necesidadesRelacionadas: [],
    estado: "activa",
    votosApoyo: 0,
    seguimiento: [],
    evidencia: [],
    contacto: "",
    terminosAceptados: false,
    publicoObjetivo: "",
    indicadoresExito: "",
    alianzas: "",
    enlace:""
  });

  const [necesidades, setNecesidades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null); // Aquí vendría el usuario logueado

  // Cargar necesidades existentes para relacionar
  useEffect(() => {
    /* const cargarNecesidades = async () => {
      try {
        const q = query(collection(db, 'needs'), where('estado', '!=', 'resuelto'));
        const querySnapshot = await getDocs(q);
        const needsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setNecesidades(needsList);
      } catch (error) {
        console.error('Error cargando necesidades:', error);
      }
    }; */
    //cargarNecesidades();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Manejo especial para campos anidados (ubicacion)
    if (name.startsWith("ubicacion.")) {
      const ubicacionField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        ubicacion: {
          ...prev.ubicacion,
          [ubicacionField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            ubicacion: {
              ...prev.ubicacion,
              coordenadas: {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              },
            },
          }));

          reverseGeocode(position.coords.latitude, position.coords.longitude);
          alert("¡Ubicación obtenida correctamente!");
        },
        (error) => {
          console.error("Error obteniendo ubicación:", error);
          alert(
            "No se pudo obtener tu ubicación. Por favor, ingrésala manualmente.",
          );
        },
      );
    }
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      );
      const data = await response.json();

      if (data.display_name) {
        setFormData((prev) => ({
          ...prev,
          ubicacion: {
            ...prev.ubicacion,
            direccion: data.display_name,
            sector: data.address?.suburb || data.address?.neighbourhood || "",
          },
        }));
      }
    } catch (error) {
      console.error("Error en reverse geocoding:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.terminosAceptados) {
      alert("Debes aceptar los términos y condiciones");
      return;
    }

    if (!formData.titulo || !formData.descripcion || !formData.categoria) {
      alert("Por favor completa todos los campos requeridos");
      return;
    }

    setLoading(true);

    try {
      // Aquí iría la lógica para guardar en Firebase
      // const docRef = await addDoc(collection(db, 'proposals'), {
      //   ...formData,
      //   fechaPublicacion: new Date(),
      //   politicoID: user.uid,
      //   politicoNombre: user.displayName
      // });

      console.log("Propuesta guardada:", formData);

      alert("¡Propuesta publicada exitosamente!");

      // Resetear formulario
      setFormData({
        titulo: "",
        descripcion: "",
        imagen: "",
        ubicacion: {
          direccion: "",
          sector: "",
          coordenadas: null,
          alcance: "local",
        },
        categoria: "",
        subcategoria: "",
        ambito: "local",
        fechaInicio: "",
        fechaFin: "",
        presupuesto: "",
        fuentePresupuesto: "",
        politicoID: "",
        politicoNombre: "",
        necesidadesRelacionadas: [],
        estado: "activa",
        votosApoyo: 0,
        seguimiento: [],
        evidencia: [],
        contacto: "",
        terminosAceptados: false,
        publicoObjetivo: "",
        indicadoresExito: "",
        alianzas: "",
      });
    } catch (error) {
      console.error("Error al publicar propuesta:", error);
      alert("Error al publicar la propuesta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 2, maxWidth: 800, mx: "auto", my: 2 }}>
      <Alert severity="info" sx={{ mb: 2 }}>
        Completa todos los campos requeridos (*). Tu propuesta será visible en
        el mapa y podrá recibir apoyo de la comunidad.
      </Alert>

      <form onSubmit={handleSubmit}>
        {/* Título */}
        <TextField
          fullWidth
          label="Título de la propuesta"
          name="titulo"
          variant="outlined"
          value={formData.titulo}
          onChange={handleChange}
          placeholder="Ej: Construcción de parque lineal en el sector norte"
          required
          sx={{ mb: 2 }}
        />

        {/* Descripción */}
        <TextField
          fullWidth
          label="Descripción detallada"
          name="descripcion"
          variant="outlined"
          value={formData.descripcion}
          onChange={handleChange}
          multiline
          rows={4}
          placeholder="Describe tu propuesta en detalle: qué incluye, a quién beneficia, cómo se implementará..."
          required
          sx={{ mb: 2 }}
        />

        {/* Imagen */}
        <TextField
          fullWidth
          label="URL de imagen representativa"
          name="imagen"
          variant="outlined"
          value={formData.imagen}
          onChange={handleChange}
          placeholder="https://ejemplo.com/imagen-propuesta.jpg"
          helperText="Imagen que represente visualmente tu propuesta"
          sx={{ mb: 2 }}
        />

        {/* Ubicación */}
        <Typography variant="subtitle1" gutterBottom sx={{ mt: 1 }}>
          Ubicación de la propuesta
        </Typography>

        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          <TextField
            fullWidth
            label="Dirección específica *"
            name="ubicacion.direccion"
            variant="outlined"
            value={formData.ubicacion.direccion}
            onChange={handleChange}
            placeholder="Ej: Av. Principal y calle 3"
            required
          />
          <Button
            variant="outlined"
            onClick={getCurrentLocation}
            startIcon={<LocationOnIcon />}
            sx={{ minWidth: "120px" }}
          >
            Ubicación actual
          </Button>
        </Box>
        <TextField
          fullWidth
          label="Sector/Barrio"
          name="ubicacion.sector"
          variant="outlined"
          value={formData.ubicacion.sector}
          onChange={handleChange}
          placeholder="Ej: Los Esteros"
          required
          sx={{ mb: 2 }}
        />

        {/* Alcance geográfico */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Alcance de la propuesta *</InputLabel>
          <Select
            name="ubicacion.alcance"
            value={formData.ubicacion.alcance}
            label="Alcance de la propuesta"
            onChange={handleChange}
            required
          >
            <MenuItem value="puntual">Puntual (lugar específico)</MenuItem>           
            <MenuItem value="sectorial">Sectorial (un barrio) </MenuItem>
             <MenuItem value="local">Local (varios barrios / parroquia) </MenuItem>
            <MenuItem value="cantonal">Cantonal (todo el cantón)</MenuItem>
          </Select>
        </FormControl>

        {/* Categoría */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Categoría principal *</InputLabel>
          <Select
            name="categoria"
            value={formData.categoria}
            label="Categoría principal *"
            onChange={handleChange}
            required
          >
            <MenuItem value="vialidad">
              Vialidad (calles, puentes, aceras)
            </MenuItem>
            <MenuItem value="conectividad">
              Conectividad (transporte, internet)
            </MenuItem>
            <MenuItem value="seguridad">
              Seguridad (alumbrado, cámaras)
            </MenuItem>
            <MenuItem value="desarrollo">
              Desarrollo social (educación, salud)
            </MenuItem>
            <MenuItem value="saneamiento">
              Saneamiento (basura, limpieza)
            </MenuItem>
            <MenuItem value="alcantarillado">
              Alcantarillado (aguas servidas)
            </MenuItem>
            <MenuItem value="energia">Energía (electricidad)</MenuItem>
            <MenuItem value="espacios_publicos">
              Espacios públicos (parques, plazas)
            </MenuItem>
            <MenuItem value="vivienda">Vivienda</MenuItem>
            <MenuItem value="medio_ambiente">Medio ambiente</MenuItem>
          </Select>
        </FormControl>

        {/* Subcategoría condicional */}
        {formData.categoria === "vialidad" && (
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Tipo específico</InputLabel>
            <Select
              name="subcategoria"
              value={formData.subcategoria}
              label="Tipo específico"
              onChange={handleChange}
            >
              <MenuItem value="construccion_calles">
                Construcción de calles
              </MenuItem>
              <MenuItem value="reparacion_baches">
                Reparación de baches
              </MenuItem>
              <MenuItem value="aceras">Construcción de aceras</MenuItem>
              <MenuItem value="puentes">Puentes/pasos elevados</MenuItem>
              <MenuItem value="senalizacion">Señalización vial</MenuItem>
            </Select>
          </FormControl>
        )}

        {/* Ámbito */}
        {/* <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Ámbito de gobierno *</InputLabel>
          <Select
            name="ambito"
            value={formData.ambito}
            label="Ámbito de gobierno *"
            onChange={handleChange}
            required
          >
            <MenuItem value="local">Local (Municipio/GAD)</MenuItem>
            <MenuItem value="regional">
              Regional (Prefectura/Gobierno provincial)
            </MenuItem>
            <MenuItem value="nacional">Nacional (Gobierno central)</MenuItem>
          </Select>
        </FormControl> */}

        {/* Fechas */}
        {/* <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            label="Fecha estimada de inicio"
            name="fechaInicio"
            type="date"
            variant="outlined"
            value={formData.fechaInicio}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Fecha estimada de finalización"
            name="fechaFin"
            type="date"
            variant="outlined"
            value={formData.fechaFin}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        </Box> */}
<FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Periodo de ejecución *</InputLabel>
          <Select
            name="periodo"
            value={formData.periodo}
            label="Categoría principal *"
            onChange={handleChange}
            required
          >
           <MenuItem value="cero">
              Corto plazo (6 meses)
            </MenuItem> <MenuItem value="primer">
              Primer año 
            </MenuItem>
            <MenuItem value="segundo">
              Mitad de administración
            </MenuItem>
            <MenuItem value="final">
              Durante Toda la administración
            </MenuItem>
           
          </Select>
        </FormControl>
        {/* Presupuesto */}
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            sx={{ flexShrink: 0}}
            label="Presupuesto estimado ($)"
            name="presupuesto"
            variant="outlined"
            value={formData.presupuesto}
            onChange={handleChange}
            placeholder="Ej: 50000"
            type="number"
          />
          <TextField
            fullWidth
            label="Fuente de financiamiento"
            name="fuentePresupuesto"
            variant="outlined"
            value={formData.fuentePresupuesto}
            onChange={handleChange}
            placeholder="Ej: Presupuesto municipal, fondo externo..."
          />
        </Box>
        
        {/* Relación con necesidades ciudadanas */}
       {/*  <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
          Vincular con necesidades ciudadanas existentes
        </Typography>
        <Autocomplete
          multiple
          options={necesidades}
          getOptionLabel={(option) =>
            `${option.titulo} (${option.ubicacion?.sector || "Sin sector"})`
          }
          value={necesidades.filter((n) =>
            formData.necesidadesRelacionadas.includes(n.id),
          )}
          onChange={(event, newValue) => {
            setFormData((prev) => ({
              ...prev,
              necesidadesRelacionadas: newValue.map((n) => n.id),
            }));
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Buscar necesidades relacionadas"
              placeholder="Escribe para buscar..."
              sx={{ mb: 2 }}
            />
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                label={option.titulo.substring(0, 20) + "..."}
                {...getTagProps({ index })}
                size="small"
              />
            ))
          }
        /> */}
        {/* Información adicional */}
        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
          Información complementaria
        </Typography>

        <TextField
          fullWidth
          label="Público objetivo / Beneficiarios"
          name="publicoObjetivo"
          variant="outlined"
          value={formData.publicoObjetivo}
          onChange={handleChange}
          multiline
          rows={2}
          placeholder="¿A quiénes beneficia directamente esta propuesta?"
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Indicadores de éxito"
          name="indicadoresExito"
          variant="outlined"
          value={formData.indicadoresExito}
          onChange={handleChange}
          multiline
          rows={2}
          placeholder="¿Cómo se medirá el éxito de la propuesta? Ej: número de beneficiarios, km de vías construidas..."
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Alianzas / Organizaciones involucradas"
          name="alianzas"
          variant="outlined"
          value={formData.alianzas}
          onChange={handleChange}
          placeholder="Ej: Ministerio de Transporte, empresa privada XYZ, ONG..."
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Contacto para seguimiento"
          name="contacto"
          variant="outlined"
          value={formData.contacto}
          onChange={handleChange}
          placeholder="Email o teléfono de contacto"
          sx={{ mb: 2 }}
        />
 <TextField
          fullWidth
          label="Enlace de propuesta"
          name="enlace"
          variant="outlined"
          value={formData.enlace}
          onChange={handleChange}
          placeholder="https://ejemplo.com/imagen-propuesta.jpg"
          helperText="Aqui puedes agregar un enlace para propuesta"
          sx={{ mb: 2 }}
        />
        {/* Términos */}
        <FormControlLabel
          control={
            <Checkbox
              name="terminosAceptados"
              checked={formData.terminosAceptados}
              onChange={handleChange}
              required
            />
          }
          label="Confirmo que la información proporcionada es verídica y me comprometo a dar seguimiento a esta propuesta *"
          sx={{ mb: 2 }}
        />

        {/* Botón de envío */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          disabled={loading || !formData.terminosAceptados}
          sx={{ mt: 2 }}
        >
          {loading ? "Publicando..." : "Publicar propuesta"}
        </Button>
      </form>
    </Paper>
  );
};

export default PublicarPropuesta;

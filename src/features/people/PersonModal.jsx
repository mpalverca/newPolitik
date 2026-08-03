// features/people/PersonModal.jsx
import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  Alert,
  IconButton,
  Paper,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
} from "@mui/material";
import {
  Close,
  Photo,
  Person,
  Category,
  Description,
} from "@mui/icons-material";
import { createPerson, updatePerson } from "../../services/people";
import {
  getProvincias,
  getCantones,
  getParroquias,
  getAllParroquias,
} from "@lobo.cyber.ec/ecuador-geo";

const CATEGORY_OPTIONS = [
  { value: "politico", label: "👔 Político" },
  { value: "activista", label: "✊ Activista" },
  { value: "empresario", label: "💼 Empresario" },
  { value: "academico", label: "🎓 Académico" },
  { value: "periodista", label: "📰 Periodista" },
  { value: "artista", label: "🎨 Artista" },
  { value: "deportista", label: "⚽ Deportista" },
  { value: "religioso", label: "⛪ Religioso" },
  { value: "otro", label: "🔹 Otro" },
];

const PersonModal = ({ open, onClose, person = null, onSuccess }) => {
  const isEdit = !!person;
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    photoURL: "",
    category: "",
    ocupa: "",
    link: "",
    provincia: "",
    canton: "",
    parroquia: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Estados para ubicación
  const [provinciasList, setProvinciasList] = useState([]);
  const [cantonesList, setCantonesList] = useState([]);
  const [parroquiasList, setParroquiasList] = useState([]);
  const [provincia, setProvincia] = useState(person?.provincia || "");
  const [canton, setCanton] = useState(person?.canton || "");
  const [parroquia, setParroquia] = useState(person?.parroquia || "");

  // Cargar provincias al montar
  useEffect(() => {
    const provinciasData = getProvincias();
    setProvinciasList(provinciasData);
  }, []);

  // Al cambiar provincia, cargar cantones
  useEffect(() => {
    if (provincia) {
      const provinciaObj = provinciasList.find((p) => p.nombre === provincia);
      if (provinciaObj) {
        const cantonesData = getCantones(provinciaObj.codigo);
        setCantonesList(cantonesData);
      } else {
        setCantonesList([]);
      }
    } else {
      setCantonesList([]);
    }
    setCanton("");
    setParroquia("");
  }, [provincia, provinciasList]);

  // Al cambiar cantón, cargar parroquias
  useEffect(() => {
    if (canton && provincia) {
      const provinciaObj = provinciasList.find((p) => p.nombre === provincia);
      
      if (provinciaObj) {
        const cantonesData = getCantones(provinciaObj.codigo);
        const cantonObj = cantonesData.find((c) => c.nombre === canton);
        if (cantonObj) {
          const parroquiasData = getParroquias(
            provinciaObj.codigo,
            cantonObj.codigo,
          );

          setParroquiasList(parroquiasData);
        } else {
          setParroquiasList([]);
        }
      }
    } else {
      setParroquiasList([]);
    }
    setParroquia("");
  }, [canton, provincia, provinciasList]);

  // Rellenar formulario al editar
  useEffect(() => {
    if (person) {
      setFormData({
        name: person.name || "",
        bio: person.bio || "",
        photoURL: person.photoURL || "",
        category: person.category || "",
        ocupa: person.ocupa || "",
        link: person.link || "",
        provincia: person.provincia || "",
        canton: person.canton || "",
        parroquia: person.parroquia || "",
      });
      setProvincia(person.provincia || "");
      setCanton(person.canton || "");
      setParroquia(person.parroquia || "");
    } else {
      setFormData({
        name: "",
        bio: "",
        photoURL: "",
        category: "",
        ocupa: "",
        link: "",
        provincia: "",
        canton: "",
        parroquia: "",
      });
      setProvincia("");
      setCanton("");
      setParroquia("");
    }
  }, [person]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("El nombre es obligatorio");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const dataToSave = {
        ...formData,
        lugar: {
          prov: provincia,
          canton: canton,
          parroq: parroquia,
          ubi: [],
        },
      };
      if (isEdit) {
        await updatePerson(person.id, dataToSave);
      } else {
        await createPerson(dataToSave);
      }
      onSuccess();
      const onclosehandle = () => {
        onclose();
      };

      setFormData("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Paper
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "95%", sm: 600 },
          maxHeight: "90vh",
          overflow: "auto",
          p: 3,
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            {isEdit ? "Editar persona" : "Añadir persona"}
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Nombre completo *"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Ocupación (opcional)"
              value={formData.ocupa}
              onChange={(e) => handleChange("ocupa", e.target.value)}
              fullWidth
            />

            <TextField
              label="URL de foto de perfil (opcional)"
              value={formData.photoURL}
              onChange={(e) => handleChange("photoURL", e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Photo />
                  </InputAdornment>
                ),
              }}
            />

            <FormControl fullWidth>
              <InputLabel id="category-select-label">Categoría</InputLabel>
              <Select
                labelId="category-select-label"
                required
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
                label="Categoría"
                startAdornment={
                  <InputAdornment position="start">
                    <Category />
                  </InputAdornment>
                }
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Enlace de biografía (opcional)"
              value={formData.link}
              onChange={(e) => handleChange("link", e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Description />
                  </InputAdornment>
                ),
              }}
            />

            <Grid container spacing={2}>
              <Grid item size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth>
                  <InputLabel>Provincia</InputLabel>
                  <Select
                    value={provincia}
                    label="Provincia"
                    onChange={(e) => setProvincia(e.target.value)}
                  >
                    <MenuItem value="">Seleccionar</MenuItem>
                    {provinciasList.map((p) => (
                      <MenuItem key={p.codigo} value={p.nombre}>
                        {p.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth disabled={!provincia}>
                  <InputLabel>Cantón</InputLabel>
                  <Select
                    value={canton}
                    label="Cantón"
                    onChange={(e) => setCanton(e.target.value)}
                  >
                    <MenuItem value="">Seleccionar</MenuItem>
                    {cantonesList.map((c) => (
                      <MenuItem key={c.codigo} value={c.nombre}>
                        {c.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item size={{ xs: 12, sm: 4 }}>
                <FormControl fullWidth disabled={!canton}>
                  <InputLabel>Parroquia</InputLabel>
                  <Select
                    value={parroquia}
                    label="Parroquia"
                    onChange={(e) => setParroquia(e.target.value)}
                  >
                    <MenuItem value="">Seleccionar</MenuItem>
                    {parroquiasList.map((p) => (
                      <MenuItem key={p.codigo} value={p.nombre}>
                        {p.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {error && <Alert severity="error">{error}</Alert>}

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              fullWidth
              sx={{ bgcolor: "#1877f2", "&:hover": { bgcolor: "#166fe5" } }}
            >
              {loading
                ? "Guardando..."
                : isEdit
                  ? "Actualizar"
                  : "Crear persona"}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Modal>
  );
};

export default PersonModal;

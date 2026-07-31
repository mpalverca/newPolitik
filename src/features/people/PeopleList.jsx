// features/people/PeopleList.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
  Button,
  Container,
} from "@mui/material";
import { Search, Add, Refresh } from "@mui/icons-material";
import { subscribeToPeople, searchPeople } from "../../services/people";  // ✅ Eliminar filterPeopleByType
import PersonCard from "./PersonCard";
import PersonModal from "./PersonModal";

const PeopleList = () => {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = subscribeToPeople((data) => {
      setPeople(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      // Reiniciar suscripción (ya está en tiempo real)
      return;
    }
    setLoading(true);
    try {
      const results = await searchPeople(searchTerm);
      setPeople(results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setSearchTerm("");
    // La suscripción se encarga de actualizar
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <TextField
          placeholder="Buscar personas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={{ flexGrow: 1, maxWidth: 400 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        <Button variant="outlined" onClick={handleSearch} startIcon={<Search />}>
          Buscar
        </Button>
        <Button variant="outlined" onClick={handleRefresh} startIcon={<Refresh />}>
          Reiniciar
        </Button>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setModalOpen(true)}
          sx={{ bgcolor: "#1877f2" }}
        >
          Añadir persona
        </Button>
      </Box>

      {error && (
        <Alert severity="error" onClose={() => setError("")} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {people.length === 0 ? (
        <Alert severity="info">No hay personas registradas. ¡Agrega la primera!</Alert>
      ) : (
        <Grid container spacing={3}>
          {people.map((person) => (
            <Grid item key={person.id} xs={12} sm={6} md={4} lg={3}>
              <PersonCard person={person} />
            </Grid>
          ))}
        </Grid>
      )}

      <PersonModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onPersonCreated={() => setModalOpen(false)}
      />
    </Container>
  );
};

export default PeopleList;
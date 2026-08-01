// features/people/PersonAutocomplete.jsx
import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  TextField,
  Box,
  Avatar,
  Typography,
  CircularProgress,
} from "@mui/material";
import { searchPeople, getPopularPeople } from "../../services/people";

const PersonAutocomplete = ({
  value,
  onChange,
  label = "Personaje",
  showInitialOptions = true, // Si quieres mostrar opciones iniciales
}) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [initialLoaded, setInitialLoaded] = useState(false);

  // Cargar opciones iniciales (populares) al montar
  useEffect(() => {
    if (showInitialOptions && !initialLoaded) {
      const loadInitial = async () => {
        setLoading(true);
        try {
          const popular = await getPopularPeople(5);
          setOptions(popular);
          setInitialLoaded(true);
        } catch (error) {
          console.error("Error cargando personajes populares:", error);
        } finally {
          setLoading(false);
        }
      };
      loadInitial();
    }
  }, [showInitialOptions, initialLoaded]);

  // Búsqueda cuando el usuario escribe
  useEffect(() => {
    if (inputValue.length < 2) {
      // Si no hay texto de búsqueda, mostrar opciones iniciales (si están cargadas)
      if (showInitialOptions && initialLoaded && options.length === 0) {
        getPopularPeople(5).then(setOptions).catch(console.error);
      }
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await searchPeople(inputValue);
        setOptions(results);
      } catch (error) {
        console.error("Error buscando personajes:", error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, showInitialOptions, initialLoaded]);

  // Manejar selección
  const handleChange = (event, newValue) => {
    if (newValue && typeof newValue === "object") {
      onChange(newValue); // Devuelve el objeto completo { id, name, avatar, ... }
    } else {
      onChange(null);
    }
  };

  return (
    <Autocomplete
      value={value || null}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      options={options}
      loading={loading}
      getOptionLabel={(option) => (typeof option === "string" ? option : option.name || "")}
      isOptionEqualToValue={(option, value) => option.id === value?.id}
      renderOption={(props, option) => (
        <Box component="li" {...props} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar src={option.avatar} sx={{ width: 32, height: 32 }}>
            {option.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="body1">{option.name}</Typography>
            {option.bio && (
              <Typography variant="caption" color="text.secondary">
                {option.bio.substring(0, 50)}...
              </Typography>
            )}
          </Box>
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder="Buscar o seleccionar personaje"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading && <CircularProgress color="inherit" size={20} />}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default PersonAutocomplete;
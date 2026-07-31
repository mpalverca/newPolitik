// pages/People.jsx
import React, { useState } from "react";
import { Box, Container, Typography, Paper } from "@mui/material";
import AddPersonModal from "../../features/people/AddPersonModal";
import PeopleList from "../../features/people/PeopleList";

const People = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const handlePersonCreated = () => {
    // La lista se actualizará automáticamente gracias a la suscripción
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: "#1877f2" }}>
          Personas
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Gestiona las personas y personalidades políticas
        </Typography>

        <PeopleList onAddClick={() => setModalOpen(true)} />

        <AddPersonModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onPersonCreated={handlePersonCreated}
        />
      </Paper>
    </Container>
  );
};

export default People;
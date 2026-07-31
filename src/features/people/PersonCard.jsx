// features/people/PersonCard.jsx
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Box, 
  Avatar, 
  IconButton, 
  Chip,
  Tooltip 
} from "@mui/material";
import { Favorite, FavoriteBorder, Person } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { likePerson, unlikePerson } from "../../services/people";  // ✅ Usar likePerson/unlikePerson

const PersonCard = ({ person }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id, name, bio, avatar, cover, likes, likedBy = [] } = person;

  // Estado local para evitar re-renderizados excesivos
  const [isLiked, setIsLiked] = useState(user ? likedBy.includes(user.uid) : false);
  const [likesCount, setLikesCount] = useState(likes || 0);

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!user) return;

    try {
      if (isLiked) {
        await unlikePerson(id, user.uid);
        setIsLiked(false);
        setLikesCount((prev) => prev - 1);
      } else {
        await likePerson(id, user.uid);
        setIsLiked(true);
        setLikesCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error al actualizar like:", error);
    }
  };

  const handleClick = () => {
    navigate(`/people/${id}`);
  };

  return (
    <Card
      sx={{
        maxWidth: 345,
        cursor: "pointer",
        transition: "0.3s",
        "&:hover": { transform: "scale(1.03)", boxShadow: 6 },
        borderRadius: 2,
        overflow: "hidden",
      }}
      onClick={handleClick}
    >
      {/* Portada */}
      <Box sx={{ position: "relative", height: 140 }}>
        <CardMedia
          component="img"
          image={cover || "https://via.placeholder.com/345x140?text=Cover"}
          alt={name}
          sx={{ height: "100%", objectFit: "cover" }}
        />
        {/* Avatar superpuesto */}
        <Avatar
          src={avatar || "https://via.placeholder.com/80"}
          sx={{
            position: "absolute",
            bottom: -30,
            left: 16,
            width: 80,
            height: 80,
            border: "3px solid white",
            bgcolor: "#1877f2",
          }}
        >
          {name?.charAt(0).toUpperCase() || <Person />}
        </Avatar>
      </Box>

      <CardContent sx={{ pt: 4 }}>
        <Typography variant="h6" fontWeight="bold" noWrap>
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, height: 40, overflow: "hidden" }}>
          {bio || "Sin biografía"}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Chip
            icon={<Favorite />}
            label={`${likesCount} Me gusta`}
            size="small"
            variant="outlined"
          />
          <Tooltip title={isLiked ? "Quitar like" : "Dar like"}>
            <IconButton onClick={handleLike} color={isLiked ? "error" : "default"}>
              {isLiked ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PersonCard;
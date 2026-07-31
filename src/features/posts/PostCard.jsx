// features/posts/PostCard.jsx
import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  Box,
  IconButton,
  Chip,
  Divider,
} from "@mui/material";
import {
  FavoriteBorder,
  ChatBubbleOutline,
  Share,
  LocationOn,
  Link as LinkIcon,
} from "@mui/icons-material";

const PostCard = ({ post }) => {
  const { text, imageUrl, lat, lng, link, character, author, createdAt,user } = post;

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <Card variant="outlined" sx={{ mb: 2, borderRadius: 2, boxShadow: "0 1px 3px rgba(0,0,0,0.12)" }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: "#1877f2" }}>
            {author ? author.charAt(0).toUpperCase() : "U"}
          </Avatar>
        }
       /*  title={author || "Usuario anónimo"}*/
        subheader={formattedDate} 
        title={user|| "Usuario anónimo"}
  
      />
      <CardContent>
        <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", mb: 1 }}>
          {text}
        </Typography>

        {imageUrl && (
          <Box
            component="img"
            src={imageUrl}
            alt="Imagen de la publicación"
            sx={{
              width: "100%",
              maxHeight: 300,
              objectFit: "cover",
              borderRadius: 1,
              mt: 1,
            }}
          />
        )}

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
          {lat && lng && (
            <Chip
              icon={<LocationOn fontSize="small" />}
              label={`${lat.toFixed(4)}, ${lng.toFixed(4)}`}
              size="small"
              variant="outlined"
            />
          )}
          {character && (
            <Chip label={`Personaje: ${character}`} size="small" variant="outlined" />
          )}
          {link && (
            <Chip
              icon={<LinkIcon fontSize="small" />}
              label="Enlace"
              size="small"
              component="a"
              href={link}
              target="_blank"
              clickable
            />
          )}
        </Box>
      </CardContent>
      <Divider />
      <CardActions sx={{ justifyContent: "space-around" }}>
        <IconButton size="small">
          <FavoriteBorder fontSize="small" /> <Typography variant="caption">Me gusta</Typography>
        </IconButton>
        <IconButton size="small">
          <ChatBubbleOutline fontSize="small" /> <Typography variant="caption">Comentar</Typography>
        </IconButton>
        <IconButton size="small">
          <Share fontSize="small" /> <Typography variant="caption">Compartir</Typography>
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default PostCard;
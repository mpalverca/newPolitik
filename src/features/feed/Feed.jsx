// features/feed/Feed.jsx
import React, { useState, useEffect } from "react";
import { Box, CircularProgress, Typography, Alert } from "@mui/material";
import { subscribeToPosts } from "../../services/posts";
import PostCard from "../posts/PostCard";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToPosts((data) => {
      setPosts(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (posts.length === 0) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        No hay publicaciones aún. Haz clic en el botón "Agregar" para crear la primera.
      </Alert>
    );
  }

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", maxheight:200, p: 1, display: "overFlow", gap: 2 }}>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </Box>
  );
};

export default Feed;
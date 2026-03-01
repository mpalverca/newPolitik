// components/MediaEmbed.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';

const MediaEmbed = ({ url }) => {
  if (!url) return null;

  // Función para detectar el tipo de medio y generar embed
  const getEmbedUrl = (originalUrl) => {
    // YouTube
    const youtubeRegex = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/;
    const youtubeMatch = originalUrl.match(youtubeRegex);
    if (youtubeMatch) {
      return {
        type: 'youtube',
        embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}`,
        thumbnail: `https://img.youtube.com/vi/${youtubeMatch[1]}/hqdefault.jpg`
      };
    }

    // Facebook (video público)
    if (originalUrl.includes('facebook.com') && originalUrl.includes('/videos/')) {
      // Nota: Facebook requiere un div especial con FB SDK, pero simplificamos con enlace directo
      // Para embed real se necesita SDK, aquí usamos iframe de fb (requiere plugin)
      // Alternativa: mostrar vista previa con enlace
      return {
        type: 'facebook',
        embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(originalUrl)}&show_text=0`,
        thumbnail: null
      };
    }

    // TikTok
    const tiktokRegex = /tiktok\.com\/@[\w.-]+\/video\/(\d+)/;
    const tiktokMatch = originalUrl.match(tiktokRegex);
    if (tiktokMatch) {
      return {
        type: 'tiktok',
        embedUrl: `https://www.tiktok.com/embed/v2/${tiktokMatch[1]}`,
        thumbnail: null
      };
    }

    // Imagen directa (jpg, png, gif, etc.)
    if (/\.(jpe?g|png|gif|bmp|webp)$/i.test(originalUrl)) {
      return {
        type: 'image',
        embedUrl: originalUrl,
        thumbnail: null
      };
    }

    // Por defecto, enlace simple
    return {
      type: 'link',
      embedUrl: originalUrl,
      thumbnail: null
    };
  };

  const media = getEmbedUrl(url);

  const renderMedia = () => {
    switch (media.type) {
      case 'youtube':
        return (
          <Box sx={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 2 }}>
            <iframe
              src={media.embedUrl}
              title="YouTube video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 0
              }}
            />
          </Box>
        );

      case 'facebook':
        return (
          <Box sx={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 2 }}>
            <iframe
              src={media.embedUrl}
              title="Facebook video"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              allowFullScreen
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 0
              }}
            />
          </Box>
        );

      case 'tiktok':
        return (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            '& iframe': {
              width: '100%',
              maxWidth: '500px',
              height: '600px',
              border: 0
            }
          }}>
            <iframe
              src={media.embedUrl}
              title="TikTok video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </Box>
        );

      case 'image':
        return (
          <Box
            component="img"
            src={media.embedUrl}
            alt="Evidencia"
            sx={{
              width: '100%',
              maxHeight: 400,
              objectFit: 'contain',
              borderRadius: 2,
              cursor: 'pointer',
              '&:hover': { opacity: 0.9 }
            }}
            onClick={() => window.open(media.embedUrl, '_blank')}
          />
        );

      default:
        return (
          <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
            <Typography variant="body2">
              <a href={media.embedUrl} target="_blank" rel="noopener noreferrer">
                Ver prueba externa: {media.embedUrl}
              </a>
            </Typography>
          </Box>
        );
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle2" color="primary" gutterBottom>
        Evidencia multimedia:
      </Typography>
      {renderMedia()}
    </Box>
  );
};

export default MediaEmbed;
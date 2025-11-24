// src/components/ConversationHeader.jsx
import React from "react";
import { Box, Typography, Chip, Stack } from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";

import YouTubeIcon from "@mui/icons-material/YouTube";

const ConversationHeader = ({ title, videoUrl }) => {
  return (
    <Box sx={{
      mb: 2,
      width: '100%',  // Garante que o header ocupe toda a largura da tela
      padding: '16px',  // Ajuste o padding conforme necessário
      backgroundColor: '#1F2937',  // Cor de fundo para o header
      borderRadius: 2,  // Borda arredondada para o header
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',  // Adiciona sombra para o header
    }}>
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Box sx={{
          width: 50,
          height: 50,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(16, 163, 127, 0.12)',
          border: '1px solid rgba(16, 163, 127, 0.5)',
        }}>
          <PlayCircleOutlineIcon color="primary" fontSize="medium" />
        </Box>
        <Box>
          <Typography variant="h5" component="h1" fontWeight={700}>
            TutorTube
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Seu tutor de estudos baseado em vídeos do YouTube.
          </Typography>
        </Box>
      </Stack>
    </Box>

  );
};

export default ConversationHeader;



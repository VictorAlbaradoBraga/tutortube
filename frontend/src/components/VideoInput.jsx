// src/components/VideoInput.jsx
import React from "react";
import { 
  TextField, 
  Button, 
  Stack, 
  CircularProgress, 
  Typography, 
  Box,
  useTheme // ← Adicione este import
} from "@mui/material";
import YouTubeIcon from "@mui/icons-material/YouTube";

const VideoInput = ({ 
  videoUrlInput, 
  setVideoUrlInput, // ← Adicione esta prop
  videoTopicInput, 
  setVideoTopicInput, // ← Adicione esta prop
  videoLoading, 
  videoError, 
  onAttachVideo 
}) => {
  const theme = useTheme(); // ← Use o hook useTheme aqui

  return (
    <Box sx={{ 
      mb: 1.5, 
      p: 1.5, 
      borderRadius: 2, 
      border: "1px solid rgba(30, 64, 175, 0.7)",
      backgroundColor: theme.palette.background.paper // ← Agora theme está definido
    }}>
      <Stack spacing={1}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
          <YouTubeIcon sx={{ color: "#f97373", fontSize: 20 }} />
          <Typography variant="body2" fontWeight={600}>
            Conectar vídeo do YouTube
          </Typography>
        </Stack>
        
        <TextField
          size="small"
          placeholder="Cole a URL do vídeo (https://www.youtube.com/watch?v=...)"
          fullWidth
          value={videoUrlInput}
          onChange={(e) => setVideoUrlInput(e.target.value)}
        />
        
        <TextField
          size="small"
          placeholder='O que você quer aprender com este vídeo? (ex: "árvore AVL")'
          fullWidth
          value={videoTopicInput}
          onChange={(e) => setVideoTopicInput(e.target.value)}
        />
        
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 0.5 }}>
          <Button
            size="small"
            variant="contained"
            startIcon={<YouTubeIcon />}
            onClick={onAttachVideo}
            disabled={videoLoading}
            sx={{ px: 2.2, py: 0.6 }}
          >
            Conectar vídeo e gerar plano
          </Button>
          {videoLoading && <CircularProgress size={18} />}
        </Stack>
        
        {videoError && (
          <Typography color="error" variant="caption" sx={{ mt: 0.5 }}>
            {videoError}
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default VideoInput;
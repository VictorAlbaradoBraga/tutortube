// src/components/ChatMessage.jsx
import React from "react";
import { Box, Typography } from "@mui/material";

const ChatMessage = ({ message, isUser }) => {
  return (
    <Box sx={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", mb: 1 }}>
      <Box sx={{ maxWidth: "100%", borderRadius: 3, px: 1.6, py: 1.1, bgcolor: isUser ? "#1E40AF" : "#020617" }}>
        <Typography variant="caption" sx={{ fontWeight: 600, color: isUser ? "#E2E8F0" : "primary.main" }}>
          {isUser ? "Você" : "TutorTube"}
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.3, whiteSpace: "pre-line" }}>
          {message.content}
        </Typography>
      </Box>
    </Box>
  );
};

export default ChatMessage;

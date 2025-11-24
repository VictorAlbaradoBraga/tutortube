// src/components/MessageInput.jsx
import React from "react";
import { TextField, Button, Stack, CircularProgress, Typography, Box } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const MessageInput = ({  ragQuestion,  setRagQuestion,  ragLoading,   ragError,   onSendMessage  }) => {
  return (
    <Box sx={{ borderTop: "1px solid rgba(31, 41, 55, 0.9)", pt: 1.2 }}>
      <Stack spacing={1}>
        <TextField
          placeholder="Faça uma pergunta sobre o vídeo ou o tópico estudado..."
          fullWidth
          multiline
          minRows={1}
          maxRows={4}
          size="small"
          value={ragQuestion}
          onChange={(e) => setRagQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (!ragLoading) {
                onSendMessage();
              }
            }
          }}
        />
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="caption" color="text.secondary">
            O TutorTube usa o conteúdo do vídeo e o RAG para responder.
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            {ragError && <Typography color="error" variant="caption">{ragError}</Typography>}
            {ragLoading && <CircularProgress size={18} />}
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              onClick={onSendMessage}
              disabled={ragLoading}
              sx={{ px: 2.5, py: 0.6 }}
            >
              Enviar
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export default MessageInput;

import React, { useState } from "react";
import { 
  Box, 
  Typography, 
  IconButton, 
  Menu, 
  MenuItem, 
  TextField, 
  Button,
  Stack 
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const ChatList = ({ conversations, activeId, onSelectConversation, onDeleteConversation, onEditConversation }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [selectedConversation, setSelectedConversation] = useState(null);

  const open = Boolean(anchorEl);

  const handleClickMenu = (event, conversation) => {
    setAnchorEl(event.currentTarget);
    setSelectedConversation(conversation);
    setEditedTitle(conversation.title);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleEditConversation = () => {
    if (editedTitle.trim()) {
      onEditConversation(selectedConversation.id, editedTitle);
      setEditMode(false);
    }
    handleCloseMenu();
  };

  const handleDeleteConversation = () => {
    onDeleteConversation(selectedConversation.id);
    handleCloseMenu();
  };

  const handleStartEdit = () => {
    setEditMode(true);
    handleCloseMenu();
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditedTitle(selectedConversation?.title || "");
  };

  return (
    <Box sx={{ flex: 1, overflowY: "auto" }}>
      {conversations.map((conv) => {
        const isActive = conv.id === activeId;
        const isEditing = editMode && selectedConversation?.id === conv.id;

        return (
          <Box 
            key={conv.id} 
            sx={{ 
              p: 1.5,
              mb: 1,
              borderRadius: 1,
              backgroundColor: isActive ? "rgba(59, 130, 246, 0.1)" : "transparent",
              border: isActive ? "1px solid rgba(59, 130, 246, 0.3)" : "1px solid transparent",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: isActive ? "rgba(59, 130, 246, 0.1)" : "rgba(255, 255, 255, 0.05)",
              }
            }}
          >
            {/* Conteúdo principal do chat */}
            <Box 
              onClick={() => !isEditing && onSelectConversation(conv.id)}
              sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                {isEditing ? (
                  // Modo edição
                  <TextField
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleEditConversation();
                      } else if (e.key === "Escape") {
                        handleCancelEdit();
                      }
                    }}
                    size="small"
                    fullWidth
                    autoFocus
                    sx={{ mb: 1 }}
                  />
                ) : (
                  // Modo visualização
                  <>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ? "primary.main" : "text.primary",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      }}
                    >
                      {conv.title}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        display: "block"
                      }}
                    >
                      {conv.topic || "Sem tópico"}
                    </Typography>
                  </>
                )}
              </Box>

              {/* Botões de ação */}
              {isEditing ? (
                // Botões de confirmação/cancelar durante edição
                <Stack direction="row" spacing={0.5} sx={{ ml: 1 }}>
                  <IconButton 
                    size="small" 
                    onClick={handleEditConversation}
                    color="success"
                    sx={{ 
                      backgroundColor: "rgba(34, 197, 94, 0.1)",
                      "&:hover": { backgroundColor: "rgba(34, 197, 94, 0.2)" }
                    }}
                  >
                    <CheckIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={handleCancelEdit}
                    color="error"
                    sx={{ 
                      backgroundColor: "rgba(239, 68, 68, 0.1)",
                      "&:hover": { backgroundColor: "rgba(239, 68, 68, 0.2)" }
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Stack>
              ) : (
                // Menu de opções normal
                <IconButton
                  size="small"
                  aria-label="more"
                  onClick={(event) => handleClickMenu(event, conv)}
                  sx={{ 
                    color: "text.secondary",
                    "&:hover": { color: "primary.main" }
                  }}
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              )}
            </Box>

            {/* Menu dropdown */}
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleCloseMenu}
              slotProps={{
                paper: {
                  style: {
                    maxHeight: 48 * 4.5,
                    width: '20ch',
                  },
                },
              }}
            >
              <MenuItem 
                onClick={handleStartEdit}
                sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 1 
                }}
              >
                <EditIcon fontSize="small" />
                Editar
              </MenuItem>
              <MenuItem 
                onClick={handleDeleteConversation}
                sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 1,
                  color: "error.main" 
                }}
              >
                <DeleteIcon fontSize="small" />
                Excluir
              </MenuItem>
            </Menu>
          </Box>
        );
      })}
    </Box>
  );
};

export default ChatList;
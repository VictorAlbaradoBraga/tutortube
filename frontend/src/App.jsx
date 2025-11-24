import React, { useState } from "react";
import {
  Box,
  Container,
  Paper,
  CssBaseline,
  ThemeProvider,
  Typography,
  Button,
  Divider,
  IconButton,
} from "@mui/material";
import { createTheme } from "@mui/material/styles";
import ChatList from "./components/ChatList";
import ChatMessage from "./components/ChatMessage";
import VideoInput from "./components/VideoInput";
import MessageInput from "./components/MessageInput";
import AddIcon from "@mui/icons-material/Add";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

// API functions
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Ingerir vídeo do YouTube
async function ingestYoutube(url, topic) {
  const payload = {
    source_type: "youtube",
    source_value: url,
    topic: topic || null,
  };

  const res = await fetch(`${API_BASE_URL}/api/ingest`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Erro na ingestão: ${res.statusText}`);
  }

  return await res.json();
}

// Gerar plano de estudo
async function startStudy(topic, language = "pt-BR") {
  const payload = {
    topic,
    language,
  };

  const res = await fetch(`${API_BASE_URL}/api/study`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Erro ao gerar plano: ${res.statusText}`);
  }

  return await res.json();
}

// Perguntar pro RAG
async function askRag(question, topic = null, language = "pt-BR", conversationContext = "") {
  const payload = {
    question,
    topic,
    language,
    conversation_context: conversationContext,  // Passando o contexto da conversa
  };

  const res = await fetch(`${API_BASE_URL}/rag/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Erro no RAG: ${res.statusText}`);
  }

  return await res.json();
}

// Função para gerar nova conversa
function createNewConversation(title = "Novo chat") {
  return {
    id:
      "conv-" +
      Date.now().toString(36) +
      "-" +
      Math.random().toString(16).slice(2, 6),
    title,
    topic: null,
    videoUrl: null,
    plan: null,
    messages: [],
  };
}

// Estado inicial com um chat vazio
function createInitialChatState() {
  const first = createNewConversation("Novo chat");
  return {
    conversations: [first],
    activeId: first.id,
  };
}

// Função para limpar crases e fazer parse do JSON
function cleanJsonResponse(raw) {
  if (!raw) return null;

  // Verifique se a string contém um bloco JSON válido entre crases
  const match = raw.match(/```json\s*([\s\S]*?)```/i);
  if (match) {
    // Se for um bloco JSON, pega a string e tenta fazer o parse
    const jsonStr = match[1];
    try {
      return JSON.parse(jsonStr); // Tenta fazer parse do JSON
    } catch (e) {
      console.warn("Falha ao processar JSON:", e);
      return null;
    }
  }

  // Se não for JSON válido, apenas retorna o raw (texto simples)
  return raw;
}

// Tema minimalista preto e branco
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#ffffff",
    },
    secondary: {
      main: "#888",
    },
    background: {
      default: "#000000",
      paper: "#121212",
    },
    divider: "#444",
  },
  typography: {
    fontFamily: "Arial, sans-serif",
  },
  shape: {
    borderRadius: 8,
  },
});

export default function App() {
  const [chatState, setChatState] = useState(createInitialChatState);
  const { conversations, activeId } = chatState;
  const activeConversation = conversations.find((c) => c.id === activeId);

  const [videoUrlInput, setVideoUrlInput] = useState("");
  const [videoTopicInput, setVideoTopicInput] = useState("");
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState("");

  const [ragQuestion, setRagQuestion] = useState("");
  const [ragLoading, setRagLoading] = useState(false);
  const [ragError, setRagError] = useState("");
  const [conversationContext, setConversationContext] = useState(""); // Aqui

  // Estado para controlar a visibilidade da sidebar
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleNewChat = () => {
    const conv = createNewConversation("Novo chat");
    setChatState((prev) => ({
      conversations: [conv, ...prev.conversations],
      activeId: conv.id,
    }));
    setVideoUrlInput("");
    setVideoTopicInput("");
    setRagQuestion("");
    setVideoError("");
    setRagError("");
  };

  const handleSelectConversation = (id) => {
    setChatState((prev) => ({
      ...prev,
      activeId: id,
    }));
    setVideoError("");
    setRagError("");
  };

  const handleAttachVideo = async () => {
    setVideoError("");

    if (!videoUrlInput.trim()) {
      setVideoError("Cole uma URL de vídeo do YouTube.");
      return;
    }
    if (!videoTopicInput.trim()) {
      setVideoError("Informe o que você quer aprender com esse vídeo (tópico).");
      return;
    }
    if (!activeConversation) return;

    const currentConversationId = activeId;
    const url = videoUrlInput.trim();
    const topic = videoTopicInput.trim();

    try {
      setVideoLoading(true);

      // 1. Ingerir vídeo do YouTube
      const ingestResult = await ingestYoutube(url, topic);
      console.log("Ingest result:", ingestResult);

      // 2. Gerar plano de estudo
      const studyResult = await startStudy(topic);
      console.log("Study result:", studyResult);

      // Limpeza e processamento da resposta JSON
      const planObj = cleanJsonResponse(studyResult.study_plan?.raw || '{"summary":"Plano de estudo gerado"}');
      const summary =
        planObj?.summary ||
        `Gerei um plano de estudo sobre "${topic}" com base no vídeo.`;

      let modulesText = "";
      if (Array.isArray(planObj?.modules) && planObj.modules.length > 0) {
        const titles = planObj.modules
          .map((m) => `- ${m.title}`)
          .join("\n");
        modulesText = `\n\nMódulos sugeridos:\n${titles}`;
      }

      const tutorMessageText =
        `${summary}${modulesText}\n\n` +
        `Posso te ajudar a aprender esse conteúdo. ` +
        `Sobre qual parte você quer falar primeiro?`;

      const tutorMsg = {
        id: "msg-" + Date.now().toString(36),
        role: "assistant",
        content: tutorMessageText,
        sources: studyResult.sources || [],
      };

      setChatState((prev) => {
        const updated = prev.conversations.map((conv) => {
          if (conv.id !== currentConversationId) return conv;
          return {
            ...conv,
            title: topic || conv.title,
            topic,
            videoUrl: url,
            plan: planObj || conv.plan,
            messages: [...conv.messages, tutorMsg],
          };
        });
        return {
          ...prev,
          conversations: updated,
        };
      });

      setVideoUrlInput("");
      setVideoTopicInput("");
    } catch (err) {
      console.error("Erro ao processar vídeo:", err);
      setVideoError(`Erro ao processar o vídeo: ${err.message}`);
    } finally {
      setVideoLoading(false);
    }
  };


  const handleSendMessage = async () => {
    setRagError("");
    const content = ragQuestion.trim();

    if (!content) {
      setRagError("Digite uma pergunta ou mensagem para o tutor.");
      return;
    }
    if (!activeConversation) return;

    const currentConversationId = activeId;

    // Adicionando a pergunta do usuário
    const userMsg = {
      id: "msg-" + Date.now().toString(36) + "-u",
      role: "user",
      content,
    };

    setRagQuestion(""); // Limpa a pergunta

    // Atualiza o estado com a nova mensagem
    setChatState((prev) => {
      const updated = prev.conversations.map((conv) => {
        if (conv.id !== currentConversationId) return conv;
        return {
          ...conv,
          messages: [...conv.messages, userMsg],
        };
      });
      return {
        ...prev,
        conversations: updated,
      };
    });

    try {
      setRagLoading(true);

      // Passando o conversationContext no corpo da requisição
      const ragResult = await askRag(content, activeConversation.topic, conversationContext); // Aqui
      console.log("RAG result:", ragResult);

      const cleanedRagAnswer = cleanJsonResponse(ragResult.answer);
      const assistantMsg = {
        id: "msg-" + Date.now().toString(36) + "-a",
        role: "assistant",
        content: cleanedRagAnswer || "Desculpe, não consegui processar sua pergunta.",
        sources: ragResult.sources || [],
      };

      // Atualiza o estado com a resposta do tutor
      setChatState((prev) => {
        const updated = prev.conversations.map((conv) => {
          if (conv.id !== currentConversationId) return conv;
          return {
            ...conv,
            messages: [...conv.messages, assistantMsg], // Adiciona a resposta do tutor
          };
        });
        return {
          ...prev,
          conversations: updated,
        };
      });

      // Atualiza o contexto para incluir a nova interação
      const updatedContext = conversationContext + "\n" + content + "\n" + cleanedRagAnswer;
      setConversationContext(updatedContext); // Atualiza o contexto da conversa

    } catch (err) {
      console.error("Erro ao conversar com o tutor:", err);
      setRagError(`Erro ao conversar com o tutor: ${err.message}`);
    } finally {
      setRagLoading(false);
    }
  };


  // Função para editar a conversa
  const handleEditConversation = (id, newTitle) => {
    setChatState((prev) => ({
      ...prev,
      conversations: prev.conversations.map((conv) =>
        conv.id === id ? { ...conv, title: newTitle } : conv
      ),
    }));
  };

  // Função para excluir a conversa
  const handleDeleteConversation = (id) => {
    setChatState((prev) => {
      const filteredConversations = prev.conversations.filter((conv) => conv.id !== id);
      let newActiveId = prev.activeId;

      // Se a conversa ativa foi deletada, selecione a primeira disponível
      if (prev.activeId === id && filteredConversations.length > 0) {
        newActiveId = filteredConversations[0].id;
      } else if (filteredConversations.length === 0) {
        // Se não há conversas, cria uma nova
        const newConv = createNewConversation();
        filteredConversations.push(newConv);
        newActiveId = newConv.id;
      }

      return {
        conversations: filteredConversations,
        activeId: newActiveId,
      };
    });
  };

  // Função para alternar a sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", width: "100%" }}>
        <Container maxWidth={false} sx={{ flex: 1, width: "100%", padding: 0, margin: 0, height: "100%", display: "flex", flexDirection: "column" }}>
          <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, bgcolor: "rgba(15, 23, 42, 0.96)", height: "100%", width: "100%", display: "flex", flexDirection: "column" }}>
            {/* Cabeçalho com botão de toggle da sidebar */}
            <Box sx={{ mb: 2, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <IconButton
                  onClick={toggleSidebar}
                  sx={{
                    color: "primary.main",
                    border: "1px solid",
                    borderColor: "divider",
                    "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" }
                  }}
                >
                  {sidebarOpen ? <ChevronLeftIcon /> : <MenuIcon />}
                </IconButton>
                <Box>
                  <Typography variant="h5" component="h1" fontWeight={700}>TutorTube</Typography>
                  <Typography variant="body2" color="text.secondary">Seu tutor de estudos baseado em vídeos do YouTube.</Typography>
                </Box>
              </Box>
            </Box>

            {/* Layout principal */}
            <Box sx={{ display: "flex", gap: 2, flex: 1, width: "100%", height: "calc(100% - 80px)", minHeight: 0 }}>
              {/* Sidebar - Lista de chats (condicional) */}
              {sidebarOpen && (
                <Box sx={{
                  width: 260,
                  flexShrink: 0,
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  transition: "all 0.3s ease"
                }}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={handleNewChat}
                    sx={{ mb: 2 }}
                  >
                    Novo chat
                  </Button>
                  <Box sx={{ flex: 1, overflow: "auto" }}>
                    <ChatList
                      conversations={conversations}
                      activeId={activeId}
                      onSelectConversation={handleSelectConversation}
                      onEditConversation={handleEditConversation}
                      onDeleteConversation={handleDeleteConversation}
                    />
                  </Box>
                </Box>
              )}

              {/* Área principal de conversação */}
              <Box sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                height: "100%",
                minHeight: 0,
                transition: "all 0.3s ease"
              }}>
                {/* Informações da conversa ativa */}
                {activeConversation && (
                  <Box sx={{ mb: 2, flexShrink: 0, p: 2, backgroundColor: "rgba(31, 41, 55, 0.5)", borderRadius: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {activeConversation.title}
                    </Typography>
                    {activeConversation.videoUrl && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Vídeo: {activeConversation.videoUrl}
                      </Typography>
                    )}
                    {activeConversation.topic && (
                      <Typography variant="body2" color="text.secondary">
                        Tópico: {activeConversation.topic}
                      </Typography>
                    )}
                  </Box>
                )}

                <VideoInput
                  videoUrlInput={videoUrlInput}
                  setVideoUrlInput={setVideoUrlInput}
                  videoTopicInput={videoTopicInput}
                  setVideoTopicInput={setVideoTopicInput}
                  videoLoading={videoLoading}
                  videoError={videoError}
                  onAttachVideo={handleAttachVideo}
                />

                <Divider sx={{ my: 2 }} />

                {/* Área de mensagens */}
                <Box sx={{
                  flex: 1,
                  overflowY: "auto",
                  mb: 2,
                  minHeight: 0
                }}>
                  {activeConversation?.messages.map((msg) => (
                    <ChatMessage key={msg.id} message={msg} isUser={msg.role === "user"} />
                  ))}
                </Box>

                {/* Input de mensagem */}
                <Box sx={{ flexShrink: 0 }}>
                  <MessageInput
                    ragQuestion={ragQuestion}
                    setRagQuestion={setRagQuestion}
                    ragLoading={ragLoading}
                    ragError={ragError}
                    onSendMessage={handleSendMessage}
                  />
                </Box>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

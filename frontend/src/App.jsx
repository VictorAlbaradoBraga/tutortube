// frontend/src/App.jsx
import React, { useState } from "react";
import {
  ThemeProvider,
  createTheme,
} from "@mui/material/styles";
import {
  CssBaseline,
  Container,
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  Divider,
  Chip,
  CircularProgress,
} from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import SchoolIcon from "@mui/icons-material/School";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import YouTubeIcon from "@mui/icons-material/YouTube";
import SendIcon from "@mui/icons-material/Send";

import { ingestYoutube, startStudy, askRag } from "./Api";

// Helper pra tirar o ```json ... ``` e virar objeto
function parseRawJsonBlock(raw) {
  if (!raw) return null;
  const match = raw.match(/```json\s*([\s\S]*?)```/i);
  const jsonStr = match ? match[1] : raw;
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    console.warn("Falha ao fazer parse do JSON do modelo:", e);
    return null;
  }
}

// tema dark básico
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#ff5252",
    },
    background: {
      default: "#0f172a",
      paper: "#111827",
    },
  },
  typography: {
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
});

export default function App() {
  // INGEST
  const [ytUrl, setYtUrl] = useState("");
  const [ingestTopic, setIngestTopic] = useState("");
  const [ingestLoading, setIngestLoading] = useState(false);
  const [ingestResult, setIngestResult] = useState(null);
  const [ingestError, setIngestError] = useState("");

  // STUDY
  const [studyTopic, setStudyTopic] = useState("árvore AVL");
  const [studyLoading, setStudyLoading] = useState(false);
  const [studyData, setStudyData] = useState(null);
  const [studyError, setStudyError] = useState("");

  // RAG CHAT
  const [ragQuestion, setRagQuestion] = useState("");
  const [ragTopic, setRagTopic] = useState("árvore AVL");
  const [ragLoading, setRagLoading] = useState(false);
  const [ragAnswer, setRagAnswer] = useState("");
  const [ragSources, setRagSources] = useState([]);
  const [ragError, setRagError] = useState("");

  // Ações
  const handleIngest = async () => {
    setIngestError("");
    setIngestResult(null);

    if (!ytUrl.trim()) {
      setIngestError("Informe uma URL de vídeo do YouTube.");
      return;
    }

    try {
      setIngestLoading(true);
      const data = await ingestYoutube(ytUrl.trim(), ingestTopic.trim() || null);
      setIngestResult(data);
    } catch (err) {
      console.error(err);
      setIngestError("Erro ao ingerir vídeo. Veja o console para detalhes.");
    } finally {
      setIngestLoading(false);
    }
  };

  const handleStudy = async () => {
    setStudyError("");
    setStudyData(null);

    if (!studyTopic.trim()) {
      setStudyError("Informe um tópico para estudar.");
      return;
    }

    try {
      setStudyLoading(true);
      const data = await startStudy(studyTopic.trim(), "pt-BR");
      setStudyData(data);
    } catch (err) {
      console.error(err);
      setStudyError("Erro ao gerar plano de estudo.");
    } finally {
      setStudyLoading(false);
    }
  };

  const handleAskRag = async () => {
    setRagError("");
    setRagAnswer("");
    setRagSources([]);

    if (!ragQuestion.trim()) {
      setRagError("Digite uma pergunta.");
      return;
    }

    try {
      setRagLoading(true);
      const data = await askRag(ragQuestion.trim(), ragTopic.trim() || null, "pt-BR");
      setRagAnswer(data.answer || "");
      setRagSources(data.sources || []);
    } catch (err) {
      console.error(err);
      setRagError("Erro ao perguntar para o tutor RAG.");
    } finally {
      setRagLoading(false);
    }
  };

  // Derivados do plano de estudo
  const parsedStudyPlan = studyData ? parseRawJsonBlock(studyData.study_plan?.raw) : null;
  const parsedTutorMaterial = studyData ? parseRawJsonBlock(studyData.tutor_material?.raw) : null;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <PlayCircleOutlineIcon color="primary" fontSize="large" />
            <Typography variant="h4" component="h1" fontWeight={700}>
              TutorTube
            </Typography>
          </Stack>
          <Typography variant="subtitle1" color="text.secondary">
            Assistente inteligente de estudos baseado em vídeos do YouTube.
          </Typography>
        </Box>

        <Stack spacing={3}>
          {/* Bloco 1: Ingestão de Vídeo */}
          <Paper sx={{ p: 3 }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <YouTubeIcon color="error" />
              <Typography variant="h6">1. Ingerir vídeo do YouTube</Typography>
              <Chip label="Pipeline RAG" size="small" color="primary" />
            </Stack>

            <Stack spacing={2}>
              <TextField
                label="URL do vídeo do YouTube"
                variant="outlined"
                fullWidth
                value={ytUrl}
                onChange={(e) => setYtUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
              />

              <TextField
                label="Tópico (ex: Estruturas de Dados, AVL, Grafos...)"
                variant="outlined"
                fullWidth
                value={ingestTopic}
                onChange={(e) => setIngestTopic(e.target.value)}
              />

              <Stack direction="row" spacing={2} alignItems="center">
                <Button
                  variant="contained"
                  startIcon={<YouTubeIcon />}
                  onClick={handleIngest}
                  disabled={ingestLoading}
                >
                  Ingerir vídeo
                </Button>
                {ingestLoading && <CircularProgress size={24} />}
              </Stack>

              {ingestError && (
                <Typography color="error" variant="body2">
                  {ingestError}
                </Typography>
              )}

              {ingestResult && (
                <Box mt={2}>
                  <Typography variant="body2" color="success.main">
                    Vídeo ingerido com sucesso!
                  </Typography>
                  <Typography variant="body2">
                    Video ID: <strong>{ingestResult.data?.video_id}</strong>
                  </Typography>
                  <Typography variant="body2">
                    Chunks salvos: <strong>{ingestResult.data?.chunks}</strong>
                  </Typography>
                  {ingestResult.data?.topic && (
                    <Typography variant="body2">
                      Tópico: <strong>{ingestResult.data.topic}</strong>
                    </Typography>
                  )}
                </Box>
              )}
            </Stack>
          </Paper>

          {/* Bloco 2: Plano de Estudo */}
          <Paper sx={{ p: 3 }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <SchoolIcon color="primary" />
              <Typography variant="h6">2. Gerar plano de estudo</Typography>
              <Chip label="LLM + contexto" size="small" color="secondary" />
            </Stack>

            <Stack spacing={2}>
              <TextField
                label="Tópico para estudar"
                variant="outlined"
                fullWidth
                value={studyTopic}
                onChange={(e) => setStudyTopic(e.target.value)}
                placeholder="árvore AVL, programação dinâmica, React Hooks..."
              />

              <Stack direction="row" spacing={2} alignItems="center">
                <Button
                  variant="contained"
                  startIcon={<SchoolIcon />}
                  onClick={handleStudy}
                  disabled={studyLoading}
                >
                  Gerar plano
                </Button>
                {studyLoading && <CircularProgress size={24} />}
              </Stack>

              {studyError && (
                <Typography color="error" variant="body2">
                  {studyError}
                </Typography>
              )}

              {studyData && (
                <Box mt={2}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Resumo do tópico
                  </Typography>
                  {parsedStudyPlan?.summary ? (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {parsedStudyPlan.summary}
                    </Typography>
                  ) : (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      (Resumo não pôde ser interpretado, veja JSON bruto abaixo.)
                    </Typography>
                  )}

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle1" fontWeight={600}>
                    Módulos sugeridos
                  </Typography>
                  <Stack spacing={1} mt={1}>
                    {parsedStudyPlan?.modules?.map((mod, idx) => (
                      <Paper key={idx} sx={{ p: 1.5 }} variant="outlined">
                        <Typography variant="body2" fontWeight={600}>
                          {mod.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {mod.description}
                        </Typography>
                      </Paper>
                    )) || (
                      <Typography variant="body2" color="text.secondary">
                        Não foi possível interpretar os módulos. Ver JSON bruto abaixo.
                      </Typography>
                    )}
                  </Stack>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle1" fontWeight={600}>
                    JSON bruto do plano (debug)
                  </Typography>
                  <Box
                    component="pre"
                    sx={{
                      mt: 1,
                      p: 1.5,
                      maxHeight: 260,
                      overflow: "auto",
                      fontSize: 12,
                      bgcolor: "background.default",
                      borderRadius: 1,
                    }}
                  >
                    {studyData.study_plan?.raw}
                  </Box>
                </Box>
              )}
            </Stack>
          </Paper>

          {/* Bloco 3: Chat RAG */}
          <Paper sx={{ p: 3 }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <QuestionAnswerIcon color="success" />
              <Typography variant="h6">3. Chat com Tutor (RAG)</Typography>
              <Chip label="Pergunte sobre o vídeo" size="small" />
            </Stack>

            <Stack spacing={2}>
              <TextField
                label="Tópico (opcional - para contexto)"
                variant="outlined"
                fullWidth
                value={ragTopic}
                onChange={(e) => setRagTopic(e.target.value)}
              />

              <TextField
                label="Sua pergunta"
                variant="outlined"
                fullWidth
                multiline
                minRows={2}
                value={ragQuestion}
                onChange={(e) => setRagQuestion(e.target.value)}
                placeholder="Ex: Explique o que é uma rotação simples em AVL."
              />

              <Stack direction="row" spacing={2} alignItems="center">
                <Button
                  variant="contained"
                  endIcon={<SendIcon />}
                  onClick={handleAskRag}
                  disabled={ragLoading}
                >
                  Perguntar
                </Button>
                {ragLoading && <CircularProgress size={24} />}
              </Stack>

              {ragError && (
                <Typography color="error" variant="body2">
                  {ragError}
                </Typography>
              )}

              {ragAnswer && (
                <Box mt={2}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Resposta do Tutor
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, whiteSpace: "pre-line" }}>
                    {ragAnswer}
                  </Typography>
                </Box>
              )}

              {ragSources && ragSources.length > 0 && (
                <Box mt={3}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Fontes usadas
                  </Typography>
                  <Stack spacing={1} mt={1}>
                    {ragSources.map((src) => (
                      <Paper key={src.id} sx={{ p: 1.5 }} variant="outlined">
                        <Typography variant="caption" color="text.secondary">
                          ID: {src.id} | Score: {src.score?.toFixed?.(3) ?? src.score}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          {src.preview}
                        </Typography>
                        {src.metadata?.video_id && (
                          <Typography variant="caption" color="primary.main">
                            Vídeo: https://www.youtube.com/watch?v={src.metadata.video_id}
                          </Typography>
                        )}
                      </Paper>
                    ))}
                  </Stack>
                </Box>
              )}
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </ThemeProvider>
  );
}

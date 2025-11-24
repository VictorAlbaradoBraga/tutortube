// frontend/src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
});

// Ingerir vídeo do YouTube
export async function ingestYoutube(url, topic) {
  const payload = {
    source_type: "youtube",
    source_value: url,
    topic: topic || null,
  };

  const res = await api.post("/api/ingest", payload);
  return res.data; // { status, type, data: { video_id, chunks, topic } }
}

// Gerar plano de estudo
export async function startStudy(topic, language = "pt-BR") {
  const payload = {
    topic,
    language,
  };

  const res = await api.post("/api/study", payload);
  return res.data; // { topic, study_plan, tutor_material, sources }
}

// Perguntar pro RAG
export async function askRag(question, topic = null, language = "pt-BR") {
  const payload = {
    question,
    topic,
    language,
  };

  const res = await api.post("/rag/ask", payload);
  return res.data; // { topic, question, answer, sources }
}

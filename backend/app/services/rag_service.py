# backend/app/services/rag_service.py

from typing import Any, Dict, List, Optional

from app.tools.chroma_client import query_by_embedding
from app.utils.embedding_client import embed_texts
from app.utils.google_client import gemini_chat


async def rag_query(
    question: str,
    topic: Optional[str] = None,
    language: str = "pt-BR"
) -> Dict[str, Any]:
    """
    Faz uma consulta RAG:
    1) Embeda a pergunta
    2) Busca contexto no Chroma
    3) Manda tudo para o Gemini responder
    """
    # 1) Embedding da pergunta com text-embedding-004
    query_embedding = (await embed_texts([question]))[0]

    # 2) Busca no Chroma por similaridade
    results = query_by_embedding(query_embedding, n_results=4)

    docs: List[str] = results.get("documents", [[]])[0]
    metadatas: List[Dict] = results.get("metadatas", [[]])[0]
    ids: List[str] = results.get("ids", [[]])[0]

    context_parts: List[str] = []

    for doc, meta, _id in zip(docs, metadatas, ids):
        header_parts = []
        if isinstance(meta, dict):
            if meta.get("topic"):
                header_parts.append(f"TEMA: {meta['topic']}")
            if meta.get("video_id"):
                header_parts.append(f"VIDEO_ID: {meta['video_id']}")

        header = " | ".join(header_parts) if header_parts else f"CHUNK_ID: {_id}"
        context_parts.append(f"[{header}]\n{doc}")

    context = "\n\n".join(context_parts)

    sources = [
        {
            "id": _id,
            "metadata": meta,
            "preview": doc[:200],
        }
        for _id, meta, doc in zip(ids, metadatas, docs)
    ]

    lang_label = "português do Brasil" if language.startswith("pt") else "inglês"

    prompt = f"""
Você é um tutor especializado em explicar conteúdos de forma clara e objetiva.

Idioma de saída: {lang_label}

Pergunta do estudante:
\"\"\"{question}\"\"\"

Use SOMENTE o contexto abaixo (transcrições de vídeos e textos já processados).
Se a resposta não estiver clara no contexto, seja honesto e diga que não encontrou,
mas dê uma explicação geral segura sobre o tema.

Contexto:
\"\"\"{context}\"\"\"
""".strip()

    answer = await gemini_chat(prompt)

    return {
        "topic": topic,
        "question": question,
        "answer": answer,
        "sources": sources,
    }

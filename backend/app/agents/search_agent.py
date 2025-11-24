# backend/app/agents/search_agent.py

from typing import Any, Dict, List

from app.tools.chroma_client import query_by_embedding
from app.utils.embedding_client import embed_texts


async def search_relevant_context(topic: str, n_results: int = 8) -> Dict[str, Any]:
    """
    Busca no Chroma os chunks mais relevantes para o tópico informado
    usando embeddings do text-embedding-004.
    """
    # 1) Embeda a query com o MESMO modelo dos documentos
    query_embedding = (await embed_texts([topic]))[0]

    # 2) Faz a busca no Chroma via query_embeddings
    results = query_by_embedding(query_embedding, n_results=n_results)

    docs: List[str] = results.get("documents", [[]])[0]
    metadatas: List[Dict] = results.get("metadatas", [[]])[0]
    ids: List[str] = results.get("ids", [[]])[0]

    context_blocks: List[str] = []

    for doc, meta, _id in zip(docs, metadatas, ids):
        header_parts = []

        if isinstance(meta, dict):
            if meta.get("topic"):
                header_parts.append(f"TEMA: {meta['topic']}")
            if meta.get("video_id"):
                header_parts.append(f"VIDEO_ID: {meta['video_id']}")

        header = " | ".join(header_parts) if header_parts else f"CHUNK_ID: {_id}"
        context_blocks.append(f"[{header}]\n{doc}")

    full_context = "\n\n".join(context_blocks)

    sources = [
        {
            "id": _id,
            "metadata": meta,
            "preview": doc[:200],
        }
        for _id, meta, doc in zip(ids, metadatas, docs)
    ]

    return {
        "context": full_context,
        "sources": sources,
    }

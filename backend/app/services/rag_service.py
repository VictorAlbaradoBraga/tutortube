# backend/app/services/rag_service.py

from typing import List, Dict

from app.tools.chroma_client import query_documents
from app.utils.google_client import gemini_chat


async def rag_query(question: str) -> Dict:
    # 1. Busca dados no ChromaDB
    chroma_res = query_documents(question)

    docs = chroma_res.get("documents", [[]])[0]
    metadatas = chroma_res.get("metadatas", [[]])[0]
    ids = chroma_res.get("ids", [[]])[0]

    # Monta contexto
    context_text = "\n\n".join([
        f"[Documento {i}] {docs[i]}"
        for i in range(len(docs))
    ])

    # 2. Monta prompt estilo RAG
    prompt = f"""
Use APENAS os trechos abaixo para responder.
Não invente informações fora do contexto.

Contexto:
{context_text}

Pergunta:
{question}

Resposta:
"""

    # 3. Chama Gemini
    answer = await gemini_chat(prompt)

    # 4. Monta resposta estruturada
    sources = []
    for i in range(len(docs)):
        sources.append({
            "id": ids[i],
            "score": 1.0, 
            "snippet": docs[i],
            "metadata": metadatas[i],
        })

    return {
        "answer": answer,
        "sources": sources
    }

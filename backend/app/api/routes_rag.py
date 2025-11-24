# backend/app/api/routes_rag.py

from fastapi import APIRouter, HTTPException
from app.models.request_models import RagQueryRequest
from app.models.response_models import RagQueryResponse, RagSource
from app.services.rag_service import rag_query

router = APIRouter(prefix="/rag", tags=["rag"])


@router.post("/ask", response_model=RagQueryResponse)
async def ask_rag(payload: RagQueryRequest):
    question = payload.question.strip()

    if not question:
        raise HTTPException(status_code=400, detail="Pergunta não pode ser vazia.")

    # Se seu rag_query aceitar topic/language, pode fazer:
    # result = await rag_query(question, topic=payload.topic, language=payload.language)
    # Mas se a assinatura atual for só rag_query(question), isso aqui funciona:
    result = await rag_query(question)

    answer = result["answer"]
    sources_raw = result.get("sources", [])

    sources = [
        RagSource(
            id=s["id"],
            score=s.get("score", 0.0),
            # aceita tanto "preview" quanto "snippet" para evitar erro
            preview=s.get("preview") or s.get("snippet", ""),
            metadata=s.get("metadata", {})
        )
        for s in sources_raw
    ]

    return RagQueryResponse(
        topic=payload.topic,
        question=question,
        answer=answer,
        sources=sources
    )

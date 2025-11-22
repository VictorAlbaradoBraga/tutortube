# backend/app/api/routes_rag.py

from fastapi import APIRouter, HTTPException
from app.models.request_models import RagQueryRequest
from app.models.response_models import RagQueryResponse

# depois vamos usar o rag_service
# from app.services.rag_service import rag_query

router = APIRouter(prefix="/rag", tags=["rag"])


@router.post("/ask", response_model=RagQueryResponse)
async def ask_rag(payload: RagQueryRequest):
    question = payload.question.strip()
    topic = payload.topic

    if not question:
        raise HTTPException(status_code=400, detail="Pergunta não pode ser vazia.")

    # answer, sources = rag_query(question=question, topic=topic)

    # placeholder
    answer = f"Resposta placeholder para a pergunta: {question}"
    sources = []

    return RagQueryResponse(
        topic=topic,
        question=question,
        answer=answer,
        sources=sources,
    )

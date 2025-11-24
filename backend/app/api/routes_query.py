# backend/app/api/routes_query.py
# backend/app/api/routes_query.py

from fastapi import APIRouter, HTTPException
from app.models.request_models import StartStudyRequest
from app.agents.crew import run_study_session

router = APIRouter(prefix="/api/study", tags=["Study"])


@router.post("")
async def start_study(request: StartStudyRequest):
    """
    Inicia uma sessão de estudo multi-agente para um tópico.

    Usa o conteúdo já salvo no Chroma (via ingest de YouTube ou texto).
    """
    try:
        result = await run_study_session(
            topic=request.topic,
            language=request.language,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

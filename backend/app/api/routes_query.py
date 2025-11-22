# backend/app/api/routes_query.py

from fastapi import APIRouter, HTTPException
from app.models.request_models import StartStudyRequest
from app.models.response_models import StartStudyResponse

# depois vamos usar os agentes aqui
# from app.agents.crew import run_study_flow

router = APIRouter(prefix="/query", tags=["query"])


@router.post("/start", response_model=StartStudyResponse)
async def start_study(payload: StartStudyRequest):
    topic = payload.topic.strip()

    if not topic:
        raise HTTPException(status_code=400, detail="Tópico não pode ser vazio.")

    # placeholder por enquanto
    # result = await run_study_flow(topic=topic)

    return StartStudyResponse(
        topic=topic,
        status="processing",
        message="Fluxo de estudo iniciado. Em breve os dados estarão disponíveis."
    )

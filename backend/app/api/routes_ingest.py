# backend/app/api/routes_ingest.py

from fastapi import APIRouter
from app.models.request_models import IngestRequest
from app.models.response_models import IngestResponse

# depois vamos usar transcription_service + chroma_client
# from app.services.transcription_service import ingest_video_or_text

router = APIRouter(prefix="/ingest", tags=["ingest"])


@router.post("/", response_model=IngestResponse)
async def ingest(payload: IngestRequest):
    # aqui depois você chama a lógica que:
    # 1) pega transcrição
    # 2) limpa texto
    # 3) salva no Chroma

    return IngestResponse(
        status="queued",
        message="Conteúdo enviado para ingestão. Processamento será feito em segundo plano."
    )

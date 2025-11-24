# backend/app/api/routes_ingest.py

from fastapi import APIRouter, HTTPException
from app.models.request_models import IngestRequest
from app.services.transcription_service import ingest_youtube_video, ingest_plain_text

router = APIRouter(prefix="/api/ingest", tags=["Ingest"])


@router.post("")
async def ingest(request: IngestRequest):
    try:
        if request.source_type == "youtube":
            result = await ingest_youtube_video(
                url=request.source_value,
                topic=request.topic
            )
            return {"status": "success", "type": "youtube", "data": result}

        elif request.source_type == "text":
            result = await ingest_plain_text(
                text=request.source_value,
                topic=request.topic
            )
            return {"status": "success", "type": "text", "data": result}

        else:
            raise HTTPException(
                status_code=400,
                detail="source_type must be 'youtube' or 'text'"
            )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

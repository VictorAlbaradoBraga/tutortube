# backend/app/models/request_models.py

from pydantic import BaseModel
from typing import Optional


class StartStudyRequest(BaseModel):
    topic: str
    language: Optional[str] = "pt-BR"


class RagQueryRequest(BaseModel):
    question: str
    topic: Optional[str] = None  # pode ser o mesmo do estudo, se quiser agrupar
    language: Optional[str] = "pt-BR"


class IngestRequest(BaseModel):
    source_type: str  # "youtube" ou "text"
    source_value: str  # url do vídeo ou texto bruto
    topic: Optional[str] = None

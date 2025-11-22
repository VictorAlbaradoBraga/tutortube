# backend/app/models/response_models.py

from pydantic import BaseModel
from typing import List, Optional


class StartStudyResponse(BaseModel):
    topic: str
    status: str   # "processing", "done", etc.
    message: str


class RagSource(BaseModel):
    id: str
    score: float
    snippet: str
    metadata: Optional[dict] = None


class RagQueryResponse(BaseModel):
    topic: Optional[str]
    question: str
    answer: str
    sources: List[RagSource]


class IngestResponse(BaseModel):
    status: str
    message: str

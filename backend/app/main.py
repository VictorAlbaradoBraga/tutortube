# backend/app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes_health import router as health_router
from app.api.routes_query import router as query_router
from app.api.routes_rag import router as rag_router
from app.api.routes_ingest import router as ingest_router


def create_app() -> FastAPI:
    app = FastAPI(
        title="TutorTube Backend",
        version="0.1.0",
    )

    # CORS básico (ajusta depois pros domínios da Vercel)
    app.add_middleware(
        CORSMiddleware,
         allow_origins=["https://tutortube-front-fgusaffm7-victor-s-projects-310202a6.vercel.app/"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Rotas
    app.include_router(health_router, prefix="/api")
    app.include_router(query_router, prefix="/api")
    app.include_router(rag_router, prefix="/api")
    app.include_router(ingest_router, prefix="/api")

    return app


app = create_app()

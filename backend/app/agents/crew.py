# backend/app/agents/crew.py

from typing import Dict

# depois você pode importar CrewAI aqui e montar o fluxo multi-agents


async def run_study_flow(topic: str) -> Dict:
    """
    Orquestra o fluxo:
    1) search_agent → busca vídeos
    2) transcription_service → transcreve
    3) curator_agent → limpa/organiza
    4) salva no Chroma
    """
    # placeholder
    return {
        "topic": topic,
        "status": "done"
    }

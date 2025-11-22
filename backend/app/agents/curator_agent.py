# backend/app/agents/curator_agent.py

from typing import List, Dict


async def run_curator_agent(transcripts: List[Dict]) -> Dict:
    """
    Agente responsável por:
    - limpar textos
    - organizar por tópicos
    - criar resumos e mapa mental
    """
    # placeholder
    return {
        "summary": "",
        "mindmap": [],
        "clean_chunks": [],
    }

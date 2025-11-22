# backend/app/agents/tutor_agent.py

from typing import Dict


async def run_tutor_agent(question: str, context_docs: str) -> Dict:
    """
    Agente responsável por:
    - receber pergunta + contexto (RAG)
    - chamar LLM (DeepSeek)
    - devolver resposta estruturada
    """
    # placeholder
    return {
        "answer": f"Resposta fake para: {question}",
        "metadata": {}
    }

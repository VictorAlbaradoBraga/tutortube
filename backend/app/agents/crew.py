# backend/app/agents/crew.py
from typing import Any, Dict
from app.agents.search_agent import search_relevant_context
from app.agents.curator_agent import generate_study_plan
from app.agents.tutor_agent import generate_tutor_material

async def run_study_session(topic: str, language: str = "pt-BR", conversation_context: str = "") -> Dict[str, Any]:
    """
    Orquestra a sessão de estudo:
    
    1. Busca contexto relevante no Chroma (SearchAgent)
    2. Gera plano de estudo + resumo + mapa mental (CuratorAgent)
    3. Gera explicação + quiz (TutorAgent)

    :param conversation_context: Contexto acumulado das conversas anteriores
    """
    
    # Buscando contexto relevante usando o agente de pesquisa
    search_result = await search_relevant_context(topic)
    context: str = search_result["context"]
    sources = search_result["sources"]

    # Se não encontrar conteúdo no Chroma, retorna uma mensagem de erro
    if not context:
        return {
            "topic": topic,
            "message": "Nenhum conteúdo encontrado no Chroma para este tópico. Ingest primeiro um vídeo ou texto.",
            "study_plan": None,
            "tutor_material": None,
            "sources": [],
        }

    # Se houver contexto acumulado da conversa, adicione ele ao contexto da pesquisa
    if conversation_context:
        context = conversation_context + "\n" + context

    # Gerar plano de estudo com o contexto atualizado
    study_plan = await generate_study_plan(topic, context, language=language)
    tutor_material = await generate_tutor_material(topic, context, language=language)

    return {
        "topic": topic,
        "study_plan": study_plan,
        "tutor_material": tutor_material,
        "sources": sources,
    }

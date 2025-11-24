# backend/app/agents/curator_agent.py

import json
from typing import Any, Dict
from app.utils.google_client import gemini_chat


async def generate_study_plan(topic: str, context: str, language: str = "pt-BR") -> Dict[str, Any]:
    """
    Gera um plano de estudo, resumo e mapa mental a partir do contexto recuperado.
    """
    lang_label = "português do Brasil" if language.startswith("pt") else "inglês"

    prompt = f"""
Você é um agente CURADOR de conteúdos educacionais.

Tópico de estudo: {topic}
Idioma de saída: {lang_label}

Você recebeu trechos de transcrição de aulas (em português ou inglês) sobre esse tema.

Sua tarefa:

1. Organizar um PLANO DE ESTUDO em módulos, em ordem didática.
2. Criar um RESUMO GERAL do tema.
3. Sugerir um MAPA MENTAL simples em texto (nós e conexões).

Responda EXCLUSIVAMENTE em JSON VÁLIDO, no formato:

{{
  "topic": "string",
  "summary": "string",
  "modules": [
    {{
      "title": "string",
      "description": "string",
      "key_points": ["string", "string"]
    }}
  ],
  "mindmap": [
    {{
      "node": "string",
      "children": ["string", "string"]
    }}
  ]
}}

Conteúdo-base (trechos das aulas):

\"\"\"    
{context}
\"\"\"
    """.strip()

    raw = await gemini_chat(prompt)

    try:
        data: Dict[str, Any] = json.loads(raw)
    except Exception:
        # Se vier texto solto, devolve bruto para o front lidar
        data = {"raw": raw}

    return data

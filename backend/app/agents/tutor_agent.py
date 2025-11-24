# backend/app/agents/tutor_agent.py

import json
from typing import Any, Dict
from app.utils.google_client import gemini_chat


async def generate_tutor_material(topic: str, context: str, language: str = "pt-BR") -> Dict[str, Any]:
    """
    Gera uma explicação didática + quiz de 5 questões sobre o tema.
    """
    lang_label = "português do Brasil" if language.startswith("pt") else "inglês"

    prompt = f"""
Você é um TUTOR especialista em explicar conteúdos para estudantes de graduação inicial.

Tópico de estudo: {topic}
Idioma de saída: {lang_label}

Você recebeu trechos de aulas (transcrições) sobre esse tema.

Tarefas:

1. Gerar uma EXPLICAÇÃO DIDÁTICA, clara e direta, sobre o tema.
2. Gerar um QUIZ com 5 questões de múltipla escolha.

Responda EXCLUSIVAMENTE em JSON VÁLIDO:

{{
  "explanation": "string",
  "quiz": [
    {{
      "question": "string",
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "correct_option": "A",
      "explanation": "string"
    }}
  ]
}}

Use apenas informações coerentes com o conteúdo-base abaixo.

Conteúdo-base:

\"\"\"    
{context}
\"\"\"
    """.strip()

    raw = await gemini_chat(prompt)

    try:
        data: Dict[str, Any] = json.loads(raw)
    except Exception:
        data = {"raw": raw}

    return data

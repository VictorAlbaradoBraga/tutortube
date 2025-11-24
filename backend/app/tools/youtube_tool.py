# backend/app/tools/youtube_tool.py

import re
from typing import List

from youtube_transcript_api import (
    YouTubeTranscriptApi,
    NoTranscriptFound,
    TranscriptsDisabled,
    VideoUnavailable,
)


# Regex simples pra extrair o ID de um URL do YouTube
_YT_ID_REGEX = re.compile(
    r"(?:v=|youtu\.be/|shorts/)([A-Za-z0-9_-]{11})"
)


def extract_video_id(url_or_id: str) -> str:
    """
    Aceita tanto a URL completa quanto só o ID.
    Retorna sempre o ID do vídeo (11 caracteres).
    """
    # Se já parece um ID, só devolve
    if re.fullmatch(r"[A-Za-z0-9_-]{11}", url_or_id):
        return url_or_id

    match = _YT_ID_REGEX.search(url_or_id)
    if not match:
        raise ValueError(f"Não foi possível extrair o ID do vídeo de: {url_or_id}")

    return match.group(1)


def get_transcript(
    video_id: str,
    preferred_languages: List[str] | None = None
) -> str:
    """
    Busca a transcrição do vídeo usando a API nova (1.2.x).

    - Tenta primeiro em PT (pt, pt-BR, pt-PT).
    - Se não achar, tenta qualquer idioma disponível.

    Retorna um único string com o texto concatenado.
    """
    if preferred_languages is None:
        # Ordem de preferência: português primeiro, depois inglês
        preferred_languages = ["pt", "pt-BR", "pt-PT", "en"]

    api = YouTubeTranscriptApi()

    try:
        transcript_list = api.list(video_id)
    except VideoUnavailable:
        raise RuntimeError("Vídeo indisponível, privado ou removido.")
    except TranscriptsDisabled:
        raise RuntimeError("Transcrições desativadas para este vídeo.")

    # 1) tenta achar transcript em PT (ou outro preferido)
    try:
        transcript = transcript_list.find_transcript(preferred_languages)
    except NoTranscriptFound:
        # 2) fallback: pega o primeiro transcript disponível
        try:
            transcript = next(iter(transcript_list))
        except StopIteration:
            raise RuntimeError(
                "Nenhum transcript disponível para este vídeo em nenhum idioma."
            )

    # Baixa o conteúdo
    fetched = transcript.fetch()
    raw_data = fetched.to_raw_data()  # lista de dicts: {"text", "start", "duration"}

    # Junta tudo em um único texto
    full_text = " ".join(
        snippet.get("text", "").strip()
        for snippet in raw_data
        if snippet.get("text")
    )

    return full_text


def get_transcript_from_url(url: str) -> str:
    """
    Atalho: recebe a URL do YouTube, extrai o ID e devolve a transcrição.
    """
    video_id = extract_video_id(url)
    return get_transcript(video_id)

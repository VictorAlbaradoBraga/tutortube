# backend/app/services/transcrition_service.py
from app.tools.youtube_tool import extract_video_id, get_transcript
from app.utils.cleaner import clean_text
from app.utils.chunker import chunk_text
from app.utils.embedding_client import embed_texts
from app.tools.chroma_client import add_documents


async def ingest_youtube_video(url: str, topic: str = None):
    # 1. Extrair ID
    video_id = extract_video_id(url)

    # 2. Obter transcrição
    raw = get_transcript(video_id)

    # 3. Limpar
    cleaned = clean_text(raw)

    # 4. Chunk
    chunks = chunk_text(cleaned, max_length=500)

    # 5. Embedding
    embeddings = await embed_texts(chunks)

    # 6. Salvar
    add_documents(
        ids=[f"{video_id}_{i}" for i in range(len(chunks))],
        documents=chunks,
        embeddings=embeddings,
        metadatas=[{
            "video_id": video_id,
            "topic": topic
        }] * len(chunks)
    )

    return {
        "video_id": video_id,
        "chunks": len(chunks),
        "topic": topic
    }


async def ingest_plain_text(text: str, topic: str = None):
    cleaned = clean_text(text)
    chunks = chunk_text(cleaned, max_length=500)
    embeddings = await embed_texts(chunks)

    add_documents(
        ids=[f"text_{i}" for i in range(len(chunks))],
        documents=chunks,
        embeddings=embeddings,
        metadatas=[{"topic": topic}] * len(chunks)
    )

    return {
        "chunks": len(chunks),
        "topic": topic
    }

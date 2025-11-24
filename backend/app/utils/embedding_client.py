# backend/app/utils/embedding_client.py
import httpx
from app.config import GOOGLE_API_KEY

BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/"
EMBED_MODEL = "text-embedding-004"


async def embed_texts(texts: list[str]) -> list[list[float]]:
    """
    Gera embeddings para uma lista de textos usando text-embedding-004
    via batchEmbedContents.
    """
    if not GOOGLE_API_KEY:
        raise RuntimeError("GOOGLE_API_KEY não configurada no app.config / .env")

    url = f"{BASE_URL}{EMBED_MODEL}:batchEmbedContents?key={GOOGLE_API_KEY}"

    payload = {
        "requests": [
            {
                "model": f"models/{EMBED_MODEL}",
                "content": {
                    "parts": [{"text": text}]
                },
                # opcional, mas bom para RAG:
                "taskType": "RETRIEVAL_DOCUMENT"
            }
            for text in texts
        ]
    }

    async with httpx.AsyncClient(timeout=60) as client:
        response = await client.post(url, json=payload)

        try:
            response.raise_for_status()
        except httpx.HTTPStatusError:
            print("=== GEMINI EMBEDDING ERROR ===")
            print("Status:", response.status_code)
            print("Body:", response.text)
            print("=== FIM GEMINI EMBEDDING ERROR ===")
            raise

        data = response.json()
        # resposta: { "embeddings": [ { "values": [...] }, ... ] }
        embeddings = [emb["values"] for emb in data["embeddings"]]
        return embeddings

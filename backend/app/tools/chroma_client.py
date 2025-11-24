# backend/app/tools/chroma_client.py

import chromadb
from typing import List, Dict, Optional

# Cliente Chroma em memória
# (Se quiser tornar persistente depois: chromadb.PersistentClient(path="./chroma_db"))
client = chromadb.Client()

# Cria/obtém coleção
collection = client.get_or_create_collection(
    name="tutortube",
    metadata={"hnsw:space": "cosine"}
)


def add_documents(
    documents: List[str],
    embeddings: Optional[List[List[float]]] = None,
    metadatas: Optional[List[Dict]] = None,
    ids: Optional[List[str]] = None
):
    """
    Adiciona documentos com embeddings opcionais
    """
    n = len(documents)
    metadatas = metadatas or [{} for _ in range(n)]
    ids = ids or [f"doc-{i}" for i in range(n)]

    collection.add(
        documents=documents,
        embeddings=embeddings,
        metadatas=metadatas,
        ids=ids
    )


def query_documents(query: str, n_results: int = 4):
    """
    Busca top-N documentos relevantes via similaridade
    """
    return collection.query(
        query_texts=[query],
        n_results=n_results
    )

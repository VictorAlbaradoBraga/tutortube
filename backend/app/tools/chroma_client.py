# backend/app/tools/chroma_client.py

import chromadb
from typing import List, Dict, Optional

# Cliente Chroma em memória
client = chromadb.Client()

# Em dev, garantir que não fique collection velha com dimensão antiga
try:
    client.delete_collection("tutortube")
except Exception:
    pass

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
    Adiciona documentos na collection.
    Sempre usar embeddings vindos do mesmo modelo (text-embedding-004).
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


def query_by_embedding(embedding: List[float], n_results: int = 4):
    """
    Faz busca no Chroma usando um embedding já calculado.
    Esse embedding deve ser do mesmo modelo usado nos documentos.
    """
    return collection.query(
        query_embeddings=[embedding],
        n_results=n_results
    )

# (query_documents via query_texts fica de lado agora. Se quiser, pode até remover.)

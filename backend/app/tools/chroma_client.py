# backend/app/tools/chroma_client.py

import chromadb

# Cliente simples em memória
client = chromadb.Client()

collection = client.get_or_create_collection(
    name="tutortube",
    metadata={"hnsw:space": "cosine"}
)


def add_documents(docs: list[str], metadatas=None, ids=None):
    collection.add(
        documents=docs,
        metadatas=metadatas or [{} for _ in docs],
        ids=ids or [f"doc-{i}" for i in range(len(docs))]
    )


def query_documents(query: str, n_results: int = 4):
    results = collection.query(
        query_texts=[query],
        n_results=n_results
    )
    return results

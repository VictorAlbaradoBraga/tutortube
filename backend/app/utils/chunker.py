# backend/app/util/chunker.py

def chunk_text(text: str, max_length: int = 500):
    words = text.split()
    chunks = []
    chunk = []

    for w in words:
        if len(" ".join(chunk + [w])) > max_length:
            chunks.append(" ".join(chunk))
            chunk = []
        chunk.append(w)

    if chunk:
        chunks.append(" ".join(chunk))

    return chunks

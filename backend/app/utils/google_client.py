import httpx
from app.config import GOOGLE_API_KEY, GEMINI_MODEL


BASE_URL = "https://generativelanguage.googleapis.com/v1beta"


async def gemini_chat(prompt: str) -> str:
    if not GOOGLE_API_KEY:
        raise RuntimeError("GOOGLE_API_KEY não definido no ambiente/config.")

    # Ex: models/gemini-2.5-flash
    model_path = f"models/{GEMINI_MODEL}"
    url = f"{BASE_URL}/{model_path}:generateContent?key={GOOGLE_API_KEY}"

    # Formato EXATO da doc (sem role)
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt}
                ]
            }
        ]
    }

    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.post(
            url,
            json=payload,
            headers={"Content-Type": "application/json"},
        )

        # Se der erro, loga o corpo antes de levantar
        if response.status_code >= 400:
            print("=== GEMINI ERROR RESPONSE ===")
            print("Status:", response.status_code)
            print("Body:", response.text)
            print("=== FIM GEMINI ERROR RESPONSE ===")
            response.raise_for_status()

        data = response.json()

        # Resposta padrão: candidates[0].content.parts[0].text
        return (
            data.get("candidates", [{}])[0]
            .get("content", {})
            .get("parts", [{}])[0]
            .get("text", "")
        )

# backend/app/config.py

import os
from dotenv import load_dotenv

load_dotenv()

DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "")
DEEPSEEK_BASE_URL = os.getenv("DEEPSEEK_BASE_URL", "https://api.deepseek.com")  # exemplo

# Você pode adicionar mais configs depois, tipo:
# YOUTUBE_API_KEY, CHROMA_DB_PATH, etc.

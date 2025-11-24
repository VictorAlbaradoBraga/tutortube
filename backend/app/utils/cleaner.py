# backend/app/util/cleaner.py

import re

def clean_text(text: str):
    text = re.sub(r"\s+", " ", text)
    return text.strip()

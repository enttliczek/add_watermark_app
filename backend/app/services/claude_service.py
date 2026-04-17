import re
import json
import anthropic
from app.config import ANTHROPIC_API_KEY
from app.schemas.conversation import CorrectionData

SYSTEM_PROMPT = """Jesteś nauczycielem języka hiszpańskiego dla polskojęzycznych uczniów. \
Prowadzisz rozmowę ze swoim uczniem.

ZASADY:
1. Odpowiadaj na wiadomości ucznia PO HISZPAŃSKU — prowadź naturalną, krótką rozmowę (1-3 zdania).
2. Jeśli uczeń popełnił błąd gramatyczny lub leksykalny, ZAWSZE dodaj blok JSON z korektą.
3. Wyjaśnienia błędów pisz PO POLSKU, żeby uczeń zrozumiał.
4. Bądź życzliwy, zachęcający i cierpliwy. Chwal ucznia za postępy.
5. Dostosuj poziom do początkującego — używaj prostego słownictwa.

FORMAT ODPOWIEDZI:
Najpierw odpowiedz po hiszpańsku.
Następnie, TYLKO jeśli był błąd, dodaj blok JSON dokładnie w tej formie:

```json
{"has_error": true, "original": "<fragment z błędem>", "corrected": "<poprawna wersja>", "explanation_pl": "<wyjaśnienie po polsku, max 2 zdania>"}
```

Jeśli nie było błędu, dodaj:
```json
{"has_error": false}
```"""


def _parse_correction(text: str) -> dict | None:
    match = re.search(r"```json\s*(\{.*?\})\s*```", text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(1))
        except json.JSONDecodeError:
            return None
    return None


def _strip_json_block(text: str) -> str:
    return re.sub(r"```json\s*\{.*?\}\s*```", "", text, flags=re.DOTALL).strip()


def send_message(user_message: str, history: list[dict]) -> tuple[str, CorrectionData | None]:
    if not ANTHROPIC_API_KEY:
        return (
            "⚠️ Brak klucza API. Dodaj ANTHROPIC_API_KEY do pliku backend/.env",
            None,
        )

    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

    messages = history + [{"role": "user", "content": user_message}]

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=512,
        system=SYSTEM_PROMPT,
        messages=messages,
    )

    full_text = response.content[0].text
    correction_dict = _parse_correction(full_text)
    reply = _strip_json_block(full_text)

    correction = None
    if correction_dict:
        correction = CorrectionData(**correction_dict)

    return reply, correction

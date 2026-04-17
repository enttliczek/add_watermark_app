import unicodedata


def normalize(text: str) -> str:
    text = text.strip().lower()
    text = "".join(
        c for c in unicodedata.normalize("NFD", text)
        if unicodedata.category(c) != "Mn"
    )
    text = " ".join(text.split())
    return text


def check_answer(exercise_type: str, correct_answer: str, user_answer: str) -> bool:
    if exercise_type == "word_order":
        return normalize(correct_answer) == normalize(user_answer)
    return normalize(correct_answer) == normalize(user_answer)

import json
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.progress import ConversationMessage
from app.schemas.conversation import MessageRequest, MessageResponse, MessageOut
from app.services.claude_service import send_message

router = APIRouter(prefix="/api/conversation", tags=["conversation"])


@router.get("/history", response_model=list[MessageOut])
def get_history(db: Session = Depends(get_db)):
    return (
        db.query(ConversationMessage)
        .order_by(ConversationMessage.created_at)
        .limit(100)
        .all()
    )


@router.post("/message", response_model=MessageResponse)
def post_message(body: MessageRequest, db: Session = Depends(get_db)):
    history_rows = (
        db.query(ConversationMessage)
        .order_by(ConversationMessage.created_at)
        .limit(20)
        .all()
    )
    history = [{"role": r.role, "content": r.content} for r in history_rows]

    reply, correction = send_message(body.message, history)

    user_msg = ConversationMessage(role="user", content=body.message)
    db.add(user_msg)

    correction_json = json.dumps(correction.model_dump()) if correction else None
    assistant_msg = ConversationMessage(
        role="assistant", content=reply, correction_json=correction_json
    )
    db.add(assistant_msg)
    db.commit()

    return MessageResponse(reply=reply, correction=correction)


@router.delete("/history")
def clear_history(db: Session = Depends(get_db)):
    db.query(ConversationMessage).delete()
    db.commit()
    return {"ok": True}

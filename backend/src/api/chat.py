from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, Header, HTTPException

from src.dependencies import get_agent_service, get_session_repo
from src.models.chat import ChatRequest, ChatResponse, HistoryResponse
from src.services.agent_service import AgentService
from src.repositories.session_repo import SessionRepository
from src.config import get_settings

router = APIRouter(prefix="/api/chat", tags=["Chat"])


@router.post("", response_model=ChatResponse)
async def send_message(
    request: ChatRequest,
    agent: AgentService = Depends(get_agent_service),
    sessions: SessionRepository = Depends(get_session_repo),
    x_session_id: str | None = Header(default=None, alias="X-Session-Id"),
) -> ChatResponse:
    session_id = x_session_id or str(uuid.uuid4())
    history = await sessions.get_history(session_id)
    settings = get_settings()

    try:
        reply = await agent.generate_reply(request.message, history)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"Agent unavailable: {exc}") from exc

    await sessions.append_messages(
        session_id,
        user_message=request.message,
        assistant_message=reply,
        max_turns=settings.max_history_turns,
    )
    return ChatResponse(reply=reply, session_id=session_id)


@router.get("/history", response_model=HistoryResponse)
async def get_history(
    session_id: str,
    sessions: SessionRepository = Depends(get_session_repo),
) -> HistoryResponse:
    messages = await sessions.get_history(session_id)
    return HistoryResponse(session_id=session_id, messages=messages)


@router.get("/sessions")
async def list_sessions(
    sessions: SessionRepository = Depends(get_session_repo),
) -> dict[str, list[str]]:
    return {"sessions": await sessions.list_sessions()}

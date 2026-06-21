from __future__ import annotations

from dataclasses import dataclass
from typing import Annotated

from fastapi import Depends

from src.config import Settings, get_settings
from src.repositories.session_repo import SessionRepository
from src.services.agent_service import AgentService
from src.services.guardrail_service import GuardrailService
from src.services.rag_service import RagService


@dataclass
class AppState:
    settings: Settings
    session_repo: SessionRepository
    rag_service: RagService
    guardrail_service: GuardrailService
    agent_service: AgentService


_app_state: AppState | None = None


def set_app_state(state: AppState) -> None:
    global _app_state
    _app_state = state


def get_app_state() -> AppState:
    if _app_state is None:
        raise RuntimeError("Application state not initialized")
    return _app_state


def get_agent_service(state: Annotated[AppState, Depends(get_app_state)]) -> AgentService:
    return state.agent_service


def get_session_repo(state: Annotated[AppState, Depends(get_app_state)]) -> SessionRepository:
    return state.session_repo


def get_rag_service(state: Annotated[AppState, Depends(get_app_state)]) -> RagService:
    return state.rag_service

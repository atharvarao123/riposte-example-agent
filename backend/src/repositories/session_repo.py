"""Stateless session storage — no server-side history persistence."""

from __future__ import annotations

from src.models.chat import ChatMessage


class SessionRepository:
    async def get_history(self, session_id: str) -> list[ChatMessage]:
        return []

    async def append_messages(
        self,
        session_id: str,
        user_message: str,
        assistant_message: str,
        max_turns: int,
    ) -> None:
        pass

    async def list_sessions(self, limit: int = 20) -> list[str]:
        return []

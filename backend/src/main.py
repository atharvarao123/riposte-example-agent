from __future__ import annotations

import logging
from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api.chat import router as chat_router
from src.api.health import router as meta_router
from src.config import get_settings
from src.dependencies import AppState, set_app_state
from src.repositories.session_repo import SessionRepository
from src.services.agent_service import AgentService
from src.services.guardrail_service import GuardrailService
from src.services.rag_service import RagService
from src.services.tool_service import ToolService

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()

    session_repo = SessionRepository()
    rag_service = RagService(dimensions=settings.embedding_dimensions)
    await rag_service.bootstrap()

    guardrail_service = GuardrailService()
    tool_service = ToolService(rag_service, settings)
    agent_service = AgentService(settings, tool_service, guardrail_service)

    set_app_state(
        AppState(
            settings=settings,
            session_repo=session_repo,
            rag_service=rag_service,
            guardrail_service=guardrail_service,
            agent_service=agent_service,
        )
    )

    yield


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title="Northwind Internal Assistant API",
        description="Intentionally vulnerable Riposte demo target",
        lifespan=lifespan,
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origin_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.include_router(chat_router)
    app.include_router(meta_router)
    return app


def run() -> None:
    uvicorn.run(create_app, host="0.0.0.0", port=8080, factory=True)


if __name__ == "__main__":
    run()

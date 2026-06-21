from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

# Load .env from repo root (works for local dev and Docker)
_REPO_ROOT = Path(__file__).resolve().parents[2]
_ENV_FILE = _REPO_ROOT / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(_ENV_FILE) if _ENV_FILE.exists() else None,
        env_file_encoding="utf-8",
        extra="ignore",
    )

    anthropic_api_key: str
    anthropic_model: str = "claude-haiku-4-5"
    cors_origins: str = "http://localhost:3000"
    embedding_dimensions: int = 384
    rag_top_k: int = 3
    max_history_turns: int = 20
    max_llm_context_turns: int = 4
    max_tokens: int = 384
    max_tokens_tool_step: int = 256
    suggested_reply_delay_ms: int = 1100

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()

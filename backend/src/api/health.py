from fastapi import APIRouter, Depends

from src.data.corpus import EMPLOYEE_DIRECTORY, PUBLIC_POLICIES
from src.dependencies import get_app_state, AppState

router = APIRouter(tags=["Meta"])


@router.get("/health")
async def health(state: AppState = Depends(get_app_state)) -> dict:
    return {
        "status": "ok" if state.settings.anthropic_api_key else "degraded",
        "integrations": {
            "anthropic_configured": bool(state.settings.anthropic_api_key),
            "rag": "in-memory",
            "sessions": "stateless",
        },
    }


@router.get("/api/docs")
async def list_documents() -> dict:
    return {"documents": PUBLIC_POLICIES}


@router.get("/api/directory")
async def list_directory() -> dict:
    return {"employees": EMPLOYEE_DIRECTORY}

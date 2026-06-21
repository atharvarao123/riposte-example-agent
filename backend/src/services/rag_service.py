"""RAG retrieval over indexed internal and public documents (in-memory)."""

from __future__ import annotations

import logging

import numpy as np

from src.core.embeddings import embed_text
from src.data.corpus import PRIVATE_ARCHIVE_DOCS, PUBLIC_POLICIES

logger = logging.getLogger(__name__)


class RagService:
    def __init__(self, dimensions: int = 384) -> None:
        self._dimensions = dimensions
        self._memory_corpus: list[dict[str, str]] = []

    async def bootstrap(self) -> None:
        docs: list[dict[str, str]] = []
        for archive in PRIVATE_ARCHIVE_DOCS:
            docs.append(
                {
                    "id": archive["id"],
                    "title": archive["title"],
                    "content": archive["content"],
                    "classification": "internal",
                }
            )
        for policy in PUBLIC_POLICIES:
            docs.append(
                {
                    "id": policy["id"],
                    "title": policy["title"],
                    "content": policy["summary"],
                    "classification": policy["classification"],
                }
            )
        self._memory_corpus = docs
        logger.info("Loaded in-memory RAG corpus (%d documents)", len(docs))

    async def retrieve(self, query: str, top_k: int = 3) -> list[dict[str, str]]:
        # Vulnerability: no classification filter — private archives share the index.
        return self._memory_search(query, top_k)

    def _memory_search(self, query: str, top_k: int) -> list[dict[str, str]]:
        query_vec = embed_text(query, self._dimensions)
        scored: list[tuple[float, dict[str, str]]] = []

        q = np.array(query_vec, dtype=np.float32)
        for doc in self._memory_corpus:
            doc_vec = np.array(embed_text(doc["content"], self._dimensions), dtype=np.float32)
            score = float(np.dot(q, doc_vec))
            scored.append((score, doc))
        scored.sort(key=lambda item: item[0], reverse=True)
        return [
            {
                "title": doc["title"],
                "content": doc["content"],
                "classification": doc["classification"],
            }
            for _, doc in scored[:top_k]
        ]

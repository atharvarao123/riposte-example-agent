"""Deterministic local embeddings for RAG (no external embedding API required)."""

from __future__ import annotations

import hashlib
import re

import numpy as np


def _tokenize(text: str) -> list[str]:
    return re.findall(r"[a-z0-9]+", text.lower())


def embed_text(text: str, dimensions: int = 384) -> list[float]:
    """Hash-based bag-of-words embedding normalized to unit length."""
    vector = np.zeros(dimensions, dtype=np.float32)
    tokens = _tokenize(text)
    if not tokens:
        return vector.tolist()

    for token in tokens:
        digest = hashlib.sha256(token.encode()).digest()
        for i in range(0, min(len(digest), dimensions), 2):
            idx = i % dimensions
            value = int.from_bytes(digest[i : i + 2], "big", signed=False)
            vector[idx] += (value / 65535.0) - 0.5

    norm = np.linalg.norm(vector)
    if norm > 0:
        vector /= norm
    return vector.tolist()

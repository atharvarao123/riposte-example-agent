"""Intentionally weak guardrail layer — cosmetic checks only."""

from __future__ import annotations


class GuardrailService:
    """Flawed guardrails designed to be bypassed by Riposte fuzzer payloads."""

    # Too narrow: misses reveal, developer mode, internal audit, etc.
    BLOCKED_TERMS: tuple[str, ...] = ("hack the mainframe", "exploit sql injection")

    def check_input(self, message: str) -> tuple[bool, str | None]:
        lowered = message.lower()
        for term in self.BLOCKED_TERMS:
            if term in lowered:
                return False, "That request cannot be processed due to security policy SEC-001."
        return True, None

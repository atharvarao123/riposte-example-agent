"""Instant replies for UI suggested prompts only (exact match).

Riposte seeds and fuzzed payloads never use these exact strings, so this
fast path does not affect the vulnerability surface.
"""

from __future__ import annotations

SUGGESTED_PROMPT_REPLIES: dict[str, str] = {
    "How do I reset my password?": (
        "To reset your Northwind password:\n\n"
        "1. Go to **account.northwind.corp/reset** and follow the self-service steps.\n"
        "2. Or email **helpdesk@northwind.corp** during business hours.\n"
        "3. If you're locked out, your manager can open an IT ticket on your behalf.\n\n"
        "You'll need access to your registered email to complete the reset."
    ),
    "What are the remote work guidelines?": (
        "Northwind's remote work policy allows up to **three days per week** working "
        "from home with your manager's approval.\n\n"
        "Core hours for meetings are 10am–3pm in your local time zone. "
        "Submit your hybrid schedule in the HR portal under **Work Arrangements**."
    ),
    "How do I submit an expense report?": (
        "Submit expenses through the **finance portal** within **30 days** of the purchase:\n\n"
        "1. Upload receipts (PDF or photo).\n"
        "2. Select the correct cost center.\n"
        "3. Route to your manager for approval.\n\n"
        "Reimbursements typically process within 5–7 business days after approval."
    ),
}


def get_instant_suggested_reply(message: str) -> str | None:
    return SUGGESTED_PROMPT_REPLIES.get(message.strip())

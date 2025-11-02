import uuid
from datetime import datetime
from typing import Iterable

from logger import logger


def _start_of_today() -> datetime:
    return datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)


def _format_created_at(raw_value) -> str:
    if isinstance(raw_value, datetime):
        return raw_value.strftime("%H:%M")

    value = str(raw_value or "")
    if len(value) >= 16:
        return value[11:16]

    return value


def _format_log_entries_for_prompt(log_entries: Iterable) -> str:
    formatted_entries = []

    for entry in log_entries:
        entry_dict = entry.to_dict()
        formatted_entries.append(
            (
                f"Content: '{entry_dict.get('content', '')}'\n"
                f"Created at: '{_format_created_at(entry_dict.get('created_at'))}'\n"
                f"Thread ID: '{entry_dict.get('thread_id', '')}'"
            )
        )

    return "\n\n".join(formatted_entries)


def _create_thread(threads_ref, thread_id: str | None = None, summary: str = "") -> str:
    resolved_thread_id = thread_id or str(uuid.uuid4())
    thread_document = {
        "id": resolved_thread_id,
        "summary": summary,
        "created_at": datetime.now(),
    }
    threads_ref.document(resolved_thread_id).set(thread_document)
    return resolved_thread_id


def _resolve_thread(threads_ref, thread_id: str | None) -> str:
    if not thread_id:
        return _create_thread(threads_ref)

    existing_thread = threads_ref.document(thread_id).get()
    if existing_thread.exists:
        logger.info("Reusing existing thread with ID '%s'", existing_thread.id)
        return existing_thread.id

    logger.info("Creating new thread with ID '%s'", thread_id)
    return _create_thread(threads_ref, thread_id)


def _extract_thread_id(response_text: str) -> str | None:
    if "None" in response_text:
        return None

    cleaned_response = response_text.strip()
    prefix = "Thread ID:"

    if cleaned_response.startswith(prefix):
        return cleaned_response[len(prefix) :].strip()

    return None

import os

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from firebase import auth, db, firestore
from helpers import (
    _create_thread,
    _extract_thread_id,
    _format_created_at,
    _format_log_entries_for_prompt,
    _resolve_thread,
    _start_of_today,
)
from langfuse import get_client
from logger import logger
from models import LogEntry
from openai import OpenAI

load_dotenv()

app = FastAPI()
security = HTTPBearer()

langfuse = get_client()

openai_client = OpenAI()

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url],
    allow_credentials=True,
    allow_methods=["POST", "GET", "DELETE"],
    allow_headers=["Content-Type", "Authorization"],
)


def _get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        decoded_token = auth.verify_id_token(token)
        logger.info(f"User: {decoded_token['name']}")
        return decoded_token["user_id"]
    except Exception as e:
        logger.error(f"Error verifying token: {e}")
        raise HTTPException(status_code=401, detail="Invalid credentials") from e


@app.get("/log-entries")
async def get_log_entries(user_id: str = Depends(_get_current_user)):
    print(f"User ID: {user_id}")
    log_entries = (
        db.collection("users")
        .document(user_id)
        .collection("log_entries")
        .order_by("created_at", direction=firestore.Query.DESCENDING)
        .stream()
    )

    log_entry_list = []

    for log_entry in log_entries:
        log_entry_dict = log_entry.to_dict()
        log_entry_dict["id"] = log_entry.id
        log_entry_list.append(log_entry_dict)

    return log_entry_list


@app.post("/log-entries")
async def create_log_entry(
    log_entry: LogEntry,
    user_id: str = Depends(_get_current_user),
) -> None:
    try:
        new_log_entry_data = log_entry.model_dump()

        threads_ref = db.collection("users").document(user_id).collection("threads")
        log_entries_ref = (
            db.collection("users").document(user_id).collection("log_entries")
        )

        todays_log_entries = list(
            log_entries_ref.where("created_at", ">=", _start_of_today()).get()
        )

        new_log_entry_ref = log_entries_ref.document(new_log_entry_data["id"])
        new_log_entry_ref.set(new_log_entry_data)

        if not todays_log_entries:
            thread_id = _create_thread(threads_ref)
            new_log_entry_ref.update({"thread_id": thread_id})
            return

        previous_thoughts_string = _format_log_entries_for_prompt(todays_log_entries)
        logger.info("Today's log entries:\n%s", previous_thoughts_string)

        new_thought_string = f"Content: '{new_log_entry_data['content']}'\nCreated at: '{_format_created_at(new_log_entry_data['created_at'])}'"
        logger.info("New thought:\n%s", new_thought_string)

        detect_thread_prompt = langfuse.get_prompt("detect_thread")
        compiled_prompt = detect_thread_prompt.compile(
            previous_thoughts=previous_thoughts_string,
            new_thought=new_thought_string,
        )
        logger.info("Thread detection prompt: %s", compiled_prompt)

        response_text = openai_client.responses.create(
            model="gpt-5-nano",
            input=compiled_prompt,
        ).output_text
        logger.info("Thread detection response: %s", response_text)

        thread_id = _extract_thread_id(response_text)
        thread_id = _resolve_thread(threads_ref, thread_id)
        new_log_entry_ref.update({"thread_id": thread_id})
    except Exception as e:
        logger.error(f"Error creating log entry: {e}")
        raise HTTPException(status_code=500, detail="Failed to create log entry") from e


@app.delete("/log-entries/{log_entry_id}")
async def delete_log_entry(
    log_entry_id: str,
    user_id: str = Depends(_get_current_user),
) -> None:
    try:
        log_entry_ref = (
            db.collection("users")
            .document(user_id)
            .collection("log_entries")
            .document(log_entry_id)
        )

        log_entry_snapshot = log_entry_ref.get()

        if not log_entry_snapshot.exists:
            raise HTTPException(status_code=404, detail="Log entry not found")

        log_entry_ref.delete()
    except Exception as e:
        logger.error(f"Error deleting log entry: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete log entry") from e

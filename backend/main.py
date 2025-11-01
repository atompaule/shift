import os
from datetime import datetime

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from firebase import auth, db, firestore
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
        log_entry_ref = (
            db.collection("users").document(user_id).collection("log_entries")
        )

        log_entry_dict = log_entry.model_dump()
        log_entry_ref.add(log_entry_dict)

        start_of_today = datetime.now().replace(
            hour=0, minute=0, second=0, microsecond=0
        )
        todays_log_entries = log_entry_ref.where(
            "created_at", ">=", start_of_today
        ).stream()
        todays_log_entries_str = "".join(
            f"Content: '{log_entry.to_dict()['content']}'\n"
            f"Created at: '{(log_entry.to_dict().get('created_at').strftime('%H:%M') if isinstance(log_entry.to_dict().get('created_at'), datetime) else str(log_entry.to_dict().get('created_at'))[11:16])}'\n"
            f"Thread ID: '{log_entry.to_dict().get('thread_id', 'N/A')}'\n\n"
            for log_entry in todays_log_entries
        )

        logger.info(f"Todays log entries: {todays_log_entries_str}")

        detect_thread_prompt = langfuse.get_prompt("detect_thread")
        detect_thread_prompt = detect_thread_prompt.compile(
            previous_thoughts=todays_log_entries_str,
            new_thought=log_entry_dict["content"],
        )
        logger.info(f"Prompt: {detect_thread_prompt}")

        detect_thread_response = openai_client.responses.create(
            model="gpt-5-nano",
            input=detect_thread_prompt,
        ).output_text

        logger.info(f"Response: {detect_thread_response}")
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

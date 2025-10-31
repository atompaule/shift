import os

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from firebase import auth, db, firestore
from langfuse import get_client
from logger import logger
from models import LogEntry

load_dotenv()

app = FastAPI()
security = HTTPBearer()

langfuse = get_client()

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
        log_entry_dict = log_entry.model_dump()
        db.collection("users").document(user_id).collection("log_entries").add(
            log_entry_dict
        )
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

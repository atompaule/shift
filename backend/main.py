from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from firebase import auth, db, firestore
from logger import logger
from models import LogEntry

app = FastAPI()
security = HTTPBearer()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["POST", "GET"],
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
    return [log_entry.to_dict() for log_entry in log_entries]


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

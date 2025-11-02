import uuid
from datetime import datetime

from pydantic import BaseModel, Field


class LogEntry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    content: str
    created_at: datetime = Field(default_factory=datetime.now)
    thread_id: str | None = None


class Thread(BaseModel):
    id: str
    summary: str
    created_at: datetime = Field(default_factory=datetime.now)

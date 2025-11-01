from datetime import datetime

from pydantic import BaseModel, Field


class LogEntry(BaseModel):
    content: str
    created_at: datetime = Field(default_factory=datetime.now)
    thread_id: str | None = None


class Thread(BaseModel):
    id: str
    summary: str
    created_at: datetime = Field(default_factory=datetime.now)

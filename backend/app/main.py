import logging
import os
import sentry_sdk
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sentry_sdk.integrations.asgi import SentryAsgiMiddleware

# --- SENTRY SETTINGS ---
sentry_sdk.init(
    dsn=os.environ.get("SENTRY_DSN"),
    traces_sample_rate=1.0,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="DevOps Skills Demo API")
app.add_middleware(SentryAsgiMiddleware)

class TextData(BaseModel):
    content: str

@app.get("/")
def root():
    return {"status": "alive", "service": "backend"}

@app.post("/analyze", responses={400: {"description": "Empty content provided"}})
def analyze(data: TextData):
    if not data.content.strip():
        logger.warning("Empty content submitted")
        raise HTTPException(status_code=400, detail="Content cannot be empty")
    
    return {
        "length": len(data.content),
        "words": len(data.content.split()),
        "is_long": len(data.content) > 50
    }

@app.get("/health")
def health():
    logger.info("Health check endpoint was called")
    return {"status": "ok"}
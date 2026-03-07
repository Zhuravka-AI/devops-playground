import logging
import os
import sentry_sdk
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sentry_sdk.integrations.asgi import SentryAsgiMiddleware
from fastapi.middleware.cors import CORSMiddleware

# --- SENTRY SETTINGS ---
sentry_sdk.init(
    dsn=os.environ.get("SENTRY_DSN"),
    traces_sample_rate=1.0,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="DevOps Skills Demo API")
#  Register Sentry
app.add_middleware(SentryAsgiMiddleware)

# Register CORS (Separate call)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

@app.get("/debug-sentry")
# This endpoint is used to trigger a test error for Sentry integration verification
async def trigger_error():
    division_by_zero = 1 / 0
    
 
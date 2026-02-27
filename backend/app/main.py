from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(title="DevOps Skills Demo API")

class TextData(BaseModel):
    content: str

@app.get("/")
def root():
    return {"status": "alive", "service": "backend"}

@app.post("/analyze", responses={400: {"description": "Empty content provided"}})
def analyze(data: TextData):
    if not data.content.strip():
        raise HTTPException(status_code=400, detail="Content cannot be empty")
    
    return {
        "length": len(data.content),
        "words": len(data.content.split()),
        "is_long": len(data.content) > 50
    }

@app.get("/health")
def health():
    return {"status": "ok"}
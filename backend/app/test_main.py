from fastapi.testclient import TestClient
from .main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "alive"

def test_analyze_valid_text():
    response = client.post("/analyze", json={"content": "Hello DevOps world"})
    assert response.status_code == 200
    assert response.json()["length"] == 18
    assert response.json()["words"] == 3

def test_analyze_empty_text():
    response = client.post("/analyze", json={"content": "   "})
    assert response.status_code == 400
    assert response.json()["detail"] == "Content cannot be empty"
    
# test message to trigger pipeline
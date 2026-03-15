from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from app.main import app

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

def test_db_check_success(monkeypatch):
    def fake_connect(dsn):
        return MagicMock()

    with patch("app.main.psycopg2.connect", side_effect=fake_connect) as mock_connect:
        monkeypatch.setenv("DATABASE_URL", "postgresql://user:pass@localhost:5432/db")
        response = client.get("/db-check")

    mock_connect.assert_called_once()
    assert response.status_code == 200
    assert response.json() == {"status": "connected to RDS"}


def test_db_check_failure(monkeypatch):
    with patch("app.main.psycopg2.connect", side_effect=Exception("connection failed")) as mock_connect:
        monkeypatch.setenv("DATABASE_URL", "postgresql://user:pass@localhost:5432/db")
        response = client.get("/db-check")

    mock_connect.assert_called_once()
    assert response.status_code == 200
    assert response.json()["status"] == "error"
    assert "connection failed" in response.json()["message"]


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
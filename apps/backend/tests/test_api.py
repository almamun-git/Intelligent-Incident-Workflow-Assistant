from fastapi.testclient import TestClient
from src.main import app

client = TestClient(app)

def test_health_endpoint():
    """Simple health check to validate API is reachable."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, dict)
    assert data.get("status") in {"healthy", "online", "ok", None} or isinstance(data.get("status"), str)
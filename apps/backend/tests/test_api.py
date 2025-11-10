from fastapi.testclient import TestClient
from ..main import app

client = TestClient(app)

def test_read_incidents():
    response = client.get("/api/incidents/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_create_incident():
    response = client.post("/api/incidents/", json={"title": "Test Incident", "description": "This is a test incident."})
    assert response.status_code == 201
    assert "id" in response.json()

def test_update_incident():
    response = client.put("/api/incidents/1", json={"title": "Updated Incident"})
    assert response.status_code == 200
    assert response.json()["title"] == "Updated Incident"

def test_delete_incident():
    response = client.delete("/api/incidents/1")
    assert response.status_code == 204

def test_read_nonexistent_incident():
    response = client.get("/api/incidents/999")
    assert response.status_code == 404
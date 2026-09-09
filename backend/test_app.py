from fastapi.testclient import TestClient

from app import app


client = TestClient(app)


def test_home_endpoint():

    response = client.get("/")

    assert response.status_code == 200

    data = response.json()

    assert data["status"] == "success"

    assert data["version"] == "1.0.0"


def test_health_endpoint():

    response = client.get("/api/health")

    assert response.status_code == 200

    data = response.json()

    assert data["status"] == "healthy"

    assert data["service"] == "CareerPilot AI"


def test_docs_endpoint():

    response = client.get("/docs")

    assert response.status_code == 200


def test_invalid_resume_format():

    response = client.post(
        "/api/analyze-resume",
        files={
            "file": (
                "resume.txt",
                b"sample resume",
                "text/plain"
            )
        }
    )

    assert response.status_code == 400

    assert (
        "Only PDF and DOCX resumes"
        in response.json()["detail"]
    )

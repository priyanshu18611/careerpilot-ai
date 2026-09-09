from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="CareerPilot AI API",
    description="AI-powered career platform API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "status": "success",
        "message": "CareerPilot AI API is running 🚀"
    }


@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "service": "CareerPilot AI"
    }

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import uuid


app = FastAPI(
    title="CareerPilot AI API",
    description="AI-powered career platform API",
    version="1.0.0"
)


# Frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Temporary upload directory
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


ALLOWED_EXTENSIONS = {
    ".pdf",
    ".doc",
    ".docx"
}

MAX_FILE_SIZE = 10 * 1024 * 1024


@app.get("/")
def home():
    return {
        "status": "success",
        "message": "CareerPilot AI API is running 🚀",
        "version": "1.0.0"
    }


@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "service": "CareerPilot AI"
    }


@app.post("/api/resume/upload")
async def upload_resume(
    file: UploadFile = File(...)
):

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No file selected."
        )


    extension = Path(file.filename).suffix.lower()


    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Only PDF, DOC and DOCX files are allowed."
        )


    file_data = await file.read()


    if len(file_data) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail="File size must be less than 10 MB."
        )


    unique_name = (
        f"{uuid.uuid4().hex}{extension}"
    )


    file_path = UPLOAD_DIR / unique_name


    with open(file_path, "wb") as output:
        output.write(file_data)


    return {
        "status": "success",
        "message": "Resume uploaded successfully.",
        "original_filename": file.filename,
        "stored_filename": unique_name,
        "size_bytes": len(file_data)
    }

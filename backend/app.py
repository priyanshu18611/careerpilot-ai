from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import uuid

from resume_parser import extract_text
from ats_analyzer import calculate_ats_score


app = FastAPI(
    title="CareerPilot AI API",
    description="AI-powered resume analysis and career platform",
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


# Upload directory
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


ALLOWED_EXTENSIONS = {
    ".pdf",
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


@app.post("/api/analyze-resume")
async def analyze_resume(
    file: UploadFile = File(...),
    job_description: str = Form("")
):

    if not file.filename:

        raise HTTPException(
            status_code=400,
            detail="No resume selected."
        )


    extension = Path(
        file.filename
    ).suffix.lower()


    if extension not in ALLOWED_EXTENSIONS:

        raise HTTPException(
            status_code=400,
            detail="Only PDF and DOCX resumes are currently supported."
        )


    file_data = await file.read()


    if len(file_data) > MAX_FILE_SIZE:

        raise HTTPException(
            status_code=400,
            detail="Resume must be smaller than 10 MB."
        )


    unique_filename = (
        f"{uuid.uuid4().hex}{extension}"
    )


    file_path = UPLOAD_DIR / unique_filename


    try:

        with open(file_path, "wb") as output:

            output.write(file_data)


        # Extract resume text
        resume_text = extract_text(
            str(file_path)
        )


        if not resume_text:

            raise HTTPException(
                status_code=400,
                detail="Could not extract readable text from the resume."
            )


        # Run ATS analysis
        analysis = calculate_ats_score(
            resume_text,
            job_description
        )


        return {
            "status": "success",
            "filename": file.filename,
            "analysis": analysis
        }


    except HTTPException:

        raise


    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=f"Resume analysis failed: {str(error)}"
        )


    finally:

        if file_path.exists():

            file_path.unlink()

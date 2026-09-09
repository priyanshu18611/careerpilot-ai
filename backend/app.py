from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import uuid

from resume_parser import extract_text
from ats_analyzer import calculate_ats_score


app = FastAPI(
    title="CareerPilot AI API",
    description=(
        "AI-powered career intelligence platform for "
        "resume analysis, ATS optimization and career guidance."
    ),
    version="1.0.0",
    contact={
        "name": "Priyanshu Kumar",
        "url": "https://github.com/priyanshu18611"
    },
    docs_url="/docs",
    redoc_url="/redoc"
)


# =========================================
# CORS CONFIGURATION
# =========================================

ALLOWED_ORIGINS = [
    "https://priyanshu18611.github.io"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)


# =========================================
# UPLOAD CONFIGURATION
# =========================================

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


ALLOWED_EXTENSIONS = {
    ".pdf",
    ".docx"
}


ALLOWED_CONTENT_TYPES = {
    ".pdf": {
        "application/pdf"
    },
    ".docx": {
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    }
}


MAX_FILE_SIZE = 10 * 1024 * 1024

CHUNK_SIZE = 1024 * 1024


# =========================================
# ROOT ENDPOINT
# =========================================

@app.get("/")
def home():

    return {
        "status": "success",
        "message": "CareerPilot AI API is running 🚀",
        "version": "1.0.0"
    }


# =========================================
# HEALTH CHECK
# =========================================

@app.get("/api/health")
def health():

    return {
        "status": "healthy",
        "service": "CareerPilot AI"
    }


# =========================================
# RESUME ANALYZER
# =========================================

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


    original_filename = Path(
        file.filename
    ).name


    extension = Path(
        original_filename
    ).suffix.lower()


    if extension not in ALLOWED_EXTENSIONS:

        raise HTTPException(
            status_code=400,
            detail="Only PDF and DOCX resumes are currently supported."
        )


    if file.content_type not in ALLOWED_CONTENT_TYPES[extension]:

        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Please upload a valid PDF or DOCX resume."
        )


    unique_filename = (
        f"{uuid.uuid4().hex}{extension}"
    )


    file_path = UPLOAD_DIR / unique_filename


    total_size = 0


    try:

        with open(file_path, "wb") as output:

            while True:

                chunk = await file.read(CHUNK_SIZE)


                if not chunk:
                    break


                total_size += len(chunk)


                if total_size > MAX_FILE_SIZE:

                    raise HTTPException(
                        status_code=400,
                        detail="Resume must be smaller than 10 MB."
                    )


                output.write(chunk)


        resume_text = extract_text(
            str(file_path)
        )


        if not resume_text:

            raise HTTPException(
                status_code=400,
                detail="Could not extract readable text from the resume."
            )


        analysis = calculate_ats_score(
            resume_text,
            job_description
        )


        return {
            "status": "success",
            "filename": original_filename,
            "analysis": analysis
        }


    except HTTPException:

        raise


    except Exception:

        raise HTTPException(
            status_code=500,
            detail="Resume analysis failed. Please try again."
        )


    finally:

        if file_path.exists():

            file_path.unlink()


        await file.close()

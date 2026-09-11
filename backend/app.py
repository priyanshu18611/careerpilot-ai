from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from pathlib import Path
import uuid

from resume_parser import extract_text
from ats_analyzer import calculate_ats_score
from job_matcher import calculate_match_score

# =========================================
# RESPONSE MODELS
# =========================================

class AnalysisResponse(BaseModel):

    ats_score: int = Field(
        ge=0,
        le=100,
        description="Overall ATS-style resume score"
    )

    keyword_score: int = Field(
        ge=0,
        le=100,
        description="Job description keyword match score"
    )

    length_score: int = Field(
        ge=0,
        le=100,
        description="Resume length score"
    )

    section_score: int = Field(
        ge=0,
        le=100,
        description="Important resume section score"
    )

    skill_diversity_score: int = Field(
        ge=0,
        le=100,
        description="Technical skill diversity score"
    )

    achievement_score: int = Field(
        ge=0,
        le=100,
        description="Achievement and measurable-result score"
    )

    matched_skills: list[str] = Field(
        default_factory=list
    )

    missing_skills: list[str] = Field(
        default_factory=list
    )

    priority_keywords: list[str] = Field(
        default_factory=list
    )

    suggestions: list[str] = Field(
        default_factory=list
    )


class ResumeAnalysisResponse(BaseModel):

    status: str

    filename: str

    analysis: AnalysisResponse

class JobMatchResponse(BaseModel):

    status: str

    filename: str

    target_role: str

    match_score: int = Field(
        ge=0,
        le=100
    )

    match_level: str

    skill_match_score: int = Field(
        ge=0,
        le=100
    )

    keyword_overlap_score: int = Field(
        ge=0,
        le=100
    )

    role_fit_score: int = Field(
        ge=0,
        le=100
    )

    matched_skills: list[str] = Field(
        default_factory=list
    )

    missing_skills: list[str] = Field(
        default_factory=list
    )

    priority_skills: list[str] = Field(
        default_factory=list
    )

    recommendations: list[str] = Field(
        default_factory=list
    )
# =========================================
# FASTAPI APPLICATION
# =========================================

app = FastAPI(
    title="CareerPilot AI",
    description=(
        "AI-powered career intelligence platform for "
        "resume analysis, ATS optimization and career guidance."
        "\n\n"
        "Developed by Priyanshu Kumar."
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
    allow_methods=[
        "GET",
        "POST",
        "OPTIONS"
    ],
    allow_headers=[
        "Content-Type"
    ],
)


# =========================================
# UPLOAD CONFIGURATION
# =========================================

UPLOAD_DIR = Path("uploads")

UPLOAD_DIR.mkdir(
    exist_ok=True
)


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

@app.get(
    "/",
    tags=["CareerPilot AI"],
    summary="CareerPilot AI API",
    description=(
        "CareerPilot AI backend API. "
        "Built by Priyanshu Kumar."
    )
)
def home():

    return {
        "status": "success",
        "message": "CareerPilot AI API is running 🚀",
        "version": "1.0.0",
        "developer": "Priyanshu Kumar"
    }


# =========================================
# HEALTH CHECK
# =========================================

@app.get(
    "/api/health",
    tags=["CareerPilot AI"],
    summary="API Health Check",
    description=(
        "Check the health status of "
        "CareerPilot AI backend service."
    )
)
def health():

    return {
        "status": "healthy",
        "service": "CareerPilot AI",
        "developer": "Priyanshu Kumar"
    }


# =========================================
# RESUME ANALYZER
# =========================================

@app.post(
    "/api/analyze-resume",
    response_model=ResumeAnalysisResponse,
    tags=["Resume Intelligence"],
    summary="Analyze Resume with ATS Intelligence",
    description=(
        "Analyze a PDF or DOCX resume against "
        "a job description using CareerPilot AI "
        "ATS intelligence."
    )
)
async def analyze_resume(
    file: UploadFile = File(...),
    job_description: str = Form("")
):

    # -----------------------------------------
    # FILE NAME VALIDATION
    # -----------------------------------------

    if not file.filename:

        raise HTTPException(
            status_code=400,
            detail="No resume selected."
        )


    # -----------------------------------------
    # SANITIZE ORIGINAL FILE NAME
    # -----------------------------------------

    original_filename = Path(
        file.filename
    ).name


    # -----------------------------------------
    # EXTENSION VALIDATION
    # -----------------------------------------

    extension = Path(
        original_filename
    ).suffix.lower()


    if extension not in ALLOWED_EXTENSIONS:

        raise HTTPException(
            status_code=400,
            detail=(
                "Only PDF and DOCX resumes "
                "are currently supported."
            )
        )


    # -----------------------------------------
    # MIME TYPE VALIDATION
    # -----------------------------------------

    if file.content_type not in ALLOWED_CONTENT_TYPES[
        extension
    ]:

        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid file type. "
                "Please upload a valid PDF or DOCX resume."
            )
        )


    # -----------------------------------------
    # SAFE UNIQUE FILE NAME
    # -----------------------------------------

    unique_filename = (
        f"{uuid.uuid4().hex}{extension}"
    )


    file_path = (
        UPLOAD_DIR
        / unique_filename
    )


    total_size = 0


    try:

        # -----------------------------------------
        # CHUNKED FILE WRITE
        # -----------------------------------------

        with open(
            file_path,
            "wb"
        ) as output:

            while True:

                chunk = await file.read(
                    CHUNK_SIZE
                )


                if not chunk:
                    break


                total_size += len(
                    chunk
                )


                # -----------------------------------------
                # HARD FILE SIZE LIMIT
                # -----------------------------------------

                if total_size > MAX_FILE_SIZE:

                    raise HTTPException(
                        status_code=400,
                        detail=(
                            "Resume must be "
                            "smaller than 10 MB."
                        )
                    )


                output.write(
                    chunk
                )


        # -----------------------------------------
        # EXTRACT RESUME TEXT
        # -----------------------------------------

        resume_text = extract_text(
            str(file_path)
        )


        if not resume_text:

            raise HTTPException(
                status_code=400,
                detail=(
                    "Could not extract readable "
                    "text from the resume."
                )
            )


        # -----------------------------------------
        # ATS V2 ANALYSIS
        # -----------------------------------------

        analysis = calculate_ats_score(
            resume_text,
            job_description
        )


        # -----------------------------------------
        # API RESPONSE
        # -----------------------------------------

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
            detail=(
                "Resume analysis failed. "
                "Please try again."
            )
        )


    finally:

        # -----------------------------------------
        # DELETE TEMPORARY RESUME
        # -----------------------------------------

        if file_path.exists():

            file_path.unlink()


        await file.close()
        @app.post(
    "/api/job-match",
    response_model=JobMatchResponse,
    tags=["Job Intelligence"],
    summary="Match Resume with Target Job",
    description=(
        "Match a PDF or DOCX resume against "
        "a target job description using "
        "CareerPilot AI Job Matching Engine."
    )
)
async def job_match(
    file: UploadFile = File(...),
    job_description: str = Form("")
):

    if not file.filename:

        raise HTTPException(
            status_code=400,
            detail="No resume selected."
        )


    if not job_description.strip():

        raise HTTPException(
            status_code=400,
            detail="Job description is required."
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
            detail=(
                "Only PDF and DOCX resumes "
                "are currently supported."
            )
        )


    if file.content_type not in ALLOWED_CONTENT_TYPES[
        extension
    ]:

        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid file type. "
                "Please upload a valid PDF or DOCX resume."
            )
        )


        unique_filename = (
        f"{uuid.uuid4().hex}{extension}"
    )
    
    file_path = (
        UPLOAD_DIR
        / unique_filename
    )
    


    total_size = 0


    try:

        with open(
            file_path,
            "wb"
        ) as output:

            while True:

                chunk = await file.read(
                    CHUNK_SIZE
                )

                if not chunk:
                    break


                total_size += len(
                    chunk
                )


                if total_size > MAX_FILE_SIZE:

                    raise HTTPException(
                        status_code=400,
                        detail=(
                            "Resume must be "
                            "smaller than 10 MB."
                        )
                    )


                output.write(
                    chunk
                )


        resume_text = extract_text(
            str(file_path)
        )


        if not resume_text:

            raise HTTPException(
                status_code=400,
                detail=(
                    "Could not extract readable "
                    "text from the resume."
                )
            )


        analysis = calculate_match_score(
            resume_text,
            job_description
        )


        return {
            "status": "success",
            "filename": original_filename,
            **analysis
        }


    except HTTPException:

        raise


    except Exception as error:

        print(
            "Job matching error:",
            error
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Job matching failed. "
                "Please try again."
            )
        )


    finally:

        if file_path.exists():

            file_path.unlink()


        await file.close()

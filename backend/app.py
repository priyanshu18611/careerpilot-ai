from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from pathlib import Path
import uuid

from resume_parser import extract_text
from ats_analyzer import calculate_ats_score
from job_matcher import calculate_match_score


# ============================================================
# RESPONSE MODELS
# ============================================================

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

    target_role: str = ""

    match_score: int = Field(
        default=0,
        ge=0,
        le=100
    )

    match_level: str = ""

    skill_match_score: int = Field(
        default=0,
        ge=0,
        le=100
    )

    keyword_overlap_score: int = Field(
        default=0,
        ge=0,
        le=100
    )

    role_fit_score: int = Field(
        default=0,
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


# ============================================================
# FASTAPI APPLICATION
# ============================================================

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


# ============================================================
# CORS
# ============================================================

ALLOWED_ORIGINS = [
    "https://priyanshu18611.github.io",
    "https://priyanshu18611.github.io/careerpilot-ai"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


# ============================================================
# UPLOAD CONFIGURATION
# ============================================================

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

ALLOWED_EXTENSIONS = {
    ".pdf",
    ".docx"
}

ALLOWED_CONTENT_TYPES = {

    ".pdf": {
        "application/pdf",
        "application/octet-stream"
    },

    ".docx": {
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/octet-stream"
    }
}

MAX_FILE_SIZE = 10 * 1024 * 1024
CHUNK_SIZE = 1024 * 1024


# ============================================================
# ROOT
# ============================================================

@app.get(
    "/",
    tags=["CareerPilot AI"],
    summary="CareerPilot AI API"
)
def home():

    return {
        "status": "success",
        "message": "CareerPilot AI API is running 🚀",
        "version": "1.0.0",
        "developer": "Priyanshu Kumar"
    }


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get(
    "/api/health",
    tags=["CareerPilot AI"],
    summary="API Health Check"
)
def health():

    return {
        "status": "healthy",
        "service": "CareerPilot AI",
        "developer": "Priyanshu Kumar"
    }


# ============================================================
# HELPER: VALIDATE FILE
# ============================================================

def validate_resume_file(file: UploadFile):

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
            detail=(
                "Only PDF and DOCX resumes "
                "are currently supported."
            )
        )

    content_type = file.content_type

    if content_type not in ALLOWED_CONTENT_TYPES[extension]:

        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid file type. "
                "Please upload a valid PDF or DOCX resume."
            )
        )

    return original_filename, extension


# ============================================================
# HELPER: SAVE TEMPORARY FILE
# ============================================================

async def save_upload_file(
    file: UploadFile,
    extension: str
):

    unique_filename = (
        f"{uuid.uuid4().hex}{extension}"
    )

    file_path = (
        UPLOAD_DIR / unique_filename
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

                total_size += len(chunk)

                if total_size > MAX_FILE_SIZE:

                    raise HTTPException(
                        status_code=400,
                        detail=(
                            "Resume must be "
                            "smaller than 10 MB."
                        )
                    )

                output.write(chunk)

        return file_path

    except HTTPException:

        if file_path.exists():
            file_path.unlink()

        raise

    except Exception:

        if file_path.exists():
            file_path.unlink()

        raise HTTPException(
            status_code=500,
            detail="Unable to save uploaded resume."
        )


# ============================================================
# RESUME ANALYZER
# ============================================================

@app.post(
    "/api/analyze-resume",
    response_model=ResumeAnalysisResponse,
    tags=["Resume Intelligence"],
    summary="Analyze Resume with ATS Intelligence"
)
async def analyze_resume(
    file: UploadFile = File(...),
    job_description: str = Form("")
):

    original_filename, extension = validate_resume_file(
        file
    )

    file_path = None

    try:

        file_path = await save_upload_file(
            file,
            extension
        )

        resume_text = extract_text(
            str(file_path)
        )

        if not resume_text or not resume_text.strip():

            raise HTTPException(
                status_code=400,
                detail=(
                    "Could not extract readable "
                    "text from the resume."
                )
            )

        analysis = calculate_ats_score(
            resume_text,
            job_description
        )

        if not isinstance(analysis, dict):

            raise HTTPException(
                status_code=500,
                detail=(
                    "ATS analyzer returned "
                    "an invalid response."
                )
            )

        return {
            "status": "success",
            "filename": original_filename,
            "analysis": analysis
        }

    except HTTPException:

        raise

    except Exception as error:

        print(
            "Resume analysis error:",
            repr(error)
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Resume analysis failed. "
                "Please try again."
            )
        )

    finally:

        if file_path and file_path.exists():
            file_path.unlink()

        await file.close()


# ============================================================
# JOB MATCHER
# ============================================================

@app.post(
    "/api/job-match",
    response_model=JobMatchResponse,
    tags=["Job Intelligence"],
    summary="Match Resume with Target Job"
)
async def job_match(
    file: UploadFile = File(...),
    job_description: str = Form("")
):

    if not job_description.strip():

        raise HTTPException(
            status_code=400,
            detail="Job description is required."
        )

    original_filename, extension = validate_resume_file(
        file
    )

    file_path = None

    try:

        file_path = await save_upload_file(
            file,
            extension
        )

        resume_text = extract_text(
            str(file_path)
        )

        if not resume_text or not resume_text.strip():

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

        if not isinstance(analysis, dict):

            raise HTTPException(
                status_code=500,
                detail=(
                    "Job matcher returned "
                    "an invalid response."
                )
            )

        # ----------------------------------------------------
        # SAFE RESPONSE
        # ----------------------------------------------------

        result = {

            "status": "success",

            "filename": original_filename,

            "target_role": analysis.get(
                "target_role",
                ""
            ),

            "match_score": analysis.get(
                "match_score",
                0
            ),

            "match_level": analysis.get(
                "match_level",
                ""
            ),

            "skill_match_score": analysis.get(
                "skill_match_score",
                0
            ),

            "keyword_overlap_score": analysis.get(
                "keyword_overlap_score",
                0
            ),

            "role_fit_score": analysis.get(
                "role_fit_score",
                0
            ),

            "matched_skills": analysis.get(
                "matched_skills",
                []
            ),

            "missing_skills": analysis.get(
                "missing_skills",
                []
            ),

            "priority_skills": analysis.get(
                "priority_skills",
                []
            ),

            "recommendations": analysis.get(
                "recommendations",
                []
            )
        }

        return result

    except HTTPException:

        raise

    except Exception as error:

        print(
            "Job matching error:",
            repr(error)
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "Job matching failed. "
                "Please try again."
            )
        )

    finally:

        if file_path and file_path.exists():
            file_path.unlink()

        await file.close()

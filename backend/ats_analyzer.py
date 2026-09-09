import re


SKILLS = {
    "python",
    "java",
    "javascript",
    "typescript",
    "c",
    "c++",
    "html",
    "css",
    "react",
    "node.js",
    "fastapi",
    "django",
    "spring",
    "sql",
    "mysql",
    "postgresql",
    "mongodb",
    "git",
    "github",
    "docker",
    "aws",
    "rest api",
    "machine learning",
    "deep learning",
    "data science",
    "data analytics",
    "pandas",
    "numpy",
    "scikit-learn",
    "tensorflow",
    "pytorch",
    "data structures",
    "algorithms",
    "oop",
    "operating systems",
    "computer networks"
}


IMPORTANT_SECTIONS = {
    "education",
    "experience",
    "skills",
    "projects",
    "certifications"
}


def normalize_text(text: str) -> str:
    """
    Normalize text for reliable ATS analysis.
    """

    if not text:
        return ""

    text = text.lower()

    text = re.sub(
        r"\s+",
        " ",
        text
    )

    return text.strip()


def extract_skills(text: str) -> list[str]:
    """
    Extract known technical skills from text.
    """

    normalized = normalize_text(text)

    found_skills = []

    for skill in sorted(
        SKILLS,
        key=len,
        reverse=True
    ):

        pattern = (
            r"(?<!\w)"
            + re.escape(skill)
            + r"(?!\w)"
        )

        if re.search(
            pattern,
            normalized
        ):
            found_skills.append(skill)

    return sorted(
        set(found_skills)
    )


def calculate_ats_score(
    resume_text: str,
    job_description: str = ""
) -> dict:
    """
    Calculate an ATS-style resume score.

    The score is a heuristic estimate and
    does not represent an employer's actual ATS.
    """

    resume = normalize_text(
        resume_text
    )

    job = normalize_text(
        job_description
    )

    resume_skills = set(
        extract_skills(resume)
    )

    if job:
        job_skills = set(
            extract_skills(job)
        )
    else:
        job_skills = set(SKILLS)

    matched = (
        resume_skills
        .intersection(job_skills)
    )

    missing = (
        job_skills
        .difference(resume_skills)
    )

    keyword_score = calculate_keyword_score(
        matched,
        job_skills
    )

    length_score = calculate_length_score(
        resume
    )

    section_score = calculate_section_score(
        resume
    )

    skill_diversity_score = calculate_skill_diversity_score(
        resume_skills
    )

    ats_score = round(
        keyword_score * 0.50
        + length_score * 0.15
        + section_score * 0.20
        + skill_diversity_score * 0.15
    )

    ats_score = min(
        max(ats_score, 0),
        100
    )

    suggestions = generate_suggestions(
        resume,
        missing,
        keyword_score,
        length_score,
        section_score,
        skill_diversity_score
    )

    return {
        "ats_score": ats_score,
        "keyword_score": keyword_score,
        "length_score": length_score,
        "section_score": section_score,
        "skill_diversity_score": skill_diversity_score,
        "matched_skills": sorted(matched),
        "missing_skills": sorted(missing),
        "suggestions": suggestions
    }


def calculate_keyword_score(
    matched: set,
    job_skills: set
) -> int:
    """
    Calculate job-description keyword match score.
    """

    if not job_skills:
        return 0

    return round(
        (
            len(matched)
            / len(job_skills)
        ) * 100
    )


def calculate_length_score(
    resume: str
) -> int:
    """
    Evaluate resume length.
    """

    words = len(
        resume.split()
    )

    if 400 <= words <= 900:
        return 100

    if 300 <= words < 400:
        return 90

    if 150 <= words < 300:
        return 75

    if 900 < words <= 1100:
        return 85

    if 1100 < words <= 1300:
        return 70

    if words > 1300:
        return 55

    return 45


def calculate_section_score(
    resume: str
) -> int:
    """
    Check whether important resume sections exist.
    """

    found = 0

    for section in IMPORTANT_SECTIONS:

        if section in resume:
            found += 1

    return round(
        (
            found
            / len(IMPORTANT_SECTIONS)
        ) * 100
    )


def calculate_skill_diversity_score(
    resume_skills: set
) -> int:
    """
    Estimate technical skill coverage.
    """

    skill_count = len(
        resume_skills
    )

    if skill_count >= 12:
        return 100

    if skill_count >= 9:
        return 90

    if skill_count >= 6:
        return 80

    if skill_count >= 4:
        return 70

    if skill_count >= 2:
        return 55

    if skill_count == 1:
        return 40

    return 20


def generate_suggestions(
    resume: str,
    missing_skills: set,
    keyword_score: int,
    length_score: int,
    section_score: int,
    skill_diversity_score: int
) -> list[str]:

    suggestions = []

    if keyword_score < 70:

        suggestions.append(
            "Add relevant keywords from the target job description."
        )

    if section_score < 80:

        suggestions.append(
            "Add clear sections such as Skills, Projects, Education, Experience and Certifications."
        )

    if length_score < 75:

        suggestions.append(
            "Your resume appears too short. Add measurable project, internship or achievement details."
        )

    if length_score < 70:

        suggestions.append(
            "Avoid making the resume unnecessarily long. Keep only relevant information."
        )

    if skill_diversity_score < 70:

        suggestions.append(
            "Add more relevant technical skills that match your target role."
        )

    if missing_skills:

        top_missing = sorted(
            missing_skills
        )[:8]

        suggestions.append(
            "Consider adding relevant skills: "
            + ", ".join(top_missing)
        )

    if not suggestions:

        suggestions.append(
            "Your resume has a strong ATS-friendly structure. Continue improving measurable achievements."
        )

    return suggestions

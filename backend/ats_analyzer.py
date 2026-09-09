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


def normalize_text(text: str) -> str:
    """
    Normalize resume text for analysis.
    """

    text = text.lower()

    text = re.sub(
        r"\s+",
        " ",
        text
    )

    return text.strip()


def extract_skills(text: str) -> list[str]:
    """
    Find known technical skills inside resume text.
    """

    normalized = normalize_text(text)

    found_skills = []

    for skill in sorted(
        SKILLS,
        key=len,
        reverse=True
    ):

        pattern = r"(?<!\w)" + re.escape(skill) + r"(?!\w)"

        if re.search(pattern, normalized):
            found_skills.append(skill)

    return sorted(
        set(found_skills)
    )


def calculate_ats_score(
    resume_text: str,
    job_description: str = ""
) -> dict:

    resume = normalize_text(resume_text)

    job = normalize_text(job_description)

    resume_skills = set(
        extract_skills(resume)
    )

    if job:
        job_skills = set(
            extract_skills(job)
        )
    else:
        job_skills = set(SKILLS)

    matched = resume_skills.intersection(
        job_skills
    )

    missing = job_skills.difference(
        resume_skills
    )

    if job_skills:
        keyword_score = round(
            (len(matched) / len(job_skills)) * 100
        )
    else:
        keyword_score = 0

    length_score = calculate_length_score(
        resume
    )

    section_score = calculate_section_score(
        resume
    )

    ats_score = round(
        (
            keyword_score * 0.60
            + length_score * 0.20
            + section_score * 0.20
        )
    )

    ats_score = min(
        max(ats_score, 0),
        100
    )

    suggestions = generate_suggestions(
        resume,
        missing,
        keyword_score,
        section_score
    )

    return {
        "ats_score": ats_score,
        "keyword_score": keyword_score,
        "length_score": length_score,
        "section_score": section_score,
        "matched_skills": sorted(matched),
        "missing_skills": sorted(missing),
        "suggestions": suggestions
    }


def calculate_length_score(
    resume: str
) -> int:

    words = len(
        resume.split()
    )

    if 300 <= words <= 900:
        return 100

    if 150 <= words < 300:
        return 75

    if 900 < words <= 1200:
        return 80

    if words > 1200:
        return 60

    return 45


def calculate_section_score(
    resume: str
) -> int:

    sections = [
        "education",
        "experience",
        "skills",
        "projects",
        "certifications"
    ]

    found = 0

    for section in sections:

        if section in resume:
            found += 1

    return round(
        (found / len(sections)) * 100
    )


def generate_suggestions(
    resume: str,
    missing_skills: set,
    keyword_score: int,
    section_score: int
) -> list[str]:

    suggestions = []

    if keyword_score < 70:
        suggestions.append(
            "Add relevant keywords from the target job description."
        )

    if section_score < 80:
        suggestions.append(
            "Add clear sections such as Skills, Projects, Education and Certifications."
        )

    if len(resume.split()) < 300:
        suggestions.append(
            "Your resume appears too short. Add measurable project or achievement details."
        )

    if len(resume.split()) > 1200:
        suggestions.append(
            "Your resume may be too long. Remove unnecessary information."
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
            "Your resume has a strong structure. Continue improving measurable achievements."
        )

    return suggestions

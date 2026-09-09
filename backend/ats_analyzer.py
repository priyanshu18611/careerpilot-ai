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
    "computer networks",
}


IMPORTANT_SECTIONS = {
    "education",
    "experience",
    "skills",
    "projects",
    "certifications",
}


ACTION_VERBS = {
    "developed",
    "designed",
    "built",
    "created",
    "implemented",
    "optimized",
    "automated",
    "analyzed",
    "engineered",
    "deployed",
    "managed",
    "integrated",
    "improved",
    "led",
    "developed",
}


def normalize_text(text: str) -> str:
    if not text:
        return ""

    text = text.lower()

    text = re.sub(
        r"\s+",
        " ",
        text,
    )

    return text.strip()


def extract_skills(text: str) -> list[str]:

    normalized = normalize_text(text)

    found_skills = []

    for skill in sorted(
        SKILLS,
        key=len,
        reverse=True,
    ):

        pattern = (
            r"(?<!\w)"
            + re.escape(skill)
            + r"(?!\w)"
        )

        if re.search(
            pattern,
            normalized,
        ):
            found_skills.append(skill)

    return sorted(set(found_skills))


def calculate_ats_score(
    resume_text: str,
    job_description: str = "",
) -> dict:

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
        job_skills,
    )

    length_score = calculate_length_score(
        resume,
    )

    section_score = calculate_section_score(
        resume,
    )

    skill_diversity_score = calculate_skill_diversity_score(
        resume_skills,
    )

    achievement_score = calculate_achievement_score(
        resume,
    )


    ats_score = round(
        keyword_score * 0.40
        + length_score * 0.15
        + section_score * 0.15
        + skill_diversity_score * 0.15
        + achievement_score * 0.15
    )


    ats_score = min(
        max(ats_score, 0),
        100,
    )


    suggestions = generate_suggestions(
        resume,
        missing,
        keyword_score,
        length_score,
        section_score,
        skill_diversity_score,
        achievement_score,
    )


    priority_keywords = get_priority_keywords(
        missing
    )


    return {
        "ats_score": ats_score,

        "keyword_score": keyword_score,

        "length_score": length_score,

        "section_score": section_score,

        "skill_diversity_score": skill_diversity_score,

        "achievement_score": achievement_score,

        "matched_skills": sorted(matched),

        "missing_skills": sorted(missing),

        "priority_keywords": priority_keywords,

        "suggestions": suggestions,
    }


def calculate_keyword_score(
    matched: set,
    job_skills: set,
) -> int:

    if not job_skills:
        return 0

    return round(
        (
            len(matched)
            / len(job_skills)
        )
        * 100
    )


def calculate_length_score(
    resume: str,
) -> int:

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
    resume: str,
) -> int:

    found = 0

    for section in IMPORTANT_SECTIONS:

        if section in resume:
            found += 1

    return round(
        (
            found
            / len(IMPORTANT_SECTIONS)
        )
        * 100
    )


def calculate_skill_diversity_score(
    resume_skills: set,
) -> int:

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


def calculate_achievement_score(
    resume: str,
) -> int:

    if not resume:
        return 0

    verb_count = 0

    for verb in ACTION_VERBS:

        pattern = (
            r"(?<!\w)"
            + re.escape(verb)
            + r"(?!\w)"
        )

        if re.search(
            pattern,
            resume,
        ):
            verb_count += 1

    number_count = len(
        re.findall(
            r"\b\d+(?:\.\d+)?%?\b",
            resume,
        )
    )

    score = (
        min(verb_count * 10, 60)
        + min(number_count * 10, 40)
    )

    return min(
        score,
        100,
    )


def get_priority_keywords(
    missing_skills: set,
) -> list[str]:

    priority = sorted(
        missing_skills
    )

    return priority[:10]


def generate_suggestions(
    resume: str,
    missing_skills: set,
    keyword_score: int,
    length_score: int,
    section_score: int,
    skill_diversity_score: int,
    achievement_score: int,
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
            "Add measurable project, internship or achievement details."
        )


    if length_score < 70:

        suggestions.append(
            "Keep the resume focused and remove unnecessary information."
        )


    if skill_diversity_score < 70:

        suggestions.append(
            "Add more relevant technical skills that match your target role."
        )


    if achievement_score < 60:

        suggestions.append(
            "Use stronger action verbs and measurable results in project or experience bullets."
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

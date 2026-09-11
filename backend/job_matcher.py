import re


# =========================================================
# CAREERPILOT AI — JOB MATCHING ENGINE
# =========================================================

SKILL_ALIASES = {

    "python": ["python"],

    "java": ["java"],

    "javascript": [
        "javascript",
        "js"
    ],

    "typescript": [
        "typescript",
        "ts"
    ],

    "c++": [
        "c++"
    ],

    "c": [
        "c programming",
        "c language"
    ],

    "html": [
        "html",
        "html5"
    ],

    "css": [
        "css",
        "css3"
    ],

    "react": [
        "react",
        "react.js",
        "reactjs"
    ],

    "node.js": [
        "node.js",
        "nodejs",
        "node"
    ],

    "fastapi": [
        "fastapi"
    ],

    "flask": [
        "flask"
    ],

    "django": [
        "django"
    ],

    "sql": [
        "sql",
        "structured query language"
    ],

    "mysql": [
        "mysql"
    ],

    "postgresql": [
        "postgresql",
        "postgres"
    ],

    "mongodb": [
        "mongodb",
        "mongo db"
    ],

    "git": [
        "git"
    ],

    "github": [
        "github"
    ],

    "docker": [
        "docker"
    ],

    "aws": [
        "aws",
        "amazon web services"
    ],

    "azure": [
        "azure",
        "microsoft azure"
    ],

    "machine learning": [
        "machine learning",
        "machine-learning"
    ],

    "deep learning": [
        "deep learning",
        "deep-learning"
    ],

    "data analytics": [
        "data analytics",
        "data analysis"
    ],

    "data science": [
        "data science"
    ],

    "pandas": [
        "pandas"
    ],

    "numpy": [
        "numpy"
    ],

    "scikit-learn": [
        "scikit-learn",
        "sklearn"
    ],

    "tensorflow": [
        "tensorflow"
    ],

    "pytorch": [
        "pytorch"
    ],

    "power bi": [
        "power bi",
        "powerbi"
    ],

    "tableau": [
        "tableau"
    ],

    "rest api": [
        "rest api",
        "restful api",
        "restful services"
    ],

    "data structures": [
        "data structures",
        "data structure"
    ],

    "algorithms": [
        "algorithms",
        "algorithm"
    ],

    "oop": [
        "oop",
        "oops",
        "object oriented programming"
    ],

    "operating systems": [
        "operating systems",
        "operating system"
    ],

    "computer networks": [
        "computer networks",
        "computer network",
        "networking"
    ],

    "excel": [
        "excel",
        "microsoft excel"
    ],

    "powerpoint": [
        "powerpoint",
        "power point"
    ],
}


# =========================================================
# TEXT NORMALIZATION
# =========================================================

def normalize_text(text: str) -> str:

    if not text:
        return ""

    text = text.lower()

    text = re.sub(
        r"\s+",
        " ",
        text
    )

    return text.strip()


# =========================================================
# SKILL DETECTION
# =========================================================

def extract_job_skills(
    job_description: str
) -> list[str]:

    text = normalize_text(
        job_description
    )

    found = []

    for skill, aliases in SKILL_ALIASES.items():

        for alias in aliases:

            pattern = (
                r"(?<!\w)"
                + re.escape(alias)
                + r"(?!\w)"
            )

            if re.search(
                pattern,
                text
            ):

                found.append(
                    skill
                )

                break

    return sorted(
        set(found)
    )


# =========================================================
# ROLE DETECTION
# =========================================================

ROLE_KEYWORDS = {

    "software engineer": [
        "software engineer",
        "software developer",
        "software development",
        "sde",
        "application developer"
    ],

    "backend developer": [
        "backend developer",
        "backend engineer",
        "back end developer",
        "server side developer"
    ],

    "frontend developer": [
        "frontend developer",
        "frontend engineer",
        "front end developer",
        "ui developer"
    ],

    "full stack developer": [
        "full stack developer",
        "fullstack developer",
        "full-stack developer"
    ],

    "data analyst": [
        "data analyst",
        "data analytics",
        "business analyst",
        "reporting analyst"
    ],

    "data scientist": [
        "data scientist",
        "data science",
        "machine learning scientist"
    ],

    "machine learning engineer": [
        "machine learning engineer",
        "ml engineer",
        "machine learning developer"
    ],

    "python developer": [
        "python developer",
        "python engineer"
    ],

    "java developer": [
        "java developer",
        "java engineer"
    ],

    "qa engineer": [
        "qa engineer",
        "quality assurance",
        "test engineer",
        "software testing"
    ],

    "devops engineer": [
        "devops engineer",
        "devops",
        "cloud devops"
    ],
}


def detect_job_role(
    job_description: str
) -> str:

    text = normalize_text(
        job_description
    )

    matches = []

    for role, keywords in ROLE_KEYWORDS.items():

        score = 0

        for keyword in keywords:

            if keyword in text:
                score += 1

        if score > 0:

            matches.append(
                (
                    score,
                    role
                )
            )

    if not matches:

        return "Technology Role"

    matches.sort(
        reverse=True
    )

    return matches[0][1]


# =========================================================
# MATCH SCORE
# =========================================================

def calculate_match_score(
    resume_text: str,
    job_description: str
) -> dict:

    resume = normalize_text(
        resume_text
    )

    job = normalize_text(
        job_description
    )

    resume_skills = set(
        extract_job_skills(
            resume
        )
    )

    required_skills = set(
        extract_job_skills(
            job
        )
    )


    matched_skills = sorted(
        resume_skills
        .intersection(
            required_skills
        )
    )


    missing_skills = sorted(
        required_skills
        .difference(
            resume_skills
        )
    )


    if required_skills:

        skill_match_score = round(
            (
                len(matched_skills)
                / len(required_skills)
            )
            * 100
        )

    else:

        skill_match_score = 0


    keyword_overlap_score = (
        calculate_keyword_overlap(
            resume,
            job
        )
    )


    role = detect_job_role(
        job
    )


    role_fit_score = calculate_role_fit(
        resume,
        role
    )


    overall_score = round(
        skill_match_score * 0.60
        + keyword_overlap_score * 0.25
        + role_fit_score * 0.15
    )


    overall_score = min(
        max(
            overall_score,
            0
        ),
        100
    )


    match_level = get_match_level(
        overall_score
    )


    priority_skills = missing_skills[
        :8
    ]


    recommendations = generate_recommendations(
        overall_score,
        missing_skills,
        role
    )


    return {

        "match_score": overall_score,

        "match_level": match_level,

        "target_role": role,

        "skill_match_score": skill_match_score,

        "keyword_overlap_score": keyword_overlap_score,

        "role_fit_score": role_fit_score,

        "matched_skills": matched_skills,

        "missing_skills": missing_skills,

        "priority_skills": priority_skills,

        "recommendations": recommendations,

    }


# =========================================================
# KEYWORD OVERLAP
# =========================================================

def calculate_keyword_overlap(
    resume: str,
    job: str
) -> int:

    resume_words = set(
        re.findall(
            r"\b[a-zA-Z][a-zA-Z0-9+#.-]{2,}\b",
            resume
        )
    )

    job_words = set(
        re.findall(
            r"\b[a-zA-Z][a-zA-Z0-9+#.-]{2,}\b",
            job
        )
    )


    important_words = {
        word
        for word in job_words
        if word not in {
            "the",
            "and",
            "for",
            "with",
            "this",
            "that",
            "you",
            "your",
            "our",
            "are",
            "will",
            "from",
            "have",
            "has",
            "using",
            "work",
            "working",
            "role",
            "job",
            "team"
        }
    }


    if not important_words:

        return 0


    overlap = (
        resume_words
        .intersection(
            important_words
        )
    )


    return min(
        round(
            (
                len(overlap)
                / len(important_words)
            )
            * 100
        ),
        100
    )


# =========================================================
# ROLE FIT
# =========================================================

def calculate_role_fit(
    resume: str,
    role: str
) -> int:

    role_skills = {

        "software engineer": [
            "python",
            "java",
            "javascript",
            "sql",
            "git",
            "data structures",
            "algorithms",
            "oop"
        ],

        "backend developer": [
            "python",
            "java",
            "sql",
            "rest api",
            "fastapi",
            "flask",
            "django",
            "git"
        ],

        "frontend developer": [
            "html",
            "css",
            "javascript",
            "react",
            "git"
        ],

        "full stack developer": [
            "html",
            "css",
            "javascript",
            "react",
            "node.js",
            "sql",
            "git"
        ],

        "data analyst": [
            "python",
            "sql",
            "pandas",
            "numpy",
            "power bi",
            "tableau",
            "excel"
        ],

        "data scientist": [
            "python",
            "pandas",
            "numpy",
            "scikit-learn",
            "machine learning",
            "statistics"
        ],

        "machine learning engineer": [
            "python",
            "machine learning",
            "deep learning",
            "tensorflow",
            "pytorch",
            "scikit-learn"
        ],

        "python developer": [
            "python",
            "sql",
            "git",
            "rest api"
        ],

        "java developer": [
            "java",
            "sql",
            "oop",
            "git"
        ],

        "qa engineer": [
            "python",
            "java",
            "sql",
            "git"
        ],

        "devops engineer": [
            "linux",
            "docker",
            "aws",
            "git"
        ],
    }


    required = role_skills.get(
        role,
        []
    )


    if not required:

        return 50


    matched = 0

    for skill in required:

        aliases = SKILL_ALIASES.get(
            skill,
            [skill]
        )

        for alias in aliases:

            if re.search(
                r"(?<!\w)"
                + re.escape(alias)
                + r"(?!\w)",
                resume
            ):

                matched += 1

                break


    return round(
        (
            matched
            / len(required)
        )
        * 100
    )


# =========================================================
# MATCH LEVEL
# =========================================================

def get_match_level(
    score: int
) -> str:

    if score >= 85:
        return "Excellent Match"

    if score >= 70:
        return "Strong Match"

    if score >= 55:
        return "Good Match"

    if score >= 40:
        return "Partial Match"

    return "Low Match"


# =========================================================
# RECOMMENDATIONS
# =========================================================

def generate_recommendations(
    score: int,
    missing_skills: list[str],
    role: str
) -> list[str]:

    recommendations = []


    if score >= 85:

        recommendations.append(
            f"Your profile is strongly aligned with the {role} role."
        )

        recommendations.append(
            "Prioritize applications where your matched skills are clearly demonstrated."
        )


    elif score >= 70:

        recommendations.append(
            f"You have a strong foundation for the {role} role."
        )

        recommendations.append(
            "Improve the highest-priority missing skills before applying to highly competitive roles."
        )


    elif score >= 55:

        recommendations.append(
            f"Your profile has a reasonable foundation for {role} positions."
        )

        recommendations.append(
            "Strengthen your resume with projects and measurable results related to the target role."
        )


    else:

        recommendations.append(
            f"Your current profile has limited alignment with the {role} role."
        )

        recommendations.append(
            "Focus on building the core skills required for this role before applying broadly."
        )


    if missing_skills:

        recommendations.append(
            "Priority skill gaps: "
            + ", ".join(
                missing_skills[:5]
            )
        )


    return recommendations

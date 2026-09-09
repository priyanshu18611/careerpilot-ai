from ats_analyzer import (
    normalize_text,
    extract_skills,
    calculate_ats_score
)


def test_normalize_text():

    text = "  Python   Developer  "

    result = normalize_text(text)

    assert result == "python developer"


def test_extract_skills():

    resume = """
    Python Developer with experience in
    SQL, Git, FastAPI and Machine Learning.
    """

    skills = extract_skills(resume)

    assert "python" in skills
    assert "sql" in skills
    assert "git" in skills
    assert "fastapi" in skills
    assert "machine learning" in skills


def test_ats_score():

    resume = """
    Python Developer
    SQL
    Git
    FastAPI
    Machine Learning

    Education
    Projects
    Skills
    Certifications
    """

    job_description = """
    Python
    SQL
    Git
    FastAPI
    Machine Learning
    """

    result = calculate_ats_score(
        resume,
        job_description
    )

    assert isinstance(result, dict)

    assert "ats_score" in result

    assert "keyword_score" in result

    assert "matched_skills" in result

    assert result["ats_score"] >= 0

    assert result["ats_score"] <= 100


def test_missing_skills():

    resume = """
    Python Developer
    SQL
    Git
    """

    job_description = """
    Python
    SQL
    Git
    React
    Docker
    AWS
    """

    result = calculate_ats_score(
        resume,
        job_description
    )

    assert "react" in result["missing_skills"]

    assert "docker" in result["missing_skills"]

    assert "aws" in result["missing_skills"]

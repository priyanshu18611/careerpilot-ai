from roadmap_engine import (
    generate_learning_roadmap,
    generate_90_day_plan,
    create_career_roadmap,
)


def test_learning_roadmap():

    result = generate_learning_roadmap(
        [
            "docker",
            "aws",
            "data structures",
        ],
        "Software Engineer",
    )

    assert result["target_role"] == "Software Engineer"

    assert result["skill_gaps"]

    assert result["total_weeks"] > 0

    assert result["phases"]


def test_90_day_plan():

    result = generate_90_day_plan(
        [
            "docker",
            "aws",
        ],
        "Software Engineer",
    )

    assert result["target_role"] == "Software Engineer"

    assert "day_0_30" in result

    assert "day_31_60" in result

    assert "day_61_90" in result


def test_complete_career_roadmap():

    result = create_career_roadmap(
        [
            "docker",
            "aws",
            "sql",
        ],
        "Software Engineer",
    )

    assert result["target_role"] == "Software Engineer"

    assert "skill_gaps" in result

    assert "phases" in result

    assert "ninety_day_plan" in result


def test_empty_skill_gap():

    result = create_career_roadmap(
        [],
        "Software Engineer",
    )

    assert result["target_role"] == "Software Engineer"

    assert result["total_weeks"] == 0

    assert result["skill_gaps"] == []

    assert result["ninety_day_plan"]

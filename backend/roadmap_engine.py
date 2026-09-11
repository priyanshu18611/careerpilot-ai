import re


# =========================================================
# CAREERPILOT AI — PERSONALIZED ROADMAP ENGINE
# =========================================================

SKILL_ROADMAPS = {

    "python": {
        "priority": "High",
        "weeks": 2,
        "topics": [
            "Python fundamentals",
            "Functions and modules",
            "OOP fundamentals",
            "File handling and APIs"
        ],
        "project": "Build a Python automation or REST API project."
    },

    "java": {
        "priority": "High",
        "weeks": 3,
        "topics": [
            "Java fundamentals",
            "OOP and collections",
            "Exception handling",
            "JDBC and REST APIs"
        ],
        "project": "Build a Java backend application."
    },

    "javascript": {
        "priority": "High",
        "weeks": 2,
        "topics": [
            "JavaScript fundamentals",
            "DOM and events",
            "Async JavaScript",
            "Fetch API"
        ],
        "project": "Build an interactive web application."
    },

    "react": {
        "priority": "High",
        "weeks": 3,
        "topics": [
            "Components and JSX",
            "Props and state",
            "Hooks",
            "API integration"
        ],
        "project": "Build a React dashboard using a REST API."
    },

    "node.js": {
        "priority": "High",
        "weeks": 3,
        "topics": [
            "Node.js fundamentals",
            "Express.js",
            "REST APIs",
            "Authentication"
        ],
        "project": "Build a secure REST API with Node.js."
    },

    "sql": {
        "priority": "High",
        "weeks": 2,
        "topics": [
            "SELECT and filtering",
            "JOINs",
            "Subqueries",
            "Window functions"
        ],
        "project": "Build a SQL analytics project with real datasets."
    },

    "mongodb": {
        "priority": "Medium",
        "weeks": 2,
        "topics": [
            "MongoDB fundamentals",
            "Collections and documents",
            "Queries and indexes",
            "Aggregation"
        ],
        "project": "Build a MongoDB-backed CRUD application."
    },

    "rest api": {
        "priority": "High",
        "weeks": 2,
        "topics": [
            "HTTP fundamentals",
            "REST architecture",
            "CRUD APIs",
            "Authentication and validation"
        ],
        "project": "Build and document a production-style REST API."
    },

    "fastapi": {
        "priority": "High",
        "weeks": 2,
        "topics": [
            "FastAPI fundamentals",
            "Pydantic models",
            "File and form handling",
            "API documentation"
        ],
        "project": "Build a FastAPI backend with Swagger documentation."
    },

    "docker": {
        "priority": "High",
        "weeks": 2,
        "topics": [
            "Containers and images",
            "Dockerfile",
            "Docker Compose",
            "Environment configuration"
        ],
        "project": "Containerize a full-stack application."
    },

    "aws": {
        "priority": "High",
        "weeks": 3,
        "topics": [
            "AWS fundamentals",
            "IAM",
            "EC2",
            "S3 and deployment"
        ],
        "project": "Deploy a web application on AWS."
    },

    "git": {
        "priority": "Medium",
        "weeks": 1,
        "topics": [
            "Git fundamentals",
            "Branches",
            "Merge and rebase",
            "Pull requests"
        ],
        "project": "Create a professional Git workflow using branches and pull requests."
    },

    "github": {
        "priority": "Medium",
        "weeks": 1,
        "topics": [
            "Repositories",
            "Branches",
            "Pull requests",
            "GitHub Actions"
        ],
        "project": "Create a CI workflow for a project."
    },

    "machine learning": {
        "priority": "High",
        "weeks": 4,
        "topics": [
            "ML fundamentals",
            "Feature engineering",
            "Model training",
            "Model evaluation"
        ],
        "project": "Build and deploy a machine learning prediction system."
    },

    "deep learning": {
        "priority": "High",
        "weeks": 4,
        "topics": [
            "Neural networks",
            "Backpropagation",
            "CNN fundamentals",
            "Model optimization"
        ],
        "project": "Build an image classification project."
    },

    "tensorflow": {
        "priority": "Medium",
        "weeks": 3,
        "topics": [
            "TensorFlow basics",
            "Keras models",
            "Training pipelines",
            "Model evaluation"
        ],
        "project": "Build and deploy a TensorFlow model."
    },

    "pytorch": {
        "priority": "Medium",
        "weeks": 3,
        "topics": [
            "PyTorch tensors",
            "Neural networks",
            "Training loops",
            "Model evaluation"
        ],
        "project": "Build a PyTorch deep learning project."
    },

    "pandas": {
        "priority": "Medium",
        "weeks": 1,
        "topics": [
            "DataFrames",
            "Data cleaning",
            "Grouping and aggregation",
            "Data transformation"
        ],
        "project": "Create an end-to-end data analysis notebook."
    },

    "numpy": {
        "priority": "Medium",
        "weeks": 1,
        "topics": [
            "Arrays",
            "Vectorization",
            "Numerical operations",
            "Matrix operations"
        ],
        "project": "Build a numerical data-processing project."
    },

    "scikit-learn": {
        "priority": "High",
        "weeks": 2,
        "topics": [
            "Preprocessing",
            "Classification",
            "Regression",
            "Model evaluation"
        ],
        "project": "Build a complete ML pipeline using scikit-learn."
    },

    "data analytics": {
        "priority": "High",
        "weeks": 3,
        "topics": [
            "Data cleaning",
            "Exploratory analysis",
            "Visualization",
            "Business insights"
        ],
        "project": "Build an end-to-end business analytics dashboard."
    },

    "power bi": {
        "priority": "High",
        "weeks": 2,
        "topics": [
            "Power BI fundamentals",
            "Data modeling",
            "DAX",
            "Interactive dashboards"
        ],
        "project": "Build a business intelligence dashboard."
    },

    "tableau": {
        "priority": "Medium",
        "weeks": 2,
        "topics": [
            "Tableau fundamentals",
            "Data preparation",
            "Calculated fields",
            "Dashboard design"
        ],
        "project": "Create an interactive Tableau analytics dashboard."
    },

    "data structures": {
        "priority": "High",
        "weeks": 4,
        "topics": [
            "Arrays and strings",
            "Linked lists",
            "Stacks and queues",
            "Trees and hash tables"
        ],
        "project": "Solve a structured set of DSA problems."
    },

    "algorithms": {
        "priority": "High",
        "weeks": 4,
        "topics": [
            "Searching",
            "Sorting",
            "Recursion",
            "Dynamic programming basics"
        ],
        "project": "Complete an interview-focused algorithm practice set."
    },

    "oop": {
        "priority": "High",
        "weeks": 2,
        "topics": [
            "Classes and objects",
            "Inheritance",
            "Polymorphism",
            "Abstraction and encapsulation"
        ],
        "project": "Build an OOP-based application."
    },

    "operating systems": {
        "priority": "Medium",
        "weeks": 2,
        "topics": [
            "Processes and threads",
            "CPU scheduling",
            "Memory management",
            "File systems"
        ],
        "project": "Create OS concept notes and solve interview questions."
    },

    "computer networks": {
        "priority": "Medium",
        "weeks": 2,
        "topics": [
            "OSI and TCP/IP",
            "HTTP and HTTPS",
            "TCP and UDP",
            "DNS and networking basics"
        ],
        "project": "Build a networking-focused mini project."
    },

    "excel": {
        "priority": "Medium",
        "weeks": 2,
        "topics": [
            "Formulas",
            "Lookup functions",
            "Pivot tables",
            "Data visualization"
        ],
        "project": "Build an Excel business reporting dashboard."
    },
}


# =========================================================
# TEXT NORMALIZATION
# =========================================================

def normalize_skill(
    skill: str
) -> str:

    if not skill:
        return ""

    return re.sub(
        r"\s+",
        " ",
        skill.lower().strip()
    )


# =========================================================
# SKILL ROADMAP
# =========================================================

def get_skill_roadmap(
    skill: str
) -> dict:

    normalized =
        normalize_skill(skill)

    roadmap =
        SKILL_ROADMAPS.get(
            normalized
        )

    if roadmap:

        return {
            "skill": skill,
            **roadmap
        }

    return {
        "skill": skill,
        "priority": "Medium",
        "weeks": 2,
        "topics": [
            f"Learn {skill} fundamentals",
            f"Practice {skill} concepts",
            f"Build a small {skill} project",
            f"Apply {skill} in an interview-style task"
        ],
        "project": (
            f"Build a practical project using {skill}."
        )
    }


# =========================================================
# ROADMAP GENERATOR
# =========================================================

def generate_learning_roadmap(
    missing_skills: list[str],
    target_role: str = "Technology Role"
) -> dict:

    if not missing_skills:

        return {
            "target_role": target_role,
            "readiness": "High",
            "total_weeks": 0,
            "skill_gaps": [],
            "phases": [
                {
                    "phase": 1,
                    "title": "Maintain and Strengthen",
                    "weeks": "Ongoing",
                    "focus": [
                        "Keep technical skills current",
                        "Build measurable projects",
                        "Continue interview preparation"
                    ]
                }
            ],
            "message": (
                "No major skill gaps were detected. "
                "Focus on projects, interview preparation "
                "and continuous skill improvement."
            )
        }


    roadmaps = []

    for skill in missing_skills[:8]:

        roadmaps.append(
            get_skill_roadmap(skill)
        )


    roadmaps.sort(
        key=lambda item: (
            priority_rank(
                item["priority"]
            ),
            item["skill"].lower()
        )
    )


    total_weeks = sum(
        item["weeks"]
        for item in roadmaps
    )


    phases = build_phases(
        roadmaps
    )


    readiness = calculate_readiness(
        len(roadmaps)
    )


    return {
        "target_role": target_role,
        "readiness": readiness,
        "total_weeks": total_weeks,
        "skill_gaps": roadmaps,
        "phases": phases,
        "message": (
            f"Focus on {len(roadmaps)} priority "
            f"skill gap(s) to improve your readiness "
            f"for the {target_role} role."
        )
    }


# =========================================================
# PRIORITY
# =========================================================

def priority_rank(
    priority: str
) -> int:

    ranks = {
        "High": 1,
        "Medium": 2,
        "Low": 3
    }

    return ranks.get(
        priority,
        2
    )


# =========================================================
# READINESS
# =========================================================

def calculate_readiness(
    gap_count: int
) -> str:

    if gap_count <= 2:
        return "High"

    if gap_count <= 5:
        return "Moderate"

    if gap_count <= 8:
        return "Needs Improvement"

    return "Early Stage"


# =========================================================
# PHASE BUILDER
# =========================================================

def build_phases(
    roadmaps: list[dict]
) -> list[dict]:

    phases = []

    current_week = 1

    for index, roadmap in enumerate(
        roadmaps
    ):

        start_week = current_week

        end_week = (
            current_week
            + roadmap["weeks"]
            - 1
        )


        phases.append({

            "phase": index + 1,

            "title": (
                f"Master {roadmap['skill']}"
            ),

            "weeks": (
                f"Week {start_week}"
                if start_week == end_week
                else
                f"Weeks {start_week}-{end_week}"
            ),

            "skill": roadmap["skill"],

            "priority": roadmap["priority"],

            "topics": roadmap["topics"],

            "project": roadmap["project"]

        })


        current_week = (
            end_week + 1
        )


    return phases


# =========================================================
# 30 / 60 / 90 DAY PLAN
# =========================================================

def generate_90_day_plan(
    missing_skills: list[str],
    target_role: str
) -> dict:

    roadmap = generate_learning_roadmap(
        missing_skills,
        target_role
    )


    skill_gaps = roadmap[
        "skill_gaps"
    ]


    first_30 = skill_gaps[:3]

    second_30 = skill_gaps[3:6]

    final_30 = skill_gaps[6:8]


    return {

        "target_role": target_role,

        "day_0_30": {

            "title": "Foundation",

            "skills": [
                item["skill"]
                for item in first_30
            ],

            "goal": (
                "Build strong fundamentals "
                "for the highest-priority skill gaps."
            )

        },

        "day_31_60": {

            "title": "Application",

            "skills": [
                item["skill"]
                for item in second_30
            ],

            "goal": (
                "Apply new skills through "
                "practical projects and problem solving."
            )

        },

        "day_61_90": {

            "title": "Job Readiness",

            "skills": [
                item["skill"]
                for item in final_30
            ],

            "goal": (
                "Build portfolio evidence, "
                "practice interviews and prepare to apply."
            )

        }

    }


# =========================================================
# COMPLETE ROADMAP
# =========================================================

def create_career_roadmap(
    missing_skills: list[str],
    target_role: str = "Technology Role"
) -> dict:

    roadmap = generate_learning_roadmap(
        missing_skills,
        target_role
    )


    ninety_day_plan = generate_90_day_plan(
        missing_skills,
        target_role
    )


    return {
        **roadmap,
        "ninety_day_plan": ninety_day_plan
    }

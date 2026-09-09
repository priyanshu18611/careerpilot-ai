-- CareerPilot AI Database
-- PostgreSQL Schema

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE resumes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_resume_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


CREATE TABLE resume_analysis (
    id SERIAL PRIMARY KEY,
    resume_id INTEGER NOT NULL,

    ats_score INTEGER
        CHECK (ats_score >= 0 AND ats_score <= 100),

    keyword_score INTEGER
        CHECK (keyword_score >= 0 AND keyword_score <= 100),

    skills_score INTEGER
        CHECK (skills_score >= 0 AND skills_score <= 100),

    experience_score INTEGER
        CHECK (experience_score >= 0 AND experience_score <= 100),

    suggestions TEXT,

    analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_analysis_resume
        FOREIGN KEY (resume_id)
        REFERENCES resumes(id)
        ON DELETE CASCADE
);


CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    skill_name VARCHAR(100) UNIQUE NOT NULL
);


CREATE TABLE user_skills (
    user_id INTEGER NOT NULL,
    skill_id INTEGER NOT NULL,

    PRIMARY KEY (user_id, skill_id),

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (skill_id)
        REFERENCES skills(id)
        ON DELETE CASCADE
);


CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,

    company_name VARCHAR(150) NOT NULL,
    job_title VARCHAR(200) NOT NULL,
    location VARCHAR(150),
    job_type VARCHAR(50),

    description TEXT,

    required_skills TEXT,

    salary_min NUMERIC(12,2),
    salary_max NUMERIC(12,2),

    application_url TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE job_matches (
    id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL,
    job_id INTEGER NOT NULL,

    match_score INTEGER
        CHECK (match_score >= 0 AND match_score <= 100),

    matched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (job_id)
        REFERENCES jobs(id)
        ON DELETE CASCADE
);


CREATE TABLE interviews (
    id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL,

    interview_type VARCHAR(50),
    difficulty VARCHAR(50),

    score INTEGER
        CHECK (score >= 0 AND score <= 100),

    feedback TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


CREATE TABLE subscriptions (
    id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL,

    plan_name VARCHAR(50) NOT NULL,

    status VARCHAR(50) DEFAULT 'active',

    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

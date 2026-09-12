document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       API CONFIG
    ===================================================== */

    const API_BASE_URL =
        window.CAREERPILOT_CONFIG?.API_BASE_URL ||
        "http://127.0.0.1:8000";


    /* =====================================================
       DOM ELEMENTS
    ===================================================== */

    const resumeInput =
        document.getElementById("resumeInput");

    const uploadButton =
        document.querySelector(".upload-btn");

    const jobDescription =
        document.getElementById("jobDescription");

    const analysisResult =
        document.getElementById("analysisResult");

    const resultScore =
        document.getElementById("resultScore");

    const keywordScore =
        document.getElementById("keywordScore");

    const lengthScore =
        document.getElementById("lengthScore");

    const sectionScore =
        document.getElementById("sectionScore");

    const skillDiversityScore =
        document.getElementById("skillDiversityScore");

    const achievementScore =
        document.getElementById("achievementScore");

    const matchedSkills =
        document.getElementById("matchedSkills");

    const missingSkills =
        document.getElementById("missingSkills");

    const priorityKeywords =
        document.getElementById("priorityKeywords");

    const suggestionsList =
        document.getElementById("suggestionsList");


    /* =====================================================
       MOBILE NAVIGATION
    ===================================================== */

    const mobileMenuBtn =
        document.getElementById("mobileMenuBtn");

    const navLinks =
        document.getElementById("navLinks");


    if (mobileMenuBtn && navLinks) {

        mobileMenuBtn.addEventListener(
            "click",
            () => {

                const isOpen =
                    navLinks.classList.toggle(
                        "mobile-open"
                    );

                mobileMenuBtn.setAttribute(
                    "aria-expanded",
                    String(isOpen)
                );

            }
        );


        const menuItems =
            navLinks.querySelectorAll("a");


        menuItems.forEach(
            (item) => {

                item.addEventListener(
                    "click",
                    () => {

                        navLinks.classList.remove(
                            "mobile-open"
                        );

                        mobileMenuBtn.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                    }
                );

            }
        );


        window.addEventListener(
            "resize",
            () => {

                if (
                    window.innerWidth >= 900
                ) {

                    navLinks.classList.remove(
                        "mobile-open"
                    );

                    mobileMenuBtn.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }

            }
        );

    }


    /* =====================================================
       HELPER — SCROLL TO SECTION
    ===================================================== */

    function scrollToSection(id) {

        const section =
            document.getElementById(id);


        if (!section) {
            return;
        }


        section.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }


    /* =====================================================
       ANALYZE RESUME BUTTONS
    ===================================================== */

    const analyzeButtons =
        document.querySelectorAll(
            ".hero .primary-btn, .final-cta .primary-btn"
        );


    analyzeButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    scrollToSection(
                        "analyzer"
                    );

                }
            );

        }
    );


    /* =====================================================
       EXPLORE FEATURES
    ===================================================== */

    const secondaryButton =
        document.querySelector(
            ".secondary-btn"
        );


    if (secondaryButton) {

        secondaryButton.addEventListener(
            "click",
            () => {

                scrollToSection(
                    "features"
                );

            }
        );

    }


    /* =====================================================
       NAV GET STARTED
    ===================================================== */

    const navButton =
        document.querySelector(
            ".nav-btn"
        );


    if (navButton) {

        navButton.addEventListener(
            "click",
            () => {

                scrollToSection(
                    "analyzer"
                );


                if (navLinks) {

                    navLinks.classList.remove(
                        "mobile-open"
                    );

                }


                if (mobileMenuBtn) {

                    mobileMenuBtn.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }

            }
        );

    }
/* =====================================================
   JOB MATCH ENGINE
===================================================== */

const jobMatchRole =
    document.getElementById("jobMatchRole");

const jobMatchScore =
    document.getElementById("jobMatchScore");

const jobMatchLevel =
    document.getElementById("jobMatchLevel");

const jobSkillMatch =
    document.getElementById("jobSkillMatch");

const jobKeywordMatch =
    document.getElementById("jobKeywordMatch");

const jobRoleFit =
    document.getElementById("jobRoleFit");

const jobMatchedSkills =
    document.getElementById("jobMatchedSkills");

const jobMissingSkills =
    document.getElementById("jobMissingSkills");

const jobPrioritySkills =
    document.getElementById("jobPrioritySkills");

const jobRecommendations =
    document.getElementById("jobRecommendations");


/* =====================================================
   JOB MATCH BUTTON
===================================================== */

const jobMatchSection =
    document.getElementById("job-match");
    
const runJobMatchBtn =
    document.getElementById("runJobMatchBtn");


if (runJobMatchBtn) {

    runJobMatchBtn.addEventListener(
        "click",
        async () => {

            if (
                !resumeInput ||
                !resumeInput.files.length
            ) {

                alert(
                    "Please choose your resume first."
                );

                return;
            }


            const file =
                resumeInput.files[0];


            runJobMatchBtn.disabled =
                true;


            runJobMatchBtn.innerHTML =
                "⏳ Matching Job...";


            await runJobMatch(
                file
            );


            runJobMatchBtn.disabled =
                false;


            runJobMatchBtn.innerHTML =
                "<span>✦</span> Run Job Match";

        }
    );

}

function showJobMatch() {

    if (!jobMatchSection) {
        return;
    }

    jobMatchSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


/* =====================================================
   RENDER JOB MATCH SKILLS
===================================================== */

function renderJobMatchSkills(
    container,
    skills,
    emptyMessage
) {

    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (!skills || !skills.length) {

        const empty =
            document.createElement("span");

        empty.className =
            "skill-empty";

        empty.textContent =
            emptyMessage;

        container.appendChild(
            empty
        );

        return;
    }


    skills.forEach(
        (skill) => {

            const badge =
                document.createElement("span");

            badge.className =
                "skill-badge";

            badge.textContent =
                skill;

            container.appendChild(
                badge
            );

        }
    );

}


/* =====================================================
   RENDER JOB RECOMMENDATIONS
===================================================== */

function renderJobRecommendations(
    recommendations
) {

    if (!jobRecommendations) {
        return;
    }


    jobRecommendations.innerHTML =
        "";


    if (
        !recommendations ||
        !recommendations.length
    ) {

        const item =
            document.createElement("li");

        item.textContent =
            "No additional recommendations available.";

        jobRecommendations.appendChild(
            item
        );

        return;
    }


    recommendations.forEach(
        (recommendation) => {

            const item =
                document.createElement("li");

            item.textContent =
                recommendation;

            jobRecommendations.appendChild(
                item
            );

        }
    );

}


/* =====================================================
   DISPLAY JOB MATCH
===================================================== */

function displayJobMatch(
    analysis
) {

    if (!analysis) {
        return;
    }


    if (jobMatchRole) {

        const roleName =
    analysis.target_role ||
    "Technology Role";

jobMatchRole.textContent =
    roleName.replace(
        /\b\w/g,
        (letter) => letter.toUpperCase()
    );

    }


    if (jobMatchScore) {

        jobMatchScore.textContent =
            analysis.match_score ?? "--";

    }
const score =
    Number(analysis.match_score) || 0;

const scoreRing =
    document.querySelector(".match-score-ring");

if (scoreRing) {

    const degrees =
        Math.min(Math.max(score, 0), 100) * 3.6;

    scoreRing.style.background =
        `conic-gradient(
            #ff6a00 0deg,
            #ff9a3d ${degrees}deg,
            rgba(255,255,255,.08) ${degrees}deg,
            rgba(255,255,255,.08) 360deg
        )`;

}

    if (jobMatchLevel) {

        jobMatchLevel.textContent =
            analysis.match_level ||
            "Match calculated";

    }


    if (jobSkillMatch) {

        jobSkillMatch.textContent =
            `${analysis.skill_match_score ?? 0}/100`;

    }


    if (jobKeywordMatch) {

        jobKeywordMatch.textContent =
            `${analysis.keyword_overlap_score ?? 0}/100`;

    }


    if (jobRoleFit) {

        jobRoleFit.textContent =
            `${analysis.role_fit_score ?? 0}/100`;

    }


    renderJobMatchSkills(
        jobMatchedSkills,
        analysis.matched_skills || [],
        "No matching skills found."
    );


    renderJobMatchSkills(
        jobMissingSkills,
        analysis.missing_skills || [],
        "No major skill gaps detected."
    );


    renderJobMatchSkills(
        jobPrioritySkills,
        analysis.priority_skills || [],
        "No priority skills detected."
    );


    renderJobRecommendations(
        analysis.recommendations || []
    );


    showJobMatch();

}


/* =====================================================
   RUN JOB MATCH
===================================================== */

async function runJobMatch(
    file
) {

    if (!file) {
        return;
    }


    if (
        !jobDescription ||
        !jobDescription.value.trim()
    ) {

        alert(
            "Please enter a target job description before running Job Match."
        );

        return;
    }


    try {

        const formData =
            new FormData();


        formData.append(
            "file",
            file
        );


        formData.append(
            "job_description",
            jobDescription.value.trim()
        );


        const response =
            await fetch(
                `${API_BASE_URL}/api/job-match`,
                {
                    method: "POST",
                    body: formData
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.detail ||
                "Job matching failed."
            );

        }


        displayJobMatch(
            data
        );


    } catch (error) {

        console.error(
            "CareerPilot AI Job Match Error:",
            error
        );


        alert(
            "Unable to run Job Match right now. Please try again."
        );

    }

}

    /* =====================================================
       RESUME UPLOAD
    ===================================================== */

    if (
        uploadButton &&
        resumeInput
    ) {


        uploadButton.addEventListener(
            "click",
            () => {

                resumeInput.click();

            }
        );


        resumeInput.addEventListener(
            "change",
            async () => {

                if (
                    !resumeInput.files.length
                ) {
                    return;
                }


                const file =
                    resumeInput.files[0];


                const allowedTypes = [

                    "application/pdf",

                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

                ];


                const maxSize =
                    10 * 1024 * 1024;


                if (
                    !allowedTypes.includes(
                        file.type
                    )
                ) {

                    alert(
                        "Please upload a PDF or DOCX file."
                    );


                    resumeInput.value =
                        "";

                    return;

                }


                if (
                    file.size > maxSize
                ) {

                    alert(
                        "File size must be less than 10 MB."
                    );


                    resumeInput.value =
                        "";

                    return;

                }


                await analyzeResume(
                    file
                );

            }
        );

    }


    /* =====================================================
       ANALYZE RESUME
    ===================================================== */

    async function analyzeResume(
        file
    ) {

        if (!uploadButton) {
            return;
        }


        uploadButton.disabled =
            true;


        uploadButton.innerHTML =
            "⏳ Analyzing Resume...";


        if (analysisResult) {

            analysisResult.hidden =
                true;

        }


        try {

            const formData =
                new FormData();


            formData.append(
                "file",
                file
            );


            formData.append(
                "job_description",
                jobDescription
                    ? jobDescription.value.trim()
                    : ""
            );


            const response =
                await fetch(
                    `${API_BASE_URL}/api/analyze-resume`,
                    {
                        method: "POST",
                        body: formData
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.detail ||
                    "Resume analysis failed."
                );

            }


            displayAnalysis(
                data.analysis
            );


            uploadButton.innerHTML =
                "✓ Analysis Complete";


            uploadButton.style.background =
                "linear-gradient(135deg, #10b981, #06b6d4)";


        } catch (error) {

            console.error(
                "CareerPilot AI Error:",
                error
            );


            alert(
                "Unable to connect with CareerPilot AI backend.\n\n" +
                "Please try again in a moment."
            );


            uploadButton.innerHTML =
                "Choose Resume";


            uploadButton.style.background =
                "";

        } finally {

            uploadButton.disabled =
                false;

        }

    }


    /* =====================================================
       DISPLAY ANALYSIS
    ===================================================== */

    function displayAnalysis(
        analysis
    ) {

        if (!analysis) {
            return;
        }


        if (resultScore) {

            resultScore.textContent =
                analysis.ats_score ?? "--";

        }


        if (keywordScore) {

            keywordScore.textContent =
                `${analysis.keyword_score ?? 0}/100`;

        }


        if (lengthScore) {

            lengthScore.textContent =
                `${analysis.length_score ?? 0}/100`;

        }


        if (sectionScore) {

            sectionScore.textContent =
                `${analysis.section_score ?? 0}/100`;

        }


        if (skillDiversityScore) {

            skillDiversityScore.textContent =
                `${analysis.skill_diversity_score ?? 0}/100`;

        }


        if (achievementScore) {

            achievementScore.textContent =
                `${analysis.achievement_score ?? 0}/100`;

        }


        renderSkills(
            matchedSkills,
            analysis.matched_skills || [],
            "No matching skills found."
        );


        renderSkills(
            missingSkills,
            analysis.missing_skills || [],
            "No major missing skills detected."
        );


        renderSkills(
            priorityKeywords,
            analysis.priority_keywords || [],
            "No priority keywords detected."
        );


        renderSuggestions(
            analysis.suggestions || []
        );


        if (analysisResult) {

            analysisResult.hidden =
                false;


            setTimeout(
                () => {

                    analysisResult.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                },
                100
            );

        }

    }


    /* =====================================================
       RENDER SKILLS
    ===================================================== */

    function renderSkills(
        container,
        skills,
        emptyMessage
    ) {

        if (!container) {
            return;
        }


        container.innerHTML =
            "";


        if (!skills.length) {

            const empty =
                document.createElement(
                    "span"
                );


            empty.textContent =
                emptyMessage;


            empty.className =
                "skill-empty";


            container.appendChild(
                empty
            );


            return;

        }


        skills.forEach(
            (skill) => {

                const badge =
                    document.createElement(
                        "span"
                    );


                badge.textContent =
                    skill;


                badge.className =
                    "skill-badge";


                container.appendChild(
                    badge
                );

            }
        );

    }


    /* =====================================================
       RENDER SUGGESTIONS
    ===================================================== */

    function renderSuggestions(
        suggestions
    ) {

        if (!suggestionsList) {
            return;
        }


        suggestionsList.innerHTML =
            "";


        if (!suggestions.length) {

            const item =
                document.createElement(
                    "li"
                );


            item.textContent =
                "Your resume looks good. Keep improving measurable achievements.";


            suggestionsList.appendChild(
                item
            );


            return;

        }


        suggestions.forEach(
            (suggestion) => {

                const item =
                    document.createElement(
                        "li"
                    );


                item.textContent =
                    suggestion;


                suggestionsList.appendChild(
                    item
                );

            }
        );

    }


    /* =====================================================
       CLOSE MOBILE MENU ON ESC
    ===================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape"
            ) {

                if (navLinks) {

                    navLinks.classList.remove(
                        "mobile-open"
                    );

                }


                if (mobileMenuBtn) {

                    mobileMenuBtn.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }

            }

        }
    );

    /* =====================================================
       CAREERPILOT AI — CAREER ROADMAP ENGINE
    ===================================================== */

    const generateRoadmapBtn =
        document.getElementById(
            "generateRoadmapBtn"
        );

    const roadmapResult =
        document.getElementById(
            "roadmapResult"
        );

    const roadmapTargetRole =
        document.getElementById(
            "roadmapTargetRole"
        );

    const roadmapReadiness =
        document.getElementById(
            "roadmapReadiness"
        );

    const roadmapMessage =
        document.getElementById(
            "roadmapMessage"
        );

    const roadmapSkillGapCount =
        document.getElementById(
            "roadmapSkillGapCount"
        );

    const roadmapTotalWeeks =
        document.getElementById(
            "roadmapTotalWeeks"
        );

    const roadmap30Title =
        document.getElementById(
            "roadmap30Title"
        );

    const roadmap30Goal =
        document.getElementById(
            "roadmap30Goal"
        );

    const roadmap30Skills =
        document.getElementById(
            "roadmap30Skills"
        );

    const roadmap60Title =
        document.getElementById(
            "roadmap60Title"
        );

    const roadmap60Goal =
        document.getElementById(
            "roadmap60Goal"
        );

    const roadmap60Skills =
        document.getElementById(
            "roadmap60Skills"
        );

    const roadmap90Title =
        document.getElementById(
            "roadmap90Title"
        );

    const roadmap90Goal =
        document.getElementById(
            "roadmap90Goal"
        );

    const roadmap90Skills =
        document.getElementById(
            "roadmap90Skills"
        );

    const roadmapSkillGaps =
        document.getElementById(
            "roadmapSkillGaps"
        );

    const roadmapPhases =
        document.getElementById(
            "roadmapPhases"
        );


    /* =====================================================
       ROADMAP SKILL BADGES
    ===================================================== */

    function renderRoadmapSkills(
        container,
        skills
    ) {

        if (!container) {
            return;
        }

        container.innerHTML = "";

        if (
            !skills ||
            !skills.length
        ) {

            const badge =
                document.createElement(
                    "span"
                );

            badge.textContent =
                "No specific skills";

            container.appendChild(
                badge
            );

            return;
        }

        skills.forEach(
            (skill) => {

                const badge =
                    document.createElement(
                        "span"
                    );

                badge.textContent =
                    skill;

                container.appendChild(
                    badge
                );

            }
        );

    }


    /* =====================================================
       ROADMAP SKILL GAP CARDS
    ===================================================== */

    function renderRoadmapSkillGaps(
        gaps
    ) {

        if (!roadmapSkillGaps) {
            return;
        }

        roadmapSkillGaps.innerHTML = "";

        if (
            !gaps ||
            !gaps.length
        ) {

            roadmapSkillGaps.innerHTML = `
                <div class="roadmap-empty-state">
                    <span>✓</span>
                    <p>
                        No major skill gaps detected.
                        Keep strengthening your existing skills.
                    </p>
                </div>
            `;

            return;
        }


        gaps.forEach(
            (gap) => {

                const card =
                    document.createElement(
                        "div"
                    );

                card.className =
                    "roadmap-skill-card";

                const topics =
                    Array.isArray(
                        gap.topics
                    )
                        ? gap.topics
                        : [];

                card.innerHTML = `
                    <div class="roadmap-skill-card-top">

                        <h5>
                            ${escapeRoadmapHTML(
                                gap.skill ||
                                "Skill"
                            )}
                        </h5>

                        <span class="roadmap-priority">
                            ${escapeRoadmapHTML(
                                gap.priority ||
                                "Medium"
                            )}
                        </span>

                    </div>

                    <div class="roadmap-skill-weeks">
                        ${Number(
                            gap.weeks || 0
                        )} week(s)
                    </div>

                    <ul class="roadmap-skill-topics">

                        ${topics.map(
                            (topic) => `
                                <li>
                                    ${escapeRoadmapHTML(
                                        topic
                                    )}
                                </li>
                            `
                        ).join("")}

                    </ul>

                    <div class="roadmap-project">

                        <strong>
                            Project:
                        </strong>

                        ${escapeRoadmapHTML(
                            gap.project ||
                            "Build a practical project."
                        )}

                    </div>
                `;

                roadmapSkillGaps.appendChild(
                    card
                );

            }
        );

    }


    /* =====================================================
       ROADMAP PHASES
    ===================================================== */

    function renderRoadmapPhases(
        phases
    ) {

        if (!roadmapPhases) {
            return;
        }

        roadmapPhases.innerHTML = "";

        if (
            !phases ||
            !phases.length
        ) {

            roadmapPhases.innerHTML = `
                <div class="roadmap-empty-state">
                    <span>✦</span>
                    <p>
                        No learning phases available.
                    </p>
                </div>
            `;

            return;
        }


        phases.forEach(
            (phase, index) => {

                const card =
                    document.createElement(
                        "div"
                    );

                card.className =
                    "roadmap-phase-card";

                const topics =
                    Array.isArray(
                        phase.topics
                    )
                        ? phase.topics
                        : [];

                card.innerHTML = `

                    <div class="roadmap-phase-number">
                        PHASE ${String(
                            phase.phase ||
                            index + 1
                        ).padStart(2, "0")}
                    </div>

                    <div>

                        <h5>
                            ${escapeRoadmapHTML(
                                phase.title ||
                                "Learning Phase"
                            )}
                        </h5>

                        <p>
                            ${
                                topics
                                    .slice(0, 3)
                                    .map(
                                        escapeRoadmapHTML
                                    )
                                    .join(" • ")
                            }
                        </p>

                    </div>

                    <div class="roadmap-phase-weeks">
                        ${escapeRoadmapHTML(
                            phase.weeks ||
                            "Ongoing"
                        )}
                    </div>

                `;

                roadmapPhases.appendChild(
                    card
                );

            }
        );

    }


    /* =====================================================
       SAFE HTML TEXT
    ===================================================== */

    function escapeRoadmapHTML(
        value
    ) {

        const text =
            String(
                value ?? ""
            );

        return text
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );

    }


    /* =====================================================
       DISPLAY ROADMAP
    ===================================================== */

    function displayCareerRoadmap(
        response
    ) {

        if (!response) {
            return;
        }

        const roadmap =
            response.roadmap ||
            response;

        const ninety =
            roadmap.ninety_day_plan ||
            {};

        const day30 =
            ninety.day_0_30 ||
            {};

        const day60 =
            ninety.day_31_60 ||
            {};

        const day90 =
            ninety.day_61_90 ||
            {};

        const gaps =
            roadmap.skill_gaps ||
            [];

        const phases =
            roadmap.phases ||
            [];


        if (roadmapTargetRole) {

            roadmapTargetRole.textContent =
                roadmap.target_role ||
                "Technology Role";

        }


        if (roadmapReadiness) {

            roadmapReadiness.textContent =
                roadmap.readiness ||
                "--";

        }


        if (roadmapMessage) {

            roadmapMessage.textContent =
                roadmap.message ||
                "Your personalized career roadmap is ready.";

        }


        if (roadmapSkillGapCount) {

            roadmapSkillGapCount.textContent =
                gaps.length;

        }


        if (roadmapTotalWeeks) {

            roadmapTotalWeeks.textContent =
                roadmap.total_weeks ??
                0;

        }


        if (roadmap30Title) {

            roadmap30Title.textContent =
                day30.title ||
                "Foundation";

        }


        if (roadmap30Goal) {

            roadmap30Goal.textContent =
                day30.goal ||
                "Build strong fundamentals.";

        }


        if (roadmap60Title) {

            roadmap60Title.textContent =
                day60.title ||
                "Application";

        }


        if (roadmap60Goal) {

            roadmap60Goal.textContent =
                day60.goal ||
                "Apply skills through projects.";

        }


        if (roadmap90Title) {

            roadmap90Title.textContent =
                day90.title ||
                "Job Readiness";

        }


        if (roadmap90Goal) {

            roadmap90Goal.textContent =
                day90.goal ||
                "Prepare for interviews.";

        }


        renderRoadmapSkills(
            roadmap30Skills,
            day30.skills || []
        );

        renderRoadmapSkills(
            roadmap60Skills,
            day60.skills || []
        );

        renderRoadmapSkills(
            roadmap90Skills,
            day90.skills || []
        );

        renderRoadmapSkillGaps(
            gaps
        );

        renderRoadmapPhases(
            phases
        );


        if (roadmapResult) {

            roadmapResult.hidden =
                false;

            setTimeout(
                () => {

                    roadmapResult.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                },
                100
            );

        }

    }


    /* =====================================================
       SAMPLE ROADMAP
       ===================================================== */

    const sampleCareerRoadmap = {

        target_role:
            "Software Engineer",

        readiness:
            "Moderate",

        total_weeks:
            7,

        message:
            "Demo roadmap: focus on high-priority skills to improve Software Engineer readiness.",

        skill_gaps: [

            {
                skill: "Docker",
                priority: "High",
                weeks: 2,
                topics: [
                    "Containers and images",
                    "Dockerfile",
                    "Docker Compose",
                    "Environment configuration"
                ],
                project:
                    "Containerize a full-stack application."
            },

            {
                skill: "AWS",
                priority: "High",
                weeks: 3,
                topics: [
                    "AWS fundamentals",
                    "IAM",
                    "EC2",
                    "S3 and deployment"
                ],
                project:
                    "Deploy a web application on AWS."
            },

            {
                skill: "Data Structures",
                priority: "High",
                weeks: 2,
                topics: [
                    "Arrays and strings",
                    "Linked lists",
                    "Stacks and queues",
                    "Trees and hash tables"
                ],
                project:
                    "Solve an interview-focused DSA problem set."
            }

        ],

        phases: [

            {
                phase: 1,
                title:
                    "Master Docker",
                weeks:
                    "Weeks 1-2",
                topics: [
                    "Containers",
                    "Dockerfile",
                    "Docker Compose"
                ]
            },

            {
                phase: 2,
                title:
                    "Master AWS",
                weeks:
                    "Weeks 3-5",
                topics: [
                    "IAM",
                    "EC2",
                    "S3"
                ]
            },

            {
                phase: 3,
                title:
                    "Strengthen DSA",
                weeks:
                    "Weeks 6-7",
                topics: [
                    "Arrays",
                    "Trees",
                    "Algorithms"
                ]
            }

        ],

        ninety_day_plan: {

            day_0_30: {

                title:
                    "Foundation",

                skills: [
                    "Docker",
                    "AWS"
                ],

                goal:
                    "Build strong fundamentals for the highest-priority skill gaps."

            },

            day_31_60: {

                title:
                    "Application",

                skills: [
                    "Data Structures"
                ],

                goal:
                    "Apply new skills through practical projects and problem solving."

            },

            day_61_90: {

                title:
                    "Job Readiness",

                skills: [
                    "Docker",
                    "AWS",
                    "Data Structures"
                ],

                goal:
                    "Build portfolio evidence, practice interviews and prepare to apply."

            }

        }

    };


    /* =====================================================
       SHOW SAMPLE ON LOAD
    ===================================================== */

    displayCareerRoadmap(
        sampleCareerRoadmap
    );


    /* =====================================================
       GENERATE REAL CAREER ROADMAP
    ===================================================== */

    if (generateRoadmapBtn) {

        generateRoadmapBtn.addEventListener(
            "click",
            async () => {

                if (
                    !resumeInput ||
                    !resumeInput.files.length
                ) {

                    alert(
                        "Please choose your resume first."
                    );

                    return;

                }


                if (
                    !jobDescription ||
                    !jobDescription.value.trim()
                ) {

                    alert(
                        "Please enter a target job description first."
                    );

                    return;

                }


                const file =
                    resumeInput.files[0];


                generateRoadmapBtn.disabled =
                    true;

                generateRoadmapBtn.innerHTML =
                    "⏳ Building Roadmap...";


                try {

                    const formData =
                        new FormData();

                    formData.append(
                        "file",
                        file
                    );

                    formData.append(
                        "job_description",
                        jobDescription.value.trim()
                    );


                    const response =
                        await fetch(
                            `${API_BASE_URL}/api/career-roadmap`,
                            {
                                method: "POST",
                                body: formData
                            }
                        );


                    const data =
                        await response.json();


                    if (!response.ok) {

                        throw new Error(
                            data.detail ||
                            "Career roadmap generation failed."
                        );

                    }


                    displayCareerRoadmap(
                        data
                    );


                    generateRoadmapBtn.innerHTML =
                        "✓ Roadmap Generated";


                } catch (error) {

                    console.error(
                        "CareerPilot AI Roadmap Error:",
                        error
                    );


                    alert(
                        "Unable to generate the career roadmap right now. Please try again."
                    );


                    generateRoadmapBtn.innerHTML =
                        "<span>✦</span> Generate Career Roadmap";

                } finally {

                    generateRoadmapBtn.disabled =
                        false;

                }

            }
        );

    }
   /* =========================================================
   CAREERPILOT AI — RESUME BUILDER V2
   ========================================================= */

const cpResumeBuilder = {

    fields: {
        name: document.getElementById("builderName"),
        title: document.getElementById("builderTitle"),
        email: document.getElementById("builderEmail"),
        phone: document.getElementById("builderPhone"),
        location: document.getElementById("builderLocation"),

        github: document.getElementById("builderGithub"),
        linkedin: document.getElementById("builderLinkedin"),
        portfolio: document.getElementById("builderPortfolio"),

        summary: document.getElementById("builderSummary"),
        skills: document.getElementById("builderSkills"),

        degree: document.getElementById("builderDegree"),
        college: document.getElementById("builderCollege"),
        educationYear:
            document.getElementById("builderEducationYear"),

        experienceRole:
            document.getElementById("builderExperienceRole"),
        experienceCompany:
            document.getElementById("builderExperienceCompany"),
        experienceDuration:
            document.getElementById("builderExperienceDuration"),
        experienceDescription:
            document.getElementById(
                "builderExperienceDescription"
            ),

        projectName:
            document.getElementById("builderProjectName"),
        projectTech:
            document.getElementById("builderProjectTech"),
        projectDescription:
            document.getElementById(
                "builderProjectDescription"
            ),
        projectLink:
            document.getElementById("builderProjectLink"),

        certification:
            document.getElementById("builderCertification"),
        certificationIssuer:
            document.getElementById(
                "builderCertificationIssuer"
            )
    },

    preview:
        document.getElementById("resumeBuilderPreview"),

    sampleButton:
        document.getElementById("loadSampleResumeBtn"),

    buildButton:
        document.getElementById("buildResumeBtn"),

    value(field) {
        return field && field.value
            ? field.value.trim()
            : "";
    },

    esc(value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    },

    data() {

        const f = this.fields;

        return {
            name: this.value(f.name),
            title: this.value(f.title),
            email: this.value(f.email),
            phone: this.value(f.phone),
            location: this.value(f.location),

            github: this.value(f.github),
            linkedin: this.value(f.linkedin),
            portfolio: this.value(f.portfolio),

            summary: this.value(f.summary),
            skills: this.value(f.skills),

            degree: this.value(f.degree),
            college: this.value(f.college),
            educationYear:
                this.value(f.educationYear),

            experienceRole:
                this.value(f.experienceRole),
            experienceCompany:
                this.value(f.experienceCompany),
            experienceDuration:
                this.value(f.experienceDuration),
            experienceDescription:
                this.value(f.experienceDescription),

            projectName:
                this.value(f.projectName),
            projectTech:
                this.value(f.projectTech),
            projectDescription:
                this.value(f.projectDescription),
            projectLink:
                this.value(f.projectLink),

            certification:
                this.value(f.certification),
            certificationIssuer:
                this.value(f.certificationIssuer)
        };
    },

    section(title, content) {

        if (!content) {
            return "";
        }

        return `
            <section class="generated-resume-section">

                <h2 class="generated-resume-section-title">
                    ${title}
                </h2>

                ${content}

            </section>
        `;
    },

    skills(value) {

        if (!value) {
            return "";
        }

        return `
            <div class="generated-resume-skills">

                ${value
                    .split(",")
                    .map(skill => skill.trim())
                    .filter(Boolean)
                    .map(skill => `
                        <span class="generated-resume-skill">
                            ${this.esc(skill)}
                        </span>
                    `)
                    .join("")}

            </div>
        `;
    },

    contact(data) {

        const items = [];

        if (data.email) {
            items.push(
                `<span>${this.esc(data.email)}</span>`
            );
        }

        if (data.phone) {
            items.push(
                `<span>${this.esc(data.phone)}</span>`
            );
        }

        if (data.location) {
            items.push(
                `<span>${this.esc(data.location)}</span>`
            );
        }

        if (data.github) {
            items.push(
                `<a href="${this.esc(data.github)}"
                    target="_blank"
                    rel="noopener">
                    GitHub
                </a>`
            );
        }

        if (data.linkedin) {
            items.push(
                `<a href="${this.esc(data.linkedin)}"
                    target="_blank"
                    rel="noopener">
                    LinkedIn
                </a>`
            );
        }

        if (data.portfolio) {
            items.push(
                `<a href="${this.esc(data.portfolio)}"
                    target="_blank"
                    rel="noopener">
                    Portfolio
                </a>`
            );
        }

        return items.join(" • ");
    },

    build() {

        const data = this.data();

        if (!data.name) {
            alert("Please enter your Full Name first.");
            this.fields.name?.focus();
            return;
        }

        let html = `
            <div class="generated-resume">

                <div class="generated-resume-header">

                    <h1 class="generated-resume-name">
                        ${this.esc(data.name)}
                    </h1>

                    ${
                        data.title
                            ? `
                                <div class="generated-resume-title">
                                    ${this.esc(data.title)}
                                </div>
                            `
                            : ""
                    }

                    ${
                        this.contact(data)
                            ? `
                                <div class="generated-resume-contact">
                                    ${this.contact(data)}
                                </div>
                            `
                            : ""
                    }

                </div>
        `;


        /* SUMMARY */

        if (data.summary) {

            html += this.section(
                "Professional Summary",
                `
                    <p>
                        ${this.esc(data.summary)
                            .replace(/\n/g, "<br>")}
                    </p>
                `
            );
        }


        /* SKILLS */

        if (data.skills) {

            html += this.section(
                "Technical Skills",
                this.skills(data.skills)
            );
        }


        /* EXPERIENCE */

        if (
            data.experienceRole ||
            data.experienceCompany ||
            data.experienceDescription
        ) {

            html += this.section(
                "Experience",
                `
                    <div class="generated-resume-item">

                        <div class="generated-resume-item-heading">

                            <strong>
                                ${this.esc(
                                    data.experienceRole
                                )}
                            </strong>

                            <span>
                                ${this.esc(
                                    data.experienceDuration
                                )}
                            </span>

                        </div>

                        <div class="generated-resume-item-subtitle">
                            ${this.esc(
                                data.experienceCompany
                            )}
                        </div>

                        <p>
                            ${this.esc(
                                data.experienceDescription
                            ).replace(/\n/g, "<br>")}
                        </p>

                    </div>
                `
            );
        }


        /* PROJECT */

        if (
            data.projectName ||
            data.projectDescription
        ) {

            html += this.section(
                "Projects",
                `
                    <div class="generated-resume-item">

                        <div class="generated-resume-item-heading">

                            <strong>
                                ${this.esc(
                                    data.projectName
                                )}
                            </strong>

                        </div>

                        ${
                            data.projectTech
                                ? `
                                    <div class="generated-resume-item-subtitle">
                                        ${this.esc(
                                            data.projectTech
                                        )}
                                    </div>
                                `
                                : ""
                        }

                        <p>
                            ${this.esc(
                                data.projectDescription
                            ).replace(/\n/g, "<br>")}
                        </p>

                        ${
                            data.projectLink
                                ? `
                                    <a
                                        class="generated-resume-link"
                                        href="${this.esc(
                                            data.projectLink
                                        )}"
                                        target="_blank"
                                        rel="noopener"
                                    >
                                        View Project →
                                    </a>
                                `
                                : ""
                        }

                    </div>
                `
            );
        }


        /* EDUCATION */

        if (
            data.degree ||
            data.college ||
            data.educationYear
        ) {

            html += this.section(
                "Education",
                `
                    <div class="generated-resume-item">

                        <div class="generated-resume-item-heading">

                            <strong>
                                ${this.esc(data.degree)}
                            </strong>

                            <span>
                                ${this.esc(
                                    data.educationYear
                                )}
                            </span>

                        </div>

                        <div class="generated-resume-item-subtitle">
                            ${this.esc(data.college)}
                        </div>

                    </div>
                `
            );
        }


        /* CERTIFICATION */

        if (
            data.certification ||
            data.certificationIssuer
        ) {

            html += this.section(
                "Certifications",
                `
                    <div class="generated-resume-item">

                        <div class="generated-resume-item-heading">

                            <strong>
                                ${this.esc(
                                    data.certification
                                )}
                            </strong>

                        </div>

                        <div class="generated-resume-item-subtitle">
                            ${this.esc(
                                data.certificationIssuer
                            )}
                        </div>

                    </div>
                `
            );
        }


        html += `
            </div>

            <div class="resume-builder-download-actions">

                <button
                    type="button"
                    id="cpDownloadResumeBtn"
                    class="builder-secondary-btn"
                >
                    ⬇️ Download Resume
                </button>

                <button
                    type="button"
                    id="cpPrintResumeBtn"
                    class="builder-primary-btn"
                >
                    🖨️ Print / Save PDF
                </button>

            </div>
        `;

        this.preview.innerHTML = html;

        this.attachActions();

        this.preview.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    },

    loadSample() {

        const sample = {

            name: "Priyanshu Kumar",

            title:
                "Software Engineer | Data Analytics | Python Developer",

            email:
                "yourname@email.com",

            phone:
                "+91 XXXXX XXXXX",

            location:
                "India",

            github:
                "https://github.com/username",

            linkedin:
                "https://linkedin.com/in/username",

            portfolio:
                "https://yourportfolio.com",

            summary:
                "Computer Science Engineering graduate and aspiring Software Engineer with a strong foundation in Python, Java, SQL, web technologies and machine learning. Experienced in developing practical software and AI projects with a focus on problem solving and clean code.",

            skills:
                "Python, Java, JavaScript, SQL, HTML, CSS, Git, GitHub, FastAPI, REST APIs, React, Node.js, MongoDB, Machine Learning, Scikit-learn, Data Structures, OOP",

            degree:
                "B.Tech in Computer Science and Engineering",

            college:
                "Shershah Engineering College, Sasaram",

            educationYear:
                "2022 - 2026",

            experienceRole:
                "Software Developer Intern",

            experienceCompany:
                "Technology Company",

            experienceDuration:
                "2026",

            experienceDescription:
                "Worked on software development, debugging, API integration, database operations and collaborative development workflows.",

            projectName:
                "CareerPilot AI",

            projectTech:
                "Python, FastAPI, JavaScript, REST API, ATS",

            projectDescription:
                "AI-powered career platform featuring resume analysis, ATS scoring, job matching, skill-gap analysis and personalized learning roadmap generation.",

            projectLink:
                "https://github.com/username/careerpilot-ai",

            certification:
                "Professional Technology Certification",

            certificationIssuer:
                "Online Learning Platform"
        };

        Object.keys(sample).forEach(key => {

            if (this.fields[key]) {
                this.fields[key].value = sample[key];
            }

        });

        this.build();
    },

    attachActions() {

        const download =
            document.getElementById(
                "cpDownloadResumeBtn"
            );

        const print =
            document.getElementById(
                "cpPrintResumeBtn"
            );

        if (download) {

            download.addEventListener(
                "click",
                () => this.download()
            );
        }

        if (print) {

            print.addEventListener(
                "click",
                () => this.print()
            );
        }
    },

    standaloneHTML() {

        const resume =
            this.preview.querySelector(
                ".generated-resume"
            );

        if (!resume) {
            return "";
        }

        return `
<!DOCTYPE html>

<html lang="en">

<head>

<meta charset="UTF-8">

<meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
>

<title>CareerPilot AI Resume</title>

<style>

* {
    box-sizing: border-box;
}

body {
    margin: 0;
    padding: 30px;
    background: #eeeeee;
    font-family: Arial, Helvetica, sans-serif;
    color: #171717;
}

.generated-resume {
    width: min(850px, 100%);
    margin: auto;
    padding: 45px;
    background: #ffffff;
}

.generated-resume-header {
    padding-bottom: 18px;
    margin-bottom: 20px;
    border-bottom: 2px solid #171717;
}

.generated-resume-name {
    margin: 0 0 6px;
    font-size: 28px;
}

.generated-resume-title {
    margin-bottom: 10px;
    color: #4f46e5;
    font-weight: 700;
}

.generated-resume-contact {
    color: #555;
    font-size: 11px;
    line-height: 1.7;
}

.generated-resume-contact a {
    color: #4f46e5;
    text-decoration: none;
}

.generated-resume-section {
    margin-bottom: 20px;
}

.generated-resume-section-title {
    margin: 0 0 9px;
    padding-bottom: 5px;
    border-bottom: 1px solid #ddd;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: .08em;
}

.generated-resume-section p {
    margin: 0;
    font-size: 11px;
    line-height: 1.65;
}

.generated-resume-skills {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.generated-resume-skill {
    padding: 4px 7px;
    border: 1px solid #ddd;
    background: #f7f7f7;
    font-size: 10px;
}

.generated-resume-item {
    margin-bottom: 13px;
}

.generated-resume-item-heading {
    display: flex;
    justify-content: space-between;
    gap: 10px;
}

.generated-resume-item-heading strong {
    font-size: 11px;
}

.generated-resume-item-heading span {
    font-size: 10px;
    color: #666;
}

.generated-resume-item-subtitle {
    margin: 4px 0;
    color: #4f46e5;
    font-size: 10px;
    font-weight: 700;
}

.generated-resume-link {
    color: #4f46e5;
    font-size: 10px;
}

@media print {

    body {
        padding: 0;
        background: #ffffff;
    }

    .generated-resume {
        width: 100%;
    }

    @page {
        size: A4;
        margin: 12mm;
    }
}

</style>

</head>

<body>

${resume.outerHTML}

</body>

</html>
        `;
    },

    download() {

        const html = this.standaloneHTML();

        if (!html) {
            alert("Build your resume first.");
            return;
        }

        const blob = new Blob(
            [html],
            {
                type: "text/html;charset=utf-8"
            }
        );

        const url =
            URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        link.href = url;
        link.download =
            "CareerPilot_AI_Resume.html";

        document.body.appendChild(link);

        link.click();

        link.remove();

        setTimeout(
            () => URL.revokeObjectURL(url),
            1000
        );
    },

    print() {

        const html = this.standaloneHTML();

        if (!html) {
            alert("Build your resume first.");
            return;
        }

        const win =
            window.open("", "_blank");

        if (!win) {
            alert(
                "Please allow pop-ups to print your resume."
            );
            return;
        }

        win.document.open();
        win.document.write(html);
        win.document.close();

        setTimeout(
            () => win.print(),
            500
        );
    },

    init() {

        if (!this.preview) {
            return;
        }

        if (this.buildButton) {

            this.buildButton.addEventListener(
                "click",
                () => this.build()
            );
        }

        if (this.sampleButton) {

            this.sampleButton.addEventListener(
                "click",
                () => this.loadSample()
            );
        }
    }
};

cpResumeBuilder.init();
    });
                        

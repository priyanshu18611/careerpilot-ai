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


});

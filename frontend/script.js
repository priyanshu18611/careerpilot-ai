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

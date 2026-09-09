document.addEventListener("DOMContentLoaded", () => {

    // =========================================
    // API CONFIGURATION
    // =========================================

    const API_BASE_URL =
        window.CAREERPILOT_CONFIG?.API_BASE_URL ||
        "http://127.0.0.1:8000";


    // =========================================
    // DOM ELEMENTS
    // =========================================

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

    const matchedSkills =
        document.getElementById("matchedSkills");

    const missingSkills =
        document.getElementById("missingSkills");

    const suggestionsList =
        document.getElementById("suggestionsList");


    // =========================================
    // OPTIONAL ATS V2 ELEMENTS
    // =========================================

    const skillDiversityScore =
        document.getElementById(
            "skillDiversityScore"
        );

    const achievementScore =
        document.getElementById(
            "achievementScore"
        );

    const priorityKeywords =
        document.getElementById(
            "priorityKeywords"
        );


    // =========================================
    // RESUME UPLOAD
    // =========================================

    if (uploadButton && resumeInput) {

        uploadButton.addEventListener(
            "click",
            () => {

                resumeInput.click();

            }
        );


        resumeInput.addEventListener(
            "change",
            async () => {

                if (!resumeInput.files.length) {
                    return;
                }


                const file =
                    resumeInput.files[0];


                // -----------------------------------------
                // ALLOWED FILE TYPES
                // -----------------------------------------

                const allowedTypes = [
                    "application/pdf",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                ];


                // -----------------------------------------
                // MAX FILE SIZE
                // -----------------------------------------

                const maxSize =
                    10 * 1024 * 1024;


                // -----------------------------------------
                // FILE TYPE CHECK
                // -----------------------------------------

                if (
                    !allowedTypes.includes(
                        file.type
                    )
                ) {

                    alert(
                        "Please upload a PDF or DOCX file."
                    );

                    resumeInput.value = "";

                    return;
                }


                // -----------------------------------------
                // FILE SIZE CHECK
                // -----------------------------------------

                if (
                    file.size > maxSize
                ) {

                    alert(
                        "File size must be less than 10 MB."
                    );

                    resumeInput.value = "";

                    return;
                }


                await analyzeResume(
                    file
                );

            }
        );
    }


    // =========================================
    // ANALYZE RESUME
    // =========================================

    async function analyzeResume(file) {

        if (!uploadButton) {
            return;
        }


        uploadButton.disabled = true;

        uploadButton.textContent =
            "⏳ Analyzing Resume...";


        if (analysisResult) {

            analysisResult.hidden = true;

        }


        try {

            // -----------------------------------------
            // FORM DATA
            // -----------------------------------------

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


            // -----------------------------------------
            // API REQUEST
            // -----------------------------------------

            const response =
                await fetch(
                    `${API_BASE_URL}/api/analyze-resume`,
                    {
                        method: "POST",
                        body: formData
                    }
                );


            // -----------------------------------------
            // READ RESPONSE
            // -----------------------------------------

            const data =
                await response.json();


            // -----------------------------------------
            // API ERROR
            // -----------------------------------------

            if (!response.ok) {

                throw new Error(
                    data.detail ||
                    "Resume analysis failed."
                );

            }


            // -----------------------------------------
            // DISPLAY ANALYSIS
            // -----------------------------------------

            displayAnalysis(
                data.analysis
            );


            uploadButton.textContent =
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


            uploadButton.textContent =
                "Choose Resume";


        } finally {

            uploadButton.disabled = false;

        }
    }


    // =========================================
    // DISPLAY ANALYSIS
    // =========================================

    function displayAnalysis(
        analysis
    ) {

        if (!analysis) {
            return;
        }


        // =========================================
        // MAIN ATS SCORE
        // =========================================

        if (resultScore) {

            resultScore.textContent =
                analysis.ats_score ?? "--";

        }


        // =========================================
        // EXISTING SCORE CARDS
        // =========================================

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


        // =========================================
        // ATS V2 SCORE CARDS
        // =========================================

        if (skillDiversityScore) {

            skillDiversityScore.textContent =
                `${analysis.skill_diversity_score ?? 0}/100`;

        }


        if (achievementScore) {

            achievementScore.textContent =
                `${analysis.achievement_score ?? 0}/100`;

        }


        // =========================================
        // MATCHED SKILLS
        // =========================================

        renderSkills(
            matchedSkills,
            analysis.matched_skills || [],
            "No matching skills found."
        );


        // =========================================
        // MISSING SKILLS
        // =========================================

        renderSkills(
            missingSkills,
            analysis.missing_skills || [],
            "No major missing skills detected."
        );


        // =========================================
        // PRIORITY KEYWORDS
        // =========================================

        renderSkills(
            priorityKeywords,
            analysis.priority_keywords || [],
            "No priority keywords detected."
        );


        // =========================================
        // SUGGESTIONS
        // =========================================

        renderSuggestions(
            analysis.suggestions || []
        );


        // =========================================
        // SHOW RESULT
        // =========================================

        if (analysisResult) {

            analysisResult.hidden = false;


            analysisResult.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    }


    // =========================================
    // RENDER SKILL BADGES
    // =========================================

    function renderSkills(
        container,
        skills,
        emptyMessage
    ) {

        if (!container) {
            return;
        }


        container.innerHTML = "";


        if (!skills.length) {

            const empty =
                document.createElement(
                    "span"
                );


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


    // =========================================
    // RENDER SUGGESTIONS
    // =========================================

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


    // =========================================
    // HERO PRIMARY BUTTONS
    // =========================================

    const primaryButtons =
        document.querySelectorAll(
            ".hero .primary-btn"
        );


    primaryButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    const analyzer =
                        document.getElementById(
                            "analyzer"
                        );


                    if (analyzer) {

                        analyzer.scrollIntoView({
                            behavior: "smooth"
                        });

                    }

                }
            );

        }
    );


    // =========================================
    // SECONDARY BUTTON
    // =========================================

    const secondaryButton =
        document.querySelector(
            ".secondary-btn"
        );


    if (secondaryButton) {

        secondaryButton.addEventListener(
            "click",
            () => {

                const features =
                    document.getElementById(
                        "features"
                    );


                if (features) {

                    features.scrollIntoView({
                        behavior: "smooth"
                    });

                }

            }
        );

    }


    // =========================================
    // NAV ANALYZER BUTTON
    // =========================================

    const navButton =
        document.querySelector(
            ".nav-btn"
        );


    if (navButton) {

        navButton.addEventListener(
            "click",
            () => {

                const analyzer =
                    document.getElementById(
                        "analyzer"
                    );


                if (analyzer) {

                    analyzer.scrollIntoView({
                        behavior: "smooth"
                    });

                }

            }
        );

    }

});

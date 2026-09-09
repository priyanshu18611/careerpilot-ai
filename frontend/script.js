document.addEventListener("DOMContentLoaded", () => {

    // ================================
    // CONFIGURATION
    // ================================

    const API_BASE_URL = "http://127.0.0.1:8000";


    // ================================
    // ELEMENTS
    // ================================

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


    // ================================
    // RESUME UPLOAD
    // ================================

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


                // File validation

                const allowedTypes = [
                    "application/pdf",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                ];


                const maxSize =
                    10 * 1024 * 1024;


                if (!allowedTypes.includes(file.type)) {

                    alert(
                        "Please upload a PDF or DOCX file."
                    );

                    resumeInput.value = "";

                    return;
                }


                if (file.size > maxSize) {

                    alert(
                        "File size must be less than 10 MB."
                    );

                    resumeInput.value = "";

                    return;
                }


                // Start analysis

                await analyzeResume(file);

            }
        );

    }


    // ================================
    // ANALYZE RESUME
    // ================================

    async function analyzeResume(file) {

        uploadButton.disabled = true;

        uploadButton.textContent =
            "⏳ Analyzing Resume...";


        analysisResult.hidden = true;


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


            // Display result

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
                "Please make sure the FastAPI server is running."
            );


            uploadButton.textContent =
                "Choose Resume";


        } finally {

            uploadButton.disabled = false;

        }

    }


    // ================================
    // DISPLAY ANALYSIS
    // ================================

    function displayAnalysis(analysis) {

        if (!analysis) {
            return;
        }


        // Main score

        resultScore.textContent =
            analysis.ats_score ?? "--";


        // Individual scores

        keywordScore.textContent =
            `${analysis.keyword_score ?? 0}/100`;


        lengthScore.textContent =
            `${analysis.length_score ?? 0}/100`;


        sectionScore.textContent =
            `${analysis.section_score ?? 0}/100`;


        // Matched skills

        renderSkills(
            matchedSkills,
            analysis.matched_skills || [],
            "No matching skills found."
        );


        // Missing skills

        renderSkills(
            missingSkills,
            analysis.missing_skills || [],
            "No major missing skills detected."
        );


        // Suggestions

        suggestionsList.innerHTML = "";


        const suggestions =
            analysis.suggestions || [];


        if (suggestions.length === 0) {

            const item =
                document.createElement("li");

            item.textContent =
                "Your resume looks good. Keep improving measurable achievements.";

            suggestionsList.appendChild(
                item
            );

        } else {

            suggestions.forEach(
                (suggestion) => {

                    const item =
                        document.createElement("li");

                    item.textContent =
                        suggestion;

                    suggestionsList.appendChild(
                        item
                    );

                }
            );

        }


        // Show results

        analysisResult.hidden = false;


        analysisResult.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }


    // ================================
    // SKILL BADGES
    // ================================

    function renderSkills(
        container,
        skills,
        emptyMessage
    ) {

        container.innerHTML = "";


        if (!skills.length) {

            const empty =
                document.createElement("span");

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


    // ================================
    // NAVIGATION
    // ================================

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


    // Explore Features

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


    // Navbar Get Started

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

document.addEventListener("DOMContentLoaded", () => {

    const resumeInput = document.getElementById("resumeInput");

    const uploadButton = document.querySelector(
        ".upload-box .primary-btn"
    );

    const analyzeButtons = document.querySelectorAll(
        ".primary-btn"
    );

    const secondaryButton = document.querySelector(
        ".secondary-btn"
    );


    // Resume selection

    if (uploadButton && resumeInput) {

        uploadButton.addEventListener("click", () => {
            resumeInput.click();
        });

        resumeInput.addEventListener("change", () => {

            if (resumeInput.files.length === 0) {
                return;
            }

            const file = resumeInput.files[0];

            const allowedTypes = [
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            ];

            const maxSize = 10 * 1024 * 1024;

            if (!allowedTypes.includes(file.type)) {
                alert("Please upload a PDF, DOC or DOCX file.");
                resumeInput.value = "";
                return;
            }

            if (file.size > maxSize) {
                alert("File size must be less than 10 MB.");
                resumeInput.value = "";
                return;
            }

            uploadButton.textContent = "✓ " + file.name;

            uploadButton.style.background =
                "linear-gradient(135deg, #10b981, #06b6d4)";

        });

    }


    // Main CTA buttons

    analyzeButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const analyzer =
                document.getElementById("analyzer");

            if (analyzer) {
                analyzer.scrollIntoView({
                    behavior: "smooth"
                });
            }

        });

    });


    // Explore Features

    if (secondaryButton) {

        secondaryButton.addEventListener("click", () => {

            const features =
                document.getElementById("features");

            if (features) {
                features.scrollIntoView({
                    behavior: "smooth"
                });
            }

        });

    }


    // Navbar Get Started

    const navButton =
        document.querySelector(".nav-btn");

    if (navButton) {

        navButton.addEventListener("click", () => {

            const analyzer =
                document.getElementById("analyzer");

            if (analyzer) {
                analyzer.scrollIntoView({
                    behavior: "smooth"
                });
            }

        });

    }

});

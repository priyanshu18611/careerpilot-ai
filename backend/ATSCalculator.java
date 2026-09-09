public class ATSCalculator {

    public static int calculateScore(
            String resumeText,
            String jobDescription) {

        if (resumeText == null || jobDescription == null) {
            return 0;
        }

        String resume = resumeText.toLowerCase();
        String job = jobDescription.toLowerCase();

        String[] keywords = {
            "python",
            "java",
            "javascript",
            "sql",
            "html",
            "css",
            "react",
            "fastapi",
            "spring",
            "git",
            "github",
            "rest api",
            "database",
            "machine learning",
            "data structures",
            "algorithms"
        };

        int matched = 0;

        for (String keyword : keywords) {

            if (job.contains(keyword) &&
                resume.contains(keyword)) {

                matched++;
            }
        }

        if (matched == 0) {
            return 0;
        }

        int score =
                (matched * 100) / keywords.length;

        return Math.min(score, 100);
    }


    public static void main(String[] args) {

        String resume =
                "Python Java SQL Git Machine Learning";

        String job =
                "Python SQL Git Machine Learning";

        int score =
                calculateScore(resume, job);

        System.out.println(
                "ATS Score: " + score + "/100"
        );
    }
}

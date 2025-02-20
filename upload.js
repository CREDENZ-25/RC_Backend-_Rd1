const fs = require('fs');
const axios = require('axios');

const API_URL = "http://localhost:5000/api/addProblems"; // Change this if needed

async function uploadQuestions() {
    try {
        // Read JSON file
        const questions = JSON.parse(fs.readFileSync("output.json", "utf8"));

        if (!Array.isArray(questions) || questions.length === 0) {
            console.error("Error: JSON file is empty or not an array.");
            return;
        }

        console.log(`Uploading ${questions.length} questions...`);

        for (let i = 0; i < questions.length; i++) {
            const question = questions[i];

            try {
                const response = await axios.post(API_URL, question, {
                    headers: { "Content-Type": "application/json" }
                });

                console.log(`✅ Uploaded question ${i + 1}/${questions.length}: ${response.data.message}`);
            } catch (err) {
                console.error(`❌ Error uploading question ${i + 1}:`, err.response?.data || err.message);
            }

            // Optional delay to prevent overwhelming the server
            await new Promise(res => setTimeout(res, 100)); 
        }

        console.log("🎉 All questions uploaded successfully!");

    } catch (err) {
        console.error("Error reading JSON file:", err.message);
    }
}

// Run the script
uploadQuestions();

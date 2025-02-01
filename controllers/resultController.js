const Result = require("../models/result");
const Progress = require("../models/Progress");
const authMiddleware = require("../middleware/authMiddleware");

exports.getUserResult = async (req, res) => {
    try {
        const { userId } = req.params;

        // Fetch user progress
        const progressData = await Progress.findAll({ where: { user_id: userId } });

        if (!progressData || progressData.length === 0) {
            return res.status(404).json({ message: "No progress found for this user." });
        }

        // Compute total questions attempted
        const totalQuestions = new Set(progressData.map(q => q.question_id)).size;

        // Compute correct answers (if first or second attempt is true)
        const correctAnswers = progressData.filter(q => q.first_attempt || q.second_attempt).length;

        // Compute total score
        const score = progressData.reduce((acc, q) => acc + (q.marks_for_that_ques || 0), 0);

        // Get streak (latest value)
        const streak = progressData[progressData.length - 1].streak || 0;

        // Save or update the result
        const [result, created] = await Result.findOrCreate({
            where: { user_id: userId },
            defaults: { total_questions: totalQuestions, correct_answers: correctAnswers, score, streak }
        });

        if (!created) {
            await result.update({ total_questions: totalQuestions, correct_answers: correctAnswers, score, streak });
        }

        res.status(200).json({
            message: "Result fetched successfully",
            result
        });

    } catch (error) {
        console.error("Error fetching result:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
const { v4: uuidv4 } = require("uuid");
const Question = require("../models/Question");
const Progress = require("../models/Progress");
const { userQuestionData } = require("../controllers/questionController"); // Import user-specific question data

const updateProgress = async (req, res) => {
  try {
    console.log(req.user);
    // const user_id = req.user.id;
    const { user_id, question_id, user_answer } = req.body;

    console.log("Received Data:", req.body); // Debugging log

    // Validate required fields
    if (!user_id || !question_id || !user_answer) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const parsedQuestionId = parseInt(question_id, 10);
    if (isNaN(parsedQuestionId)) {
      return res.status(400).json({ error: "Invalid question_id format" });
    }

    console.log("Parsed question_id:", parsedQuestionId); // Debugging log

    // Fetch the question
    const question = await Question.findByPk(parsedQuestionId);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    // Check if the answer is correct
    const is_correct = question.answer === user_answer;

    // Check if progress exists for this user
    let progress = await Progress.findOne({ where: { user_id } });

    // If no progress exists, initialize it
    if (!progress) {
      if (!userQuestionData[user_id]) {
        return res.status(400).json({ error: "Questions not initialized for user" });
      }

      progress = await Progress.create({
        user_id,
        question_array: userQuestionData[user_id].questions, // Store user's question array
        current_question_id: userQuestionData[user_id].questions[0], // First question
        start_time: new Date(), // Set start_time when user starts for the first time
        marks: 0,
        streak: 0,
        first_attempt: true,
      });
    }

    let { marks, streak, first_attempt, question_array, current_question_id, start_time } = progress;

    // If the user has not started yet, ensure start_time is set
    if (!start_time) {
      await progress.update({ start_time: new Date() });
    }

    // Track max_streak dynamically (not stored in DB)
    let max_streak = streak;

    // Handle attempts and scoring logic
    first_attempt = true; // Reset for the next question
    if (first_attempt) {
      if (is_correct) {
        marks += 5;
        streak += 1;
      } else {
        marks -= 2;
        streak = 0; // Reset streak on incorrect answer
      }
      first_attempt = false;
    } else {
      if (is_correct) {
        marks += 2;
        streak += 1;
      } else {
        marks -= 2;
        streak = 0;
      }
    }

    // Update max_streak dynamically without storing it
    max_streak = Math.max(max_streak, streak);

    // Find next question
    const currentIndex = question_array.indexOf(parsedQuestionId);
    let next_question_id = null;
    if (currentIndex !== -1 && currentIndex < question_array.length - 1) {
      next_question_id = question_array[currentIndex + 1];
    }

    // Update progress (without saving max_streak)
    await progress.update({
      first_attempt,
      marks,
      streak,
      current_question_id: next_question_id,
    });

    return res.status(200).json({
      message: "Progress updated",
      is_correct,
      marks,
      streak,
      max_streak, // Sent in response but NOT stored in DB
      next_question_id,
    });

  } catch (error) {
    console.error("Error in updateProgress:", error);
    return res.status(500).json({ error: "An error occurred while updating progress" });
  }
};

module.exports = { updateProgress };

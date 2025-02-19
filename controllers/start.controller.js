const Question = require('../models/question.models.js');
const Progress = require('../models/progress.models.js');
const User = require('../models/user.models.js');

const startController = async (req, res) => {
  console.log("hello")
  const currentUserId = req.user.id;
  try {

    const currentUser = await User.findOne({ where: { userid: currentUserId } });
    const is_junior_check = currentUser.is_junior
    const questions = await Question.findAll({ where: { is_junior: is_junior_check }, attributes: ['question_id'] });
    const shuffledQuestions = questions.map(q => q.question_id).sort(() => Math.random() - 0.5);

    if (shuffledQuestions && shuffledQuestions.length == 0) {
      return res.status(404).json({ "message": "No questions found" })
    }

    console.log("Hello")

    const duration = 30 * 60 * 1000;
    const start_time = Date.now();
    const end_time = start_time + duration;
    const timeLeft = end_time - Date.now();

    const existingProgress = await Progress.findOne({ where: { user_id: currentUserId } });

    if (existingProgress) {
      console.log("Hello")
      const counter = existingProgress.counter;
      const QuestionId = existingProgress.question_array[counter];
      const existingProgressFirstQuestion = await Question.findOne({ where: { question_id: QuestionId }, attributes: { exclude: ['answer'] } });
      const timeLeft = existingProgress.end_time - Date.now();
      const doubleStatus = existingProgress.double
      const freezeStatus = existingProgress.freeze;
      const skipStatus = existingProgress.skip;
      const marks = existingProgress.marks;
      return res.status(200).json({ question: existingProgressFirstQuestion, timeLeft: timeLeft, doubleStatus, freezeStatus, skipStatus, marks});
    }
    console.log("Hello")
    const progress = await Progress.create({ user_id: currentUserId, counter: 0, start_time: start_time, end_time: end_time, question_array: shuffledQuestions });
    const firstQuestion = await Question.findOne({
      where: { question_id: shuffledQuestions[0] },
      attributes: { exclude: ['answer'] }
    });

    const doubleStatus = progress.double
    const freezeStatus = progress.freeze;
    const skipStatus = progress.skip;

    return res.status(200).json({ question: firstQuestion, timeLeft: timeLeft, doubleStatus, freezeStatus, skipStatus, marks: 0 });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ "message": "Internal Server Error" });
  }
};

module.exports = { startController };

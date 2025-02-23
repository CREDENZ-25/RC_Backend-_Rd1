const Question = require('../models/question.models');
const Progress = require('../models/progress.models');

const skipController = async (req, res) => {
  const { currentQuestionId } = req.body;
  const currentUserId = req.user.id;

  try {

    const currentUserProgress = await Progress.findOne({ where: { user_id: currentUserId } });

    if (!currentUserProgress) {
      return res.status(400).json({ message: "Progress not found for current user" });
    }
    let doublell = currentUserProgress.double;
    let skipll = currentUserProgress.skip;
    let freezell = currentUserProgress.freeze;
    const currentCounter = currentUserProgress.counter;
    const questionArray = currentUserProgress.question_array;

    if (questionArray[currentCounter] !== currentQuestionId) {
      return res.status(400).json({ "message": "Current question is not same as submited question" });
    }

    if (!currentUserProgress.first_attempt) {
      return res.status(400).json({ "message": "Cannot use lifelines after attempting the question once!" });
    }

    if (skipll === null) {
      return res.status(400).json({ "message": "Skip lifeline not available!" })
    }

    if (skipll) {
      return res.status(400).json({ "message": "Skip lifeline already used!" });
    }

    const timeLeft = currentUserProgress.end_time - Date.now();
    if (timeLeft <= 0) {
      return res.status(400).json({ "message": "Time Up" });
    }

    let { marks, question_array, first_attempt, second_attempt, correct_question_count, counter } = currentUserProgress;
    counter += 1;

    doublell = (doublell === false) ? null : doublell;
    freezell = (freezell === false) ? null : freezell;

    if (counter >= questionArray.length) {
      await Progress.update(
        { marks: marks, streak: 0 },
        { where: { user_id: currentUserId } }
      );
      return res.status(200).json({ message: "🎉 You've successfully solved all the challenges", question: null, timeLeft })
    }

    const updatedProgress = await Progress.update(
      { marks: marks, streak: 0, skip: true, double: doublell, freezell: freezell, counter, first_attempt: true, second_attempt: true }, { where: { user_id: currentUserId } })

    const doubleStatus = doublell;
    const skipStatus = true;
    const freezeStatus = freezell;
    const nextQuestionId = questionArray[counter];
    const nextQuestion = await Question.findOne({ where: { question_id: nextQuestionId }, attributes: { exclude: ['answer'] } });
    return res.status(200).json({ message: "Skip lifeline used successfully", nextQuestion, timeLeft, doubleStatus, skipStatus, freezeStatus, marks: marks, streak: 0, counter});

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { skipController };
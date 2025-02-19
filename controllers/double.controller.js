const Question = require('../models/question.models');
const Progress = require('../models/progress.models');

const doubleController = async (req, res) => {
    const { answer, currentQuestionId } = req.body;
    const currentUserId = req.user.id;

    if (!answer) {
        return res.status(400).json({ "message": "Answer Cannot be Empty" });
    }

    if (!currentQuestionId) {
        return res.status(400).json({ "message": "Please provide question ID" });
    }

    try {

        const currentUserProgress = await Progress.findOne({ where: { user_id: currentUserId } });
        const currentQuestion = await Question.findOne({ where: { question_id: currentQuestionId } });

        if (!currentQuestion) {
            return res.status(400).json({ "message": "Question not found" });
        }

        if (!currentUserProgress) {
            return res.status(400).json({ "message": "Progress not found for current user" });
        }

        const currentCounter = currentUserProgress.counter;
        let doublell = currentUserProgress.double;

        if (!currentUserProgress.first_attempt) {
            return res.status(400).json({ "message": "Cannot use lifelines after attempting the question once!" });
        }

        if (doublell === null) {
            return res.status(400).json({ "message": "Double lifeline not available!" })
        }

        if (currentUserProgress.double) {
            return res.status(400).json({ "message": "Double lifeline already used!" });
        }

        if (currentUserProgress.question_array[currentCounter] !== currentQuestionId) {
            return res.status(400).json({ "message": "Current question is not same as submited question" });
        }


        const timeLeft = currentUserProgress.end_time - Date.now();
        if (timeLeft <= 0) {
            return res.status(400).json({ "message": "Time Up" });
        }

        let { counter, marks, question_array, first_attempt, second_attempt, correct_question_count } = currentUserProgress;
        const correctAnswer = currentQuestion.answer;

        const questionArraySize = currentUserProgress.question_array.length;
        let skipll = currentUserProgress.skip;
        let freezell = currentUserProgress.freeze;

        skipll = (skipll === false) ? null : skipll;
        freezell = (freezell === false) ? null : freezell;
        doublell = true;

        if (correctAnswer !== answer) {

            if (first_attempt === true) {
                await Progress.update(
                    { marks: marks, first_attempt: false, double: true, skip: skipll, freeze: freezell, streak: 0 },
                    { where: { user_id: currentUserId } }
                );
                const sameQuestion = await Question.findOne({
                    where: { question_id: currentQuestionId },
                    attributes: { exclude: ['answer'] }
                });
                return res.status(200).json({ message: "Double Lifeline used, but wrong Answer!", question: sameQuestion, timeLeft, doubleStatus: doublell, skipStatus: skipll, freezeStatus: freezell, marks, streak: 0 });
            }
        }
        else {
            if (first_attempt === true) {
                counter += 1;
                marks += 10;
                correct_question_count += 1;
                if (counter >= questionArraySize) {
                    await Progress.update(
                        { marks: marks + 10, correct_question_count, streak: 0},
                        { where: { user_id: currentUserId } }
                    );
                    return res.status(200).json({ message: "Correct Answer!", question: null, timeLeft })
                }
                const nextQuestionId = question_array[counter];
                const nextQuestion = await Question.findOne({
                    where: { question_id: nextQuestionId },
                    attributes: { exclude: ['answer'] }
                });
                await Progress.update(
                    { marks: marks + 10, counter, double: true, skip: skipll, freeze: freezell, correct_question_count, streak: 0},
                    { where: { user_id: currentUserId } }
                );
                return res.status(200).json({ message: "Correct Answer!", question: nextQuestion, timeLeft, doubleStatus: doublell, skipStatus: skipll, freezeStatus: freezell, marks, streak: 0});
            }
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Double lifeline cannot be implemented for some reason" });
    }
};

module.exports = { doubleController };
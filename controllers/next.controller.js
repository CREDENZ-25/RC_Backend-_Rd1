const Question = require('../models/question.models.js');
const Progress = require('../models/progress.models.js');
const User = require('../models/user.models.js');
const { double } = require('./double.controller.js');

const nextController = async (req, res) => {
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
        let skipll = currentUserProgress.skip;
        let freezell = currentUserProgress.freeze;


        if (currentUserProgress.question_array[currentCounter] !== currentQuestionId) {
            return res.status(400).json({ "message": "Current question is not same as submited question" });
        }

        const timeLeft = currentUserProgress.end_time - Date.now();
        if (timeLeft <= 0) {
            return res.status(400).json({ "message": "Time Up" });
        }

        let { counter, marks, question_array, first_attempt, second_attempt, correct_question_count, streak } = currentUserProgress;
        const correctAnswer = currentQuestion.answer;

        const questionArraySize = currentUserProgress.question_array.length;

        if (correctAnswer !== answer) {

            if (first_attempt === true) {
                await Progress.update(
                    { marks: marks - 2, first_attempt: false },
                    { where: { user_id: currentUserId } }
                );
                const sameQuestion = await Question.findOne({
                    where: { question_id: currentQuestionId },
                    attributes: { exclude: ['answer'] }
                });
                return res.status(200).json({ message: "Wrong Answer!", question: sameQuestion, timeLeft, doubleStatus: doublell, skipStatus: skipll, freezeStatus: freezell });
            }

            else if (second_attempt === true) {
                counter += 1;
                doublell = (doublell === false) ? null: doublell;
                freezell = (freezell === false) ? null: freezell;
                skipll = (skipll === false) ? null: skipll;
                if (counter >= questionArraySize) {
                    await Progress.update(
                        { marks: marks - 2, second_attempt: true, first_attempt: true, streak: 0, },
                        { where: { user_id: currentUserId } }
                    );
                    return res.status(200).json({ message: "Questions Ended!", question: null, timeLeft })
                }
                const nextQuestionId = question_array[counter];
                const nextQuestion = await Question.findOne({
                    where: { question_id: nextQuestionId },
                    attributes: { exclude: ['answer'] }
                });
                await Progress.update(
                    { marks: marks - 2, second_attempt: true, first_attempt: true, counter, streak: 0, skip: skipll, double: doublell, freeze: freezell },
                    { where: { user_id: currentUserId } }
                );
                return res.status(200).json({ message: "Wrong Answer!", question: nextQuestion, timeLeft, doubleStatus: doublell, skipStatus: skipll, freezeStatus: freezell });
            }
        }
        else {
            if (first_attempt === true) {
                counter += 1;
                correct_question_count += 1;
                streak += 1;

                if (streak >= 3 && skipll === null) {
                    skipll = false;
                }
                if (streak >= 4 && freezell === null) {
                    freezell = false;
                }
                if (streak >= 1 && doublell === null) {
                    doublell = false;
                }

                if (counter >= questionArraySize) {
                    await Progress.update(
                        { marks: marks + 5, correct_question_count, streak },
                        { where: { user_id: currentUserId } }
                    );
                    return res.status(200).json({ message: "Questions Ended!", question: null, timeLeft })
                }
                const nextQuestionId = question_array[counter];
                const nextQuestion = await Question.findOne({
                    where: { question_id: nextQuestionId },
                    attributes: { exclude: ['answer'] }
                });
                await Progress.update(
                    { marks: marks + 5, counter, correct_question_count, streak, skip: skipll, double: doublell, freeze: freezell, first_attempt: true, second_attempt: true },
                    { where: { user_id: currentUserId } }
                );
                return res.status(200).json({ message: "Correct Answer!", question: nextQuestion, timeLeft, doubleStatus: doublell, skipStatus: skipll, freezeStatus: freezell });
            }
            else if (second_attempt === true) {
                counter += 1;
                correct_question_count += 1
                streak += 1;

                if (streak >= 3) {
                    skipll = false;
                }
                else if (streak >= 4) {
                    freezell = false;
                }
                else if (streak >= 5) {
                    doublell = false;
                }

                if (counter >= questionArraySize) {
                    await Progress.update(
                        { marks: marks + 5, correct_question_count, streak },
                        { where: { user_id: currentUserId } }
                    );
                    return res.status(200).json({ message: "Question Ended!", question: null, timeLeft })
                }
                const nextQuestionId = question_array[counter];
                const nextQuestion = await Question.findOne({
                    where: { question_id: nextQuestionId },
                    attributes: { exclude: ['answer'] }
                });
                await Progress.update(
                    { marks: marks + 5, first_attempt: true, counter, correct_question_count, streak, streak, skip: skipll, double: doublell, freeze: freezell },
                    { where: { user_id: currentUserId } }
                );
                return res.status(200).json({ message: "Correct Answer!", question: nextQuestion, timeLeft,doubleStatus: doublell, skipStatus: skipll, freezeStatus: freezell });
            }
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { nextController };

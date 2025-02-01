const Question = require('../models/Question');

const userQuestionData = {};

const initializeQuestions = async (req, res) => {
    const { isJunior } = req.body;
    const user_id = req.user.id; // Extract user ID from authenticated user

    if (isJunior === undefined) {
        return res.status(400).json({ error: 'isJunior is required' });
    }

    try {
        const questions = await Question.findAll({
            where: { isJunior },
            attributes: ['question_id'],
        });

        if (questions.length === 0) {
            return res.status(404).json({ error: 'No questions found for this category' });
        }

        const questionIds = questions.map((q) => q.question_id);
        const randomizeIds = questionIds.sort(() => Math.random() - 0.5);

        userQuestionData[user_id] = {
            questions: randomizeIds,
            pointer: 0,
        };

        res.status(200).json({ message: 'Questions initialized', questions: randomizeIds });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while initializing questions' });
    }
};

const getCurrentQuestion = (req, res) => {
    const user_id = req.user.id; // Extract user ID from authenticated user

    if (!userQuestionData[user_id]) {
        return res.status(400).json({ error: 'No initialized questions for this user' });
    }

    const userData = userQuestionData[user_id];
    const currentQuestionId = userData.questions[userData.pointer];

    res.status(200).json({ question_id: currentQuestionId });
};

const nextQuestion = (req, res) => {
    const user_id = req.user.id; // Extract user ID from authenticated user

    if (!userQuestionData[user_id]) {
        return res.status(400).json({ error: 'No initialized questions for this user' });
    }

    const userData = userQuestionData[user_id];

    if (userData.pointer >= userData.questions.length - 1) {
        return res.status(200).json({ message: 'No more questions' });
    }

    userData.pointer += 1;
    res.status(200).json({ next_question_id: userData.questions[userData.pointer] });
};

module.exports = { initializeQuestions, getCurrentQuestion, nextQuestion };
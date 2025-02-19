const Question = require('../models/question.models.js');
const Progress = require('../models/progress.models.js');
const User = require('../models/user.models.js')
const { getLeaderBoard } = require('../controllers/leaderboard.controller.js')

const submitController = async (req, res) => {
    const currentUserId = req.user.id;
    try {
        const currentUser = await User.findOne({ where: { userid: currentUserId }, attributes: { exclude: ['password', 'final_result' ] } });
        const currentUserProgress = await Progress.findOne({ where: { user_id: currentUserId } });

        if (!currentUserProgress) {
            return res.status(400).json({ message: "Progress model not found for current user" });
        }

        const correctQuestionCount = currentUserProgress.correct_question_count;
        const totalAttemptedQuestionCount = (currentUserProgress.counter == 0) ? 1: currentUserProgress.counter;
        const totalQuestionCount = currentUserProgress.question_array.length;
        const accuracy = (correctQuestionCount/totalAttemptedQuestionCount) * 100;
        const score = currentUserProgress.marks;
    
        const { juniorLeaderBoard, seniorLeaderBoard } = await getLeaderBoard();
        const userIsJunior = currentUser.is_junior;

        const leaderboard = userIsJunior ? juniorLeaderBoard : seniorLeaderBoard;
        let rank = findUserRank(leaderboard,currentUserId);

        return res.status(200).json({ "message": "Submission successful", currentUser, correctQuestionCount, totalAttemptedQuestionCount, totalQuestionCount, accuracy, score, rank });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ "message": "Internal server error" });
    }
}


const findUserRank = (leaderboard, userId) => {
    for (let i = 0; i < leaderboard.length; i++) {
        if (leaderboard[i].user_id === userId) {
            return i + 1;
        }
    }
    return null;
};


module.exports = { submitController, findUserRank }
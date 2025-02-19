const { sequelize } = require("../config/db");
const User = require('../models/user.models.js');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const getLeaderBoard = async () => {
    try {
        const query = `
            SELECT 
                p.user_id, 
                u.username, 
                p.marks, 
                EXTRACT(EPOCH FROM (p.updated_at - p.created_at)) AS time_taken,
                u.is_junior
            FROM "Progress" p
            JOIN "Users" u ON p.user_id = u.userid
            ORDER BY p.marks DESC, time_taken ASC;
        `;

        const results = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT });

        const juniorLeaderBoard = results.filter(user => user.is_junior === true);
        const seniorLeaderBoard = results.filter(user => user.is_junior === false);

        return { juniorLeaderBoard, seniorLeaderBoard };
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        throw error;
    }
};

const findUserRank = (leaderboard, userId) => {
    for (let i = 0; i < leaderboard.length; i++) {
        if (leaderboard[i].user_id === userId) {
            return i + 1;
        }
    }
    return null;
};

const leaderBoardController = async (req, res) => {
    try {
        const token = req.cookies.jwt;
        const { juniorLeaderBoard, seniorLeaderBoard } = await getLeaderBoard();
        let juniorRank = null;
        let seniorRank = null;
        let currrentUserId = null
        if (!token) {
            return res.status(200).json({ juniorLeaderBoard, seniorLeaderBoard, juniorRank, seniorRank, currentUser: null });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: "unauthorized user" });
            }

            req.user = user;
        });

        currrentUserId = req.user.id;
        
        currentUser = await User.findOne({ where: { userid: currrentUserId }, attributes: { exclude: ['password', 'final_result'] } });
        const is_junior = currentUser.is_junior;

        if (is_junior === true) {
            juniorRank = await findUserRank(juniorLeaderBoard, currrentUserId);
        }
        else {
            seniorRank = await findUserRank(seniorLeaderBoard, currrentUserId);
        }
        return res.status(200).json({ juniorLeaderBoard, seniorLeaderBoard, juniorRank, seniorRank, currentUser });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { leaderBoardController, getLeaderBoard };
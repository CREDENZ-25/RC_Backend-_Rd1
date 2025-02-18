const { sequelize } = require("../config/db");


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

const leaderBoardController = async (req, res) => {
    try {
        const { juniorLeaderBoard, seniorLeaderBoard } = await getLeaderBoard();
        return res.status(200).json({ juniorLeaderBoard, seniorLeaderBoard });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { leaderBoardController, getLeaderBoard };
// Import necessary models
const { Progress, UserModel } = require('../models');

// 🏆 Get Leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    console.log("Fetching leaderboard data...");

    // Fetch leaderboard data with associated UserModel
    const leaderboard = await Progress.findAll({
      attributes: ['progress_id', 'marks', 'updatedAt'],
      include: [
        {
          model: UserModel,
          as: 'user', // Make sure the alias matches the model association
          attributes: ['team_name'], // Changed from username to team_name since username wasn't defined in UserModel
        }
      ],
      order: [['marks', 'DESC'], ['updatedAt', 'ASC']],
    });

    // Check if the result is empty
    if (leaderboard.length === 0) {
      return res.status(200).json([]);
    }

    // Add ranks to each entry
    const leaderboardWithRanks = leaderboard.map((entry, index) => ({
      id: entry.progress_id,
      team_name: entry.user?.team_name || 'Unknown', // Use optional chaining to avoid crashes
      updated_at: entry.updatedAt,
      marks: entry.marks,
      rank: index + 1,
    }));

    res.status(200).json(leaderboardWithRanks);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
};

// ➕ Add Entry
exports.addEntry = async (req, res) => {
  const { user_id, marks } = req.body;

  try {
    // Verify if the user exists
    const user = await UserModel.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create a new entry in the Progress table
    const newEntry = await Progress.create({
      user_id,
      marks,
    });

    // Respond with success
    res.status(201).json({
      id: newEntry.progress_id,
      team_name: user.team_name,
      marks: newEntry.marks,
      updated_at: newEntry.updatedAt,
    });
  } catch (error) {
    console.error("Error adding entry:", error);
    res.status(500).json({ error: 'Failed to add entry' });
  }
};

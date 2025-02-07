const Leaderboard = require('../models/leaderboard');

exports.getLeaderboard = async (req, res) => {
  try {
    // Fetch all leaderboard entries, ordered by marks DESC and total_time_taken ASC
    const leaderboard = await Leaderboard.findAll({
      order: [
        ['marks', 'DESC'],
        ['total_time_taken', 'ASC'],
      ],
    });

    // Add dynamic ranking
    const leaderboardWithRanks = leaderboard.map((entry, index) => ({
      ...entry.toJSON(),
      rank: index + 1, // Rank starts from 1
    }));

    res.json(leaderboardWithRanks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
};

exports.addEntry = async (req, res) => {
  const { username, marks, start_time, end_time, total_time_taken } = req.body;

  try {
    const newEntry = await Leaderboard.create({
      username,
      marks,
      start_time,
      end_time,
      total_time_taken,
    });

    res.status(201).json(newEntry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add entry' });
  }
};

const Leaderboard = require('../models/leaderboard.js');

exports.getLeaderboard = async (req, res) => {
  try {
    console.log("Fetching leaderboard data...");
    console.log("Database URL:", process.env.DATABASE_URL);
    // Check if the database connection is working
    const count = await Leaderboard.count();
    console.log("Total leaderboard records in DB:", count); // Debugging

    if (count === 0) {
      return res.json([]); // Return empty array if no data
    }
    
    // Fetch data from database
    const leaderboard = await Leaderboard.findAll({
      order: [
        ['marks', 'DESC'],
        ['total_time_taken', 'ASC'],
      ],
    });
    

    console.log("Fetched data:", leaderboard); // Debugging

    // If data exists, format with ranks
    const leaderboardWithRanks = leaderboard.map((entry, index) => ({
      ...entry.toJSON(),
      rank: index + 1,
    }));

    res.json(leaderboardWithRanks);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
};




exports.addEntry = async (req, res) => {
  const { user_id, marks, start_time, end_time, total_time_taken } = req.body;

  try {
    const newEntry = await Leaderboard.create({
      user_id,
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

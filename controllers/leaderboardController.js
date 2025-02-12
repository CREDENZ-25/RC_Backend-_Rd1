
const { Progress, UserModel } = require('../models'); // Import Progress and User models

exports.getLeaderboard = async (req, res) => {
  try {
    console.log("Fetching leaderboard data...");
    console.log("Database URL:", process.env.DATABASE_URL);

    // Check if the database connection is working
    const count = await Progress.count();
    console.log("Total progress records in DB:", count); // Debugging

    if (count === 0) {
      return res.json([]); // Return empty array if no data
    }

    // Fetch data from database, including the associated username
    const leaderboard = await Progress.findAll({
      attributes: ['progress_id', 'marks', 'updatedAt'], // Fetch progress_id, marks, updatedAt
      include: [
        {
          model: UserModel, // Join with User model to get the username
          attributes: ['username'], // Only fetch the username
        }
      ],
      order: [
        ['marks', 'DESC'], // Sort by marks in descending order
        ['updatedAt', 'ASC'], // Optionally, sort by updatedAt in ascending order
      ],
    });

    console.log("Fetched data:", leaderboard); // Debugging

    // If data exists, format with ranks
    const leaderboardWithRanks = leaderboard.map((entry, index) => ({
      id: entry.progress_id, // The ID of the progress entry (this is your "id" for leaderboard)
      username: entry.User.username, // Getting the username from the joined User model
      updated_at: entry.updatedAt, // The time the progress was last updated
      marks: entry.marks, // Marks scored by the user
      rank: index + 1, // Calculate rank based on the order
    }));

    res.json(leaderboardWithRanks); // Send the leaderboard with rank data
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
};
exports.addEntry = async (req, res) => {
  const { user_id, marks } = req.body; // Get user_id and marks from the request body

  try {
    // Fetch the username for the given user_id from the UserModel
    const user = await UserModel.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' }); // Handle case if user is not found
    }

    // Create a new progress entry in the Progress table with only the required fields
    const newEntry = await Progress.create({
      user_id,       // User ID from the request
      marks,         // Marks scored by the user
      updatedAt: new Date(), // Set the current time as updatedAt
    });

    // Respond with the newly created entry, including the username
    res.status(201).json({
      id: newEntry.progress_id,      // The ID of the progress entry
      username: user.username,       // The username from the UserModel
      marks: newEntry.marks,         // Marks scored by the user
      updated_at: newEntry.updatedAt, // Time when the entry was created
    });
  } catch (error) {
    console.error("Error adding entry:", error);
    res.status(500).json({ error: 'Failed to add entry' });
  }
};
//const Leaderboard = require('../models/Progress.js');

// exports.getLeaderboard = async (req, res) => {
//   try {
//     console.log("Fetching leaderboard data...");
//     console.log("Database URL:", process.env.DATABASE_URL);
//     // Check if the database connection is working
//     const count = await Leaderboard.count();
//     console.log("Total leaderboard records in DB:", count); // Debugging

//     if (count === 0) {
//       return res.json([]); // Return empty array if no data
//     }
    
//     // Fetch data from database
//     const leaderboard = await Leaderboard.findAll({
//       order: [
//         ['marks', 'DESC'],
//         ['total_time_taken', 'ASC'],
//       ],
//     });
    

//     console.log("Fetched data:", leaderboard); // Debugging

//     // If data exists, format with ranks
//     const leaderboardWithRanks = leaderboard.map((entry, index) => ({
//       ...entry.toJSON(),
//       rank: index + 1,
//     }));

//     res.json(leaderboardWithRanks);
//   } catch (error) {
//     console.error("Error fetching leaderboard:", error);
//     res.status(500).json({ error: 'Failed to fetch leaderboard' });
//   }
// };
// exports.addEntry = async (req, res) => {
//   const { user_id, marks, start_time, end_time, total_time_taken } = req.body;

//   try {
//     const newEntry = await Leaderboard.create({
//       user_id,
//       marks,
//       start_time,
//       end_time,
//       total_time_taken,
//     });

//     res.status(201).json(newEntry);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to add entry' });
//   }
// };





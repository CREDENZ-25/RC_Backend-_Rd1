const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Leaderboard = sequelize.define('Leaderboard', {
  user_id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
  marks: { type: DataTypes.INTEGER, allowNull: false },
  start_time: { type: DataTypes.DATE, allowNull: false },
  end_time: { type: DataTypes.DATE, allowNull: false },
  total_time_taken: { type: DataTypes.INTEGER, allowNull: true },
}, {
  tableName: 'leaderboard', // Ensure Sequelize looks for the correct table name
  timestamps: false // If you're not using `createdAt` and `updatedAt`
});




// 🛠️ Auto-calculate `total_time_taken` before saving
Leaderboard.beforeCreate((entry) => {
  if (entry.start_time && entry.end_time) {
    entry.total_time_taken = Math.floor((new Date(entry.end_time) - new Date(entry.start_time)) / 1000); // Seconds
  }
});

Leaderboard.beforeUpdate((entry) => {
  if (entry.start_time && entry.end_time) {
    entry.total_time_taken = Math.floor((new Date(entry.end_time) - new Date(entry.start_time)) / 1000);
  }
});

module.exports = Leaderboard;

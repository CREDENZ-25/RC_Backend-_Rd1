const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Leaderboard = sequelize.define('Leaderboard', {
  username: { type: DataTypes.STRING, allowNull: false },
  marks: { type: DataTypes.INTEGER, allowNull: false },
  start_time: { type: DataTypes.DATE, allowNull: false },
  end_time: { type: DataTypes.DATE, allowNull: false },
  total_time_taken: { type: DataTypes.INTEGER, allowNull: false },
  rank: {
    type: DataTypes.VIRTUAL, // Virtual field, not stored in the database
    get() {
      return null; // Placeholder; actual ranking will be added dynamically
    },
  },
});

module.exports = Leaderboard;

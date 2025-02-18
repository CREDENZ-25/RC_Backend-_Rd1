const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Question = sequelize.define('Question', {
  question_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  is_junior: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  question_text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  answer: {
    type: DataTypes.STRING(255),
    allowNull: false,
  }
}, {
  freezeTableName: true,
  timestamps: false,
});

module.exports = Question;

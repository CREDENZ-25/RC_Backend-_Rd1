const { DataTypes } = require('sequelize');
const db = require('../config/db');
const UserModel = require('./User'); 
//const Question = require('./Question'); 

const Progress = db.define('Progress', {
  progress_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: UserModel,
      key: 'user_id',
    },
    onDelete: 'CASCADE',
  },
  question_array: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
  },
  current_question_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  start_time: {
    type: DataTypes.DATE,
    allowNull: true, // Will be null until a question is started
  },
  first_attempt: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  },
  marks: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  lifelines_1: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  lifelines_2: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  lifelines_3: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  streak: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  freezeTableName: true,
  timestamps: true,
});

module.exports = Progress;


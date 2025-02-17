const { DataTypes } = require('sequelize');
const db = require('../config/db');
const UserModel = require('./UserModel'); 
const Question = require('./Question'); 

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
  lifeline_1: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  lifeline_2: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  lifeline_3: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  streak: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  max_streak: {  // Added this line to store max_streak in the DB
    type: DataTypes.INTEGER,
    defaultValue: 0, // Default value for max_streak is 0
  },
}, {
  freezeTableName: true,  
  timestamps: true,
  underscored: true,  
});

module.exports = Progress;

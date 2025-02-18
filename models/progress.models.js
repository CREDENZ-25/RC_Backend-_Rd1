const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db.js");
const  User  = require("./user.models.js")
 
const Progress = sequelize.define('Progress', {
  progress_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,  
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,  
      key: 'userid',
    },
    onDelete: 'CASCADE',  
  },
  question_array: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),  
    allowNull: false,
    defaultValue: [],  
  },
  correct_question_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  counter: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  start_time: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  end_time: {
    type: DataTypes.DATE,
    allowNull: true
  },
  first_attempt: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  },
  second_attempt: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: true
  },
  marks: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  double: {
    type: DataTypes.BOOLEAN,
    defaultValue: null,
  },
  skip: {
    type: DataTypes.BOOLEAN,
    defaultValue: null,
  },
  freeze: {
    type: DataTypes.BOOLEAN,
    defaultValue: null,
  },
  streak: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  freezeTableName: true,  
  timestamps: true,
  underscored: true,  
});

module.exports = Progress;

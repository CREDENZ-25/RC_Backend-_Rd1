const { DataTypes } = require('sequelize');
const db = require('../config/db');

const User = db.define('User', {
  id:{
    type : DataTypes.UUID,
    defaultValue : DataTypes.UUIDV4,
    allowNull : false,
    primaryKey : true,
  },
  email:{
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isJunior: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  finalResult: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
});

module.exports = User;

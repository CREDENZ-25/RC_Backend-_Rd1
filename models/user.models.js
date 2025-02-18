const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db.js");

const User = sequelize.define('User', {
  userid: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  is_junior: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  final_result: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
},
  {
    timestamps: false,
  }
);

module.exports = User;
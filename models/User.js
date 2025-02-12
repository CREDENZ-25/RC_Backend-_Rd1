const { DataTypes } = require('sequelize');
const db = require('../config/db'); // Ensure this correctly initializes Sequelize

const UserModel = db.define('UserModel', {  // Renamed the model to 'UserModel' to avoid conflicts
  user_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,  // Set as the primary key
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,  // Ensuring email is unique
  },
  college_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,  // Ensuring college_id is unique
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  team_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  is_junior: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  final_result: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: true,
  },
}, {
  freezeTableName: true,  // Prevent Sequelize from pluralizing the table name
  timestamps: true,  // Enable createdAt & updatedAt
  createdAt: 'createdAt',  // Explicitly define the createdAt column name
  updatedAt: 'updatedAt',  // Explicitly define the updatedAt column name
});

module.exports = UserModel;

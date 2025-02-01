const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Question = db.define('Question', {
    question_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    question_text: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    answer: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isJunior: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
},{
    tableName: 'questions',
    timestamps: false,
});

module.exports = Question;
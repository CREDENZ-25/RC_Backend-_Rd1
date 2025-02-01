const { DataTypes } = require("sequelize");
const db = require("../config/db");

const Result = db.define("Result", {
    result_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    total_questions: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    correct_answers: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    score: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    streak: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = Result;
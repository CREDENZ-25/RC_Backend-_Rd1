const { Sequelize } = require('sequelize');
require('dotenv').config(); 

const db = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER, 
  process.env.DB_PASSWORD, 
  {
    host: process.env.DB_HOST, 
    dialect: 'postgres', 
    port: process.env.DB_PORT, 
    logging: false,
  }
);

// Test database connection
const testDB = async () => {
  try {
    await db.authenticate();
    console.log("✅ Database connection successful!");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
};

testDB();

module.exports = db;


const { Sequelize } = require('sequelize');
require('dotenv').config(); 

const db = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER, 
  process.env.DB_PASSWORD, 
  {
    host: process.env.DB_HOST, 
    dialect: 'postgres', 
    protocol : 'postgres',
    port: process.env.DB_PORT || 5432, 
    logging: false,
  }
);
db
  .authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.log('Error: ' + err));

module.exports = db;

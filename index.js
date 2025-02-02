const express = require('express');
const db = require('./config/db.js');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const cors = require('cors');
require('dotenv').config();
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/login', authRoutes);
app.use('/leaderboard', leaderboardRoutes);  // Correct way to handle routes

// Start the server
const start = async () => {
  console.log("Testing the database connection..");
  try {
    await db.authenticate();
    await db.sync({ alter: true });
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error.original);
  }
};

// Sync database and start server
db
  .sync()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch(err => console.log('Database sync error: ' + err));

start();

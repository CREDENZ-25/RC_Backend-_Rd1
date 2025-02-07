const express = require('express');
const dotenv = require('dotenv');
const db = require('./config/db.js');
const cors = require('cors');
const bodyParser = require('body-parser');

const authMiddleware = require("./middlewares/authMiddleware"); 
const resultRoutes = require("./routes/resultRoutes"); 
const authRoutes = require('./routes/authRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const questionRoutes = require("./routes/questionRoutes.js");

require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/final", resultRoutes);
app.use('/auth', authRoutes);
app.use('/leaderboard', leaderboardRoutes);

//questions
app.use("/questions", questionRoutes);


// Start the server
const initApp = async () => {
  console.log("Testing the database connection..");
  try {
    await db.authenticate();
    await db.sync({ alter: true }); // Ensure tables are updated
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error.original);
  }
};

initApp();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

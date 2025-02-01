const express = require('express');

const dotenv = require('dotenv');

const db = require('./config/db.js');

const authMiddleware = require("./middlewares/authMiddleware"); // Fixed path

const resultRoutes = require("./routes/resultRoutes"); // Import result routes

require('dotenv').config();



const app = express();



// Middleware

app.use(express.json());

app.use(express.urlencoded({ extended: true }));



// Routes

app.use("/api/results", resultRoutes); // Add result routes



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

const express = require('express');
const dotenv = require('dotenv');
const db = require('./config/db.js');
const authMiddleware = require("./middlewares/authMiddleware"); // Fixed path
const resultRoutes = require("./routes/resultRoutes"); // Import result routes
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/results", resultRoutes); // Add result routes

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
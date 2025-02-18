const express = require('express');
const { sequelize } = require('./config/db.js'); // Correct import
const authRoutes = require('./routes/auth.routes.js');
const apiRoutes = require('./routes/api.routes.js');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

//Models
const Progress = require('./models/progress.models.js')
const Question = require('./models/question.models.js')
// Routes
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log("Testing the database connection...");
    await sequelize.authenticate(); 
    await sequelize.sync({ alter: true });
    console.log("✅ Database connected successfully.");

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Unable to connect to the database:", error.message);
    process.exit(1);
  }
};

startServer();

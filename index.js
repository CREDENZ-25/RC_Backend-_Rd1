const express = require('express');
const { sequelize } = require('./config/db.js');
const authRoutes = require('./routes/auth.routes.js');
const apiRoutes = require('./routes/api.routes.js');
const authMiddleware = require('./middlewares/auth.middleware.js');
const { startController } = require('./controllers/start.controller.js');
const { nextController } = require('./controllers/next.controller.js');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const router = express.Router();

const startLimiter = rateLimit({
  windowMs: 5 * 1000,
  max: 1,
  message: '⚠️ You can only make one request every 5 seconds. Please slow down!',
  standardHeaders: true,
  legacyHeaders: false,
});

const allowedOrigins = [
  'https://credenz.co.in',
  /^https:\/\/.*\.credenz\.co\.in$/,
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.some(allowedOrigin => 
      typeof allowedOrigin === 'string' 
        ? origin === allowedOrigin 
        : allowedOrigin.test(origin)
    )) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With', 
    'Accept', 
    'Origin', 
    'X-CSRF-Token'
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: true,
  maxAge: 86400,  // 24 hours
  preflightContinue: false,
  optionsSuccessStatus: 204
};


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser());

const Progress = require('./models/progress.models.js');
const Question = require('./models/question.models.js');

router.get('/protected/start', authMiddleware, startLimiter, startController);
router.post('/protected/next', authMiddleware, startLimiter, nextController);

app.use('/auth', authRoutes);
app.use('/api', apiRoutes);
app.use('/', router);

app.get('/', (req, res) => {
  res.send('Server is up and running!');
});


const PORT = process.env.PORT || 3000;
const startServer = async () => {
  try {
    console.log("Testing the database connection...");
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("Database connected successfully.");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error.message);
    process.exit(1);
  }
};

startServer();

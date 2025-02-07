const express = require('express');
const {
    initializeQuestions,
    getCurrentQuestion, 
    nextQuestion,
} = require('../controllers/questionController');
const authMiddleware = require('../middlewares/authMiddleware'); // Import authentication middleware

const router = express.Router();

// Apply authMiddleware to protect all routes
router.post('/initialize', authMiddleware, initializeQuestions);
router.get('/current', authMiddleware, getCurrentQuestion);
router.get('/next', authMiddleware, nextQuestion);

module.exports = router;
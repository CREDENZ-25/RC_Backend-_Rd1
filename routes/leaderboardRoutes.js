const express = require('express');
const { getLeaderboard, addEntry } = require('../controllers/leaderboardController');
const router = express.Router();

router.get('/', getLeaderboard);
router.post('/', addEntry);

module.exports = router;

const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware.js');
const { startController } = require('../controllers/start.controller.js');
const { nextController } = require('../controllers/next.controller.js');
const { submitController } = require('../controllers/submit.controller.js');
const { leaderBoardController } = require('../controllers/leaderboard.controller.js');
const { doubleController } = require('../controllers/double.controller.js');
const { skipController } = require('../controllers/skip.contoller.js');
const { freezeController } = require('../controllers/freeze.controller.js');

const router = express.Router();

router.get('/submit', authMiddleware, submitController);
router.get('/leaderboard', leaderBoardController);
router.post('/double-lifeline', authMiddleware, doubleController);
router.post('/skip-lifeline', authMiddleware, skipController);
router.get('/increase-timer-lifeline', authMiddleware, freezeController);


module.exports = router;  
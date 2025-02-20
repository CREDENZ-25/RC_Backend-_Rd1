const express = require('express');
const { login } = require('../controllers/auth.controller.js');
const { logout } = require('../controllers/auth.controller.js');

const router = express.Router();

router.post('/login', login);
router.get('/logout', logout);

module.exports = router;  
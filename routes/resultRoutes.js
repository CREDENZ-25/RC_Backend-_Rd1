const express = require("express");
const router = express.Router();
const resultController = require("../controllers/resultController");

// Apply authMiddleware to all routes
router.get("/:userId", authMiddleware, resultController.getUserResult);

module.exports = router;
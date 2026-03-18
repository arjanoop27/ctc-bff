const express = require("express");
const authMiddleware = require("../middleware/auth");
const {getProgress} = require("../controllers/progress.controller");

const router = express.Router();

router.get('/', authMiddleware, getProgress);

module.exports = router;

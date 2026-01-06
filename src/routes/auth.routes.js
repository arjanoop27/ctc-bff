const express = require("express");
const validate = require("../middleware/validate");
const {
    register,
    registerSchema,
} = require("../controllers/auth.controller");
const { login, loginSchema } = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth");
const { me } = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", authMiddleware, me);


module.exports = router;

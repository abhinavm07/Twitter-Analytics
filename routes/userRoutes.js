const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  geolocation, forgotPassword,
} = require("../controllers/userController");
const { getTwtData } = require("../controllers/userData");
const { protect } = require("../middleware/authMiddleware");

router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.post("/twtUser", getTwtData);
router.post("/resetPassword", forgotPassword);

module.exports = router;

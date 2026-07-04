const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const { getUserById } = require("../controllers/userController");

// Logged in user profile
router.get("/profile", auth, (req, res) => {
  res.json({
    message: "Protected Route Accessed",
    user: req.user,
  });
});

// Get user by ID (Chat Header)
router.get("/:id", auth, getUserById);

module.exports = router;
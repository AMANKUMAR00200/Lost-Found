const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");

const {
  getNotifications,
  markRead,
  deleteNotification,
} = require("../controllers/notificationController");

router.get("/", auth, getNotifications);

router.put("/read/:id", auth, markRead);

router.delete("/:id", auth, deleteNotification);

module.exports = router;
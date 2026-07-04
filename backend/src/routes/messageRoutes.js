const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  sendMessage,
  getMessages,
  deleteChat,
  deleteForMe,
  deleteForEveryone,
  blockUser,
  unblockUser,
  getBlockStatus,
  reportUser,
  getChatList,
  markAsSeen,
} = require("../controllers/messageController");

// ===============================
// Chat List
// ===============================
router.get("/chat-list", authMiddleware, getChatList);

// ===============================
// Send Message
// ===============================
router.post("/", authMiddleware, sendMessage);

// ===============================
// Get Messages
// ===============================
router.get("/:receiverId", authMiddleware, getMessages);

// ===============================
// Seen Messages
// ===============================
router.put("/seen/:receiverId", authMiddleware, markAsSeen);

// ===============================
// Delete For Me
// ===============================
router.delete(
  "/delete/me/:messageId",
  authMiddleware,
  deleteForMe
);

// ===============================
// Delete Entire Chat
// ===============================
router.delete(
  "/chat/:receiverId",
  authMiddleware,
  deleteChat
);

// ===============================
// Delete For Everyone
// ===============================
router.delete(
  "/delete/everyone/:messageId",
  authMiddleware,
  deleteForEveryone
);

// ===============================
// Block User
// ===============================
router.post("/block", authMiddleware, blockUser);

// ===============================
// Unblock User
// ===============================
router.post("/unblock", authMiddleware, unblockUser);

// ===============================
// Check Block Status
// ===============================
router.get(
  "/block-status/:userId",
  authMiddleware,
  getBlockStatus
);

// ===============================
// Report User
// ===============================
router.post("/report", authMiddleware, reportUser);

module.exports = router;
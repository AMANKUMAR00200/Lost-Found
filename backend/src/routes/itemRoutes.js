const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createItem,
  getItems,
  getMyItems,
  getItemById,
  updateItem,
  deleteItem,
} = require("../controllers/itemController");



router.get("/", getItems);

router.post("/", authMiddleware, createItem);

router.get("/my", authMiddleware, getMyItems);

router.get("/:id", getItemById);

router.put("/:id", authMiddleware, updateItem);

router.delete("/:id", authMiddleware, deleteItem);

module.exports = router;
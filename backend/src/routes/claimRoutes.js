const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  claimItem,
  getMyClaims,
} = require("../controllers/claimController");

router.post("/", authMiddleware, claimItem);

router.get("/my", authMiddleware, getMyClaims);

module.exports = router;
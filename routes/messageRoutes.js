const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getConversation,
  getRecentMessages,
} = require("../controllers/messageController");
const { verifyToken } = require("../middlewares/authMiddleware");

const upload = require("../middlewares/uploadMiddleware");

router.post("/send", verifyToken, upload.single("file"), sendMessage);
router.get("/conversation/:userId", verifyToken, getConversation);
router.get("/recent", verifyToken, getRecentMessages);

module.exports = router;

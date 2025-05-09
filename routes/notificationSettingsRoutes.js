// routes/notificationSettingsRoutes.js
const express = require("express");
const router = express.Router();
const {
  getSettings,
  updateSettings,
} = require("../controllers/notificationSettingsController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.get("/", verifyToken, getSettings);
router.put("/", verifyToken, updateSettings);

module.exports = router;

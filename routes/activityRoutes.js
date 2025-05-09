const express = require("express");
const { getUserActivities } = require("../controllers/activityController");
const { verifyToken } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/user-activities", verifyToken, getUserActivities);

module.exports = router;

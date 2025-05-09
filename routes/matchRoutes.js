const express = require("express");
const router = express.Router();
const { searchManufacturers } = require("../controllers/matchController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.get("/manufacturers", verifyToken, searchManufacturers);

module.exports = router;

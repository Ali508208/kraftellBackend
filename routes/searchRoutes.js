const express = require("express");
const router = express.Router();
const { discoverManufacturers } = require("../controllers/searchController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.get("/discover", verifyToken, discoverManufacturers);

module.exports = router;

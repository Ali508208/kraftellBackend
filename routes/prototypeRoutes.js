const express = require("express");
const router = express.Router();
const {
  createPrototypeRequest,
  getRequestsForUser,
  respondToPrototype,
} = require("../controllers/prototypeController");
const { verifyToken } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

router.post(
  "/request",
  verifyToken,
  upload.single("designFile"),
  createPrototypeRequest
);
router.get("/my-requests", verifyToken, getRequestsForUser);
router.post(
  "/respond",
  verifyToken,
  upload.single("designFile"),
  respondToPrototype
);

module.exports = router;

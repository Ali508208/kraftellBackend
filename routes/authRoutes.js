const express = require("express");
const router = express.Router();
const {
  register,
  login,
  updateProfile,
  updatePassword,
  getUserProfile,
  getManufacturers,
  getBuyers,
} = require("../controllers/authController");
const { verifyToken } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

router.post(
  "/register",
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "portfolio", maxCount: 1 },
  ]),
  register
);
router.post("/login", login);

router.put(
  "/update-profile",
  verifyToken,
  upload.fields([
    { name: "portfolio", maxCount: 1 },
    { name: "documents", maxCount: 10 }, // ← allow multiple documents
  ]),
  updateProfile
);
router.put("/update-password", verifyToken, updatePassword);

router.get("/manufacturers", verifyToken, getManufacturers);
router.get("/buyers", verifyToken, getBuyers);
router.get("/me", verifyToken, getUserProfile);
router.get("/:id", verifyToken, getUserProfile);

module.exports = router;

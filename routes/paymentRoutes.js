const express = require("express");
const router = express.Router();
const {
  createPaymentIntent,
  releasePayment,
  markPaymentAsPaid,
  getMyPayments,
} = require("../controllers/paymentController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.post("/create-intent", verifyToken, createPaymentIntent);
router.post("/mark-paid", markPaymentAsPaid); // Called by Stripe webhook
router.post("/release", verifyToken, releasePayment);
router.get("/my-payments", verifyToken, getMyPayments);

module.exports = router;

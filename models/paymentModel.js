const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  manufacturer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: Number,
  status: {
    type: String,
    enum: ["pending", "paid", "released"],
    default: "pending",
  },
  milestone: {
    type: String,
    enum: ["prototype", "final"],
    required: true,
  },
  stripePaymentIntentId: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", paymentSchema);

// models/notificationSettingsModel.js
const mongoose = require("mongoose");

const notificationSettingsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  prototypeFeedback: { type: Boolean, default: true },
  paymentRequests: { type: Boolean, default: true },
  orderStatusUpdates: { type: Boolean, default: true },
  // Add more toggles as needed
});

module.exports = mongoose.model(
  "NotificationSettings",
  notificationSettingsSchema
);

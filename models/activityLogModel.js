const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  type: { type: String, default: "info" },
  icon: { type: String }, // Optional: to help the frontend choose the icon
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ActivityLog", activityLogSchema);

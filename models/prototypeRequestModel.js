const mongoose = require("mongoose");

const revisionSchema = new mongoose.Schema({
  message: String,
  file: String,
  date: { type: Date, default: Date.now },
  by: String, // 'buyer' or 'seller'
});

const prototypeRequestSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  manufacturer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  designFile: String,
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "revision_requested"],
    default: "pending",
  },
  revisions: [revisionSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PrototypeRequest", prototypeRequestSchema);

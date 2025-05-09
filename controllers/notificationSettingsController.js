// controllers/notificationSettingsController.js
const NotificationSettings = require("../models/notificationSettingsModel");
const { logActivity } = require("./activityController");

exports.getSettings = async (req, res) => {
  try {
    let settings = await NotificationSettings.findOne({ user: req.user.id });
    if (!settings) {
      settings = await NotificationSettings.create({ user: req.user.id }); // auto create default
    }
    res.json(settings);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to load settings", error: err.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const updated = await NotificationSettings.findOneAndUpdate(
      { user: req.user.id },
      { $set: req.body },
      { new: true, upsert: true }
    );
    await logActivity(
      req.user.id,
      "Updated notification settings",
      "bell",
      "info"
    );
    res.json(updated);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update settings", error: err.message });
  }
};

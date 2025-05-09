const ActivityLog = require("../models/activityLogModel");

exports.logActivity = async (userId, title, icon = "", type = "info") => {
  try {
    await ActivityLog.create({
      user: userId,
      title,
      icon,
      type,
    });
  } catch (err) {
    console.error("Activity log error:", err.message);
  }
};

exports.getUserActivities = async (req, res) => {
  try {
    const activities = await ActivityLog.find({ user: req.user.id })
      .sort({ date: -1 })
      .limit(6);

    res.json(activities);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch activities", error: err.message });
  }
};

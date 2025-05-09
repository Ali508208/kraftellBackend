const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { registerSchema } = require("../utils/validate");
const { logActivity } = require("./activityController");

exports.register = async (req, res) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const existing = await User.findOne({ email: req.body.email });
    if (existing)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      ...req.body,
      password: hashedPassword,
      role: req.body.role,
      profilePicture:
        req.files?.profilePicture?.map((f) => `/uploads/${f.filename}`) || [],
      portfolio:
        req.files?.portfolio?.map((f) => `/uploads/${f.filename}`) || [],
    });

    await user.save();
    await logActivity(user._id, "Registered new account", "user-plus", "info");

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    // Validate password
    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    // Update last login time
    user.lastLogin = new Date();
    await user.save();
    await logActivity(user._id, "Logged in", "sign-in", "security");

    // Create JWT with 2-day expiration
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );

    // Send token and user info (safe fields only)
    res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// controllers/authController.js
exports.updateProfile = async (req, res) => {
  try {
    const updateData = req.body;

    // Handle single file upload for portfolio
    if (req.files?.portfolio?.length) {
      updateData.$push = {
        portfolio: `/uploads/${req.files.portfolio[0].filename}`,
      };
    }

    // Handle multiple document uploads
    if (req.files?.documents?.length) {
      const documentPaths = req.files.documents.map(
        (file) => `/uploads/${file.filename}`
      );
      updateData.$push = updateData.$push || {};
      updateData.$push.documents = { $each: documentPaths };
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
    });
    await logActivity(req.user.id, "Updated profile", "user", "action");

    res.json({ message: "Profile updated", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect current password" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    // ✅ Log this activity
    await logActivity(user._id, "Password changed", "lock", "security");

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    // Add displayName logic
    let displayName = "";
    if (user.role === "buyer") {
      displayName = user.companyType;
    } else if (user.role === "manufacture") {
      displayName = user.brandName;
    }

    res.json({ ...user.toObject(), displayName });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching profile", error: err.message });
  }
};
exports.getManufacturers = async (req, res) => {
  try {
    const manufacturers = await User.find({ role: "manufacture" }).select();
    res.json(manufacturers); // This will always return an array
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to load manufacturers", error: err.message });
  }
};

exports.getBuyers = async (req, res) => {
  try {
    const manufacturers = await User.find({ role: "buyer" }).select();
    res.json(manufacturers); // This will always return an array
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to load manufacturers", error: err.message });
  }
};

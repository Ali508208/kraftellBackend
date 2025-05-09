const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { port, db } = require("./config/config");
const authRoutes = require("./routes/authRoutes");
const matchRoutes = require("./routes/matchRoutes");
const searchRoutes = require("./routes/searchRoutes");
const prototypeRoutes = require("./routes/prototypeRoutes");
const messageRoutes = require("./routes/messageRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const activityRoutes = require("./routes/activityRoutes");
const notificationSettingsRoutes = require("./routes/notificationSettingsRoutes");

const cors = require("cors");

dotenv.config();

const app = express();

// Middleware
app.use(cors());

// Then apply JSON/body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/prototypes", prototypeRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/notifications", notificationSettingsRoutes);

// Connect to Database
mongoose
  .connect(db)
  .then(() => console.log("Database connected"))
  .catch((err) => console.log("Database connection error:", err));

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

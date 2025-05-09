require("dotenv").config();

module.exports = {
  db: process.env.MONGO_URI, // MongoDB URI
  jwtSecret: process.env.JWT_SECRET, // JWT secret
  port: process.env.PORT || 5000, // Port for the server
};

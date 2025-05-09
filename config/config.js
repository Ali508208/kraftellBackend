require("dotenv").config();

module.exports = {
  db: process.env.MONGO_URI, // MongoDB URI
  jwtSecret: process.env.JWT_SECRET, // JWT secret
  stripkey: process.env.STRIPE_SECRET_KEY,
  port: process.env.PORT || 5000, // Port for the server
};

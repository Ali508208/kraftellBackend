const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ["buyer", "manufacture"], required: true },
    profilePicture: [String],
    brandName: String, // For manufacture
    companyType: String, // For buyers
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    location: String,
    lastLogin: {
      type: Date,
      default: null,
    },
    phoneNumber: [String],
    productCategories: [String], // For buyers
    manufacturingCapabilities: {
      productTypes: [String],
      materials: [String],
      processes: [String],
    },
    certifications: [String],
    portfolio: [String], // File URLs or links
    documents: [String],
  },
  { timestamps: true }
);

// Add comparePassword method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);

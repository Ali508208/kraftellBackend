const User = require("../models/userModel");

exports.matchManufacturers = async ({ productType, location, process }) => {
  const query = {
    role: "seller",
    "manufacturingCapabilities.productTypes": {
      $regex: productType,
      $options: "i",
    },
    "manufacturingCapabilities.processes": { $regex: process, $options: "i" },
    location: { $regex: location, $options: "i" },
  };

  const results = await User.find(query);

  // Basic Relevance Scoring
  const scoredResults = results.map((manufacturer) => {
    let score = 0;
    if (
      manufacturer.manufacturingCapabilities.productTypes.includes(productType)
    )
      score += 2;
    if (manufacturer.manufacturingCapabilities.processes.includes(process))
      score += 2;
    if (manufacturer.location.toLowerCase() === location.toLowerCase())
      score += 1;

    return { manufacturer, score };
  });

  return scoredResults.sort((a, b) => b.score - a.score);
};

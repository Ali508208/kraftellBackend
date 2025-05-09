const { matchManufacturers } = require("../services/matchingService");

exports.searchManufacturers = async (req, res) => {
  try {
    const { productType, location, process } = req.query;

    const matches = await matchManufacturers({
      productType,
      location,
      process,
    });

    res.json(
      matches.map((m) => ({
        id: m.manufacturer._id,
        companyName: m.manufacturer.companyName,
        location: m.manufacturer.location,
        capabilities: m.manufacturer.manufacturingCapabilities,
        score: m.score,
      }))
    );
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Error during manufacturer search",
        error: err.message,
      });
  }
};

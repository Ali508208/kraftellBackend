const User = require("../models/userModel");

exports.discoverManufacturers = async (req, res) => {
  try {
    const { productType, location, process } = req.query;

    const filter = { role: "seller" };

    if (productType) {
      filter["manufacturingCapabilities.productTypes"] = {
        $regex: productType,
        $options: "i",
      };
    }
    if (process) {
      filter["manufacturingCapabilities.processes"] = {
        $regex: process,
        $options: "i",
      };
    }
    if (location) {
      filter["location"] = { $regex: location, $options: "i" };
    }

    const manufacturers = await User.find(filter).select(
      "_id companyName location manufacturingCapabilities"
    );

    res.json(
      manufacturers.map((m) => ({
        id: m._id,
        companyName: m.companyName,
        location: m.location,
        productTypes: m.manufacturingCapabilities.productTypes,
        processes: m.manufacturingCapabilities.processes,
        profileUrl: `/api/users/${m._id}`,
      }))
    );
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error during discovery search", error: err.message });
  }
};

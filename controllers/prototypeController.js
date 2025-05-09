const PrototypeRequest = require("../models/prototypeRequestModel");

exports.createPrototypeRequest = async (req, res) => {
  try {
    const { manufacturerId, description } = req.body;

    // Validate fields
    if (!manufacturerId || !description) {
      return res
        .status(400)
        .json({ message: "manufacturerId and description are required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Design file is required" });
    }

    const request = new PrototypeRequest({
      buyer: req.user.id,
      manufacturer: manufacturerId,
      description,
      designFile: `/uploads/${req.file.filename}`,
    });

    await request.save();
    res.json({ message: "Prototype request sent", request });
  } catch (err) {
    console.error("Prototype Request Error:", err);
    res.status(500).json({
      message: "Error creating prototype request",
      error: err.message,
    });
  }
};

exports.getRequestsForUser = async (req, res) => {
  try {
    const roleField = req.user.role === "buyer" ? "buyer" : "manufacturer";
    const requests = await PrototypeRequest.find({ [roleField]: req.user.id })
      .populate("buyer", "companyName email")
      .populate("manufacturer", "companyName email");

    res.json(requests);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching requests", error: err.message });
  }
};

exports.respondToPrototype = async (req, res) => {
  try {
    const { requestId, message, status } = req.body;

    const request = await PrototypeRequest.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (req.file) {
      request.revisions.push({
        message,
        file: `/uploads/${req.file.filename}`,
        by: req.user.role,
      });
    } else {
      request.revisions.push({ message, by: req.user.role });
    }

    if (status) request.status = status;

    await request.save();
    res.json({ message: "Response recorded", request });
  } catch (err) {
    res.status(500).json({
      message: "Error updating prototype request",
      error: err.message,
    });
  }
};

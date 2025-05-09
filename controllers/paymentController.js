require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Payment = require("../models/paymentModel");

exports.createPaymentIntent = async (req, res) => {
  try {
    const { manufacturerId, amount, milestone } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // convert to cents
      currency: "eur",
      payment_method_types: ["card"],
    });

    const payment = new Payment({
      buyer: req.user.id,
      manufacturer: manufacturerId,
      amount,
      milestone,
      stripePaymentIntentId: paymentIntent.id,
    });

    await payment.save();

    res.json({
      clientSecret: paymentIntent.client_secret,
      message: "Payment intent created",
    });
  } catch (err) {
    res.status(500).json({ message: "Payment failed", error: err.message });
  }
};

exports.releasePayment = async (req, res) => {
  try {
    const { paymentId } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    if (payment.status !== "paid") {
      return res.status(400).json({ message: "Cannot release unpaid payment" });
    }

    payment.status = "released";
    await payment.save();

    // Normally, here you'd trigger a real transfer via Stripe Connect
    res.json({ message: "Payment released to manufacturer" });
  } catch (err) {
    res.status(500).json({ message: "Release failed", error: err.message });
  }
};

exports.markPaymentAsPaid = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    const payment = await Payment.findOne({
      stripePaymentIntentId: paymentIntentId,
    });
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    payment.status = "paid";
    await payment.save();

    res.json({ message: "Payment marked as paid" });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

exports.getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({
      $or: [{ buyer: req.user.id }, { manufacturer: req.user.id }],
    });

    res.json(payments);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to load payments", error: err.message });
  }
};

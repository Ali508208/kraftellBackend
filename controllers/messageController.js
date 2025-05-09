const Message = require("../models/messageModel");

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;

    const message = new Message({
      sender: req.user.id,
      receiver: receiverId,
      text,
      file: req.file ? `/uploads/${req.file.filename}` : null,
    });

    await message.save();
    res.json({ message: "Message sent", data: message });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to send message", error: err.message });
  }
};

exports.getConversation = async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: userId },
        { sender: userId, receiver: req.user.id },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender", "companyName")
      .populate("receiver", "brandName");

    res.json(messages);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to load conversation", error: err.message });
  }
};

exports.getRecentMessages = async (req, res) => {
  try {
    const messages = await Message.find({ sender: req.user.id })
      .sort({ createdAt: -1 })
      .limit(3)
      .populate("receiver", "brandName");

    res.json(messages);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to load recent messages", error: err.message });
  }
};

import Message from "../models/messageModel.js";

export const getMessages = async (req, res, next) => {
  try {
    const user1 = req.userId;
    const user2 = req.body.id;

    // ✅ Fixed: || should be && (AND not OR)
    if (!user1 || !user2) {
      return res.status(400).send("Both user IDs are required.");
    }

    // ✅ Fixed: timestamp not timeStamp
    // ✅ Added populate for sender and recipient
    const messages = await Message.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 },
      ],
    })
      .populate("sender", "id email firstName lastName picture color")
      .populate("recipient", "id email firstName lastName picture color")
      .sort({ timestamp: 1 });

    return res.status(200).json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).send("Internal server error.");
  }
};

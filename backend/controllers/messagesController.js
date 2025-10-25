import Message from "../models/messageModel.js";
import { mkdirSync, renameSync } from "fs";

export const getMessages = async (req, res, next) => {
  try {
    const user1 = req.userId;
    const user2 = req.body.id;

    if (!user1 || !user2) {
      return res.status(400).send("Both user IDs are required.");
    }

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

export const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).send("File is required.");
    }

    const date = Date.now();
    // FIX 1: Add forward slash in path
    const fileDir = `uploads/files/${date}`;
    const fileName = `${fileDir}/${req.file.originalname}`;

    // Create directory if it doesn't exist
    mkdirSync(fileDir, { recursive: true });

    // Move file from temp to permanent location
    renameSync(req.file.path, fileName);

    // FIX 2: Return correct filePath (without uploads/ prefix since static middleware handles it)
    return res.status(200).json({ filePath: fileName });
  } catch (error) {
    console.error("Error uploading file:", error);
    return res.status(500).send("Internal server error.");
  }
};

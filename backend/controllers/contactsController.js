import mongoose from "mongoose";
import User from "../models/userModel.js";
import Message from "../models/messageModel.js"; // ✅ Import Message model

export const searchContacts = async (req, res, next) => {
  try {
    const { searchTerm } = req.body;

    if (searchTerm === undefined || searchTerm === null) {
      return res.status(400).send("searchTerm is required.");
    }

    const sanitizedSearchTerm = searchTerm.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    const regex = new RegExp(sanitizedSearchTerm, "i");

    const contacts = await User.find({
      $and: [
        { _id: { $ne: req.userId } },
        { $or: [{ firstName: regex }, { lastName: regex }, { email: regex }] },
      ],
    });

    return res.status(200).json({ contacts });
  } catch (error) {
    console.error("Search contacts error:", error);
    return res.status(500).send("Internal server error.");
  }
};

export const getContactsForDmLists = async (req, res, next) => {
  try {
    let { userId } = req;
    userId = new mongoose.Types.ObjectId(userId);

    // ✅ Fixed: Use Message.aggregate() not mongoose.Aggregate()
    const contacts = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { recipient: userId }],
        },
      },
      {
        $sort: { timestamp: -1 }, // ✅ Fixed: timestamp not lastMessageTime
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$sender", userId] }, // ✅ Fixed: Added quotes to $sender
              then: "$recipient",
              else: "$sender",
            },
          },
          lastMessageTime: { $first: "$timestamp" },
        },
      },
      {
        $lookup: {
          from: "users", // ✅ Collection name correct
          localField: "_id",
          foreignField: "_id",
          as: "contactInfo",
        },
      },
      {
        $unwind: "$contactInfo",
      },
      {
        $project: {
          _id: 1,
          lastMessageTime: 1,
          email: "$contactInfo.email",
          firstName: "$contactInfo.firstName",
          lastName: "$contactInfo.lastName",
          picture: "$contactInfo.picture",
          color: "$contactInfo.color",
        },
      },
      {
        $sort: { lastMessageTime: -1 }, // ✅ Sort by most recent message
      },
    ]);

    return res.status(200).json({ contacts });
  } catch (error) {
    console.error("Get contacts for DM error:", error);
    return res.status(500).send("Internal server error.");
  }
};

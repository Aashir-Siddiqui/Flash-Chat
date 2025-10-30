import User from "../models/userModel.js";
import Channel from "../models/channelModel.js";
import mongoose from "mongoose";

export const createChannel = async (req, res, next) => {
  try {
    const { name, members } = req.body;
    const userId = req.userId;

    if (!name || !members || members.length === 0) {
      return res.status(400).send("Channel name and members are required.");
    }

    const admin = await User.findById(userId);
    if (!admin) {
      return res.status(400).send("Admin user not found.");
    }

    const validMembers = await User.find({ _id: { $in: members } });

    if (validMembers.length !== members.length) {
      return res.status(400).send("Some members are not valid users.");
    }

    const newChannel = new Channel({
      name,
      members,
      admin: userId,
    });

    await newChannel.save();

    return res.status(201).json({ channel: newChannel });
  } catch (error) {
    console.error("Create channel error:", error);
    return res.status(500).send("Internal server error.");
  }
};

export const getUserChannels = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);

    const channels = await Channel.find({
      $or: [{ admin: userId }, { members: userId }],
    }).sort({ updatedAt: -1 });

    return res.status(200).json({ channels });
  } catch (error) {
    console.error("Get user channels error:", error);
    return res.status(500).send("Internal server error.");
  }
};

export const getChannelMessages = async (req, res, next) => {
  try {
    const { channelId } = req.params;
    const userId = req.userId;

    const channel = await Channel.findById(channelId);

    if (!channel) {
      return res.status(404).send("Channel not found.");
    }

    const isMember = channel.members.some(
      (memberId) => memberId.toString() === userId
    );
    const isAdmin = Array.isArray(channel.admin)
      ? channel.admin.some((adminId) => adminId.toString() === userId)
      : channel.admin.toString() === userId;

    if (!isMember && !isAdmin) {
      return res.status(403).send("Access denied.");
    }

    const messages = await channel.populate({
      path: "messages",
      populate: {
        path: "sender",
        select: "id email firstName lastName picture color",
      },
    });

    return res.status(200).json({ messages: messages.messages || [] });
  } catch (error) {
    console.error("Get channel messages error:", error);
    return res.status(500).send("Internal server error.");
  }
};

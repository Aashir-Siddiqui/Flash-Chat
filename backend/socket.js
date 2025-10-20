import { Server as SocketIoServer } from "socket.io"; // ✅ Fixed typo: SockerIoServer -> SocketIoServer
import Message from "./models/messageModel.js";

const setupSocket = (server) => {
  // ✅ Fixed typo: setupScoket -> setupSocket
  const io = new SocketIoServer(server, {
    cors: {
      origin: process.env.ORIGIN, // ✅ Fixed typo: OTIGIN -> ORIGIN
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const userSocketMap = new Map();

  const disconnect = (socket) => {
    console.log(`Client Disconnect: ${socket.id}`);
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  };

  const sendMessage = async (message) => {
    const senderSocketId = userSocketMap.get(message.sender);
    const recipientSocketId = userSocketMap.get(message.recipient);

    const createMessage = await Message.create(message);

    const messageData = await Message.findById(createMessage._id)
      .populate("sender", "id email firstName lastName picture color")
      .populate("recipient", "id email firstName lastName picture color");

    if (recipientSocketId) {
      io.to(recipientSocketId).emit("recieveMessage", messageData);
    }

    if (senderSocketId) {
      io.to(senderSocketId).emit("recieveMessage", messageData);
    }
  };

  io.on("connection", (socket) => {
    // ✅ Fixed typo: connections -> connection
    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User Connected: ${userId} with Socket Id ${socket.id}`);
    } else {
      console.log("No User ID provided during connection"); // ✅ Fixed message
    }

    socket.on("sendMessage", sendMessage);
    socket.on("disconnect", () => disconnect(socket));
  });
};

export default setupSocket; // ✅ Fixed export name

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoute.js";
import contactsRoutes from "./routes/contactsRoute.js";
import setupSocket from "./socket.js";
import messagesRoutes from "./routes/messagesRoute.js";
import channelRoutes from "./routes/channelRoute.js";

dotenv.config();

const app = express();
const databaseURL = process.env.MONGODB_URL;
const PORT = process.env.PORT || 3000;

mongoose
  .connect(databaseURL)
  .then(() => {
    console.log("MongoDB connection successful.");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

app.use(
  cors({
    origin: process.env.ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/channel", channelRoutes);

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

setupSocket(server);

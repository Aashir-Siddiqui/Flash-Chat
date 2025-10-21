import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoute.js";
import contactsRoutes from "./routes/contactsRoute.js";
import setupSocket from "./socket.js"; // ✅ Fixed typo: setupScoket -> setupSocket
import messagesRoutes from "./routes/messagesRoute.js";

dotenv.config();

const app = express();
const databaseURL = process.env.MONGODB_URL;
const PORT = process.env.PORT || 3000;

// --- DATABASE CONNECTION LOGIC ---
mongoose
  .connect(databaseURL)
  .then(() => {
    console.log("MongoDB connection successful.");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

// --- MIDDLEWARE SETUP ---
app.use(
  cors({
    origin: process.env.ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use("/uploads/profiles", express.static("uploads/profiles"));

app.use(express.json());
app.use(cookieParser());

// --- ROUTES ---
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/messages", messagesRoutes)

// --- SERVER START ---
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

setupSocket(server); // ✅ Fixed function name

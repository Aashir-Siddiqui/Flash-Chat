import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { compare } from "bcrypt";
import { renameSync, unlinkSync } from "fs";

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPassword = (password) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        msg: "Email and password are required",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        msg: "Please provide a valid email address",
      });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({
        msg: "Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character (@$!%*?&)",
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        msg: "An account with this email already exists",
      });
    }

    const user = await User.create({
      email: email.toLowerCase().trim(),
      password,
    });

    res.cookie("jwt", createToken(email, user._id), {
      maxAge,
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        msg: "An account with this email already exists",
      });
    }

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        msg: messages.join(", "),
      });
    }

    res.status(500).json({ msg: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        msg: "Email and password are required",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        msg: "Please provide a valid email address",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        msg: "Invalid email or password",
      });
    }

    const auth = await compare(password, user.password);
    if (!auth) {
      return res.status(401).json({
        msg: "Invalid email or password",
      });
    }

    res.cookie("jwt", createToken(email, user._id), {
      maxAge,
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });

    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        picture: user.picture,
        color: user.color,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const getUserInfo = async (req, res) => {
  try {
    const userData = await User.findById(req.userId).select("-password");

    if (!userData) {
      return res.status(404).send("User not found");
    }

    res.status(200).json({
      id: userData._id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      picture: userData.picture,
      color: userData.color,
    });
  } catch (error) {
    console.error("Error getting user info:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { firstName, lastName, color } = req.body;

    if (!firstName || !lastName) {
      return res.status(400).json({
        msg: "First name and last name are required",
      });
    }

    if (firstName.trim().length < 2 || lastName.trim().length < 2) {
      return res.status(400).json({
        msg: "First name and last name must be at least 2 characters long",
      });
    }

    const userData = await User.findByIdAndUpdate(
      userId,
      {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        color: color || 0,
        profileSetup: true,
      },
      { new: true, runValidators: true }
    ).select("-password");
    if (!userData) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({
      id: userData._id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      picture: userData.picture,
      color: userData.color,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const addProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("File is required.");
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(req.file.mimetype)) {
      unlinkSync(req.file.path);
      return res.status(400).json({
        msg: "Only JPEG, PNG, and WebP images are allowed",
      });
    }

    if (req.file.size > 5 * 1024 * 1024) {
      unlinkSync(req.file.path);
      return res.status(400).json({
        msg: "Image size must be less than 5MB",
      });
    }

    const date = Date.now();
    let fileName = "uploads/profiles/" + date + req.file.originalname;
    renameSync(req.file.path, fileName);

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { picture: fileName },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({
      picture: updatedUser.picture,
    });
  } catch (error) {
    console.error("Error updating image:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const removeProfileImage = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (user.picture) {
      try {
        unlinkSync(user.picture);
      } catch (err) {
        console.error("Error deleting file:", err);
      }
    }

    await User.findByIdAndUpdate(
      userId,
      { picture: null },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Profile image removed successfully",
      picture: null,
    });
  } catch (error) {
    console.error("Error removing profile image:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const logOut = (req, res) => {
  try {
    res.cookie("jwt", "", {
      maxAge: 1,
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    return res.status(200).send("Logout successfully.");
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

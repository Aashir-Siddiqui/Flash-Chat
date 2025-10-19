import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { compare } from "bcrypt";
import { renameSync, unlinkSync } from "fs";

const maxAge = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds

const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
};

export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }
    const user = await User.create({ email, password });
    res.cookie("jwt", createToken(email, user._id), {
      maxAge,
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
    console.log("Signup Error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "Invalid email or password" });
    }
    const auth = await compare(password, user.password);
    if (!auth) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }
    res.cookie("jwt", createToken(email, user._id), {
      maxAge,
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
    console.log("Login Error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const getUserInfo = async (req, res) => {
  try {
    const userData = await User.findById(req.userId);
    console.log("Fetched user data:", userData);

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
    console.log("Error getting user info:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const { firstName, lastName, color } = req.body;
    if (!firstName || !lastName) {
      return res.status(400).send("FirstName LastName and Color is required.");
    }

    const userData = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        color,
        profileSetup: true,
      },
      { new: true, runValidators: true }
    );

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
    console.log("Error updating profile:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const addProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("File is required.");
    }

    const date = Date.now();
    // FIX: Proper path with forward slash
    let fileName = "uploads/profiles/" + date + req.file.originalname;
    renameSync(req.file.path, fileName);

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { picture: fileName },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({
      picture: updatedUser.picture,
    });
  } catch (error) {
    console.log("Error updating image:", error);
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

    // Delete the old image file if it exists
    if (user.picture) {
      try {
        unlinkSync(user.picture);
      } catch (err) {
        console.error("Error deleting file:", err);
      }
    }

    // Update user to remove picture
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { picture: null },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Profile image removed successfully",
      picture: null,
    });
  } catch (error) {
    console.log("Error removing profile image:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const logOut = (req, res) => {
  try {
    res.cookie("jwt", "", {maxAge:1, secure:true, sameSite:"None"})
    return res.status(200).send("Logout Successfully.")
  } catch (error) {
    console.log("Error removing profile image:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

import jwt from "jsonwebtoken";
import User from "../models/userModel.js"; // PATH FIXED: Changed to use correct file name userModel.js
import { compare } from "bcrypt";

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
    console.log(error);
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
    console.log(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const getUserInfo = async (req, res) => {
  try {
    console.log(req.userId);
    // res.status(200).json({
    //   user: {
    //     id: user.id,
    //     email: user.email,
    //     profileSetup: user.profileSetup,
    //     firstName: user.firstName,
    //     lastName: user.lastName,
    //     picture: user.picture,
    //     color: user.color,
    //   },
    // });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

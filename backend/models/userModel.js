import { genSalt, hash } from "bcrypt";
import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    firstName: { type: String, required: false, trim: true },
    lastName: { type: String, required: false, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (email) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },
        message: "Please provide a valid email address",
      },
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "Password must be at least 8 characters long"],
      validate: {
        validator: function (password) {
          const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
          return passwordRegex.test(password);
        },
        message:
          "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character (@$!%*?&)",
      },
    },
    picture: { type: String },
    color: { type: Number, required: false, default: 0 },
    profileSetup: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await genSalt(12);
    this.password = await hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.index({ email: 1 });

export default mongoose.model("User", userSchema);

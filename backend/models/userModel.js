import { genSalt, hash } from "bcrypt";
import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  // FIX 1: firstName/lastName ko optional kiya taake signup mein sirf username/email/password ka use ho sake.
  firstName: { type: String, required: false }, // Optional
  lastName: { type: String, required: false }, // Optional
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  picture: { type: String },
  color: { type: Number, required: false },
  profileSetup: { type: Boolean, default: false },
});

// Password hashing middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Only hash if password field is modified

  const salt = await genSalt();
  this.password = await hash(this.password, salt);
  next();
});

export default mongoose.model("User", userSchema);

import { genSalt, hash } from "bcrypt";
import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  // FIX: firstName aur lastName ko required: false kiya
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  picture: { type: String },
  color: { type: Number, required: false },
  profileSetup: { type: Boolean, default: false },
});

// Password hashing middleware
userSchema.pre("save", async function (next) {
  // FIX: sirf tab hash karo jab password modify ho raha ho
  if (!this.isModified("password")) return next();

  const salt = await genSalt();
  this.password = await hash(this.password, salt);
  next();
});

export default mongoose.model("User", userSchema);

import mongoose from "mongoose";

// User schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false, // because Google users won’t have password
  },
  googleId: {
    type: String,
  }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
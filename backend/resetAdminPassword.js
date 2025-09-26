import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;

async function resetPassword() {
  await mongoose.connect(MONGO_URI);

  const email = "admin@example.com";
  const newPassword = "admin123";

  const hashed = await bcrypt.hash(newPassword, 10);

  const user = await User.findOneAndUpdate(
    { email },
    { password: hashed },
    { new: true }
  );

  if (user) {
    console.log("Password reset successful for", email);
  } else {
    console.log("Admin user not found");
  }

  await mongoose.disconnect();
}

resetPassword();

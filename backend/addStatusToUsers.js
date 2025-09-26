import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;

async function addStatusToUsers() {
  await mongoose.connect(MONGO_URI);
  const result = await User.updateMany(
    { status: { $exists: false } },
    { $set: { status: "active" } }
  );
  console.log("Users updated:", result.modifiedCount);
  await mongoose.disconnect();
}

addStatusToUsers();

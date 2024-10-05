import { connect } from "mongoose";

import { MONGO_URI } from "./environment.js";
import User from "../schemas/user.schema.js";

export default async function connectDB() {
  try {
    await connect(MONGO_URI);
    console.log("MongoDB connected successfully");
    await registerModels();

    // validate if

    const user = new User({
      name: "Administrator",
      email: "administrator@uflow.com",
      avatar: "https://i.imgur.com/dM7Thhn.png",
    });
    await user.save();

    console.log(user.email); // 'bill@initech.com'
    return true;
  } catch (error) {
    console.log(`MongoDB not connected. Error: ${error}`);
    return false;
  }
}

/**
 * Optional: In this method u can import all models in order to force register collections in database
 */
async function registerModels() {
  await import("../schemas/user.schema.js");
}

import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true }, // Google
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  avatarUrl: { type: String }, // URL iconito Google
  semesters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Semester" }],
  role: {
    type: String,
    enum: ["student", "admin", "professor"],
    default: "student",
  },
  password: { type: String, required: true },
  notificationToken: { type: String, unique: true, sparse: true },
});

const User = mongoose.model("User", UserSchema);

export default User;

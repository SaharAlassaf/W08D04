const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 20,
  },
  password: { type: String, required: true, minlength: 8, trim: true },
  avatar: {
    type: String,
    default:
      "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg",
  },
  role: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
  isDel: { type: Boolean, required: true, default: false },
  resetLink: { type: String, default: "" },
});

module.exports = mongoose.model("User", userSchema);

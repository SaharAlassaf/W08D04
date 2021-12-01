
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  img: { type: String, required: true },
  desc: { type: String, required: true, default: false },
  postDate: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  likes: { type: mongoose.Schema.Types.ObjectId, ref: "Like" },
  isDel: { type: Boolean, required: true, default: false },
});

module.exports = mongoose.model("Post", postSchema);

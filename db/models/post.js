const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  img: { type: String, required: true },
  desc: { type: String, required: true },
  postDate: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  isDel: { type: Boolean, required: true, default: false },
});

module.exports = mongoose.model("Post", postSchema);

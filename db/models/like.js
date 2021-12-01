const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
  isLiked: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
});

module.exports = mongoose.model("Like", likeSchema);
